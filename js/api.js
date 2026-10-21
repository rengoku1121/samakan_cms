const API_URL = "https://cms.samakan.id/api/public/site";
const LOCAL_URL = "./data/site-content.json";

function byId(id) {
  return document.getElementById(id);
}

function active(list) {
  return (Array.isArray(list) ? list : [])
    .filter((item) => item && item.is_active !== 0 && item.is_active !== false && item.is_active !== "0")
    .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));
}

function flagOn(value) {
  return Number(value) === 1;
}

function safeUrl(url) {
  const value = String(url || "").trim();
  if (!value) return "";
  if (value.startsWith("#") || value.startsWith("./") || value.startsWith("/")) return value;
  try {
    const parsed = new URL(value);
    if (parsed.protocol === "https:" || parsed.protocol === "http:" || parsed.protocol === "mailto:" || parsed.protocol === "tel:") {
      return value;
    }
  } catch (error) {
    return "";
  }
  return "";
}

function iconSrc(key) {
  const value = String(key || "").trim();
  if (!value) return "";
  if (value.startsWith("./") || value.startsWith("/") || value.startsWith("http")) return safeUrl(value);
  return "./images/icons/ui/" + encodeURIComponent(value) + ".png";
}

function formatPhone(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.startsWith("62") && digits.length > 8) {
    return ("0" + digits.slice(2)).replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
  }
  return String(raw || "");
}

function phoneHref(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  return digits ? "https://wa.me/" + digits : "";
}

function iconImg(key) {
  const img = document.createElement("img");
  img.className = "brand-icon";
  img.src = iconSrc(key);
  img.alt = "";
  img.setAttribute("aria-hidden", "true");
  return img;
}

function photoFrame(container, src, altId, altEn, eager) {
  if (!container) return;
  container.replaceChildren();
  const frame = document.createElement("div");
  frame.className = "frame";
  const img = document.createElement("img");
  img.src = safeUrl(src);
  img.dataset.altId = altId || "";
  img.dataset.altEn = altEn || altId || "";
  img.alt = textOf(img.dataset.altId, img.dataset.altEn);
  img.decoding = "async";
  if (!eager) img.loading = "lazy";
  frame.append(img);
  container.append(frame);
}

function fillChecks(id, items) {
  const list = byId(id);
  if (!list) return;
  list.replaceChildren();
  active(items).forEach((item) => {
    const li = document.createElement("li");
    setCopy(li, item.text_id, item.text_en);
    list.append(li);
  });
}

function navLinks(items, showAgents) {
  return active(items).filter((item) => showAgents || item.url !== "#agen");
}

function safePos(value) {
  return /^\d{1,3}(\.\d+)?%$/.test(String(value || "").trim()) ? String(value).trim() : "50%";
}

function renderNav(data) {
  const navbar = data.navbar || {};
  const logo = byId("brand-logo");
  if (logo) {
    logo.src = safeUrl(navbar.logo_path) || "./images/brand/wordmark.png";
    logo.alt = navbar.logo_alt || "SAMAKAN";
  }
  const showAgents = flagOn(data.settings && data.settings.show_agents);
  const links = navLinks(navbar.items, showAgents);
  ["nav-links", "mobile-links"].forEach((id) => {
    const host = byId(id);
    if (!host) return;
    host.replaceChildren();
    links.forEach((item) => {
      const a = document.createElement("a");
      a.href = safeUrl(item.url) || "#";
      setCopy(a, item.label_id, item.label_en);
      host.append(a);
    });
  });
  setCopy(byId("nav-cta-label"), navbar.cta_label_id, navbar.cta_label_en);
  setCopy(byId("mobile-cta-label"), navbar.cta_label_id, navbar.cta_label_en);
  document.querySelectorAll(".lang-switch").forEach((el) => {
    el.hidden = navbar.show_language_toggle === 0;
  });
  setCopy(document.querySelector(".skip"), "Langsung ke isi", "Skip to content");
}

