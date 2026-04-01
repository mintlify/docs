(function() {
  if (typeof window === 'undefined') return;
  if (typeof window.signals !== 'undefined') return;
  var script = document.createElement('script');
  script.src = 'https://cdn.cr-proxy.com/v1/site/490c2ca5-fc40-4750-bfa5-6194ac5883a6/signals.js';
  script.async = true;
  window.signals = Object.assign(
    [],
    { _opts: { apiHost: 'https://api.cr-proxy.com' } },
    ['page', 'identify', 'form'].reduce(function (acc, method){
      acc[method] = function () {
        signals.push([method, arguments]);
        return signals;
      };
     return acc;
    }, {})
  );
  document.head.appendChild(script);
})();
