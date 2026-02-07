const titleScreen = document.getElementById("title-screen");
const gameScreen = document.getElementById("game-screen");
const summaryScreen = document.getElementById("summary-screen");
const dayNumber = document.getElementById("day-number");
const dayGoal = document.getElementById("day-goal");
const cardProgress = document.getElementById("card-progress");
const mistakeCount = document.getElementById("mistake-count");
const totalIncomeEl = document.getElementById("total-income");
const totalLossEl = document.getElementById("total-loss");
const credibilityScore = document.getElementById("credibility-score");
const cardTimerEl = document.getElementById("card-timer");
const totalTimerEl = document.getElementById("total-timer");
const dayTip = document.getElementById("day-tip");
const cardEl = document.getElementById("card");
const cardSeries = document.getElementById("card-series");
const cardName = document.getElementById("card-name");
const cardWear = document.getElementById("card-wear");
const cardArtSeries = document.getElementById("card-art-series");
const cardArtGrade = document.getElementById("card-art-grade");
const cardBackSeries = document.getElementById("card-back-series");
const decisionAuth = document.getElementById("decision-auth");
const decisionGrade = document.getElementById("decision-grade");
const decisionPrice = document.getElementById("decision-price");
const marketPrice = document.getElementById("market-price");
const computerSeries = document.getElementById("computer-series");
const computerQuery = document.getElementById("computer-query");
const priceGradeSelect = document.getElementById("price-grade-select");
const priceA = document.getElementById("price-a");
const priceB = document.getElementById("price-b");
const priceC = document.getElementById("price-c");
const returnFakeBtn = document.getElementById("return-fake-btn");
const summaryTitle = document.getElementById("summary-title");
const summaryBody = document.getElementById("summary-body");
const overlay = document.getElementById("overlay");
const computerPanel = document.getElementById("computer");
const phonePanel = document.getElementById("phone");
const phoneCard = document.getElementById("phone-card");
const phoneCardSeries = document.getElementById("phone-card-series");
const phoneCardGrade = document.getElementById("phone-card-grade");
const phoneCardName = document.getElementById("phone-card-name");
const phoneArtSeries = document.getElementById("phone-art-series");
const phoneArtGrade = document.getElementById("phone-art-grade");
const phoneAiStatus = document.getElementById("phone-ai-status");
const phoneAiResult = document.getElementById("phone-ai-result");

const startBtn = document.getElementById("start-btn");
const priceABtn = document.getElementById("price-a-btn");
const priceBBtn = document.getElementById("price-b-btn");
const phoneBtn = document.getElementById("phone-btn");
const nextCardBtn = document.getElementById("next-card-btn");
const confirmPriceBtn = document.getElementById("confirm-price");
const nextDayBtn = document.getElementById("next-day-btn");
const giveUpBtn = document.getElementById("give-up-btn");
const phoneActionBtn = document.getElementById("phone-action-btn");
const tipModal = document.getElementById("tip-modal");
const tipTitle = document.getElementById("tip-title");
const tipBody = document.getElementById("tip-body");
const tipGoal = document.getElementById("tip-goal");
const tipCloseBtn = document.getElementById("tip-close");

const gradeButtons = Array.from(document.querySelectorAll(".grade-btn"));

