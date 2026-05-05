/*
 * Service worker (InjectManifest mode)
 * Estratégias:
 *   - Static shell (HTML/JS/CSS): precache + stale-while-revalidate
 *   - Imagens/ícones: cache-first (longa duração)
 *   - API Supabase: network-first (sem cache — dados em tempo real)
 *   - Fontes Google/Material: cache-first
 */

declare const self: ServiceWorkerGlobalScope & typeof globalThis & { skipWaiting: () => void };

import { clientsClaim, type WorkboxPlugin } from 'workbox-core';
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Workbox plugins têm callbacks opcionais tipados como T|undefined, incompatível com exactOptionalPropertyTypes
const p = <T>(plugin: T): WorkboxPlugin => plugin as unknown as WorkboxPlugin;

void self.skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

if (import.meta.env.PROD) {
  registerRoute(
    new NavigationRoute(createHandlerBoundToURL(import.meta.env.PWA_FALLBACK_HTML), {
      denylist: [new RegExp(import.meta.env.PWA_SERVICE_WORKER_REGEX), /workbox-(.)*\.js$/],
    }),
  );
}

// Fontes Google e Material Icons — cache-first, 1 ano
registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com' ||
    url.origin === 'https://cdn.jsdelivr.net',
  new CacheFirst({
    cacheName: 'litrofy-fonts',
    plugins: [
      p(new CacheableResponsePlugin({ statuses: [0, 200] })),
      p(new ExpirationPlugin({ maxAgeSeconds: 60 * 60 * 24 * 365 })),
    ],
  }),
);

// Imagens e ícones — cache-first, 30 dias
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'litrofy-images',
    plugins: [
      p(new CacheableResponsePlugin({ statuses: [0, 200] })),
      p(new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 })),
    ],
  }),
);

// API Supabase — network-first (sem cache para garantir dados frescos)
registerRoute(
  ({ url }) => url.hostname.includes('supabase.co'),
  new NetworkFirst({
    cacheName: 'litrofy-api',
    networkTimeoutSeconds: 10,
    plugins: [
      p(new CacheableResponsePlugin({ statuses: [0, 200] })),
      p(new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 5 })),
    ],
  }),
);

// JS/CSS de terceiros — stale-while-revalidate
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'litrofy-assets',
    plugins: [p(new CacheableResponsePlugin({ statuses: [0, 200] }))],
  }),
);
