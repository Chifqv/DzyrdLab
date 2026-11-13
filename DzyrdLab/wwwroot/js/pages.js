/* ==========================================================================
   DzyrdLab — поведение внутренних страниц
   Каталог, вход и профиль. Не пересекается с script.js главной страницы.
   ========================================================================== */
(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const scrollBehavior = () => (reduceMotion.matches ? "auto" : "smooth");
  const data = window.DZYRDLAB;

  const normalize = (value) =>
    (value || "")
      .toLocaleLowerCase("ru")
      .replaceAll("ё", "е")
      .replace(/\s+/g, " ")
      .trim();

  const plural = (count, forms) => {
    const abs = Math.abs(count) % 100;
    const last = abs % 10;
    if (abs > 10 && abs < 20) return forms[2];
    if (last > 1 && last < 5) return forms[1];
    if (last === 1) return forms[0];
    return forms[2];
  };

  /* ---------------------------------------------------------------------
     Form validation helpers
     --------------------------------------------------------------------- */
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function fieldOf(input) {
    return input?.closest(".field");
  }

  function setError(input, message) {
    if (!input) return;
    const field = fieldOf(input);
    const error = field?.querySelector(".field-error");
    input.setAttribute("aria-invalid", "true");
    if (error) {
      error.textContent = message;
      error.hidden = false;
    }
  }

  function clearError(input) {
    if (!input) return;
    const field = fieldOf(input);
    const error = field?.querySelector(".field-error");
    input.removeAttribute("aria-invalid");
    if (error) {
      error.hidden = true;
      error.textContent = "";
    }
  }

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
     Session
     --------------------------------------------------------------------- */
  const SESSION_KEY = "dzyrdlab-session-v1";
  const USERS_KEY = "dzyrdlab-users-v1";

  function readSession() {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      return session && typeof session === "object" && session.name ? session : null;
    } catch {
      return null;
    }
  }

  function writeSession(session) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      /* storage may be unavailable — the UI still updates for this page */
    }
    syncAuthUI(session);
  }

  function clearSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    syncAuthUI(null);
  }

  function readUsers() {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      return Array.isArray(users) ? users : [];
    } catch {
      return [];
    }
  }

  function saveUser(user) {
    const users = readUsers().filter((item) => item.email !== user.email);
    users.unshift(user);
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users.slice(0, 20)));
    } catch {
      /* ignore */
    }
  }

  function getInitials(name) {
    const parts = String(name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!parts.length) return "DL";
    const first = parts[0][0] || "";
    const second = parts.length > 1 ? parts[1][0] || "" : "";
    return (first + second).toLocaleUpperCase("ru");
  }

  function getFirstName(name) {
    return String(name || "").trim().split(/\s+/)[0] || "Профиль";
  }

  function syncAuthUI(session = readSession()) {
    $$("[data-auth-link]").forEach((link) => {
      if (session) {
        link.href = "profile.html";
        link.setAttribute("aria-label", `Личный кабинет: ${session.name}`);
        if (link.classList.contains("header-login")) {
          link.classList.add("header-user");
          link.innerHTML = `<span class="avatar avatar--wine">${data.escapeHtml(
            getInitials(session.name)
          )}</span><span>${data.escapeHtml(getFirstName(session.name))}</span>`;
        } else {
          link.textContent = "Мой профиль";
        }
      } else {
        link.href = "login.html";
        link.classList.remove("header-user");
        link.removeAttribute("aria-label");
        link.textContent = "Войти";
      }
    });
  }

  document.addEventListener("click", (event) => {
    const logout = event.target.closest("[data-auth-logout]");
    if (!logout) return;
    event.preventDefault();
    clearSession();
    showToast("Вы вышли из аккаунта.");
    window.setTimeout(() => {
      window.location.href = "login.html";
    }, 500);
  });

  syncAuthUI();

  /* ---------------------------------------------------------------------
     Saved materials
     --------------------------------------------------------------------- */
  const SAVED_KEY = "dzyrdlab-saved-v1";
  let savedItems = new Set();

  try {
    const stored = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
    if (Array.isArray(stored)) savedItems = new Set(stored.map(String));
  } catch {
    savedItems = new Set();
  }

  const materialKey = (title) => normalize(title);

  function persistSaved() {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify([...savedItems]));
    } catch {
      /* ignore */
    }
    document.dispatchEvent(new CustomEvent("dzyrdlab:savedchange"));
  }

  function syncSavedButtons(scope = document) {
    $$("[data-save]", scope).forEach((button) => {
      const card = button.closest(".material");
      const title = card?.querySelector("h3")?.textContent || "";
      const saved = savedItems.has(materialKey(title));
      button.classList.toggle("is-saved", saved);
      button.setAttribute("aria-pressed", String(saved));
    });
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-save]");
    if (!button) return;

    const card = button.closest(".material");
    const title = card?.querySelector("h3")?.textContent || "";
    const key = materialKey(title);
    if (!key) return;

    const nowSaved = !button.classList.contains("is-saved");
    button.classList.toggle("is-saved", nowSaved);
    button.setAttribute("aria-pressed", String(nowSaved));

    if (nowSaved) savedItems.add(key);
    else savedItems.delete(key);
    persistSaved();

    showToast(
      nowSaved ? "Материал сохранён в подборку." : "Материал убран из подборки."
    );
  });

  /* ---------------------------------------------------------------------
     Reveal
     --------------------------------------------------------------------- */
  function initReveal(scope = document) {
    const elements = $$("[data-reveal]", scope).filter(
      (element) => !element.classList.contains("reveal")
    );
    if (!elements.length) return;

    if (!("IntersectionObserver" in window) || reduceMotion.matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    elements.forEach((element) => element.classList.add("reveal"));
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

    elements.forEach((element) => observer.observe(element));
  }

  initReveal();

  /* ---------------------------------------------------------------------
     Header search
     --------------------------------------------------------------------- */
  $("#header-search")?.addEventListener("click", () => {
    const input = $("#catalog-search-input");
    if (input) {
      input.focus({ preventScroll: true });
      input.closest(".search")?.scrollIntoView({
        behavior: scrollBehavior(),
        block: "center",
      });
    } else {
      window.location.href = "catalog.html";
    }
  });

  /* ---------------------------------------------------------------------
     Catalog
     --------------------------------------------------------------------- */
  function initCatalog() {
    const grid = $("#catalog-grid");
    if (!grid || !data) return;

    const all = data.materials;
    const resultsCount = $("#results-count");
    const resultsSub = $("#results-sub");
    const empty = $("#catalog-empty");
    const emptyReset = $("#catalog-empty-reset");
    const pagination = $("#catalog-pagination");
    const activeFilters = $("#active-filters");
    const searchForm = $("#catalog-search");
    const searchInput = $("#catalog-search-input");
    const sortSelect = $("#catalog-sort");
    const filterBadge = $("#filter-badge");
    const filterTrigger = $("#filter-trigger");
    const sidebar = $("#catalog-filters");
    const filterApply = $("#filters-apply");
    const filterReset = $("#filters-reset");
    const filterClose = $(".filters-close");
    const backdrop = $(".filter-backdrop");
    const quickChips = $$("[data-quick]");
    const indexRows = $$("[data-index-type]");
    const PER_PAGE = 6;

    const state = {
      query: "",
      types: new Set(),
      grades: new Set(),
      topics: new Set(),
      verified: false,
      saved: false,
      sort: "popular",
      page: 1,
    };

    const typeValues = new Set(Object.keys(data.typeLabels));
    const gradeValues = new Set(Object.keys(data.gradeLabels));
    const topicValues = new Set(data.topics);
    const sortValues = new Set(["popular", "new", "rating", "title"]);

    /* Read URL */
    try {
      const params = new URLSearchParams(window.location.search);
      state.query = (params.get("q") || "").trim();

      (params.get("type") || "")
        .split(",")
        .filter((value) => typeValues.has(value))
        .forEach((value) => state.types.add(value));

      (params.get("grade") || "")
        .split(",")
        .filter((value) => gradeValues.has(value))
        .forEach((value) => state.grades.add(value));

      (params.get("topic") || "")
        .split(",")
        .filter((value) => topicValues.has(value))
        .forEach((value) => state.topics.add(value));

      state.verified = params.get("verified") === "1";
      state.saved = params.get("saved") === "1";

      const sort = params.get("sort");
      if (sort && sortValues.has(sort)) state.sort = sort;

      const page = Number(params.get("page"));
      if (Number.isInteger(page) && page > 0) state.page = page;
    } catch {
      /* ignore malformed URLs */
    }

    if (searchInput) searchInput.value = state.query;

    /* Counts */
    const setCount = (selector, value) => {
      $$(selector).forEach((element) => {
        element.textContent = String(value);
      });
    };

    Object.keys(data.typeLabels).forEach((type) => {
      setCount(`[data-count-type="${type}"]`, all.filter((item) => item.type === type).length);
    });
    Object.keys(data.gradeLabels).forEach((grade) => {
      setCount(
        `[data-count-grade="${grade}"]`,
        all.filter((item) => item.grade === grade).length
      );
    });
    data.topics.forEach((topic) => {
      setCount(
        `[data-count-topic="${topic}"]`,
        all.filter((item) => item.topic === topic).length
      );
    });

    /* Filtering and sorting */
    function getFiltered() {
      const query = normalize(state.query);

      const filtered = all.filter((item) => {
        if (state.types.size && !state.types.has(item.type)) return false;
        if (state.grades.size && !state.grades.has(item.grade)) return false;
        if (state.topics.size && !state.topics.has(item.topic)) return false;
        if (state.verified && !item.verified) return false;
        if (state.saved && !savedItems.has(materialKey(item.title))) return false;

        if (query) {
          const author = data.authors[item.author] || {};
          const haystack = normalize(
            [
              item.title,
              item.desc,
              item.keywords,
              item.topic,
              item.gradeLabel,
              data.typeLabels[item.type],
              author.name,
              author.role,
            ].join(" ")
          );
          if (!query.split(" ").every((word) => haystack.includes(word))) return false;
        }

        return true;
      });

      const sorters = {
        popular: (a, b) => b.downloads - a.downloads,
        new: (a, b) => String(b.added).localeCompare(String(a.added)),
        rating: (a, b) => b.rating - a.rating || b.downloads - a.downloads,
        title: (a, b) =>
          a.title.localeCompare(b.title, "ru", { sensitivity: "base" }),
      };

      return filtered.sort(sorters[state.sort] || sorters.popular);
    }

    /* URL */
    function syncURL() {
      try {
        const params = new URLSearchParams();
        if (state.query) params.set("q", state.query);
        if (state.types.size) params.set("type", [...state.types].join(","));
        if (state.grades.size) params.set("grade", [...state.grades].join(","));
        if (state.topics.size) params.set("topic", [...state.topics].join(","));
        if (state.verified) params.set("verified", "1");
        if (state.saved) params.set("saved", "1");
        if (state.sort !== "popular") params.set("sort", state.sort);
        if (state.page > 1) params.set("page", String(state.page));

        const queryString = params.toString();
        const url = `${window.location.pathname}${queryString ? `?${queryString}` : ""}${
          window.location.hash
        }`;
        window.history.replaceState(null, "", url);
      } catch {
        /* history may be unavailable in file:// preview */
      }
    }

    /* UI state */
    function updateInputs() {
      $$('input[data-filter="type"]').forEach((input) => {
        input.checked = state.types.has(input.value);
      });
      $$('input[data-filter="grade"]').forEach((input) => {
        input.checked = state.grades.has(input.value);
      });
      $$('input[data-filter="topic"]').forEach((input) => {
        input.checked = state.topics.has(input.value);
      });
      const verified = $("#verified-filter");
      if (verified) verified.checked = state.verified;
      const saved = $("#saved-filter");
      if (saved) saved.checked = state.saved;
      if (sortSelect) sortSelect.value = state.sort;

      indexRows.forEach((row) => {
        const type = row.dataset.indexType;
        row.classList.toggle(
          "is-active",
          type === "all" ? state.types.size === 0 : state.types.has(type)
        );
      });

      if (filterBadge) {
        const count =
          (state.query ? 1 : 0) +
          state.types.size +
          state.grades.size +
          state.topics.size +
          (state.verified ? 1 : 0) +
          (state.saved ? 1 : 0);
        filterBadge.dataset.count = String(count);
        filterBadge.textContent = String(count);
      }

      if (filterReset) filterReset.disabled = false;
    }

    function renderActiveFilters() {
      if (!activeFilters) return;
      const chips = [];

      if (state.query) {
        chips.push(
          `<button class="active-filter" type="button" data-remove-filter="query">«${data.escapeHtml(
            state.query
          )}» <span aria-hidden="true">×</span></button>`
        );
      }
      state.types.forEach((value) => {
        chips.push(
          `<button class="active-filter" type="button" data-remove-filter="type" data-filter-value="${data.escapeHtml(
            value
          )}">${data.escapeHtml(data.typeLabels[value])} <span aria-hidden="true">×</span></button>`
        );
      });
      state.grades.forEach((value) => {
        chips.push(
          `<button class="active-filter" type="button" data-remove-filter="grade" data-filter-value="${data.escapeHtml(
            value
          )}">${data.escapeHtml(data.gradeLabels[value])} <span aria-hidden="true">×</span></button>`
        );
      });
      state.topics.forEach((value) => {
        chips.push(
          `<button class="active-filter" type="button" data-remove-filter="topic" data-filter-value="${data.escapeHtml(
            value
          )}">${data.escapeHtml(value)} <span aria-hidden="true">×</span></button>`
        );
      });
      if (state.verified) {
        chips.push(
          `<button class="active-filter" type="button" data-remove-filter="verified">Только проверенные <span aria-hidden="true">×</span></button>`
        );
      }
      if (state.saved) {
        chips.push(
          `<button class="active-filter" type="button" data-remove-filter="saved">Моя подборка <span aria-hidden="true">×</span></button>`
        );
      }

      activeFilters.innerHTML = chips.join("");
      activeFilters.hidden = chips.length === 0;
    }

    /* Pagination */
    function buildPages(current, total) {
      if (total <= 7) {
        return Array.from({ length: total }, (_, index) => index + 1);
      }

      const pages = [1];
      if (current > 3) pages.push("start-ellipsis");
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let page = start; page <= end; page += 1) pages.push(page);
      if (current < total - 2) pages.push("end-ellipsis");
      pages.push(total);
      return pages;
    }

    function renderPagination(totalPages) {
      if (!pagination) return;
      if (totalPages <= 1) {
        pagination.hidden = true;
        pagination.innerHTML = "";
        return;
      }

      const pages = buildPages(state.page, totalPages);
      const items = [
        `<button class="page-btn page-btn--prev page-btn--wide" type="button" data-page="${
          state.page - 1
        }" ${state.page === 1 ? "disabled" : ""} aria-label="Предыдущая страница"><svg class="icon" aria-hidden="true"><use href="#i-arrow-right"/></svg><span>Назад</span></button>`,
      ];

      pages.forEach((page) => {
        if (typeof page === "string") {
          items.push('<span class="page-ellipsis" aria-hidden="true">…</span>');
          return;
        }
        const active = page === state.page;
        items.push(
          `<button class="page-btn${active ? " is-active" : ""}" type="button" data-page="${page}" ${
            active ? 'aria-current="page"' : ""
          } aria-label="Страница ${page}">${page}</button>`
        );
      });

      items.push(
        `<button class="page-btn page-btn--wide" type="button" data-page="${
          state.page + 1
        }" ${state.page === totalPages ? "disabled" : ""} aria-label="Следующая страница"><span>Далее</span><svg class="icon" aria-hidden="true"><use href="#i-arrow-right"/></svg></button>`
      );

      pagination.innerHTML = items.join("");
      pagination.hidden = false;
    }

    /* Render */
    function render({ scroll = false } = {}) {
      const filtered = getFiltered();
      const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
      state.page = Math.min(Math.max(1, state.page), totalPages);

      const start = (state.page - 1) * PER_PAGE;
      const visible = filtered.slice(start, start + PER_PAGE);

      grid.innerHTML = visible
        .map((item) => data.renderMaterialCard(item, all.indexOf(item)))
        .join("");
      syncSavedButtons(grid);

      if (empty) empty.hidden = filtered.length > 0;
      if (resultsCount) {
        resultsCount.innerHTML =
          filtered.length === 0
            ? "Ничего не найдено"
            : `Найдено <strong>${filtered.length}</strong> ${plural(filtered.length, [
                "материал",
                "материала",
                "материалов",
              ])}`;
      }

      if (resultsSub) {
        if (!filtered.length) {
          resultsSub.textContent = "Попробуйте изменить запрос или сбросить часть фильтров.";
        } else if (state.saved) {
          resultsSub.textContent = `в вашей подборке · всего ${all.length} в библиотеке`;
        } else {
          resultsSub.textContent = `из ${all.length} в библиотеке · страница ${state.page} из ${totalPages}`;
        }
      }

      renderPagination(totalPages);
      renderActiveFilters();
      updateInputs();
      syncURL();

      if (scroll) {
        $("#materials")?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
      }
    }

    function resetAll({ scroll = true } = {}) {
      state.query = "";
      state.types.clear();
      state.grades.clear();
      state.topics.clear();
      state.verified = false;
      state.saved = false;
      state.sort = "popular";
      state.page = 1;
      if (searchInput) searchInput.value = "";
      render({ scroll });
    }

    /* Filter events */
    $$('input[data-filter="type"]').forEach((input) => {
      input.addEventListener("change", () => {
        if (input.checked) state.types.add(input.value);
        else state.types.delete(input.value);
        state.page = 1;
        render();
      });
    });

    $$('input[data-filter="grade"]').forEach((input) => {
      input.addEventListener("change", () => {
        if (input.checked) state.grades.add(input.value);
        else state.grades.delete(input.value);
        state.page = 1;
        render();
      });
    });

    $$('input[data-filter="topic"]').forEach((input) => {
      input.addEventListener("change", () => {
        if (input.checked) state.topics.add(input.value);
        else state.topics.delete(input.value);
        state.page = 1;
        render();
      });
    });

    $("#verified-filter")?.addEventListener("change", (event) => {
      state.verified = event.target.checked;
      state.page = 1;
      render();
    });

    $("#saved-filter")?.addEventListener("change", (event) => {
      state.saved = event.target.checked;
      state.page = 1;
      render();
    });

    sortSelect?.addEventListener("change", () => {
      state.sort = sortSelect.value;
      state.page = 1;
      render();
    });

    /* Search */
    let searchTimer;
    searchForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      clearTimeout(searchTimer);
      state.query = searchInput?.value.trim() || "";
      state.page = 1;
      render({ scroll: true });
    });

    searchInput?.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = window.setTimeout(() => {
        state.query = searchInput.value.trim();
        state.page = 1;
        render();
      }, 220);
    });

    /* Active chips */
    activeFilters?.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-remove-filter]");
      if (!chip) return;
      const kind = chip.dataset.removeFilter;
      const value = chip.dataset.filterValue;

      if (kind === "query") {
        state.query = "";
        if (searchInput) searchInput.value = "";
      } else if (kind === "type") {
        state.types.delete(value);
      } else if (kind === "grade") {
        state.grades.delete(value);
      } else if (kind === "topic") {
        state.topics.delete(value);
      } else if (kind === "verified") {
        state.verified = false;
      } else if (kind === "saved") {
        state.saved = false;
      }

      state.page = 1;
      render();
    });

    /* Quick chips */
    quickChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        if (chip.dataset.quick === "verified") {
          state.verified = !state.verified;
        } else if (chip.dataset.quick === "grade") {
          const value = chip.dataset.value;
          if (state.grades.has(value) && state.grades.size === 1) state.grades.clear();
          else {
            state.grades.clear();
            state.grades.add(value);
          }
        } else if (chip.dataset.quick === "type") {
          const value = chip.dataset.value;
          if (state.types.has(value) && state.types.size === 1) state.types.clear();
          else {
            state.types.clear();
            state.types.add(value);
          }
        } else if (chip.dataset.quick === "query") {
          const value = chip.dataset.value;
          state.query = state.query === value ? "" : value;
          if (searchInput) searchInput.value = state.query;
        }
        state.page = 1;
        render({ scroll: true });
      });
    });

    /* Catalog index */
    indexRows.forEach((row) => {
      row.addEventListener("click", () => {
        const value = row.dataset.indexType;
        if (value === "all") state.types.clear();
        else if (state.types.size === 1 && state.types.has(value)) state.types.clear();
        else {
          state.types.clear();
          state.types.add(value);
        }
        state.page = 1;
        render({ scroll: true });
      });
    });

    /* Reset */
    filterReset?.addEventListener("click", () => resetAll());
    emptyReset?.addEventListener("click", () => resetAll());

    /* Pagination */
    pagination?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-page]");
      if (!button || button.disabled) return;
      const target = Number(button.dataset.page);
      if (!Number.isInteger(target)) return;
      state.page = target;
      render({ scroll: true });
    });

    /* Mobile filter drawer */
    function openFilters() {
      if (!sidebar) return;
      sidebar.classList.add("is-open");
      document.body.classList.add("filters-open");
      filterTrigger?.setAttribute("aria-expanded", "true");
      filterClose?.focus({ preventScroll: true });
    }

    function closeFilters() {
      if (!sidebar) return;
      sidebar.classList.remove("is-open");
      document.body.classList.remove("filters-open");
      filterTrigger?.setAttribute("aria-expanded", "false");
    }

    filterTrigger?.addEventListener("click", () => {
      if (sidebar?.classList.contains("is-open")) closeFilters();
      else openFilters();
    });

    filterClose?.addEventListener("click", closeFilters);
    filterApply?.addEventListener("click", () => {
      closeFilters();
      filterTrigger?.focus({ preventScroll: true });
    });
    backdrop?.addEventListener("click", closeFilters);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && sidebar?.classList.contains("is-open")) {
        closeFilters();
        filterTrigger?.focus({ preventScroll: true });
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) closeFilters();
    });

    /* Saved changes */
    document.addEventListener("dzyrdlab:savedchange", () => {
      if (state.saved) render();
      else syncSavedButtons();
    });

    render();
  }

  if ($("#catalog-grid")) initCatalog();

  /* ---------------------------------------------------------------------
     Auth
     --------------------------------------------------------------------- */
  function initAuth() {
    const loginForm = $("#auth-login-form");
    const registerForm = $("#auth-register-form");
    if (!loginForm || !registerForm) return;

    const tabs = $$("[data-auth-tab]");
    const title = $("#auth-title");
    const lead = $("#auth-lead");
    const sessionBanner = $("#auth-session");
    const sessionName = $("#auth-session-name");

    const modes = {
      login: {
        title: "С возвращением",
        lead: "Войдите, чтобы сохранять материалы, следить за рецензиями и публиковать разработки.",
      },
      register: {
        title: "Начните делиться опытом",
        lead: "Создайте профиль автора: это бесплатно, а права на материалы остаются у вас.",
      },
    };

    function setMode(mode, { updateHash = true } = {}) {
      const current = modes[mode] ? mode : "login";
      tabs.forEach((tab) => {
        const active = tab.dataset.authTab === current;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });

      loginForm.hidden = current !== "login";
      registerForm.hidden = current !== "register";
      if (title) title.textContent = modes[current].title;
      if (lead) lead.textContent = modes[current].lead;

      $$(".field-error", current === "login" ? loginForm : registerForm).forEach(
        (error) => (error.hidden = true)
      );
      $$('[aria-invalid="true"]', current === "login" ? loginForm : registerForm).forEach(
        (input) => input.removeAttribute("aria-invalid")
      );

      if (updateHash) {
        try {
          const url = `${window.location.pathname}${
            current === "register" ? "#register" : ""
          }`;
          window.history.replaceState(null, "", url);
        } catch {
          /* ignore */
        }
      }
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => setMode(tab.dataset.authTab));
    });

    $$("[data-auth-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        setMode(button.dataset.authMode);
        $("#auth-title")?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
      });
    });

    setMode(window.location.hash === "#register" ? "register" : "login", {
      updateHash: false,
    });

    /* Password visibility */
    $$("[data-password-toggle]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const field = toggle.closest(".password-field");
        const input = field?.querySelector("input");
        if (!input) return;

        const show = input.type === "password";
        input.type = show ? "text" : "password";
        toggle.setAttribute("aria-pressed", String(show));
        toggle.setAttribute(
          "aria-label",
          show ? "Скрыть пароль" : "Показать пароль"
        );
      });
    });

    /* Validation */
    $$(".field input, .field select, .field textarea").forEach((input) => {
      input.addEventListener("input", () => clearError(input));
      input.addEventListener("change", () => clearError(input));
    });

    function validateLogin() {
      const email = $("#login-email");
      const password = $("#login-password");
      let valid = true;
      let firstInvalid = null;

      if (!email?.value.trim() || !emailPattern.test(email.value.trim())) {
        setError(email, "Введите почту в формате name@example.ru");
        valid = false;
        firstInvalid = firstInvalid || email;
      }
      if (!password?.value.trim()) {
        setError(password, "Введите пароль");
        valid = false;
        firstInvalid = firstInvalid || password;
      }

      firstInvalid?.focus();
      return valid;
    }

    function validateRegister() {
      const name = $("#register-name");
      const email = $("#register-email");
      const password = $("#register-password");
      const consent = $("#register-consent");
      let valid = true;
      let firstInvalid = null;

      if (!name?.value.trim() || name.value.trim().length < 2) {
        setError(name, "Укажите имя — минимум 2 символа");
        valid = false;
        firstInvalid = firstInvalid || name;
      }
      if (!email?.value.trim() || !emailPattern.test(email.value.trim())) {
        setError(email, "Введите почту в формате name@example.ru");
        valid = false;
        firstInvalid = firstInvalid || email;
      }
      if (!password?.value || password.value.length < 8) {
        setError(password, "Пароль должен быть не короче 8 символов");
        valid = false;
        firstInvalid = firstInvalid || password;
      }
      if (!consent?.checked) {
        setError(consent, "Нужно согласие на обработку данных");
        valid = false;
        firstInvalid = firstInvalid || consent;
      }

      firstInvalid?.focus();
      return valid;
    }

    function showExistingSession(session) {
      if (!sessionBanner) return;
      sessionBanner.hidden = false;
      if (sessionName) sessionName.textContent = session.name;
    }

    const existing = readSession();
    if (existing) showExistingSession(existing);

    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateLogin()) return;

      const email = $("#login-email").value.trim().toLowerCase();
      const known = readUsers().find((user) => user.email === email);
      const name = known?.name || "Гость DzyrdLab";
      const role = known?.role || "учитель осетинского языка";

      writeSession({
        name,
        email,
        role,
        roleKey: known?.roleKey || "teacher",
        demo: false,
      });

      showToast(`Добро пожаловать, ${getFirstName(name)}!`);
      window.setTimeout(() => {
        window.location.href = "profile.html";
      }, 450);
    });

    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateRegister()) return;

      const name = $("#register-name").value.trim();
      const email = $("#register-email").value.trim().toLowerCase();
      const roleKey = $("#register-role").value;
      const roleSelect = $("#register-role");
      const role = roleSelect.options[roleSelect.selectedIndex]?.text || "Учитель";

      const user = {
        name,
        email,
        role,
        roleKey,
        demo: false,
        createdAt: new Date().toISOString(),
      };

      saveUser(user);
      writeSession(user);
      showToast("Профиль создан. Добро пожаловать в DzyrdLab!");
      window.setTimeout(() => {
        window.location.href = "profile.html";
      }, 500);
    });

    $("#auth-demo")?.addEventListener("click", () => {
      writeSession({
        name: "Агунда Дзагоева",
        email: "a.dzagoeva@example.ru",
        role: "учитель осетинского языка, школа № 27",
        roleKey: "teacher",
        demo: true,
      });
      showToast("Включён демо-режим автора.");
      window.setTimeout(() => {
        window.location.href = "profile.html";
      }, 500);
    });
  }

  if ($("#auth-login-form")) initAuth();

  /* ---------------------------------------------------------------------
     Profile
     --------------------------------------------------------------------- */
  function initProfile() {
    const page = $("#profile-page");
    if (!page || !data) return;

    const session = readSession();
    const isDemo = !session || Boolean(session.demo);
    const demoUser = {
      name: "Агунда Дзагоева",
      email: "a.dzagoeva@example.ru",
      role: "учитель осетинского языка, школа № 27",
      roleKey: "teacher",
      location: "Владикавказ",
      since: "2024",
      demo: true,
    };

    const user = isDemo
      ? {
          ...demoUser,
          ...(session ? { name: session.name, email: session.email, role: session.role } : {}),
        }
      : {
          ...session,
          location: session.location || "Республика Северная Осетия — Алания",
          since: session.since || String(new Date().getFullYear()),
        };

    const hasDemoContent = isDemo;

    const setText = (selector, value) => {
      const element = $(selector, page);
      if (element) element.textContent = value;
    };

    setText("[data-profile-name]", user.name);
    setText("[data-profile-role]", user.role || "учитель осетинского языка");
    setText("[data-profile-email]", user.email || "");
    setText("[data-profile-initials]", getInitials(user.name));
    setText("[data-profile-location]", user.location || "Осетия");
    setText("[data-profile-since]", user.since || String(new Date().getFullYear()));

    const demoBadge = $("#profile-demo-badge");
    if (demoBadge) demoBadge.hidden = !isDemo;

    /* Stats */
    const ownItems = hasDemoContent
      ? [data.getMaterial("narty-epos"), data.getMaterial("padezhi"), data.getMaterial("lirika-kosta")]
      : [];

    const setStat = (key, value) => {
      const element = $(`[data-profile-stat="${key}"]`, page);
      if (element) element.textContent = value;
    };

    if (hasDemoContent) {
      setStat("materials", "14");
      setStat("downloads", "12 480");
      setStat("rating", "4.9");
    } else {
      setStat("materials", "0");
      setStat("downloads", "0");
      setStat("rating", "—");
    }

    /* Saved materials */
    const savedGrid = $("#saved-grid");
    const savedEmpty = $("#saved-empty");
    const savedCount = $("[data-profile-count='saved']");

    function savedMaterials() {
      return data.materials.filter((item) => savedItems.has(materialKey(item.title)));
    }

    function renderSaved() {
      const items = savedMaterials();
      if (savedCount) savedCount.textContent = String(items.length);
      setStat("saved", String(items.length));

      if (!savedGrid || !savedEmpty) return;
      savedGrid.innerHTML = items
        .map((item) => data.renderMaterialCard(item, data.materials.indexOf(item)))
        .join("");
      syncSavedButtons(savedGrid);
      savedGrid.hidden = items.length === 0;
      savedEmpty.hidden = items.length > 0;
    }

    document.addEventListener("dzyrdlab:savedchange", renderSaved);

    $("#saved-clear")?.addEventListener("click", () => {
      savedItems.clear();
      persistSaved();
      renderSaved();
      showToast("Подборка очищена.");
    });

    /* Uploads */
    const uploadsList = $("#uploads-list");
    const uploadsEmpty = $("#uploads-empty");
    const uploadsCount = $("[data-profile-count='uploads']");

    const statuses = {
      "narty-epos": { label: "Опубликован", className: "published" },
      padezhi: { label: "На проверке", className: "review" },
      "lirika-kosta": { label: "Черновик", className: "draft" },
    };

    function renderUploads() {
      if (!uploadsList || !uploadsEmpty) return;
      if (!hasDemoContent) {
        uploadsList.innerHTML = "";
        uploadsList.hidden = true;
        uploadsEmpty.hidden = false;
        if (uploadsCount) uploadsCount.textContent = "0";
        return;
      }

      const rows = ownItems
        .filter(Boolean)
        .map((item) => {
          const status = statuses[item.id] || statuses["narty-epos"];
          return `
            <div class="upload-row">
              <span class="mini-cover cover--${data.escapeHtml(item.cover)}" aria-hidden="true">
                <span class="mini-cover-type">${data.escapeHtml(item.topic)}</span>
                <span class="mini-cover-glyph">${data.escapeHtml(item.glyph)}</span>
                <span class="mini-cover-title">${item.coverLines
                  .map((line) => data.escapeHtml(line))
                  .join("<br>")}</span>
              </span>
              <div class="upload-copy">
                <p class="upload-title"><a href="#" data-demo="Страница материала появится в следующей версии прототипа.">${data.escapeHtml(
                  item.title
                )}</a></p>
                <div class="upload-meta">
                  <span class="status status--${status.className}">${status.label}</span>
                  <span>${data.escapeHtml(item.topic)}</span>
                  <span class="meta-sep" aria-hidden="true"></span>
                  <span>${data.formatNumber(item.downloads)} скачиваний</span>
                  <span class="meta-sep" aria-hidden="true"></span>
                  <span>${data.escapeHtml(item.volume)}</span>
                </div>
              </div>
              <div class="upload-actions">
                <button class="btn btn-outline" type="button" data-demo="Редактирование появится в следующей версии прототипа.">Изменить</button>
                <button class="btn btn-ghost" type="button" data-demo="Страница материала появится в следующей версии прототипа.">Открыть</button>
              </div>
            </div>`;
        })
        .join("");

      uploadsList.innerHTML = rows;
      uploadsList.hidden = rows.length === 0;
      uploadsEmpty.hidden = rows.length > 0;
      if (uploadsCount) uploadsCount.textContent = String(rows.length);
    }

    /* Reviews */
    const reviewsList = $("#reviews-list");
    const reviewsEmpty = $("#reviews-empty");
    const reviewsCount = $("[data-profile-count='reviews']");

    const reviewData = [
      {
        target: "Нартский эпос: герои и смыслы",
        rating: 5,
        text: "Очень ясная структура и сильные вопросы для дискуссии. Взяла конспект целиком, детям понравилось обсуждать поступки героев.",
        date: "12 октября 2026",
        status: "Опубликована",
      },
      {
        target: "Ӕ, ӕ: учимся читать и писать",
        rating: 4,
        text: "Полезные задания для первого класса. Добавила бы больше места для письма, но в целом рабочий лист экономит много времени.",
        date: "8 октября 2026",
        status: "На проверке",
      },
    ];

    const stars = (rating) =>
      Array.from(
        { length: 5 },
        (_, index) =>
          `<svg class="icon${index < rating ? " icon--fill" : " icon--empty"}" aria-hidden="true"><use href="#i-star"/></svg>`
      ).join("");

    function renderReviews() {
      if (!reviewsList || !reviewsEmpty) return;
      if (!hasDemoContent) {
        reviewsList.innerHTML = "";
        reviewsList.hidden = true;
        reviewsEmpty.hidden = false;
        if (reviewsCount) reviewsCount.textContent = "0";
        return;
      }

      reviewsList.innerHTML = reviewData
        .map(
          (review) => `
            <article class="review-item">
              <div class="review-head">
                <p class="review-target">${data.escapeHtml(review.target)}</p>
                <span class="review-stars" aria-label="Оценка ${review.rating} из 5">${stars(
                  review.rating
                )}</span>
              </div>
              <p class="review-text">${data.escapeHtml(review.text)}</p>
              <p class="review-meta"><span>${data.escapeHtml(review.date)}</span><span>${data.escapeHtml(
                review.status
              )}</span></p>
            </article>`
        )
        .join("");
      reviewsList.hidden = false;
      reviewsEmpty.hidden = true;
      if (reviewsCount) reviewsCount.textContent = String(reviewData.length);
    }

    renderUploads();
    renderSaved();
    renderReviews();

    /* Tabs */
    const tabs = $$("[data-profile-tab]");
    const panels = $$("[data-profile-panel]");

    function setTab(name, { updateHash = true } = {}) {
      const exists = panels.some((panel) => panel.dataset.profilePanel === name);
      const current = exists ? name : "uploads";

      tabs.forEach((tab) => {
        const active = tab.dataset.profileTab === current;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-pressed", String(active));
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.profilePanel !== current;
      });

      if (updateHash) {
        try {
          window.history.replaceState(
            null,
            "",
            `${window.location.pathname}${current === "uploads" ? "" : `#${current}`}`
          );
        } catch {
          /* ignore */
        }
      }
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => setTab(tab.dataset.profileTab));
    });

    setTab(window.location.hash.replace("#", "") || "uploads", { updateHash: false });

    /* Dialog */
    const dialog = $("#edit-profile-dialog");
    const editForm = $("#edit-profile-form");

    function fillEditForm() {
      if (!editForm) return;
      const name = $("#edit-name");
      const email = $("#edit-email");
      const role = $("#edit-role");
      const about = $("#edit-about");

      if (name) name.value = user.name || "";
      if (email) email.value = user.email || "";
      if (role) role.value = user.roleKey || "teacher";
      if (about) about.value = session?.about || "";
    }

    $("#edit-profile-open")?.addEventListener("click", () => {
      fillEditForm();
      if (typeof dialog?.showModal === "function") dialog.showModal();
    });

    $$("[data-dialog-close]", dialog || document).forEach((button) => {
      button.addEventListener("click", () => dialog?.close());
    });

    dialog?.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });

    editForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const nameInput = $("#edit-name");
      const emailInput = $("#edit-email");
      const roleSelect = $("#edit-role");
      const aboutInput = $("#edit-about");

      let valid = true;
      [nameInput, emailInput].forEach((input) => clearError(input));

      if (!nameInput?.value.trim() || nameInput.value.trim().length < 2) {
        setError(nameInput, "Укажите имя — минимум 2 символа");
        valid = false;
      }
      if (!emailInput?.value.trim() || !emailPattern.test(emailInput.value.trim())) {
        setError(emailInput, "Введите почту в формате name@example.ru");
        valid = false;
      }
      if (!valid) {
        (nameInput?.getAttribute("aria-invalid") ? nameInput : emailInput)?.focus();
        return;
      }

      const role = roleSelect?.options[roleSelect.selectedIndex]?.text || "Учитель";
      const nextSession = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim().toLowerCase(),
        role,
        roleKey: roleSelect?.value || "teacher",
        about: aboutInput?.value.trim() || "",
        demo: session ? Boolean(session.demo) : true,
        location: user.location,
        since: user.since,
      };

      writeSession(nextSession);
      dialog?.close();

      setText("[data-profile-name]", nextSession.name);
      setText("[data-profile-role]", nextSession.role);
      setText("[data-profile-email]", nextSession.email);
      setText("[data-profile-initials]", getInitials(nextSession.name));

      const headerName = $("[data-profile-name]");
      if (headerName) headerName.textContent = nextSession.name;

      showToast("Профиль обновлён.");
    });

    /* Upload CTA */
    $$("[data-profile-upload]").forEach((button) => {
      button.addEventListener("click", () => {
        showToast("Форма загрузки появится в следующей версии прототипа.");
      });
    });
  }

  if ($("#profile-page")) initProfile();
})();