function renderHero(data) {
  const hero = data.hero || {};
  setCopy(byId("hero-badge"), hero.badge_id, hero.badge_en);
  setTitle(byId("hero-title"), hero);
  setCopy(byId("hero-sub"), hero.subtitle_id, hero.subtitle_en);
  const english = byId("hero-en");
  if (english) english.textContent = hero.english_line || "";
  setCopy(byId("hero-cta-label"), hero.cta_label_id, hero.cta_label_en);
  setCopy(byId("hero-secondary-label"), hero.secondary_label_id, hero.secondary_label_en);
  const secondary = byId("hero-secondary");
  if (secondary) secondary.href = safeUrl(hero.secondary_url) || "#cara-kerja";
  photoStage(byId("hero-photo"), hero, "hero");
  const values = byId("value-grid");
  values.replaceChildren();
  active((data.services && data.services.items) || []).forEach((item) => {
    const card = document.createElement("article");
    card.className = "value-card";
    const title = document.createElement("h3");
    setCopy(title, item.title_id, item.title_en);
    card.append(iconImg(item.icon_key), title);
    if (item.description_id || item.description_en) {
      const copy = document.createElement("p");
      setCopy(copy, item.description_id, item.description_en);
      card.append(copy);
    }
    values.append(card);
  });
}

function photoStage(container, data, variant) {
  if (!container) return;
  const eager = variant === "hero";
  container.replaceChildren();
  const stage = document.createElement("div");
  stage.className = variant + "-stage" + (eager ? "" : " reveal-wait");
  const floor = document.createElement("span");
  floor.className = variant + "-floor";
  floor.setAttribute("aria-hidden", "true");
  const img = document.createElement("img");
  img.className = variant + "-machine";
  img.src = safeUrl(data.image_path);
  img.width = Number(data.image_width) || 900;
  img.height = Number(data.image_height) || 900;
  img.dataset.altId = data.image_alt_id || "";
  img.dataset.altEn = data.image_alt_en || data.image_alt_id || "";
  img.alt = textOf(img.dataset.altId, img.dataset.altEn);
  img.decoding = "async";
  if (eager) img.fetchPriority = "high";
  else img.loading = "lazy";
  stage.append(floor, img);
  active(data.stickers).forEach((sticker) => {
    const doodle = document.createElement("img");
    doodle.className = "sticker " + (sticker.class_name || "");
    doodle.src = safeUrl(sticker.image_path);
    doodle.alt = "";
    doodle.setAttribute("aria-hidden", "true");
    stage.append(doodle);
  });
  const chips = active(data.image_chips);
  if (variant === "about" && chips.length) {
    const base = document.createElement("div");
    base.className = "about-base";
    const row = document.createElement("div");
    row.className = "stage-chip-row";
    chips.forEach((chip) => {
      const tag = document.createElement("span");
      tag.className = "stage-chip";
      const label = document.createElement("span");
      setCopy(label, chip.text_id, chip.text_en);
      if (chip.icon_key) tag.append(iconImg(chip.icon_key));
      tag.append(label);
      row.append(tag);
    });
    base.append(row);
    stage.append(base);
  } else {
    chips.forEach((chip, index) => {
      const tag = document.createElement("span");
      tag.className = "stage-chip stage-chip-" + (index + 1);
      const label = document.createElement("span");
      setCopy(label, chip.text_id, chip.text_en);
      if (chip.icon_key) tag.append(iconImg(chip.icon_key));
      tag.append(label);
      stage.append(tag);
    });
  }
  container.append(stage);
}

function textCard(className, item) {
  const card = document.createElement("article");
  card.className = className;
  const body = document.createElement("div");
  const title = document.createElement("h3");
  setCopy(title, item.title_id, item.title_en);
  body.append(title);
  if (item.description_id || item.description_en) {
    const copy = document.createElement("p");
    setCopy(copy, item.description_id, item.description_en);
    body.append(copy);
  }
  const wrap = document.createElement("span");
  wrap.className = "icon-wrap";
  wrap.append(iconImg(item.icon_key));
  card.append(wrap, body);
  return card;
}

