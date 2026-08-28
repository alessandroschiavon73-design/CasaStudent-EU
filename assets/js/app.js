const nationalPortals = {
  IT: "https://casastudent.it/",
  ES: "https://casastudent.es/",
  FR: "https://casastudent.fr/",
  DE: "https://casastudent.de/",
  PL: "https://casastudent.pl/"
};

const countryNames = {
  IE: "Ireland",
  UK: "United Kingdom",
  PT: "Portugal",
  ES: "Spain",
  FR: "France",
  BE: "Belgium",
  NL: "Netherlands",
  DE: "Germany",
  DK: "Denmark",
  NO: "Norway",
  SE: "Sweden",
  FI: "Finland",
  PL: "Poland",
  CZ: "Czechia",
  AT: "Austria",
  CH: "Switzerland",
  IT: "Italy",
  HU: "Hungary",
  SK: "Slovakia",
  RO: "Romania",
  BG: "Bulgaria",
  GR: "Greece",
  EE: "Estonia",
  LV: "Latvia",
  LT: "Lithuania"
};

const countryFlags = {
  IE: "🇮🇪", UK: "🇬🇧", PT: "🇵🇹", ES: "🇪🇸", FR: "🇫🇷",
  BE: "🇧🇪", NL: "🇳🇱", DE: "🇩🇪", DK: "🇩🇰", NO: "🇳🇴",
  SE: "🇸🇪", FI: "🇫🇮", PL: "🇵🇱", CZ: "🇨🇿", AT: "🇦🇹",
  CH: "🇨🇭", IT: "🇮🇹", HU: "🇭🇺", SK: "🇸🇰", RO: "🇷🇴",
  BG: "🇧🇬", GR: "🇬🇷", EE: "🇪🇪", LV: "🇱🇻", LT: "🇱🇹"
};

const countryPhotoCities = {
  IE: "Dublin", UK: "London", PT: "Lisbon", ES: "Barcelona", FR: "Paris",
  BE: "Brussels", NL: "Amsterdam", DE: "Berlin", DK: "Copenhagen", NO: "Bergen",
  SE: "Stockholm", FI: "Helsinki", PL: "Kraków", CZ: "Prague", AT: "Vienna",
  CH: "Zurich", IT: "Rome", HU: "Budapest", SK: "Bratislava", RO: "Bucharest",
  BG: "Sofia", GR: "Athens", EE: "Tallinn", LV: "Riga", LT: "Vilnius"
};

const countryCities = {
  IE: ["Dublin", "Cork", "Galway", "Limerick"],
  UK: ["London", "Manchester", "Edinburgh", "Bristol", "Leeds"],
  PT: ["Lisbon", "Porto", "Coimbra", "Braga", "Aveiro", "Faro"],
  BE: ["Brussels", "Leuven", "Ghent", "Antwerp", "Liège"],
  NL: ["Amsterdam", "Rotterdam", "Utrecht", "Groningen", "Leiden"],
  DK: ["Copenhagen", "Aarhus", "Odense", "Aalborg"],
  NO: ["Oslo", "Bergen", "Trondheim", "Stavanger"],
  SE: ["Stockholm", "Lund", "Uppsala", "Gothenburg", "Malmö"],
  FI: ["Helsinki", "Turku", "Tampere", "Oulu"],
  CZ: ["Prague", "Brno", "Olomouc", "Ostrava"],
  AT: ["Vienna", "Graz", "Innsbruck", "Salzburg", "Linz"],
  CH: ["Zurich", "Geneva", "Lausanne", "Basel", "Bern"],
  HU: ["Budapest", "Szeged", "Debrecen", "Pécs"],
  SK: ["Bratislava", "Košice", "Žilina"],
  RO: ["Bucharest", "Cluj-Napoca", "Timișoara", "Iași", "Brașov"],
  BG: ["Sofia", "Plovdiv", "Varna", "Veliko Tarnovo"],
  GR: ["Athens", "Thessaloniki", "Patras", "Heraklion", "Ioannina"],
  EE: ["Tallinn", "Tartu"],
  LV: ["Riga", "Daugavpils"],
  LT: ["Vilnius", "Kaunas", "Klaipėda"]
};

const countryOrder = [
  "IE", "UK", "PT", "ES", "FR", "BE", "NL", "DE", "DK", "NO",
  "SE", "FI", "PL", "CZ", "AT", "CH", "IT", "HU", "SK", "RO",
  "BG", "GR", "EE", "LV", "LT"
];
const portalOrder = ["IT", "ES", "FR", "DE", "PL"];
const europeanOrder = countryOrder.filter((code) => !nationalPortals[code]);

