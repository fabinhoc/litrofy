/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PROD: boolean;
  readonly DEV: boolean;

  // variáveis do Quasar PWA
  readonly SERVICE_WORKER_FILE: string;
  readonly PWA_FALLBACK_HTML: string;
  readonly PWA_SERVICE_WORKER_REGEX: string;

  // suas variáveis (exemplo)
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
