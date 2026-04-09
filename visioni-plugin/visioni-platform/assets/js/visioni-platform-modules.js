(function () {
  if (typeof window === "undefined") return;

  var cfg = window.VisioniPlatformModulesConfig || {};
  var root = document.getElementById("visioni-anticipa-app");
  if (!root) return;

  var stage = document.getElementById("visioni-anticipa-stage");
  var summary = document.getElementById("visioni-anticipa-summary");
  var nextBtn = document.getElementById("visioni-anticipa-next");
  var prevBtn = document.getElementById("visioni-anticipa-prev");
  var hint = document.getElementById("visioni-anticipa-hint");
  var stepEls = Array.prototype.slice.call(root.querySelectorAll(".visioni-module__steps span"));

  var storageKey = "visioni_anticipa_profile";
  var state = {
    step: 1,
    nome: "",
    email: "",
    telefono: "",
    sellerType: "privato",
    assetType: "appartamento",
    city: "",
    zone: "",
    status: "da_valutare",
    objective: "testare_domanda",
    timing: "30_90",
    expectedPrice: "",
    exclusive: "valuto",
    notes: "",
    privacy: false,
    loading: false,
  };

  var sellerLabels = {
    privato: "Privato",
    impresa: "Impresa",
    investitore: "Investitore",
    erede: "Erede",
  };

  var assetLabels = {
    appartamento: "Appartamento",
    villa: "Villa",
    terreno: "Terreno",
    cantiere: "Cantiere",
    commerciale: "Commerciale",
    operazione: "Operazione",
  };

  var objectiveLabels = {
    vendere: "Vendere",
    testare_domanda: "Testare domanda",
    prevendita: "Prevendita",
    capire_prezzo: "Capire il prezzo",
  };

  function loadState() {
    try {
      var raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      state = Object.assign({}, state, JSON.parse(raw) || {});
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

  function formatPrice(value) {
    var amount = Number(value || 0);
    if (!amount) return "Da definire";
    return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount);
  }

  function setField(key, value) {
    state[key] = value;
    saveState();
    renderSummary();
  }

  function api(path, method, body) {
    return fetch((cfg.apiBase || "") + path, {
      method: method || "GET",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (response) {
      return response.json().then(function (data) {
        if (!response.ok) {
          var message = data && data.message ? data.message : "Richiesta non riuscita.";
          throw new Error(message);
        }
        return data;
      });
    });
  }

  function renderSummary() {
    if (!summary) return;

    summary.innerHTML = [
      '<p class="visioni-platform-app__eyebrow">Profilo venditore</p>',
      '<h4>' + escapeHtml(state.nome || "Nuovo ingresso") + '</h4>',
      '<p class="visioni-platform-app__summarylead">' + escapeHtml(objectiveLabels[state.objective] || "Percorso in definizione") + '</p>',
      '<ul class="visioni-platform-app__summarylist">',
      '<li><span>Soggetto</span><strong>' + escapeHtml(sellerLabels[state.sellerType] || "Privato") + '</strong></li>',
      '<li><span>Immobile</span><strong>' + escapeHtml(assetLabels[state.assetType] || "Appartamento") + '</strong></li>',
      '<li><span>Zona</span><strong>' + escapeHtml(state.city || "Da indicare") + '</strong></li>',
      '<li><span>Tempistica</span><strong>' + escapeHtml(state.timing.replace(/_/g, " ")) + '</strong></li>',
      '<li><span>Prezzo atteso</span><strong>' + escapeHtml(formatPrice(state.expectedPrice)) + '</strong></li>',
      '</ul>'
    ].join("");
  }

  function renderSteps() {
    stepEls.forEach(function (item, index) {
      item.classList.toggle("is-active", index + 1 === state.step);
      item.classList.toggle("is-complete", index + 1 < state.step);
    });
  }

  function optionButton(name, value, label, active) {
    return '<button type="button" class="visioni-module__option' + (active ? ' is-active' : '') + '" data-name="' + escapeHtml(name) + '" data-value="' + escapeHtml(value) + '">' + escapeHtml(label) + '</button>';
  }

  function renderStep1() {
    stage.innerHTML = [
      '<div class="visioni-module__stagehead">',
      '<h3>Chi sta entrando in Anticipa</h3>',
      '<p>Partiamo da identita e contesto. Qui capiamo se stiamo parlando con un privato, un costruttore o un investitore.</p>',
      '</div>',
      '<div class="visioni-platform-app__fieldgrid">',
      '<label>Nome e cognome<input type="text" id="anticipa_nome" value="' + escapeHtml(state.nome) + '" placeholder="Come ti dobbiamo richiamare" /></label>',
      '<label>Email<input type="email" id="anticipa_email" value="' + escapeHtml(state.email) + '" placeholder="nome@email.it" /></label>',
      '<label>Telefono<input type="text" id="anticipa_phone" value="' + escapeHtml(state.telefono) + '" placeholder="Numero diretto" /></label>',
      '</div>',
      '<div class="visioni-module__optiongrid">',
      optionButton('sellerType', 'privato', 'Privato', state.sellerType === 'privato'),
      optionButton('sellerType', 'impresa', 'Impresa', state.sellerType === 'impresa'),
      optionButton('sellerType', 'investitore', 'Investitore', state.sellerType === 'investitore'),
      optionButton('sellerType', 'erede', 'Erede', state.sellerType === 'erede'),
      '</div>'
    ].join('');

    stage.querySelector('#anticipa_nome').addEventListener('input', function (event) { setField('nome', event.target.value); });
    stage.querySelector('#anticipa_email').addEventListener('input', function (event) { setField('email', event.target.value); });
    stage.querySelector('#anticipa_phone').addEventListener('input', function (event) { setField('telefono', event.target.value); });
    bindOptionButtons();
  }

  function renderStep2() {
    stage.innerHTML = [
      '<div class="visioni-module__stagehead">',
      '<h3>Che cosa vuoi attivare</h3>',
      '<p>Raccogliamo tipologia, zona e stato del bene per capire se ha senso un test domanda, una vendita o un percorso cantiere.</p>',
      '</div>',
      '<div class="visioni-module__optiongrid">',
      optionButton('assetType', 'appartamento', 'Appartamento', state.assetType === 'appartamento'),
      optionButton('assetType', 'villa', 'Villa', state.assetType === 'villa'),
      optionButton('assetType', 'terreno', 'Terreno', state.assetType === 'terreno'),
      optionButton('assetType', 'cantiere', 'Cantiere', state.assetType === 'cantiere'),
      optionButton('assetType', 'commerciale', 'Commerciale', state.assetType === 'commerciale'),
      optionButton('assetType', 'operazione', 'Operazione', state.assetType === 'operazione'),
      '</div>',
      '<div class="visioni-platform-app__fieldgrid">',
      '<label>Citta o area<input type="text" id="anticipa_city" value="' + escapeHtml(state.city) + '" placeholder="Bari, Ceglie del Campo, provincia..." /></label>',
      '<label>Zona o riferimento<input type="text" id="anticipa_zone" value="' + escapeHtml(state.zone) + '" placeholder="Quartiere, contrada, area" /></label>',
      '<label>Prezzo atteso<input type="number" id="anticipa_price" value="' + escapeHtml(state.expectedPrice) + '" placeholder="Se lo hai gia in mente" /></label>',
      '</div>',
      '<div class="visioni-module__optiongrid">',
      optionButton('status', 'libero', 'Libero', state.status === 'libero'),
      optionButton('status', 'da_liberare', 'Da liberare', state.status === 'da_liberare'),
      optionButton('status', 'locato', 'Locato', state.status === 'locato'),
      optionButton('status', 'in_cantiere', 'In cantiere', state.status === 'in_cantiere'),
      optionButton('status', 'da_valutare', 'Da valutare', state.status === 'da_valutare'),
      '</div>'
    ].join('');

    stage.querySelector('#anticipa_city').addEventListener('input', function (event) { setField('city', event.target.value); });
    stage.querySelector('#anticipa_zone').addEventListener('input', function (event) { setField('zone', event.target.value); });
    stage.querySelector('#anticipa_price').addEventListener('input', function (event) { setField('expectedPrice', event.target.value); });
    bindOptionButtons();
  }

  function renderStep3() {
    stage.innerHTML = [
      '<div class="visioni-module__stagehead">',
      '<h3>Obiettivo e timing</h3>',
      '<p>Qui definiamo perche stai entrando e quanto sei vicino all\'azione. Questo ci serve per capire il valore reale del contatto.</p>',
      '</div>',
      '<div class="visioni-module__optiongrid">',
      optionButton('objective', 'vendere', 'Vendere', state.objective === 'vendere'),
      optionButton('objective', 'testare_domanda', 'Testare domanda', state.objective === 'testare_domanda'),
      optionButton('objective', 'prevendita', 'Prevendita', state.objective === 'prevendita'),
      optionButton('objective', 'capire_prezzo', 'Capire il prezzo', state.objective === 'capire_prezzo'),
      '</div>',
      '<div class="visioni-module__optiongrid">',
      optionButton('timing', 'subito', 'Subito', state.timing === 'subito'),
      optionButton('timing', '30_90', '30-90 giorni', state.timing === '30_90'),
      optionButton('timing', '3_6_mesi', '3-6 mesi', state.timing === '3_6_mesi'),
      optionButton('timing', '6_mesi_plus', 'Oltre 6 mesi', state.timing === '6_mesi_plus'),
      '</div>',
      '<div class="visioni-module__optiongrid">',
      optionButton('exclusive', 'si', 'Valuto esclusiva piena', state.exclusive === 'si'),
      optionButton('exclusive', 'valuto', 'Valuto il metodo', state.exclusive === 'valuto'),
      optionButton('exclusive', 'no', 'No esclusiva', state.exclusive === 'no'),
      '</div>',
      '<label class="visioni-module__textarea">Note operative<textarea id="anticipa_notes" placeholder="Dimmi in due righe cosa vuoi ottenere o quale e il contesto reale.">' + escapeHtml(state.notes) + '</textarea></label>',
      '<label class="visioni-platform-app__toggle"><input type="checkbox" id="anticipa_privacy" ' + (state.privacy ? 'checked' : '') + ' /><span><strong>Confermo privacy e contatto operativo</strong><small>Autorizzo 2D a gestire questa richiesta, contattarmi e costruire il percorso corretto in base ai dati inseriti.</small></span></label>'
    ].join('');

    stage.querySelector('#anticipa_notes').addEventListener('input', function (event) { setField('notes', event.target.value); });
    stage.querySelector('#anticipa_privacy').addEventListener('change', function (event) { setField('privacy', !!event.target.checked); });
    bindOptionButtons();
  }

  function bindOptionButtons() {
    stage.querySelectorAll('[data-name][data-value]').forEach(function (button) {
      button.addEventListener('click', function () {
        setField(button.getAttribute('data-name'), button.getAttribute('data-value'));
        renderStage();
      });
    });
  }

  function renderStage() {
    renderSteps();
    renderSummary();
    prevBtn.disabled = state.step === 1 || state.loading;
    nextBtn.disabled = state.loading;
    nextBtn.textContent = state.step === 3 ? (state.loading ? 'Invio in corso...' : 'Attiva Anticipa') : 'Continua';

    if (state.step === 1) renderStep1();
    else if (state.step === 2) renderStep2();
    else renderStep3();
  }

  function validateStep() {
    if (state.step === 1) {
      return String(state.nome || '').trim() !== '' && String(state.email || '').trim() !== '';
    }
    if (state.step === 2) {
      return String(state.city || '').trim() !== '';
    }
    if (state.step === 3) {
      return !!state.privacy;
    }
    return true;
  }

  function setHint(text) {
    if (hint) hint.textContent = text || '';
  }

  function submit() {
    state.loading = true;
    renderStage();
    setHint('Sto registrando il tuo ingresso in Anticipa.');

    api('/anticipa/intentions', 'POST', state)
      .then(function (data) {
        stage.innerHTML = [
          '<div class="visioni-module__success">',
          '<p class="visioni-platform-app__eyebrow">Ingresso registrato</p>',
          '<h3>Anticipa e stato attivato</h3>',
          '<p>Abbiamo registrato la tua richiesta. Ora il sistema puo aprire un percorso mirato invece di trattarti come un annuncio generico.</p>',
          '<div class="visioni-module__successgrid">',
          '<div><span>Lead score</span><strong>' + escapeHtml(String(data.leadScore || 0)) + '/100</strong></div>',
          '<div><span>Compatibilita iniziali</span><strong>' + escapeHtml(String(data.matchCount || 0)) + '</strong></div>',
          '<div><span>Prossimo step</span><strong>' + escapeHtml(data.nextStep || 'Analisi operativa') + '</strong></div>',
          '</div>',
          '<div class="visioni-platform-app__actions">',
          '<a class="visioni-platform-app__launch" href="' + escapeHtml(cfg.platformUrl || '/platform/') + '">Torna alla Platform</a>',
          '<a class="visioni-platform-app__ghostlink" href="' + escapeHtml(cfg.advisorUrl || '/my-area/advisor/') + '">Apri Advisor</a>',
          '</div>',
          '</div>'
        ].join('');
        nextBtn.disabled = true;
        prevBtn.disabled = true;
        setHint('Richiesta registrata correttamente.');
        try { window.localStorage.removeItem(storageKey); } catch (_) {}
      })
      .catch(function (error) {
        state.loading = false;
        renderStage();
        setHint(error && error.message ? error.message : 'Errore durante il salvataggio.');
      });
  }

  nextBtn.addEventListener('click', function () {
    if (!validateStep()) {
      if (state.step === 1) setHint('Inserisci almeno nome ed email validi per continuare.');
      else if (state.step === 2) setHint('Indicami almeno la citta o area dell\'immobile.');
      else setHint('Devi confermare privacy e contatto operativo.');
      return;
    }

    setHint('');

    if (state.step < 3) {
      state.step += 1;
      saveState();
      renderStage();
      return;
    }

    submit();
  });

  prevBtn.addEventListener('click', function () {
    if (state.step <= 1 || state.loading) return;
    state.step -= 1;
    saveState();
    setHint('');
    renderStage();
  });

  loadState();
  renderStage();
})();

(function () {
  if (typeof window === "undefined") return;

  var cfg = window.VisioniPlatformModulesConfig || {};
  var root = document.getElementById("visioni-vicinato-app");
  if (!root) return;

  var composer = document.getElementById("visioni-vicinato-composer");
  var feed = document.getElementById("visioni-vicinato-feed");
  var hint = document.getElementById("visioni-vicinato-hint");
  var storageKey = "visioni_vicinato_signal";
  var state = {
    autore: "",
    zona: "",
    tipo: "segnale",
    contenuto: "",
    loading: false,
  };

  var typeLabels = {
    segnale: "Segnale",
    domanda: "Domanda",
    opportunita: "Opportunita",
    presidio: "Presidio",
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function loadState() {
    try {
      var raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      state = Object.assign({}, state, JSON.parse(raw) || {});
    } catch (_) {}
  }

  function saveState() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (_) {}
  }

  function setHint(text) {
    if (hint) hint.textContent = text || "";
  }

  function optionButton(value, label, active) {
    return '<button type="button" class="visioni-module__option' + (active ? ' is-active' : '') + '" data-vicinato-type="' + escapeHtml(value) + '">' + escapeHtml(label) + '</button>';
  }

  function api(path, method, body) {
    return fetch((cfg.apiBase || "") + path, {
      method: method || "GET",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (response) {
      return response.json().then(function (data) {
        if (!response.ok) {
          throw new Error((data && data.message) || "Richiesta non riuscita.");
        }
        return data;
      });
    });
  }

  function renderComposer() {
    if (!composer) return;
    composer.innerHTML = [
      '<div class="visioni-module__stagehead">',
      '<h3>Registra un segnale locale utile</h3>',
      '<p>Annota quello che il quartiere sta dicendo davvero: domanda, percezione, movimento, opportunita o attrito.</p>',
      '</div>',
      '<div class="visioni-platform-app__fieldgrid">',
      '<label>Nome referente<input type="text" id="vicinato_autore" value="' + escapeHtml(state.autore) + '" placeholder="Chi sta inviando il segnale" /></label>',
      '<label>Zona o microzona<input type="text" id="vicinato_zona" value="' + escapeHtml(state.zona) + '" placeholder="Quartiere, strada, isolato" /></label>',
      '</div>',
      '<div class="visioni-module__optiongrid visioni-vicinato__types">',
      optionButton('segnale', 'Segnale', state.tipo === 'segnale'),
      optionButton('domanda', 'Domanda', state.tipo === 'domanda'),
      optionButton('opportunita', 'Opportunita', state.tipo === 'opportunita'),
      optionButton('presidio', 'Presidio', state.tipo === 'presidio'),
      '</div>',
      '<label class="visioni-module__textarea">Contenuto del segnale<textarea id="vicinato_contenuto" placeholder="Descrivi cosa sta emergendo sul territorio, in modo breve ma utile.">' + escapeHtml(state.contenuto) + '</textarea></label>',
      '<div class="visioni-platform-app__actions">',
      '<button type="button" class="visioni-platform-app__install" id="visioni-vicinato-submit"' + (state.loading ? ' disabled' : '') + '>' + (state.loading ? 'Invio in corso...' : 'Pubblica segnale') + '</button>',
      '<a class="visioni-platform-app__ghostlink" href="' + escapeHtml(cfg.myAreaUrl || '/my-area/') + '">Torna a My Area</a>',
      '</div>'
    ].join('');

    composer.querySelector('#vicinato_autore').addEventListener('input', function (event) {
      state.autore = event.target.value;
      saveState();
    });
    composer.querySelector('#vicinato_zona').addEventListener('input', function (event) {
      state.zona = event.target.value;
      saveState();
    });
    composer.querySelector('#vicinato_contenuto').addEventListener('input', function (event) {
      state.contenuto = event.target.value;
      saveState();
    });
    composer.querySelectorAll('[data-vicinato-type]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.tipo = button.getAttribute('data-vicinato-type') || 'segnale';
        saveState();
        renderComposer();
      });
    });
    composer.querySelector('#visioni-vicinato-submit').addEventListener('click', submitSignal);
  }

  function renderFeed(items) {
    if (!feed) return;
    if (!items || !items.length) {
      feed.innerHTML = '<div class="visioni-vicinato__empty"><p class="visioni-platform-app__eyebrow">Feed locale</p><h4>Nessun segnale disponibile</h4><p>Pubblica il primo segnale per iniziare a dare memoria al quartiere.</p></div>';
      return;
    }

    feed.innerHTML = [
      '<div class="visioni-vicinato__header">',
      '<p class="visioni-platform-app__eyebrow">Feed locale</p>',
      '<h4>Ultimi segnali raccolti sul territorio</h4>',
      '</div>',
      '<div class="visioni-vicinato__cards">',
      items.map(function (item) {
        return [
          '<article class="visioni-vicinato__card">',
          '<div class="visioni-vicinato__meta"><strong>' + escapeHtml(item.zona || 'Zona non indicata') + '</strong><span>' + escapeHtml(typeLabels[item.tipo] || item.tipo || 'Segnale') + '</span></div>',
          '<h4>' + escapeHtml(item.title || 'Segnale locale') + '</h4>',
          '<p>' + escapeHtml(item.content || '') + '</p>',
          '<div class="visioni-vicinato__footer"><span>' + escapeHtml(item.autore || 'Anonimo') + '</span><strong>' + escapeHtml(item.date || '') + '</strong></div>',
          '</article>'
        ].join('');
      }).join(''),
      '</div>'
    ].join('');
  }

  function fetchFeed() {
    setHint('Sto caricando i segnali di quartiere.');
    api('/vicinato/posts')
      .then(function (data) {
        renderFeed((data && data.items) || []);
        setHint('Feed Vicinato aggiornato.');
      })
      .catch(function () {
        renderFeed([]);
        setHint('Impossibile leggere i segnali del quartiere in questo momento.');
      });
  }

  function submitSignal() {
    if (!String(state.autore || '').trim() || !String(state.zona || '').trim() || !String(state.contenuto || '').trim()) {
      setHint('Compila referente, zona e contenuto del segnale.');
      return;
    }

    state.loading = true;
    renderComposer();
    setHint('Sto pubblicando il segnale locale.');
    api('/vicinato/posts', 'POST', {
      autore: state.autore,
      zona: state.zona,
      tipo: state.tipo,
      contenuto: state.contenuto,
    })
      .then(function () {
        state.loading = false;
        state.contenuto = '';
        saveState();
        renderComposer();
        fetchFeed();
        setHint('Segnale pubblicato correttamente.');
      })
      .catch(function (error) {
        state.loading = false;
        renderComposer();
        setHint((error && error.message) || 'Errore durante la pubblicazione del segnale.');
      });
  }

  loadState();
  renderComposer();
  fetchFeed();
})();

