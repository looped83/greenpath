/* ============================================
   GreenPath – app.js
   Vanilla JS, no dependencies, localStorage
   ============================================ */

'use strict';

/* ---- State ---- */
const DEFAULT_STATE = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: null,
  totalPoints: 0,
  badges: [],
  dailyActions: {},       // { 'YYYY-MM-DD': [actionId, ...] }
  challenges: {},         // { challengeId: { started, progress, completed } }
  investment: {
    portfolioValue: 0,
    sustainablePercent: 0,
    fossilPercent: 0,
    monthlyGreenSaving: 0,
    targetPercent: 70
  },
  tracker: {
    notBought: 0,
    sortedOut: 0,
    repaired: 0,
    packagingAvoided: 0,
    secondHand: 0,
    consumptionFreeDays: 0
  },
  theme: 'light'
};

let state = {};

/* ---- Constants ---- */
const LEVELS = [
  { min: 0,    name: 'Seedling',          icon: '🌱' },
  { min: 100,  name: 'Sprout',            icon: '🌿' },
  { min: 300,  name: 'Eco Aware',         icon: '🍃' },
  { min: 600,  name: 'Green Living',      icon: '🌲' },
  { min: 1000, name: 'Sustainability Pro',icon: '🌳' },
  { min: 1500, name: 'Earth Guardian',    icon: '🌍' },
  { min: 2200, name: 'Green Champion',    icon: '🏆' },
  { min: 3000, name: 'Planet Hero',       icon: '⚡' }
];

const DAILY_ACTIONS = [
  { id: 'vegan',    emoji: '🌱', title: 'Vegan gegessen',           impact: '~1.5 kg CO₂ gespart', points: 15 },
  { id: 'bike',     emoji: '🚲', title: 'Fahrrad / ÖPNV statt Auto',impact: '~0.8 kg CO₂ pro 10 km', points: 12 },
  { id: 'nobuy',    emoji: '🚫', title: 'Nichts Neues gekauft',      impact: 'Ressourcen & € gespart', points: 10 },
  { id: 'zerowaste',emoji: '♻️', title: 'Zero-Waste-Einkauf',        impact: '~0.3 kg Müll vermieden', points: 12 },
  { id: 'energy',   emoji: '💡', title: 'Strom gespart',             impact: '~0.4 kg CO₂ gespart', points: 8 },
  { id: 'local',    emoji: '📍', title: 'Regional eingekauft',       impact: 'Kurze Lieferwege, lokal', points: 10 },
  { id: 'finance',  emoji: '💚', title: 'Grüne Finanzentscheidung',  impact: 'Nachhaltiges Kapital', points: 14 },
  { id: 'repair',   emoji: '🔧', title: 'Repariert statt ersetzt',   impact: '~2 kg CO₂ & € gespart', points: 18 },
  { id: 'minimal',  emoji: '🧘', title: 'Minimalismus-Aufgabe',      impact: 'Weniger ist mehr', points: 10 }
];

const CHALLENGES = [
  {
    id: 'vegan7',
    icon: '🌿',
    iconBg: 'icon-green',
    title: '7 Tage Vegan',
    duration: '7 Tage',
    description: 'Verzichte 7 Tage komplett auf tierische Produkte. Entdecke pflanzliche Alternativen und spüre den Unterschied.',
    motivation: 'Die pflanzliche Ernährung ist eine der wirksamsten persönlichen Klimamaßnahmen.',
    xp: 150,
    totalDays: 7,
    linkedAction: 'vegan'
  },
  {
    id: 'lowconsume30',
    icon: '🚫',
    iconBg: 'icon-amber',
    title: '30 Tage weniger Konsum',
    duration: '30 Tage',
    description: 'Kaufe 30 Tage lang nichts Unnötiges. Frage dich bei jedem Kauf: Brauche ich das wirklich?',
    motivation: 'Bewusster Konsum ist einer der mächtigsten Hebel für mehr Nachhaltigkeit.',
    xp: 400,
    totalDays: 30,
    linkedAction: 'nobuy'
  },
  {
    id: 'zerowaste7',
    icon: '♻️',
    iconBg: 'icon-teal',
    title: 'Zero Waste Woche',
    duration: '7 Tage',
    description: 'Vermeide diese Woche konsequent Einweg-Verpackungen und Plastik. Bringe eigene Behälter mit.',
    motivation: 'Deutschland produziert ~220 kg Verpackungsmüll pro Person/Jahr. Du kannst das ändern.',
    xp: 120,
    totalDays: 7,
    linkedAction: 'zerowaste'
  },
  {
    id: 'greenmobility7',
    icon: '🚲',
    iconBg: 'icon-blue',
    title: 'Green Mobility Woche',
    duration: '7 Tage',
    description: 'Nutze eine Woche lang ausschließlich Fahrrad, ÖPNV oder deine eigenen Beine.',
    motivation: 'Mobilität macht ~20% der privaten CO₂-Emissionen aus.',
    xp: 120,
    totalDays: 7,
    linkedAction: 'bike'
  },
  {
    id: 'minimal21',
    icon: '🧘',
    iconBg: 'icon-purple',
    title: 'Minimalismus-Challenge',
    duration: '21 Tage',
    description: '21 Tage Minimalismus: Jeden Tag einen Gegenstand aussortieren oder eine unnötige Ausgabe streichen.',
    motivation: 'Weniger Besitz bedeutet mehr Freiheit, Zeit und Ressourcen für das Wesentliche.',
    xp: 250,
    totalDays: 21,
    linkedAction: 'minimal'
  },
  {
    id: 'energy7',
    icon: '⚡',
    iconBg: 'icon-amber',
    title: 'Renewable Energy Awareness',
    duration: '7 Tage',
    description: 'Informiere dich täglich über erneuerbare Energien und achte bewusst auf deinen Verbrauch.',
    motivation: 'Wissen ist der erste Schritt zu echtem Wandel.',
    xp: 100,
    totalDays: 7,
    linkedAction: 'energy'
  },
  {
    id: 'invest30',
    icon: '💚',
    iconBg: 'icon-green',
    title: 'Green Investment Check',
    duration: '30 Tage',
    description: 'Überprüfe monatlich dein Portfolio und setze einen konkreten Schritt zu nachhaltigeren Investments.',
    motivation: 'Geld, das für dich arbeitet, kann auch für den Planeten arbeiten.',
    xp: 200,
    totalDays: 30,
    linkedAction: 'finance'
  }
];

