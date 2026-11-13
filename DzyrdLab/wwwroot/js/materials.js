/* ==========================================================================
   DzyrdLab — каталог материалов
   Демо-данные и общий рендер карточки. Подключается до pages.js.
   ========================================================================== */
(() => {
  "use strict";

  const authors = {
    agunda: {
      name: "Агунда Дзагоева",
      role: "учитель осетинского языка",
      initials: "АД",
      avatar: "wine",
    },
    zarina: {
      name: "Зарина Кокаева",
      role: "учитель начальных классов",
      initials: "ЗК",
      avatar: "olive",
    },
    fatima: {
      name: "Фатима Плиева",
      role: "преподаватель, Владикавказ",
      initials: "ФП",
      avatar: "sand",
    },
    madina: {
      name: "Мадина Бзарова",
      role: "воспитатель детского сада",
      initials: "МБ",
      avatar: "wine",
    },
    aslan: {
      name: "Аслан Гаглоев",
      role: "учитель литературы, школа № 27",
      initials: "АГ",
      avatar: "olive",
    },
    irina: {
      name: "Ирина Туаева",
      role: "учитель начальных классов",
      initials: "ИТ",
      avatar: "sand",
    },
  };

  const catalog = [
    {
      id: "narty-epos",
      title: "Нартский эпос: герои и смыслы",
      coverLines: ["Нартский эпос:", "герои и смыслы"],
      glyph: "Æ",
      cover: "wine",
      type: "lesson",
      grade: "middle",
      gradeLabel: "8 класс",
      topic: "Литература",
      desc: "Как говорить с подростками о героях нартов: конспект, вопросы для дискуссии и творческое задание.",
      author: "agunda",
      rating: 4.9,
      reviews: 32,
      downloads: 1248,
      volume: "24 стр.",
      verified: true,
      added: "2026-10-28",
      keywords:
        "нартский эпос литература 8 класс герои смыслы конспект урок традиции фольклор нарты",
    },
    {
      id: "ae-bukva",
      title: "Ӕ, ӕ: учимся читать и писать",
      coverLines: ["Ӕ, ӕ: учимся", "читать и писать"],
      glyph: "Ӕ",
      cover: "cream",
      type: "worksheet",
      grade: "primary",
      gradeLabel: "2 класс",
      topic: "Письмо",
      desc: "8 заданий на узнавание, письмо и чтение главной буквы осетинского алфавита.",
      author: "zarina",
      rating: 4.8,
      reviews: 57,
      downloads: 2106,
      volume: "6 стр.",
      verified: true,
      added: "2026-10-24",
      keywords:
        "ӕ буква алфавит письмо чтение 2 класс рабочий лист рабочие листы письменность фонетика диагностика",
    },
    {
      id: "dzyrd-semya",
      title: "Дзырд: тема «Семья» в карточках",
      coverLines: ["Дзырд: тема", "«Семья»"],
      glyph: "Д",
      cover: "olive",
      type: "presentation",
      grade: "middle",
      gradeLabel: "5 класс",
      topic: "Лексика",
      desc: "18 слайдов с лексикой, произношением и короткими диалогами для первого урока по теме.",
      author: "fatima",
      rating: 4.7,
      reviews: 19,
      downloads: 864,
      volume: "18 слайдов",
      verified: true,
      added: "2026-10-20",
      keywords:
        "дзырд слово семья лексика 5 класс презентация карточки грамматика диалоги",
    },
    {
      id: "kto-ya",
      title: "Кто я? Игры на осетинском для малышей",
      coverLines: ["Кто я?", "Игры для малышей"],
      glyph: "?",
      cover: "ink",
      type: "game",
      grade: "preschool",
      gradeLabel: "Дошкольникам",
      topic: "Игры",
      desc: "12 карточек для подвижных занятий: учим названия животных и первые фразы без зубрёжки.",
      author: "madina",
      rating: 5,
      reviews: 41,
      downloads: 1530,
      volume: "12 карточек",
      verified: true,
      added: "2026-10-18",
      keywords:
        "кто я игра дошкольники малыши карточки устная речь игры животные традиции",
    },
    {
      id: "khetagurov",
      title: "Хетагуров: поэзия и перевод",
      coverLines: ["Хетагуров:", "поэзия и перевод"],
      glyph: "Х",
      cover: "sand",
      type: "lesson",
      grade: "high",
      gradeLabel: "10–11 класс",
      topic: "Литература",
      desc: "Сравнительный анализ стихотворений и задания на художественный перевод с осетинского.",
      author: "aslan",
      rating: 4.9,
      reviews: 23,
      downloads: 742,
      volume: "15 стр.",
      verified: true,
      added: "2026-10-15",
      keywords:
        "хетагуров коста поэзия перевод литература 10 11 класс конспект анализ лирика",
    },
    {
      id: "skazki-osetii",
      title: "Сказки Осетии: читаем и обсуждаем",
      coverLines: ["Сказки Осетии:", "читаем и обсуждаем"],
      glyph: "С",
      cover: "paper",
      type: "worksheet",
      grade: "primary",
      gradeLabel: "3–4 класс",
      topic: "Чтение",
      desc: "Текст с заданиями до, во время и после чтения, словарик и вопросы для семейного обсуждения.",
      author: "irina",
      rating: 4.8,
      reviews: 28,
      downloads: 1012,
      volume: "8 стр.",
      verified: true,
      added: "2026-10-12",
      keywords:
        "сказки осетии чтение обсуждение 3 4 класс рабочий лист рабочие листы традиции фольклор",
    },
    {
      id: "fonetika-zvuki",
      title: "Фонетика: звуки и буквы осетинского",
      coverLines: ["Фонетика:", "звуки и буквы"],
      glyph: "Ф",
      cover: "wine",
      type: "presentation",
      grade: "primary",
      gradeLabel: "1 класс",
      topic: "Фонетика",
      desc: "22 слайда с опорными схемами: чем осетинский звук отличается от русской буквы.",
      author: "zarina",
      rating: 4.6,
      reviews: 34,
      downloads: 1876,
      volume: "22 слайда",
      verified: true,
      added: "2026-10-09",
      keywords:
        "фонетика звуки буквы осетинский 1 класс презентация схемы произношение алфавит",
    },
    {
      id: "padezhi",
      title: "Грамматика: падежи без скуки",
      coverLines: ["Грамматика:", "падежи без скуки"],
      glyph: "Г",
      cover: "olive",
      type: "worksheet",
      grade: "middle",
      gradeLabel: "6 класс",
      topic: "Грамматика",
      desc: "Игровые упражнения на падежные окончания: от сортировки карточек до коротких диалогов.",
      author: "agunda",
      rating: 4.8,
      reviews: 45,
      downloads: 1524,
      volume: "10 стр.",
      verified: true,
      added: "2026-10-06",
      keywords:
        "грамматика падежи 6 класс упражнения окончания рабочий лист рабочие листы диалоги",
    },
    {
      id: "poslovicy",
      title: "Осетинские пословицы на уроке",
      coverLines: ["Осетинские", "пословицы"],
      glyph: "Ӕ",
      cover: "ink",
      type: "lesson",
      grade: "middle",
      gradeLabel: "7 класс",
      topic: "Фольклор",
      desc: "Подборка пословиц с переводами и заданиями на смысл, контекст и собственные примеры.",
      author: "aslan",
      rating: 4.7,
      reviews: 16,
      downloads: 689,
      volume: "12 стр.",
      verified: false,
      added: "2026-10-03",
      keywords:
        "пословицы фольклор 7 класс урок перевод смысл традиции устное народное творчество",
    },
    {
      id: "pervye-slova",
      title: "Ирон æвзаг: первые слова",
      coverLines: ["Ирон æвзаг:", "первые слова"],
      glyph: "И",
      cover: "sand",
      type: "game",
      grade: "preschool",
      gradeLabel: "Дошкольникам",
      topic: "Лексика",
      desc: "20 карточек с картинками для первого знакомства с языком: приветствия, семья, животные.",
      author: "madina",
      rating: 4.9,
      reviews: 63,
      downloads: 2430,
      volume: "20 карточек",
      verified: true,
      added: "2026-09-30",
      keywords:
        "первые слова лексика дошкольники малыши игра карточки приветствия семья животные",
    },
    {
      id: "sochinenie-kartina",
      title: "Сочинение по картине: учимся описывать",
      coverLines: ["Сочинение", "по картине"],
      glyph: "С",
      cover: "paper",
      type: "lesson",
      grade: "primary",
      gradeLabel: "4 класс",
      topic: "Развитие речи",
      desc: "План описания, опорные слова на осетинском и примеры детских работ для разбора.",
      author: "irina",
      rating: 4.5,
      reviews: 21,
      downloads: 512,
      volume: "9 стр.",
      verified: false,
      added: "2026-09-27",
      keywords:
        "сочинение картина описание развитие речи 4 класс план словарь урок",
    },
    {
      id: "narty-komiks",
      title: "Нартский эпос в комиксах",
      coverLines: ["Нартский эпос", "в комиксах"],
      glyph: "Н",
      cover: "cream",
      type: "worksheet",
      grade: "middle",
      gradeLabel: "6 класс",
      topic: "Литература",
      desc: "Шаблоны для комикса по мотивам нартовских сказаний: рисуем, подписываем, пересказываем.",
      author: "fatima",
      rating: 4.9,
      reviews: 38,
      downloads: 1310,
      volume: "14 стр.",
      verified: true,
      added: "2026-09-24",
      keywords:
        "нартский эпос комикс 6 класс литература шаблоны пересказ творческое задание нарты",
    },
    {
      id: "ekzamen-teksty",
      title: "Подготовка к экзамену: тексты и задания",
      coverLines: ["Подготовка", "к экзамену"],
      glyph: "Э",
      cover: "wine",
      type: "lesson",
      grade: "high",
      gradeLabel: "11 класс",
      topic: "Грамматика",
      desc: "Тренировочные тексты и разбор типичных ошибок: лексика, грамматика, письменная часть.",
      author: "aslan",
      rating: 4.8,
      reviews: 29,
      downloads: 958,
      volume: "28 стр.",
      verified: true,
      added: "2026-09-21",
      keywords:
        "экзамен подготовка 11 класс тексты задания грамматика лексика письменная часть",
    },
    {
      id: "tradicii-malyshi",
      title: "Традиции Осетии: занятие для малышей",
      coverLines: ["Традиции Осетии:", "занятие для малышей"],
      glyph: "Т",
      cover: "olive",
      type: "game",
      grade: "preschool",
      gradeLabel: "Дошкольникам",
      topic: "Традиции",
      desc: "Сценарий занятия с подвижными играми, национальной музыкой и простыми осетинскими словами.",
      author: "madina",
      rating: 4.7,
      reviews: 26,
      downloads: 1104,
      volume: "16 карточек",
      verified: false,
      added: "2026-09-18",
      keywords:
        "традиции осетии дошкольники занятие игры музыка сценарий обычаи",
    },
    {
      id: "pismo-propisi",
      title: "Письмо: строчные и заглавные",
      coverLines: ["Письмо:", "строчные и заглавные"],
      glyph: "П",
      cover: "sand",
      type: "worksheet",
      grade: "primary",
      gradeLabel: "1 класс",
      topic: "Письмо",
      desc: "Прописи с постепенным усложнением: элементы букв, соединения и первые осетинские слова.",
      author: "zarina",
      rating: 4.6,
      reviews: 31,
      downloads: 1672,
      volume: "8 стр.",
      verified: true,
      added: "2026-09-15",
      keywords:
        "письмо прописи 1 класс строчные заглавные буквы соединения алфавит",
    },
    {
      id: "lirika-kosta",
      title: "Анализ лирики: Коста Хетагуров",
      coverLines: ["Анализ лирики:", "Коста Хетагуров"],
      glyph: "К",
      cover: "ink",
      type: "presentation",
      grade: "high",
      gradeLabel: "10 класс",
      topic: "Литература",
      desc: "24 слайда для slow reading: образы, ритм, язык и контекст стихотворений Коста.",
      author: "agunda",
      rating: 4.8,
      reviews: 18,
      downloads: 604,
      volume: "24 слайда",
      verified: true,
      added: "2026-09-12",
      keywords:
        "коста хетагуров лирика анализ 10 класс презентация стихи поэзия slow reading",
    },
    {
      id: "dialogi-v-shkole",
      title: "Диалоги на уроке: «В школе»",
      coverLines: ["Диалоги", "«В школе»"],
      glyph: "Д",
      cover: "cream",
      type: "presentation",
      grade: "middle",
      gradeLabel: "5 класс",
      topic: "Развитие речи",
      desc: "15 слайдов с готовыми репликами и заданиями на составление собственных диалогов.",
      author: "fatima",
      rating: 4.5,
      reviews: 14,
      downloads: 478,
      volume: "15 слайдов",
      verified: false,
      added: "2026-09-09",
      keywords:
        "диалоги школа 5 класс развитие речи презентация реплики разговорная речь",
    },
    {
      id: "viktorina-osetia",
      title: "Викторина «Знаешь ли ты Осетию?»",
      coverLines: ["Викторина", "«Знаешь ли ты Осетию?»"],
      glyph: "?",
      cover: "paper",
      type: "game",
      grade: "high",
      gradeLabel: "9–11 класс",
      topic: "Традиции",
      desc: "30 вопросов о культуре, языке и истории Осетии — для командной игры и предметной недели.",
      author: "aslan",
      rating: 4.9,
      reviews: 52,
      downloads: 1908,
      volume: "30 вопросов",
      verified: true,
      added: "2026-09-06",
      keywords:
        "викторина осетия культура история язык 9 10 11 класс командная игра традиции",
    },
  ];

  const typeLabels = {
    lesson: "Урок",
    worksheet: "Рабочий лист",
    presentation: "Презентация",
    game: "Игра",
  };

  const gradeLabels = {
    preschool: "Дошкольникам",
    primary: "1–4 классы",
    middle: "5–9 классы",
    high: "10–11 классы",
  };

  const topics = [
    "Литература",
    "Лексика",
    "Грамматика",
    "Письмо",
    "Чтение",
    "Фонетика",
    "Фольклор",
    "Развитие речи",
    "Игры",
    "Традиции",
  ];

  const numberFormat = new Intl.NumberFormat("ru-RU");

  const formatNumber = (value) => numberFormat.format(Number(value) || 0);

  const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return entities[character];
    });

  const ratingLabel = (value) => {
    const number = Number(value);
    return Number.isInteger(number) ? `${number}.0` : number.toFixed(1);
  };

  function renderMaterialCard(item, index = 0) {
    const author = authors[item.author] || authors.agunda;
    const typeLabel = typeLabels[item.type] || "Материал";
    const verified = item.verified
      ? `<span class="tag tag--verified"><svg class="icon" aria-hidden="true"><use href="#i-badge-check"/></svg>Проверено</span>`
      : "";
    const coverLines = (item.coverLines || [item.title])
      .map((line) => escapeHtml(line))
      .join("<br>");
    const number = String(index + 1).padStart(2, "0");

    return `
      <article class="material" data-id="${escapeHtml(item.id)}" data-cat="${escapeHtml(
        item.type
      )}" data-grade="${escapeHtml(item.grade)}" data-topic="${escapeHtml(
        item.topic
      )}" data-verified="${item.verified}" data-rating="${item.rating}" data-downloads="${
        item.downloads
      }" data-added="${escapeHtml(item.added)}" data-keywords="${escapeHtml(
        item.keywords
      )}">
        <div class="material-top">
          <a class="cover cover--${escapeHtml(item.cover)}" href="#" data-demo="Страница материала появится в следующей версии прототипа.">
            <span class="cover-top"><span class="cover-type">${escapeHtml(
              item.topic
            )} · ${escapeHtml(item.gradeLabel)}</span><span class="cover-num">${number}</span></span>
            <span class="cover-glyph">${escapeHtml(item.glyph)}</span>
            <span class="cover-title">${coverLines}</span>
            <span class="sr-only">Открыть материал</span>
          </a>
          <button class="save" type="button" aria-label="Сохранить материал «${escapeHtml(
            item.title
          )}»" aria-pressed="false" data-save>
            <svg class="icon" aria-hidden="true"><use href="#i-bookmark"/></svg>
          </button>
        </div>
        <div class="material-body">
          <div class="tags"><span class="tag tag--wine">${escapeHtml(
            typeLabel
          )}</span><span class="tag">${escapeHtml(item.gradeLabel)}</span>${verified}</div>
          <h3><a href="#" data-demo="Страница материала появится в следующей версии прототипа.">${escapeHtml(
            item.title
          )}</a></h3>
          <p class="material-desc">${escapeHtml(item.desc)}</p>
          <div class="author-row">
            <span class="avatar avatar--${escapeHtml(author.avatar)}">${escapeHtml(
              author.initials
            )}</span>
            <span class="author-name">${escapeHtml(author.name)}<small>${escapeHtml(
              author.role
            )}</small></span>
          </div>
          <div class="meta">
            <span class="rating"><svg class="icon icon--fill" aria-hidden="true"><use href="#i-star"/></svg> ${ratingLabel(
              item.rating
            )} <i>(${item.reviews})</i></span>
            <span class="meta-sep" aria-hidden="true"></span>
            <span>${formatNumber(item.downloads)} скачиваний</span>
            <span class="meta-right">${escapeHtml(item.volume)}</span>
          </div>
        </div>
      </article>`;
  }

  window.DZYRDLAB = {
    materials: catalog,
    authors,
    typeLabels,
    gradeLabels,
    topics,
    formatNumber,
    ratingLabel,
    escapeHtml,
    renderMaterialCard,
    getMaterial: (id) => catalog.find((item) => item.id === id),
  };
})();