function renderAbout(data) {
  const about = data.about || {};
  setCopy(byId("about-badge"), about.badge_id, about.badge_en);
  setTitle(byId("about-title"), about);
  setCopy(byId("about-lead"), about.description_id, about.description_en);
  photoStage(byId("about-photo"), about, "about");
  const cards = byId("about-cards");
  cards.replaceChildren();
  active(about.cards).forEach((item) => {
    cards.append(textCard("mission reveal-wait", item));
  });
  const points = byId("about-points");
  points.replaceChildren();
  const pointItems = active(about.points);
  points.hidden = pointItems.length === 0;
  pointItems.forEach((item) => {
    points.append(textCard("point", item));
  });
  setTitle(byId("who-title"), {
    title_id: about.audiences_title_id,
    title_en: about.audiences_title_en
  });
  const who = byId("who-row");
  const showAgents = flagOn(data.settings && data.settings.show_agents);
  who.replaceChildren();
  active(about.audiences)
    .filter((item) => showAgents || item.url !== "#agen")
    .forEach((item) => {
      const link = document.createElement("a");
      link.className = "who reveal-wait";
      link.href = safeUrl(item.url) || "#";
      const title = document.createElement("h3");
      const copy = document.createElement("p");
      const more = document.createElement("span");
      more.className = "more";
      setCopy(title, item.title_id, item.title_en);
      setCopy(copy, item.description_id, item.description_en);
      setCopy(more, item.more_id, item.more_en);
      link.append(iconImg(item.icon_key), title, copy, more);
      who.append(link);
    });
}

function renderHow(data) {
  const how = data.howitworks || {};
  setCopy(byId("how-badge"), how.badge_id, how.badge_en);
  setTitle(byId("how-title"), how);
  setCopy(byId("how-lead"), how.description_id, how.description_en);
  photoStage(byId("how-photo"), how, "how");
  const list = byId("steps");
  list.replaceChildren();
  active(how.items).forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "step-item";
    const step = document.createElement("article");
    step.className = "step reveal-wait";
    step.tabIndex = 0;
    const num = document.createElement("span");
    num.className = "step-num";
    num.textContent = String(index + 1).padStart(2, "0");
    num.setAttribute("aria-hidden", "true");
    const wrap = document.createElement("span");
    wrap.className = "icon-wrap";
    wrap.append(iconImg(item.icon_key));
    const body = document.createElement("div");
    body.className = "step-body";
    const title = document.createElement("h3");
    const copy = document.createElement("p");
    setCopy(title, item.title_id, item.title_en);
    setCopy(copy, item.description_id, item.description_en);
    body.append(title, copy);
    step.append(num, wrap, body);
    li.append(step);
    list.append(li);
  });
}

function renderGallery(data) {
  const gallery = data.gallery || {};
  const section = byId("galeri");
  const items = active(gallery.items);
  if (section) section.hidden = items.length === 0;
  setCopy(byId("gallery-badge"), gallery.badge_id, gallery.badge_en);
  setTitle(byId("gallery-title"), gallery);
  const host = byId("gallery-showcase");
  if (!host) return;
  host.replaceChildren();
  if (!items.length) return;

  const layout = gallery.layout || "showcase";
  if (layout === "showcase") {
    const item = items[0];
    const stage = document.createElement("div");
    stage.className = "gallery-stage reveal-wait";
    const figure = document.createElement("figure");
    figure.className = "gallery-figure";
    const img = document.createElement("img");
    img.className = "gallery-photo";
    img.src = safeUrl(item.image_path);
    img.dataset.altId = item.alt_id || "";
    img.dataset.altEn = item.alt_en || "";
    img.alt = textOf(img.dataset.altId, img.dataset.altEn);
    img.loading = "lazy";
    img.decoding = "async";
    figure.append(img);
    stage.append(figure);
    if (gallery.caption_id || gallery.caption_en) {
      const caption = document.createElement("p");
      caption.className = "gallery-caption";
      setCopy(caption, gallery.caption_id, gallery.caption_en);
      stage.append(caption);
    }
    host.append(stage);
    return;
  }

  items.forEach((item) => {
    const figure = document.createElement("figure");
    figure.className = "gallery-tile reveal-wait";
    const img = document.createElement("img");
    img.src = safeUrl(item.image_path);
    img.dataset.altId = item.alt_id || "";
    img.dataset.altEn = item.alt_en || "";
    img.alt = textOf(img.dataset.altId, img.dataset.altEn);
    img.loading = "lazy";
    figure.append(img);
    host.append(figure);
  });
}