const BADGES = [
  { id: 'vegan_start',    emoji: '🌱', name: 'Vegan Starter',            desc: '3 vegane Tage',          condition: s => getVeganDays(s) >= 3 },
  { id: 'vegan_hero',     emoji: '🥦', name: 'Vegan Hero',               desc: '14 vegane Tage',         condition: s => getVeganDays(s) >= 14 },
  { id: 'zerowaste',      emoji: '♻️', name: 'Zero Waste Hero',          desc: '7 Zero-Waste-Aktionen',  condition: s => getActionCount(s,'zerowaste') >= 7 },
  { id: 'minimal',        emoji: '🧘', name: 'Minimalist Mind',          desc: '5 Minimalismus-Tage',    condition: s => getActionCount(s,'minimal') >= 5 },
  { id: 'investor',       emoji: '💚', name: 'Green Investor',           desc: '≥50% nachhaltiges Depot',condition: s => s.investment.sustainablePercent >= 50 },
  { id: 'energy',         emoji: '⚡', name: 'Renewable Supporter',      desc: '5× Strom gespart',       condition: s => getActionCount(s,'energy') >= 5 },
  { id: 'lowimpact',      emoji: '🌍', name: 'Low Impact Week',          desc: '7 Aktionen in 7 Tagen',  condition: s => weeklyActionsCount(s) >= 7 },
  { id: 'consumer',       emoji: '🛒', name: 'Conscious Consumer',       desc: '7× nichts Neues gekauft',condition: s => getActionCount(s,'nobuy') >= 7 },
  { id: 'cyclist',        emoji: '🚲', name: 'Green Commuter',           desc: '10× Fahrrad gefahren',   condition: s => getActionCount(s,'bike') >= 10 },
  { id: 'streak7',        emoji: '🔥', name: 'Streak Master',            desc: '7 Tage Streak',          condition: s => s.streak >= 7 },
  { id: 'repair',         emoji: '🔧', name: 'Repair Champion',          desc: '3× repariert',           condition: s => s.tracker.repaired >= 3 },
  { id: 'level5',         emoji: '🏆', name: 'Level 5 Reached',          desc: 'Sustainability Pro',     condition: s => s.level >= 5 }
];

const MOTIVATIONS = [
  'Kleine Schritte, großer Wandel. Du bist auf dem richtigen Weg! 🌍',
  'Jede nachhaltige Entscheidung zählt – auch die kleinen.',
  'Dein heutiger Verzicht ist morgens Beitrag zu einer besseren Welt.',
  'Nachhaltigkeit ist kein Opfer, sondern ein bewusster Lebensstil.',
  'Du inspirierst mit deinem Handeln – auch wenn du es nicht siehst.',
  'Bewusstes Konsumieren ist eine der mächtigsten Formen des Wandels.',
  'Die Erde braucht keine perfekten Menschen – nur engagierte.',
  'Fortschritt vor Perfektion. Jeden Tag ein kleines bisschen besser.'
];

/* ---- Helpers ---- */
function today() {
  return new Date().toISOString().split('T')[0];
}

function dateStr(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

function getActionCount(s, actionId) {
  let count = 0;
  Object.values(s.dailyActions).forEach(actions => {
    if (actions.includes(actionId)) count++;
  });
  return count;
}

function getVeganDays(s) {
  return getActionCount(s, 'vegan');
}

function weeklyActionsCount(s) {
  let count = 0;
  for (let i = 0; i < 7; i++) {
    const d = dateStr(-i);
    if (s.dailyActions[d] && s.dailyActions[d].length > 0) count++;
  }
  return count;
}

function getTodayActions() {
  return state.dailyActions[today()] || [];
}

function getCurrentLevel() {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (state.xp >= LEVELS[i].min) return { ...LEVELS[i], index: i };
  }
  return { ...LEVELS[0], index: 0 };
}

function getNextLevel() {
  const cur = getCurrentLevel();
  return cur.index < LEVELS.length - 1 ? LEVELS[cur.index + 1] : null;
}

function getXpToNext() {
  const cur = getCurrentLevel();
  const next = getNextLevel();
  if (!next) return { current: state.xp - cur.min, total: 100 };
  return { current: state.xp - cur.min, total: next.min - cur.min };
}

function calcScore() {
  const todayActions = getTodayActions().length;
  const weekActions = Object.values(state.dailyActions)
    .filter((_, i, arr) => {
      const keys = Object.keys(state.dailyActions);
      return keys[Object.values(state.dailyActions).indexOf(arr[i])] >= dateStr(-6);
    }).reduce((sum, a) => sum + a.length, 0);
  const streakBonus = Math.min(state.streak * 5, 50);
  const score = Math.min(100, Math.round((weekActions * 6) + streakBonus + (state.level * 3)));
  return score;
}

function calcWeeklyCO2() {
  let total = 0;
  for (let i = 0; i < 7; i++) {
    const actions = state.dailyActions[dateStr(-i)] || [];
    if (actions.includes('vegan'))    total += 1.5;
    if (actions.includes('bike'))     total += 0.8;
    if (actions.includes('energy'))   total += 0.4;
    if (actions.includes('zerowaste'))total += 0.2;
    if (actions.includes('repair'))   total += 2.0;
    if (actions.includes('local'))    total += 0.3;
  }
  return total.toFixed(1);
}

function calcWeeklyWaste() {
  let total = 0;
  for (let i = 0; i < 7; i++) {
    const actions = state.dailyActions[dateStr(-i)] || [];
    if (actions.includes('zerowaste'))total += 0.3;
    if (actions.includes('nobuy'))    total += 0.1;
    if (actions.includes('repair'))   total += 0.5;
  }
  return total.toFixed(1);
}

function calcVeganMeals() {
  return getActionCount(state, 'vegan');
}

