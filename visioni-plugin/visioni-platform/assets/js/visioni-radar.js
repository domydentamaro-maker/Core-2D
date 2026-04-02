(function () {
  if (typeof window === "undefined") return;

  const cfg = window.VisioniRadarConfig || {};
  const app = document.getElementById("visioni-radar-wizard");
  const mapEl = document.getElementById("visioni-radar-map");
  const resultsEl = document.getElementById("visioni-radar-results");
  if (!app || !resultsEl) return;

  const storageKey = "visioni_radar_profile";
  const notifiedKey = "visioni_radar_notified";

  const state = {
    step: 1,
    profile: {
      nome: "",
      email: "",
      telefono: "",
      buyerType: "acquirente",
      intent: "prima_casa",
      tipologia: "appartamento",
      vaniMin: 1,
      vaniMax: 6,
      budgetMin: 50000,
      budgetMax: 1000000,
      pianoMin: 0,
      garage: "no",
      zone: [],
      raggioKm: 20,
      raggioAlert: 200,
      fasciaDalle: "08:00",
      fasciaAlle: "21:00",
      gdpr: false,
      lat: null,
      lng: null,
    },
    immobili: [],
  };

  const steps = {
    1: renderStep1,
    2: renderStep2,
    3: renderStep3,
    4: renderStep4,
  };

  function saveProfile() {
    localStorage.setItem(storageKey, JSON.stringify(state.profile));
  }

  function loadProfile() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      state.profile = Object.assign({}, state.profile, parsed || {});
    } catch (e) {
      console.warn("Radar profile load failed", e);
    }
  }

  function getNotifiedMap() {
    try {
      return JSON.parse(localStorage.getItem(notifiedKey) || "{}");
    } catch (_) {
      return {};
    }
  }

  function setNotified(postId) {
    const map = getNotifiedMap();
    map[String(postId)] = Date.now();
    localStorage.setItem(notifiedKey, JSON.stringify(map));
  }

  function wasRecentlyNotified(postId) {
    const map = getNotifiedMap();
    const ts = map[String(postId)] || 0;
    return Date.now() - ts < 24 * 60 * 60 * 1000;
  }

  function api(path, method, body) {
    return fetch((cfg.apiBase || "") + path, {
      method: method || "GET",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": cfg.nonce || "",
      },
      body: body ? JSON.stringify(body) : undefined,
    }).then((r) => {
      if (!r.ok) throw new Error("Request failed");
      return r.json();
    });
  }

  function nextStep() {
    state.step = Math.min(4, state.step + 1);
    render();
  }

  function prevStep() {
    state.step = Math.max(1, state.step - 1);
    render();
  }

  function setField(key, value) {
    state.profile[key] = value;
    saveProfile();
  }

  function calculateDistance(lat1, lng1, lat2, lng2) {
    const toRad = (n) => (n * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  function findCompatibleImmobili(position, profile, immobili) {
    const alertKm = Number(profile.raggioAlert || 0) / 1000;
    return (immobili || []).filter((item) => {
      if (!item || !item.lat || !item.lng) return false;
      const distance = calculateDistance(position.lat, position.lng, Number(item.lat), Number(item.lng));
      if (alertKm > 0 && distance > alertKm) return false;
      if (profile.tipologia && item.tipologia !== profile.tipologia) return false;
      if (Number(item.vani || 0) > 0) {
        if (Number(profile.vaniMin || 0) > Number(item.vani || 0)) return false;
        if (Number(profile.vaniMax || 0) > 0 && Number(item.vani || 0) > Number(profile.vaniMax || 0)) return false;
      }
      if (Number(item.prezzo || 0) > 0) {
        if (Number(profile.budgetMin || 0) > Number(item.prezzo || 0)) return false;
        if (Number(profile.budgetMax || 0) > 0 && Number(item.prezzo || 0) > Number(profile.budgetMax || 0)) return false;
      }
      if (wasRecentlyNotified(item.id)) return false;
      return true;
    });
  }

  function triggerNotification(immobile) {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const n = new Notification("2D Radar", {
      body: `Nuovo immobile compatibile: ${immobile.titolo}`,
      icon: immobile.foto || "",
      data: { url: immobile.url || "/" },
    });
    n.onclick = function () {
      window.open((immobile && immobile.url) || "/", "_blank");
    };
    setNotified(immobile.id);
  }

  function initRadar() {
    if (!navigator.geolocation) {
      alert("Geolocalizzazione non disponibile su questo dispositivo.");
      return Promise.reject(new Error("No geolocation"));
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setField("lat", lat);
          setField("lng", lng);
          resolve({ lat, lng });
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  function watchPosition() {
    if (!navigator.geolocation) return;
    navigator.geolocation.watchPosition(
      async (pos) => {
        const current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setField("lat", current.lat);
        setField("lng", current.lng);

        const compatibili = findCompatibleImmobili(current, state.profile, state.immobili);
        compatibili.slice(0, 2).forEach(triggerNotification);
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 10000 }
    );
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    const swUrl = cfg.swUrl;
    if (!swUrl) return;
    navigator.serviceWorker.register(swUrl).catch(() => {});
  }

  function renderResults() {
    const items = state.immobili || [];
    if (!items.length) {
      resultsEl.innerHTML = '<p class="visioni-radar-empty">Nessun immobile compatibile al momento.</p>';
      return;
    }

    const html = items
      .slice(0, 12)
      .map((item) => {
        return `
          <article class="visioni-radar-card">
            <h4>${escapeHtml(item.titolo || "Immobile")}</h4>
            <p>${escapeHtml(item.zona || "")}</p>
            <p><strong>Prezzo:</strong> ${formatPrice(item.prezzo)}</p>
            <a href="${escapeAttr(item.url || "#")}" target="_blank" rel="noopener">Apri scheda</a>
          </article>
        `;
      })
      .join("");

    resultsEl.innerHTML = `<div class="visioni-radar-grid">${html}</div>`;
  }

  function renderMap() {
    if (!mapEl) return;
    if (!cfg.mapsEnabled || !window.google || !window.google.maps) {
      mapEl.innerHTML = '<p class="visioni-radar-map-fallback">Mappa disponibile dopo configurazione Google Maps API Key nel plugin.</p>';
      return;
    }

    const center = {
      lat: Number(state.profile.lat || 41.117143),
      lng: Number(state.profile.lng || 16.871871),
    };

    const map = new window.google.maps.Map(mapEl, {
      center,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
    });

    new window.google.maps.Circle({
      strokeColor: "#2563eb",
      strokeOpacity: 0.7,
      strokeWeight: 1,
      fillColor: "#60a5fa",
      fillOpacity: 0.2,
      map,
      center,
      radius: Number(state.profile.raggioAlert || 200),
    });

    (state.immobili || []).forEach((item) => {
      const marker = new window.google.maps.Marker({
        map,
        position: { lat: Number(item.lat), lng: Number(item.lng) },
        title: item.titolo,
      });
      const infowindow = new window.google.maps.InfoWindow({
        content: `<div><strong>${escapeHtml(item.titolo || "Immobile")}</strong><br/>${escapeHtml(item.zona || "")}<br/><a href="${escapeAttr(item.url || "#")}" target="_blank">Apri</a></div>`,
      });
      marker.addListener("click", () => infowindow.open({ anchor: marker, map }));
    });
  }

  async function loadImmobili() {
    const params = new URLSearchParams();
    Object.keys(state.profile).forEach((key) => {
      const val = state.profile[key];
      if (val === null || val === undefined || val === "") return;
      if (Array.isArray(val)) {
        val.forEach((entry) => params.append("zone[]", entry));
      } else {
        params.set(key, String(val));
      }
    });

    const data = await api(`/radar/immobili?${params.toString()}`, "GET");
    state.immobili = (data && data.immobili) || [];
    renderResults();
    renderMap();
  }

  async function submitProfile() {
    if (!state.profile.gdpr) {
      alert("Devi accettare il consenso privacy per attivare il Radar.");
      return;
    }

    await initRadar();

    const data = await api("/radar/profiles", "POST", state.profile);
    if (!data || !data.ok) throw new Error("Profilo non salvato");

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    registerServiceWorker();
    await loadImmobili();
    watchPosition();

    app.innerHTML = '<div class="visioni-radar-success">Radar attivato con successo. Riceverai alert quando sei vicino a immobili compatibili.</div>';
  }

  function bindCommonNav() {
    const prev = app.querySelector("[data-prev]");
    const next = app.querySelector("[data-next]");
    if (prev) prev.addEventListener("click", prevStep);
    if (next) next.addEventListener("click", nextStep);
  }

  function renderStep1() {
    app.innerHTML = `
      <div class="visioni-radar-step">
        <h3>Step 1 - Chi sei e cosa cerchi</h3>
        <label>Nome<input id="radar_nome" value="${escapeAttr(state.profile.nome)}" /></label>
        <label>Email<input id="radar_email" type="email" value="${escapeAttr(state.profile.email)}" /></label>
        <label>Telefono<input id="radar_telefono" value="${escapeAttr(state.profile.telefono)}" /></label>
        <div class="visioni-radar-actions"><button data-next>Avanti</button></div>
      </div>
    `;

    app.querySelector("#radar_nome").addEventListener("input", (e) => setField("nome", e.target.value));
    app.querySelector("#radar_email").addEventListener("input", (e) => setField("email", e.target.value));
    app.querySelector("#radar_telefono").addEventListener("input", (e) => setField("telefono", e.target.value));
    bindCommonNav();
  }

  function renderStep2() {
    app.innerHTML = `
      <div class="visioni-radar-step">
        <h3>Step 2 - Criteri immobile</h3>
        <label>Tipologia
          <select id="radar_tipologia">
            <option value="appartamento">Appartamento</option>
            <option value="villa">Villa</option>
            <option value="commerciale">Commerciale</option>
            <option value="terreno">Terreno</option>
            <option value="operazione">Operazione</option>
          </select>
        </label>
        <label>Vani min<input id="radar_vanimin" type="number" min="1" max="10" value="${escapeAttr(state.profile.vaniMin)}" /></label>
        <label>Vani max<input id="radar_vanimax" type="number" min="1" max="10" value="${escapeAttr(state.profile.vaniMax)}" /></label>
        <label>Budget min<input id="radar_budgetmin" type="number" min="0" value="${escapeAttr(state.profile.budgetMin)}" /></label>
        <label>Budget max<input id="radar_budgetmax" type="number" min="0" value="${escapeAttr(state.profile.budgetMax)}" /></label>
        <div class="visioni-radar-actions"><button data-prev>Indietro</button><button data-next>Avanti</button></div>
      </div>
    `;

    app.querySelector("#radar_tipologia").value = state.profile.tipologia;
    app.querySelector("#radar_tipologia").addEventListener("change", (e) => setField("tipologia", e.target.value));
    app.querySelector("#radar_vanimin").addEventListener("input", (e) => setField("vaniMin", Number(e.target.value || 0)));
    app.querySelector("#radar_vanimax").addEventListener("input", (e) => setField("vaniMax", Number(e.target.value || 0)));
    app.querySelector("#radar_budgetmin").addEventListener("input", (e) => setField("budgetMin", Number(e.target.value || 0)));
    app.querySelector("#radar_budgetmax").addEventListener("input", (e) => setField("budgetMax", Number(e.target.value || 0)));
    bindCommonNav();
  }

  function renderStep3() {
    const quartieri = (cfg.quartieri || []).map((q) => `<label><input type="checkbox" value="${escapeAttr(q)}" ${state.profile.zone.includes(q) ? "checked" : ""}/> ${escapeHtml(q)}</label>`).join("");

    app.innerHTML = `
      <div class="visioni-radar-step">
        <h3>Step 3 - Zone</h3>
        <div id="radar_zone" class="visioni-radar-zone-grid">${quartieri}</div>
        <label>Raggio km<input id="radar_raggio" type="range" min="1" max="20" value="${escapeAttr(state.profile.raggioKm)}" /><span id="radar_raggio_lbl">${escapeHtml(String(state.profile.raggioKm))} km</span></label>
        <div class="visioni-radar-actions"><button data-prev>Indietro</button><button data-next>Avanti</button></div>
      </div>
    `;

    app.querySelectorAll("#radar_zone input[type='checkbox']").forEach((el) => {
      el.addEventListener("change", () => {
        const selected = Array.from(app.querySelectorAll("#radar_zone input:checked")).map((x) => x.value);
        setField("zone", selected);
      });
    });

    const range = app.querySelector("#radar_raggio");
    const label = app.querySelector("#radar_raggio_lbl");
    range.addEventListener("input", (e) => {
      const value = Number(e.target.value || 0);
      setField("raggioKm", value);
      label.textContent = `${value} km`;
    });

    bindCommonNav();
  }

  function renderStep4() {
    app.innerHTML = `
      <div class="visioni-radar-step">
        <h3>Step 4 - Attiva Radar</h3>
        <label>Raggio alert (metri)
          <select id="radar_alert">
            <option value="100">100m</option>
            <option value="200">200m</option>
            <option value="500">500m</option>
          </select>
        </label>
        <label>Dalle<input id="radar_dalle" type="time" value="${escapeAttr(state.profile.fasciaDalle)}" /></label>
        <label>Alle<input id="radar_alle" type="time" value="${escapeAttr(state.profile.fasciaAlle)}" /></label>
        <label class="visioni-radar-consent"><input id="radar_gdpr" type="checkbox" ${state.profile.gdpr ? "checked" : ""}/> Accetto privacy e geolocalizzazione</label>
        <div class="visioni-radar-actions"><button data-prev>Indietro</button><button id="radar_submit">Attiva il mio Radar</button></div>
      </div>
    `;

    app.querySelector("#radar_alert").value = String(state.profile.raggioAlert || 200);
    app.querySelector("#radar_alert").addEventListener("change", (e) => setField("raggioAlert", Number(e.target.value || 200)));
    app.querySelector("#radar_dalle").addEventListener("change", (e) => setField("fasciaDalle", e.target.value));
    app.querySelector("#radar_alle").addEventListener("change", (e) => setField("fasciaAlle", e.target.value));
    app.querySelector("#radar_gdpr").addEventListener("change", (e) => setField("gdpr", !!e.target.checked));
    app.querySelector("#radar_submit").addEventListener("click", async () => {
      try {
        await submitProfile();
      } catch (e) {
        alert("Errore durante l'attivazione Radar.");
      }
    });

    bindCommonNav();
  }

  function render() {
    const fn = steps[state.step];
    if (fn) fn();
  }

  function formatPrice(value) {
    const n = Number(value || 0);
    if (!n) return "Su richiesta";
    return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "");
  }

  loadProfile();
  render();
})();