(function () {
  if (typeof window === "undefined") return;

  var cfg = window.VisioniPlatformModulesConfig || {};
  var root = document.getElementById("visioni-distretto-app");
  if (!root) return;

  var filters = document.getElementById("visioni-distretto-filters");
  var grid = document.getElementById("visioni-distretto-grid");
  var summary = document.getElementById("visioni-distretto-summary");
  var state = {
    sort: 'yield',
    focus: 'all',
    items: [],
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function optionButton(name, value, label, active) {
    return '<button type="button" class="visioni-module__option' + (active ? ' is-active' : '') + '" data-distretto-' + escapeHtml(name) + '="' + escapeHtml(value) + '">' + escapeHtml(label) + '</button>';
  }

  function api(path) {
    return fetch((cfg.apiBase || '') + path).then(function (response) {
      return response.json().then(function (data) {
        if (!response.ok) {
          throw new Error((data && data.message) || 'Richiesta non riuscita.');
        }
        return data;
      });
    });
  }

  function getVisibleItems() {
    var items = state.items.slice();

    if (state.focus === 'liquidita') {
      items = items.filter(function (item) { return Number(item.liquidita || 0) >= 7.5; });
    } else if (state.focus === 'trend') {
      items = items.filter(function (item) { return Number(item.trend || 0) >= 3.5; });
    } else if (state.focus === 'yield') {
      items = items.filter(function (item) { return Number(item.yield || 0) >= 5.7; });
    }

    items.sort(function (a, b) {
      return Number(b[state.sort] || 0) - Number(a[state.sort] || 0);
    });
    return items;
  }

  function renderFilters() {
    if (!filters) return;
    filters.innerHTML = [
      '<div class="visioni-module__stagehead">',
      '<h3>Orienta la lettura del distretto</h3>',
      '<p>Puoi dare priorita a rendimento, trend o liquidita. Il punto non e il quartiere famoso, ma il quartiere giusto per l’obiettivo.</p>',
      '</div>',
      '<div class="visioni-distretto__toolbar">',
      '<div class="visioni-distretto__filtergroup">',
      optionButton('sort', 'yield', 'Ordina per yield', state.sort === 'yield'),
      optionButton('sort', 'trend', 'Ordina per trend', state.sort === 'trend'),
      optionButton('sort', 'liquidita', 'Ordina per liquidita', state.sort === 'liquidita'),
      '</div>',
      '<div class="visioni-distretto__filtergroup">',
      optionButton('focus', 'all', 'Tutte le zone', state.focus === 'all'),
      optionButton('focus', 'yield', 'Solo yield alto', state.focus === 'yield'),
      optionButton('focus', 'trend', 'Solo trend forte', state.focus === 'trend'),
      optionButton('focus', 'liquidita', 'Solo liquidita alta', state.focus === 'liquidita'),
      '</div>',
      '</div>'
    ].join('');

    filters.querySelectorAll('[data-distretto-sort]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.sort = button.getAttribute('data-distretto-sort') || 'yield';
        renderFilters();
        renderGrid();
        renderSummary();
      });
    });

    filters.querySelectorAll('[data-distretto-focus]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.focus = button.getAttribute('data-distretto-focus') || 'all';
        renderFilters();
        renderGrid();
        renderSummary();
      });
    });
  }

  function renderGrid() {
    if (!grid) return;
    var items = getVisibleItems();

    if (!items.length) {
      grid.innerHTML = '<div class="visioni-distretto__empty"><h4>Nessuna zona disponibile per questo filtro</h4><p>Allarga il focus per rivedere l’intero distretto.</p></div>';
      return;
    }

    grid.innerHTML = '<div class="visioni-distretto__cards">' + items.map(function (item) {
      return [
        '<article class="visioni-distretto__card">',
        '<div class="visioni-distretto__top"><p class="visioni-platform-app__eyebrow">' + escapeHtml(item.tag || 'Distretto') + '</p><h4>' + escapeHtml(item.nome || '') + '</h4></div>',
        '<div class="visioni-distretto__metrics">',
        '<div><span>Yield</span><strong>' + escapeHtml(String(item.yield || 0)) + '%</strong></div>',
        '<div><span>Trend</span><strong>' + escapeHtml(String(item.trend || 0)) + '%</strong></div>',
        '<div><span>Liquidita</span><strong>' + escapeHtml(String(item.liquidita || 0)) + '/10</strong></div>',
        '<div><span>Attrito</span><strong>' + escapeHtml(String(item.attrito || 0)) + '/10</strong></div>',
        '</div>',
        '<p>' + escapeHtml(item.insight || '') + '</p>',
        '</article>'
      ].join('');
    }).join('') + '</div>';
  }

  function renderSummary() {
    if (!summary) return;
    var items = getVisibleItems();
    var top = items[0] || null;
    var avgYield = 0;
    var avgLiquidita = 0;

    if (items.length) {
      avgYield = items.reduce(function (sum, item) { return sum + Number(item.yield || 0); }, 0) / items.length;
      avgLiquidita = items.reduce(function (sum, item) { return sum + Number(item.liquidita || 0); }, 0) / items.length;
    }

    summary.innerHTML = [
      '<p class="visioni-platform-app__eyebrow">Sintesi operativa</p>',
      '<h4>' + escapeHtml(top ? top.nome : 'Distretto in analisi') + '</h4>',
      '<p class="visioni-platform-app__summarylead">' + escapeHtml(top ? top.insight : 'Nessun quartiere selezionato') + '</p>',
      '<ul class="visioni-platform-app__summarylist">',
      '<li><span>Quartieri visibili</span><strong>' + escapeHtml(String(items.length)) + '</strong></li>',
      '<li><span>Yield medio</span><strong>' + escapeHtml(avgYield.toFixed(1)) + '%</strong></li>',
      '<li><span>Liquidita media</span><strong>' + escapeHtml(avgLiquidita.toFixed(1)) + '/10</strong></li>',
      '<li><span>Lettura corrente</span><strong>' + escapeHtml(state.sort === 'yield' ? 'Redditivita' : (state.sort === 'trend' ? 'Momentum' : 'Rotazione')) + '</strong></li>',
      '</ul>',
      '<div class="visioni-platform-app__actions">',
      '<a class="visioni-platform-app__launch" href="' + escapeHtml(cfg.platformUrl || '/platform/') + '">Torna alla Platform</a>',
      '<a class="visioni-platform-app__ghostlink" href="' + escapeHtml(cfg.myAreaUrl || '/my-area/') + '">Apri My Area</a>',
      '</div>'
    ].join('');
  }

  api('/distretto/quartieri')
    .then(function (data) {
      state.items = (data && data.items) || [];
      renderFilters();
      renderGrid();
      renderSummary();
    })
    .catch(function () {
      state.items = [];
      renderFilters();
      renderGrid();
      renderSummary();
    });
})();

