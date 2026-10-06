(function() {
  const SUPPORTED_LANGS = ['en', 'es', 'pt', 'ar', 'fr', 'de', 'it', 'nl'];

  // Dynamically fix <base> tag for local file:// preview so assets load from parent directory
  if (window.location.protocol === 'file:') {
    const baseEl = document.querySelector('base');
    if (baseEl && baseEl.getAttribute('href') === '/') {
      baseEl.setAttribute('href', '../');
    }
  }

  function getCurrentLang() {
    // 1. Check HTML lang attribute first (most reliable across static translated pages)
    const htmlLang = (document.documentElement.lang || '').toLowerCase();
    if (SUPPORTED_LANGS.includes(htmlLang)) {
      return htmlLang;
    }
    // 2. Check URL path segments
    const segments = window.location.pathname.split('/').filter(Boolean);
    for (let i = segments.length - 1; i >= 0; i--) {
      const seg = segments[i].toLowerCase();
      if (SUPPORTED_LANGS.includes(seg)) {
        return seg;
      }
    }
    return 'en';
  }

  function getTargetUrl(targetLang) {
    const isFile = window.location.protocol === 'file:';
    
    if (isFile) {
      // Local filesystem: file:///W:/PT%20WHX/index.html or file:///W:/PT%20WHX/de/index.html
      const url = new URL(window.location.href);
      let segments = url.pathname.split('/');
      
      // Determine filename (last segment)
      let fileName = 'index.html';
      if (segments.length > 0 && segments[segments.length - 1].includes('.')) {
        fileName = segments[segments.length - 1];
        segments.pop(); // remove filename
      } else if (segments.length > 0 && segments[segments.length - 1] === '') {
        segments.pop(); // remove trailing slash
      }
      
      // Check if the current directory segment is a language code
      if (segments.length > 0 && SUPPORTED_LANGS.includes(segments[segments.length - 1].toLowerCase())) {
        segments.pop(); // remove current language folder
      }
      
      // If target language is not English, insert the target language directory
      if (targetLang !== 'en') {
        segments.push(targetLang);
      }
      
      // Re-attach filename
      segments.push(fileName);
      
      url.pathname = segments.join('/');
      return url.href;
    }

    // Live Web Server (http/https):
    const pathname = window.location.pathname; // e.g. "/de/", "/de/index.html", "/", "/index.html"
    let segments = pathname.split('/').filter(Boolean);
    
    // Check if the first segment is a supported language
    const isRootLang = segments.length > 0 && SUPPORTED_LANGS.includes(segments[0].toLowerCase());
    
    if (isRootLang) {
      if (targetLang === 'en') {
        segments.shift(); // remove language prefix
      } else {
        segments[0] = targetLang; // replace language prefix
      }
    } else {
      if (targetLang !== 'en') {
        segments.unshift(targetLang); // add language prefix
      }
    }
    
    let newPath = '/' + segments.join('/');
    if ((pathname.endsWith('/') || segments.length === 0 || (segments.length === 1 && SUPPORTED_LANGS.includes(segments[0]))) && !newPath.endsWith('/') && !newPath.includes('.')) {
      newPath += '/';
    }
    
    return newPath + window.location.search + window.location.hash;
  }

  async function initLanguage() {
    const currentPathLang = getCurrentLang();
    let preferredLang = localStorage.getItem('whx_language');
    
    // Auto-detect if no saved preference
    if (!preferredLang) {
      if (navigator.languages && navigator.languages.length) {
        for (let l of navigator.languages) {
          let baseLang = l.split('-')[0].toLowerCase();
          if (SUPPORTED_LANGS.includes(baseLang)) {
            preferredLang = baseLang;
            break;
          }
        }
      }
      if (!preferredLang) preferredLang = 'en';
    }
    
    // Auto-redirect ONLY on live web servers (never on file://)
    if (window.location.protocol !== 'file:') {
      if (currentPathLang !== preferredLang && !sessionStorage.getItem('whx_redirected')) {
        sessionStorage.setItem('whx_redirected', 'true');
        if (preferredLang !== 'en') {
          const targetUrl = getTargetUrl(preferredLang);
          window.location.replace(targetUrl);
          return;
        }
      }
    }

    // Apply translations from locales if on web server
    await loadAndApplyTranslations(currentPathLang);
    setupLanguageSwitcher(currentPathLang);
  }

  async function loadAndApplyTranslations(lang) {
    if (window.location.protocol === 'file:') return; // Static HTML pages are pre-translated for local viewing
    try {
      const response = await fetch(`/locales/${lang}.json`);
      if (!response.ok) return;
      const translations = await response.json();
      
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            if (el.hasAttribute('placeholder')) {
              el.setAttribute('placeholder', translations[key]);
            } else {
              el.value = translations[key];
            }
          } else {
            el.innerHTML = translations[key];
          }
        }
      });
      
      // Set Arabic RTL
      if (lang === 'ar') {
        document.documentElement.lang = 'ar';
        document.documentElement.dir = 'rtl';
        document.body.classList.add('rtl-active');
      } else {
        document.documentElement.lang = lang;
        document.documentElement.dir = 'ltr';
        document.body.classList.remove('rtl-active');
      }
      
    } catch (e) {
      console.error('Failed to load translations', e);
    }
  }

  function setupLanguageSwitcher(currentLang) {
    const switchers = document.querySelectorAll('.language-switcher');
    switchers.forEach(switcher => {
      const currentSpan = switcher.querySelector('.current-lang');
      if (currentSpan) currentSpan.textContent = currentLang.toUpperCase();
      
      const dropdown = switcher.querySelector('.lang-dropdown');
      
      switcher.addEventListener('click', (e) => {
        // Toggle dropdown
        const isVisible = dropdown && dropdown.style.display === 'block';
        document.querySelectorAll('.lang-dropdown').forEach(d => d.style.display = 'none');
        if (dropdown && !isVisible) {
          dropdown.style.display = 'block';
        }
        e.stopPropagation();
      });

      document.addEventListener('click', () => {
        if (dropdown) dropdown.style.display = 'none';
      });

      const links = switcher.querySelectorAll('a[data-lang]');
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const targetLang = link.getAttribute('data-lang');
          
          if (targetLang === currentLang) {
            if (dropdown) dropdown.style.display = 'none';
            return;
          }
          
          localStorage.setItem('whx_language', targetLang);
          sessionStorage.setItem('whx_redirected', 'true');
          
          const targetUrl = getTargetUrl(targetLang);
          window.location.href = targetUrl;
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initLanguage);

})();
