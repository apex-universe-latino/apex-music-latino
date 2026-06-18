// ApexTracker.jsx — React binding for the Mindset Caro "Open Door"
// Lets another React application connect and push tracked data with one hook.
//
//   import { ApexProvider, useApexTracker } from './ApexTracker';
//
//   // 1. Wrap your app:
//   <ApexProvider sourceApp="carolina-app" endpoint="https://YOUR-DOMAIN/api/ingest">
//     <App />
//   </ApexProvider>
//
//   // 2. Anywhere inside:
//   const track = useApexTracker();
//   track('signup', { email, plan: 'pro' });

import React, { createContext, useContext, useMemo, useEffect, useRef } from 'react';

const ApexContext = createContext(null);

const VISITOR_KEY = 'apex_visitor_id';
const SESSION_KEY = 'apex_session_id';

function uid(prefix) {
  return prefix + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function persistentId(storage, key, prefix) {
  try {
    let v = storage.getItem(key);
    if (!v) { v = uid(prefix); storage.setItem(key, v); }
    return v;
  } catch {
    return uid(prefix);
  }
}

function readUTM() {
  const utm = {};
  try {
    const q = new URLSearchParams(window.location.search);
    ['source', 'medium', 'campaign', 'term', 'content'].forEach((k) => {
      const val = q.get('utm_' + k);
      if (val) utm[k] = val;
    });
  } catch { /* noop */ }
  return utm;
}

export function ApexProvider({
  sourceApp,
  endpoint = '/api/ingest',
  ingestKey = null,
  autoPageview = true,
  children,
}) {
  const ids = useRef(null);
  if (!ids.current && typeof window !== 'undefined') {
    ids.current = {
      visitorId: persistentId(window.localStorage, VISITOR_KEY, 'v_'),
      sessionId: persistentId(window.sessionStorage, SESSION_KEY, 's_'),
    };
  }

  const api = useMemo(() => {
    const track = (event, payload = {}) => {
      const body = {
        source_app: sourceApp || 'unknown-app',
        event,
        visitor_id: ids.current?.visitorId,
        session_id: ids.current?.sessionId,
        payload,
        url: typeof window !== 'undefined' ? window.location.href : null,
        referrer: typeof document !== 'undefined' ? document.referrer : null,
        utm: readUTM(),
      };
      const headers = { 'Content-Type': 'application/json' };
      if (ingestKey) headers['x-ingest-key'] = ingestKey;
      return fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        keepalive: true,
      })
        .then((r) => r.json().catch(() => ({})))
        .catch((e) => ({ ok: false, error: String(e) }));
    };
    return {
      track,
      pageview: (extra = {}) => track('pageview', extra),
      identify: (traits = {}) => track('identify', traits),
      visitorId: ids.current?.visitorId,
      sessionId: ids.current?.sessionId,
    };
  }, [sourceApp, endpoint, ingestKey]);

  useEffect(() => {
    if (autoPageview) api.pageview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ApexContext.Provider value={api}>{children}</ApexContext.Provider>;
}

// Returns the bound `track` function. Throws a friendly error if used outside the provider.
export function useApexTracker() {
  const ctx = useContext(ApexContext);
  if (!ctx) throw new Error('useApexTracker must be used within an <ApexProvider>.');
  return ctx.track;
}

// Full API (track, pageview, identify, ids) if you need more than track().
export function useApex() {
  const ctx = useContext(ApexContext);
  if (!ctx) throw new Error('useApex must be used within an <ApexProvider>.');
  return ctx;
}
