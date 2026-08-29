/**
 * Samakan CMS - Frontend API Renderer (Refactor/Optimized)
 * - Same public functions / same flow
 * - More efficient helpers, less repetition, safer URLs
 */

// const API_URL = "https://cms.samakan.com/api/public/site"; // <-- UBAH kalau endpoint kamu beda
// const ASSET_BASE = "http://cms.samakan.com"; // contoh: "https://domain.com" kalau image path perlu absolute
const API_URL = "https://cms.samakan.id/api/public/site";
const ASSET_BASE = "https//cms.samakan.id";

let SITE = null;
let LANG = "id";

/* =========================
   1) LANGUAGE GUARD (FIX)
   ========================= */
(function initLanguageGuard() {
  const pending = { lang: null };

  window.setLanguage = function setLanguage(lang) {
    pending.lang = lang;
    if (!window.__SAMAKAN_SITE_READY__) return;
    window.__SAMAKAN_APPLY_LANGUAGE__(lang);
  };

  window.__SAMAKAN_GET_PENDING_LANG__ = () => pending.lang;
})();

/* =========================
   2) HELPERS (Optimized)
   ========================= */

// keep original name (t) for compatibility, but internally we use pickLang
function t(obj, keyId, keyEn) {
  if (!obj) return "";
  return LANG === "en" ? (obj[keyEn] ?? "") : (obj[keyId] ?? "");
}

function pickLang(obj, keyBase) {
  if (!obj) return "";
  const k = LANG === "en" ? `${keyBase}_en` : `${keyBase}_id`;
  return obj[k] ?? "";
}

function setText(el, text) {
  if (el) el.textContent = text ?? "";
}

function setHTML(el, html) {
  if (el) el.innerHTML = html ?? "";
}

