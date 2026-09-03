const tg = window.Telegram?.WebApp;

// ===============================
// TELEGRAM MINI APP
// ===============================

if (tg) {
  tg.ready();
  tg.expand();

  // Автоматически применяем тему Telegram
  applyTelegramTheme();

  // Кнопка "Назад" Telegram
  if (tg.BackButton) {
    tg.BackButton.onClick(() => {
      const activePage = document.querySelector('.page.active');

      if (activePage && activePage.id !== 'home') {
        show('home');
      } else {
        tg.close();
      }
    });
  }
}

// ===============================
// ДАННЫЕ
// ===============================

const data = [
  {
    id: 1,
    cat: 'ПРИРОДА',
    title: 'Горы, которые хочется увидеть своими глазами',
    text: 'Дикие пейзажи и места, где человек остаётся гостем.',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 2,
    cat: 'ОКЕАН',
    title: 'Там, где суша встречается с океаном',
    text: 'Береговая линия, ветер и бесконечный горизонт.',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 3,
    cat: 'ЖИВОТНЫЕ',
    title: 'Жизнь дикой природы крупным планом',
    text: 'Удивительные обитатели нашей планеты.',
    img: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 4,
    cat: 'ПУТЕШЕСТВИЯ',
    title: 'Места, которые выглядят нереально',
    text: 'Природные чудеса со всех уголков Земли.',
    img: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 5,
    cat: 'КОСМОС',
    title: 'Ночь, когда небо становится главным',
    text: 'Звёзды, тишина и бесконечность над головой.',
    img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 6,
    cat: 'АРХИТЕКТУРА',
    title: 'Человек и ландшафт',
    text: 'Необычные места, где история встречается с природой.',
    img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80'
  }
];

