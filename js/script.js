const WA_URL = "https://wa.me/6281398068226?text=Halo%20SAMAKAN%2C%20saya%20ingin%20tahu%20lebih%20lanjut";

// Paste the published Google Form URL from new/BuatFormWebsite.gs here.
const FORM_URL = "";

const translations = {
  id: {
    nav_home: "Beranda",
    nav_about: "Tentang",
    nav_machine: "Mesin",
    nav_owner: "Jadi Pemilik",
    nav_menu: "Mitra Menu",
    nav_location: "Untuk Lokasi",
    nav_agent: "Agen",
    nav_contact: "Kontak",
    nav_cta: "WhatsApp",
    hero_title: 'Buka Bisnis, <span class="accent">Bukan Tambah Beban.</span>',
    hero_sub: "Mesin makanan panas 24 jam dengan software buatan Indonesia. Kami bantu dari pemilihan menu sampai operasional harian.",
    hero_cta2: "Lihat Cara Kerja",
    val1_title: "24 jam",
    val1_desc: "Melayani tanpa kasir, siang dan malam.",
    val2_title: "Panas dalam hitungan menit",
    val2_desc: "Disimpan dingin 4–8°C, dipanaskan otomatis saat dibeli.",
    val3_title: "Tanpa repot",
    val3_desc: "Restock, kebersihan, dan perawatan bisa kami kelola.",
    about_title: "SAMAKAN by Kyojin.",
    about_lead: "PT. Dharma Abadi Kyojin di Jakarta. Kami menghadirkan mesin makanan panas 24 jam, dengan software dan dashboard penjualan buatan Indonesia.",
    about_1_title: "Makanan panas, siap dibeli",
    about_1_desc: "Porsi disimpan dingin, dipanaskan otomatis saat dibeli, dan dibayar dengan QRIS. Tanpa kasir.",
    about_2_title: "Dari menu sampai operasional",
    about_2_desc: "Kami bantu pemilihan menu, penempatan, sampai operasional harian. Anda yang memilih seberapa banyak ingin terlibat.",
    about_3_title: "Satu jaringan, empat peran",
    about_3_desc: "Pemilik mesin, mitra menu, lokasi, dan agen. Semua terhubung lewat jaringan SAMAKAN.",
    how_kicker: "Cara Kerja",
    how_title: "Dari layar sentuh sampai siap disantap.",
    how1: "Pilih menu di layar sentuh",
    how2: "Bayar dengan QRIS",
    how3: "Mesin memanaskan otomatis",
    how4: "Ambil dan nikmati",
    who_title: "Siapa yang cocok",
    who1_title: "Pemilik Mesin",
    who1_desc: "Miliki mesin SAMAKAN dan pilih seberapa banyak Anda ingin terlibat.",
    who2_title: "Mitra Menu",
    who2_desc: "Jual menu Anda di jaringan mesin, tanpa sewa dan tanpa kasir.",
    who3_title: "Lokasi",
    who3_desc: "Fasilitas makan 24 jam, tanpa biaya untuk lokasi.",
    who4_title: "Agen",
    who4_desc: "Kenalkan SAMAKAN. Komisi dijelaskan saat pendaftaran.",
    who_more: "Lihat selengkapnya",
    band_title: "Mulai outlet 24 jam Anda bersama SAMAKAN.",
    machine_title: "Satu mesin. Dapur kecil yang tidak pernah tutup.",
    spec_cold: "Penyimpanan dingin dengan microwave otomatis",
    spec_portions: "porsi",
    spec_screen: "Layar sentuh",
    spec_pay: "Pembayaran",
    spec_size: "Dimensi 1920 × 1793 × 972 mm, berat 450 kg.",
    dash_tag: "Contoh tampilan",
    dash_title: "Software & dashboard",
    dash_desc: "Software dan dashboard penjualan buatan tim SAMAKAN. Pantau penjualan, stok, dan status mesin secara real-time dari ponsel.",
    dash_sales: "Porsi hari ini",
    dash_stock: "Stok",
    dash_status: "Status mesin",
    dash_online: "Online",
    dash_note: "Angka di atas hanya contoh, bukan data penjualan nyata.",
    place_title: "Kebutuhan penempatan",
    place1: "Area ±2 × 1 m di dalam ruangan",
    place2: "Stopkontak 220 V",
    place3: "Sinyal internet stabil",
    own_title: "Outlet baru tanpa sewa ruko.",
    own_sub: "Miliki mesin SAMAKAN dan pilih seberapa banyak Anda ingin terlibat.",
    own_included_title: "Termasuk di setiap mesin",
    own_in1: "Pengiriman & instalasi (Jabodetabek)",
    own_in2: "Setup software & menu",
    own_in3: "Pelatihan",
    own_in4: "Akses dashboard",
    pkg_basic: "Anda menjalankan operasional; kami sediakan software, dashboard, dan dukungan teknis.",
    pkg_plus: "Dukungan lebih lengkap untuk pemilik yang ingin tetap mengelola sendiri.",
    pkg_cruise: "Kelola penuh oleh SAMAKAN: lokasi, menu, restock, kebersihan, perawatan. Anda menerima bagi hasil penjualan bulanan.",
    own_step1: "Konsultasi",
    own_step2: "Booking",
    own_step3: "Produksi & pengiriman (±3–4 bulan)",
    own_step4: "Instalasi",
    own_step5: "Beroperasi",
    own_cta1: "Minta Penawaran",
    own_cta2: "Minta Simulasi",
    disclaimer: "Hasil penjualan bergantung pada lokasi dan permintaan.",
    menu_title: "Outlet Baru Tanpa Sewa Ruko.",
    menu_sub: "Jual menu Anda di jaringan mesin SAMAKAN – tanpa sewa, tanpa kasir, tanpa tambah karyawan.",
    menu_b1: "Jangkauan 24 jam",
    menu_b2: "Tanpa biaya sewa",
    menu_b3: "Data penjualan per produk",
    menu_b4: "Brand Anda tampil di layar",
    menu_req_title: "Syarat menu",
    menu_r1: "Tahan minimal 7 hari pada suhu 4–8°C (atau sesuai frekuensi restock)",
    menu_r2: "Kemasan tertutup rapat dan aman microwave",
    menu_r3: "Waktu pemanasan diuji per produk",
    menu_scheme: "Skema: konsinyasi atau harga reseller; tidak ada biaya sewa.",
    menu_cta: "Daftar Jadi Mitra Menu",
    loc_title: "Fasilitas makan 24 jam, tanpa biaya untuk lokasi.",
    loc_p1: "Tanpa sewa, tanpa investasi dari pihak lokasi",
    loc_p2: "Tanpa staf tambahan – restock & perawatan oleh SAMAKAN",
    loc_p3: "Higienis: porsi tertutup, disimpan dingin, dipanaskan saat dibeli",
    loc_p4: "Tanpa uang tunai – pembayaran QRIS",
    loc_h: "Rumah sakit",
    loc_o: "Kantor",
    loc_f: "Pabrik dengan shift malam",
    loc_c: "Kampus",
    loc_a: "Apartemen",
    loc_s1: "Survei gratis",
    loc_s2: "Kesepakatan",
    loc_s3: "Instalasi",
    loc_s4: "Beroperasi",
    loc_cta: "Jadwalkan Survei Gratis",
    agent_title: "Kenalkan SAMAKAN, dapatkan komisi.",
    agent_p1: "Gratis bergabung",
    agent_p2: "Tanpa target",
    agent_p3: "Mitra independen",
    agent_p4: "Komisi: penjualan mesin, lokasi baru, dan mitra menu baru (detail diberikan saat pendaftaran).",
    agent_rules: "Agen tidak menerima pembayaran, tidak memberi diskon, dan tidak menjanjikan penghasilan.",
    agent_cta: "Daftar Jadi Agen",
    contact_title: "Tim SAMAKAN siap membantu.",
    form_title: "Formulir website",
    form_desc: "Isi formulir singkat. Tim kami menghubungi Anda via WhatsApp.",
    form_other: "Lainnya",
    form_cta: "Isi formulir",
    footer_desc: "Mesin makanan panas 24 jam oleh PT. Dharma Abadi Kyojin.",
    footer_menu: "Menu",
    footer_contact: "Kontak",
    footer_email: "Email",
    footer_phone: "WhatsApp",
    footer_web: "Situs",
    footer_place: "Lokasi"
  },
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_machine: "The Machine",
    nav_owner: "Own a Machine",
    nav_menu: "Menu Partners",
    nav_location: "For Locations",
    nav_agent: "Agents",
    nav_contact: "Contact",
    nav_cta: "WhatsApp",
    hero_title: 'Open a business, <span class="accent">not another burden.</span>',
    hero_sub: "A 24-hour hot-meal machine with software built in Indonesia. We help from menu selection through daily operations.",
    hero_cta2: "See how it works",
    val1_title: "24 hours",
    val1_desc: "Serve without a cashier, day and night.",
    val2_title: "Hot in minutes",
    val2_desc: "Stored at 4–8°C, heated automatically when purchased.",
    val3_title: "Hands-off",
    val3_desc: "Restocking, cleaning, and maintenance can be managed by us.",
    about_title: "SAMAKAN by Kyojin.",
    about_lead: "PT. Dharma Abadi Kyojin in Jakarta. We provide 24-hour hot-meal machines, with software and a sales dashboard built in Indonesia.",
    about_1_title: "Hot meals, ready to buy",
    about_1_desc: "Portions stay chilled, heat automatically when purchased, and are paid with QRIS. No cashier.",
    about_2_title: "From menu to daily operations",
    about_2_desc: "We help with menu selection, placement, and day-to-day operations. You choose how involved you want to be.",
    about_3_title: "One network, four roles",
    about_3_desc: "Machine owners, menu partners, locations, and agents. All connected through the SAMAKAN network.",
    how_kicker: "How it works",
    how_title: "From the touchscreen to a ready meal.",
    how1: "Choose a menu on the touchscreen",
    how2: "Pay with QRIS",
    how3: "The machine heats it automatically",
    how4: "Take it and enjoy",
    who_title: "Who it is for",
    who1_title: "Machine owner",
    who1_desc: "Own a SAMAKAN machine and choose how involved you want to be.",
    who2_title: "Menu partner",
    who2_desc: "Sell your menu on the machine network, with no rent and no cashier.",
    who3_title: "Location",
    who3_desc: "A 24-hour food facility, at no cost to the location.",
    who4_title: "Agent",
    who4_desc: "Introduce SAMAKAN. Commission is explained at registration.",
    who_more: "Learn more",
    band_title: "Start your 24-hour outlet with SAMAKAN.",
    machine_title: "One machine. A small kitchen that never closes.",
    spec_cold: "Chilled storage with an automatic microwave",
    spec_portions: "portions",
    spec_screen: "Touchscreen",
    spec_pay: "Payment",
    spec_size: "Dimensions 1920 × 1793 × 972 mm, weight 450 kg.",
    dash_tag: "Sample view",
    dash_title: "Software & dashboard",
    dash_desc: "Sales software and dashboard built by the SAMAKAN team. Monitor sales, stock, and machine status in real time from your phone.",
    dash_sales: "Portions today",
    dash_stock: "Stock",
    dash_status: "Machine status",
    dash_online: "Online",
    dash_note: "The figures above are a sample, not real sales data.",
    place_title: "Placement needs",
    place1: "About 2 × 1 m indoors",
    place2: "220 V outlet",
    place3: "Stable internet",
    own_title: "A new outlet without shop rent.",
    own_sub: "Own a SAMAKAN machine and choose how involved you want to be.",
    own_included_title: "Included with every machine",
    own_in1: "Delivery & installation (Greater Jakarta)",
    own_in2: "Software & menu setup",
    own_in3: "Training",
    own_in4: "Dashboard access",
    pkg_basic: "You run operations; we provide the software, dashboard, and technical support.",
    pkg_plus: "More complete support for owners who still want to manage it themselves.",
    pkg_cruise: "Fully managed by SAMAKAN: location, menu, restock, cleaning, and maintenance. You receive a monthly share of sales.",
    own_step1: "Consultation",
    own_step2: "Booking",
    own_step3: "Production & delivery (about 3–4 months)",
    own_step4: "Installation",
    own_step5: "Operating",
    own_cta1: "Request a quote",
    own_cta2: "Request a simulation",
    disclaimer: "Sales depend on location and demand.",
    menu_title: "A new outlet without shop rent.",
    menu_sub: "Sell your menu on the SAMAKAN machine network – no rent, no cashier, no extra staff.",
    menu_b1: "24-hour reach",
    menu_b2: "No rent",
    menu_b3: "Sales data per product",
    menu_b4: "Your brand on the screen",
    menu_req_title: "Menu requirements",
    menu_r1: "Lasts at least 7 days at 4–8°C (or matches the restock frequency)",
    menu_r2: "Sealed packaging that is microwave-safe",
    menu_r3: "Heating time tested per product",
    menu_scheme: "Scheme: consignment or a reseller price; no rent.",
    menu_cta: "Apply as a menu partner",
    loc_title: "A 24-hour food facility, at no cost to the location.",
    loc_p1: "No rent and no investment from the location",
    loc_p2: "No extra staff – restock and maintenance by SAMAKAN",
    loc_p3: "Hygienic: sealed portions, stored cold, heated when purchased",
    loc_p4: "No cash – QRIS payment",
    loc_h: "Hospitals",
    loc_o: "Offices",
    loc_f: "Factories with night shifts",
    loc_c: "Campuses",
    loc_a: "Apartments",
    loc_s1: "Free survey",
    loc_s2: "Agreement",
    loc_s3: "Installation",
    loc_s4: "Operating",
    loc_cta: "Schedule a free survey",
    agent_title: "Introduce SAMAKAN, earn a commission.",
    agent_p1: "Free to join",
    agent_p2: "No targets",
    agent_p3: "Independent partner",
    agent_p4: "Commission on machine sales, new locations, and new menu partners (details at registration).",
    agent_rules: "Agents do not take payment, do not give discounts, and do not promise income.",
    agent_cta: "Apply as an agent",
    contact_title: "The SAMAKAN team is ready to help.",
    form_title: "Website form",
    form_desc: "Fill in a short form. Our team will contact you on WhatsApp.",
    form_other: "Other",
    form_cta: "Open the form",
    footer_desc: "Hot meals, 24 hours, by PT. Dharma Abadi Kyojin.",
    footer_menu: "Menu",
    footer_contact: "Contact",
    footer_email: "Email",
    footer_phone: "WhatsApp",
    footer_web: "Website",
    footer_place: "Location"
  }
};

