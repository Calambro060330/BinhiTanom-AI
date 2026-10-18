const API_URL = ""; // Same-origin Flask server: http://127.0.0.1:5000
const $ = (id) => document.getElementById(id);

const vegetables = [
  {
    key: "okra", en: "Okra", hil: "Okra", emoji: "🫛",
    guide: {
      soil: ["Loose, fertile, well-draining soil", "Malugay kag matambok nga duta nga maayo ang agas sang tubig"],
      depth: ["Plant seeds about 2–3 cm deep", "Itanom ang liso mga 2–3 cm kalawom"],
      sun: ["Full sun, around 6–8 hours daily", "Kinahanglan sang bug-os nga adlaw, mga 6–8 ka oras"],
      water: ["Water consistently; avoid waterlogged soil", "Patubigi sing regular pero likawi ang nagatipon nga tubig"],
      fertilizer: ["Mix compost into the soil before planting", "Ihalo ang compost sa duta antes magtanom"],
      container: ["Use a deep container, about 20–30 L per plant", "Gamit sang madalom nga paso, mga 20–30 L kada tanom"],
      harvest: ["Harvest tender pods regularly, often 50–60 days after planting", "Panguhaa ang malumo nga bunga sing regular; kasagaran 50–60 ka adlaw"]
    }
  },
  {
    key: "eggplant", en: "Eggplant", hil: "Talong", emoji: "🍆",
    guide: {
      soil: ["Fertile, well-draining soil rich in organic matter", "Matambok nga duta nga maayo ang agas sang tubig kag may organikong materyal"],
      depth: ["Sow seeds about 0.5–1 cm deep", "Itanom ang liso mga 0.5–1 cm kalawom"],
      sun: ["Full sun, at least 6 hours daily", "Bug-os nga adlaw, labing menos 6 ka oras"],
      water: ["Keep soil evenly moist, not soggy", "Hupti nga mamasa-masa ang duta pero indi lunang"],
      fertilizer: ["Use mature compost; follow product labels for other fertilizer", "Gamit sang hinog nga compost; sundon ang label sang abono"],
      container: ["Use a sturdy 20–30 L container per plant", "Gamit sang mabakod nga 20–30 L nga paso kada tanom"],
      harvest: ["Pick glossy, firm fruits; timing varies by variety", "Panguhaa ang sinaw kag mabakod nga bunga; nagadepende sa klase"]
    }
  },
  {
    key: "bitter_melon", en: "Bitter melon", hil: "Ampalaya", emoji: "🥒",
    guide: {
      soil: ["Loose, fertile soil with good drainage", "Malugay kag matambok nga duta nga maayo ang drainage"],
      depth: ["Plant seeds about 2 cm deep", "Itanom ang liso mga 2 cm kalawom"],
      sun: ["Full sun and a trellis for climbing vines", "Bug-os nga adlaw kag balag para sa nagasaka nga balagon"],
      water: ["Water at the base and keep moisture consistent", "Patubigi sa punoan kag hupti nga pirmi mamasa-masa"],
      fertilizer: ["Add compost before planting; avoid excess nitrogen", "Magdugang sang compost; likawi ang sobra nga nitroheno"],
      container: ["Use a large container, 30 L or more, with trellis", "Gamit sang dako nga paso, 30 L pataas, nga may balag"],
      harvest: ["Harvest green fruits while still tender", "Panguhaa ang berde nga bunga samtang malumo pa"]
    }
  },
  {
    key: "water_spinach", en: "Water spinach", hil: "Kangkong", emoji: "🌿",
    guide: {
      soil: ["Moist, fertile soil; containers must still drain safely", "Mamasa-masa kag matambok nga duta; dapat may drainage gihapon ang paso"],
      depth: ["Sow seeds about 1–2 cm deep", "Itanom ang liso mga 1–2 cm kalawom"],
      sun: ["Sun to partial shade", "Adlaw ukon may gamay nga landong"],
      water: ["Keep soil moist; do not let containers dry out", "Hupti nga mamasa-masa ang duta; indi pagpa-ugaon"],
      fertilizer: ["Mix in compost before sowing", "Ihalo ang compost antes magsab-og"],
      container: ["Use a wide planter at least 15–20 cm deep", "Gamit sang malapad nga paso nga 15–20 cm kalawom"],
      harvest: ["Cut tender shoots and leave the base to regrow", "Putla ang malumo nga saha kag bilin ang punoan para magtubo liwat"]
    }
  },
  {
    key: "malabar_spinach", en: "Malabar spinach", hil: "Alugbati", emoji: "🌱",
    guide: {
      soil: ["Fertile soil with good drainage", "Matambok nga duta nga maayo ang drainage"],
      depth: ["Sow seeds about 1–2 cm deep", "Itanom ang liso mga 1–2 cm kalawom"],
      sun: ["Warm conditions; sun to partial shade", "Mainit nga palibot; adlaw ukon may gamay nga landong"],
      water: ["Water regularly, especially during dry weather", "Patubigi sing regular labi na kon tig-ilinit"],
      fertilizer: ["Add compost or well-rotted organic matter", "Magdugang sang compost ukon organikong materyal nga nadunot na"],
      container: ["Use a deep pot with a stake or trellis", "Gamit sang madalom nga paso nga may tukod ukon balag"],
      harvest: ["Harvest young leaves and tender shoots", "Panguhaa ang bata nga dahon kag malumo nga saha"]
    }
  },
  {
    key: "jute_mallow", en: "Jute mallow", hil: "Saluyot", emoji: "🥬",
    guide: {
      soil: ["Loose soil with compost and good drainage", "Malugay nga duta nga may compost kag maayo ang drainage"],
      depth: ["Sow seeds about 0.5–1 cm deep", "Itanom ang liso mga 0.5–1 cm kalawom"],
      sun: ["Full sun to partial shade", "Bug-os nga adlaw tubtob sa may landong"],
      water: ["Keep soil moist during early growth", "Hupti nga mamasa-masa ang duta samtang bata pa"],
      fertilizer: ["Compost is usually a good starting point", "Maayo nga panugod ang compost"],
      container: ["Use a wide container at least 20 cm deep", "Gamit sang malapad nga paso nga labing menos 20 cm kalawom"],
      harvest: ["Pick young leaves and tender shoots", "Panguhaa ang bata nga dahon kag malumo nga saha"]
    }
  },
  {
    key: "squash", en: "Squash", hil: "Kalabasa", emoji: "🎃",
    guide: {
      soil: ["Rich, loose soil with plenty of organic matter", "Matambok kag malugay nga duta nga madamo sang organikong materyal"],
      depth: ["Plant seeds about 2–3 cm deep", "Itanom ang liso mga 2–3 cm kalawom"],
      sun: ["Full sun and ample room for vines", "Bug-os nga adlaw kag dako nga espasyo para sa balagon"],
      water: ["Water deeply at the base; avoid soaking leaves", "Patubigi sing madalom sa punoan; likawi nga mabasa pirmi ang dahon"],
      fertilizer: ["Mix compost into planting soil", "Ihalo ang compost sa duta nga pagatanuman"],
      container: ["Prefer ground space; otherwise use a very large container, 50 L+", "Mas maayo ang duta; kon paso, kinahanglan dako gid, 50 L pataas"],
      harvest: ["Harvest when the rind hardens and the stem begins to dry", "Panguhaa kon nagatig-a ang panit kag nagauga ang tangkay"]
    }
  },
  {
    key: "yardlong_bean", en: "Yardlong bean", hil: "Sitaw", emoji: "🫘",
    guide: {
      soil: ["Well-draining soil with moderate fertility", "Duta nga maayo ang drainage kag igo ang katambok"],
      depth: ["Plant seeds about 2–3 cm deep", "Itanom ang liso mga 2–3 cm kalawom"],
      sun: ["Full sun and a sturdy trellis", "Bug-os nga adlaw kag mabakod nga balag"],
      water: ["Water consistently during flowering and pod growth", "Patubigi sing regular samtang nagapamulak kag nagapamunga"],
      fertilizer: ["Add compost; avoid too much nitrogen fertilizer", "Magdugang sang compost; likawi ang sobra nga abono nga nitroheno"],
      container: ["Use a deep container with trellis, about 25–30 L", "Gamit sang madalom nga 25–30 L nga paso nga may balag"],
      harvest: ["Pick pods while long and tender", "Panguhaa ang tag-as nga bunga samtang malumo pa"]
    }
  }
];

