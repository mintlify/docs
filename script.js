const e = 'octolane_session_id',
  t = () =>
    `${crypto.randomUUID()}-${Math.random()
      .toString(36)
      .substring(2, 15)}-${new Date().getTime()}`,
  n = (n, o) => {
    const r = {
        api_key: n,
        event: {
          event_type: 'page_view',
          session_id: (() => {
            const n = document.cookie.split('; ');
            for (const t of n) {
              const [n, o] = t.split('=');
              if (n === e) return o;
            }
            return t();
          })(),
          page_title: o.title,
          page_url: o.href,
          referrer: o.referrer,
          url_change_type: o.url_change_type,
          favicon_url: o.favicon_url
            ? window.location.origin + o.favicon_url
            : null,
        },
      },
      c = new Blob([JSON.stringify(r)], { type: 'application/json' });
    navigator.sendBeacon('https://enrich.octolane.com/v1/events', c),
      'beforeunload' === o.url_change_type &&
        (document.cookie = `${e}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`);
  },
  o = (e) => {
    const t = (() => {
        const e = document.querySelectorAll('script');
        for (const t of e) {
          const e = t.getAttribute('src');
          if (e && e.startsWith('https://cdn.octolane.com/tag.js?pk=')) {
            const t = new URL(e).searchParams.get('pk');
            if (t) return t;
          }
        }
        return null;
      })(),
      o = {
        href: window.location.href,
        title: document.title,
        description:
          document
            .querySelector("meta[name='description']")
            ?.getAttribute('content') ?? '',
        referrer: document.referrer,
        favicon_url:
          document.querySelector("link[rel='icon']")?.getAttribute('href') ??
          '',
      };
    (o.url_change_type = e),
      t ? n(t, o) : console.error('[OCTOLANE] Misconfigured script tag key');
  };
function r(n = 'urlChange') {
  if ('onlanded' === n) {
    ((t) => {
      document.cookie = `${e}=${t}; path=/`;
    })(t());
  }
  o(n);
}
r('onlanded'),
  (() => {
    let e = document.location.href;
    new MutationObserver(() => {
      e !== document.location.href && ((e = document.location.href), r());
    }).observe(document.body, { childList: !0, subtree: !0 });
  })(),
  window.addEventListener('beforeunload', () => {
    r('beforeunload');
  });