function machineStage(container, machine) {
  if (!container) return null;
  container.replaceChildren();
  const stage = document.createElement("div");
  stage.className = "mesin-stage reveal-wait";
  const floor = document.createElement("span");
  floor.className = "mesin-floor";
  floor.setAttribute("aria-hidden", "true");
  const frame = document.createElement("div");
  frame.className = "shot-frame";
  frame.id = "shot-frame";
  const img = document.createElement("img");
  img.className = "mesin-machine";
  img.src = safeUrl(machine.image_path);
  img.width = Number(machine.image_width) || 1077;
  img.height = Number(machine.image_height) || 1074;
  img.dataset.altId = machine.image_alt_id || "";
  img.dataset.altEn = machine.image_alt_en || machine.image_alt_id || "";
  img.alt = textOf(img.dataset.altId, img.dataset.altEn);
  img.decoding = "async";
  img.loading = "lazy";
  frame.append(img);
  stage.append(floor, frame);
  container.append(stage);
  return frame;
}

function renderMachine(data) {
  const machine = data.machine || {};
  setCopy(byId("machine-badge"), machine.badge_id, machine.badge_en);
  setTitle(byId("machine-title"), machine);
  const frame = machineStage(byId("machine-photo"), machine);
  if (!frame) return;
  frame.querySelectorAll(".hotspot").forEach((node) => node.remove());
  active(machine.hotspots).forEach((spot) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotspot";
    button.dataset.spec = spot.spec_key || "";
    button.style.left = safePos(spot.left);
    button.style.top = safePos(spot.top);
    button.setAttribute("aria-label", spot.spec_key || "spec");
    frame.append(button);
  });
  const specs = byId("spec-grid");
  specs.replaceChildren();
  active(machine.specs).forEach((spec) => {
    const card = document.createElement("article");
    card.className = "spec reveal-wait";
    card.id = "spec-" + (spec.spec_key || "");
    card.dataset.spec = spec.spec_key || "";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");
    const strong = document.createElement("strong");
    const copy = document.createElement("p");
    setCopy(strong, spec.value_id, spec.value_en);
    setCopy(copy, spec.description_id, spec.description_en);
    card.append(strong, copy);
    specs.append(card);
  });
  setCopy(byId("machine-size"), machine.size_id, machine.size_en);
  setCopy(byId("software-title"), machine.software_title_id, machine.software_title_en);
  setCopy(byId("software-copy"), machine.software_id, machine.software_en);
  setCopy(byId("placement-title"), machine.placement_title_id, machine.placement_title_en);
  fillChecks("placement-list", machine.placement_items);
}

function renderOwnership(data) {
  const own = data.ownership || {};
  setCopy(byId("own-badge"), own.badge_id, own.badge_en);
  setTitle(byId("own-title"), own);
  setCopy(byId("own-lead"), own.description_id, own.description_en);
  setCopy(byId("included-title"), own.included_title_id, own.included_title_en);
  fillChecks("included-list", own.included_items);
  const grid = byId("package-grid");
  grid.replaceChildren();
  active(own.packages).forEach((pkg) => {
    const card = document.createElement("article");
    const cruise = pkg.accent === "teal" || pkg.name === "Cruise";
    card.className = "package reveal-wait" + (cruise ? " cruise" : "");
    card.dataset.package = pkg.name || "";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");
    const title = document.createElement("h3");
    title.textContent = pkg.name || "";
    card.append(title);
    if (pkg.badge_id || pkg.badge_en) {
      const badge = document.createElement("span");
      badge.className = "pkg-badge";
      setCopy(badge, pkg.badge_id, pkg.badge_en);
      card.append(badge);
    }
    const copy = document.createElement("p");
    setCopy(copy, pkg.description_id, pkg.description_en);
    card.append(copy);
    grid.append(card);
  });
  setCopy(byId("own-cta-lead"), own.cta_lead_id, own.cta_lead_en);
  setCopy(byId("own-cta-hint"), own.cta_hint_id, own.cta_hint_en);
  setCopy(byId("own-primary-label"), own.primary_label_id, own.primary_label_en);
  setCopy(byId("own-secondary-label"), own.secondary_label_id, own.secondary_label_en);
  setCopy(byId("own-disclaimer"), own.disclaimer_id, own.disclaimer_en);
}