const dayConfigs = [
  {
    tip: "先从 X 系列开始熟悉流程。",
    goal: "今日目标：完成 5 张 X 系列卡的买取",
    cards: () => buildCards(5, { series: ["X"], grades: ["A"] }),
  },
  {
    tip: "出现轻微瑕疵，记得对照范例卡。",
    goal: "今日目标：加入 B 品相的判断",
    cards: () => buildCards(6, { series: ["X"], grades: ["A", "B"] }),
  },
  {
    tip: "X、Y 系列要去不同网站查价。",
    goal: "今日目标：开始处理 Y 系列卡",
    cards: () => buildCards(7, { series: ["X", "Y"], grades: ["A", "B"] }),
  },
  {
    tip: "C 品相出现了，注意折痕与损伤。",
    goal: "今日目标：加入 C 品相",
    cards: () => buildCards(8, { series: ["X", "Y"], grades: ["A", "B", "C"] }),
  },
  {
    tip: "小心假卡！背面色调会不一样。",
    goal: "今日目标：辨别假卡",
    cards: () => buildCards(8, { series: ["X", "Y"], grades: ["A", "B", "C"], fakeCount: 1 }),
  },
  {
    tip: "有些 Z 系列查不到价格，需要果断放弃。",
    goal: "今日目标：面对无法查价的卡",
    cards: () => buildDaySixCards(),
  },
  {
    tip: "JHS APP 上线！今天可以轻松搞定。",
    goal: "今日目标：使用 JHS APP 一键拍照查卡",
    cards: () => buildCards(20, { series: ["X", "Y", "Z"], grades: ["A", "B", "C"], fakeCount: 0 }),
  },
];

const seriesNames = {
  X: "X 系列",
  Y: "Y 系列",
  Z: "Z 系列",
};

