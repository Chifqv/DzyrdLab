/* ==========================================================================
   DzyrdLab — interactions
   ========================================================================== */
(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const scrollBehavior = () => (reduceMotion.matches ? "auto" : "smooth");

  /* ---------------------------------------------------------------------
     Toast
     --------------------------------------------------------------------- */
  const toast = $("#toast");
  const toastMessage = $("#toast-message");
  let toastTimer;

  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3600);
  }

  /* ---------------------------------------------------------------------
     Header
     --------------------------------------------------------------------- */
  const header = $("#site-header");
  const menuToggle = $("#menu-toggle");
  const nav = $("#primary-nav");

  const syncHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 6);
  };
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  function closeMenu() {
    if (!header || !menuToggle) return;
    header.classList.remove("menu-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Открыть меню");
  }

  if (header && menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("menu-open");
      menuToggle.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!header.classList.contains("menu-open")) return;
      if (!header.contains(event.target)) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) closeMenu();
    });
  }

  const headerSearch = $("#header-search");
  headerSearch?.addEventListener("click", () => {
    const input = $("#search-input");
    if (!input) return;
    input.focus({ preventScroll: true });
    input.closest(".search")?.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
  });

  /* ---------------------------------------------------------------------
     Session-aware header
     --------------------------------------------------------------------- */
  const AUTH_SESSION_KEY = "dzyrdlab-session-v1";

  function syncAuthLinks() {
    let session = null;
    try {
      const stored = JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) || "null");
      if (stored && typeof stored === "object" && stored.name) session = stored;
    } catch {
      session = null;
    }

    $$("[data-auth-link]").forEach((link) => {
      if (session) {
        const firstName = String(session.name).trim().split(/\s+/)[0] || "Профиль";
        link.href = "profile.html";
        link.textContent = firstName;
        link.setAttribute("aria-label", `Личный кабинет: ${session.name}`);
      } else {
        link.href = "login.html";
        link.textContent = "Войти";
        link.removeAttribute("aria-label");
      }
    });
  }

  syncAuthLinks();

  /* ---------------------------------------------------------------------
     Demo links
     --------------------------------------------------------------------- */
  document.addEventListener("click", (event) => {
    const demo = event.target.closest("[data-demo]");
    if (!demo) return;
    event.preventDefault();
    showToast(demo.dataset.demo || "Эта страница появится в следующей версии прототипа.");
  });

  /* ---------------------------------------------------------------------
     Library filters
     --------------------------------------------------------------------- */
  const cards = $$(".material");
  const tabs = $$(".tab");
  const filterNote = $("#filter-note");
  const emptyState = $("#empty-state");
  const resetButton = $("#reset-filters");
  const searchForm = $("#hero-search");
  const searchInput = $("#search-input");

  const state = { query: "", category: "all", grade: "" };

  const categoryLabels = {
    lesson: "уроки",
    worksheet: "рабочие листы",
    presentation: "презентации",
    game: "игры",
  };

  const gradeLabels = {
    preschool: "дошкольникам",
    primary: "1–4 классы",
    middle: "5–9 классы",
    high: "10–11 классы",
  };
  const normalize = (value) =>
    (value || "")
      .toLocaleLowerCase("ru")
      .replaceAll("ё", "е")
      .replace(/\s+/g, " ")
      .trim();

  function setActiveTab(category) {
    tabs.forEach((tab) => {
      const active = tab.dataset.cat === category;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-pressed", String(active));
    });
  }

  function applyFilters({ scroll = false } = {}) {
    let visible = 0;

    cards.forEach((card) => {
      const searchable = normalize(
        `${card.dataset.keywords || ""} ${card.textContent || ""}`
      );
      const matchesCategory =
        state.category === "all" || card.dataset.cat === state.category;
      const matchesGrade = !state.grade || card.dataset.grade === state.grade;
      const matchesQuery = !state.query || searchable.includes(normalize(state.query));
      const isVisible = matchesCategory && matchesGrade && matchesQuery;

      card.hidden = !isVisible;
      if (isVisible) {
        visible += 1;
        card.classList.add("is-visible");
      }
    });

    if (emptyState) emptyState.hidden = visible > 0;

    const hasFilters =
      Boolean(state.query) || state.category !== "all" || Boolean(state.grade);

    if (filterNote) {
      filterNote.hidden = !hasFilters;
      if (hasFilters) {
        const parts = [];
        if (state.query) parts.push(`«${state.query}»`);
        if (state.category !== "all") parts.push(categoryLabels[state.category] || "");
        if (state.grade) parts.push(gradeLabels[state.grade] || "");
        filterNote.textContent = `Найдено: ${visible} · ${parts.filter(Boolean).join(" · ")}`;
      }
    }

    if (scroll) {
      $("#library")?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    }
  }

  function resetFilters({ scroll = false } = {}) {
    state.query = "";
    state.category = "all";
    state.grade = "";
    if (searchInput) searchInput.value = "";
    setActiveTab("all");
    applyFilters({ scroll });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      state.category = tab.dataset.cat || "all";
      state.grade = "";
      state.query = "";
      if (searchInput) searchInput.value = "";
      setActiveTab(state.category);
      applyFilters();
    });
  });

  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    goToCatalog({ query: searchInput?.value.trim() || "" });
  });

  searchInput?.addEventListener("input", () => {
    if (searchInput.value === "" && state.query) {
      state.query = "";
      applyFilters();
    }
  });

  function goToCatalog({ query = "", type = "", grade = "", topic = "" } = {}) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (type) params.set("type", type);
    if (grade) params.set("grade", grade);
    if (topic) params.set("topic", topic);
    const queryString = params.toString();
    const baseUrl = '/Home/Catalog';
    const url = `${baseUrl}${queryString ? `?${queryString}` : ""}#materials`;

    window.location.href = url;
  }

  $$(
    "[data-catalog-query], [data-catalog-type], [data-catalog-grade], [data-catalog-topic]"
  ).forEach((button) => {
    button.addEventListener("click", () => {
      goToCatalog({
        query: button.dataset.catalogQuery || "",
        type: button.dataset.catalogType || "",
        grade: button.dataset.catalogGrade || "",
        topic: button.dataset.catalogTopic || "",
      });
    });
  });

  resetButton?.addEventListener("click", () => resetFilters());

  /* ---------------------------------------------------------------------
     Saved materials
     --------------------------------------------------------------------- */
  const STORAGE_KEY = "dzyrdlab-saved-v1";
  let savedItems = new Set();

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(stored)) savedItems = new Set(stored.map(String));
  } catch {
    savedItems = new Set();
  }

  const itemKey = (button) =>
    normalize(button.closest(".material")?.querySelector("h3")?.textContent || "");

  const persistSaved = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...savedItems]));
    } catch {
      /* storage may be unavailable — the visual state still works */
    }
  };

  $$("[data-save]").forEach((button) => {
    const key = itemKey(button);
    if (key && savedItems.has(key)) {
      button.classList.add("is-saved");
      button.setAttribute("aria-pressed", "true");
    }

    button.addEventListener("click", () => {
      const nowSaved = !button.classList.contains("is-saved");
      button.classList.toggle("is-saved", nowSaved);
      button.setAttribute("aria-pressed", String(nowSaved));

      if (nowSaved) savedItems.add(key);
      else savedItems.delete(key);
      persistSaved();

      showToast(nowSaved ? "Материал сохранён в подборку." : "Материал убран из подборки.");
    });
  });

  /* ---------------------------------------------------------------------
     Newsletter
     --------------------------------------------------------------------- */
  const subscribeForm = $("#subscribe-form");
  const subscribeEmail = $("#subscribe-email");
  const subscribeSuccess = $("#subscribe-success");

  subscribeForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!subscribeEmail || !subscribeEmail.value.trim() || !subscribeEmail.validity.valid) {
      subscribeEmail?.reportValidity();
      return;
    }

    subscribeForm.hidden = true;
    if (subscribeSuccess) subscribeSuccess.hidden = false;
    showToast("Вы подписаны на еженедельную подборку.");
  });

  /* ---------------------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------------------- */
  const revealElements = $$("[data-reveal]");

  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    revealElements.forEach((element) => element.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -32px 0px" }
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  applyFilters();
})();
