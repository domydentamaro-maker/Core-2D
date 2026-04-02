(function () {
  if (typeof window === 'undefined') return;
  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
  });

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('visioni-platform-install');
    if (!btn) return;
    btn.addEventListener('click', async function () {
      if (!deferredPrompt) {
        alert('Installazione non disponibile su questo dispositivo/browser al momento.');
        return;
      }
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/wp-content/plugins/visioni-platform/visioni-platform-sw.js').catch(function () {});
    }
  });
})();