function renderMenu(data) {
  const menu = data.menu_partners || {};
  setCopy(byId("menu-badge"), menu.badge_id, menu.badge_en);
  setTitle(byId("menu-title"), menu);
  setCopy(byId("menu-lead"), menu.description_id, menu.description_en);
  photoFrame(byId("menu-photo"), menu.image_path, menu.image_alt_id, menu.image_alt_en);
  const benefits = byId("menu-benefits");
  benefits.replaceChildren();
  active(menu.benefits).forEach((item) => {
    const li = document.createElement("li");
    li.className = "benefit reveal-wait";
    const label = document.createElement("span");
    setCopy(label, item.text_id, item.text_en);
    li.append(iconImg(item.icon_key), label);
    benefits.append(li);
  });
  setCopy(byId("req-title"), menu.requirements_title_id, menu.requirements_title_en);
  fillChecks("menu-reqs", menu.requirements);
  const hasReqs = active(menu.requirements).length > 0;
  byId("req-title").hidden = !hasReqs;
  byId("menu-reqs").hidden = !hasReqs;
  setCopy(byId("menu-scheme"), menu.scheme_id, menu.scheme_en);
  setCopy(byId("menu-cta-label"), menu.cta_label_id, menu.cta_label_en);
}

function renderLocations(data) {
  const loc = data.locations || {};
  setCopy(byId("loc-badge"), loc.badge_id, loc.badge_en);
  setTitle(byId("loc-title"), loc);
  fillChecks("loc-points", loc.points);
  const grid = byId("loc-grid");
  grid.replaceChildren();
  active(loc.items).forEach((item) => {
    const card = document.createElement("article");
    card.className = "loc reveal-wait";
    const title = document.createElement("h3");
    setCopy(title, item.title_id, item.title_en);
    card.append(iconImg(item.icon_key), title);
    grid.append(card);
  });
  setCopy(byId("loc-cta-label"), loc.cta_label_id, loc.cta_label_en);
}

function renderAgents(data) {
  const agents = data.agents || {};
  const section = byId("agen");
  const show = flagOn(data.settings && data.settings.show_agents);
  if (section) section.hidden = !show;
  setCopy(byId("agent-badge"), agents.badge_id, agents.badge_en);
  setTitle(byId("agent-title"), agents);
  fillChecks("agent-list", agents.items);
  setCopy(byId("agent-rules"), agents.rules_id, agents.rules_en);
  setCopy(byId("agent-cta-label"), agents.cta_label_id, agents.cta_label_en);
}

function footerRow(labelId, labelEn, href, text, external) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const small = document.createElement("small");
  const link = document.createElement("a");
  setCopy(small, labelId, labelEn);
  link.href = safeUrl(href) || "#";
  link.textContent = text || "";
  if (external) {
    link.target = "_blank";
    link.rel = "noopener";
  }
  span.append(small, link);
  li.append(span);
  return li;
}

const CHANNEL_ICONS = {
  wa: "M20.5 3.5A11 11 0 0 0 2.1 16.8L1 23l6.4-1.1A11 11 0 0 0 20.5 3.5zM12 20.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.8.6.6-3.7-.2-.3A8.2 8.2 0 1 1 12 20.2z",
  ig: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17.5 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z",
  web: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm6.9 9a8 8 0 0 0-3.1-5.6c.6 1.6 1 3.5 1.1 5.6h2zm-4 0c-.2-2.7-1-4.8-1.9-6a8 8 0 0 0-2 0c-.9 1.2-1.7 3.3-1.9 6h5.8zm-7.8 0c.1-2.1.5-4 1.1-5.6A8 8 0 0 0 5.1 11h2zm-2 2a8 8 0 0 0 3.1 5.6c-.6-1.6-1-3.5-1.1-5.6h-2zm4 0c.2 2.7 1 4.8 1.9 6a8 8 0 0 0 2 0c.9-1.2 1.7-3.3 1.9-6H9.1zm7.8 0c-.1 2.1-.5 4-1.1 5.6a8 8 0 0 0 3.1-5.6h-2z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v.5l8 5 8-5V6H4zm16 2.8-7.5 4.7a1 1 0 0 1-1 0L4 8.8V18h16V8.8z"
};

function channelIcon(key) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", CHANNEL_ICONS[key] || CHANNEL_ICONS.web);
  svg.append(path);
  return svg;
}