const cats = [
  ['ПРИРОДА', 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=80'],
  ['ЖИВОТНЫЕ', 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=700&q=80'],
  ['ОКЕАН', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80'],
  ['ПУТЕШЕСТВИЯ', 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=700&q=80'],
  ['КОСМОС', 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=700&q=80'],
  ['ФОТО ДНЯ', 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80']
];

// ===============================
// ИЗБРАННОЕ
// ===============================

let favorites = [];

try {
  favorites = JSON.parse(
    localStorage.getItem('ng_favorites') || '[]'
  );
} catch {
  favorites = [];
}

// ===============================
// TELEGRAM ТЕМА
// ===============================

function applyTelegramTheme() {
  if (!tg?.themeParams) return;

  const root = document.documentElement;
  const theme = tg.themeParams;

  if (theme.bg_color) {
    root.style.setProperty('--bg', theme.bg_color);
  }

  if (theme.secondary_bg_color) {
    root.style.setProperty('--card', theme.secondary_bg_color);
  }

  if (theme.text_color) {
    root.style.setProperty('--text', theme.text_color);
  }

  if (theme.hint_color) {
    root.style.setProperty('--muted', theme.hint_color);
  }

  if (theme.link_color) {
    root.style.setProperty('--accent', theme.link_color);
  }
}

// ===============================
// КАРТОЧКА
// ===============================

function card(item) {
  const saved = favorites.includes(item.id);

  return `
    <article class="card">
      <img
        src="${item.img}"
        alt="${item.title}"
        loading="lazy"
      >

      <div class="card-body">

        <button
          class="heart ${saved ? 'saved' : ''}"
          onclick="toggleFav(${item.id})"
          aria-label="Добавить в избранное"
        >
          ${saved ? '♥' : '♡'}
        </button>

        <div class="tag">${item.cat}</div>

        <h3>${item.title}</h3>

        <p>${item.text}</p>

      </div>
    </article>
  `;
}

// ===============================
// РЕНДЕР
// ===============================

function render() {
  document.getElementById('latest').innerHTML =
    data.slice(0, 4).map(card).join('');

  document.getElementById('popular').innerHTML =
    data.slice(2, 6)
      .map(x => `
        <div class="mini">
          <img src="${x.img}" alt="${x.title}" loading="lazy">
          <span>${x.title}</span>
        </div>
      `)
      .join('');

  document.getElementById('categoryGrid').innerHTML =
    cats
      .map(c => `
        <button
          class="category"
          onclick="filterCat('${c[0]}')"
        >
          <img src="${c[1]}" alt="${c[0]}" loading="lazy">
          <strong>${c[0]}</strong>
        </button>
      `)
      .join('');

  renderFav();
}

// ===============================
// ИЗБРАННОЕ
// ===============================

function toggleFav(id) {

  if (favorites.includes(id)) {
    favorites = favorites.filter(x => x !== id);

    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('light');
    }

  } else {
    favorites = [...favorites, id];

    if (tg?.HapticFeedback) {
      tg.HapticFeedback.notificationOccurred('success');
    }
  }

  localStorage.setItem(
    'ng_favorites',
    JSON.stringify(favorites)
  );

  render();
}

function renderFav() {

  const list = data.filter(x =>
    favorites.includes(x.id)
  );

  document.getElementById('favoritesList').innerHTML =
    list.map(card).join('');

  document.getElementById('emptyFav').style.display =
    list.length ? 'none' : 'block';
}

// ===============================
// НАВИГАЦИЯ
// ===============================

function show(page) {

  document.querySelectorAll('.page')
    .forEach(x => x.classList.remove('active'));

  const target = document.getElementById(page);

  if (!target) return;

  target.classList.add('active');

  document.querySelectorAll('.nav-item')
    .forEach(x => {
      x.classList.toggle(
        'active',
        x.dataset.page === page
      );
    });

  // Telegram BackButton
  if (tg?.BackButton) {

    if (page === 'home') {
      tg.BackButton.hide();
    } else {
      tg.BackButton.show();
    }
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// ===============================
// КНОПКИ НАВИГАЦИИ
// ===============================

document
  .querySelectorAll('[data-page]')
  .forEach(button => {

    button.addEventListener(
      'click',
      () => {

        const page = button.dataset.page;

        show(page);

        if (tg?.HapticFeedback) {
          tg.HapticFeedback.selectionChanged();
        }
      }
    );

  });

// ===============================
// ПОИСК
// ===============================

document.getElementById('searchBtn').onclick = () => {

  show('search');

  document.getElementById('searchInput').focus();

  if (tg?.HapticFeedback) {
    tg.HapticFeedback.impactOccurred('light');
  }
};

document.getElementById('searchInput').oninput = e => {

  const q = e.target.value
    .toLowerCase()
    .trim();

  const results = data.filter(x =>
    (
      x.title +
      x.text +
      x.cat
    )
      .toLowerCase()
      .includes(q)
  );

  document.getElementById('searchResults').innerHTML =
    results.map(card).join('');
};

// ===============================
// ФИЛЬТР КАТЕГОРИИ
// ===============================

function filterCat(cat) {

  show('search');

  const input =
    document.getElementById('searchInput');

  input.value = cat;

  document.getElementById('searchResults').innerHTML =
    data
      .filter(x => x.cat === cat)
      .map(card)
      .join('');

  if (tg?.HapticFeedback) {
    tg.HapticFeedback.selectionChanged();
  }
}

// ===============================
// ПОДЕЛИТЬСЯ ПРИЛОЖЕНИЕМ
// ===============================

document.getElementById('shareBtn').onclick = () => {

  const appUrl =
    'https://t.me/NationalGeographicMiniBot?startapp';

  const text =
    '🌍 National Geographic — открой приложение и исследуй мир!';

  const shareUrl =
    'https://t.me/share/url?url=' +
    encodeURIComponent(appUrl) +
    '&text=' +
    encodeURIComponent(text);

  if (tg?.openTelegramLink) {

    tg.openTelegramLink(shareUrl);

  } else if (navigator.share) {

    navigator.share({
      title: 'National Geographic',
      text,
      url: appUrl
    });

  } else if (navigator.clipboard) {

    navigator.clipboard.writeText(appUrl);

    alert('Ссылка на приложение скопирована');

  }
};

// ===============================
// ТЕМА
// ===============================

document.getElementById('themeBtn').onclick = () => {

  if (tg?.showPopup) {

    tg.showPopup({
      title: 'Тема',
      message:
        'Приложение автоматически использует тему Telegram.',
      buttons: [
        {
          type: 'ok',
          text: 'Понятно'
        }
      ]
    });

  } else {

    alert(
      'В Telegram тема применяется автоматически.'
    );

  }
};

// ===============================
// ПОЛЬЗОВАТЕЛЬ TELEGRAM
// ===============================

function getTelegramUser() {

  if (!tg?.initDataUnsafe?.user) {
    return null;
  }

  return tg.initDataUnsafe.user;
}

const telegramUser = getTelegramUser();

if (telegramUser) {

  console.log(
    'Telegram user:',
    telegramUser.first_name,
    telegramUser.username || ''
  );
}

// ===============================
// СТАРТ
// ===============================

render();

if (tg?.BackButton) {
  tg.BackButton.hide();
}