function setAttr(el, attr, val) {
  if (!el) return;
  if (val === null || val === undefined || val === "") return;
  el.setAttribute(attr, String(val));
}

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function safeUrl(path) {
  if (!path) return "";

  const u = String(path).trim();
  if (!u) return "";

  // already absolute
  if (/^https?:\/\//i.test(u)) return u;

  // normalize double slashes
  if (u.startsWith("/")) return `${ASSET_BASE}${u}`;
  return `${ASSET_BASE}/${u}`;
}

// alias because your code uses resolveAssetUrl() in renderEarlyProgram
function resolveAssetUrl(path) {
  return safeUrl(path);
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeNavUrl(url) {
  if (!url) return "#";
  const u = String(url).trim();
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("#")) return u;
  if (u.startsWith("/#")) return u.slice(1);
  return `#${u.replace(/^\/+/, "").replace(/^#/, "")}`;
}

function getActiveSorted(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((x) => String(x?.is_active) === "1" || Number(x?.is_active) === 1)
    .sort((a, b) => (a?.sort_order ?? 999) - (b?.sort_order ?? 999));
}

function toggleLangButtons() {
  const idBtn = qs("#lang-id");
  const enBtn = qs("#lang-en");
  const midBtn = qs("#mobile-lang-id");
  const menBtn = qs("#mobile-lang-en");

  const active = ["bg-orange-500", "text-white"];
  const inactive = ["text-gray-700"];

  const all = [idBtn, enBtn, midBtn, menBtn].filter(Boolean);

  all.forEach((b) => {
    b.classList.remove(...active);
    b.classList.remove(...inactive);
  });

  const isId = LANG === "id";

  if (idBtn && enBtn) {
    if (isId) {
      idBtn.classList.add(...active);
      enBtn.classList.add(...inactive);
    } else {
      enBtn.classList.add(...active);
      idBtn.classList.add(...inactive);
    }
  }

  if (midBtn && menBtn) {
    if (isId) {
      midBtn.classList.add(...active);
      menBtn.classList.add(...inactive);
    } else {
      menBtn.classList.add(...active);
      midBtn.classList.add(...inactive);
    }
  }
}

/* =========================
   3) RENDER FUNCTIONS
   ========================= */

function renderNavbar() {
  const navbar = SITE?.navbar;
  if (!navbar) return;

  const logoImg = qs("nav a[href='#home'] img");
  if (logoImg && navbar.logo_path) setAttr(logoImg, "src", safeUrl(navbar.logo_path));

  const ctaDesktop = qs("nav .hidden.desk\\:flex a.btn-vending");
  const ctaMobile = qs("#mobile-menu a.btn-vending");
  const ctaLabel = pickLang(navbar, "cta_label") || "Book a Machine 🎉";

  [ctaDesktop, ctaMobile].forEach((a) => {
    if (!a) return;
    setText(a, ctaLabel);
    setAttr(a, "href", navbar.cta_url || "#contact");
    setAttr(a, "target", "_blank");
  });

  const langWrapDesktop = qs("nav .hidden.desk\\:flex .border-3.border-orange-200");
  const langWrapMobile = qs("#mobile-menu .flex.items-center.space-x-2.py-4");
  const show = String(navbar.show_language_toggle) === "1";
  if (langWrapDesktop) langWrapDesktop.style.display = show ? "" : "none";
  if (langWrapMobile) langWrapMobile.style.display = show ? "" : "none";

  const items = getActiveSorted(navbar.items);

  const desktopNav = qs("nav .hidden.desk\\:flex.items-center.space-x-8");
  if (desktopNav) {
    setHTML(
      desktopNav,
      items
        .map((it) => {
          const label = pickLang(it, "label");
          const url = normalizeNavUrl(it.url);
          return `
            <a href="${url}"
              class="font-bold text-gray-700 hover:text-orange-500 transition-colors">
              ${label || ""}
            </a>
          `;
        })
        .join("")
    );
  }

  const mobileNavWrap = qs("#mobile-menu .mt-16.space-y-4");
  if (mobileNavWrap) {
    const langDiv = qs("#mobile-menu .mt-16.space-y-4 > .flex.items-center.space-x-2.py-4");
    if (langDiv) {
      let node = mobileNavWrap.firstElementChild;
      while (node && node !== langDiv) {
        const next = node.nextElementSibling;
        node.remove();
        node = next;
      }

      const frag = document.createDocumentFragment();
      items.forEach((it) => {
        const a = document.createElement("a");
        a.href = normalizeNavUrl(it.url);
        a.onclick = function () {
          if (typeof toggleMobileMenu === "function") toggleMobileMenu();
        };
        a.className = "block py-3 text-lg font-bold border-b-2 border-orange-100 hover:text-orange-500";
        a.textContent = pickLang(it, "label") || "";
        frag.appendChild(a);
      });

      mobileNavWrap.insertBefore(frag, langDiv);
    }
  }
}

function renderHero() {
  const hero = SITE?.hero;
  if (!hero) return;

  setText(qs("#badge-headline"), pickLang(hero, "badge"));
  setText(qs("#hero-headline"), pickLang(hero, "title"));
  setText(qs("#hero-subheadline"), pickLang(hero, "subtitle"));

  const heroCta = qs("#home a.btn-vending");
  if (heroCta) {
    setText(heroCta, pickLang(hero, "cta_label") || heroCta.textContent);
    setAttr(heroCta, "href", hero.cta_url || "#");
    setAttr(heroCta, "target", "_blank");
  }

  const heroImg = qs("#home img[alt='Modern Vending Machine']");
  const images = getActiveSorted(hero.images);
  if (heroImg && images.length) setAttr(heroImg, "src", safeUrl(images[0].image_path));
}

function renderAbout() {
  const about = SITE?.about;
  if (!about) return;

  setText(qs("#about-badge"), pickLang(about, "badge"));
  setText(qs("#about-title"), pickLang(about, "title"));
  setText(qs("#about p[data-i18n='about_desc1']"), pickLang(about, "description"));

  const cardsWrap = qs("#about .grid.md\\:grid-cols-2.gap-8.mb-16");
  if (cardsWrap) {
    const cards = getActiveSorted(about.cards);
    setHTML(
      cardsWrap,
      cards
        .map((c) => {
          const title = pickLang(c, "title");
          const desc = pickLang(c, "description");
          const isMission = c.card_type === "mission";
          const bg = isMission
            ? "background: linear-gradient(135deg, var(--color-secondary) 0%, #FFA726 100%);"
            : "";

          const icon =
            c.icon_key === "target"
              ? "https://api.iconify.design/mdi/target.svg?color=white&width=48&height=48"
              : "https://api.iconify.design/mdi/eye-outline.svg?color=white&width=48&height=48";

          return `
            <div class="vision-mission-card" style="${bg}">
              <div class="flex items-start gap-4 mb-6">
                <img src="${icon}" alt="${escapeHtml(title)}" class="w-12 h-12 flex-shrink-0" onerror="this.style.display='none'">
                <div>
                  <h3>${escapeHtml(title || "")}</h3>
                  <p>${escapeHtml(desc || "")}</p>
                </div>
              </div>
            </div>`;
        })
        .join("")
    );
  }

  const pointsWrap = qs("#about .snack-grid");
  if (pointsWrap) {
    const pts = getActiveSorted(about.points);

    const iconMap = {
      location: "https://api.iconify.design/mdi/map-marker-radius.svg?color=white&width=32&height=32",
      service: "https://api.iconify.design/mdi/cog-sync.svg?color=white&width=32&height=32",
      data: "https://api.iconify.design/mdi/chart-line.svg?color=white&width=32&height=32",
      brand: "https://api.iconify.design/mdi/gift-outline.svg?color=white&width=32&height=32",
    };

    const bgMap = {
      location: "from-orange-400 to-red-500",
      service: "from-amber-400 to-orange-500",
      data: "from-blue-400 to-purple-500",
      brand: "from-green-400 to-teal-500",
    };

    setHTML(
      pointsWrap,
      pts
        .map((p) => {
          const title = pickLang(p, "title");
          const desc = pickLang(p, "description");
          const icon = iconMap[p.icon_key] || iconMap.location;
          const bg = bgMap[p.icon_key] || bgMap.location;

          return `
            <div class="snack-card p-8">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br ${bg} flex items-center justify-center mb-6">
                <img src="${icon}" alt="${escapeHtml(title)}" class="w-8 h-8" onerror="this.style.display='none'">
              </div>
              <h3 class="font-display text-xl font-bold mb-3 text-gray-800">${escapeHtml(title || "")}</h3>
              <p class="text-gray-600">${escapeHtml(desc || "")}</p>
            </div>`;
        })
        .join("")
    );
  }
}

function renderServices() {
  const services = SITE?.services;
  if (!services) return;

  setText(qs("#services span#services-badge"), pickLang(services, "badge"));
  setText(qs("#services h2#services-title"), pickLang(services, "title"));
  setText(qs("#services p#services-description"), pickLang(services, "subtitle"));

  const grid = qs("#services .grid.md\\:grid-cols-2.lg\\:grid-cols-3.gap-8");
  if (!grid) return;

  const items = getActiveSorted(services.items);

  setHTML(
    grid,
    items
      .map((it, idx) => {
        const title = pickLang(it, "title");
        const desc = pickLang(it, "description");

        let iconSrc = "";
        if (it.icon_key && String(it.icon_key).startsWith("/uploads/")) iconSrc = safeUrl(it.icon_key);
        else iconSrc = "https://api.iconify.design/mdi/clock-fast.svg?color=white&width=48&height=48";

        return `
          <div class="snack-card p-8 text-center">
            <div class="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 icon-bounce"
                style="animation-delay:${idx * 0.2}s;">
              <img
                src="${iconSrc}"
                alt="${escapeHtml(title || "service icon")}"
                class="w-22 h-22 object-contain"
                onerror="this.style.display='none'"
              >
            </div>

            <h3 class="font-display text-2xl font-bold mb-4 text-gray-800">
              ${escapeHtml(title || "")}
            </h3>

            <p class="text-gray-600">
              ${escapeHtml(desc || "")}
            </p>
          </div>
        `;
      })
      .join("")
  );
}

function renderHowItWorks() {
  const hitw = SITE?.howitworks;
  if (!hitw) return;

  setText(qs("#how-it-works-badge"), pickLang(hitw, "badge"));
  setText(qs("#how-it-works-title"), pickLang(hitw, "title"));
  setText(qs("#how-it-works-subtitle"), pickLang(hitw, "subtitle"));

  const grid = qs("#how-it-works .grid.md\\:grid-cols-2.lg\\:grid-cols-4.gap-8");
  if (!grid) return;

  const items = getActiveSorted(hitw.items);

  const bgByIndex = [
    "from-orange-400 to-red-500",
    "from-amber-400 to-orange-500",
    "from-blue-400 to-purple-500",
    "from-green-400 to-teal-500",
  ];

  setHTML(
    grid,
    items
      .map((it, idx) => {
        const title = pickLang(it, "title");
        const desc = pickLang(it, "description");
        const iconSrc = it.icon_path ? safeUrl(it.icon_path) : "";

        return `
          <div class="snack-card p-8 text-center">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br ${bgByIndex[idx] || bgByIndex[0]} flex items-center justify-center mx-auto mb-6">
              ${
                iconSrc
                  ? `<img src="${iconSrc}" alt="${escapeHtml(title)}" class="w-100 h-100" onerror="this.style.display='none'">`
                  : `<span class="font-display text-white font-bold text-2xl">${idx + 1}</span>`
              }
            </div>

            <h3 class="font-display text-xl font-bold mb-3 text-gray-800">
              ${escapeHtml(title || "")}
            </h3>

            <p class="text-gray-600">
              ${escapeHtml(desc || "")}
            </p>
          </div>
        `;
      })
      .join("")
  );
}

function renderGallery() {
  const gallery = SITE?.gallery;
  if (!gallery) return;

  setText(qs("#gallery span#gallery-badge"), pickLang(gallery, "badge"));
  setText(qs("#gallery h2#gallery-title"), pickLang(gallery, "title"));
  setText(qs("#gallery p#gallery-description"), pickLang(gallery, "subtitle"));

  const wrap = qs("#lightgallery");
  if (!wrap) return;

  const items = getActiveSorted(gallery.items);
  if (!items.length) return;

  setHTML(
    wrap,
    items
      .map((it) => {
        const full = safeUrl(it.image_full_path || it.image_path || it.image_url || "");
        const thumb = safeUrl(it.image_thumb_path || it.image_path || it.image_url || "");
        const title = pickLang(it, "title") || it.title || "Gallery";
        return `
          <a href="${full}" class="gallery-item aspect-square" data-lightbox="vending-gallery" data-title="${escapeHtml(title)}">
            <img src="${thumb}" alt="${escapeHtml(title)}" onerror="this.style.display='none'">
          </a>
        `;
      })
      .join("")
  );
}

function renderLocations() {
  const locations = SITE?.locations;
  if (!locations) return;

  setText(qs("#locations span#locations-badge"), pickLang(locations, "badge"));
  setText(qs("#locations h2#locations-title"), pickLang(locations, "title"));
  setText(qs("#locations p#locations-desc"), pickLang(locations, "subtitle"));

  const grid = qs("#locations .grid.grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-5.gap-6");
  if (!grid) return;

  const items = getActiveSorted(locations.items).filter((x) => (x.title_id || x.title_en));

  const accentMap = {
    pink: "from-red-400 to-pink-500",
    blue: "from-blue-400 to-cyan-500",
    purple: "from-purple-400 to-indigo-500",
    green: "from-green-400 to-emerald-500",
    orange: "from-orange-400 to-amber-500",
  };

  const iconMap = {
    hospital: "https://api.iconify.design/mdi/hospital-building.svg?color=white&width=32&height=32",
    campus: "https://api.iconify.design/mdi/school.svg?color=white&width=32&height=32",
    office: "https://api.iconify.design/mdi/office-building.svg?color=white&width=32&height=32",
    gym: "https://api.iconify.design/mdi/dumbbell.svg?color=white&width=32&height=32",
    transport: "https://api.iconify.design/mdi/train-car.svg?color=white&width=32&height=32",
  };

  setHTML(
    grid,
    items
      .map((it) => {
        const title = pickLang(it, "title");
        const bg = accentMap[it.accent] || accentMap.orange;
        const icon = iconMap[it.icon_key] || "https://api.iconify.design/mdi/map-marker.svg?color=white&width=32&height=32";

        return `
          <div class="snack-card p-6 text-center">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br ${bg} flex items-center justify-center mx-auto mb-4">
              <img src="${icon}" alt="${escapeHtml(title)}" class="w-8 h-8" onerror="this.style.display='none'">
            </div>
            <h4 class="font-display font-bold text-gray-800">${escapeHtml(title || "")}</h4>
          </div>
        `;
      })
      .join("")
  );
}

function renderPartners() {
  const partners = SITE?.partners;
  const navbar = SITE?.navbar;
  if (!partners) return;

  setText(qs("#partners h1[data-i18n='partners_page_title']"), pickLang(partners, "title"));
  setText(qs("#partners p[data-i18n='partners_page_desc']"), pickLang(partners, "subtitle"));

  const partnerCta = qs("#partners a.btn-vending");
  if (partnerCta) {
    setText(partnerCta.querySelector("span") || partnerCta, pickLang(partners, "cta_label"));
    setAttr(partnerCta, "href", navbar?.cta_url || "#");
    setAttr(partnerCta, "target", "_blank");
  }

  const grid = qs("#partners .grid.grid-cols-2.sm\\:grid-cols-3.gap-6.mb-10");
  if (!grid) return;

  const items = getActiveSorted(partners.items);

  setHTML(
    grid,
    items
      .map((it) => {
        const name = pickLang(it, "name") || "";
        const logo = safeUrl(it.logo_path);
        return `
          <div class="p-5 rounded-2xl border border-orange-100 bg-orange-50/40 hover:bg-orange-50 transition">
            <img src="${logo}" alt="${escapeHtml(name)}" class="h-10 mx-auto object-contain mb-3" onerror="this.style.display='none'">
            <p class="text-sm font-semibold text-gray-700">${escapeHtml(name)}</p>
          </div>
        `;
      })
      .join("")
  );
}

function renderEarlyProgram() {
  const ep = SITE?.earlyprogram;
  if (!ep) return;

  const root = qs("#early-program");
  if (!root) return;

  const setTextLocal = (sel, val) => {
    const el = root.querySelector(sel);
    if (el) el.textContent = val ?? "";
  };

  setTextLocal(".text-center .vending-badge", t(ep, "label_id", "label_en"));
  setTextLocal(".text-center h2", t(ep, "title_id", "title_en"));
  setTextLocal(".text-center p", t(ep, "desc_id", "desc_en"));

  setTextLocal(".snack-card .mb-7 .font-display.font-bold", t(ep, "highlight_title_id", "highlight_title_en"));
  setTextLocal(".snack-card .mb-7 .text-gray-600.mt-1", t(ep, "highlight_desc_id", "highlight_desc_en"));

  setTextLocal(".snack-card h3.font-display", t(ep, "benefits_title_id", "benefits_title_en"));

  const leftCtas = root.querySelectorAll(".snack-card .mt-8 a");
  const leftCta1 = leftCtas?.[0] || null;
  const leftCta2 = leftCtas?.[1] || null;

  if (leftCta1) {
    leftCta1.textContent = t(ep, "cta_primary_id", "cta_primary_en");
    leftCta1.setAttribute("href", ep.cta_primary_url || "#contact");
  }
  if (leftCta2) {
    leftCta2.textContent = t(ep, "cta_secondary_id", "cta_secondary_en");
    leftCta2.setAttribute("href", ep.cta_secondary_url || "#contact");
  }

  const rightCard = root.querySelector(".grid.lg\\:grid-cols-2 > .relative");
  if (rightCard) {
    const rightTitle = rightCard.querySelector(".font-display.font-bold.text-xl");
    if (rightTitle) rightTitle.textContent = t(ep, "right_title_id", "right_title_en");

    const rightBadge = rightCard.querySelector("span.px-4.py-2");
    if (rightBadge) rightBadge.textContent = t(ep, "right_badge_id", "right_badge_en");

    const rightDesc = rightCard.querySelector("p.text-gray-600.leading-relaxed");
    if (rightDesc) rightDesc.textContent = t(ep, "right_desc_id", "right_desc_en");

    const kpiCards = rightCard.querySelectorAll(".grid.grid-cols-2.gap-4.mb-8 > div");
    const kpis = [
      { lId: "kpi1_label_id", lEn: "kpi1_label_en", vId: "kpi1_value_id", vEn: "kpi1_value_en" },
      { lId: "kpi2_label_id", lEn: "kpi2_label_en", vId: "kpi2_value_id", vEn: "kpi2_value_en" },
      { lId: "kpi3_label_id", lEn: "kpi3_label_en", vId: "kpi3_value_id", vEn: "kpi3_value_en" },
      { lId: "kpi4_label_id", lEn: "kpi4_label_en", vId: "kpi4_value_id", vEn: "kpi4_value_en" },
    ];

    for (let i = 0; i < 4; i++) {
      const card = kpiCards[i];
      if (!card) continue;

      const labelEl = card.querySelector(".text-sm.text-gray-600");
      const valueEl = card.querySelector(".font-display.font-bold");

      const meta = kpis[i];
      if (labelEl) labelEl.textContent = t(ep, meta.lId, meta.lEn);
      if (valueEl) valueEl.textContent = t(ep, meta.vId, meta.vEn);
    }

    const noteBox = rightCard.querySelector(".rounded-2xl.border-2.border-orange-100.bg-white");
    if (noteBox) {
      const noteTitle = noteBox.querySelector(".font-display.font-bold.text-gray-800");
      const noteDesc = noteBox.querySelector(".text-gray-600");
      if (noteTitle) noteTitle.textContent = t(ep, "note_title_id", "note_title_en");
      if (noteDesc) noteDesc.textContent = t(ep, "note_desc_id", "note_desc_en");
    }

    const rightCtaPrimary = rightCard.querySelector(".mt-8 a.btn-vending");
    if (rightCtaPrimary) {
      rightCtaPrimary.textContent = t(ep, "right_cta_primary_id", "right_cta_primary_en");
      rightCtaPrimary.setAttribute("href", ep.right_cta_primary_url || "#contact");
    }

    const waBtn = qs("#early-wa-btn");
    if (waBtn) waBtn.setAttribute("href", ep.whatsapp_url || "#");
  }

  const floatWrap = root.querySelector(".absolute.-bottom-6.left-6");
  if (floatWrap) {
    const floatTitle = floatWrap.querySelector(".text-sm.font-display.font-bold");
    const floatSub = floatWrap.querySelector(".text-xs.text-gray-600");
    if (floatTitle) floatTitle.textContent = t(ep, "float_title_id", "float_title_en");
    if (floatSub) floatSub.textContent = t(ep, "float_sub_id", "float_sub_en");
  }

  const items = getActiveSorted(ep.items);
  const lis = root.querySelectorAll("ul.space-y-4 > li");

  for (let i = 0; i < 4; i++) {
    const li = lis[i];
    if (!li) continue;

    const it = items[i];
    const titleEl = li.querySelector("div.font-bold.text-gray-800");
    const descEl = li.querySelector("div.text-gray-600");

    if (titleEl) titleEl.textContent = it ? t(it, "title_id", "title_en") : "";
    if (descEl) descEl.textContent = it ? t(it, "description_id", "description_en") : "";

    if (it?.icon_path) {
      const img = li.querySelector("img");
      if (img) img.src = resolveAssetUrl(it.icon_path);
    }
  }
}

function renderContact() {
  const contact = SITE?.contact;
  if (!contact) return;

  setText(qs("#contact-form .vending-badge"), pickLang(contact, "badge"));
  setText(qs("#contact-form h2.font-display"), pickLang(contact, "title"));
  setText(qs("#contact-form p.text-gray-600.mt-3"), pickLang(contact, "subtitle"));

  const stepsWrap = qs(".mt-8.text-left");
  if (stepsWrap) {
    const stepsTitleEl = stepsWrap.querySelector("p.font-semibold");
    const ul = stepsWrap.querySelector("ul.list-disc");
    setText(stepsTitleEl, pickLang(contact, "steps_title"));

    const steps = getActiveSorted(contact.items);
    if (ul) {
      ul.innerHTML = steps.map((s) => `<li>${escapeHtml(pickLang(s, "text") || "")}</li>`).join("");
    }
  }

  const btn = qs("button.btn-vending");
  setText(btn, pickLang(contact, "button_label"));
}

function renderCTA() {
  const cta = SITE?.cta;
  if (!cta) return;

  setText(qs("#cta-title"), pickLang(cta, "title"));
  setText(qs("#cta-desc"), pickLang(cta, "subtitle"));

  const btn = qs("#cta-button");
  if (btn) {
    btn.href = cta.primary_url || "#contact";
    btn.textContent = pickLang(cta, "primary_label");
  }
}

function renderFooter() {
  const footer = SITE?.footer;
  if (!footer) return;

  setText(qs("footer p[data-i18n='footer_desc']"), t(footer, "desc_id", "desc_en"));

  const emailSpan = qsa("footer ul.space-y-3.text-gray-400 li span")[0];
  const phoneSpan = qs("#footer-phone");
  const locationSpan = qsa("footer ul.space-y-3.text-gray-400 li span")[2];

  if (emailSpan) setText(emailSpan, footer.contact_email || "");
  if (phoneSpan) setText(phoneSpan, footer.contact_phone || "");
  if (locationSpan) setText(locationSpan, pickLang(footer, "contact_location"));

  const copyP = qs("footer .border-t p.text-gray-500");
  if (copyP) setText(copyP, pickLang(footer, "copyright"));

  const quickLinksList = qs("footer ul.space-y-3");
  if (quickLinksList && Array.isArray(footer.quick_links)) {
    const links = getActiveSorted(footer.quick_links);

    setHTML(
      quickLinksList,
      links
        .map((it) => {
          const label = pickLang(it, "label");
          return `<li><a href="${it.url || "#"}" class="text-gray-400 hover:text-orange-400 transition-colors">${escapeHtml(label || "")}</a></li>`;
        })
        .join("")
    );
  }
}

/* =========================
   4) BOOTSTRAP
   ========================= */
window.__SAMAKAN_SITE_READY__ = false;

window.__SAMAKAN_APPLY_LANGUAGE__ = function applyLanguage(lang) {
  LANG = lang;

  // render all (same behavior)
  renderNavbar();
  renderHero();
  renderAbout();
  renderServices();
  renderHowItWorks();
  renderGallery();
  renderLocations();
  renderPartners();
  renderEarlyProgram();
  renderContact();
  renderCTA();
  renderFooter();

  // single source of truth
  toggleLangButtons();
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(API_URL, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    SITE = json.data ? json.data : json;

    window.__SAMAKAN_SITE_READY__ = true;

    const pendingLang = window.__SAMAKAN_GET_PENDING_LANG__?.();
    window.__SAMAKAN_APPLY_LANGUAGE__(pendingLang || LANG);
  } catch (err) {
    console.error("Failed to load site data:", err);
  }
});
