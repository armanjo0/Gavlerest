const SUPPORTED_LANGUAGES = ['en', 'ar', 'ku'];
const RTL_LANGUAGES = ['ar', 'ku'];
const LANGUAGE_STORAGE_KEY = 'selectedLanguage';
const LEGACY_LANGUAGE_STORAGE_KEY = 'gavle-language';
const DEFAULT_LANGUAGE = 'en';

let currentLanguage = DEFAULT_LANGUAGE;
let sectionObserver = null;
let cardObserver = null;
let feedbackSubmitted = false;

const translations = {
  en: {
    documentTitle: 'GAVLE - Restaurant & Cafe',
    brand: {
      logo: 'GAV<span>LE</span>',
      name: 'GAVLE',
    },
    hero: {
      eyebrow: 'Restaurant & Cafe',
      tagline: 'Quality food, crafted with care',
    },
    buttons: {
      language: '🌐 Language',
      feedback: '✍️ Feedback',
      backToTop: 'Back to top',
      close: 'Close',
      sendFeedback: 'Send Feedback →',
    },
    labels: {
      phone: 'Phone',
      currency: 'IQD',
      menuCategories: 'Menu categories',
    },
    modals: {
      languageTitle: 'Choose Language',
      languageDescription: 'Choose your preferred menu language.',
      feedbackTitle: 'Share Feedback',
      feedbackDescription: "How was your experience? We'd love to hear from you.",
    },
    feedback: {
      placeholder: 'Tell us about your visit...',
      empty: 'Please write something first.',
      thanks: '✅ Thank you for your feedback!',
    },
    footer: {
      tagline: 'Restaurant & Cafe · Fine Food Daily',
      copy: '© 2025 GAVLE Restaurant & Cafe · All rights reserved',
    },
    empty: {
      menu: 'No menu items available.',
    },
  },
  ar: {
    documentTitle: 'گافلي - مطعم وكافيه',
    brand: {
      logo: 'گاف<span>لي</span>',
      name: 'گافلي',
    },
    hero: {
      eyebrow: 'مطعم وكافيه',
      tagline: 'طعام شهي محضر بعناية',
    },
    buttons: {
      language: '🌐 اللغة',
      feedback: '✍️ الملاحظات',
      backToTop: 'العودة إلى الأعلى',
      close: 'إغلاق',
      sendFeedback: 'إرسال الملاحظات ←',
    },
    labels: {
      phone: 'الهاتف',
      currency: 'دينار',
      menuCategories: 'أقسام القائمة',
    },
    modals: {
      languageTitle: 'اختر اللغة',
      languageDescription: 'اختر اللغة المفضلة لعرض القائمة.',
      feedbackTitle: 'شارك ملاحظاتك',
      feedbackDescription: 'كيف كانت تجربتك؟ يسعدنا سماع رأيك.',
    },
    feedback: {
      placeholder: 'اكتب لنا عن زيارتك...',
      empty: 'يرجى كتابة ملاحظة أولاً.',
      thanks: '✅ شكراً لملاحظاتك!',
    },
    footer: {
      tagline: 'مطعم وكافيه · طعام فاخر يومياً',
      copy: '© 2025 مطعم وكافيه گافلي · جميع الحقوق محفوظة',
    },
    empty: {
      menu: 'لا توجد أصناف متاحة حالياً.',
    },
  },
  ku: {
    documentTitle: 'گافلی - ڕێستورانت و کافێ',
    brand: {
      logo: 'گاف<span>لی</span>',
      name: 'گافلی',
    },
    hero: {
      eyebrow: 'ڕێستورانت و کافێ',
      tagline: 'خواردنی کوالیتی بە گرنگییەوە ئامادەکراوە',
    },
    buttons: {
      language: '🌐 زمان',
      feedback: '✍️ بۆچوون',
      backToTop: 'گەڕانەوە بۆ سەرەوە',
      close: 'داخستن',
      sendFeedback: 'ناردنی بۆچوون ←',
    },
    labels: {
      phone: 'تەلەفۆن',
      currency: 'دینار',
      menuCategories: 'بەشەکانی لیست',
    },
    modals: {
      languageTitle: 'زمان هەڵبژێرە',
      languageDescription: 'زمانی دڵخوازت بۆ لیستی خواردن هەڵبژێرە.',
      feedbackTitle: 'بۆچوونت بنێرە',
      feedbackDescription: 'ئەزموونت چۆن بوو؟ دڵخۆش دەبین بە بیستنی بۆچوونت.',
    },
    feedback: {
      placeholder: 'دەربارەی سەردانەکەت بۆمان بنووسە...',
      empty: 'تکایە سەرەتا شتێک بنووسە.',
      thanks: '✅ سوپاس بۆ بۆچوونەکەت!',
    },
    footer: {
      tagline: 'ڕێستورانت و کافێ · خواردنی باش بەڕۆژانە',
      copy: '© 2025 ڕێستورانت و کافێی گافلی · هەموو مافەکان پارێزراون',
    },
    empty: {
      menu: 'هیچ خواردنێک لە ئێستادا بەردەست نییە.',
    },
  },
};