function contactRow(key, labelId, labelEn, href, text, external) {
  const li = document.createElement("li");
  const link = document.createElement("a");
  link.className = "channel channel-" + key;
  link.href = safeUrl(href) || "#";
  if (key === "wa") link.dataset.lead = "wa";
  if (external) {
    link.target = "_blank";
    link.rel = "noopener";
  }
  const icon = document.createElement("span");
  icon.className = "channel-icon";
  icon.append(channelIcon(key));
  const body = document.createElement("span");
  body.className = "channel-body";
  const small = document.createElement("small");
  setCopy(small, labelId, labelEn);
  const value = document.createElement("span");
  value.className = "channel-value";
  value.textContent = text || "";
  body.append(small, value);
  const arrow = document.createElement("span");
  arrow.className = "channel-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "→";
  link.append(icon, body, arrow);
  li.append(link);
  return li;
}

function renderContact(data) {
  const contact = data.contact || {};
  const form = contact.form || {};
  setCopy(byId("contact-badge"), contact.badge_id, contact.badge_en);
  setTitle(byId("contact-title"), contact);
  setCopy(byId("contact-lead"), contact.description_id, contact.description_en);
  const person = byId("contact-person");
  if (person) person.textContent = contact.person || "";
  const avatar = byId("contact-avatar");
  if (avatar) avatar.textContent = (contact.person || "S").trim().charAt(0).toUpperCase();
  setCopy(byId("contact-role"), contact.role_id, contact.role_en);
  setCopy(byId("contact-wa-label"), contact.wa_label_id, contact.wa_label_en);
  const company = byId("contact-company");
  if (company) company.textContent = contact.company || "";
  const rows = byId("contact-rows");
  const channels = [
    contactRow("wa", contact.phone_label_id, contact.phone_label_en, samakan.waUrl, contact.phone_display, true),
    contactRow("ig", contact.instagram_label, contact.instagram_label, contact.instagram_url, contact.instagram_handle, true),
    contactRow("web", contact.website_label_id, contact.website_label_en, contact.website_url, contact.website_display, true)
  ];
  if (contact.email) {
    channels.push(contactRow("mail", contact.email_label_id, contact.email_label_en, "mailto:" + contact.email, contact.email, false));
  }
  rows.replaceChildren(...channels);
  const formCard = byId("form-card");
  const showForm = flagOn(data.settings && data.settings.show_contact_form);
  if (formCard) formCard.hidden = !showForm;
  setCopy(byId("form-title"), form.title_id, form.title_en);
  setCopy(byId("form-desc"), form.description_id, form.description_en);
  setCopy(byId("form-cta-label"), form.cta_label_id, form.cta_label_en);
  const roles = byId("form-roles");
  roles.replaceChildren();
  active(form.roles).forEach((role) => {
    const li = document.createElement("li");
    setCopy(li, role.label_id, role.label_en);
    roles.append(li);
  });
}

function renderCta(data) {
  const cta = data.cta || {};
  setTitle(byId("cta-title"), cta);
  setCopy(byId("cta-label"), cta.label_id, cta.label_en);
}

function renderFooter(data) {
  const footer = data.footer || {};
  const showAgents = flagOn(data.settings && data.settings.show_agents);
  const logo = byId("footer-logo");
  if (logo) {
    logo.src = safeUrl(footer.logo_path) || "./images/brand/wordmark-on-dark.png";
    logo.alt = footer.logo_alt || "SAMAKAN";
  }
  setCopy(byId("footer-desc"), footer.desc_id, footer.desc_en);
  setCopy(byId("footer-menu-label"), footer.menu_label_id, footer.menu_label_en);
  setCopy(byId("footer-contact-label"), footer.contact_label_id, footer.contact_label_en);
  const links = byId("footer-links");
  links.replaceChildren();
  navLinks(footer.quick_links, showAgents).forEach((item) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = safeUrl(item.url) || "#";
    setCopy(a, item.label_id, item.label_en);
    li.append(a);
    links.append(li);
  });
  const contact = data.contact || {};
  const phone = footer.contact_phone_display || formatPhone(footer.contact_phone);
  const list = byId("footer-contact");
  list.replaceChildren();
  const email = footerRow(contact.email_label_id || "Email", contact.email_label_en || "Email", "mailto:" + (footer.contact_email || ""), footer.contact_email || "", false);
  const phoneItem = footerRow(contact.phone_label_id, contact.phone_label_en, phoneHref(footer.contact_phone), phone, true);
  const ig = footerRow(contact.instagram_label, contact.instagram_label, contact.instagram_url, contact.instagram_handle, true);
  const web = footerRow(contact.website_label_id, contact.website_label_en, contact.website_url, contact.website_display, true);
  const place = document.createElement("li");
  const placeWrap = document.createElement("span");
  const placeLabel = document.createElement("small");
  const placeValue = document.createElement("span");
  setCopy(placeLabel, footer.place_label_id, footer.place_label_en);
  setCopy(placeValue, footer.contact_location_id, footer.contact_location_en);
  placeWrap.append(placeLabel, placeValue);
  place.append(placeWrap);
  list.append(email, phoneItem, ig, web, place);
  const company = byId("footer-company");
  if (company) company.textContent = footer.company || "";
  setCopy(byId("footer-disclaimer"), footer.disclaimer_id, footer.disclaimer_en);
  setCopy(byId("footer-copy"), footer.copyright_id, footer.copyright_en);
}

