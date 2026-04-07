(function () {
  if (typeof window === "undefined") return;

  var cfg = window.VisioniPlatformAppConfig || {};
  var deferredPrompt = null;

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
      btn.textContent = "Installa l'app";
      setHint("Installazione diretta disponibile da questo browser.");
      return;
    }

    if (isIos()) {
      btn.disabled = false;
      btn.textContent = "Guida installazione";
      setHint("Su iPhone usa Condividi > Aggiungi a Home per installarla.");
      return;
    }

    btn.disabled = false;
    btn.textContent = "Installa l'app";
    setHint("Se il browser non mostra il prompt, torna qui dopo aver visitato Radar.");
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || !cfg.swUrl) return;
    navigator.serviceWorker.register(cfg.swUrl, { scope: "/" }).catch(function () {});
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

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("visioni-platform-install");

    registerServiceWorker();
    updateInstallUi();

    if (!btn) return;

    btn.addEventListener("click", async function () {
      if (isStandalone()) {
        return;
      }

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
        window.alert("Per installare 2D Radar su iPhone: apri il menu Condividi di Safari e scegli 'Aggiungi a Home'.");
        return;
      }

      window.alert("Installazione non disponibile in questo momento. Apri prima Radar e assicurati che il browser supporti l'installazione PWA.");
    });
  });
})();
