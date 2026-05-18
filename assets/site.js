(() => {
  const translations = window.NU_TRANSLATIONS || {};
  const key = 'nuapp-language';
  const fallback = window.NU_DEFAULT_LANGUAGE || 'en';
  const getInitialLanguage = () => localStorage.getItem(key) || fallback;

  function applyLanguage(language) {
    const table = translations[language] || translations.en || {};
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const value = table[element.dataset.i18n];
      if (value != null) element.textContent = value;
    });
    document.querySelectorAll('[data-language-toggle]').forEach((toggle) => {
      toggle.textContent = language === 'zh' ? 'EN' : 'CN';
      toggle.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文');
    });
    localStorage.setItem(key, language);
  }

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-language-toggle]');
    if (!toggle) return;
    const next = (localStorage.getItem(key) || fallback) === 'zh' ? 'en' : 'zh';
    applyLanguage(next);
  });

  applyLanguage(getInitialLanguage());
})();