const guideLabels = {
  en: { soil: "Soil", depth: "Planting depth", sun: "Sunlight", water: "Watering", fertilizer: "Fertilizer", container: "Container", harvest: "Harvest" },
  hil: { soil: "Duta", depth: "Kalawmon sang pagtanom", sun: "Suga sang adlaw", water: "Pagpatubig", fertilizer: "Abono", container: "Paso", harvest: "Pag-ani" }
};
const translations = {
  en: {
    eyebrow: "ITPD 6 · Artificial Intelligence 1",
    tag: "Snap a vegetable seed. Learn how to plant it, in English or Hiligaynon.",
    enter: "Enter", nologin: "No sign in or sign up needed.",
    nAbout: "About", nProblem: "Problem", nHow: "How it works", nTry: "Try it", nPlan: "Study plan", nRefs: "References",
    t1: "1. Upload your seed photo", dt: "Tap to upload or drop a photo", ds: "JPG or PNG, one clear seed type",
    demoNote: "AI upload needs a trained model. You can still explore gardening guides below.",
    pickTitle: "Choose the seed you think it is",
    directNote: "Guides are general growing information. Confirm local practices with an agricultural expert."
  },
  hil: {
    eyebrow: "ITPD 6 · Artipisyal nga Intelihensya 1",
    tag: "Kuhaa sang litrato ang liso sang utan. Hibal-i kon paano ini itanom sa English ukon Hiligaynon.",
    enter: "Sulod", nologin: "Indi kinahanglan mag-sign in ukon maghimo sang account.",
    nAbout: "Parte sini", nProblem: "Problema", nHow: "Paano ini nagagana", nTry: "Sulayi", nPlan: "Plano sang pagtuon", nRefs: "Mga reperensya",
    t1: "1. I-upload ang litrato sang liso", dt: "Pinduta para mag-upload ukon ihulog ang litrato", ds: "JPG ukon PNG, isa ka klaro nga klase sang liso",
    demoNote: "Kinahanglan anay sang natrenar nga modelo para sa AI upload. Mahimo mo gihapon tan-awon ang mga giya sa pagtanom.",
    pickTitle: "Pilia ang liso nga sa imo amo ini",
    directNote: "Kinatibuk-ang giya lamang ini. Pamangkuta ang eksperto sa agrikultura para sa lokal nga praktis."
  }
};