let currentLang = "id";
let footerPlace = { id: "Jakarta, Indonesia", en: "Jakarta, Indonesia" };

function formatPhone(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.startsWith("62") && digits.length > 8) {
    const local = "0" + digits.slice(2);
    return local.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
  }
  return raw || "";
}

function applyFooterPlace() {
  const el = document.getElementById("footer-location");
  if (el) el.textContent = footerPlace[currentLang] || footerPlace.id;
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = translations[lang][key];
    if (value == null) return;
    if (el.hasAttribute("data-i18n-html")) el.innerHTML = value;
    else el.textContent = value;
  });

  document.querySelectorAll(".lang").forEach((btn) => {
    const on = btn.id.endsWith(lang) || btn.id.endsWith("lang-" + lang);
    btn.classList.toggle("is-active", btn.id === "lang-" + lang || btn.id === "mobile-lang-" + lang);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });

  applyFooterPlace();
}

function applyLeadLinks() {
  document.querySelectorAll("[data-lead='wa']").forEach((a) => {
    a.href = WA_URL;
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("[data-lead='form']").forEach((a) => {
    a.href = FORM_URL || WA_URL;
    a.target = "_blank";
    a.rel = "noopener";
  });
}

function toggleMobileMenu(force) {
  const menu = document.getElementById("mobile-menu");
  const backdrop = document.getElementById("nav-backdrop");
  const btn = document.getElementById("menu-btn");
  if (!menu) return;
  const open = typeof force === "boolean" ? force : !menu.classList.contains("open");
  menu.classList.toggle("open", open);
  backdrop.classList.toggle("open", open);
  btn.setAttribute("aria-expanded", open ? "true" : "false");
}

function animateCount(el) {
  const to = Number(el.dataset.to);
  if (!Number.isFinite(to)) return;
  const suffix = el.dataset.suffix || "";
  const decimals = String(el.dataset.to).includes(".") ? 1 : 0;
  const start = performance.now();
  const duration = 900;
  function frame(now) {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    const value = to * eased;
    const shown = decimals ? value.toFixed(1).replace(".", ",") : String(Math.round(value));
    el.textContent = shown + suffix;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function watchEffects() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nodes = document.querySelectorAll(".draw-stripe, [data-ring], [data-temp], .count");
  if (reduce || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".draw-stripe").forEach((el) => el.classList.add("in"));
    document.querySelectorAll("[data-ring]").forEach((el) => el.classList.add("in"));
    document.querySelectorAll("[data-temp]").forEach((el) => el.classList.add("in"));
    document.querySelectorAll(".count").forEach((el) => {
      const suffix = el.dataset.suffix || "";
      const raw = String(el.dataset.to);
      el.textContent = (raw.includes(".") ? raw.replace(".", ",") : raw) + suffix;
    });
    return;
  }

  const seen = new WeakSet();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || seen.has(entry.target)) return;
      seen.add(entry.target);
      const el = entry.target;
      if (el.classList.contains("draw-stripe") || el.hasAttribute("data-ring") || el.hasAttribute("data-temp")) {
        el.classList.add("in");
      }
      if (el.classList.contains("count")) animateCount(el);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  nodes.forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  applyLeadLinks();
  setLanguage("id");
  watchEffects();
  loadFooter();

  const menuBtn = document.getElementById("menu-btn");
  const backdrop = document.getElementById("nav-backdrop");
  if (menuBtn) menuBtn.addEventListener("click", () => toggleMobileMenu());
  if (backdrop) backdrop.addEventListener("click", () => toggleMobileMenu(false));
  document.querySelectorAll(".mobile-menu a").forEach((a) => {
    a.addEventListener("click", () => toggleMobileMenu(false));
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-lead]");
    if (!link || typeof window.gtag !== "function") return;
    window.gtag("event", link.dataset.lead === "wa" ? "whatsapp_click" : "form_click", {
      link_url: link.href
    });
  });
});

function loadFooter() {
  fetch("https://cms.samakan.id/api/public/site")
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      const footer = data && data.footer;
      if (!footer) return;

      const email = document.getElementById("footer-email");
      if (email && footer.contact_email) {
        email.textContent = footer.contact_email;
        email.href = "mailto:" + footer.contact_email;
      }

      const phone = document.getElementById("footer-phone");
      if (phone && footer.contact_phone) {
        const digits = String(footer.contact_phone).replace(/\D/g, "");
        phone.textContent = formatPhone(digits);
        phone.href = "https://wa.me/" + digits;
      }

      footerPlace = {
        id: footer.contact_location_id || footerPlace.id,
        en: footer.contact_location_en || footer.contact_location_id || footerPlace.en
      };
      applyFooterPlace();
    })
    .catch(() => {});
}
