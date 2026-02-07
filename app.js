const titleScreen = document.getElementById("title-screen");
const gameScreen = document.getElementById("game-screen");
const summaryScreen = document.getElementById("summary-screen");
const dayNumber = document.getElementById("day-number");
const dayGoal = document.getElementById("day-goal");
const cardProgress = document.getElementById("card-progress");
const dayIncome = document.getElementById("day-income");
const dayTip = document.getElementById("day-tip");
const cardEl = document.getElementById("card");
const cardSeries = document.getElementById("card-series");
const cardName = document.getElementById("card-name");
const cardWear = document.getElementById("card-wear");
const decisionAuth = document.getElementById("decision-auth");
const decisionGrade = document.getElementById("decision-grade");
const decisionPrice = document.getElementById("decision-price");
const marketPrice = document.getElementById("market-price");
const priceInput = document.getElementById("price-input");
const computerSeries = document.getElementById("computer-series");
const photoName = document.getElementById("photo-name");
const photoPrice = document.getElementById("photo-price");
const photoLog = document.getElementById("photo-log");
const summaryTitle = document.getElementById("summary-title");
const summaryBody = document.getElementById("summary-body");
const overlay = document.getElementById("overlay");
const computerPanel = document.getElementById("computer");
const phonePanel = document.getElementById("phone");

const startBtn = document.getElementById("start-btn");
const flipBtn = document.getElementById("flip-btn");
const priceBtn = document.getElementById("price-btn");
const phoneBtn = document.getElementById("phone-btn");
const nextCardBtn = document.getElementById("next-card-btn");
const confirmPriceBtn = document.getElementById("confirm-price");
const photoBtn = document.getElementById("photo-btn");
const finishDay7Btn = document.getElementById("finish-day7");
const nextDayBtn = document.getElementById("next-day-btn");

const gradeButtons = Array.from(document.querySelectorAll(".grade-btn"));

const dayConfigs = [
  {
    tip: "先从 A 系列开始熟悉流程。",
    goal: "今日目标：完成 5 张 A 系列卡的买取",
    cards: () => buildCards(5, { series: ["A"], grades: ["A"] }),
  },
  {
    tip: "出现轻微瑕疵，记得对照范例卡。",
    goal: "今日目标：加入 B 品相的判断",
    cards: () => buildCards(6, { series: ["A"], grades: ["A", "B"] }),
  },
  {
    tip: "A、B 系列要去不同网站查价。",
    goal: "今日目标：开始处理 B 系列卡",
    cards: () => buildCards(7, { series: ["A", "B"], grades: ["A", "B"] }),
  },
  {
    tip: "C 品相出现了，注意折痕与损伤。",
    goal: "今日目标：加入 C 品相",
    cards: () => buildCards(8, { series: ["A", "B"], grades: ["A", "B", "C"] }),
  },
  {
    tip: "小心假卡！背面色调会不一样。",
    goal: "今日目标：辨别假卡",
    cards: () => buildCards(8, { series: ["A", "B"], grades: ["A", "B", "C"], includeFake: true }),
  },
  {
    tip: "有些 C 系列查不到价格，需要果断放弃。",
    goal: "今日目标：面对无法查价的卡",
    cards: () => buildCards(10, { series: ["A", "B", "C"], grades: ["A", "B", "C"], includeFake: true }),
  },
  {
    tip: "JHS APP 上线！今天可以轻松搞定。",
    goal: "今日目标：使用 JHS APP 一键拍照查卡",
    cards: () => buildCards(8, { series: ["A", "B", "C"], grades: ["A", "B", "C"], includeFake: false }),
  },
];

const seriesNames = {
  A: "A 系列",
  B: "B 系列",
  C: "C 系列",
};

const gradeWear = {
  A: "边缘完整，无可见问题",
  B: "轻微边缘发白",
  C: "明显折痕或损伤",
  FAKE: "背面色调异常",
};

const rarityIcons = ["★", "★★", "★★★", "★★★★"];