function destinationHref(code, city = "") {
  if (nationalPortals[code]) return nationalPortals[code];
  const cityQuery = city ? `&city=${encodeURIComponent(city)}` : "";
  return `country.html?country=${code}${cityQuery}`;
}

function citySummary(code) {
  return (countryCities[code] || []).slice(0, 3).join(", ");
}

function configureMenu() {
  const button = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-main-nav]");
  if (!button || !nav) return;
  button.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
    button.textContent = open ? "×" : "☰";
  });
  nav.addEventListener("click", (event) => {
    if (!event.target.closest("a") || window.innerWidth > 820) return;
    nav.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
    button.textContent = "☰";
  });
}

function configureMap() {
  document.querySelectorAll("[data-country]").forEach((hotspot) => {
    const code = hotspot.dataset.country;
    const portalText = nationalPortals[code] ? " — dedicated national portal" : " — explore on CasaStudent.eu";
    hotspot.href = destinationHref(code);
    hotspot.title = `${countryNames[code]}${portalText}`;
    hotspot.setAttribute("aria-label", hotspot.title);
  });
}

function configureSearch() {
  const form = document.querySelector("#destination-search");
  const countrySelect = document.querySelector("#countrySelect");
  const citySelect = document.querySelector("#citySelect");
  const note = document.querySelector("#searchNote");
  if (!form || !countrySelect || !citySelect) return;

  countryOrder.forEach((code) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = `${countryFlags[code]} ${countryNames[code]}`;
    countrySelect.appendChild(option);
  });

  countrySelect.addEventListener("change", () => {
    const code = countrySelect.value;
    citySelect.innerHTML = "";
    if (!code) {
      citySelect.disabled = true;
      citySelect.append(new Option("Select a country first", ""));
      note.textContent = "Dedicated national portals open their local CasaStudent site.";
      return;
    }
    if (nationalPortals[code]) {
      citySelect.disabled = true;
      citySelect.append(new Option("Opens the national CasaStudent portal", ""));
      note.textContent = `${countryNames[code]} has a dedicated national CasaStudent website.`;
      return;
    }
    citySelect.disabled = false;
    citySelect.append(new Option("All university cities", ""));
    (countryCities[code] || []).forEach((city) => citySelect.append(new Option(city, city)));
    note.textContent = `${countryNames[code]} is hosted directly on CasaStudent.eu.`;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = countrySelect.value;
    if (!code) {
      countrySelect.focus();
      return;
    }
    window.location.href = destinationHref(code, citySelect.value);
  });
}

function renderPortalGrid() {
  const grid = document.querySelector("#portalGrid");
  if (!grid) return;
  portalOrder.forEach((code) => {
    const link = document.createElement("a");
    link.className = "portal-card destination-card-photo";
    link.href = nationalPortals[code];
    const photoCity = countryPhotoCities[code];
    link.innerHTML = `<span class="destination-photo"><img loading="lazy" decoding="async" alt=""><span class="destination-photo-shade"></span><span class="flag" aria-hidden="true">${countryFlags[code]}</span><small class="destination-photo-credit"></small></span><span class="destination-card-copy"><strong>${countryNames[code]}</strong><small>Dedicated national portal</small></span><b aria-hidden="true">↗</b>`;
    grid.appendChild(link);
    const img = link.querySelector(".destination-photo img");
    if (img) loadCityPhoto(img, photoCity, countryNames[code]);
  });
}

function renderCountryGrid() {
  const grid = document.querySelector("#countryGrid");
  if (!grid) return;
  europeanOrder.forEach((code) => {
    const link = document.createElement("a");
    link.className = "country-card destination-card-photo";
    link.href = destinationHref(code);
    const photoCity = countryPhotoCities[code];
    link.innerHTML = `<span class="destination-photo"><img loading="lazy" decoding="async" alt=""><span class="destination-photo-shade"></span><span class="flag" aria-hidden="true">${countryFlags[code]}</span><small class="destination-photo-credit"></small></span><span class="destination-card-copy"><strong>${countryNames[code]}</strong><small>${citySummary(code)}</small></span><b aria-hidden="true">›</b>`;
    grid.appendChild(link);
    const img = link.querySelector(".destination-photo img");
    if (img) loadCityPhoto(img, photoCity, countryNames[code]);
  });
}

