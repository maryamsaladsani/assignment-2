// js/theme.js
(() => {
    const root = document.documentElement;               // <html>
    const btn  = document.getElementById('theme-toggle'); // the toggle button

    if (!btn) return; // safety

    // 1) Decide initial theme: saved value → system preference → default dark
    const saved = localStorage.getItem('theme'); // 'light' | 'dark' | null
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initial = saved ?? (systemPrefersLight ? 'light' : 'dark');

    const applyTheme = (mode) => {
        if (mode === 'light') {
            root.classList.add('theme-light');     //  CSS variables switch on this class
            btn.textContent = '☀️';
            btn.setAttribute('aria-pressed', 'true');
        } else {
            root.classList.remove('theme-light');
            btn.textContent = '🌙';
            btn.setAttribute('aria-pressed', 'false');
        }
    };

    // Apply on load
    applyTheme(initial);

    // 2) Toggle on click + persist
    btn.addEventListener('click', () => {
        const next = root.classList.contains('theme-light') ? 'dark' : 'light';
        applyTheme(next);
        localStorage.setItem('theme', next);
    });
})();

// ----- Personalized Greeting with localStorage -----
(function () {
    const greetingEl = document.getElementById('greeting');
    const form = document.getElementById('usernameForm');
    const input = document.getElementById('usernameInput');
    const changeBtn = document.getElementById('changeNameBtn');

    if (!greetingEl) return; // safely exit if markup missing

    function partOfDay() {
        const h = new Date().getHours();
        return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
    }

    function canStore() {
        try {
            const k = '__t';
            localStorage.setItem(k, '1'); localStorage.removeItem(k);
            return true;
        } catch { return false; }
    }

    function render() {
        const name = canStore() ? localStorage.getItem('username') : null;
        const text = name ? `Good ${partOfDay()}, ${name}!` : `Good ${partOfDay()}!`;
        greetingEl.textContent = text;

        // Show form only if no name saved
        const hasName = Boolean(name);
        if (form) form.classList.toggle('hidden', hasName);
        if (changeBtn) changeBtn.classList.toggle('hidden', !hasName);
    }

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const v = input.value.trim();
        if (v.length >= 2 && canStore()) {
            localStorage.setItem('username', v);
            input.value = '';
            render();
        }
    });

    changeBtn?.addEventListener('click', () => {
        // let user update their stored name
        form.classList.remove('hidden');
        input.focus();
    });

    render();
})();