const seriesStyles = {
  X: {
    label: "宝可梦卡牌",
    short: "X 系",
    names: ["炽焰绒狐", "电光迅蜥", "潮汐泡泡鲸", "晨露芽灵", "流星软泥"],
    arts: ["ember", "sprout", "wave"],
    back: "X 系列背面",
  },
  Y: {
    label: "游戏王",
    short: "Y 系",
    names: ["暗影剑羽龙", "魔导时轨师", "雷铸圣狮", "星界守门魔", "荒漠巨蝎"],
    arts: ["blade", "sigil", "drake"],
    back: "Y 系列背面",
  },
  Z: {
    label: "万智牌",
    short: "Z 系",
    names: ["暮光藤蔓贤者", "秘术星穹灵", "远古石炉像", "月影潮汐术", "烈风群岛龙"],
    arts: ["golem", "mystic", "wyrm"],
    back: "Z 系列背面",
  },
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
let dayTotalLoss = 0;
let totalIncome = 0;
let totalLoss = 0;
let totalMistakes = 0;
let credibility = 100;
let gameOver = false;
let currentPriceMap = null;
let currentPriceStatus = "ok";
let phoneScanComplete = false;
let dayMistakes = 0;
let dayGradeMistakes = 0;
let dayPriceMistakes = 0;
let dayCredibilityStart = 100;
let dayElapsedMs = 0;
let cardStartTime = 0;
let timerIntervalId = null;
const dayStats = [];

function roundToTenth(value) {
  return Math.round(value * 10) / 10;
}

function formatTimeSeconds(seconds) {
  return roundToTenth(seconds).toFixed(1);
}

function getCurrentCardElapsedMs() {
  return cardStartTime ? performance.now() - cardStartTime : 0;
}

function updateTimeDisplay() {
  const cardSeconds = getCurrentCardElapsedMs() / 1000;
  const totalSeconds = (dayElapsedMs + getCurrentCardElapsedMs()) / 1000;
  cardTimerEl.textContent = formatTimeSeconds(cardSeconds);
  totalTimerEl.textContent = formatTimeSeconds(totalSeconds);
}

function startTimerTicker() {
  if (timerIntervalId) {
    clearInterval(timerIntervalId);
  }
  timerIntervalId = setInterval(updateTimeDisplay, 100);
  updateTimeDisplay();
}

function stopTimerTicker() {
  if (timerIntervalId) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
}

function startCardTimer() {
  cardStartTime = performance.now();
  updateTimeDisplay();
}

function finalizeCardTimer(decision) {
  const elapsedMs = getCurrentCardElapsedMs();
  dayElapsedMs += elapsedMs;
  const cardSeconds = roundToTenth(elapsedMs / 1000);
  const totalSeconds = roundToTenth(dayElapsedMs / 1000);
  if (decision) {
    decision.timeSpent = cardSeconds;
    decision.totalTime = totalSeconds;
  }
  cardStartTime = 0;
  updateTimeDisplay();
}

function buildCards(count, rules) {
  const cardsList = [];
  const fakeIndexes = new Set();
  const targetFakeCount = Math.min(rules.fakeCount ?? 0, count);
  while (fakeIndexes.size < targetFakeCount) {
    fakeIndexes.add(Math.floor(Math.random() * count));
  }
  for (let i = 0; i < count; i += 1) {
    const series = pickRandom(rules.series);
    const isFake = fakeIndexes.has(i);
    const grade = isFake ? "FAKE" : pickWeightedGrade(rules.grades);
    const basePrice = 80 + Math.floor(Math.random() * 120);
    const style = seriesStyles[series];
    cardsList.push({
      name: pickRandom(style.names),
      series,
      grade,
      basePrice,
      rarity: pickRandom(rarityIcons),
      art: pickRandom(style.arts),
      isFake,
    });
  }
  return cardsList;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffleCards(list) {
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function pickWeightedGrade(grades) {
  const weights = {
    A: 0.6,
    B: 0.28,
    C: 0.12,
  };
  const pool = grades.map((grade) => ({ grade, weight: weights[grade] ?? 0.2 }));
  const total = pool.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of pool) {
    roll -= item.weight;
    if (roll <= 0) return item.grade;
  }
  return pool[0].grade;
}

function buildDaySixCards() {
  const cCards = buildCards(2, { series: ["Z"], grades: ["A", "B", "C"] });
  const abCards = buildCards(8, {
    series: ["X", "Y"],
    grades: ["A", "B", "C"],
    fakeCount: 1,
  });
  return shuffleCards([...cCards, ...abCards]);
}

function showScreen(screen) {
  [titleScreen, gameScreen, summaryScreen].forEach((section) => {
    section.classList.toggle("active", section === screen);
  });
}

function startGame() {
  currentDay = 0;
  dayTotalIncome = 0;
  dayTotalLoss = 0;
  totalIncome = 0;
  totalLoss = 0;
  totalMistakes = 0;
  credibility = 100;
  gameOver = false;
  dayStats.length = 0;
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
  dayTip.textContent = `${config.tip}（点击卡片即可翻面）`;
  cardProgress.textContent = `0/${cards.length}`;
  dayTotalIncome = 0;
  dayTotalLoss = 0;
  dayMistakes = 0;
  dayGradeMistakes = 0;
  dayPriceMistakes = 0;
  dayCredibilityStart = credibility;
  dayElapsedMs = 0;
  updateStatsDisplay();
  resetDecision();
  updatePhoneAvailability();
  renderCard();
  openDayTip();
  startTimerTicker();
}

function calculateTargetIncome(cardList) {
  return cardList.reduce((sum, card) => {
    return sum + actualMarketPrice(card);
  }, 0);
}

function gradeMultiplier(grade) {
  if (grade === "A") return 1;
  if (grade === "B") return 0.85;
  if (grade === "C") return 0.65;
  if (grade === "FAKE") return 0;
  return 1;
}

function actualMarketPrice(card) {
  if (card.grade === "FAKE") return 0;
  return Math.round(card.basePrice * gradeMultiplier(card.grade));
}

function renderCard() {
  const card = cards[currentIndex];
  const style = seriesStyles[card.series];
  cardEl.classList.remove("back");
  cardEl.dataset.series = card.series;
  cardEl.dataset.grade = card.grade;
  cardEl.dataset.art = card.art;
  cardSeries.textContent = seriesNames[card.series];
  cardName.textContent = card.name;
  cardWear.textContent = gradeWear[card.grade];
  cardArtSeries.textContent = style.short;
  cardArtGrade.textContent = card.grade === "FAKE" ? "假" : card.grade;
  cardBackSeries.textContent = style.back;
  document.getElementById("card-rarity").textContent = card.rarity;
  cardProgress.textContent = `${currentIndex + 1}/${cards.length}`;
  updateDecisionUI();
  startCardTimer();
}

function updateDecisionUI() {
  const decision = decisions[currentIndex] || {};
  decisionAuth.textContent = decision.auth ?? "未判定";
  decisionGrade.textContent = decision.grade ?? "未判定";
  if (decision.giveUp) {
    decisionPrice.textContent = "放弃";
  } else {
    decisionPrice.textContent = decision.price != null ? `${decision.price}` : "未定价";
  }
  returnFakeBtn.classList.toggle("hidden", decision.actualGrade !== "FAKE");
}

function resetDecision() {
  decisionAuth.textContent = "未判定";
  decisionGrade.textContent = "未判定";
  decisionPrice.textContent = "未定价";
  returnFakeBtn.classList.add("hidden");
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
  if (grade === "FAKE") {
    decision.price = 0;
  }
  decisions[currentIndex] = decision;
  updateDecisionUI();
}

function openComputer(siteSeries) {
  if (currentDay === 6) {
    openPhone();
    return;
  }
  const card = cards[currentIndex];
  overlay.classList.remove("hidden");
  computerPanel.classList.remove("hidden");
  phonePanel.classList.add("hidden");
  const siteLabel = `${siteSeries}系列查价网站`;
  computerSeries.textContent = siteLabel;
  computerQuery.textContent = `${siteSeries}网站 · ${card.name} · 品相 = 价格`;
  currentPriceStatus = getPriceStatus(card, siteSeries);
  currentPriceMap = currentPriceStatus === "ok" ? getGradePrices(card) : null;
  updatePriceDisplay();
  priceGradeSelect.value = "A";
  updateSelectedPrice();
  updateGiveUpButtons();
}

function getPriceStatus(card, siteSeries) {
  if (card.series === "Z") return "unavailable";
  if (siteSeries && card.series !== siteSeries) return "mismatch";
  return "ok";
}

function getGradePrices(card) {
  return {
    A: Math.round(card.basePrice * gradeMultiplier("A")),
    B: Math.round(card.basePrice * gradeMultiplier("B")),
    C: Math.round(card.basePrice * gradeMultiplier("C")),
  };
}

function formatPrice(value) {
  return value == null ? "查不到" : `${value}`;
}

function updatePriceDisplay() {
  priceA.textContent = formatPrice(currentPriceMap?.A ?? null);
  priceB.textContent = formatPrice(currentPriceMap?.B ?? null);
  priceC.textContent = formatPrice(currentPriceMap?.C ?? null);
  confirmPriceBtn.disabled = !currentPriceMap;
}

function updateSelectedPrice() {
  if (!currentPriceMap) {
    marketPrice.textContent = "查不到";
    return;
  }
  const selected = priceGradeSelect.value;
  const value = currentPriceMap[selected];
  marketPrice.textContent = formatPrice(value);
}

function confirmPrice() {
  if (!currentPriceMap) return;
  const selected = priceGradeSelect.value;
  const priceValue = currentPriceMap[selected];
  if (!Number.isFinite(priceValue)) return;
  const decision = decisions[currentIndex] || {};
  decision.price = priceValue;
  decisions[currentIndex] = decision;
  updateDecisionUI();
  closeOverlay();
}

function openPhone() {
  if (currentDay < 6) {
    alert("JHS 手机还未开通，继续用查价电脑。");
    return;
  }
  overlay.classList.remove("hidden");
  phonePanel.classList.remove("hidden");
  computerPanel.classList.add("hidden");
  renderPhonePreview();
  resetPhoneScan();
  updateGiveUpButtons();
}

function updatePhoneAvailability() {
  const unlocked = currentDay >= 6;
  phoneBtn.disabled = !unlocked;
  phoneBtn.textContent = unlocked ? "JHS 手机" : "JHS 手机（未解锁）";
}

function resetPhoneScan() {
  phoneScanComplete = false;
  phoneAiStatus.textContent = "等待拍照识图";
  phoneAiResult.textContent = "AI 搜图识别信息将在此显示。";
  phoneActionBtn.textContent = "拍照识图";
}

function formatGradeLabel(card) {
  if (card.grade === "FAKE") return "假卡";
  return `${card.grade} 品`;
}

function runPhoneScan() {
  const card = cards[currentIndex];
  const decision = decisions[currentIndex] || {};
  if (card.grade === "FAKE") {
    decision.grade = "假卡";
    decision.auth = "假卡";
    decision.actualGrade = "FAKE";
    decision.price = 0;
  } else {
    decision.grade = `${card.grade} 品`;
    decision.auth = "真卡";
    decision.actualGrade = card.grade;
    decision.price = actualMarketPrice(card);
  }
  decisions[currentIndex] = decision;
  updateDecisionUI();
  const priceLabel = `${actualMarketPrice(card)}`;
  phoneAiStatus.textContent = "AI 识别完成";
  phoneAiResult.textContent = `AI 搜图识别：${card.name} · 品相 ${formatGradeLabel(card)} · 价格 ${priceLabel}`;
  phoneActionBtn.textContent = "一键上架";
  phoneScanComplete = true;
}

function handlePhoneAction() {
  if (!phoneScanComplete) {
    runPhoneScan();
    return;
  }
  completeCard();
  if (gameOver || summaryScreen.classList.contains("active")) {
    closeOverlay();
    return;
  }
  renderPhonePreview();
  resetPhoneScan();
}

function renderPhonePreview() {
  const card = cards[currentIndex];
  phoneCard.dataset.series = card.series;
  phoneCard.dataset.art = card.art;
  phoneCard.dataset.grade = card.grade;
  phoneCardSeries.textContent = seriesStyles[card.series].short;
  phoneCardGrade.textContent = card.grade === "FAKE" ? "假" : card.grade;
  phoneCardName.textContent = card.name;
  phoneArtSeries.textContent = seriesStyles[card.series].short;
  phoneArtGrade.textContent = card.grade === "FAKE" ? "假" : card.grade;
}

function closeOverlay() {
  overlay.classList.add("hidden");
  computerPanel.classList.add("hidden");
  phonePanel.classList.add("hidden");
}

function completeCard() {
  const decision = decisions[currentIndex];
  const card = cards[currentIndex];
  if (!decision || (!decision.giveUp && (decision.price == null || !decision.actualGrade))) {
    alert("还没有完成判定或定价。");
    return;
  }
  finalizeCardTimer(decision);
  if (card.isFake && decision.actualGrade !== "FAKE") {
    credibility = Math.max(0, credibility - 100);
    updateStatsDisplay();
    triggerGameOver("假卡入库，游戏结束", "你误买了假卡，卡店可信度扣光。");
    return;
  }
  if (!card.isFake && decision.actualGrade === "FAKE") {
    credibility = Math.max(0, credibility - 100);
    updateStatsDisplay();
    triggerGameOver("信任危机，游戏结束", "你把客人的卡当成假卡，在SNS上炎上了……");
    return;
  }
  if (!decision.giveUp) {
    const outcome = evaluateDecision(card, decision);
    dayTotalIncome += outcome.income;
    dayTotalLoss += outcome.loss;
    totalIncome += outcome.income;
    totalLoss += outcome.loss;
    if (outcome.mistake) {
      totalMistakes += 1;
      dayMistakes += 1;
      if (outcome.gradeMistake) {
        dayGradeMistakes += 1;
      }
      if (outcome.priceMistake) {
        dayPriceMistakes += 1;
      }
      if (applyCredibilityPenalty(10, "品相或定价判断失误")) {
        return;
      }
    }
  } else {
    const outcome = evaluateGiveUp(card);
    dayTotalLoss += outcome.loss;
    totalLoss += outcome.loss;
    if (card.series === "Z" && card.grade !== "FAKE") {
      if (applyCredibilityPenalty(5, "Z 系列无法收购")) {
        return;
      }
    }
  }
  updateStatsDisplay();
  currentIndex += 1;
  if (currentIndex >= cards.length) {
    finishDay();
  } else {
    renderCard();
  }
}

function finishDay() {
  const diff = Math.abs(dayTotalIncome - dayTargetIncome);
  dayStats[currentDay] = {
    timeMs: dayElapsedMs,
    mistakes: dayMistakes,
    cards: cards.length,
  };
  summaryTitle.textContent = `第 ${currentDay + 1} 天结算`;
  summaryBody.textContent = `今日估价 ${dayTotalIncome} ，系统目标 ${dayTargetIncome} ，差距 ${diff}。`;
  if (dayMistakes > 0) {
    const credibilityLoss = Math.max(0, dayCredibilityStart - credibility);
    summaryBody.textContent += `\n今日失误：看错了 ${dayGradeMistakes} 张卡的品相，算错了 ${dayPriceMistakes} 张卡的价格，亏损 ${dayTotalLoss} 元，顾客对牌店的信任下降了 ${credibilityLoss} 点。`;
  }
  if (currentDay === 5) {
    summaryBody.textContent += "\n要是有地方能查到 Z 系列的价格就好了……";
  }
  if (currentDay === 6) {
    const report = buildEfficiencyReport();
    summaryBody.textContent += "\nJHS APP 让你轻松完成了一天。";
    if (report) {
      summaryBody.textContent += `\n小报告：用上 JHS APP 之后，你的效率提升了 ${report.efficiencyBoost}% ，错误率降低了 ${report.errorDrop}% 。`;
    }
  }
  nextDayBtn.textContent = currentDay === 6 ? "谢谢 JHS" : "进入下一天";
  closeOverlay();
  stopTimerTicker();
  showScreen(summaryScreen);
}

function triggerGameOver(title, body) {
  gameOver = true;
  summaryTitle.textContent = title;
  summaryBody.textContent = body;
  stopTimerTicker();
  showScreen(summaryScreen);
}

function applyCredibilityPenalty(points, reason) {
  credibility = Math.max(0, credibility - points);
  updateStatsDisplay();
  if (credibility <= 0) {
    const message = reason
      ? `卡店可信度归零：${reason}，游戏结束。`
      : "卡店可信度归零，游戏结束。";
    triggerGameOver("卡店可信度耗尽", message);
    return true;
  }
  return false;
}

function nextDay() {
  if (gameOver) {
    showScreen(titleScreen);
    return;
  }
  if (currentDay < dayConfigs.length - 1) {
    currentDay += 1;
    setupDay();
    showScreen(gameScreen);
  } else {
    showScreen(titleScreen);
  }
}

function returnFakeCard() {
  const decision = decisions[currentIndex] || {};
  decision.price = 0;
  decision.grade = "假卡";
  decision.auth = "假卡";
  decision.actualGrade = "FAKE";
  decision.rejected = true;
  decisions[currentIndex] = decision;
  updateDecisionUI();
  completeCard();
}

function evaluateDecision(card, decision) {
  const market = actualMarketPrice(card);
  const diff = Math.abs(decision.price - market);
  let factor = 1;
  if (diff > market * 0.15) factor = 0.6;
  else if (diff > market * 0.05) factor = 0.85;
  const income = Math.round(market * factor);
  const loss = market - income;
  const gradeMistake = decision.actualGrade !== card.grade;
  const priceMistake = decision.price !== market;
  const mistake = gradeMistake || priceMistake;
  return { income, loss, mistake, gradeMistake, priceMistake };
}

function evaluateGiveUp(card) {
  return { loss: actualMarketPrice(card) };
}

function giveUpCard() {
  const decision = decisions[currentIndex] || {};
  decision.price = 0;
  decision.grade = "放弃";
  decision.auth = "放弃";
  decision.giveUp = true;
  decisions[currentIndex] = decision;
  updateDecisionUI();
  closeOverlay();
  completeCard();
}

function updateGiveUpButtons() {
  const computerVisible = !computerPanel.classList.contains("hidden");
  const unavailable = currentPriceStatus !== "ok";
  if (!computerVisible || !unavailable) {
    giveUpBtn.classList.add("hidden");
    return;
  }
  giveUpBtn.classList.remove("hidden");
  if (currentPriceStatus === "mismatch") {
    giveUpBtn.textContent = "换个网站试试";
  } else {
    giveUpBtn.textContent = "放弃买取";
  }
}

function handlePriceFallback() {
  if (currentPriceStatus === "mismatch") {
    closeOverlay();
    return;
  }
  if (currentPriceStatus === "unavailable") {
    giveUpCard();
  }
}

function updateStatsDisplay() {
  mistakeCount.textContent = `${totalMistakes}`;
  totalIncomeEl.textContent = `${totalIncome}`;
  totalLossEl.textContent = `${totalLoss}`;
  credibilityScore.textContent = `${credibility}`;
  updateTimeDisplay();
}

function buildEfficiencyReport() {
  const baselineDays = dayStats.slice(0, 6).filter(Boolean);
  const daySeven = dayStats[6];
  if (!daySeven || baselineDays.length === 0) return null;
  const baseline = baselineDays.reduce(
    (acc, day) => {
      acc.timeMs += day.timeMs;
      acc.mistakes += day.mistakes;
      acc.cards += day.cards;
      return acc;
    },
    { timeMs: 0, mistakes: 0, cards: 0 },
  );
  if (baseline.cards === 0) return null;
  const baselineTimePerCard = baseline.timeMs / baseline.cards;
  const baselineMistakeRate = baseline.mistakes / baseline.cards;
  const daySevenTimePerCard = daySeven.timeMs / daySeven.cards;
  const daySevenMistakeRate = daySeven.mistakes / daySeven.cards;
  const efficiencyBoost = baselineTimePerCard
    ? Math.max(0, (1 - daySevenTimePerCard / baselineTimePerCard) * 100)
    : 0;
  const errorDrop = baselineMistakeRate
    ? Math.max(0, (1 - daySevenMistakeRate / baselineMistakeRate) * 100)
    : 0;
  return {
    efficiencyBoost: efficiencyBoost.toFixed(1),
    errorDrop: errorDrop.toFixed(1),
  };
}

function openDayTip() {
  const config = dayConfigs[currentDay];
  tipTitle.textContent = `第 ${currentDay + 1} 天提示`;
  tipBody.textContent = config.tip;
  tipGoal.textContent = config.goal;
  tipModal.classList.remove("hidden");
}

function closeDayTip() {
  tipModal.classList.add("hidden");
}

startBtn.addEventListener("click", startGame);
cardEl.addEventListener("click", flipCard);
priceABtn.addEventListener("click", () => openComputer("X"));
priceBBtn.addEventListener("click", () => openComputer("Y"));
phoneBtn.addEventListener("click", openPhone);
confirmPriceBtn.addEventListener("click", confirmPrice);
priceGradeSelect.addEventListener("change", updateSelectedPrice);
nextCardBtn.addEventListener("click", completeCard);
nextDayBtn.addEventListener("click", nextDay);
returnFakeBtn.addEventListener("click", returnFakeCard);
giveUpBtn.addEventListener("click", handlePriceFallback);
phoneActionBtn.addEventListener("click", handlePhoneAction);
tipCloseBtn.addEventListener("click", closeDayTip);
overlay.addEventListener("click", (event) => {
  if (event.target === overlay) closeOverlay();
});
tipModal.addEventListener("click", (event) => {
  if (event.target === tipModal) closeDayTip();
});

gradeButtons.forEach((button) => {
  button.addEventListener("click", () => setGrade(button.dataset.grade));
});
