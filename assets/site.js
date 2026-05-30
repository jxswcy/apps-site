(() => {
  const translations = window.NU_TRANSLATIONS || {};
  const key = 'nuapp-language';
  const fallback = window.NU_DEFAULT_LANGUAGE || 'en';
  const getInitialLanguage = () => localStorage.getItem(key) || fallback;
  const appStoreLanguageDefaults = {
    zh: 'cn',
    ja: 'jp',
    ko: 'kr',
    en: 'us',
  };
  const appStoreTimeZoneDefaults = {
    'Asia/Shanghai': 'cn',
    'Asia/Chongqing': 'cn',
    'Asia/Harbin': 'cn',
    'Asia/Urumqi': 'cn',
    'Asia/Hong_Kong': 'hk',
    'Asia/Macau': 'mo',
    'Asia/Taipei': 'tw',
    'Asia/Tokyo': 'jp',
    'Asia/Seoul': 'kr',
  };

  function getLocaleParts(locale) {
    const normalized = String(locale || '').replace('_', '-').trim();
    if (!normalized) return { language: '', region: '' };
    const [language, region] = normalized.split('-');
    return {
      language: language.toLowerCase(),
      region: region && /^[a-z]{2}$/i.test(region) ? region.toLowerCase() : '',
    };
  }

  function getAppStoreCountry(language) {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (appStoreTimeZoneDefaults[timeZone]) {
      return appStoreTimeZoneDefaults[timeZone];
    }

    const candidates = [...(navigator.languages || []), navigator.language, fallback];

    for (const locale of candidates) {
      const { region } = getLocaleParts(locale);
      if (region) return region;
    }

    for (const locale of candidates) {
      const { language: localeLanguage } = getLocaleParts(locale);
      if (appStoreLanguageDefaults[localeLanguage]) {
        return appStoreLanguageDefaults[localeLanguage];
      }
    }

    if (appStoreLanguageDefaults[language]) {
      return appStoreLanguageDefaults[language];
    }

    return 'us';
  }

  function updateAppStoreLinks(language) {
    const country = getAppStoreCountry(language);
    document.querySelectorAll('[data-app-store-link]').forEach((link) => {
      const { appStoreId, appStoreSlug } = link.dataset;
      if (!appStoreId || !appStoreSlug) return;
      link.href = `https://apps.apple.com/${country}/app/${encodeURIComponent(appStoreSlug)}/id${encodeURIComponent(appStoreId)}`;
    });
  }

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
    updateAppStoreLinks(language);
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
