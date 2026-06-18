/*!
 * apex-track.js — Mindset Caro "Open Door" client SDK
 * Drop this into ANY website/app to push & track data into the Apex ingest endpoint.
 *
 * Plain <script> usage:
 *   <script src="https://YOUR-DOMAIN/mindset-caro/embed/apex-track.js"
 *           data-source-app="carolina-app"
 *           data-endpoint="https://YOUR-DOMAIN/api/ingest"
 *           data-auto-pageview="true"></script>
 *   <script>
 *     ApexTrack.track('signup', { email: 'a@b.com', plan: 'pro' });
 *   </script>
 *
 * Bundler usage (CommonJS interop):
 *   import ApexTrack from './apex-track.js';   // or: const { createTracker } = require('./apex-track.js')
 *   const t = ApexTrack.createTracker({ sourceApp: 'carolina-app', endpoint: '/api/ingest' });
 *   t.track('signup', { email });
 *
 * In React, prefer ApexTracker.jsx (ApexProvider + useApexTracker).
 */
(function (global) {
  var VISITOR_KEY = 'apex_visitor_id';
  var SESSION_KEY = 'apex_session_id';

  function uid(prefix) {
    return prefix + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  }

  function getVisitorId() {
    try {
      var v = localStorage.getItem(VISITOR_KEY);
      if (!v) { v = uid('v_'); localStorage.setItem(VISITOR_KEY, v); }
      return v;
    } catch (e) { return uid('v_'); }
  }

  function getSessionId() {
    try {
      var s = sessionStorage.getItem(SESSION_KEY);
      if (!s) { s = uid('s_'); sessionStorage.setItem(SESSION_KEY, s); }
      return s;
    } catch (e) { return uid('s_'); }
  }

  function readUTM() {
    var utm = {};
    try {
      var q = new URLSearchParams(global.location ? global.location.search : '');
      ['source', 'medium', 'campaign', 'term', 'content'].forEach(function (k) {
        var val = q.get('utm_' + k);
        if (val) utm[k] = val;
      });
    } catch (e) {}
    return utm;
  }

  function createTracker(opts) {
    opts = opts || {};
    var endpoint = opts.endpoint || '/api/ingest';
    var sourceApp = opts.sourceApp || 'unknown-app';
    var ingestKey = opts.ingestKey || null; // only if the endpoint enforces x-ingest-key
    var visitorId = getVisitorId();
    var sessionId = getSessionId();

    function track(event, payload) {
      var body = {
        source_app: sourceApp,
        event: event,
        visitor_id: visitorId,
        session_id: sessionId,
        payload: payload || {},
        url: global.location ? global.location.href : null,
        referrer: global.document ? global.document.referrer : null,
        utm: readUTM(),
      };
      var headers = { 'Content-Type': 'application/json' };
      if (ingestKey) headers['x-ingest-key'] = ingestKey;

      // Prefer fetch with keepalive so events survive page unload.
      try {
        return fetch(endpoint, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(body),
          keepalive: true,
        }).then(function (r) { return r.json().catch(function () { return {}; }); });
      } catch (e) {
        return Promise.resolve({ ok: false, error: String(e) });
      }
    }

    return {
      track: track,
      pageview: function (extra) { return track('pageview', extra || {}); },
      identify: function (traits) { return track('identify', traits || {}); },
      visitorId: visitorId,
      sessionId: sessionId,
    };
  }

  // Auto-init from the <script> tag's data-* attributes.
  function autoInit() {
    if (!global.document) return;
    var el = global.document.currentScript ||
      (function () { var s = global.document.getElementsByTagName('script'); return s[s.length - 1]; })();
    if (!el) return;
    var sourceApp = el.getAttribute('data-source-app');
    if (!sourceApp) return;
    var t = createTracker({
      sourceApp: sourceApp,
      endpoint: el.getAttribute('data-endpoint') || '/api/ingest',
      ingestKey: el.getAttribute('data-ingest-key') || null,
    });
    global.ApexTrack = t;
    if (el.getAttribute('data-auto-pageview') === 'true') t.pageview();
  }

  // Exports — classic <script>, CommonJS bundler, and ESM-interop friendly.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createTracker: createTracker };
  }
  if (global.document) {
    global.ApexTrackFactory = { createTracker: createTracker };
    autoInit();
  }
})(typeof window !== 'undefined' ? window : globalThis);