const menuData = [
  {
    id: 'burgers',
    title: { en: 'Burger', ar: 'البرغر', ku: 'بەرگەر' },
    titleEm: { en: 'Types', ar: '', ku: '' },
    navTitle: { en: 'Burgers', ar: 'البرغر', ku: 'بەرگەر' },
    icon: '🍔',
    items: [
      { name: { en: 'Beef Burger', ar: 'برغر لحم', ku: 'بەرگەری گۆشت' }, price: '3,000' },
      { name: { en: 'Chicken Burger', ar: 'برغر دجاج', ku: 'بەرگەری مریشک' }, price: '3,500' },
      { name: { en: 'Beef Cheeseburger', ar: 'تشيز برغر لحم', ku: 'چیزبەرگەری گۆشت' }, price: '3,000' },
      { name: { en: 'Chicken Cheeseburger', ar: 'تشيز برغر دجاج', ku: 'چیزبەرگەری مریشک' }, price: '3,500' },
    ],
  },
  {
    id: 'sandwiches',
    title: { en: 'Sand', ar: 'السندويشات', ku: 'ساندویچ' },
    titleEm: { en: 'wiches', ar: '', ku: '' },
    navTitle: { en: 'Sandwiches', ar: 'السندويشات', ku: 'ساندویچ' },
    icon: '🥪',
    items: [
      { name: { en: 'Zinger Sandwich', ar: 'سندويش زنجر', ku: 'ساندویچی زینگەر' }, price: '3,000' },
      { name: { en: 'Crispy Sandwich', ar: 'سندويش كرسبي', ku: 'ساندویچی کریسپی' }, price: '3,500', note: { en: '3 pieces', ar: '3 قطع', ku: '3 پارچە' } },
      { name: { en: 'Beef Shawarma Sandwich', ar: 'سندويش شاورما لحم', ku: 'ساندویچی شاوەرمای گۆشت' }, price: '4,500' },
      { name: { en: 'Chicken Shawarma Sandwich', ar: 'سندويش شاورما دجاج', ku: 'ساندویچی شاوەرمای مریشک' }, price: '5,500' },
    ],
  },
  {
    id: 'shawarma',
    title: { en: 'Sha', ar: 'الشاورما', ku: 'شاوەرما' },
    titleEm: { en: 'warma', ar: '', ku: '' },
    navTitle: { en: 'Shawarma', ar: 'الشاورما', ku: 'شاوەرما' },
    icon: '🌯',
    items: [
      { name: { en: 'Beef Shawarma', ar: 'شاورما لحم', ku: 'شاوەرمای گۆشت' }, price: '1,500', note: { en: 'Small', ar: 'صغير', ku: 'بچووک' } },
      { name: { en: 'Beef Shawarma', ar: 'شاورما لحم', ku: 'شاوەرمای گۆشت' }, price: '2,000', note: { en: 'Medium', ar: 'وسط', ku: 'مامناوەند' } },
      { name: { en: 'Beef Shawarma', ar: 'شاورما لحم', ku: 'شاوەرمای گۆشت' }, price: '2,500', note: { en: 'Large', ar: 'كبير', ku: 'گەورە' } },
      { name: { en: 'Beef Shawarma + 4 bread', ar: 'شاورما لحم + 4 خبز', ku: 'شاوەرمای گۆشت + 4 نان' }, price: '4,000' },
      { name: { en: 'Chicken Shawarma', ar: 'شاورما دجاج', ku: 'شاوەرمای مریشک' }, price: '1,500', note: { en: 'Small', ar: 'صغير', ku: 'بچووک' } },
      { name: { en: 'Chicken Shawarma', ar: 'شاورما دجاج', ku: 'شاوەرمای مریشک' }, price: '2,000', note: { en: 'Medium', ar: 'وسط', ku: 'مامناوەند' } },
      { name: { en: 'Chicken Shawarma', ar: 'شاورما دجاج', ku: 'شاوەرمای مریشک' }, price: '2,500', note: { en: 'Large', ar: 'كبير', ku: 'گەورە' } },
      { name: { en: 'Chicken Shawarma + 4 bread', ar: 'شاورما دجاج + 4 خبز', ku: 'شاوەرمای مریشک + 4 نان' }, price: '4,000' },
    ],
  },
  {
    id: 'pizza',
    title: { en: 'Piz', ar: 'البيتزا', ku: 'پیتزا' },
    titleEm: { en: 'za', ar: '', ku: '' },
    navTitle: { en: 'Pizza', ar: 'البيتزا', ku: 'پیتزا' },
    icon: '🍕',
    items: [
      { name: { en: 'Small Pizza', ar: 'بيتزا صغيرة', ku: 'پیتزای بچووک' }, price: '4,000' },
      { name: { en: 'Medium Pizza', ar: 'بيتزا وسط', ku: 'پیتزای مامناوەند' }, price: '6,000' },
      { name: { en: 'Large Pizza', ar: 'بيتزا كبيرة', ku: 'پیتزای گەورە' }, price: '8,000' },
      { name: { en: 'Family Pizza', ar: 'بيتزا عائلية', ku: 'پیتزای خێزانی' }, price: '12,000' },
      { name: { en: 'Super Pizza', ar: 'سوبر بيتزا', ku: 'سوپەر پیتزا' }, price: '6,500' },
    ],
  },
  {
    id: 'fries',
    title: { en: 'Fries', ar: 'البطاطا', ku: 'پەتاتە' },
    titleEm: { en: '& Sides', ar: 'والمقبلات', ku: 'و لاوەکی' },
    navTitle: { en: 'Fries', ar: 'البطاطا', ku: 'پەتاتە' },
    icon: '🍟',
    items: [
      { name: { en: 'Small Fries', ar: 'بطاطا صغيرة', ku: 'پەتاتەی بچووک' }, price: '2,500' },
      { name: { en: 'Medium Fries', ar: 'بطاطا وسط', ku: 'پەتاتەی مامناوەند' }, price: '3,000' },
      { name: { en: 'Large Fries', ar: 'بطاطا كبيرة', ku: 'پەتاتەی گەورە' }, price: '3,500' },
    ],
  },
  {
    id: 'drinks',
    title: { en: 'Drin', ar: 'المشروبات', ku: 'خواردنەوە' },
    titleEm: { en: 'ks', ar: '', ku: '' },
    navTitle: { en: 'Drinks', ar: 'المشروبات', ku: 'خواردنەوە' },
    icon: '🥤',
    items: [
      { name: { en: 'Cola', ar: 'كولا', ku: 'کۆلا' }, price: '250' },
      { name: { en: 'Yogurt Drink (Laban)', ar: 'لبن', ku: 'ماستاو' }, price: '250' },
      { name: { en: 'Water', ar: 'ماء', ku: 'ئاو' }, price: '500' },
      { name: { en: 'Tea', ar: 'شاي', ku: 'چا' }, price: '500' },
    ],
  },
  {
    id: 'meat',
    title: { en: 'Meat', ar: 'أطباق اللحم', ku: 'قابی گۆشت' },
    titleEm: { en: 'Plates', ar: '', ku: '' },
    navTitle: { en: 'Meat Plates', ar: 'أطباق اللحم', ku: 'قابی گۆشت' },
    icon: '🥩',
    items: [
      { name: { en: 'Small Meat Plate', ar: 'طبق لحم صغير', ku: 'قابی گۆشتی بچووک' }, price: '5,000' },
      { name: { en: 'Medium Meat Plate', ar: 'طبق لحم وسط', ku: 'قابی گۆشتی مامناوەند' }, price: '6,000' },
      { name: { en: 'Large Meat Plate', ar: 'طبق لحم كبير', ku: 'قابی گۆشتی گەورە' }, price: '7,000' },
      { name: { en: 'Family Meat Plate', ar: 'طبق لحم عائلي', ku: 'قابی گۆشتی خێزانی' }, price: '6,000' },
    ],
  },
  {
    id: 'shawarma-plates',
    title: { en: 'Shawarma', ar: 'أطباق الشاورما', ku: 'قابی شاوەرما' },
    titleEm: { en: 'Plates', ar: '', ku: '' },
    navTitle: { en: 'Shawarma Plates', ar: 'أطباق الشاورما', ku: 'قابی شاوەرما' },
    icon: '🍽️',
    items: [
      { name: { en: 'Beef Shawarma Plate', ar: 'طبق شاورما لحم', ku: 'قابی شاوەرمای گۆشت' }, price: '5,000 - 8,000', note: { en: 'Depending on size', ar: 'حسب الحجم', ku: 'بەپێی قەبارە' } },
    ],
  },
  {
    id: 'falafel',
    title: { en: 'Fala', ar: 'الفلافل', ku: 'فەلافل' },
    titleEm: { en: 'fel', ar: '', ku: '' },
    navTitle: { en: 'Falafel', ar: 'الفلافل', ku: 'فەلافل' },
    icon: '🧆',
    items: [
      { name: { en: 'Falafel', ar: 'فلافل', ku: 'فەلافل' }, price: '1,000', note: { en: 'Single piece', ar: 'قطعة واحدة', ku: 'یەک دانە' } },
      { name: { en: 'Falafel', ar: 'فلافل', ku: 'فەلافل' }, price: '2,500', note: { en: '6 pieces', ar: '6 قطع', ku: '6 دانە' } },
      { name: { en: 'Falafel', ar: 'فلافل', ku: 'فەلافل' }, price: '5,000', note: { en: '12 pieces', ar: '12 قطعة', ku: '12 دانە' } },
      { name: { en: 'Falafel Plate', ar: 'طبق فلافل', ku: 'قابی فەلافل' }, price: '9,000' },
    ],
  },
];