function applySettings(data) {
  const settings = data.settings || {};
  samakan.waUrl = safeUrl(settings.whatsapp_url) || samakan.waUrl;
  samakan.formUrl = safeUrl(settings.form_url) || "";
  samakan.lang = settings.default_language === "en" ? "en" : "id";
  setCopy(document.querySelector("title"), settings.title_id, settings.title_en);
  const meta = document.querySelector('meta[name="description"]');
  if (meta) {
    meta.dataset.copyId = settings.description_id || "";
    meta.dataset.copyEn = settings.description_en || "";
    meta.setAttribute("content", textOf(meta.dataset.copyId, meta.dataset.copyEn));
  }
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogTitle) ogTitle.setAttribute("content", textOf(settings.title_id, settings.title_en));
  if (ogDesc) ogDesc.setAttribute("content", textOf(settings.description_id, settings.description_en));
}

function auditCopy(data) {
  const banned = [
    /franchise/i,
    /waralaba/i,
    /pertama di indonesia/i,
    /\broi\b/i,
    /payback/i,
    /saporsi/i,
    /\bprofit\b/i
  ];
  const hits = [];
  JSON.stringify(data).split(/[{}\[\]",]/).forEach((part) => {
    banned.forEach((rule) => {
      if (rule.test(part)) hits.push(part.trim());
    });
  });
  if (hits.length) console.warn("SAMAKAN copy audit:", hits);
}

function normalize(raw) {
  if (!raw || typeof raw !== "object") return null;
  const data = raw.data && typeof raw.data === "object" ? raw.data : raw;
  if (data.hero && !data.hero.image_path && Array.isArray(data.hero.images)) {
    const image = active(data.hero.images)[0] || data.hero.images[0];
    if (image) {
      data.hero.image_path = image.image_path || "";
      data.hero.image_alt_id = data.hero.image_alt_id || image.alt_id || "";
      data.hero.image_alt_en = data.hero.image_alt_en || image.alt_en || "";
    }
  }
  if (data.footer && !data.footer.contact_phone_display && data.footer.contact_phone) {
    data.footer.contact_phone_display = formatPhone(data.footer.contact_phone);
  }
  return data;
}

function isContract(data) {
  return !!(data && data.settings && data.hero && data.machine && data.ownership);
}

async function loadJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("HTTP " + response.status);
  return response.json();
}

async function loadSite() {
  try {
    const remote = normalize(await loadJson(API_URL));
    if (isContract(remote)) return remote;
    console.warn("SAMAKAN API response is not the current contract, using local content.");
  } catch (error) {
    console.warn("SAMAKAN content API unavailable, using local content.");
  }
  return normalize(await loadJson(LOCAL_URL));
}

function render(data) {
  applySettings(data);
  renderNav(data);
  renderHero(data);
  renderAbout(data);
  renderHow(data);
  renderMachine(data);
  renderGallery(data);
  renderOwnership(data);
  renderMenu(data);
  renderLocations(data);
  renderAgents(data);
  renderContact(data);
  renderCta(data);
  renderFooter(data);
  setLanguage(samakan.lang);
  auditCopy(data);
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await loadSite();
    if (!isContract(data)) throw new Error("Content contract missing");
    render(data);
  } catch (error) {
    console.error("SAMAKAN content failed to render.", error);
  } finally {
    revealSite();
    if (typeof samakanRefresh === "function") samakanRefresh();
  }
});