(function () {
  if (typeof window === "undefined") return;

  var cfg = window.VisioniPlatformModulesConfig || {};
  var root = document.getElementById("visioni-score-app");
  if (!root) return;

  var inputs = document.getElementById("visioni-score-inputs");
  var run = document.getElementById("visioni-score-run");
  var hint = document.getElementById("visioni-score-hint");
  var result = document.getElementById("visioni-score-result");
  var state = { timing: 14, asset: 16, leverage: 14, demand: 15 };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderInputs() {
    inputs.innerHTML = [
      field('Timing', 'timing', state.timing),
      field('Qualita asset / contatto', 'asset', state.asset),
      field('Leva commerciale', 'leverage', state.leverage),
      field('Domanda / mercato', 'demand', state.demand)
    ].join('');

    inputs.querySelectorAll('input').forEach(function (input) {
      input.addEventListener('input', function () {
        state[input.name] = Number(input.value || 0);
        var valueEl = inputs.querySelector('[data-score-value="' + input.name + '"]');
        if (valueEl) valueEl.textContent = String(state[input.name]);
      });
    });
  }

  function field(label, name, value) {
    return [
      '<label class="visioni-module__textarea">' + escapeHtml(label),
      '<input type="range" min="0" max="25" step="1" name="' + escapeHtml(name) + '" value="' + escapeHtml(String(value)) + '" />',
      '<span class="visioni-score__rangevalue" data-score-value="' + escapeHtml(name) + '">' + escapeHtml(String(value)) + '</span>',
      '</label>'
    ].join('');
  }

  function setHint(text) { if (hint) hint.textContent = text || ''; }

  run.addEventListener('click', function () {
    setHint('Sto calcolando la forza operativa del caso.');
    fetch((cfg.apiBase || '') + '/score/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (!data || !data.ok) throw new Error('Score non disponibile');
        result.innerHTML = [
          '<div class="visioni-platform-app__panel">',
          '<p class="visioni-platform-app__eyebrow">' + escapeHtml(data.priority || 'Score') + '</p>',
          '<h4>' + escapeHtml(String(data.totale || 0)) + '/100 · ' + escapeHtml(data.giudizio || '') + '</h4>',
          '<div class="visioni-module__successgrid">',
          (data.drivers || []).map(function (item) {
            return '<div><span>' + escapeHtml(item.label) + '</span><strong>' + escapeHtml(String(item.value)) + '/25</strong></div>';
          }).join(''),
          '</div>',
          '<ul class="visioni-platform-app__checklist">',
          (data.nextActions || []).map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join(''),
          '</ul>',
          '</div>'
        ].join('');
        setHint('Score calcolato.');
      })
      .catch(function () { setHint('Errore nel calcolo dello Score.'); });
  });

  renderInputs();
})();

