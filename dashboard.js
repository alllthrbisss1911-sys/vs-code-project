document.addEventListener('DOMContentLoaded', async () => {
  const config = window.__SUPABASE_CONFIG__ || {};
  const url = config.url || '';
  const anonKey = config.anonKey || '';
  const statusEl = document.getElementById('dashboard-status');
  const logoutButton = document.getElementById('logout-button');

  if (!url || !anonKey || url.includes('YOUR_PROJECT_REF') || anonKey.includes('YOUR_PUBLIC_ANON_KEY')) {
    if (statusEl) {
      statusEl.textContent = 'Supabase is not configured yet. Set your public URL and anon key before opening the dashboard.';
      statusEl.className = 'dashboard-status error';
    }
    return;
  }

  const supabase = window.supabase.createClient(url, anonKey);

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    window.location.href = 'login.html';
    return;
  }

  const userEmail = document.getElementById('user-email');
  const welcomeText = document.getElementById('welcome-text');

  if (userEmail) {
    userEmail.textContent = data.user.email || 'User';
  }

  if (welcomeText) {
    welcomeText.textContent = `Welcome back, ${data.user.email || 'friend'}!`;
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.href = 'login.html';
    });
  }
});
