const BLOG_URL = 'https://gigmode.uprealband.com';
const FEED_URL = `${BLOG_URL}/feeds/posts/default?alt=json-in-script&max-results=50`;
const CACHE_KEY = 'gigmode-blogger-feed-v1';
const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function loadFeed(url) {
  return new Promise((resolve, reject) => {
    const callbackName = 'gmFeed' + Date.now();
    const script = document.createElement('script');
    const timeout = setTimeout(() => {
      delete window[callbackName];
      script.remove();
      reject(new Error('Feed timeout'));
    }, 12000);

    window[callbackName] = data => {
      clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
      resolve(data);
    };

    script.onerror = () => {
      clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
      reject(new Error('Feed request failed'));
    };

    script.src = url + '&callback=' + callbackName;
    document.head.appendChild(script);
  });
}

const labels = entry => (entry.category || []).map(item => item.term);
const title = entry => entry.title?.$t || 'Untitled';
const link = entry => entry.link?.find(item => item.rel === 'alternate')?.href || '#';

function plain(html) {
  const node = document.createElement('div');
  node.innerHTML = html || '';
  return (node.textContent || '').replace(/\\s+/g, ' ').trim();
}

function formatDate(entry) {
  const value = entry.published?.$t || entry.updated?.$t;
  if (!value) return '';
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();
}

function card(entry, index, foundation) {
  const article = document.createElement('article');
  article.className = foundation ? 'foundation-card' : 'post-card';

  if (foundation) {
    article.innerHTML = `<div class="card-meta">FOUNDATION / UNIVERSE <span class="card-number">${String(index + 1).padStart(2, '0')}</span></div><h3></h3><span class="card-arrow">↗</span>`;
    article.querySelector('h3').textContent = title(entry);
    article.tabIndex = 0;
    article.setAttribute('role', 'link');
    article.addEventListener('click', () => { window.location.href = link(entry); });
    article.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.location.href = link(entry);
      }
    });
  } else {
    article.innerHTML = '<div class="post-label"></div><h3></h3><p></p><a>READ TRANSMISSION ↗</a>';
    article.querySelector('.post-label').textContent =
      (labels(entry)[0] || 'TRANSMISSION') + (formatDate(entry) ? ' / ' + formatDate(entry) : '');
    article.querySelector('h3').textContent = title(entry);
    article.querySelector('p').textContent =
      plain(entry.summary?.$t || entry.content?.$t).slice(0, 170);
    article.querySelector('a').href = link(entry);
  }

  return article;
}

function saveFeed(entries) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      savedAt: Date.now(),
      entries
    }));
  } catch (error) {
    console.warn('GIG MODE: unable to save feed cache', error);
  }
}

function readFeedCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (!cached || !Array.isArray(cached.entries)) return null;
    if (Date.now() - cached.savedAt > CACHE_MAX_AGE) return null;
    return cached.entries;
  } catch (error) {
    return null;
  }
}

function renderEntries(entries, options = {}) {
  const foundationGrid = document.querySelector('#foundationGrid');
  const latestPosts = document.querySelector('#latestPosts');
  const status = document.querySelector('#foundationStatus');
  // Foundation menampilkan seluruh artikel publik, tanpa membatasi satu label Blogger.
  const foundationEntries = entries.slice(0, 14);

  foundationGrid.innerHTML = '';
  latestPosts.innerHTML = '';

  if (foundationEntries.length) {
    foundationEntries.forEach((entry, index) => {
      foundationGrid.append(card(entry, index, true));
    });
    status.textContent = foundationEntries.length + ' FOUNDATION ARTICLES';
  } else {
    foundationGrid.innerHTML =
      '<p class="loading">Belum ada artikel foundation.</p>';
    status.textContent = 'FOUNDATION';
  }

  entries.slice(0, 3).forEach((entry, index) => {
    latestPosts.append(card(entry, index, false));
  });

  if (!entries.length) {
    latestPosts.innerHTML = '<p class="loading">Belum ada artikel publik.</p>';
  }

  if (options.cached) {
    status.textContent += ' · MENAMPILKAN DATA TERSIMPAN';
  }
}

async function init() {
  try {
    const data = await loadFeed(FEED_URL);
    const entries = data.feed?.entry || [];
    saveFeed(entries);
    renderEntries(entries);
  } catch (error) {
    console.warn('GIG MODE: Blogger feed unavailable', error);
    const cachedEntries = readFeedCache();

    if (cachedEntries) {
      renderEntries(cachedEntries, { cached: true });
    } else {
      document.querySelector('#foundationGrid').innerHTML =
        '<p class="loading">Konten belum dapat dimuat. Silakan coba kembali beberapa saat lagi.</p>';
      document.querySelector('#latestPosts').innerHTML =
        '<p class="loading">Transmisi sementara tidak tersedia.</p>';
      document.querySelector('#foundationStatus').textContent = 'FEED TEMPORARILY UNAVAILABLE';
    }
  }
}

document.querySelector('#menuToggle').addEventListener('click', () => {
  const nav = document.querySelector('#mainNav');
  const button = document.querySelector('#menuToggle');
  nav.classList.toggle('open');
  button.setAttribute('aria-expanded', nav.classList.contains('open'));
});

document.querySelectorAll('#mainNav a').forEach(anchor => {
  anchor.addEventListener('click', () => {
    document.querySelector('#mainNav').classList.remove('open');
  });
});

init();
