const samakan = {
  lang: "id",
  waUrl: "https://wa.me/6281398068226?text=Halo%20SAMAKAN%2C%20saya%20ingin%20tahu%20lebih%20lanjut",
  formUrl: "",
  selectedPackage: ""
};

function textOf(id, en) {
  return samakan.lang === "en" ? (en || id || "") : (id || en || "");
}

function setCopy(el, id, en) {
  if (!el) return;
  el.dataset.copyId = id || "";
  el.dataset.copyEn = en || id || "";
  el.textContent = textOf(el.dataset.copyId, el.dataset.copyEn);
}

function paintTitle(el) {
  const title = textOf(el.dataset.copyId, el.dataset.copyEn);
  const accent = textOf(el.dataset.accentId, el.dataset.accentEn);
  el.replaceChildren();
  if (accent && title.includes(accent)) {
    const index = title.indexOf(accent);
    const mark = document.createElement("span");
    mark.className = "accent";
    mark.textContent = accent;
    el.append(title.slice(0, index), mark, title.slice(index + accent.length));
  } else {
    el.textContent = title;
  }
}

function setTitle(el, item, key) {
  if (!el || !item) return;
  const base = key || "title";
  el.dataset.copyId = item[base + "_id"] || "";
  el.dataset.copyEn = item[base + "_en"] || "";
  el.dataset.accentId = item[base + "_accent_id"] || item.title_accent_id || "";
  el.dataset.accentEn = item[base + "_accent_en"] || item.title_accent_en || "";
  paintTitle(el);
}

function setLanguage(lang) {
  if (lang !== "id" && lang !== "en") return;
  samakan.lang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-copy-id]").forEach((el) => {
    if (el.dataset.accentId || el.dataset.accentEn) paintTitle(el);
    else el.textContent = textOf(el.dataset.copyId, el.dataset.copyEn);
  });
  document.querySelectorAll("[data-alt-id]").forEach((img) => {
    img.alt = textOf(img.dataset.altId, img.dataset.altEn);
  });
  document.querySelectorAll(".lang").forEach((btn) => {
    const on = btn.dataset.lang === lang;
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });
  const meta = document.querySelector('meta[name="description"]');
  if (meta && meta.dataset.copyId) meta.setAttribute("content", textOf(meta.dataset.copyId, meta.dataset.copyEn));
  applyPackageLinks();
  updateOwnCtaHint();
}

function applyLeadLinks() {
  document.querySelectorAll("[data-lead='wa']").forEach((link) => {
    if (link.dataset.packageLink) return;
    link.href = samakan.waUrl;
    link.target = "_blank";
    link.rel = "noopener";
  });
  document.querySelectorAll("[data-lead='form']").forEach((link) => {
    if (link.dataset.packageLink) return;
    link.href = samakan.formUrl || samakan.waUrl;
    link.target = "_blank";
    link.rel = "noopener";
  });
  applyPackageLinks();
}

function applyPackageLinks() {
  const note = samakan.selectedPackage
    ? (samakan.lang === "en" ? " Package: " : " Paket: ") + samakan.selectedPackage
    : "";
  document.querySelectorAll("[data-package-link]").forEach((link) => {
    const useForm = link.dataset.lead === "form" && samakan.formUrl;
    if (useForm) link.href = samakan.formUrl;
    else if (note) link.href = samakan.waUrl + encodeURIComponent(note);
    else link.href = samakan.waUrl;
    link.target = "_blank";
    link.rel = "noopener";
  });
}

function toggleMenu(force) {
  const menu = document.getElementById("mobile-menu");
  const btn = document.getElementById("menu-btn");
  if (!menu || !btn) return;
  const open = typeof force === "boolean" ? force : menu.hidden;
  menu.hidden = !open;
  btn.setAttribute("aria-expanded", open ? "true" : "false");
}

function updateOwnCtaHint() {
  const hint = document.getElementById("own-cta-hint");
  if (!hint) return;
  const base = textOf(hint.dataset.copyId, hint.dataset.copyEn);
  if (!base) return;
  if (samakan.selectedPackage) {
    const pick = samakan.lang === "en"
      ? "Selected package: " + samakan.selectedPackage + ". "
      : "Paket dipilih: " + samakan.selectedPackage + ". ";
    hint.textContent = pick + base;
  } else {
    hint.textContent = base;
  }
}