(function () {
  if (typeof window === "undefined") return;

  var cfg = window.VisioniPlatformModulesConfig || {};
  var root = document.getElementById("visioni-profezia-app");
  if (!root) return;

  var inputs = document.getElementById("visioni-profezia-inputs");
  var run = document.getElementById("visioni-profezia-run");
  var hint = document.getElementById("visioni-profezia-hint");
  var result = document.getElementById("visioni-profezia-result");
  var state = { prezzoAttuale: 250000, trendZona: 2.5, qualitaAsset: 6, strategia: 'tenere' };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function money(value) {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Number(value || 0));
  }

  function renderInputs() {
    inputs.innerHTML = [
      '<div class="visioni-platform-app__fieldgrid">' +
      '<label>Valore attuale<input type="number" id="profezia_price" value="' + escapeHtml(String(state.prezzoAttuale)) + '" /></label>' +
      '<label>Trend zona % annuo<input type="number" step="0.1" id="profezia_trend" value="' + escapeHtml(String(state.trendZona)) + '" /></label>' +
      '<label>Qualita asset (0-10)<input type="number" min="0" max="10" id="profezia_quality" value="' + escapeHtml(String(state.qualitaAsset)) + '" /></label>' +
      '</div>' +
      '<div class="visioni-module__optiongrid">' +
      option('tenere', 'Tenere') + option('vendere', 'Vendere') + option('sviluppare', 'Sviluppare') +
      '</div>'
    ];

    inputs.querySelector('#profezia_price').addEventListener('input', function (e) { state.prezzoAttuale = Number(e.target.value || 0); });
    inputs.querySelector('#profezia_trend').addEventListener('input', function (e) { state.trendZona = Number(e.target.value || 0); });
    inputs.querySelector('#profezia_quality').addEventListener('input', function (e) { state.qualitaAsset = Number(e.target.value || 0); });
    inputs.querySelectorAll('[data-strategy]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.strategia = button.getAttribute('data-strategy') || 'tenere';
        renderInputs();
      });
    });
  }

  function option(value, label) {
    return '<button type="button" class="visioni-module__option' + (state.strategia === value ? ' is-active' : '') + '" data-strategy="' + escapeHtml(value) + '">' + escapeHtml(label) + '</button>';
  }

  function setHint(text) { if (hint) hint.textContent = text || ''; }

  run.addEventListener('click', function () {
    setHint('Sto generando gli scenari di Profezia.');
    fetch((cfg.apiBase || '') + '/profezia/forecast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (!data || !data.ok) throw new Error('Scenario non disponibile');
        result.innerHTML = [
          '<div class="visioni-platform-app__panel">',
          '<p class="visioni-platform-app__eyebrow">Scenario base</p>',
          '<div class="visioni-module__successgrid">',
          '<div><span>1 anno</span><strong>' + escapeHtml(money(data.anni1)) + '</strong></div>',
          '<div><span>3 anni</span><strong>' + escapeHtml(money(data.anni3)) + '</strong></div>',
          '<div><span>5 anni</span><strong>' + escapeHtml(money(data.anni5)) + '</strong></div>',
          '</div>',
          '<div class="visioni-profezia__scenarios">',
          '<div class="visioni-platform-app__panel"><p class="visioni-platform-app__eyebrow">Prudente</p><strong>' + escapeHtml(money(data.scenarioPrudente.anni5)) + '</strong></div>',
          '<div class="visioni-platform-app__panel"><p class="visioni-platform-app__eyebrow">Spinta positiva</p><strong>' + escapeHtml(money(data.scenarioSpinta.anni5)) + '</strong></div>',
          '</div>',
          '<h4>' + escapeHtml(data.insight || '') + '</h4>',
          '<ul class="visioni-platform-app__checklist">',
          (data.nextActions || []).map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join(''),
          '</ul>',
          '</div>'
        ].join('');
        setHint('Scenari generati.');
      })
      .catch(function () { setHint('Errore nella generazione degli scenari.'); });
  });

  renderInputs();
})();