function translate(path, lang = currentLanguage) {
  const value = path.split('.').reduce((node, key) => node?.[key], translations[lang]);
  const fallback = path.split('.').reduce((node, key) => node?.[key], translations[DEFAULT_LANGUAGE]);

  return value ?? fallback ?? path;
}

function localize(value, lang = currentLanguage) {
  if (!value || typeof value !== 'object') {
    return value ?? '';
  }

  return value[lang] ?? value[DEFAULT_LANGUAGE] ?? '';
}

function isRtl(lang = currentLanguage) {
  return RTL_LANGUAGES.includes(lang);
}

function saveLanguage(lang = currentLanguage) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  localStorage.removeItem(LEGACY_LANGUAGE_STORAGE_KEY);
}

function loadLanguage() {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY);
  currentLanguage = SUPPORTED_LANGUAGES.includes(savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE;

  if (savedLanguage && savedLanguage !== localStorage.getItem(LANGUAGE_STORAGE_KEY)) {
    saveLanguage(currentLanguage);
  }

  return currentLanguage;
}

function applyDirection(lang = currentLanguage) {
  const direction = isRtl(lang) ? 'rtl' : 'ltr';

  document.documentElement.lang = lang;
  document.documentElement.dir = direction;
  document.body.dir = direction;
  document.body.classList.toggle('is-rtl', direction === 'rtl');
}

