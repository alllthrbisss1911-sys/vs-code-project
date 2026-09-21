(function () {
  const runtimeEnv = window.__ENV__ || {};

  window.__SUPABASE_CONFIG__ = {
    url: runtimeEnv.SUPABASE_URL || 'https://YOUR_PROJECT_REF.supabase.co',
    anonKey: runtimeEnv.SUPABASE_ANON_KEY || 'YOUR_PUBLIC_ANON_KEY'
  };
})();