(function () {
  if (typeof window === "undefined") return;

  var cfg = window.VisioniPlatformModulesConfig || {};
  var root = document.getElementById("visioni-memoria-app");
  if (!root) return;

  var summary = document.getElementById("visioni-memoria-summary");
  var timeline = document.getElementById("visioni-memoria-timeline");
  var actions = document.getElementById("visioni-memoria-actions");

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function loadDigest() {
    fetch((cfg.apiBase || "") + "/memoria/digest")
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (!data || !data.ok) throw new Error("Digest non disponibile");

        if (summary) {
          summary.innerHTML = [
            '<p class="visioni-platform-app__eyebrow">Stato corrente</p>',
            '<h4>' + escapeHtml(data.headline || "Memoria attiva") + '</h4>',
            '<div class="visioni-module__successgrid">',
            (data.summary || []).map(function (item) {
              return '<div><span>' + escapeHtml(item.label) + '</span><strong>' + escapeHtml(String(item.value)) + '</strong></div>';
            }).join(''),
            '</div>'
          ].join('');
        }

        if (timeline) {
          timeline.innerHTML = [
            '<div class="visioni-platform-app__panel">',
            '<p class="visioni-platform-app__eyebrow">Timeline recente</p>',
            '<div class="visioni-memoria__items">',
            (data.timeline || []).map(function (item) {
              return [
                '<article class="visioni-memoria__item">',
                '<div class="visioni-memoria__meta"><strong>' + escapeHtml(item.channel) + '</strong><span>' + escapeHtml(item.date || "") + '</span></div>',
                '<h4>' + escapeHtml(item.title || "Percorso") + '</h4>',
                '<p>' + escapeHtml(item.subtitle || "") + '</p>',
                '<div class="visioni-memoria__footer"><span>' + escapeHtml(item.priority || "") + '</span><strong>' + escapeHtml(item.step || "") + '</strong></div>',
                '</article>'
              ].join('');
            }).join(''),
            '</div>',
            '</div>'
          ].join('');
        }

        if (actions) {
          actions.innerHTML = [
            '<p class="visioni-platform-app__eyebrow">Prossime azioni</p>',
            '<h4>Rientro guidato</h4>',
            '<ul class="visioni-platform-app__checklist">',
            (data.nextActions || []).map(function (item) {
              return '<li>' + escapeHtml(item) + '</li>';
            }).join(''),
            '</ul>'
          ].join('');
        }
      })
      .catch(function () {
        if (summary) {
          summary.innerHTML = '<p class="visioni-platform-app__eyebrow">Memoria</p><h4>Digest temporaneamente non disponibile</h4>';
        }
      });
  }

  loadDigest();
})();

(function () {
  if (typeof window === "undefined") return;

  var cfg = window.VisioniPlatformModulesConfig || {};
  var root = document.getElementById("visioni-advisor-app");
  if (!root) return;

  var message = document.getElementById("visioni-advisor-message");
  var send = document.getElementById("visioni-advisor-send");
  var hint = document.getElementById("visioni-advisor-hint");
  var responseBox = document.getElementById("visioni-advisor-response");

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function setHint(text) {
    if (hint) hint.textContent = text || "";
  }

  function askAdvisor(text) {
    setHint('Sto elaborando una lettura operativa.');
    fetch((cfg.apiBase || "") + "/advisor/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (!data || !data.ok) throw new Error('Risposta non disponibile');
        responseBox.innerHTML = [
          '<div class="visioni-platform-app__panel">',
          '<p class="visioni-platform-app__eyebrow">' + escapeHtml(data.angle || 'Advisor') + '</p>',
          '<h4>' + escapeHtml(data.reply || '') + '</h4>',
          '<ul class="visioni-platform-app__checklist">',
          (data.nextActions || []).map(function (item) {
            return '<li>' + escapeHtml(item) + '</li>';
          }).join(''),
          '</ul>',
          '</div>'
        ].join('');
        setHint('Lettura disponibile.');
      })
      .catch(function () {
        setHint('Errore durante la lettura Advisor.');
      });
  }

  root.querySelectorAll('[data-advisor-prompt]').forEach(function (button) {
    button.addEventListener('click', function () {
      var prompt = button.getAttribute('data-advisor-prompt') || '';
      if (message) message.value = prompt;
      askAdvisor(prompt);
    });
  });

  if (send) {
    send.addEventListener('click', function () {
      var text = message ? message.value : '';
      if (!String(text || '').trim()) {
        setHint('Scrivi una domanda operativa per ottenere una lettura utile.');
        return;
      }
      askAdvisor(text);
    });
  }
})();

