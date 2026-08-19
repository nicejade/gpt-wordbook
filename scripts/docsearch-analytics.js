(() => {
  const GLOBAL_FLAG = "__WORDBOOK_DOCSEARCH_ANALYTICS_INITIALIZED__";
  const DEBOUNCE_MS = 500;

  if (typeof window === "undefined" || window[GLOBAL_FLAG]) {
    return;
  }

  window[GLOBAL_FLAG] = true;

  let latestQuery = "";
  let searchDebounceTimer = null;
  let hasOpenedModal = false;
  let openedViaShortcut = false;

  const normalizeText = (value) => {
    if (typeof value !== "string") {
      return "";
    }
    return value.trim().slice(0, 64);
  };

  /**
   * Sends a GA4-compatible event. Uses recommended events/parameters where possible
   * (`search` + `search_term`, `select_content` + `content_type`/`content_id`).
   *
   * Note: Most parameters still require registering Custom dimensions in GA4 Admin
   * before they appear in standard reports and Explorations.
   */
  const sendAnalyticsEvent = (eventName, payload = {}) => {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, payload);
      return;
    }

    // Fallback: queue an arguments-style entry that gtag.js will replay on boot.
    // GA4 (gtag direct) only recognizes this shape; the GTM-style `{event: ...}`
    // object is silently ignored unless a GTM container is present.
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(["event", eventName, payload]);
  };

  const onSearchInput = (target) => {
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    if (target.id !== "docsearch-input") {
      return;
    }

    const query = normalizeText(target.value);
    latestQuery = query;

    if (searchDebounceTimer) {
      window.clearTimeout(searchDebounceTimer);
    }

    searchDebounceTimer = window.setTimeout(() => {
      if (!query) {
        return;
      }
      sendAnalyticsEvent("search", {
        search_term: query,
        query_length: query.length,
      });
    }, DEBOUNCE_MS);
  };

  const parseHitIndex = (itemId) => {
    const match = /^docsearch-item-(\d+)$/.exec(itemId);
    return match ? Number(match[1]) : undefined;
  };

  const onResultClick = (target) => {
    if (!(target instanceof Element)) {
      return;
    }
    const resultLink = target.closest(".DocSearch-Hit a");
    if (!(resultLink instanceof HTMLAnchorElement)) {
      return;
    }

    const titleNode = resultLink.querySelector(".DocSearch-Hit-title");
    const title = normalizeText(titleNode?.textContent || "");
    const href = resultLink.getAttribute("href") || resultLink.href || "";
    const itemId = resultLink.closest(".DocSearch-Hit")?.id || "";
    const hitIndex = parseHitIndex(itemId);

    sendAnalyticsEvent("select_content", {
      content_type: "docsearch_result",
      content_id: href,
      search_term: latestQuery,
      content_title: title,
      ...(hitIndex !== undefined ? { item_list_index: hitIndex } : {}),
    });
  };

  const observeModalOpen = () => {
    const observer = new MutationObserver(() => {
      const modal = document.querySelector(".DocSearch-Modal");
      if (modal && !hasOpenedModal) {
        hasOpenedModal = true;
        sendAnalyticsEvent("docsearch_open", {
          method: "modal_visible",
        });
      }
      if (!modal) {
        hasOpenedModal = false;
        latestQuery = "";
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    if (target.closest(".DocSearch-Button")) {
      if (openedViaShortcut) {
        openedViaShortcut = false;
      } else {
        sendAnalyticsEvent("docsearch_open", {
          method: "search_button",
        });
      }
    }

    onResultClick(target);
  });

  document.addEventListener("input", (event) => {
    onSearchInput(event.target);
  });

  const isEditingContent = (event) => {
    const element = event.target;
    if (!(element instanceof HTMLElement)) {
      return false;
    }
    const tagName = element.tagName;
    return (
      element.isContentEditable ||
      tagName === "INPUT" ||
      tagName === "SELECT" ||
      tagName === "TEXTAREA"
    );
  };

  const isSearchActive = () =>
    document.body.classList.contains("DocSearch--active");

  const getSearchButton = () => document.querySelector(".DocSearch-Button");

  const openSearch = () => {
    const button = getSearchButton();
    if (button instanceof HTMLButtonElement && !isSearchActive()) {
      button.click();
    }
  };

  const closeSearch = () => {
    if (!isSearchActive()) {
      return;
    }
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        bubbles: true,
      })
    );
  };

  document.addEventListener(
    "keydown",
    (event) => {
      const key = event.key.toLowerCase();
      const isCmdK = (event.metaKey || event.ctrlKey) && key === "k";
      const isSlash =
        !isEditingContent(event) && event.key === "/" && !isSearchActive();

      if (!isCmdK && !isSlash) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      if (isCmdK && isSearchActive()) {
        closeSearch();
        return;
      }

      sendAnalyticsEvent("docsearch_open", {
        method: isCmdK ? "keyboard_shortcut" : "slash_shortcut",
      });
      openedViaShortcut = true;
      openSearch();
    },
    true
  );

  observeModalOpen();
})();
