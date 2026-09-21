document.addEventListener('DOMContentLoaded', () => {
  const mode = document.body.dataset.authMode;
  const form = document.getElementById('auth-form');
  const statusEl = document.getElementById('auth-status');

  if (!form || !statusEl) {
    return;
  }

  const config = window.__SUPABASE_CONFIG__ || {};
  const supabaseUrl = config.url || '';
  const supabaseAnonKey = config.anonKey || '';

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('YOUR_PROJECT_REF') || supabaseAnonKey.includes('YOUR_PUBLIC_ANON_KEY')) {
    statusEl.textContent = 'Supabase is not configured yet. Add your public URL and anon key in the environment config before using the auth pages.';
    statusEl.className = 'auth-status error';
    form.querySelector('button[type="submit"]').disabled = true;
    return;
  }

  const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

  const setStatus = (type, message) => {
    statusEl.textContent = message;
    statusEl.className = `auth-status ${type}`;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '').trim();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus('error', 'Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setStatus('error', 'Password must be at least 6 characters long.');
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = mode === 'register' ? 'SIGNING UP...' : 'LOGGING IN...';

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email, password });

        if (error) {
          throw error;
        }

        setStatus('success', 'Account created successfully. Please check your email for confirmation, then log in to continue.');
        form.reset();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          throw error;
        }

        setStatus('success', 'Login successful. Redirecting to your dashboard...');
        window.location.href = 'dashboard.html';
      }
    } catch (error) {
      const message = error?.message || 'Something went wrong. Please try again.';
      setStatus('error', message);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = mode === 'register' ? 'CREATE ACCOUNT' : 'LOG IN';
    }
  });
});