(function () {
  if (typeof window === "undefined") return;

  var cfg = window.VisioniPlatformModulesConfig || {};
  var root = document.getElementById("visioni-ambassador-app");
  if (!root) return;

  var stage = document.getElementById("visioni-ambassador-stage");
  var summary = document.getElementById("visioni-ambassador-summary");
  var nextBtn = document.getElementById("visioni-ambassador-next");
  var prevBtn = document.getElementById("visioni-ambassador-prev");
  var hint = document.getElementById("visioni-ambassador-hint");
  var stepEls = Array.prototype.slice.call(root.querySelectorAll(".visioni-module__steps span"));
  var storageKey = "visioni_ambassador_profile";

  var state = {
    step: 1,
    nome: "",
    email: "",
    telefono: "",
    partnerType: "segnalatore",
    networkType: "domanda",
    city: "",
    referralVolume: "",
    timing: "30_90",
    objective: "referral",
    notes: "",
    privacy: false,
    loading: false,
  };

  var partnerLabels = {
    segnalatore: "Segnalatore",
    professionista: "Professionista",
    investitore: "Investitore",
    advisor_locale: "Advisor locale",
  };

  var networkLabels = {
    domanda: "Domanda",
    immobili: "Immobili",
    sviluppo: "Sviluppo",
    network_misto: "Network misto",
  };

  var objectiveLabels = {
    referral: "Referral",
    acquisizione: "Acquisizione",
    partnership: "Partnership",
    sviluppo: "Sviluppo",
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function loadState() {
    try {
      var raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      state = Object.assign({}, state, JSON.parse(raw) || {});
    } catch (_) {}
  }

  function saveState() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (_) {}
  }

  function setField(key, value) {
    state[key] = value;
    saveState();
    renderSummary();
  }

  function setHint(text) {
    if (hint) hint.textContent = text || "";
  }

  function api(path, method, body) {
    return fetch((cfg.apiBase || "") + path, {
      method: method || "GET",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (response) {
      return response.json().then(function (data) {
        if (!response.ok) {
          throw new Error((data && data.message) || "Richiesta non riuscita.");
        }
        return data;
      });
    });
  }

  function renderSummary() {
    if (!summary) return;
    summary.innerHTML = [
      '<p class="visioni-platform-app__eyebrow">Profilo partner</p>',
      '<h4>' + escapeHtml(state.nome || "Nuovo ingresso partner") + '</h4>',
      '<p class="visioni-platform-app__summarylead">' + escapeHtml(objectiveLabels[state.objective] || "Referral") + '</p>',
      '<ul class="visioni-platform-app__summarylist">',
      '<li><span>Tipo partner</span><strong>' + escapeHtml(partnerLabels[state.partnerType] || "Segnalatore") + '</strong></li>',
      '<li><span>Network</span><strong>' + escapeHtml(networkLabels[state.networkType] || "Domanda") + '</strong></li>',
      '<li><span>Area</span><strong>' + escapeHtml(state.city || "Da indicare") + '</strong></li>',
      '<li><span>Volume</span><strong>' + escapeHtml(String(state.referralVolume || "n/d")) + '</strong></li>',
      '<li><span>Timing</span><strong>' + escapeHtml(state.timing.replace(/_/g, " ")) + '</strong></li>',
      '</ul>'
    ].join("");
  }

  function renderSteps() {
    stepEls.forEach(function (item, index) {
      item.classList.toggle("is-active", index + 1 === state.step);
      item.classList.toggle("is-complete", index + 1 < state.step);
    });
  }

  function optionButton(name, value, label, active) {
    return '<button type="button" class="visioni-module__option' + (active ? ' is-active' : '') + '" data-name="' + escapeHtml(name) + '" data-value="' + escapeHtml(value) + '">' + escapeHtml(label) + '</button>';
  }

  function bindOptionButtons() {
    stage.querySelectorAll('[data-name][data-value]').forEach(function (button) {
      button.addEventListener('click', function () {
        setField(button.getAttribute('data-name'), button.getAttribute('data-value'));
        renderStage();
      });
    });
  }

  function renderStep1() {
    stage.innerHTML = [
      '<div class="visioni-module__stagehead"><h3>Chi apre il canale partner</h3><p>Partiamo da identita e posizionamento del partner dentro l\'ecosistema locale.</p></div>',
      '<div class="visioni-platform-app__fieldgrid">',
      '<label>Nome referente<input type="text" id="ambassador_nome" value="' + escapeHtml(state.nome) + '" /></label>',
      '<label>Email<input type="email" id="ambassador_email" value="' + escapeHtml(state.email) + '" /></label>',
      '<label>Telefono<input type="text" id="ambassador_phone" value="' + escapeHtml(state.telefono) + '" /></label>',
      '</div>',
      '<div class="visioni-module__optiongrid">',
      optionButton('partnerType', 'segnalatore', 'Segnalatore', state.partnerType === 'segnalatore'),
      optionButton('partnerType', 'professionista', 'Professionista', state.partnerType === 'professionista'),
      optionButton('partnerType', 'investitore', 'Investitore', state.partnerType === 'investitore'),
      optionButton('partnerType', 'advisor_locale', 'Advisor locale', state.partnerType === 'advisor_locale'),
      '</div>'
    ].join('');
    stage.querySelector('#ambassador_nome').addEventListener('input', function (e) { setField('nome', e.target.value); });
    stage.querySelector('#ambassador_email').addEventListener('input', function (e) { setField('email', e.target.value); });
    stage.querySelector('#ambassador_phone').addEventListener('input', function (e) { setField('telefono', e.target.value); });
    bindOptionButtons();
  }

  function renderStep2() {
    stage.innerHTML = [
      '<div class="visioni-module__stagehead"><h3>Che rete porti davvero</h3><p>Qui distinguiamo se il partner intercetta domanda, immobili, sviluppo o un network piu misto.</p></div>',
      '<div class="visioni-module__optiongrid">',
      optionButton('networkType', 'domanda', 'Domanda', state.networkType === 'domanda'),
      optionButton('networkType', 'immobili', 'Immobili', state.networkType === 'immobili'),
      optionButton('networkType', 'sviluppo', 'Sviluppo', state.networkType === 'sviluppo'),
      optionButton('networkType', 'network_misto', 'Network misto', state.networkType === 'network_misto'),
      '</div>',
      '<div class="visioni-platform-app__fieldgrid">',
      '<label>Area di presidio<input type="text" id="ambassador_city" value="' + escapeHtml(state.city) + '" placeholder="Bari, Molfetta, Puglia, distretto..." /></label>',
      '<label>Volume contatti stimato / mese<input type="number" id="ambassador_volume" value="' + escapeHtml(state.referralVolume) + '" placeholder="Quanti contatti o opportunita reali puoi attivare" /></label>',
      '</div>'
    ].join('');
    stage.querySelector('#ambassador_city').addEventListener('input', function (e) { setField('city', e.target.value); });
    stage.querySelector('#ambassador_volume').addEventListener('input', function (e) { setField('referralVolume', e.target.value); });
    bindOptionButtons();
  }

  function renderStep3() {
    stage.innerHTML = [
      '<div class="visioni-module__stagehead"><h3>Come vuoi attivarti</h3><p>Definiamo l\'obiettivo reale del rapporto: referral, acquisizione, partnership o sviluppo.</p></div>',
      '<div class="visioni-module__optiongrid">',
      optionButton('timing', 'subito', 'Subito', state.timing === 'subito'),
      optionButton('timing', '30_90', '30-90 giorni', state.timing === '30_90'),
      optionButton('timing', '3_6_mesi', '3-6 mesi', state.timing === '3_6_mesi'),
      optionButton('timing', '6_mesi_plus', 'Oltre 6 mesi', state.timing === '6_mesi_plus'),
      '</div>',
      '<div class="visioni-module__optiongrid">',
      optionButton('objective', 'referral', 'Referral', state.objective === 'referral'),
      optionButton('objective', 'acquisizione', 'Acquisizione', state.objective === 'acquisizione'),
      optionButton('objective', 'partnership', 'Partnership', state.objective === 'partnership'),
      optionButton('objective', 'sviluppo', 'Sviluppo', state.objective === 'sviluppo'),
      '</div>',
      '<label class="visioni-module__textarea">Note operative<textarea id="ambassador_notes">' + escapeHtml(state.notes) + '</textarea></label>',
      '<label class="visioni-platform-app__toggle"><input type="checkbox" id="ambassador_privacy" ' + (state.privacy ? 'checked' : '') + ' /><span><strong>Confermo privacy e contatto operativo</strong><small>Autorizzo 2D a prendere in carico questa proposta partner e a valutare un accesso coerente alla rete Visioni.</small></span></label>'
    ].join('');
    stage.querySelector('#ambassador_notes').addEventListener('input', function (e) { setField('notes', e.target.value); });
    stage.querySelector('#ambassador_privacy').addEventListener('change', function (e) { setField('privacy', !!e.target.checked); });
    bindOptionButtons();
  }

  function renderStage() {
    renderSteps();
    renderSummary();
    prevBtn.disabled = state.step === 1 || state.loading;
    nextBtn.disabled = state.loading;
    nextBtn.textContent = state.step === 3 ? (state.loading ? 'Invio in corso...' : 'Attiva Partner') : 'Continua';
    if (state.step === 1) renderStep1();
    else if (state.step === 2) renderStep2();
    else renderStep3();
  }

  function validateStep() {
    if (state.step === 1) return String(state.nome || '').trim() !== '' && String(state.email || '').trim() !== '';
    if (state.step === 2) return String(state.city || '').trim() !== '';
    if (state.step === 3) return !!state.privacy;
    return true;
  }

  function submit() {
    state.loading = true;
    renderStage();
    setHint('Sto registrando il profilo partner.');
    api('/ambassador/referrals', 'POST', state)
      .then(function (data) {
        stage.innerHTML = [
          '<div class="visioni-module__success">',
          '<p class="visioni-platform-app__eyebrow">Canale partner registrato</p>',
          '<h3>Ambassador e stato attivato</h3>',
          '<p>Il tuo ingresso partner e stato registrato. Ora il sistema puo qualificare la rete e aprire un rapporto coerente con il valore che porti.</p>',
          '<div class="visioni-module__successgrid">',
          '<div><span>Lead score</span><strong>' + escapeHtml(String(data.leadScore || 0)) + '/100</strong></div>',
          '<div><span>Tier</span><strong>' + escapeHtml(data.partnerTier || 'Entry') + '</strong></div>',
          '<div><span>Prossimo step</span><strong>' + escapeHtml(data.nextStep || 'Analisi operativa') + '</strong></div>',
          '</div>',
          '<div class="visioni-platform-app__actions">',
          '<a class="visioni-platform-app__launch" href="' + escapeHtml(cfg.myAreaUrl || '/my-area/') + '">Apri My Area</a>',
          '<a class="visioni-platform-app__ghostlink" href="' + escapeHtml(cfg.advisorUrl || '/my-area/advisor/') + '">Apri Advisor</a>',
          '</div>',
          '</div>'
        ].join('');
        nextBtn.disabled = true;
        prevBtn.disabled = true;
        setHint('Profilo partner registrato correttamente.');
        try { window.localStorage.removeItem(storageKey); } catch (_) {}
      })
      .catch(function (error) {
        state.loading = false;
        renderStage();
        setHint(error && error.message ? error.message : 'Errore durante il salvataggio.');
      });
  }

  nextBtn.addEventListener('click', function () {
    if (!validateStep()) {
      if (state.step === 1) setHint('Inserisci almeno nome ed email validi.');
      else if (state.step === 2) setHint('Indica almeno l\'area di presidio del partner.');
      else setHint('Devi confermare privacy e contatto operativo.');
      return;
    }
    setHint('');
    if (state.step < 3) {
      state.step += 1;
      saveState();
      renderStage();
      return;
    }
    submit();
  });

  prevBtn.addEventListener('click', function () {
    if (state.step <= 1 || state.loading) return;
    state.step -= 1;
    saveState();
    renderStage();
  });

  loadState();
  renderStage();
})();

(function () {
  if (typeof window === "undefined") return;

  var cfg = window.VisioniPlatformModulesConfig || {};
  var root = document.getElementById("visioni-cantiere-app");
  if (!root) return;

  var stage = document.getElementById("visioni-cantiere-stage");
  var summary = document.getElementById("visioni-cantiere-summary");
  var nextBtn = document.getElementById("visioni-cantiere-next");
  var prevBtn = document.getElementById("visioni-cantiere-prev");
  var hint = document.getElementById("visioni-cantiere-hint");
  var stepEls = Array.prototype.slice.call(root.querySelectorAll(".visioni-module__steps span"));
  var storageKey = "visioni_cantiere_profile";

  var state = {
    step: 1,
    nome: "",
    email: "",
    telefono: "",
    companyType: "impresa",
    projectType: "cantiere",
    projectName: "",
    city: "",
    units: "",
    stage: "studio",
    timing: "30_90",
    objective: "raccolta_domanda",
    notes: "",
    privacy: false,
    loading: false,
  };

  var companyLabels = {
    impresa: "Impresa",
    sviluppatore: "Sviluppatore",
    promotore: "Promotore",
    tecnico: "Tecnico",
  };

  var projectLabels = {
    cantiere: "Cantiere",
    operazione: "Operazione",
    lottizzazione: "Lottizzazione",
    riqualificazione: "Riqualificazione",
  };

  var objectiveLabels = {
    prevendita: "Prevendita",
    raccolta_domanda: "Raccolta domanda",
    analisi: "Analisi",
    commercializzazione: "Commercializzazione",
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function loadState() {
    try {
      var raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      state = Object.assign({}, state, JSON.parse(raw) || {});
    } catch (_) {}
  }

  function saveState() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (_) {}
  }

  function setField(key, value) {
    state[key] = value;
    saveState();
    renderSummary();
  }

  function setHint(text) {
    if (hint) hint.textContent = text || "";
  }

  function api(path, method, body) {
    return fetch((cfg.apiBase || "") + path, {
      method: method || "GET",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (response) {
      return response.json().then(function (data) {
        if (!response.ok) {
          throw new Error((data && data.message) || "Richiesta non riuscita.");
        }
        return data;
      });
    });
  }

  function renderSummary() {
    if (!summary) return;
    summary.innerHTML = [
      '<p class="visioni-platform-app__eyebrow">Profilo impresa</p>',
      '<h4>' + escapeHtml(state.projectName || state.nome || "Nuovo progetto") + '</h4>',
      '<p class="visioni-platform-app__summarylead">' + escapeHtml(objectiveLabels[state.objective] || "Raccolta domanda") + '</p>',
      '<ul class="visioni-platform-app__summarylist">',
      '<li><span>Soggetto</span><strong>' + escapeHtml(companyLabels[state.companyType] || "Impresa") + '</strong></li>',
      '<li><span>Progetto</span><strong>' + escapeHtml(projectLabels[state.projectType] || "Cantiere") + '</strong></li>',
      '<li><span>Localita</span><strong>' + escapeHtml(state.city || "Da indicare") + '</strong></li>',
      '<li><span>Unita</span><strong>' + escapeHtml(String(state.units || "n/d")) + '</strong></li>',
      '<li><span>Timing</span><strong>' + escapeHtml(state.timing.replace(/_/g, " ")) + '</strong></li>',
      '</ul>'
    ].join("");
  }

  function renderSteps() {
    stepEls.forEach(function (item, index) {
      item.classList.toggle("is-active", index + 1 === state.step);
      item.classList.toggle("is-complete", index + 1 < state.step);
    });
  }

  function optionButton(name, value, label, active) {
    return '<button type="button" class="visioni-module__option' + (active ? ' is-active' : '') + '" data-name="' + escapeHtml(name) + '" data-value="' + escapeHtml(value) + '">' + escapeHtml(label) + '</button>';
  }

  function bindOptionButtons() {
    stage.querySelectorAll('[data-name][data-value]').forEach(function (button) {
      button.addEventListener('click', function () {
        setField(button.getAttribute('data-name'), button.getAttribute('data-value'));
        renderStage();
      });
    });
  }

  function renderStep1() {
    stage.innerHTML = [
      '<div class="visioni-module__stagehead"><h3>Chi guida il progetto</h3><p>Partiamo dalla struttura del soggetto e dal referente operativo reale.</p></div>',
      '<div class="visioni-platform-app__fieldgrid">',
      '<label>Nome referente<input type="text" id="cantiere_nome" value="' + escapeHtml(state.nome) + '" /></label>',
      '<label>Email<input type="email" id="cantiere_email" value="' + escapeHtml(state.email) + '" /></label>',
      '<label>Telefono<input type="text" id="cantiere_phone" value="' + escapeHtml(state.telefono) + '" /></label>',
      '</div>',
      '<div class="visioni-module__optiongrid">',
      optionButton('companyType', 'impresa', 'Impresa', state.companyType === 'impresa'),
      optionButton('companyType', 'sviluppatore', 'Sviluppatore', state.companyType === 'sviluppatore'),
      optionButton('companyType', 'promotore', 'Promotore', state.companyType === 'promotore'),
      optionButton('companyType', 'tecnico', 'Tecnico', state.companyType === 'tecnico'),
      '</div>'
    ].join('');
    stage.querySelector('#cantiere_nome').addEventListener('input', function (e) { setField('nome', e.target.value); });
    stage.querySelector('#cantiere_email').addEventListener('input', function (e) { setField('email', e.target.value); });
    stage.querySelector('#cantiere_phone').addEventListener('input', function (e) { setField('telefono', e.target.value); });
    bindOptionButtons();
  }

  function renderStep2() {
    stage.innerHTML = [
      '<div class="visioni-module__stagehead"><h3>Che progetto stai aprendo</h3><p>Qui distinguiamo cantiere, operazione e lottizzazione: e da questo che nasce la macchina commerciale giusta.</p></div>',
      '<div class="visioni-module__optiongrid">',
      optionButton('projectType', 'cantiere', 'Cantiere', state.projectType === 'cantiere'),
      optionButton('projectType', 'operazione', 'Operazione', state.projectType === 'operazione'),
      optionButton('projectType', 'lottizzazione', 'Lottizzazione', state.projectType === 'lottizzazione'),
      optionButton('projectType', 'riqualificazione', 'Riqualificazione', state.projectType === 'riqualificazione'),
      '</div>',
      '<div class="visioni-platform-app__fieldgrid">',
      '<label>Nome progetto<input type="text" id="cantiere_project" value="' + escapeHtml(state.projectName) + '" /></label>',
      '<label>Localita<input type="text" id="cantiere_city" value="' + escapeHtml(state.city) + '" /></label>',
      '<label>Numero unita<input type="number" id="cantiere_units" value="' + escapeHtml(state.units) + '" /></label>',
      '</div>',
      '<div class="visioni-module__optiongrid">',
      optionButton('stage', 'studio', 'Studio', state.stage === 'studio'),
      optionButton('stage', 'permessi', 'Permessi', state.stage === 'permessi'),
      optionButton('stage', 'apertura', 'Apertura', state.stage === 'apertura'),
      optionButton('stage', 'prevendita', 'Prevendita', state.stage === 'prevendita'),
      optionButton('stage', 'costruzione', 'Costruzione', state.stage === 'costruzione'),
      '</div>'
    ].join('');
    stage.querySelector('#cantiere_project').addEventListener('input', function (e) { setField('projectName', e.target.value); });
    stage.querySelector('#cantiere_city').addEventListener('input', function (e) { setField('city', e.target.value); });
    stage.querySelector('#cantiere_units').addEventListener('input', function (e) { setField('units', e.target.value); });
    bindOptionButtons();
  }

  function renderStep3() {
    stage.innerHTML = [
      '<div class="visioni-module__stagehead"><h3>Come vuoi attivarlo</h3><p>Decidiamo timing e obiettivo: prevendita, raccolta domanda o analisi dell\'operazione.</p></div>',
      '<div class="visioni-module__optiongrid">',
      optionButton('timing', 'subito', 'Subito', state.timing === 'subito'),
      optionButton('timing', '30_90', '30-90 giorni', state.timing === '30_90'),
      optionButton('timing', '3_6_mesi', '3-6 mesi', state.timing === '3_6_mesi'),
      optionButton('timing', '6_mesi_plus', 'Oltre 6 mesi', state.timing === '6_mesi_plus'),
      '</div>',
      '<div class="visioni-module__optiongrid">',
      optionButton('objective', 'prevendita', 'Prevendita', state.objective === 'prevendita'),
      optionButton('objective', 'raccolta_domanda', 'Raccolta domanda', state.objective === 'raccolta_domanda'),
      optionButton('objective', 'analisi', 'Analisi', state.objective === 'analisi'),
      optionButton('objective', 'commercializzazione', 'Commercializzazione', state.objective === 'commercializzazione'),
      '</div>',
      '<label class="visioni-module__textarea">Note progetto<textarea id="cantiere_notes">' + escapeHtml(state.notes) + '</textarea></label>',
      '<label class="visioni-platform-app__toggle"><input type="checkbox" id="cantiere_privacy" ' + (state.privacy ? 'checked' : '') + ' /><span><strong>Confermo privacy e contatto operativo</strong><small>Autorizzo 2D a prendere in carico la richiesta e costruire il percorso commerciale corretto per il progetto.</small></span></label>'
    ].join('');
    stage.querySelector('#cantiere_notes').addEventListener('input', function (e) { setField('notes', e.target.value); });
    stage.querySelector('#cantiere_privacy').addEventListener('change', function (e) { setField('privacy', !!e.target.checked); });
    bindOptionButtons();
  }

  function renderStage() {
    renderSteps();
    renderSummary();
    prevBtn.disabled = state.step === 1 || state.loading;
    nextBtn.disabled = state.loading;
    nextBtn.textContent = state.step === 3 ? (state.loading ? 'Invio in corso...' : 'Attiva Cantiere') : 'Continua';
    if (state.step === 1) renderStep1();
    else if (state.step === 2) renderStep2();
    else renderStep3();
  }

  function validateStep() {
    if (state.step === 1) return String(state.nome || '').trim() !== '' && String(state.email || '').trim() !== '';
    if (state.step === 2) return String(state.projectName || '').trim() !== '' && String(state.city || '').trim() !== '';
    if (state.step === 3) return !!state.privacy;
    return true;
  }

  function submit() {
    state.loading = true;
    renderStage();
    setHint('Sto registrando il progetto in Cantiere.');
    api('/cantiere/intakes', 'POST', state)
      .then(function (data) {
        stage.innerHTML = [
          '<div class="visioni-module__success">',
          '<p class="visioni-platform-app__eyebrow">Progetto registrato</p>',
          '<h3>Cantiere e stato attivato</h3>',
          '<p>Il percorso impresa e stato acquisito correttamente. Ora il sistema puo impostare prevendita, domanda o commercializzazione in modo controllato.</p>',
          '<div class="visioni-module__successgrid">',
          '<div><span>Lead score</span><strong>' + escapeHtml(String(data.leadScore || 0)) + '/100</strong></div>',
          '<div><span>Prossimo step</span><strong>' + escapeHtml(data.nextStep || 'Analisi operativa') + '</strong></div>',
          '</div>',
          '<div class="visioni-platform-app__actions">',
          '<a class="visioni-platform-app__launch" href="' + escapeHtml(cfg.platformUrl || '/platform/') + '">Torna alla Platform</a>',
          '<a class="visioni-platform-app__ghostlink" href="' + escapeHtml(cfg.advisorUrl || '/my-area/advisor/') + '">Apri Advisor</a>',
          '</div>',
          '</div>'
        ].join('');
        nextBtn.disabled = true;
        prevBtn.disabled = true;
        setHint('Progetto registrato correttamente.');
        try { window.localStorage.removeItem(storageKey); } catch (_) {}
      })
      .catch(function (error) {
        state.loading = false;
        renderStage();
        setHint(error && error.message ? error.message : 'Errore durante il salvataggio.');
      });
  }

  nextBtn.addEventListener('click', function () {
    if (!validateStep()) {
      if (state.step === 1) setHint('Inserisci almeno nome ed email validi.');
      else if (state.step === 2) setHint('Indica nome progetto e localita.');
      else setHint('Devi confermare privacy e contatto operativo.');
      return;
    }
    setHint('');
    if (state.step < 3) {
      state.step += 1;
      saveState();
      renderStage();
      return;
    }
    submit();
  });

  prevBtn.addEventListener('click', function () {
    if (state.step <= 1 || state.loading) return;
    state.step -= 1;
    saveState();
    renderStage();
  });

  loadState();
  renderStage();
})();