function renderFooterNetwork() {
  const network = document.querySelector("#footerNetwork");
  if (!network) return;
  const links = [
    { code: "EU", name: "Europe", flag: "🇪🇺", url: "https://casastudent.eu/", current: true },
    ...portalOrder.map((code) => ({ code, name: countryNames[code], flag: countryFlags[code], url: nationalPortals[code] }))
  ];
  links.forEach((item) => {
    const link = document.createElement("a");
    link.href = item.url;
    if (item.current) link.setAttribute("aria-current", "page");
    link.innerHTML = `<span aria-hidden="true">${item.flag}</span><span>${item.name}</span>${item.current ? "" : '<span aria-hidden="true">↗</span>'}`;
    network.appendChild(link);
  });
}

async function loadCityPhoto(img, city, country) {
  const photo = img.closest(".city-photo, .destination-photo");
  const fallback = () => {
    photo?.classList.add("photo-unavailable");
  };
  try {
    const search = `${city} ${country}`;
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(search)}&gsrlimit=5&prop=pageimages|info&piprop=thumbnail&pithumbsize=700&inprop=url&format=json&origin=*`;
    const response = await fetch(endpoint, { mode: "cors" });
    if (!response.ok) throw new Error("photo lookup failed");
    const data = await response.json();
    const pages = Object.values(data.query?.pages || {});
    const cityLower = city.toLowerCase();
    const page = pages.find((item) => item.thumbnail?.source && item.title?.toLowerCase() === cityLower)
      || pages.find((item) => item.thumbnail?.source && item.title?.toLowerCase().includes(cityLower))
      || pages.find((item) => item.thumbnail?.source);
    if (!page?.thumbnail?.source) return fallback();
    img.src = page.thumbnail.source;
    img.alt = `${city}, ${country}`;
    if (photo) {
      photo.classList.add("loaded");
      const credit = photo.querySelector(".city-photo-credit, .destination-photo-credit");
      if (credit) credit.textContent = "Wikipedia / Wikimedia";
    }
  } catch (error) {
    fallback();
  }
}

function renderCountryPage() {
  const title = document.querySelector("#countryTitle");
  const cards = document.querySelector("#cityCards");
  if (!title || !cards) return;

  const params = new URLSearchParams(window.location.search);
  const code = params.get("country");
  const selectedCity = params.get("city");
  if (!code || !countryNames[code]) {
    title.textContent = "Choose a European destination";
    document.querySelector("#countryIntro").textContent = "Return to the European map and select a country.";
    cards.innerHTML = '<div class="empty-card"><strong>No destination selected.</strong><br><a href="index.html#map">Open the European map</a></div>';
    return;
  }
  if (nationalPortals[code]) {
    window.location.replace(nationalPortals[code]);
    return;
  }

  const country = countryNames[code];
  const intro = document.querySelector("#countryIntro");
  const breadcrumb = document.querySelector("#breadcrumbCountry");
  const heading = document.querySelector("#cityHeading");
  document.title = `${selectedCity ? `${selectedCity}, ` : ""}${country} — CasaStudent Europe`;
  breadcrumb.textContent = selectedCity ? `${country} · ${selectedCity}` : country;
  title.textContent = selectedCity ? `Student housing in ${selectedCity}` : `Student housing in ${country}`;
  intro.textContent = selectedCity
    ? `${selectedCity} is part of the ${country} destination on CasaStudent.eu. Explore the country's university markets below.`
    : `Explore the main university destinations in ${country}. This country is hosted directly on CasaStudent.eu.`;
  heading.textContent = selectedCity ? `More cities in ${country}` : `Choose a city in ${country}`;

  const cities = countryCities[code] || [];
  if (!cities.length) {
    cards.innerHTML = '<div class="empty-card"><strong>Coming soon</strong><br>This destination is already part of CasaStudent Europe and will grow with the marketplace.</div>';
    return;
  }
  cities.forEach((city) => {
    const link = document.createElement("a");
    link.className = "city-card city-card-photo";
    link.href = destinationHref(code, city);
    if (city === selectedCity) link.setAttribute("aria-current", "page");
    link.innerHTML = `<span class="city-photo"><img loading="lazy" decoding="async" alt=""><span class="city-photo-shade"></span><small class="city-photo-credit"></small></span><span class="city-card-copy"><strong>${city}</strong><span>Student housing and Erasmus accommodation</span></span><b aria-hidden="true">›</b>`;
    cards.appendChild(link);
    const img = link.querySelector(".city-photo img");
    if (img) loadCityPhoto(img, city, country);
  });
}

configureMenu();
configureMap();
configureSearch();
renderPortalGrid();
renderCountryGrid();
renderFooterNetwork();
renderCountryPage();

window.CasaStudentEU = { nationalPortals, countryNames, countryCities };