function updateStaticTranslations() {
  document.title = translate('documentTitle');

  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = translate(element.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-html]').forEach(element => {
    element.innerHTML = translate(element.dataset.i18nHtml);
  });

  document.querySelectorAll('[data-i18n-attr]').forEach(element => {
    element.dataset.i18nAttr.split(',').forEach(binding => {
      const [attribute, key] = binding.split(':').map(part => part.trim());

      if (attribute && key) {
        element.setAttribute(attribute, translate(key));
      }
    });
  });
}

function updateLanguageOptions() {
  document.querySelectorAll('.lang-opt').forEach(option => {
    const isSelected = option.dataset.lang === currentLanguage;
    option.classList.toggle('selected', isSelected);
    option.setAttribute('aria-pressed', String(isSelected));
  });
}

function renderFeedbackForm() {
  const form = document.getElementById('feedbackForm');

  if (!form || (!feedbackSubmitted && form.querySelector('#feedbackText'))) {
    const textarea = document.getElementById('feedbackText');
    const button = form?.querySelector('.feedback-submit');

    if (textarea) {
      textarea.placeholder = translate('feedback.placeholder');
      textarea.dir = isRtl() ? 'rtl' : 'ltr';
    }

    if (button) {
      button.textContent = translate('buttons.sendFeedback');
    }

    return;
  }

  feedbackSubmitted = false;
  form.innerHTML = '';

  const textarea = document.createElement('textarea');
  textarea.id = 'feedbackText';
  textarea.placeholder = translate('feedback.placeholder');
  textarea.dir = isRtl() ? 'rtl' : 'ltr';

  const submitButton = document.createElement('button');
  submitButton.className = 'feedback-submit';
  submitButton.type = 'button';
  submitButton.textContent = translate('buttons.sendFeedback');
  submitButton.addEventListener('click', submitFeedback);

  form.append(textarea, submitButton);
}