let currentDay = 0;
let cards = [];
let currentIndex = 0;
let decisions = [];
let flipping = false;
let dayTotalIncome = 0;
let dayTargetIncome = 0;

function buildCards(count, rules) {
  const cardsList = [];
  for (let i = 0; i < count; i += 1) {
    const series = pickRandom(rules.series);
    const isFake = rules.includeFake && Math.random() < 0.2;
    const grade = isFake ? "FAKE" : pickRandom(rules.grades);
    const basePrice = 80 + Math.floor(Math.random() * 120);
    cardsList.push({
      name: `${series}牌-${i + 1}`,
      series,
      grade,
      basePrice,
      rarity: pickRandom(rarityIcons),
      isFake,
    });
  }
  return cardsList;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function showScreen(screen) {
  [titleScreen, gameScreen, summaryScreen].forEach((section) => {
    section.classList.toggle("active", section === screen);
  });
}

function startGame() {
  currentDay = 0;
  dayTotalIncome = 0;
  setupDay();
  showScreen(gameScreen);
}

function setupDay() {
  const config = dayConfigs[currentDay];
  cards = config.cards();
  currentIndex = 0;
  decisions = [];
  dayTotalIncome = 0;
  dayTargetIncome = calculateTargetIncome(cards);
  dayNumber.textContent = currentDay + 1;
  dayGoal.textContent = config.goal;
  dayTip.textContent = config.tip;
  cardProgress.textContent = `0/${cards.length}`;
  dayIncome.textContent = "0";
  resetDecision();
  renderCard();
}

function calculateTargetIncome(cardList) {
  return cardList.reduce((sum, card) => {
    if (card.series === "C" && card.grade !== "FAKE") {
      return sum;
    }
    return sum + Math.round(card.basePrice * gradeMultiplier(card.grade));
  }, 0);
}

function gradeMultiplier(grade) {
  if (grade === "A") return 1;
  if (grade === "B") return 0.85;
  if (grade === "C") return 0.65;
  if (grade === "FAKE") return 0;
  return 1;
}

function renderCard() {
  const card = cards[currentIndex];
  cardEl.classList.remove("back");
  cardSeries.textContent = seriesNames[card.series];
  cardName.textContent = card.name;
  cardWear.textContent = gradeWear[card.grade];
  document.getElementById("card-rarity").textContent = card.rarity;
  cardProgress.textContent = `${currentIndex + 1}/${cards.length}`;
  updateDecisionUI();
}

function updateDecisionUI() {
  const decision = decisions[currentIndex] || {};
  decisionAuth.textContent = decision.auth ?? "未判定";
  decisionGrade.textContent = decision.grade ?? "未判定";
  decisionPrice.textContent = decision.price != null ? `${decision.price}` : "未定价";
}

function resetDecision() {
  decisionAuth.textContent = "未判定";
  decisionGrade.textContent = "未判定";
  decisionPrice.textContent = "未定价";
}

function flipCard() {
  if (flipping) return;
  flipping = true;
  cardEl.classList.toggle("back");
  setTimeout(() => {
    flipping = false;
  }, 300);
}

function setGrade(grade) {
  const card = cards[currentIndex];
  const decision = decisions[currentIndex] || {};
  decision.grade = grade === "FAKE" ? "假卡" : `${grade} 品`;
  decision.auth = grade === "FAKE" ? "假卡" : "真卡";
  decision.actualGrade = grade;
  decisions[currentIndex] = decision;
  updateDecisionUI();
}

function openComputer() {
  if (currentDay === 6) {
    openPhone();
    return;
  }
  const card = cards[currentIndex];
  overlay.classList.remove("hidden");
  computerPanel.classList.remove("hidden");
  phonePanel.classList.add("hidden");
  computerSeries.textContent = `${seriesNames[card.series]} 网站`;
  const price = lookupPrice(card);
  marketPrice.textContent = price ? `${price}` : "查不到";
  priceInput.value = "";
}

function lookupPrice(card) {
  if (card.series === "C") return null;
  if (card.grade === "FAKE") return 0;
  return Math.round(card.basePrice * gradeMultiplier(card.grade));
}

function confirmPrice() {
  const priceValue = Number(priceInput.value);
  if (!Number.isFinite(priceValue)) return;
  const decision = decisions[currentIndex] || {};
  decision.price = priceValue;
  decisions[currentIndex] = decision;
  updateDecisionUI();
  closeOverlay();
}

function openPhone() {
  overlay.classList.remove("hidden");
  phonePanel.classList.remove("hidden");
  computerPanel.classList.add("hidden");
}

function photoLookup() {
  const card = cards[currentIndex];
  const price = lookupPrice(card) ?? 0;
  photoName.textContent = card.name;
  photoPrice.textContent = `${price}`;
  const logItem = document.createElement("li");
  logItem.textContent = `${card.name} → ${price}`;
  photoLog.prepend(logItem);
  const decision = decisions[currentIndex] || {};
  decision.price = price;
  decision.grade = card.grade === "FAKE" ? "假卡" : `${card.grade} 品`;
  decision.auth = card.grade === "FAKE" ? "假卡" : "真卡";
  decision.actualGrade = card.grade;
  decisions[currentIndex] = decision;
  updateDecisionUI();
}

function closeOverlay() {
  overlay.classList.add("hidden");
  computerPanel.classList.add("hidden");
  phonePanel.classList.add("hidden");
}

function completeCard() {
  const decision = decisions[currentIndex];
  if (!decision || decision.price == null || !decision.actualGrade) {
    alert("还没有完成判定或定价。");
    return;
  }
  currentIndex += 1;
  if (currentIndex >= cards.length) {
    finishDay();
  } else {
    renderCard();
  }
}

function finishDay() {
  dayTotalIncome = calculateIncome(cards, decisions);
  const diff = Math.abs(dayTotalIncome - dayTargetIncome);
  summaryTitle.textContent = `第 ${currentDay + 1} 天结算`;
  summaryBody.textContent = `今日估价 ${dayTotalIncome} ，系统目标 ${dayTargetIncome} ，差距 ${diff}。`;
  if (currentDay === 6) {
    summaryBody.textContent += "\nJHS APP 让你轻松完成了一天。";
  }
  showScreen(summaryScreen);
}

function calculateIncome(cardList, decisionList) {
  return cardList.reduce((sum, card, index) => {
    const decision = decisionList[index];
    if (!decision) return sum;
    if (card.grade === "FAKE") {
      return decision.actualGrade === "FAKE" ? sum : sum - 50;
    }
    const market = lookupPrice(card) ?? 0;
    const diff = Math.abs(decision.price - market);
    let factor = 1;
    if (diff > market * 0.15) factor = 0.6;
    else if (diff > market * 0.05) factor = 0.85;
    return sum + Math.round(market * factor);
  }, 0);
}

function nextDay() {
  if (currentDay < dayConfigs.length - 1) {
    currentDay += 1;
    setupDay();
    showScreen(gameScreen);
  } else {
    showScreen(titleScreen);
  }
}

startBtn.addEventListener("click", startGame);
cardEl.addEventListener("click", flipCard);
flipBtn.addEventListener("click", flipCard);
priceBtn.addEventListener("click", openComputer);
phoneBtn.addEventListener("click", openPhone);
confirmPriceBtn.addEventListener("click", confirmPrice);
photoBtn.addEventListener("click", photoLookup);
finishDay7Btn.addEventListener("click", closeOverlay);
nextCardBtn.addEventListener("click", completeCard);
nextDayBtn.addEventListener("click", nextDay);
overlay.addEventListener("click", (event) => {
  if (event.target === overlay) closeOverlay();
});

gradeButtons.forEach((button) => {
  button.addEventListener("click", () => setGrade(button.dataset.grade));
});
