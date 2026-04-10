(function () {
  if (typeof window === "undefined") return;

  const cfg = window.VisioniRadarConfig || {};
  const app = document.getElementById("visioni-radar-wizard");
  const mapEl = document.getElementById("visioni-radar-map");
  const resultsEl = document.getElementById("visioni-radar-results");
  const summaryEl = document.getElementById("visioni-radar-summary");
  const installBtn = document.getElementById("visioni-radar-install");
  const installHint = document.getElementById("visioni-radar-install-hint");
  if (!app || !resultsEl) return;

  let deferredPrompt = null;

  const storageKey = "visioni_radar_profile";
  const notifiedKey = "visioni_radar_notified";

  const state = {
    step: 1,
    loading: false,
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

  const stepLabels = {
    1: "Identita",
    2: "Criteri",
    3: "Zone",
    4: "Attivazione",
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
    } catch (error) {
      console.warn("Radar profile load failed", error);
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
    }).then((response) => {
      if (!response.ok) throw new Error("Request failed");
      return response.json();
    });
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || !cfg.swUrl) return;
    navigator.serviceWorker.register(cfg.swUrl, { scope: "/" }).catch(() => {});
  }

  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  function isIos() {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent || "");
  }

  function setInstallHint(message) {
    if (!installHint) return;
    installHint.textContent = message || "";
  }

  function updateInstallUi() {
    if (!installBtn) return;

    if (isStandalone()) {
      installBtn.disabled = true;
      installBtn.textContent = "App gia installata";
      setInstallHint("La app e gia presente su questo dispositivo. Puoi usarla dall'icona in Home.");
      return;
    }

    installBtn.disabled = false;

    if (deferredPrompt) {
      installBtn.textContent = "Scarica app";
      setInstallHint("Download diretto disponibile da questo browser su questo dispositivo.");
      return;
    }

    if (isIos()) {
      installBtn.textContent = "Scarica app";
      setInstallHint("Su iPhone usa Condividi > Aggiungi a Home per scaricarla sul dispositivo.");
      return;
    }

    installBtn.textContent = "Scarica app";
    setInstallHint("Se il browser non mostra il prompt, apri il menu del browser e scegli Installa app sul dispositivo corrente.");
  }

  function bindInstallButton() {
    if (!installBtn || installBtn.getAttribute("data-bound") === "1") return;

    installBtn.setAttribute("data-bound", "1");
    installBtn.addEventListener("click", async () => {
      if (isStandalone()) return;

      if (deferredPrompt) {
        deferredPrompt.prompt();
        try {
          await deferredPrompt.userChoice;
        } catch (_) {
          // noop
        }
        deferredPrompt = null;
        updateInstallUi();
        return;
      }

      if (isIos()) {
        window.alert("Per scaricare 2D Radar su iPhone: apri il menu Condividi di Safari e scegli 'Aggiungi a Home'.");
        return;
      }

      window.alert("Download diretto non disponibile in questo momento. Usa il menu del browser e scegli Installa app sul dispositivo corrente.");
    });
  }

  function requestNotificationPermission() {
    if (!("Notification" in window)) return Promise.resolve("unsupported");
    if (Notification.permission === "granted") return Promise.resolve("granted");
    if (Notification.permission === "denied") return Promise.resolve("denied");
    return Notification.requestPermission().catch(() => "default");
  }

  function setField(key, value) {
    state.profile[key] = value;
    saveProfile();
    renderSummary();
  }

  function nextStep() {
    state.step = Math.min(4, state.step + 1);
    render();
  }

  function prevStep() {
    state.step = Math.max(1, state.step - 1);
    render();
  }

  function calculateDistance(lat1, lng1, lat2, lng2) {
    const toRad = (n) => (n * Math.PI) / 180;
    const earth = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return earth * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
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
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const notification = new Notification("2D Radar", {
      body: `${immobile.titolo} compatibile vicino a te`,
      icon: immobile.foto || "/wp-content/plugins/visioni-platform/assets/icons/visioni-radar-icon-192.png",
      data: { url: immobile.url || "/" },
    });
    notification.onclick = function () {
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
          const current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setField("lat", current.lat);
          setField("lng", current.lng);
          resolve(current);
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  function watchPosition() {
    if (!navigator.geolocation) return;
    navigator.geolocation.watchPosition(
      (pos) => {
        const current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setField("lat", current.lat);
        setField("lng", current.lng);
        findCompatibleImmobili(current, state.profile, state.immobili).slice(0, 2).forEach(triggerNotification);
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 10000 }
    );
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

  function renderStepFrame(title, description, innerHtml, actionsHtml) {
    const progress = Math.round((state.step / 4) * 100);
    return `
      <div class="visioni-radar-step">
        <div class="visioni-radar-progress">
          <div>
            <span>Step ${state.step}/4</span>
            <strong>${escapeHtml(stepLabels[state.step])}</strong>
          </div>
          <div class="visioni-radar-progressbar"><span style="width:${progress}%"></span></div>
        </div>
        <div class="visioni-radar-stephead">
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(description)}</p>
        </div>
        <div class="visioni-radar-fields">${innerHtml}</div>
        <div class="visioni-radar-actions">${actionsHtml}</div>
      </div>
    `;
  }

  function renderSummary() {
    if (!summaryEl) return;
    const profile = state.profile;
    const summary = [
      { label: "Intento", value: profile.intent === "investimento" ? "Investimento" : "Prima casa" },
      { label: "Tipologia", value: profile.tipologia || "Non definita" },
      { label: "Budget", value: `${formatPrice(profile.budgetMin)} - ${formatPrice(profile.budgetMax)}` },
      { label: "Vani", value: `${profile.vaniMin || 1} - ${profile.vaniMax || 6}` },
      { label: "Zone", value: profile.zone.length ? profile.zone.join(", ") : "Da selezionare" },
      { label: "Raggio", value: `${profile.raggioKm || 0} km` },
      { label: "Alert", value: `${profile.raggioAlert || 0} m` },
    ];

    const items = summary
      .map((item) => `<li><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></li>`)
      .join("");

    const geo = profile.lat && profile.lng ? "Attiva" : "In attesa";
    const notifications = typeof Notification === "undefined" ? "Non supportate" : Notification.permission;

    summaryEl.innerHTML = `
      <div class="visioni-radar-summarycard">
        <p class="visioni-radar-summarycard__eyebrow">Profilo in costruzione</p>
        <h3>Snapshot Radar</h3>
        <ul>${items}</ul>
      </div>
      <div class="visioni-radar-summarycard visioni-radar-summarycard--soft">
        <p class="visioni-radar-summarycard__eyebrow">Stato dispositivo</p>
        <ul>
          <li><span>Geolocalizzazione</span><strong>${escapeHtml(geo)}</strong></li>
          <li><span>Notifiche</span><strong>${escapeHtml(notifications)}</strong></li>
          <li><span>Hub app</span><strong>${cfg.platformUrl ? "Disponibile" : "Non configurato"}</strong></li>
        </ul>
      </div>
    `;
  }

  function renderResults() {
    if (!state.immobili.length) {
      resultsEl.innerHTML = '<p class="visioni-radar-empty">Nessun immobile compatibile al momento. Quando il gestionale avra immobili geolocalizzati, qui compariranno le opportunita coerenti con il tuo profilo.</p>';
      return;
    }

    const html = state.immobili.slice(0, 12).map((item) => {
      return `
        <article class="visioni-radar-card">
          <div class="visioni-radar-card__top">
            <strong>${escapeHtml(item.titolo || "Immobile")}</strong>
            <span>${escapeHtml(item.tipologia || "immobile")}</span>
          </div>
          <div class="visioni-radar-card__badges">
            <span>Match ${escapeHtml(String(item.matchScore || 0))}/100</span>
            <span>${escapeHtml(item.type || "catalogo")}</span>
          </div>
          <p>${escapeHtml(item.zona || "Zona non specificata")}</p>
          <p><b>Prezzo</b> ${formatPrice(item.prezzo)}</p>
          <p><b>Distanza</b> ${item.distanceKm ? `${item.distanceKm} km` : "calcolata al primo alert"}</p>
          <a href="${escapeAttr(item.url || "#")}" target="_blank" rel="noopener">Apri scheda</a>
        </article>
      `;
    }).join("");

    resultsEl.innerHTML = `<div class="visioni-radar-grid">${html}</div>`;
  }

  function renderMap() {
    if (!mapEl) return;
    if (!cfg.mapsEnabled || !window.google || !window.google.maps) {
      mapEl.innerHTML = '<p class="visioni-radar-map-fallback">La mappa premium si attiva appena inserisci la Google Maps API Key nella dashboard del plugin.</p>';
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
      fullscreenControl: false,
      styles: [
        { featureType: "all", elementType: "geometry", stylers: [{ saturation: -20 }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#d9c08f" }] },
      ],
    });

    new window.google.maps.Circle({
      strokeColor: "#c7a366",
      strokeOpacity: 0.9,
      strokeWeight: 1,
      fillColor: "#c7a366",
      fillOpacity: 0.14,
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
        content: `<div style="min-width:180px"><strong>${escapeHtml(item.titolo || "Immobile")}</strong><br>${escapeHtml(item.zona || "")}
        <br>${formatPrice(item.prezzo)}<br><a href="${escapeAttr(item.url || "#")}" target="_blank">Apri scheda</a></div>`,
      });
      marker.addListener("click", () => infowindow.open({ anchor: marker, map }));
    });
  }

  async function loadImmobili() {
    const params = new URLSearchParams();
    Object.keys(state.profile).forEach((key) => {
      const val = state.profile[key];
      if (val === null || val === undefined || val === "") return;
      if (Array.isArray(val)) val.forEach((entry) => params.append("zone[]", entry));
      else params.set(key, String(val));
    });

    const data = await api(`/radar/immobili?${params.toString()}`, "GET");
    state.immobili = (data && data.immobili) || [];
    renderResults();
    renderMap();
  }

  async function submitProfile() {
    if (!state.profile.gdpr) {
      alert("Devi accettare privacy e geolocalizzazione per attivare il Radar.");
      return;
    }

    state.loading = true;
    try {
      await initRadar();
      await requestNotificationPermission();
      const data = await api("/radar/profiles", "POST", state.profile);
      if (!data || !data.ok) throw new Error("Profilo non salvato");
      registerServiceWorker();
      await loadImmobili();
      watchPosition();

      const score = Number(data.leadScore || 0);
      const priority = data.priorityLabel || "Attivo";
      const matchCount = Number(data.matchCount || state.immobili.length || 0);
      const nextStep = data.nextStep || "Contatto consulenziale e raffinazione del perimetro di ricerca";

      app.innerHTML = `
        <div class="visioni-radar-success">
          <h3>Radar attivato con successo</h3>
          <p>Il tuo profilo e stato salvato. Da questo momento il sistema puo intercettare immobili compatibili, ordinare la domanda e inviarti alert quando entri nel raggio definito.</p>
          <div class="visioni-radar-success__grid">
            <div class="visioni-radar-success__card">
              <span>Score profilo</span>
              <strong>${escapeHtml(String(score))}/100</strong>
            </div>
            <div class="visioni-radar-success__card">
              <span>Priorita</span>
              <strong>${escapeHtml(priority)}</strong>
            </div>
            <div class="visioni-radar-success__card">
              <span>Match stimati</span>
              <strong>${escapeHtml(String(matchCount))}</strong>
            </div>
          </div>
          <div class="visioni-radar-success__nextstep">
            <span>Prossimo step</span>
            <strong>${escapeHtml(nextStep)}</strong>
          </div>
          <div class="visioni-radar-actions">
            <button type="button" data-refresh-results>Aggiorna risultati</button>
            ${cfg.platformUrl ? `<a class="visioni-radar-linkbutton" href="${escapeAttr(cfg.platformUrl)}">Torna all'hub app</a>` : ""}
          </div>
        </div>
      `;

      const refreshBtn = app.querySelector("[data-refresh-results]");
      if (refreshBtn) refreshBtn.addEventListener("click", () => loadImmobili().catch(() => {}));
    } finally {
      state.loading = false;
      renderSummary();
    }
  }

  function bindCommonNav() {
    const prev = app.querySelector("[data-prev]");
    const next = app.querySelector("[data-next]");
    if (prev) prev.addEventListener("click", prevStep);
    if (next) next.addEventListener("click", nextStep);
  }

  function renderStep1() {
    app.innerHTML = renderStepFrame(
      "Chi sei e cosa cerchi",
      "Impostiamo un profilo chiaro e spendibile subito anche lato consulenza.",
      `
        <label>Nome<input id="radar_nome" value="${escapeAttr(state.profile.nome)}" /></label>
        <label>Email<input id="radar_email" type="email" value="${escapeAttr(state.profile.email)}" /></label>
        <label>Telefono<input id="radar_telefono" value="${escapeAttr(state.profile.telefono)}" /></label>
        <div class="visioni-radar-choicegroup">
          <button type="button" data-choice="buyerType" data-value="acquirente" class="${state.profile.buyerType === "acquirente" ? "is-active" : ""}">Acquirente</button>
          <button type="button" data-choice="buyerType" data-value="affittuario" class="${state.profile.buyerType === "affittuario" ? "is-active" : ""}">Affittuario</button>
        </div>
        <div class="visioni-radar-choicegroup">
          <button type="button" data-choice="intent" data-value="prima_casa" class="${state.profile.intent === "prima_casa" ? "is-active" : ""}">Prima casa</button>
          <button type="button" data-choice="intent" data-value="investimento" class="${state.profile.intent === "investimento" ? "is-active" : ""}">Investimento</button>
        </div>
      `,
      `<button data-next>Continua</button>`
    );

    app.querySelector("#radar_nome").addEventListener("input", (e) => setField("nome", e.target.value));
    app.querySelector("#radar_email").addEventListener("input", (e) => setField("email", e.target.value));
    app.querySelector("#radar_telefono").addEventListener("input", (e) => setField("telefono", e.target.value));
    app.querySelectorAll("[data-choice]").forEach((button) => {
      button.addEventListener("click", () => setField(button.dataset.choice, button.dataset.value));
    });
    bindCommonNav();
  }

  function renderStep2() {
    app.innerHTML = renderStepFrame(
      "Definisci i criteri",
      "Qui restringiamo il perimetro: tipologia, vani, budget e soglia economica reale.",
      `
        <label>Tipologia
          <select id="radar_tipologia">
            <option value="appartamento">Appartamento</option>
            <option value="villa">Villa</option>
            <option value="commerciale">Commerciale</option>
            <option value="terreno">Terreno</option>
            <option value="operazione">Operazione</option>
          </select>
        </label>
        <div class="visioni-radar-fieldgrid">
          <label>Vani min<input id="radar_vanimin" type="number" min="1" max="10" value="${escapeAttr(state.profile.vaniMin)}" /></label>
          <label>Vani max<input id="radar_vanimax" type="number" min="1" max="10" value="${escapeAttr(state.profile.vaniMax)}" /></label>
        </div>
        <div class="visioni-radar-fieldgrid">
          <label>Budget min<input id="radar_budgetmin" type="number" min="0" value="${escapeAttr(state.profile.budgetMin)}" /></label>
          <label>Budget max<input id="radar_budgetmax" type="number" min="0" value="${escapeAttr(state.profile.budgetMax)}" /></label>
        </div>
      `,
      `<button data-prev>Indietro</button><button data-next>Continua</button>`
    );

    app.querySelector("#radar_tipologia").value = state.profile.tipologia;
    app.querySelector("#radar_tipologia").addEventListener("change", (e) => setField("tipologia", e.target.value));
    app.querySelector("#radar_vanimin").addEventListener("input", (e) => setField("vaniMin", Number(e.target.value || 0)));
    app.querySelector("#radar_vanimax").addEventListener("input", (e) => setField("vaniMax", Number(e.target.value || 0)));
    app.querySelector("#radar_budgetmin").addEventListener("input", (e) => setField("budgetMin", Number(e.target.value || 0)));
    app.querySelector("#radar_budgetmax").addEventListener("input", (e) => setField("budgetMax", Number(e.target.value || 0)));
    bindCommonNav();
  }

  function renderStep3() {
    const quartieri = (cfg.quartieri || [])
      .map((quartiere) => `
        <label class="visioni-radar-zoneitem">
          <input type="checkbox" value="${escapeAttr(quartiere)}" ${state.profile.zone.includes(quartiere) ? "checked" : ""} />
          <span>${escapeHtml(quartiere)}</span>
        </label>
      `)
      .join("");

    app.innerHTML = renderStepFrame(
      "Disegna la tua geografia",
      "Le zone contano piu di tutto: qui definisci dove il sistema deve presidiare davvero il mercato per te.",
      `
        <div id="radar_zone" class="visioni-radar-zone-grid">${quartieri}</div>
        <label>Raggio massimo di ricerca
          <input id="radar_raggio" type="range" min="1" max="20" value="${escapeAttr(state.profile.raggioKm)}" />
          <span id="radar_raggio_lbl" class="visioni-radar-rangevalue">${escapeHtml(String(state.profile.raggioKm))} km</span>
        </label>
      `,
      `<button data-prev>Indietro</button><button data-next>Continua</button>`
    );

    app.querySelectorAll("#radar_zone input[type='checkbox']").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const selected = Array.from(app.querySelectorAll("#radar_zone input:checked")).map((item) => item.value);
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
    app.innerHTML = renderStepFrame(
      "Attiva il Radar",
      "Ultimo passaggio: scegli il raggio alert, abilita geolocalizzazione e autorizza il sistema a trasformare la ricerca in monitoraggio attivo.",
      `
        <label>Raggio alert (metri)
          <select id="radar_alert">
            <option value="100">100 m</option>
            <option value="200">200 m</option>
            <option value="500">500 m</option>
          </select>
        </label>
        <div class="visioni-radar-fieldgrid">
          <label>Dalle<input id="radar_dalle" type="time" value="${escapeAttr(state.profile.fasciaDalle)}" /></label>
          <label>Alle<input id="radar_alle" type="time" value="${escapeAttr(state.profile.fasciaAlle)}" /></label>
        </div>
        <label class="visioni-radar-consent"><input id="radar_gdpr" type="checkbox" ${state.profile.gdpr ? "checked" : ""}/> <span>Accetto privacy, geolocalizzazione e attivazione alert.</span></label>
      `,
      `<button data-prev>Indietro</button><button id="radar_submit">Attiva il mio Radar</button>`
    );

    app.querySelector("#radar_alert").value = String(state.profile.raggioAlert || 200);
    app.querySelector("#radar_alert").addEventListener("change", (e) => setField("raggioAlert", Number(e.target.value || 200)));
    app.querySelector("#radar_dalle").addEventListener("change", (e) => setField("fasciaDalle", e.target.value));
    app.querySelector("#radar_alle").addEventListener("change", (e) => setField("fasciaAlle", e.target.value));
    app.querySelector("#radar_gdpr").addEventListener("change", (e) => setField("gdpr", !!e.target.checked));
    app.querySelector("#radar_submit").addEventListener("click", async () => {
      try {
        await submitProfile();
      } catch (_) {
        alert("Errore durante l'attivazione Radar.");
      }
    });
    bindCommonNav();
  }

  function render() {
    renderSummary();
    if (state.step === 1) return renderStep1();
    if (state.step === 2) return renderStep2();
    if (state.step === 3) return renderStep3();
    return renderStep4();
  }

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredPrompt = event;
    updateInstallUi();
  });

  window.addEventListener("appinstalled", function () {
    deferredPrompt = null;
    updateInstallUi();
  });

  registerServiceWorker();
  bindInstallButton();
  updateInstallUi();
  loadProfile();
  renderSummary();
  renderResults();
  renderMap();
  render();
})();