function renderNavigation() {
  const navInner = document.getElementById('navInner');
  const existingButtons = navInner.querySelectorAll('.nav-btn');

  if (existingButtons.length !== menuData.length) {
    navInner.innerHTML = '';

    menuData.forEach(section => {
      const button = document.createElement('button');
      button.className = 'nav-btn';
      button.dataset.target = section.id;
      button.type = 'button';

      button.addEventListener('click', () => {
        document.getElementById(section.id)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });

      navInner.appendChild(button);
    });
  }

  navInner.querySelectorAll('.nav-btn').forEach((button, index) => {
    button.textContent = localize(menuData[index].navTitle);
  });
}

function createMenuSection(section, sectionIndex) {
  const menuSection = document.createElement('section');
  menuSection.className = 'menu-section';
  menuSection.id = section.id;
  menuSection.dataset.sectionIndex = String(sectionIndex);

  const header = document.createElement('div');
  header.className = 'section-header';

  const icon = document.createElement('div');
  icon.className = 'section-icon';
  icon.textContent = section.icon;

  const title = document.createElement('h2');
  title.className = 'section-title';

  const titleText = document.createElement('span');
  titleText.className = 'section-title-main';

  const titleEmphasis = document.createElement('em');

  title.append(titleText, titleEmphasis);
  header.append(icon, title);

  const container = document.createElement('div');
  container.className = 'items-container';
  container.id = `items-${section.id}`;

  menuSection.append(header, container);

  section.items.forEach((item, itemIndex) => {
    const card = document.createElement('div');
    card.className = 'menu-item';
    card.dataset.itemIndex = String(itemIndex);
    card.style.animationDelay = `${itemIndex * 0.07}s`;

    const itemBlob = document.createElement('div');
    itemBlob.className = 'item-blob';
    itemBlob.textContent = section.icon;

    const itemInfo = document.createElement('div');
    itemInfo.className = 'item-info';

    const itemName = document.createElement('div');
    itemName.className = 'item-name';

    const itemNote = document.createElement('div');
    itemNote.className = 'item-note';

    itemInfo.append(itemName, itemNote);

    const itemPrice = document.createElement('div');
    itemPrice.className = 'item-price';

    const priceValue = document.createTextNode(item.price);
    const currency = document.createElement('span');
    currency.className = 'currency';

    itemPrice.append(priceValue, currency);
    card.append(itemBlob, itemInfo, itemPrice);
    container.appendChild(card);
  });

  return menuSection;
}