let language = "en";
let selectedKey = null;
let currentObjectUrl = null;

function setLanguage(next) {
  language = next;
  $("en").classList.toggle("on", next === "en");
  $("hil").classList.toggle("on", next === "hil");
  document.documentElement.lang = next === "en" ? "en" : "hil";
  document.querySelectorAll("[data-i]").forEach((node) => {
    const key = node.dataset.i;
    if (translations[next][key]) node.textContent = translations[next][key];
  });
  renderPicker();
  if (selectedKey) renderGuide(selectedKey, null);
}

function renderPicker() {
  const list = vegetables.map((v) => `
    <button class="chip ${selectedKey === v.key ? "selected" : ""}" type="button" data-key="${v.key}">
      <span>${v.emoji}</span> ${v[language]}
    </button>`).join("");
  $("chipsDirect").innerHTML = list;
  $("chipsDirect").querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedKey = button.dataset.key;
      renderPicker();
      renderGuide(selectedKey, null);
      $("out").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });
  $("pt").textContent = translations[language].pickTitle;
  $("pickCard").style.display = "none";
  $("disc").textContent = translations[language].directNote;
}

function renderGuide(key, prediction) {
  const vegetable = vegetables.find((item) => item.key === key);
  if (!vegetable) return;
  selectedKey = key;
  $("nm").textContent = `${vegetable.emoji} ${vegetable[language]}`;
  $("conf").textContent = prediction
    ? `${language === "en" ? "AI confidence" : "Kumpiyansa sang AI"}: ${prediction.confidence_percent}% · ${prediction.prediction_ms} ms`
    : (language === "en" ? "Manual selection · no AI prediction" : "Manwal nga pagpili · wala sang AI prediction");
  $("guide").innerHTML = Object.entries(guideLabels[language]).map(([field, label]) => `
    <article class="guide-item">
      <h4>${label}</h4>
      <p>${vegetable.guide[field][language === "en" ? 0 : 1]}</p>
    </article>`).join("");
  $("out").classList.add("visible");
  renderPicker();
}