function selectPackage(name) {
  samakan.selectedPackage = samakan.selectedPackage === name ? "" : name;
  document.querySelectorAll(".package").forEach((card) => {
    const on = card.dataset.package === samakan.selectedPackage && samakan.selectedPackage !== "";
    card.classList.toggle("is-on", on);
    card.setAttribute("aria-pressed", on ? "true" : "false");
  });
  applyPackageLinks();
  updateOwnCtaHint();
}

function selectSpec(key) {
  const on = !document.getElementById("spec-" + key)?.classList.contains("is-on");
  document.querySelectorAll(".spec, .hotspot").forEach((el) => {
    const match = el.dataset.spec === key && on;
    el.classList.toggle("is-on", match);
    if (el.getAttribute("aria-pressed") != null) el.setAttribute("aria-pressed", match ? "true" : "false");
  });
}

let stepsPlayed = false;
function watchSteps() {
  const list = document.getElementById("steps");
  if (!list || stepsPlayed) return;
  const steps = [...list.querySelectorAll(".step")];
  if (!steps.length) return;
  const play = () => {
    if (stepsPlayed) return;
    stepsPlayed = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    steps.forEach((step, index) => {
      const mark = () => step.classList.add("is-on");
      if (reduce) mark();
      else window.setTimeout(mark, 350 * index);
    });
  };
  if (!("IntersectionObserver" in window)) {
    play();
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      play();
      observer.disconnect();
    }
  }, { threshold: 0.35 });
  observer.observe(list);
}

function watchReveal() {
  const nodes = [...document.querySelectorAll(".reveal-wait")];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("reveal"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("reveal");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18 });
  nodes.forEach((node) => observer.observe(node));
}

function watchNav() {
  const links = [...document.querySelectorAll("#nav-links a, #mobile-links a")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const update = () => {
    const mark = window.scrollY + 140;
    let current = sections[0];
    sections.forEach((section) => {
      if (section.offsetTop <= mark) current = section;
    });
    links.forEach((link) => {
      link.classList.toggle("is-current", !!(current && link.getAttribute("href") === "#" + current.id));
    });
  };
  document.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

function revealSite() {
  document.documentElement.classList.remove("site-booting");
  document.documentElement.classList.add("site-ready");
}

function bindInteractions() {
  document.addEventListener("click", (event) => {
    const lang = event.target.closest("[data-lang]");
    if (lang) {
      setLanguage(lang.dataset.lang);
      return;
    }
    if (event.target.closest("#menu-btn")) {
      toggleMenu();
      return;
    }
    if (event.target.closest("#mobile-links a")) toggleMenu(false);

    const step = event.target.closest(".step");
    if (step) {
      step.classList.toggle("is-on");
      return;
    }

    const pack = event.target.closest(".package");
    if (pack) selectPackage(pack.dataset.package || "");

    const spec = event.target.closest("[data-spec]");
    if (spec) selectSpec(spec.dataset.spec);

    const lead = event.target.closest("[data-lead]");
    if (lead && typeof window.gtag === "function") {
      window.gtag("event", lead.dataset.lead === "form" ? "form_click" : "whatsapp_click", {
        event_category: "lead",
        event_label: lead.id || "lead"
      });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const step = event.target.closest(".step");
    if (step) {
      event.preventDefault();
      step.classList.toggle("is-on");
      return;
    }
    const card = event.target.closest(".package, .spec");
    if (!card) return;
    event.preventDefault();
    if (card.classList.contains("package")) selectPackage(card.dataset.package || "");
    else selectSpec(card.dataset.spec);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") toggleMenu(false);
  });
}

window.samakan = samakan;
window.setCopy = setCopy;
window.setTitle = setTitle;
window.textOf = textOf;
window.setLanguage = setLanguage;
window.applyLeadLinks = applyLeadLinks;
window.samakanRefresh = function samakanRefresh() {
  watchReveal();
  watchSteps();
  watchNav();
  applyLeadLinks();
};
window.revealSite = revealSite;

bindInteractions();
window.setTimeout(() => {
  revealSite();
  document.querySelectorAll(".reveal-wait").forEach((node) => node.classList.add("reveal"));
}, 4000);
