(function () {
  if (typeof window === "undefined") return;

  var cfg = window.VisioniPlatformAppConfig || {};
  var deferredPrompt = null;
  var storageKey = "visioni_platform_onboarding";
  var root = null;
  var stage = null;
  var summary = null;
  var nextBtn = null;
  var prevBtn = null;
  var stepsEls = [];
  var loginRoleRoot = null;
  var loginRoleInput = null;
  var loginRedirectInput = null;
  var registerRoleRoot = null;
  var registerRoleInput = null;
  var registerFeedback = null;
  var installPromptTracked = false;

  var roles = {
    acquirente: {
      title: "Acquirente",
      label: "Cerco la soluzione giusta",
      description: "Accesso a Radar, preferenze, notifiche contestuali e percorso decisionale guidato.",
      destination: cfg.radarUrl || "/radar/",
      module: "Radar",
    },
    venditore: {
      title: "Venditore",
      label: "Voglio testare la domanda reale",
      description: "Ingresso ad Anticipa, raccolta immobile e percorso per attivare interesse prima del mercato pubblico.",
      destination: cfg.anticipaUrl || "/anticipa/",
      module: "Anticipa",
    },
    impresa: {
      title: "Impresa",
      label: "Gestisco cantiere o operazione",
      description: "Accesso al flusso Cantiere per prevendita, aggiornamenti, disponibilita e gestione accessi riservati.",
      destination: cfg.cantiereUrl || "/my-area/cantiere/",
      module: "Cantiere",
    },
    partner: {
      title: "Partner",
      label: "Segnalo o accompagno opportunita",
      description: "Ingresso ad Ambassador per referral qualificati, segnalazioni e relazioni controllate dentro piattaforma.",
      destination: cfg.ambassadorUrl || "/my-area/ambassador/",
      module: "Ambassador",
    },
  };

  var state = {
    step: 1,
    onboardingType: "nuovo",
    role: "acquirente",
    name: "",
    email: "",
    phone: "",
    privacy: false,
    experience: false,
    geolocation: false,
    alerts: false,
  };

  function loadState() {
    try {
      var raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      state = Object.assign({}, state, parsed || {});
    } catch (_) {
      // noop
    }
  }

  function saveState() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (_) {
      // noop
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function selectedRole() {
    return roles[state.role] || roles.acquirente;
  }

  function currentStepCount() {
    return 4;
  }

  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  function isIos() {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent || "");
  }

  function setHint(text) {
    var hint = document.getElementById("visioni-platform-install-hint");
    if (hint) hint.textContent = text || "";
  }

  function setField(key, value) {
    state[key] = value;
    saveState();
    renderSummary();
  }

  function renderSummary() {
    if (!summary) return;

    var role = selectedRole();
    var profileName = state.name || "Profilo in definizione";
    var statusInstall = isStandalone() ? "Installata" : "Da installare";
    var checklist = [
      { label: "Accesso", value: state.onboardingType === "nuovo" ? "Primo ingresso" : "Gia registrato" },
      { label: "Ruolo", value: role.title },
      { label: "Privacy base", value: state.privacy ? "Attiva" : "Da confermare" },
      { label: "Geolocalizzazione", value: state.geolocation ? "Attivabile" : "Non ancora attiva" },
      { label: "Alert", value: state.alerts ? "Consentiti" : "Non attivi" },
      { label: "Installazione", value: statusInstall },
    ];

    summary.innerHTML = [
      '<div class="visioni-platform-app__panel">',
      '<p class="visioni-platform-app__eyebrow">Profilo corrente</p>',
      '<h4>' + escapeHtml(profileName) + '</h4>',
      '<p class="visioni-platform-app__summarylead">' + escapeHtml(role.label) + '</p>',
      '<ul class="visioni-platform-app__summarylist">' + checklist.map(function (item) {
        return '<li><span>' + escapeHtml(item.label) + '</span><strong>' + escapeHtml(item.value) + '</strong></li>';
      }).join("") + '</ul>',
      '</div>',
      '<div class="visioni-platform-app__panel visioni-platform-app__panel--dark">',
      '<p class="visioni-platform-app__eyebrow">Modulo suggerito</p>',
      '<h4>' + escapeHtml(role.module) + '</h4>',
      '<p>' + escapeHtml(role.description) + '</p>',
      '</div>'
    ].join("");
  }

  function roleDestination(key) {
    var role = roles[key] || roles.acquirente;
    return role.destination;
  }

  function syncLoginRedirect() {
    if (!loginRoleInput) return;
    loginRoleInput.value = state.role;
    if (loginRedirectInput) {
      loginRedirectInput.value = roleDestination(state.role);
    }
  }

  function syncRolePickers() {
    if (loginRoleRoot) {
      loginRoleRoot.querySelectorAll("[data-role]").forEach(function (item) {
        item.classList.toggle("is-active", item.getAttribute("data-role") === state.role);
      });
    }

    if (registerRoleRoot) {
      registerRoleRoot.querySelectorAll("[data-role]").forEach(function (item) {
        item.classList.toggle("is-active", item.getAttribute("data-role") === state.role);
      });
    }

    if (registerRoleInput) {
      registerRoleInput.value = state.role;
    }

    syncLoginRedirect();
  }

  function bindLoginRolePicker() {
    loginRoleRoot = document.getElementById("visioni-platform-login-roles");
    loginRoleInput = document.getElementById("visioni-platform-login-role-input");
    loginRedirectInput = document.querySelector('.visioni-platform-login__form input[name="redirect_to"]');

    if (!loginRoleRoot || !loginRoleInput) return;

    loginRoleRoot.querySelectorAll("[data-role]").forEach(function (button) {
      button.addEventListener("click", function () {
        var selected = button.getAttribute("data-role") || "acquirente";
        state.role = selected;
        saveState();
        syncRolePickers();
      });
    });

    syncRolePickers();
  }

  function bindRegisterRolePicker() {
    registerRoleRoot = document.getElementById("visioni-platform-register-roles");
    registerRoleInput = document.getElementById("visioni-platform-register-role-input");
    registerFeedback = document.getElementById("visioni-platform-register-feedback");

    if (!registerRoleRoot || !registerRoleInput) return;

    registerRoleRoot.querySelectorAll("[data-role]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.role = button.getAttribute("data-role") || "acquirente";
        saveState();
        syncRolePickers();
      });
    });

    syncRolePickers();
  }

  function setRegisterFeedback(text, isError) {
    if (!registerFeedback) return;
    registerFeedback.textContent = text || "";
    registerFeedback.classList.toggle("is-error", !!isError);
    registerFeedback.classList.toggle("is-success", !!text && !isError);
  }

  function bindRegisterForm() {
    var form = document.getElementById("visioni-platform-register-form");
    if (!form || form.getAttribute("data-bound") === "1") return;

    form.setAttribute("data-bound", "1");
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (!cfg.registerUrl) {
        setRegisterFeedback("Endpoint di attivazione non disponibile.", true);
        return;
      }

      var formData = new window.FormData(form);
      var payload = {
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        role: String(formData.get("visioni_role") || state.role || "acquirente").trim(),
        privacy: formData.get("privacy") === "1",
      };

      var submit = form.querySelector("button[type='submit']");
      if (submit) submit.disabled = true;
      setRegisterFeedback("Invio attivazione in corso...", false);

      try {
        var response = await window.fetch(cfg.registerUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": cfg.restNonce || "",
          },
          body: JSON.stringify(payload),
        });

        var result = await response.json();
        if (!response.ok) {
          var message = (result && result.message) || "Non sono riuscito ad attivare il tuo accesso.";
          throw new Error(message);
        }

        setRegisterFeedback((result && result.message ? result.message : "Attivazione inviata.") + " Controlla la tua email.", false);
        form.reset();
        state.role = payload.role;
        saveState();
        syncRolePickers();
      } catch (error) {
        setRegisterFeedback(error && error.message ? error.message : "Errore durante l'attivazione.", true);
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  }

  function renderStepIndicators() {
    stepsEls.forEach(function (item, index) {
      item.classList.toggle("is-active", index + 1 === state.step);
      item.classList.toggle("is-complete", index + 1 < state.step);
    });
  }

  function roleCard(key, role) {
    var isActive = state.role === key;
    return [
      '<button type="button" class="visioni-platform-app__role' + (isActive ? ' is-active' : '') + '" data-role="' + escapeHtml(key) + '">',
      '<strong>' + escapeHtml(role.title) + '</strong>',
      '<span>' + escapeHtml(role.label) + '</span>',
      '<small>' + escapeHtml(role.description) + '</small>',
      '</button>'
    ].join("");
  }

  function renderStep1() {
    stage.innerHTML = [
      '<div class="visioni-platform-app__stagehead">',
      '<h3>Scegli come entri in piattaforma</h3>',
      '<p>Il primo passaggio definisce il tono dell\'esperienza: primo ingresso oppure accesso gia avviato.</p>',
      '</div>',
      '<div class="visioni-platform-app__choices">',
      '<button type="button" class="visioni-platform-app__choice' + (state.onboardingType === 'nuovo' ? ' is-active' : '') + '" data-entry="nuovo"><strong>Primo ingresso</strong><span>Sto entrando ora e configuro il profilo da zero.</span></button>',
      '<button type="button" class="visioni-platform-app__choice' + (state.onboardingType === 'registrato' ? ' is-active' : '') + '" data-entry="registrato"><strong>Ho gia accesso</strong><span>Rientro nella mia area riservata e aggiorno i miei consensi.</span></button>',
      '</div>',
      '<div class="visioni-platform-app__fieldgrid">',
      '<label>Nome e cognome<input id="visioni-platform-name" type="text" value="' + escapeHtml(state.name) + '" placeholder="Come vuoi comparire nell\'app" /></label>',
      '<label>Email<input id="visioni-platform-email" type="email" value="' + escapeHtml(state.email) + '" placeholder="nome@email.it" /></label>',
      '<label>Telefono<input id="visioni-platform-phone" type="text" value="' + escapeHtml(state.phone) + '" placeholder="Facoltativo in questa fase" /></label>',
      '</div>'
    ].join("");

    stage.querySelectorAll('[data-entry]').forEach(function (button) {
      button.addEventListener('click', function () {
        setField('onboardingType', button.getAttribute('data-entry'));
        renderStep1();
      });
    });

    stage.querySelector('#visioni-platform-name').addEventListener('input', function (event) {
      setField('name', event.target.value);
    });
    stage.querySelector('#visioni-platform-email').addEventListener('input', function (event) {
      setField('email', event.target.value);
    });
    stage.querySelector('#visioni-platform-phone').addEventListener('input', function (event) {
      setField('phone', event.target.value);
    });
  }

  function renderStep2() {
    stage.innerHTML = [
      '<div class="visioni-platform-app__stagehead">',
      '<h3>Dimmi chi sei</h3>',
      '<p>Il ruolo decide il percorso successivo: radar per la domanda, anticipa per i venditori, cantiere per le imprese.</p>',
      '</div>',
      '<div class="visioni-platform-app__rolegrid">',
      Object.keys(roles).map(function (key) { return roleCard(key, roles[key]); }).join(''),
      '</div>'
    ].join("");

    stage.querySelectorAll('[data-role]').forEach(function (button) {
      button.addEventListener('click', function () {
        setField('role', button.getAttribute('data-role'));
        renderStep2();
      });
    });
  }

  function consentToggle(id, checked, title, description) {
    return [
      '<label class="visioni-platform-app__toggle">',
      '<input id="' + escapeHtml(id) + '" type="checkbox" ' + (checked ? 'checked' : '') + ' />',
      '<span>',
      '<strong>' + escapeHtml(title) + '</strong>',
      '<small>' + escapeHtml(description) + '</small>',
      '</span>',
      '</label>'
    ].join("");
  }

  function renderStep3() {
    var role = selectedRole();
    var geoText = role.title === 'Acquirente'
      ? 'Serve per attivare Radar e compatibilita in prossimita.'
      : 'Puoi lasciarla spenta in questa fase e attivarla solo quando userai moduli che la richiedono.';

    stage.innerHTML = [
      '<div class="visioni-platform-app__stagehead">',
      '<h3>Attiva i consensi iniziali</h3>',
      '<p>Questa fase prepara un accesso pulito e compatibile con il tipo di esperienza che hai scelto.</p>',
      '</div>',
      '<div class="visioni-platform-app__toggles">',
      consentToggle('visioni-platform-privacy', state.privacy, 'Privacy e condizioni d\'uso', 'Necessario per creare o riattivare il tuo accesso nell\'area riservata.'),
      consentToggle('visioni-platform-experience', state.experience, 'Esperienza riservata e salvataggio profilo', 'Salva il tuo stato locale per non ripetere ogni volta la configurazione iniziale.'),
      consentToggle('visioni-platform-geolocation', state.geolocation, 'Geolocalizzazione funzionale', geoText),
      consentToggle('visioni-platform-alerts', state.alerts, 'Alert e suggerimenti intelligenti', 'Consente di ricevere avvisi coerenti con il tuo percorso e con i moduli attivi.'),
      '</div>'
    ].join("");

    stage.querySelector('#visioni-platform-privacy').addEventListener('change', function (event) {
      setField('privacy', !!event.target.checked);
    });
    stage.querySelector('#visioni-platform-experience').addEventListener('change', function (event) {
      setField('experience', !!event.target.checked);
    });
    stage.querySelector('#visioni-platform-geolocation').addEventListener('change', function (event) {
      setField('geolocation', !!event.target.checked);
    });
    stage.querySelector('#visioni-platform-alerts').addEventListener('change', function (event) {
      setField('alerts', !!event.target.checked);
    });
  }

  function renderStep4() {
    var role = selectedRole();
    var installCopy = isStandalone()
      ? 'L\'app e gia installata. Puoi entrare subito nel modulo consigliato.'
      : 'Scarica ora la app sul dispositivo che stai usando, cosi il cliente prosegue dall\'icona giusta e con un\'esperienza adattata al suo telefono.';

    stage.innerHTML = [
      '<div class="visioni-platform-app__stagehead">',
      '<h3>Installa e avvia il percorso</h3>',
      '<p>' + escapeHtml(installCopy) + '</p>',
      '</div>',
      '<div class="visioni-platform-app__installbox">',
      '<div>',
      '<p class="visioni-platform-app__eyebrow">Modulo in ingresso</p>',
      '<h4>' + escapeHtml(role.module) + '</h4>',
      '<p>' + escapeHtml(role.description) + '</p>',
      '</div>',
      '<div class="visioni-platform-app__installactions">',
      '<button type="button" id="visioni-platform-install" class="visioni-platform-app__install">Scarica app</button>',
      '<a href="' + escapeHtml(role.destination) + '" class="visioni-platform-app__launch" id="visioni-platform-open-module">Apri ' + escapeHtml(role.module) + '</a>',
      '</div>',
      '</div>'
    ].join("");

    bindInstallButton();
    updateInstallUi();
  }

  function renderStage() {
    renderStepIndicators();
    renderSummary();
    prevBtn.disabled = state.step === 1;
    nextBtn.textContent = state.step === currentStepCount() ? 'Apri percorso' : 'Continua';

    if (state.step === 1) renderStep1();
    else if (state.step === 2) renderStep2();
    else if (state.step === 3) renderStep3();
    else renderStep4();
  }

  function validateStep() {
    if (state.step === 1) {
      return String(state.name || '').trim() !== '' && String(state.email || '').trim() !== '';
    }

    if (state.step === 3) {
      return !!state.privacy;
    }

    return true;
  }

  function nextStep() {
    if (!validateStep()) {
      if (state.step === 1) {
        window.alert('Inserisci almeno nome ed email per continuare.');
      } else if (state.step === 3) {
        window.alert('Per entrare nell\'area riservata devi confermare almeno privacy e condizioni d\'uso.');
      }
      return;
    }

    if (state.step < currentStepCount()) {
      state.step += 1;
      saveState();
      renderStage();
      return;
    }

    window.location.href = selectedRole().destination;
  }

  function prevStep() {
    if (state.step <= 1) return;
    state.step -= 1;
    saveState();
    renderStage();
  }

  function updateInstallUi() {
    var btn = document.getElementById("visioni-platform-install");
    if (!btn) return;

    if (isStandalone()) {
      btn.disabled = true;
      btn.textContent = "App gia installata";
      setHint("L'app e gia presente sul dispositivo in modalita standalone.");
      return;
    }

    if (deferredPrompt) {
      btn.disabled = false;
      btn.textContent = "Scarica app";
      setHint("Download diretto disponibile da questo browser su questo dispositivo.");
      return;
    }

    if (isIos()) {
      btn.disabled = false;
      btn.textContent = "Scarica app";
      setHint("Su iPhone usa Condividi > Aggiungi a Home per scaricarla sul dispositivo.");
      return;
    }

    btn.disabled = false;
    btn.textContent = "Scarica app";
      setHint("Se il browser non mostra il prompt, apri il menu del browser e scegli Installa app sul dispositivo corrente.");
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || !cfg.swUrl) return;
    navigator.serviceWorker.register(cfg.swUrl, { scope: "/" }).catch(function () {});
  }

  function trackInstallEvent(eventName) {
    if (!cfg.installEventUrl || !window.fetch) return;

    window.fetch(cfg.installEventUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": cfg.restNonce || "",
      },
      credentials: "same-origin",
      keepalive: true,
      body: JSON.stringify({
        event: eventName,
        screen: "platform",
      }),
    }).catch(function () {});
  }

  function bindInstallButton() {
    var btn = document.getElementById("visioni-platform-install");
    if (!btn || btn.getAttribute("data-bound") === "1") return;

    btn.setAttribute("data-bound", "1");
    btn.addEventListener("click", async function () {
      if (isStandalone()) {
        return;
      }

      trackInstallEvent("install_click");

      if (deferredPrompt) {
        deferredPrompt.prompt();
        try {
          await deferredPrompt.userChoice;
        } catch (_) {
          // noop
        }
        deferredPrompt = null;
        updateInstallUi();
        renderSummary();
        return;
      }

      if (isIos()) {
        trackInstallEvent("ios_manual_hint");
        window.alert("Per scaricare 2D Radar su iPhone: apri il menu Condividi di Safari e scegli 'Aggiungi a Home'.");
        return;
      }

      trackInstallEvent("browser_manual_hint");
      window.alert("Download diretto non disponibile in questo momento. Puoi proseguire dal browser oppure usare il menu del browser per installare la app su questo dispositivo.");
    });
  }

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredPrompt = event;
    if (!installPromptTracked) {
      installPromptTracked = true;
      trackInstallEvent("prompt_available");
    }
    updateInstallUi();
  });

  window.addEventListener("appinstalled", function () {
    deferredPrompt = null;
    trackInstallEvent("install_completed");
    updateInstallUi();
    renderSummary();
  });

  document.addEventListener("DOMContentLoaded", function () {
    root = document.getElementById("visioni-platform-onboarding");
    stage = document.getElementById("visioni-platform-stage");
    summary = document.getElementById("visioni-platform-summary");
    nextBtn = document.getElementById("visioni-platform-next");
    prevBtn = document.getElementById("visioni-platform-prev");
    stepsEls = Array.prototype.slice.call(document.querySelectorAll(".visioni-platform-app__steps li"));

    loadState();
    bindLoginRolePicker();
    bindRegisterRolePicker();
    bindRegisterForm();

    if (root && root.dataset.defaultRole && !state.role) {
      state.role = root.dataset.defaultRole;
    }

    registerServiceWorker();

    if (!root || !stage || !summary || !nextBtn || !prevBtn) return;

    prevBtn.addEventListener("click", prevStep);
    nextBtn.addEventListener("click", nextStep);

    renderStage();
  });
})();