async function handleFile(file) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showMessage(language === "en" ? "Please choose an image file." : "Palihog pagpili sang image file.", true);
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    showMessage(language === "en" ? "Please choose an image under 8 MB." : "Pilia ang litrato nga wala nagalabaw sa 8 MB.", true);
    return;
  }
  if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
  currentObjectUrl = URL.createObjectURL(file);
  $("pv").src = currentObjectUrl;
  $("pv").style.display = "block";
  $("scan").classList.add("active");
  $("demoNote").textContent = language === "en" ? "Analyzing image..." : "Gin-aanalisar ang litrato...";
  $("out").classList.remove("visible");

  const data = new FormData();
  data.append("image", file);
  try {
    const response = await fetch(`${API_URL}/predict`, { method: "POST", body: data });
    const result = await response.json().catch(() => ({}));
    console.log("Prediction HTTP status:", response.status);
console.log("Prediction response:", result);
    if (!response.ok) throw new Error(result.error || `Request failed (${response.status})`);
    if (!result.identified || !result.label) {
      showMessage(result.message || (language === "en" ? "Unable to identify this seed confidently. Try another photo." : "Indi makilala sing masaligan ang liso. Sulayi ang iban nga litrato."), true);
      return;
    }
    const key = result.label;
    if (!vegetables.some((v) => v.key === key)) {
      throw new Error("The model returned an unknown class label. Check ml/class_names.json.");
    }
    $("demoNote").textContent = "";
    renderGuide(key, result);
  } catch (error) {
    showMessage(error.message || (language === "en" ? "Could not reach the local AI server." : "Indi makakonekta sa lokal nga AI server."), true);
  } finally {
    $("scan").classList.remove("active");
  }
}

function showMessage(message, isError) {
  $("demoNote").textContent = message;
  $("demoNote").classList.toggle("error", Boolean(isError));
}

$("enterBtn").addEventListener("click", () => {
  $("enter").classList.remove("on");
  $("site").classList.add("on");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("backEnter").addEventListener("click", () => {
  $("site").classList.remove("on");
  $("enter").classList.add("on");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("en").addEventListener("click", () => setLanguage("en"));
$("hil").addEventListener("click", () => setLanguage("hil"));
$("file").addEventListener("change", (event) => handleFile(event.target.files[0]));

const drop = $("drop");
drop.addEventListener("dragover", (event) => {
  event.preventDefault();
  drop.classList.add("dragover");
});
drop.addEventListener("dragleave", () => drop.classList.remove("dragover"));
drop.addEventListener("drop", (event) => {
  event.preventDefault();
  drop.classList.remove("dragover");
  handleFile(event.dataTransfer.files[0]);
});

$("menu").addEventListener("click", () => $("nav").classList.toggle("open"));
$("nav").querySelectorAll("a").forEach((link) => link.addEventListener("click", () => $("nav").classList.remove("open")));

fetch(`${API_URL}/health`)
  .then((response) => response.json())
  .then((health) => {
    if (!health.model_ready) {
      $("demoNote").textContent = language === "en"
        ? "AI model not trained yet. Manual gardening guides are ready to use."
        : "Wala pa natrenar ang AI model. Mahimo na gamiton ang mga giya sa pagtanom.";
    } else {
      $("demoNote").textContent = language === "en" ? "AI model is ready. Upload a seed photo to identify it." : "Andam na ang AI model. I-upload ang litrato sang liso.";
    }
  })
  .catch(() => {
    $("demoNote").textContent = language === "en"
      ? "Start app.py to connect to the local AI server."
      : "Paandara ang app.py para makakonekta sa lokal nga AI server.";
  });

renderPicker();