/* ---- Streak Management ---- */
function updateStreak() {
  const t = today();
  const yesterday = dateStr(-1);
  if (state.lastActiveDate === t) return;
  if (state.lastActiveDate === yesterday) {
    state.streak++;
  } else if (state.lastActiveDate !== t) {
    state.streak = 1;
  }
  state.lastActiveDate = t;
  saveState();
}

/* ---- Badge Checking ---- */
function checkBadges() {
  let newBadges = [];
  BADGES.forEach(badge => {
    if (!state.badges.includes(badge.id) && badge.condition(state)) {
      state.badges.push(badge.id);
      newBadges.push(badge);
    }
  });
  if (newBadges.length) {
    saveState();
    newBadges.forEach(b => {
      setTimeout(() => showToast(`${b.emoji} Badge freigeschaltet: ${b.name}!`, 'success'), 500);
    });
  }
}

/* ---- Level Check ---- */
function checkLevel() {
  const oldLevel = state.level;
  const newLevel = getCurrentLevel().index + 1;
  if (newLevel > oldLevel) {
    state.level = newLevel;
    saveState();
    showConfetti();
    showToast(`🎉 Level ${newLevel} erreicht: ${getCurrentLevel().name}!`, 'success');
  }
}

/* ---- Persistence ---- */
function saveState() {
  localStorage.setItem('greenpath_state', JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem('greenpath_state');
  if (saved) {
    try {
      state = { ...DEFAULT_STATE, ...JSON.parse(saved) };
      // Ensure nested objects are merged
      state.investment = { ...DEFAULT_STATE.investment, ...(state.investment || {}) };
      state.tracker    = { ...DEFAULT_STATE.tracker,    ...(state.tracker    || {}) };
    } catch (e) {
      state = { ...DEFAULT_STATE };
    }
  } else {
    state = { ...DEFAULT_STATE };
    // Add some example data so the app doesn't feel empty
    seedExampleData();
  }
}

function seedExampleData() {
  // Seed last 5 days with some actions
  const exampleActionSets = [
    ['vegan','bike','energy'],
    ['vegan','zerowaste','nobuy','local'],
    ['bike','repair','minimal'],
    ['vegan','energy','nobuy'],
    ['zerowaste','local','finance']
  ];
  exampleActionSets.forEach((actions, i) => {
    const d = dateStr(-(i + 1));
    state.dailyActions[d] = actions;
  });
  state.xp = 320;
  state.level = 2;
  state.streak = 5;
  state.lastActiveDate = dateStr(-1);
  state.tracker = { notBought: 8, sortedOut: 12, repaired: 2, packagingAvoided: 15, secondHand: 3, consumptionFreeDays: 5 };
  state.investment = { portfolioValue: 25000, sustainablePercent: 42, fossilPercent: 8, monthlyGreenSaving: 150, targetPercent: 70 };
  state.badges = ['vegan_start'];
  saveState();
}

/* ---- Toast ---- */
function showToast(msg, type = 'default') {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

/* ---- Confetti ---- */
function showConfetti() {
  const colors = ['#5aab4e','#2a9d8f','#e9c46a','#f4a261','#4a90c4'];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: -10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${1.5 + Math.random()}s;
      animation-delay: ${Math.random() * 0.5}s;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }
}

/* ---- Navigation ---- */
let currentView = 'dashboard';

function navigate(viewId) {
  currentView = viewId;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${viewId}`)?.classList.add('active');

  document.querySelectorAll('.bottom-nav-item, .sidebar-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewId);
  });

  renderView(viewId);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderView(viewId) {
  switch (viewId) {
    case 'dashboard':   renderDashboard(); break;
    case 'actions':     renderActions(); break;
    case 'challenges':  renderChallenges(); break;
    case 'impact':      renderImpact(); break;
    case 'investment':  renderInvestment(); break;
    case 'tracker':     renderTracker(); break;
    case 'insights':    renderInsights(); break;
    case 'gamification':renderGamification(); break;
  }
}

/* ============================================
   RENDER FUNCTIONS
   ============================================ */

/* ---- Dashboard ---- */
function renderDashboard() {
  const score = calcScore();
  const co2 = calcWeeklyCO2();
  const waste = calcWeeklyWaste();
  const veganDays = calcVeganMeals();
  const todayDone = getTodayActions().length;
  const weekDone = Object.entries(state.dailyActions)
    .filter(([d]) => d >= dateStr(-6))
    .reduce((s, [, a]) => s + a.length, 0);
  const level = getCurrentLevel();
  const xpInfo = getXpToNext();
  const nextLevel = getNextLevel();
  const motivation = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];

  document.getElementById('view-dashboard').innerHTML = `
    <div class="page-header">
      <h1>${level.icon} Hallo, GreenPathler!</h1>
      <p class="subtitle">${new Date().toLocaleDateString('de-DE', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</p>
    </div>

    <div class="motivation-banner">
      <span class="quote-icon">💬</span>
      <span>${motivation}</span>
    </div>

    <div class="score-section section-gap">
      <div class="score-inner">
        <div class="score-ring-container">
          <div class="score-ring-wrapper">
            <svg class="score-ring" viewBox="0 0 100 100">
              <circle class="score-ring-bg" cx="50" cy="50" r="40"/>
              <circle class="score-ring-progress" id="score-ring-fill" cx="50" cy="50" r="40"/>
            </svg>
            <div class="score-ring-text">
              <span class="score-number" id="score-display">0</span>
              <span class="score-max">/100</span>
            </div>
          </div>
        </div>
        <div class="score-info">
          <div class="score-title">Dein Green Score</div>
          <div class="score-subtitle">Basierend auf deinen Aktionen der letzten 7 Tage</div>
          <div class="score-level">${level.icon} ${level.name}</div>
          <div class="score-streak">🔥 ${state.streak} Tage Streak</div>
        </div>
      </div>
    </div>

    <div class="level-progress-section section-gap">
      <div class="level-info">
        <span class="level-name">Level ${state.level}: ${level.name}</span>
        <span class="level-xp">${state.xp} / ${nextLevel ? nextLevel.min : state.xp} XP${nextLevel ? ` → ${nextLevel.name}` : ' (MAX)'}</span>
      </div>
      <div class="progress-bar-track">
        <div class="progress-bar-fill" style="width: ${nextLevel ? Math.round((xpInfo.current / xpInfo.total) * 100) : 100}%"></div>
      </div>
    </div>

    <div class="section-label">Diese Woche</div>
    <div class="grid-2 section-gap">
      <div class="stat-card">
        <div class="stat-card-icon icon-green">🌍</div>
        <div class="stat-value">${co2} kg</div>
        <div class="stat-label">CO₂ gespart</div>
        <div class="stat-change positive">↑ Geschätzt</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-teal">♻️</div>
        <div class="stat-value">${waste} kg</div>
        <div class="stat-label">Müll vermieden</div>
        <div class="stat-change positive">↑ Geschätzt</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-amber">🥦</div>
        <div class="stat-value">${veganDays}</div>
        <div class="stat-label">Vegane Tage</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-blue">⚡</div>
        <div class="stat-value">${weekDone}</div>
        <div class="stat-label">Aktionen gesamt</div>
      </div>
    </div>

    <div class="section-label">Heute</div>
    <div class="card section-gap" id="dashboard-today-card">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">✅</span> Heute erledigt</span>
        <span class="card-badge">${todayDone}/${DAILY_ACTIONS.length}</span>
      </div>
      <div class="progress-bar-track mb-12">
        <div class="progress-bar-fill" style="width: ${Math.round((todayDone / DAILY_ACTIONS.length) * 100)}%"></div>
      </div>
      ${todayDone === 0 ? `
        <div class="empty-state">
          <span class="empty-state-icon">🌅</span>
          <h3>Noch keine Aktionen heute</h3>
          <p>Starte deinen grünen Tag! Schau in die <strong>Daily Actions</strong>.</p>
        </div>
      ` : `
        <div class="action-list">
          ${getTodayActions().slice(0, 4).map(id => {
            const a = DAILY_ACTIONS.find(x => x.id === id);
            return a ? `<div class="action-item completed">
              <div class="action-checkbox"></div>
              <span class="action-emoji">${a.emoji}</span>
              <div class="action-content">
                <div class="action-title">${a.title}</div>
                <div class="action-impact">${a.impact}</div>
              </div>
              <span class="action-points">+${a.points}</span>
            </div>` : '';
          }).join('')}
          ${todayDone > 4 ? `<div class="text-center text-muted mt-8" style="font-size:0.85rem">+${todayDone - 4} weitere Aktionen</div>` : ''}
        </div>
      `}
      <button class="btn-primary mt-16" onclick="navigate('actions')">Aktionen anzeigen →</button>
    </div>

    <div class="section-label">Grüne Investments</div>
    <div class="card section-gap">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">💚</span> Portfolio-Nachhaltigkeit</span>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-label">
          <span>Nachhaltiger Anteil: ${state.investment.sustainablePercent}%</span>
          <span>Ziel: ${state.investment.targetPercent}%</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill blue" style="width: ${Math.min(state.investment.sustainablePercent, 100)}%"></div>
        </div>
      </div>
      ${state.investment.sustainablePercent < state.investment.targetPercent ?
        `<p class="text-muted mt-8" style="font-size:0.82rem">Noch ${state.investment.targetPercent - state.investment.sustainablePercent}% bis zu deinem Ziel.</p>` :
        `<p class="text-green mt-8" style="font-size:0.82rem">🎉 Du hast dein Investitionsziel erreicht!</p>`
      }
    </div>
  `;

  // Animate score ring
  setTimeout(() => {
    const fill = document.getElementById('score-ring-fill');
    const display = document.getElementById('score-display');
    if (fill) {
      const circumference = 251.2;
      fill.style.strokeDashoffset = circumference - (score / 100) * circumference;
    }
    if (display) {
      let n = 0;
      const interval = setInterval(() => {
        n = Math.min(n + 3, score);
        display.textContent = n;
        if (n >= score) clearInterval(interval);
      }, 20);
    }
  }, 100);
}

/* ---- Daily Actions ---- */
function renderActions() {
  const todayActions = getTodayActions();
  const totalPossible = DAILY_ACTIONS.reduce((s, a) => s + a.points, 0);
  const earnedToday = DAILY_ACTIONS
    .filter(a => todayActions.includes(a.id))
    .reduce((s, a) => s + a.points, 0);

  document.getElementById('view-actions').innerHTML = `
    <div class="page-header">
      <h1>🌿 Daily Green Actions</h1>
      <p class="subtitle">Hake ab, was du heute schon getan hast.</p>
    </div>

    <div class="card section-gap">
      <div class="card-header">
        <span class="card-title">Heute, ${new Date().toLocaleDateString('de-DE', {weekday:'long'})}</span>
        <span class="card-badge">${earnedToday} / ${totalPossible} Punkte</span>
      </div>
      <div class="progress-bar-track mb-12">
        <div class="progress-bar-fill" style="width: ${Math.round((todayActions.length / DAILY_ACTIONS.length) * 100)}%"></div>
      </div>
      <div class="action-list">
        ${DAILY_ACTIONS.map(action => `
          <div class="action-item ${todayActions.includes(action.id) ? 'completed' : ''}"
               onclick="toggleAction('${action.id}')">
            <div class="action-checkbox"></div>
            <span class="action-emoji">${action.emoji}</span>
            <div class="action-content">
              <div class="action-title">${action.title}</div>
              <div class="action-impact">💚 ${action.impact}</div>
            </div>
            <span class="action-points">+${action.points}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">💡</span> Tipp des Tages</span>
      </div>
      <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.6">
        Jede Aktion, die du abhakst, trägt zu deinem persönlichen CO₂-Fußabdruck bei.
        Schätzungen basieren auf Durchschnittswerten – dein tatsächlicher Impact kann variieren.
        <span style="color:var(--text-muted);display:block;margin-top:6px;font-size:0.8rem">ℹ️ Alle Werte sind Näherungsschätzungen.</span>
      </p>
    </div>
  `;
}

function toggleAction(actionId) {
  const d = today();
  if (!state.dailyActions[d]) state.dailyActions[d] = [];
  const idx = state.dailyActions[d].indexOf(actionId);
  const action = DAILY_ACTIONS.find(a => a.id === actionId);

  if (idx === -1) {
    state.dailyActions[d].push(actionId);
    state.xp += action.points;
    state.totalPoints += action.points;
    updateStreak();
    checkLevel();
    checkBadges();
    showToast(`${action.emoji} +${action.points} XP – ${action.title}`, 'xp');
  } else {
    state.dailyActions[d].splice(idx, 1);
    state.xp = Math.max(0, state.xp - action.points);
    state.totalPoints = Math.max(0, state.totalPoints - action.points);
  }

  saveState();
  updateNavXP();
  renderActions();
}

/* ---- Challenges ---- */
function renderChallenges() {
  const html = `
    <div class="page-header">
      <h1>🏆 Challenges</h1>
      <p class="subtitle">Starte eine Challenge und halte sie durch.</p>
    </div>
    <div class="challenge-grid">
      ${CHALLENGES.map(c => {
        const data = state.challenges[c.id] || {};
        const isActive = data.started && !data.completed;
        const isDone = data.completed;
        const progress = data.progress || 0;
        const pct = Math.round((progress / c.totalDays) * 100);

        return `
          <div class="challenge-card ${isActive ? 'active' : ''} ${isDone ? 'completed-challenge' : ''}">
            <div class="challenge-header">
              <div class="challenge-icon-wrap ${c.iconBg}">${c.icon}</div>
              <div class="challenge-meta">
                <div class="challenge-title">${c.title}</div>
                <div class="challenge-duration">⏱ ${c.duration}</div>
              </div>
              <span class="challenge-status-badge ${isActive ? 'badge-active' : isDone ? 'badge-done' : 'badge-inactive'}">
                ${isActive ? 'Aktiv' : isDone ? 'Abgeschlossen ✓' : 'Inaktiv'}
              </span>
            </div>
            <p class="challenge-description">${c.description}</p>
            ${isActive || isDone ? `
              <div class="progress-bar-container mb-12">
                <div class="progress-bar-label">
                  <span>${progress} / ${c.totalDays} Tage</span>
                  <span>${pct}%</span>
                </div>
                <div class="progress-bar-track">
                  <div class="progress-bar-fill ${isDone ? 'teal' : ''}" style="width: ${pct}%"></div>
                </div>
              </div>
            ` : ''}
            <div class="challenge-footer">
              <span class="challenge-xp">⭐ ${c.xp} XP</span>
              ${isDone
                ? `<button class="challenge-btn btn-done" disabled>✓ Abgeschlossen</button>`
                : isActive
                  ? `<button class="challenge-btn btn-log" onclick="logChallengeDay('${c.id}')">Tag einloggen</button>`
                  : `<button class="challenge-btn btn-start" onclick="startChallenge('${c.id}')">Starten</button>`
              }
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  document.getElementById('view-challenges').innerHTML = html;
}

function startChallenge(id) {
  state.challenges[id] = { started: new Date().toISOString(), progress: 0, completed: false };
  saveState();
  showToast('Challenge gestartet! Du schaffst das! 🚀', 'success');
  renderChallenges();
}

function logChallengeDay(id) {
  const c = CHALLENGES.find(x => x.id === id);
  if (!c || !state.challenges[id]) return;
  state.challenges[id].progress = Math.min((state.challenges[id].progress || 0) + 1, c.totalDays);

  if (state.challenges[id].progress >= c.totalDays) {
    state.challenges[id].completed = true;
    state.xp += c.xp;
    saveState();
    showConfetti();
    showToast(`🎉 Challenge abgeschlossen! +${c.xp} XP`, 'success');
    checkBadges();
    checkLevel();
    updateNavXP();
  } else {
    state.xp += 10;
    saveState();
    showToast(`+10 XP – Tag ${state.challenges[id].progress}/${c.totalDays} eingeloggt! 💪`, 'xp');
    updateNavXP();
  }
  renderChallenges();
}

/* ---- Impact ---- */
function renderImpact() {
  const co2Total = Object.entries(state.dailyActions).reduce((total, [, actions]) => {
    let d = 0;
    if (actions.includes('vegan'))     d += 1.5;
    if (actions.includes('bike'))      d += 0.8;
    if (actions.includes('energy'))    d += 0.4;
    if (actions.includes('zerowaste')) d += 0.2;
    if (actions.includes('repair'))    d += 2.0;
    if (actions.includes('local'))     d += 0.3;
    return total + d;
  }, 0);

  const wasteTotal = Object.entries(state.dailyActions).reduce((total, [, actions]) => {
    let d = 0;
    if (actions.includes('zerowaste')) d += 0.3;
    if (actions.includes('nobuy'))     d += 0.1;
    if (actions.includes('repair'))    d += 0.5;
    return total + d;
  }, 0) + state.tracker.packagingAvoided * 0.05;

  const activeDays = Object.keys(state.dailyActions).length;
  const carFreeTrips = getActionCount(state, 'bike');
  const consumptionFreeDays = state.tracker.consumptionFreeDays + getActionCount(state, 'nobuy');
  const veganMeals = getVeganDays(state);

  const co2Annual = (co2Total / Math.max(activeDays, 1)) * 365;
  const wasteAnnual = (wasteTotal / Math.max(activeDays, 1)) * 365;

  document.getElementById('view-impact').innerHTML = `
    <div class="page-header">
      <h1>🌍 Dein Impact</h1>
      <p class="subtitle">Alle Werte sind Näherungsschätzungen – transparent & ehrlich.</p>
    </div>

    <div class="impact-highlight section-gap">
      <div class="impact-highlight-title">Gesamte geschätzte CO₂-Ersparnis</div>
      <div>
        <span class="impact-highlight-value">${co2Total.toFixed(1)}</span>
        <span class="impact-highlight-unit"> kg CO₂</span>
      </div>
      <div class="impact-note">ℹ️ Schätzung basierend auf deinen eingeloggten Aktionen</div>
    </div>

    <div class="grid-2 section-gap">
      <div class="stat-card">
        <div class="stat-card-icon icon-green">♻️</div>
        <div class="stat-value">${wasteTotal.toFixed(1)} kg</div>
        <div class="stat-label">Müll vermieden</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-amber">🥦</div>
        <div class="stat-value">${veganMeals}</div>
        <div class="stat-label">Vegane Tage</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-blue">🚲</div>
        <div class="stat-value">${carFreeTrips}</div>
        <div class="stat-label">Autofreie Wege</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-purple">🚫</div>
        <div class="stat-value">${consumptionFreeDays}</div>
        <div class="stat-label">Konsumfreie Tage</div>
      </div>
    </div>

    <div class="section-label">Ressourcen</div>
    <div class="card section-gap">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">📦</span> Vermiedene Verpackungen</span>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-label">
          <span>Abgehakte Zero-Waste-Aktionen: ${getActionCount(state, 'zerowaste')}</span>
        </div>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-label">
          <span>Repariert statt ersetzt: ${state.tracker.repaired + getActionCount(state, 'repair')}</span>
        </div>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-label">
          <span>Second-Hand-Käufe: ${state.tracker.secondHand}</span>
        </div>
      </div>
    </div>

    <div class="projection-card section-gap">
      <div class="projection-title">🔮 Wenn du so weitermachst – in 12 Monaten…</div>
      <p style="font-size:0.83rem;color:var(--text-muted)">Projektion basierend auf deinen bisherigen ${activeDays} aktiven Tagen</p>
      <div class="projection-values">
        <div class="projection-val">
          <span class="num">${co2Annual.toFixed(0)} kg</span>
          <span class="lbl">CO₂ gespart</span>
        </div>
        <div class="projection-val">
          <span class="num">${wasteAnnual.toFixed(0)} kg</span>
          <span class="lbl">Müll vermieden</span>
        </div>
        <div class="projection-val">
          <span class="num">${Math.round(veganMeals / Math.max(activeDays, 1) * 365)}</span>
          <span class="lbl">Vegane Tage</span>
        </div>
        <div class="projection-val">
          <span class="num">${Math.round(carFreeTrips / Math.max(activeDays, 1) * 365)}</span>
          <span class="lbl">Autofreie Wege</span>
        </div>
      </div>
      <p style="font-size:0.73rem;color:var(--text-muted);margin-top:12px">ℹ️ Alle Projektionswerte sind grobe Schätzungen und dienen der Motivation, nicht als wissenschaftliche Aussage.</p>
    </div>
  `;
}

/* ---- Investment ---- */
function renderInvestment() {
  const inv = state.investment;
  const progress = Math.min(Math.round((inv.sustainablePercent / inv.targetPercent) * 100), 100);
  const greenValue = Math.round((inv.portfolioValue * inv.sustainablePercent) / 100);

  document.getElementById('view-investment').innerHTML = `
    <div class="page-header">
      <h1>💚 Green Investments</h1>
      <p class="subtitle">Kein Finanzberater – nur Tracking & Reflexion für dich.</p>
    </div>

    <div class="card section-gap">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">📊</span> Portfolio-Übersicht</span>
      </div>
      <div class="grid-2 mb-16">
        <div class="invest-highlight">
          <span class="invest-icon">💼</span>
          <div class="invest-text">
            <div class="label">Depotwert</div>
            <div class="value">€${inv.portfolioValue.toLocaleString('de-DE')}</div>
          </div>
        </div>
        <div class="invest-highlight" style="background:rgba(90,171,78,0.08);border-color:rgba(90,171,78,0.2)">
          <span class="invest-icon">🌿</span>
          <div class="invest-text">
            <div class="label">Nachhaltig</div>
            <div class="value" style="color:var(--green-600)">€${greenValue.toLocaleString('de-DE')}</div>
          </div>
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar-label">
          <span>Nachhaltiger Anteil: ${inv.sustainablePercent}%</span>
          <span>Ziel: ${inv.targetPercent}%</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill blue" style="width:${Math.min(inv.sustainablePercent, 100)}%"></div>
        </div>
      </div>

      ${inv.fossilPercent > 0 ? `
      <div class="progress-bar-container mt-8">
        <div class="progress-bar-label">
          <span style="color:var(--accent-rose)">Fossil / kontrovers: ${inv.fossilPercent}%</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width:${inv.fossilPercent}%;background:var(--accent-rose)"></div>
        </div>
      </div>` : ''}

      ${progress >= 100
        ? `<p class="text-green mt-12" style="font-size:0.9rem">🎉 Zielquote erreicht! Du bist ein Green Investor.</p>`
        : `<p class="text-muted mt-12" style="font-size:0.85rem">Noch ${inv.targetPercent - inv.sustainablePercent}% bis zur Zielquote. Monatlich sparst du €${inv.monthlyGreenSaving} in grüne Investments.</p>`
      }
    </div>

    <div class="section-label">Aktualisieren</div>
    <div class="card section-gap">
      <div class="investment-form">
        <div class="form-group">
          <label class="form-label">Depotwert (€)</label>
          <input type="number" class="form-input" id="inv-portfolio" value="${inv.portfolioValue}" placeholder="z.B. 25000" min="0">
        </div>
        <div class="form-group">
          <label class="form-label">Nachhaltiger Anteil (%)</label>
          <input type="number" class="form-input" id="inv-sustainable" value="${inv.sustainablePercent}" placeholder="z.B. 40" min="0" max="100">
          <span class="form-hint">ESG, SRI, Green Bonds, erneuerbare Energien etc.</span>
        </div>
        <div class="form-group">
          <label class="form-label">Fossil / kontrovers (%)</label>
          <input type="number" class="form-input" id="inv-fossil" value="${inv.fossilPercent}" placeholder="z.B. 10" min="0" max="100">
        </div>
        <div class="form-group">
          <label class="form-label">Monatlicher grüner Sparbetrag (€)</label>
          <input type="number" class="form-input" id="inv-monthly" value="${inv.monthlyGreenSaving}" placeholder="z.B. 150" min="0">
        </div>
        <div class="form-group">
          <label class="form-label">Zielquote nachhaltiger Investments (%)</label>
          <input type="number" class="form-input" id="inv-target" value="${inv.targetPercent}" placeholder="z.B. 70" min="0" max="100">
        </div>
        <button class="btn-primary" onclick="saveInvestment()">💾 Speichern</button>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">💡</span> Hinweise</span>
      </div>
      <ul style="font-size:0.88rem;color:var(--text-secondary);line-height:1.8;padding-left:18px">
        <li>Dies ist kein Finanzberatungs-Tool.</li>
        <li>Nachhaltige ETFs: z.B. MSCI World ESG, MSCI SRI.</li>
        <li>Achte auf echte Nachhaltigkeit, nicht nur Marketing ("Greenwashing").</li>
        <li>Überprüfe regelmäßig die Ausschlusskriterien deiner Fonds.</li>
      </ul>
    </div>
  `;
}

function saveInvestment() {
  state.investment = {
    portfolioValue:     parseFloat(document.getElementById('inv-portfolio').value)  || 0,
    sustainablePercent: parseFloat(document.getElementById('inv-sustainable').value) || 0,
    fossilPercent:      parseFloat(document.getElementById('inv-fossil').value)      || 0,
    monthlyGreenSaving: parseFloat(document.getElementById('inv-monthly').value)     || 0,
    targetPercent:      parseFloat(document.getElementById('inv-target').value)      || 70
  };
  saveState();
  checkBadges();
  showToast('💾 Investment-Daten gespeichert!', 'success');
  renderInvestment();
}

/* ---- Tracker ---- */
function renderTracker() {
  const t = state.tracker;
  const TRACKERS = [
    { key: 'notBought',          emoji: '🛍️', name: 'Nicht gekauft',         unit: 'mal' },
    { key: 'sortedOut',          emoji: '📦', name: 'Aussortiert',            unit: 'Dinge' },
    { key: 'repaired',           emoji: '🔧', name: 'Repariert',              unit: 'Dinge' },
    { key: 'packagingAvoided',   emoji: '📦', name: 'Verpackungen vermieden', unit: 'Stück' },
    { key: 'secondHand',         emoji: '🔄', name: 'Second Hand gekauft',    unit: 'Dinge' },
    { key: 'consumptionFreeDays',emoji: '🚫', name: 'Konsumfreie Tage',       unit: 'Tage' }
  ];

  document.getElementById('view-tracker').innerHTML = `
    <div class="page-header">
      <h1>📊 Minimalismus & Zero Waste</h1>
      <p class="subtitle">Verfolge deinen bewussten Alltag.</p>
    </div>

    <div class="card section-gap">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">🧘</span> Deine Tracker</span>
      </div>
      <div class="tracker-list">
        ${TRACKERS.map(tr => `
          <div class="tracker-item">
            <span class="tracker-icon">${tr.emoji}</span>
            <div class="tracker-info">
              <div class="tracker-name">${tr.name}</div>
              <div class="tracker-count-display">${t[tr.key]} ${tr.unit}</div>
            </div>
            <div class="tracker-controls">
              <button class="counter-btn" onclick="adjustTracker('${tr.key}', -1)">−</button>
              <span class="tracker-count">${t[tr.key]}</span>
              <button class="counter-btn" onclick="adjustTracker('${tr.key}', 1)">+</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">🌟</span> Deine Gesamt-Bilanz</span>
      </div>
      <div class="grid-2">
        <div class="stat-card">
          <div class="stat-value">${Object.values(t).reduce((a, b) => a + b, 0)}</div>
          <div class="stat-label">Gesamte Aktionen</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${t.notBought + t.sortedOut}</div>
          <div class="stat-label">Nicht konsumiert</div>
        </div>
      </div>
    </div>
  `;
}

function adjustTracker(key, delta) {
  state.tracker[key] = Math.max(0, (state.tracker[key] || 0) + delta);
  if (delta > 0) state.xp += 5;
  saveState();
  checkBadges();
  updateNavXP();
  if (delta > 0) showToast('+5 XP für deinen Tracker-Eintrag! 🌿', 'xp');
  renderTracker();
}

/* ---- Insights ---- */
function renderInsights() {
  const days7 = [];
  const dayLabels = ['Mo','Di','Mi','Do','Fr','Sa','So'];
  let maxActions = 1;

  for (let i = 6; i >= 0; i--) {
    const d = dateStr(-i);
    const count = (state.dailyActions[d] || []).length;
    days7.push({ date: d, count, label: new Date(d + 'T12:00:00').toLocaleDateString('de-DE', {weekday:'short'}) });
    if (count > maxActions) maxActions = count;
  }

  const totalActionsWeek = days7.reduce((s, d) => s + d.count, 0);
  const avgActionsWeek = (totalActionsWeek / 7).toFixed(1);

  const allDays = Object.entries(state.dailyActions);
  const totalActionsDone = allDays.reduce((s, [,a]) => s + a.length, 0);

  const categoryCount = {};
  DAILY_ACTIONS.forEach(a => { categoryCount[a.id] = getActionCount(state, a.id); });
  const bestCat = DAILY_ACTIONS.reduce((best, a) => categoryCount[a.id] > (categoryCount[best?.id] || 0) ? a : best, null);
  const worstCat = DAILY_ACTIONS.reduce((worst, a) => categoryCount[a.id] < (categoryCount[worst?.id] || Infinity) ? a : worst, null);

  document.getElementById('view-insights').innerHTML = `
    <div class="page-header">
      <h1>📈 Insights</h1>
      <p class="subtitle">Deine Fortschritte auf einen Blick.</p>
    </div>

    <div class="card section-gap">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">📅</span> Letzte 7 Tage</span>
        <span class="card-badge">${totalActionsWeek} Aktionen</span>
      </div>
      <div class="week-chart">
        ${days7.map((d, i) => {
          const height = Math.round((d.count / maxActions) * 70);
          const isToday = d.date === today();
          return `
            <div class="week-bar-wrap">
              <div class="week-bar ${isToday ? 'today' : ''}" style="height:${height}px" title="${d.count} Aktionen"></div>
              <span class="week-bar-label">${d.label}</span>
            </div>
          `;
        }).join('')}
      </div>
      <div class="divider"></div>
      <div class="grid-2 mt-8">
        <div class="stat-card">
          <div class="stat-value">${avgActionsWeek}</div>
          <div class="stat-label">∅ Aktionen/Tag</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${totalActionsDone}</div>
          <div class="stat-label">Aktionen gesamt</div>
        </div>
      </div>
    </div>

    <div class="card section-gap">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">🏆</span> Deine Kategorien</span>
      </div>
      ${DAILY_ACTIONS.map(a => {
        const count = getActionCount(state, a.id);
        const pct = Math.round((count / Math.max(totalActionsDone, 1)) * 100 * DAILY_ACTIONS.length);
        return `
          <div class="progress-bar-container">
            <div class="progress-bar-label">
              <span>${a.emoji} ${a.title}</span>
              <span style="font-weight:600">${count}×</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width:${Math.min(pct, 100)}%"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="grid-2 section-gap">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><span class="card-title-icon">⭐</span> Stärke</span>
        </div>
        ${bestCat ? `
          <div style="font-size:2rem;text-align:center;margin:8px 0">${bestCat.emoji}</div>
          <p style="text-align:center;font-weight:600;font-size:0.9rem">${bestCat.title}</p>
          <p style="text-align:center;color:var(--text-muted);font-size:0.8rem">${getActionCount(state, bestCat.id)}× durchgeführt</p>
        ` : '<p class="text-muted text-center">Noch keine Daten</p>'}
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title"><span class="card-title-icon">🎯</span> Fokus-Tipp</span>
        </div>
        ${worstCat ? `
          <div style="font-size:2rem;text-align:center;margin:8px 0">${worstCat.emoji}</div>
          <p style="text-align:center;font-weight:600;font-size:0.9rem">${worstCat.title}</p>
          <p style="text-align:center;color:var(--text-muted);font-size:0.8rem">Hier kannst du wachsen</p>
        ` : '<p class="text-muted text-center">Noch keine Daten</p>'}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">💡</span> Empfehlung</span>
      </div>
      <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.6">
        ${totalActionsWeek < 7
          ? `Du hast diese Woche ${totalActionsWeek} Aktionen geschafft. Versuche nächste Woche ${Math.min(totalActionsWeek + 3, 21)} zu erreichen!`
          : totalActionsWeek < 21
          ? `Stark! ${totalActionsWeek} Aktionen diese Woche. Dein nächstes Ziel: eine Vollwoche mit mindestens 3 Aktionen pro Tag.`
          : `Beeindruckend! ${totalActionsWeek} Aktionen – du lebst Nachhaltigkeit authentisch. Teile deine Erfahrungen!`
        }
      </p>
    </div>
  `;
}

/* ---- Gamification ---- */
function renderGamification() {
  const level = getCurrentLevel();
  const xpInfo = getXpToNext();
  const nextLevel = getNextLevel();
  const completedChallenges = Object.values(state.challenges).filter(c => c.completed).length;

  document.getElementById('view-gamification').innerHTML = `
    <div class="page-header">
      <h1>🎮 Dein Fortschritt</h1>
      <p class="subtitle">Level, Badges, Streak – dein grüner Weg.</p>
    </div>

    <div class="card section-gap">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">⭐</span> Level & XP</span>
      </div>
      <div style="text-align:center;padding:16px 0">
        <div style="font-size:4rem;margin-bottom:8px">${level.icon}</div>
        <div style="font-size:1.4rem;font-weight:800;color:var(--green-600)">${level.name}</div>
        <div style="color:var(--text-muted);font-size:0.9rem;margin-top:4px">Level ${state.level}</div>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-label">
          <span>${state.xp} XP</span>
          <span>${nextLevel ? `${nextLevel.min} XP → ${nextLevel.name}` : 'MAX LEVEL'}</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width:${nextLevel ? Math.round((xpInfo.current / xpInfo.total) * 100) : 100}%"></div>
        </div>
      </div>
      <div class="grid-3 mt-16">
        <div class="stat-card">
          <div class="stat-value" style="font-size:1.4rem">🔥 ${state.streak}</div>
          <div class="stat-label">Tage Streak</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="font-size:1.4rem">${completedChallenges}</div>
          <div class="stat-label">Challenges</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="font-size:1.4rem">${state.badges.length}</div>
          <div class="stat-label">Badges</div>
        </div>
      </div>
    </div>

    <div class="section-label">Alle Level</div>
    <div class="card section-gap">
      ${LEVELS.map((l, i) => `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 0;${i < LEVELS.length-1 ? 'border-bottom:1px solid var(--border-light)' : ''}">
          <span style="font-size:22px;width:32px;text-align:center">${l.icon}</span>
          <div style="flex:1">
            <div style="font-weight:600;font-size:0.9rem;color:${state.level > i ? 'var(--green-600)' : 'var(--text-primary)'}">${l.name}</div>
            <div style="font-size:0.78rem;color:var(--text-muted)">${l.min} XP</div>
          </div>
          ${state.level > i ? `<span style="color:var(--green-500);font-size:16px">✓</span>` :
            state.level === i + 1 ? `<span style="font-size:0.75rem;background:var(--green-100);color:var(--green-700);padding:2px 8px;border-radius:99px;font-weight:600">Aktuell</span>` : ''}
        </div>
      `).join('')}
    </div>

    <div class="section-label">Badges (${state.badges.length}/${BADGES.length})</div>
    <div class="badges-grid section-gap">
      ${BADGES.map(badge => {
        const unlocked = state.badges.includes(badge.id);
        return `
          <div class="badge-item ${unlocked ? 'unlocked' : 'locked'}" title="${badge.desc}">
            <span class="badge-emoji">${badge.emoji}</span>
            <span class="badge-name">${badge.name}</span>
            <span class="badge-desc">${badge.desc}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/* ---- Nav XP Update ---- */
function updateNavXP() {
  const el = document.getElementById('nav-xp');
  if (el) el.textContent = `${state.xp} XP`;
}

/* ---- Theme ---- */
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  document.getElementById('theme-btn').textContent = state.theme === 'dark' ? '☀️' : '🌙';
  saveState();
}

/* ---- Init ---- */
function init() {
  loadState();
  document.documentElement.setAttribute('data-theme', state.theme || 'light');
  document.getElementById('theme-btn').textContent = state.theme === 'dark' ? '☀️' : '🌙';
  updateNavXP();

  // Nav listeners
  document.querySelectorAll('[data-view]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.view));
  });

  document.getElementById('theme-btn').addEventListener('click', toggleTheme);

  // Start on dashboard
  navigate('dashboard');
}

document.addEventListener('DOMContentLoaded', init);