function updateMenuText() {
  document.querySelectorAll('.menu-section').forEach(sectionElement => {
    const section = menuData[Number(sectionElement.dataset.sectionIndex)];

    sectionElement.querySelector('.section-title-main').textContent = localize(section.title);
    sectionElement.querySelector('.section-title em').textContent = localize(section.titleEm);

    const itemCards = sectionElement.querySelectorAll('.menu-item');

    if (!itemCards.length) {
      sectionElement.querySelector('.items-container').textContent = translate('empty.menu');
      return;
    }

    itemCards.forEach(card => {
      const item = section.items[Number(card.dataset.itemIndex)];
      const noteText = localize(item.note);

      card.querySelector('.item-name').textContent = localize(item.name);
      card.querySelector('.item-note').textContent = noteText;
      card.querySelector('.item-note').hidden = !noteText;
      card.querySelector('.currency').textContent = translate('labels.currency');
    });
  });
}

function renderMenu() {
  const main = document.getElementById('menuMain');
  const existingSections = main.querySelectorAll('.menu-section');

  if (existingSections.length !== menuData.length) {
    main.innerHTML = '';

    menuData.forEach((section, sectionIndex) => {
      main.appendChild(createMenuSection(section, sectionIndex));

      if (sectionIndex < menuData.length - 1) {
        const separator = document.createElement('div');
        separator.className = 'section-sep';
        main.appendChild(separator);
      }
    });

    initSectionObserver();
    initCardObserver();
  }

  updateMenuText();
}

function updateLanguage() {
  applyDirection(currentLanguage);
  updateStaticTranslations();
  renderNavigation();
  renderMenu();
  renderFeedbackForm();
  updateLanguageOptions();
}

function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    return;
  }

  currentLanguage = lang;
  saveLanguage(lang);
  updateLanguage();
  closeAll();
}

function initSectionObserver() {
  sectionObserver?.disconnect();

  const observerOptions = { rootMargin: '-30% 0px -60% 0px' };
  sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }

      document.querySelectorAll('.nav-btn').forEach(button => {
        button.classList.toggle('active', button.dataset.target === entry.target.id);
      });

      const activeButton = document.querySelector(`.nav-btn[data-target="${entry.target.id}"]`);

      activeButton?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    });
  }, observerOptions);

  document.querySelectorAll('.menu-section').forEach(section => sectionObserver.observe(section));
}

function initCardObserver() {
  cardObserver?.disconnect();

  cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.menu-item').forEach(card => {
    card.style.animationPlayState = 'paused';
    cardObserver.observe(card);
  });
}

function initScrollTop() {
  const button = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    button.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
}

function openLang() {
  updateLanguageOptions();
  document.getElementById('langOverlay').classList.add('open');
}

function openFeedback() {
  renderFeedbackForm();
  document.getElementById('feedbackOverlay').classList.add('open');
}

function closeAll(event) {
  if (
    !event ||
    event.target.classList.contains('overlay') ||
    event.target.classList.contains('modal-close')
  ) {
    document.querySelectorAll('.overlay').forEach(overlay => overlay.classList.remove('open'));
  }
}

function submitFeedback() {
  const feedbackText = document.getElementById('feedbackText');
  const value = feedbackText?.value.trim();

  if (!value) {
    alert(translate('feedback.empty'));
    return;
  }

  feedbackSubmitted = true;
  document.getElementById('feedbackForm').innerHTML = `
    <p class="feedback-success">${translate('feedback.thanks')}</p>
  `;

  setTimeout(closeAll, 2000);
}

function initLangOptions() {
  document.querySelectorAll('.lang-opt').forEach(option => {
    option.addEventListener('click', () => setLanguage(option.dataset.lang));
  });
}

function init() {
  loadLanguage();
  renderNavigation();
  renderMenu();
  initScrollTop();
  initLangOptions();
  updateLanguage();
}

init();
