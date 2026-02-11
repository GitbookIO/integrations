/**
 * ABOUTME: DevTune AI Traffic tracking beacon for GitBook sites.
 * Tracks page views including SPA navigations (pushState/popstate).
 * The <SNIPPET_KEY> placeholder is replaced server-side by the integration.
 */
(function (win, doc) {
  var snippetKey = '<SNIPPET_KEY>';
  var endpoint = 'https://devtune.ai/api/v1/llm-traffic/collect';

  var sid;
  try {
    sid = sessionStorage.getItem('dt_sid');
    if (!sid) {
      sid = 'dt_' + Math.random().toString(36).substring(2);
      sessionStorage.setItem('dt_sid', sid);
    }
  } catch {
    sid = 'dt_' + Math.random().toString(36).substring(2);
  }

  var currentPath;

  function track() {
    if (currentPath === win.location.pathname) {
      return;
    }
    currentPath = win.location.pathname;

    var payload = {
      key: snippetKey,
      url: win.location.href,
      path: win.location.pathname,
      title: doc.title,
      ua: navigator.userAgent,
      ref: doc.referrer,
      sid: sid,
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, JSON.stringify(payload));
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint, true);
      xhr.setRequestHeader('Content-Type', 'text/plain');
      xhr.send(JSON.stringify(payload));
    }
  }

  // SPA navigation detection (GitBook uses pushState for page transitions)
  var originalPushState = win.history.pushState;
  if (originalPushState) {
    win.history.pushState = function () {
      originalPushState.apply(this, arguments);
      track();
    };
    win.addEventListener('popstate', track);
  }

  // Handle prerendered pages
  if (doc.visibilityState === 'prerender') {
    doc.addEventListener('visibilitychange', function () {
      if (!currentPath && doc.visibilityState === 'visible') {
        track();
      }
    });
  } else {
    track();
  }
})(window, document);
