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
  dailyActions: {},
  challenges: {},
  investment: {
    portfolioValue: 0,
    sustainablePercent: 0,
    fossilPercent: 0,
    monthlyGreenSaving: 0,
    targetPercent: 70,
    notes: ''
  },
  tracker: {
    notBought: 0,
    sortedOut: 0,
    repaired: 0,
    packagingAvoided: 0,
    secondHand: 0,
    consumptionFreeDays: 0,
    compostedTimes: 0,
    waterBottlesSaved: 0,
    selfCooked: 0,
    foodWasteAvoided: 0,
    walkedInsteadOfDriven: 0,
    plantedSomething: 0
  },
  actionFilter: 'all',
  challengeFilter: 'all',
  theme: 'light'
};

let state = {};

/* ---- Constants ---- */
const LEVELS = [
  { min: 0,    name: 'Seedling',           icon: '🌱', desc: 'Der erste Schritt zählt!' },
  { min: 100,  name: 'Sprout',             icon: '🌿', desc: 'Du wächst und lernst.' },
  { min: 300,  name: 'Eco Aware',          icon: '🍃', desc: 'Bewusstsein für den Wandel.' },
  { min: 600,  name: 'Green Living',       icon: '🌲', desc: 'Nachhaltigkeit als Lifestyle.' },
  { min: 1000, name: 'Sustainability Pro', icon: '🌳', desc: 'Du weißt, was zählt.' },
  { min: 1500, name: 'Earth Guardian',     icon: '🌍', desc: 'Du schützt, was zählt.' },
  { min: 2200, name: 'Green Champion',     icon: '🏆', desc: 'Vorbildlich in allem.' },
  { min: 3000, name: 'Planet Hero',        icon: '⚡', desc: 'Eine echte Kraft des Wandels.' },
  { min: 4200, name: 'Eco Legend',         icon: '🦅', desc: 'Dein Impact ist sichtbar.' },
  { min: 6000, name: 'GreenPath Master',   icon: '✨', desc: 'Du hast alles erreicht.' }
];

/* ---- Daily Actions (24 total, grouped by category) ---- */
const DAILY_ACTIONS = [
  // Ernährung
  { id: 'vegan',         cat: 'food',     emoji: '🌱', title: 'Vegan gegessen',                   impact: '~1.5 kg CO₂ gespart',              points: 15 },
  { id: 'meatfree',      cat: 'food',     emoji: '🥗', title: 'Fleischlos gegessen',               impact: '~0.8 kg CO₂ gespart',              points: 10 },
  { id: 'plant_meal',    cat: 'food',     emoji: '🥦', title: 'Pflanzenbasierte Mahlzeit',          impact: '~0.5 kg CO₂ gespart',              points: 10 },
  { id: 'food_waste',    cat: 'food',     emoji: '🍱', title: 'Lebensmittelreste verwertet',       impact: '~0.5 kg CO₂ & Geld gespart',       points: 12 },
  { id: 'seasonal',      cat: 'food',     emoji: '🍎', title: 'Saisonal & regional eingekauft',    impact: 'Kurze Wege, weniger Energie',       points: 10 },
  { id: 'water',         cat: 'food',     emoji: '💧', title: 'Leitungswasser statt Flasche',      impact: '~0.2 kg CO₂ & Plastik gespart',    points: 8  },

  // Mobilität
  { id: 'bike',          cat: 'mobility', emoji: '🚲', title: 'Fahrrad statt Auto',               impact: '~0.8 kg CO₂ pro 10 km gespart',    points: 12 },
  { id: 'walk',          cat: 'mobility', emoji: '🚶', title: 'Zu Fuß gegangen',                   impact: '100% emissionsfrei unterwegs',      points: 10 },
  { id: 'transit',       cat: 'mobility', emoji: '🚌', title: 'ÖPNV genutzt',                      impact: '~0.5 kg CO₂ pro Fahrt gespart',    points: 10 },

  // Konsum & Ressourcen
  { id: 'nobuy',         cat: 'consume',  emoji: '🚫', title: 'Nichts Neues gekauft',              impact: 'Ressourcen & € gespart',           points: 10 },
  { id: 'zerowaste',     cat: 'consume',  emoji: '♻️', title: 'Zero-Waste-Einkauf',                impact: '~0.3 kg Müll vermieden',           points: 12 },
  { id: 'repair',        cat: 'consume',  emoji: '🔧', title: 'Repariert statt ersetzt',           impact: '~2 kg CO₂ & viel € gespart',       points: 18 },
  { id: 'secondhand_look',cat:'consume',  emoji: '🔄', title: 'Secondhand zuerst gesucht',         impact: 'Ressourcen & Kreislaufwirtschaft',  points: 10 },
  { id: 'no_plastic',    cat: 'consume',  emoji: '🧴', title: 'Kein Einwegplastik genutzt',        impact: '~0.3 kg Plastik vermieden',         points: 10 },
  { id: 'reusable',      cat: 'consume',  emoji: '🫙', title: 'Wiederverwendbare Flasche/Becher',  impact: 'Plastikflaschen gespart',           points: 8  },
  { id: 'diy',           cat: 'consume',  emoji: '🛠️', title: 'DIY statt kaufen',                  impact: 'Ressourcen & Geld gespart',         points: 14 },
  { id: 'local',         cat: 'consume',  emoji: '📍', title: 'Lokal & regional eingekauft',       impact: 'Kurze Lieferwege, lokale Wirtschaft',points: 10},

  // Energie & Digital
  { id: 'energy',        cat: 'energy',   emoji: '💡', title: 'Strom gespart',                     impact: '~0.4 kg CO₂ gespart',              points: 8  },
  { id: 'shower',        cat: 'energy',   emoji: '🚿', title: 'Kurz geduscht (< 5 Min)',           impact: '~0.1 kg CO₂ & Wasser gespart',     points: 8  },
  { id: 'compost',       cat: 'energy',   emoji: '🌿', title: 'Kompostiert / Bioabfall getrennt',  impact: 'Methan vermieden, Erde entstanden', points: 8  },
  { id: 'digital_clean', cat: 'energy',   emoji: '📱', title: 'Digital aufgeräumt',                impact: '~0.1 kg CO₂ durch weniger Daten',  points: 6  },

  // Natur & Wohlbefinden
  { id: 'nature',        cat: 'nature',   emoji: '🌳', title: 'Zeit in der Natur verbracht',       impact: 'Naturverbundenheit & Wohlbefinden', points: 6  },
  { id: 'news_green',    cat: 'nature',   emoji: '📰', title: 'Über Nachhaltigkeit informiert',    impact: 'Wissen ist der erste Schritt',      points: 6  },

  // Finanzen
  { id: 'finance',       cat: 'finance',  emoji: '💚', title: 'Grüne Finanzentscheidung getroffen',impact: 'Nachhaltiges Kapital eingesetzt',   points: 14 }
];

const ACTION_CATEGORIES = [
  { id: 'all',      label: 'Alle',         icon: '✨' },
  { id: 'food',     label: 'Ernährung',    icon: '🥦' },
  { id: 'mobility', label: 'Mobilität',    icon: '🚲' },
  { id: 'consume',  label: 'Konsum',       icon: '♻️' },
  { id: 'energy',   label: 'Energie',      icon: '💡' },
  { id: 'nature',   label: 'Natur',        icon: '🌳' },
  { id: 'finance',  label: 'Finanzen',     icon: '💚' }
];

/* ---- Challenges (18 total) ---- */
const CHALLENGES = [
  // Ernährung
  {
    id: 'vegan7',       cat: 'food',
    icon: '🌿', iconBg: 'icon-green',
    title: '7 Tage Vegan',
    duration: '7 Tage', totalDays: 7, xp: 150,
    linkedAction: 'vegan',
    description: 'Verzichte 7 Tage komplett auf tierische Produkte. Entdecke pflanzliche Alternativen.',
    motivation: 'Pflanzliche Ernährung ist eine der wirksamsten persönlichen Klimamaßnahmen.'
  },
  {
    id: 'vegan31',      cat: 'food',
    icon: '🥦', iconBg: 'icon-green',
    title: 'Veganuary – 31 Tage',
    duration: '31 Tage', totalDays: 31, xp: 500,
    linkedAction: 'vegan',
    description: 'Halte 31 Tage lang eine rein vegane Ernährung durch. Der Klassiker unter den Ernährungs-Challenges.',
    motivation: 'Ein veganer Monat spart ca. 400 kg CO₂ – der Impact eines Flughafentransfers.'
  },
  {
    id: 'meatfree30',   cat: 'food',
    icon: '🥗', iconBg: 'icon-teal',
    title: '30 Tage fleischlos',
    duration: '30 Tage', totalDays: 30, xp: 300,
    linkedAction: 'meatfree',
    description: 'Kein Fleisch für einen ganzen Monat. Pflanzlich, lecker, klimafreundlich.',
    motivation: 'Schon 1 kg weniger Rindfleisch pro Woche spart über das Jahr ~300 kg CO₂.'
  },
  {
    id: 'foodwaste7',   cat: 'food',
    icon: '🍱', iconBg: 'icon-amber',
    title: 'Food Waste-freie Woche',
    duration: '7 Tage', totalDays: 7, xp: 120,
    linkedAction: 'food_waste',
    description: 'Verwertet diese Woche alle Lebensmittel vollständig. Reste kreativ nutzen.',
    motivation: '1/3 aller Lebensmittel weltweit werden verschwendet. Du kannst das ändern.'
  },
  {
    id: 'seasonal14',   cat: 'food',
    icon: '🍎', iconBg: 'icon-green',
    title: '14 Tage Saisonal essen',
    duration: '14 Tage', totalDays: 14, xp: 180,
    linkedAction: 'seasonal',
    description: 'Kaufe 14 Tage nur saisonales und regionales Obst & Gemüse. Erkunde Wochenmärkte.',
    motivation: 'Saisonale Lebensmittel sparen bis zu 10× die Energie von Importware.'
  },

  // Mobilität
  {
    id: 'greenmobility7', cat: 'mobility',
    icon: '🚲', iconBg: 'icon-blue',
    title: 'Green Mobility Woche',
    duration: '7 Tage', totalDays: 7, xp: 120,
    linkedAction: 'bike',
    description: 'Nutze eine Woche lang ausschließlich Fahrrad, ÖPNV oder deine eigenen Beine.',
    motivation: 'Mobilität macht ~20% der privaten CO₂-Emissionen aus.'
  },
  {
    id: 'nocar30',      cat: 'mobility',
    icon: '🚗', iconBg: 'icon-rose',
    title: 'Autofreier Monat',
    duration: '30 Tage', totalDays: 30, xp: 400,
    linkedAction: 'bike',
    description: 'Verzichte 30 Tage vollständig auf das private Auto. Entdecke die Stadt neu.',
    motivation: 'Ohne Auto spart man im Schnitt 2–3 Tonnen CO₂ pro Jahr.'
  },
  {
    id: 'walk14',       cat: 'mobility',
    icon: '🚶', iconBg: 'icon-teal',
    title: '14 Tage zu Fuß',
    duration: '14 Tage', totalDays: 14, xp: 160,
    linkedAction: 'walk',
    description: 'Jede Strecke unter 2 km gehst du 14 Tage lang. Gut für dich und den Planeten.',
    motivation: 'Zu Fuß gehen kostet nichts, stärkt den Körper und erzeugt 0 g CO₂.'
  },

  // Konsum
  {
    id: 'lowconsume30', cat: 'consume',
    icon: '🚫', iconBg: 'icon-amber',
    title: '30 Tage weniger Konsum',
    duration: '30 Tage', totalDays: 30, xp: 400,
    linkedAction: 'nobuy',
    description: 'Kaufe 30 Tage lang nichts Unnötiges. Frage dich: Brauche ich das wirklich?',
    motivation: 'Bewusster Konsum ist einer der mächtigsten Hebel für mehr Nachhaltigkeit.'
  },
  {
    id: 'zerowaste7',   cat: 'consume',
    icon: '♻️', iconBg: 'icon-teal',
    title: 'Zero Waste Woche',
    duration: '7 Tage', totalDays: 7, xp: 120,
    linkedAction: 'zerowaste',
    description: 'Vermeide diese Woche konsequent Einweg-Verpackungen. Bringe eigene Behälter mit.',
    motivation: 'Deutschland produziert ~220 kg Verpackungsmüll pro Person/Jahr.'
  },
  {
    id: 'secondhand21', cat: 'consume',
    icon: '🔄', iconBg: 'icon-purple',
    title: '21 Tage nur Secondhand',
    duration: '21 Tage', totalDays: 21, xp: 280,
    linkedAction: 'secondhand_look',
    description: 'Wenn du etwas kaufst, dann nur gebraucht. Flohmärkte, Online-Börsen, Tausch.',
    motivation: 'Secondhand verlängert die Lebensdauer von Produkten und spart Ressourcen.'
  },
  {
    id: 'minimal21',    cat: 'consume',
    icon: '🧘', iconBg: 'icon-purple',
    title: 'Minimalismus-Challenge',
    duration: '21 Tage', totalDays: 21, xp: 250,
    linkedAction: 'nobuy',
    description: 'Jeden Tag einen Gegenstand aussortieren oder eine unnötige Ausgabe streichen.',
    motivation: 'Weniger Besitz = mehr Freiheit, Zeit und Ressourcen für das Wesentliche.'
  },
  {
    id: 'diy14',        cat: 'consume',
    icon: '🛠️', iconBg: 'icon-amber',
    title: 'DIY-Challenge',
    duration: '14 Tage', totalDays: 14, xp: 200,
    linkedAction: 'diy',
    description: '14 Tage lang: Selbermachen statt kaufen. Kochen, reparieren, basteln, bauen.',
    motivation: 'DIY stärkt Kompetenzen, spart Geld und schafft weniger Müll.'
  },

  // Energie
  {
    id: 'energy7',      cat: 'energy',
    icon: '⚡', iconBg: 'icon-amber',
    title: 'Energie sparen Woche',
    duration: '7 Tage', totalDays: 7, xp: 100,
    linkedAction: 'energy',
    description: 'Achte täglich bewusst auf deinen Energieverbrauch: Geräte ausstecken, kürzer duschen.',
    motivation: 'Private Haushalte verursachen ~25% der deutschen CO₂-Emissionen.'
  },
  {
    id: 'shower7',      cat: 'energy',
    icon: '🚿', iconBg: 'icon-blue',
    title: '7 Tage Kurzdusche',
    duration: '7 Tage', totalDays: 7, xp: 80,
    linkedAction: 'shower',
    description: 'Duschdauer täglich auf max. 5 Minuten begrenzen. Spart Wasser und Energie.',
    motivation: 'Eine Kurzdusche statt Vollbad spart bis zu 100 Liter Wasser täglich.'
  },
  {
    id: 'composting30', cat: 'energy',
    icon: '🌿', iconBg: 'icon-green',
    title: '30 Tage Kompostieren',
    duration: '30 Tage', totalDays: 30, xp: 250,
    linkedAction: 'compost',
    description: 'Starte oder festige deinen Kompost-Rhythmus für 30 Tage. Bioabfall wird zu Erde.',
    motivation: 'Kompost vermeidet Methan-Emissionen und bereichert Böden.'
  },

  // Natur
  {
    id: 'nature30',     cat: 'nature',
    icon: '🌳', iconBg: 'icon-green',
    title: '30 Tage täglich draußen',
    duration: '30 Tage', totalDays: 30, xp: 300,
    linkedAction: 'nature',
    description: 'Jeden Tag mindestens 20 Minuten draußen in der Natur verbringen – bewusst, ohne Handy.',
    motivation: 'Naturverbundenheit ist der stärkste Motivator für nachhaltiges Handeln.'
  },

  // Finanzen
  {
    id: 'invest30',     cat: 'finance',
    icon: '💚', iconBg: 'icon-green',
    title: 'Green Investment Check',
    duration: '30 Tage', totalDays: 30, xp: 200,
    linkedAction: 'finance',
    description: 'Überprüfe und optimiere deinen Investitionsansatz in Richtung Nachhaltigkeit.',
    motivation: 'Geld, das für dich arbeitet, kann auch für den Planeten arbeiten.'
  }
];

const CHALLENGE_CATEGORIES = [
  { id: 'all',      label: 'Alle',       icon: '🏆' },
  { id: 'food',     label: 'Ernährung',  icon: '🥦' },
  { id: 'mobility', label: 'Mobilität',  icon: '🚲' },
  { id: 'consume',  label: 'Konsum',     icon: '♻️' },
  { id: 'energy',   label: 'Energie',    icon: '💡' },
  { id: 'nature',   label: 'Natur',      icon: '🌳' },
  { id: 'finance',  label: 'Finanzen',   icon: '💚' }
];

/* ---- Badges (24 total) ---- */
const BADGES = [
  // Ernährung
  { id: 'vegan_start',   emoji: '🌱', name: 'Vegan Starter',       desc: '3 vegane Tage',            condition: s => getActionCount(s,'vegan') >= 3 },
  { id: 'vegan_hero',    emoji: '🥦', name: 'Vegan Hero',          desc: '14 vegane Tage',           condition: s => getActionCount(s,'vegan') >= 14 },
  { id: 'food_fighter',  emoji: '🍱', name: 'Food Waste Fighter',  desc: '7× Reste verwertet',       condition: s => getActionCount(s,'food_waste') >= 7 },
  { id: 'seasonal_eater',emoji: '🍎', name: 'Seasonal Eater',      desc: '7× saisonal eingekauft',   condition: s => getActionCount(s,'seasonal') >= 7 },
  { id: 'water_saver',   emoji: '💧', name: 'Water Saver',         desc: '10× Leitungswasser',       condition: s => getActionCount(s,'water') >= 10 },

  // Mobilität
  { id: 'cyclist',       emoji: '🚲', name: 'Green Commuter',      desc: '10× Fahrrad gefahren',     condition: s => getActionCount(s,'bike') >= 10 },
  { id: 'walker',        emoji: '🚶', name: 'Urban Walker',        desc: '10× zu Fuß gegangen',      condition: s => getActionCount(s,'walk') >= 10 },
  { id: 'transit_rider', emoji: '🚌', name: 'Transit Rider',       desc: '10× ÖPNV genutzt',         condition: s => getActionCount(s,'transit') >= 10 },

  // Konsum
  { id: 'zerowaste',     emoji: '♻️', name: 'Zero Waste Hero',     desc: '7× Zero Waste eingekauft', condition: s => getActionCount(s,'zerowaste') >= 7 },
  { id: 'consumer',      emoji: '🛒', name: 'Conscious Consumer',  desc: '7× nichts Neues gekauft',  condition: s => getActionCount(s,'nobuy') >= 7 },
  { id: 'repair_champ',  emoji: '🔧', name: 'Repair Champion',     desc: '5× repariert',             condition: s => getActionCount(s,'repair') + (s.tracker.repaired||0) >= 5 },
  { id: 'no_plastic',    emoji: '🧴', name: 'Plastic Fighter',     desc: '10× kein Einwegplastik',   condition: s => getActionCount(s,'no_plastic') >= 10 },
  { id: 'diy_master',    emoji: '🛠️', name: 'DIY Master',          desc: '5× selbst gemacht',        condition: s => getActionCount(s,'diy') >= 5 },
  { id: 'minimal',       emoji: '🧘', name: 'Minimalist Mind',     desc: '10 Dinge aussortiert',     condition: s => (s.tracker.sortedOut||0) >= 10 },

  // Energie
  { id: 'energy_saver',  emoji: '⚡', name: 'Energy Saver',        desc: '10× Strom gespart',        condition: s => getActionCount(s,'energy') >= 10 },
  { id: 'compost_king',  emoji: '🌿', name: 'Compost King',        desc: '10× kompostiert',           condition: s => getActionCount(s,'compost') + (s.tracker.compostedTimes||0) >= 10 },

  // Natur
  { id: 'nature_lover',  emoji: '🌳', name: 'Nature Lover',        desc: '10× draußen in der Natur', condition: s => getActionCount(s,'nature') >= 10 },

  // Finanzen
  { id: 'investor',      emoji: '💚', name: 'Green Investor',      desc: '≥50% nachhaltiges Depot',  condition: s => s.investment.sustainablePercent >= 50 },
  { id: 'top_investor',  emoji: '🏦', name: 'Impact Investor',     desc: '≥70% nachhaltiges Depot',  condition: s => s.investment.sustainablePercent >= 70 },

  // Streaks & Level
  { id: 'streak7',       emoji: '🔥', name: 'Streak Master',       desc: '7 Tage am Stück',          condition: s => s.streak >= 7 },
  { id: 'streak14',      emoji: '🌋', name: 'Consistent Green',    desc: '14 Tage Streak',           condition: s => s.streak >= 14 },
  { id: 'streak30',      emoji: '💎', name: 'Streak Legend',       desc: '30 Tage Streak',           condition: s => s.streak >= 30 },
  { id: 'lowimpact',     emoji: '🌍', name: 'Low Impact Week',     desc: '≥5 Tage aktiv in einer Woche',condition: s => weeklyActionsCount(s) >= 5 },
  { id: 'level5',        emoji: '🏆', name: 'Level 5 Reached',     desc: 'Sustainability Pro',       condition: s => s.level >= 5 },
  { id: 'challenge3',    emoji: '🎯', name: 'Challenge Seeker',    desc: '3 Challenges abgeschlossen',condition: s => Object.values(s.challenges).filter(c=>c.completed).length >= 3 }
];

const MOTIVATIONS = [
  'Kleine Schritte, großer Wandel. Du bist auf dem richtigen Weg! 🌍',
  'Jede nachhaltige Entscheidung zählt – auch die kleinen.',
  'Nachhaltigkeit ist kein Opfer, sondern ein bewusster Lebensstil.',
  'Du inspirierst mit deinem Handeln – auch wenn du es nicht siehst.',
  'Bewusstes Konsumieren ist eine der mächtigsten Formen des Wandels.',
  'Die Erde braucht keine perfekten Menschen – nur engagierte.',
  'Fortschritt vor Perfektion. Jeden Tag ein kleines bisschen besser.',
  'Deine kleinen Entscheidungen summieren sich zu einem riesigen Impact.',
  'Nachhaltig leben heißt nicht verzichten – es heißt bewusst wählen.',
  'Jeder Baum beginnt als Samen. Jede Veränderung beginnt mit dir.',
  'Das Beste, was du für die Erde tun kannst? Weitermachen.',
  'Du trägst zu einer Welt bei, die auch morgen noch lebenswert ist.',
  'Konsum hinterfragen ist Freiheit. Du lebst sie jeden Tag.',
  'Was du heute wählst, gestaltet die Welt von morgen.',
  'Kein Perfektionismus – nur Beständigkeit. Du machst das toll.',
  'Grün leben ist die schönste Form von Selbstfürsorge.',
  'Die Natur braucht keine Helden. Nur viele Menschen wie dich.',
  'Dein Handeln heute ist das Erbe von morgen.',
  'Nachhaltig ist nicht nur gut für den Planeten – sondern auch für dich.',
  'Ein bewusster Tag ist ein guter Tag. Und du hast viele davon.'
];

const DAILY_TIPS = [
  'Trage eine Einkaufsliste – sie verhindert Impulskäufe und reduziert Food Waste.',
  'Zimmerpflanzen verbessern die Luft und verbinden dich täglich mit der Natur.',
  'Eine Thermoskanne statt Einwegbecher spart bis zu 500 Becher pro Jahr.',
  'Kleidung aus Second Hand kaufen spart bis zu 70% der CO₂-Emissionen einer Neuware.',
  'Vollständig aufgeladene Akkus vom Strom nehmen – Standby vermeiden.',
  'Kurz duschen statt Baden spart bis zu 100 Liter Wasser pro Dusche.',
  'Vegane Tage einführen: Montag könnte dein fleischfreier Tag sein.',
  'Kompostierung macht aus Biomüll wertvollen Dünger – kein Methan in der Mülldeponie.',
  'Reparieren statt wegwerfen: Repair-Cafés bieten oft kostenlose Hilfe an.',
  'Mit dem Fahrrad zur Arbeit: 10 km spart ~1 kg CO₂ pro Fahrt.',
  'Leitungswasser ist in Deutschland Trinkwasserqualität – Flaschen vermeiden.',
  'Greenwashing erkennen: Achte auf echte Zertifikate (Fairtrade, MSC, Bio-Siegel).',
  'Energiesparlampen: LED statt Glühbirne spart 80% Strom.',
  'Richtiges Recycling kann den Unterschied machen – Trennregeln kennen.',
  'Lebensmittel richtig lagern verlängert ihre Haltbarkeit deutlich.'
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
  let weekActions = 0;
  for (let i = 0; i < 7; i++) {
    weekActions += (state.dailyActions[dateStr(-i)] || []).length;
  }
  const streakBonus = Math.min(state.streak * 4, 40);
  const levelBonus = Math.min(state.level * 2, 20);
  return Math.min(100, Math.round((weekActions * 3) + streakBonus + levelBonus));
}

function calcCO2(period = 7) {
  const CO2_MAP = {
    vegan: 1.5, meatfree: 0.8, plant_meal: 0.5, food_waste: 0.5, seasonal: 0.3, water: 0.2,
    bike: 0.8, walk: 0.3, transit: 0.5,
    zerowaste: 0.2, repair: 2.0, nobuy: 0.1, diy: 0.5, local: 0.3,
    energy: 0.4, shower: 0.1, compost: 0.2
  };
  let total = 0;
  for (let i = 0; i < period; i++) {
    const actions = state.dailyActions[dateStr(-i)] || [];
    actions.forEach(a => { total += CO2_MAP[a] || 0; });
  }
  return total;
}

function calcWaste(period = 7) {
  const WASTE_MAP = { zerowaste: 0.3, nobuy: 0.1, repair: 0.5, no_plastic: 0.3, reusable: 0.05 };
  let total = 0;
  for (let i = 0; i < period; i++) {
    const actions = state.dailyActions[dateStr(-i)] || [];
    actions.forEach(a => { total += WASTE_MAP[a] || 0; });
  }
  total += (state.tracker.packagingAvoided || 0) * 0.05;
  return total;
}

/* ---- Streak ---- */
function updateStreak() {
  const t = today();
  const yesterday = dateStr(-1);
  if (state.lastActiveDate === t) return;
  if (state.lastActiveDate === yesterday) {
    state.streak++;
  } else {
    state.streak = 1;
  }
  state.lastActiveDate = t;
  saveState();
}

/* ---- Badges ---- */
function checkBadges() {
  const newOnes = [];
  BADGES.forEach(badge => {
    if (!state.badges.includes(badge.id) && badge.condition(state)) {
      state.badges.push(badge.id);
      newOnes.push(badge);
    }
  });
  if (newOnes.length) {
    saveState();
    newOnes.forEach((b, i) => {
      setTimeout(() => showToast(`${b.emoji} Badge freigeschaltet: ${b.name}!`, 'success'), 500 + i * 600);
    });
  }
}

/* ---- Level ---- */
function checkLevel() {
  const newIdx = getCurrentLevel().index + 1;
  if (newIdx > state.level) {
    state.level = newIdx;
    saveState();
    showConfetti();
    showToast(`🎉 Level ${newIdx} erreicht: ${getCurrentLevel().name}!`, 'success');
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
      state.investment = { ...DEFAULT_STATE.investment, ...(state.investment || {}) };
      state.tracker    = { ...DEFAULT_STATE.tracker,    ...(state.tracker    || {}) };
    } catch (e) {
      state = { ...DEFAULT_STATE };
    }
  } else {
    state = { ...DEFAULT_STATE };
    seedExampleData();
  }
}

function seedExampleData() {
  const exampleSets = [
    ['vegan','bike','energy','water'],
    ['vegan','zerowaste','nobuy','local','food_waste'],
    ['bike','repair','minimal','compost','seasonal'],
    ['vegan','energy','nobuy','shower','nature'],
    ['zerowaste','local','finance','no_plastic','reusable'],
    ['meatfree','walk','diy','news_green'],
    ['vegan','transit','food_waste','water','plant_meal']
  ];
  exampleSets.forEach((actions, i) => {
    state.dailyActions[dateStr(-(i + 1))] = actions;
  });
  state.xp = 480;
  state.level = 3;
  state.streak = 7;
  state.lastActiveDate = dateStr(-1);
  state.tracker = { notBought: 12, sortedOut: 18, repaired: 3, packagingAvoided: 22,
    secondHand: 5, consumptionFreeDays: 8, compostedTimes: 6, waterBottlesSaved: 14,
    selfCooked: 9, foodWasteAvoided: 11, walkedInsteadOfDriven: 7, plantedSomething: 2 };
  state.investment = { portfolioValue: 28000, sustainablePercent: 45, fossilPercent: 7,
    monthlyGreenSaving: 200, targetPercent: 70, notes: '' };
  state.badges = ['vegan_start', 'cyclist', 'streak7', 'food_fighter'];
  state.challenges = {
    vegan7: { started: dateStr(-10), progress: 7, completed: true },
    zerowaste7: { started: dateStr(-3), progress: 3, completed: false }
  };
  saveState();
}

/* ---- UI Helpers ---- */
function showToast(msg, type = 'default') {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function showConfetti() {
  const colors = ['#5aab4e','#2a9d8f','#e9c46a','#f4a261','#4a90c4','#9d92e0'];
  for (let i = 0; i < 50; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `left:${Math.random()*100}vw;top:-10px;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${1.4+Math.random()*0.8}s;animation-delay:${Math.random()*0.4}s;`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }
}

function categoryTabs(categories, activeId, onClickFn) {
  return `<div class="cat-tabs">
    ${categories.map(c => `
      <button class="cat-tab ${c.id === activeId ? 'active' : ''}" onclick="${onClickFn}('${c.id}')">
        ${c.icon} ${c.label}
      </button>`).join('')}
  </div>`;
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

function renderView(id) {
  switch (id) {
    case 'dashboard':    renderDashboard(); break;
    case 'actions':      renderActions(); break;
    case 'challenges':   renderChallenges(); break;
    case 'impact':       renderImpact(); break;
    case 'investment':   renderInvestment(); break;
    case 'tracker':      renderTracker(); break;
    case 'insights':     renderInsights(); break;
    case 'gamification': renderGamification(); break;
  }
}

/* ============================================
   RENDER FUNCTIONS
   ============================================ */

/* ---- Dashboard ---- */
function renderDashboard() {
  const score = calcScore();
  const co2Week = calcCO2(7).toFixed(1);
  const wasteWeek = calcWaste(7).toFixed(1);
  const veganDays = getActionCount(state, 'vegan');
  const todayDone = getTodayActions().length;
  const weekDone = Object.entries(state.dailyActions)
    .filter(([d]) => d >= dateStr(-6))
    .reduce((s, [,a]) => s + a.length, 0);
  const level = getCurrentLevel();
  const xpInfo = getXpToNext();
  const nextLevel = getNextLevel();
  const motivation = MOTIVATIONS[new Date().getDate() % MOTIVATIONS.length];
  const tip = DAILY_TIPS[new Date().getDate() % DAILY_TIPS.length];
  const activeChallenges = Object.entries(state.challenges).filter(([,c]) => c.started && !c.completed).length;
  const completedChallenges = Object.values(state.challenges).filter(c => c.completed).length;

  document.getElementById('view-dashboard').innerHTML = `
    <div class="page-header">
      <h1>${level.icon} Hallo, GreenPathler!</h1>
      <p class="subtitle">${new Date().toLocaleDateString('de-DE',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
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
          <div class="score-subtitle">Basierend auf Aktionen der letzten 7 Tage</div>
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
        <div class="progress-bar-fill" style="width:${nextLevel ? Math.round((xpInfo.current/xpInfo.total)*100) : 100}%"></div>
      </div>
    </div>

    <div class="section-label">Diese Woche</div>
    <div class="grid-4 section-gap">
      <div class="stat-card">
        <div class="stat-card-icon icon-green">🌍</div>
        <div class="stat-value">${co2Week} <span style="font-size:1rem">kg</span></div>
        <div class="stat-label">CO₂ gespart</div>
        <div class="stat-change positive">↑ Schätzwert</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-teal">♻️</div>
        <div class="stat-value">${wasteWeek} <span style="font-size:1rem">kg</span></div>
        <div class="stat-label">Müll vermieden</div>
        <div class="stat-change positive">↑ Schätzwert</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-amber">🥦</div>
        <div class="stat-value">${veganDays}</div>
        <div class="stat-label">Vegane Tage</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-blue">✅</div>
        <div class="stat-value">${weekDone}</div>
        <div class="stat-label">Aktionen</div>
      </div>
    </div>

    <div class="section-label">Heute</div>
    <div class="card section-gap">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">✅</span> Heute erledigt</span>
        <span class="card-badge">${todayDone} / ${DAILY_ACTIONS.length}</span>
      </div>
      <div class="progress-bar-track mb-12">
        <div class="progress-bar-fill" style="width:${Math.round((todayDone/DAILY_ACTIONS.length)*100)}%"></div>
      </div>
      ${todayDone === 0 ? `
        <div class="empty-state">
          <span class="empty-state-icon">🌅</span>
          <h3>Noch keine Aktionen heute</h3>
          <p>Starte deinen grünen Tag und hake die ersten Aktionen ab!</p>
        </div>
      ` : `<div class="action-list">
        ${getTodayActions().slice(0, 5).map(id => {
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
        ${todayDone > 5 ? `<p class="text-center text-muted mt-8" style="font-size:0.83rem">+${todayDone-5} weitere Aktionen ✓</p>` : ''}
      </div>`}
      <button class="btn-primary mt-16" onclick="navigate('actions')">Alle Aktionen →</button>
    </div>

    <div class="section-label">Challenges</div>
    <div class="grid-2 section-gap">
      <div class="stat-card" onclick="navigate('challenges')" style="cursor:pointer">
        <div class="stat-card-icon icon-amber">🏆</div>
        <div class="stat-value">${activeChallenges}</div>
        <div class="stat-label">Aktive Challenges</div>
      </div>
      <div class="stat-card" onclick="navigate('challenges')" style="cursor:pointer">
        <div class="stat-card-icon icon-teal">✅</div>
        <div class="stat-value">${completedChallenges}</div>
        <div class="stat-label">Abgeschlossen</div>
      </div>
    </div>

    <div class="section-label">Grüne Investments</div>
    <div class="card section-gap">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">💚</span> Portfolio-Nachhaltigkeit</span>
        <span class="card-badge">${state.investment.sustainablePercent}% nachhaltig</span>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-label">
          <span>Nachhaltiger Anteil</span>
          <span>Ziel: ${state.investment.targetPercent}%</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill blue" style="width:${Math.min(state.investment.sustainablePercent,100)}%"></div>
        </div>
      </div>
      ${state.investment.sustainablePercent < state.investment.targetPercent
        ? `<p class="text-muted mt-8" style="font-size:0.82rem">Noch ${state.investment.targetPercent-state.investment.sustainablePercent}% bis zum Ziel.</p>`
        : `<p class="text-green mt-8" style="font-size:0.82rem">🎉 Investitionsziel erreicht!</p>`}
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">💡</span> Tipp des Tages</span>
      </div>
      <p style="font-size:0.88rem;color:var(--text-secondary);line-height:1.6">${tip}</p>
    </div>
  `;

  setTimeout(() => {
    const fill = document.getElementById('score-ring-fill');
    const disp = document.getElementById('score-display');
    if (fill) fill.style.strokeDashoffset = 251.2 - (score / 100) * 251.2;
    if (disp) {
      let n = 0;
      const iv = setInterval(() => { n = Math.min(n + 2, score); disp.textContent = n; if (n >= score) clearInterval(iv); }, 18);
    }
  }, 100);
}

/* ---- Daily Actions ---- */
function setActionFilter(cat) {
  state.actionFilter = cat;
  renderActions();
}

function renderActions() {
  const todayActions = getTodayActions();
  const filter = state.actionFilter || 'all';
  const filtered = filter === 'all' ? DAILY_ACTIONS : DAILY_ACTIONS.filter(a => a.cat === filter);
  const totalPossible = DAILY_ACTIONS.reduce((s, a) => s + a.points, 0);
  const earnedToday = DAILY_ACTIONS.filter(a => todayActions.includes(a.id)).reduce((s, a) => s + a.points, 0);
  const doneCount = todayActions.length;

  document.getElementById('view-actions').innerHTML = `
    <div class="page-header">
      <h1>✅ Daily Green Actions</h1>
      <p class="subtitle">Hake ab, was du heute schon getan hast.</p>
    </div>

    <div class="card section-gap">
      <div class="card-header">
        <span class="card-title">Heute, ${new Date().toLocaleDateString('de-DE',{weekday:'long'})}</span>
        <span class="card-badge">${earnedToday} / ${totalPossible} XP</span>
      </div>
      <div class="progress-bar-track mb-8">
        <div class="progress-bar-fill" style="width:${Math.round((doneCount/DAILY_ACTIONS.length)*100)}%"></div>
      </div>
      <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:14px">${doneCount} von ${DAILY_ACTIONS.length} Aktionen erledigt</p>
      ${categoryTabs(ACTION_CATEGORIES, filter, 'setActionFilter')}
    </div>

    ${ACTION_CATEGORIES.filter(c => c.id !== 'all' && (filter === 'all' || filter === c.id)).map(cat => {
      const catActions = DAILY_ACTIONS.filter(a => a.cat === cat.id);
      if (!catActions.length) return '';
      return `
        <div class="section-label">${cat.icon} ${cat.label}</div>
        <div class="action-list section-gap">
          ${catActions.map(action => `
            <div class="action-item ${todayActions.includes(action.id) ? 'completed' : ''}" onclick="toggleAction('${action.id}')">
              <div class="action-checkbox"></div>
              <span class="action-emoji">${action.emoji}</span>
              <div class="action-content">
                <div class="action-title">${action.title}</div>
                <div class="action-impact">💚 ${action.impact}</div>
              </div>
              <span class="action-points">+${action.points}</span>
            </div>
          `).join('')}
        </div>`;
    }).join('')}

    <div class="card">
      <p style="font-size:0.82rem;color:var(--text-muted);line-height:1.6">
        ℹ️ Alle Impact-Werte sind Näherungsschätzungen basierend auf Durchschnittswerten. Dein tatsächlicher Impact kann variieren.
      </p>
    </div>
  `;
}

function toggleAction(actionId) {
  const d = today();
  if (!state.dailyActions[d]) state.dailyActions[d] = [];
  const idx = state.dailyActions[d].indexOf(actionId);
  const action = DAILY_ACTIONS.find(a => a.id === actionId);
  if (!action) return;

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
function setChallengeFilter(cat) {
  state.challengeFilter = cat;
  renderChallenges();
}

function renderChallenges() {
  const filter = state.challengeFilter || 'all';
  const filtered = filter === 'all' ? CHALLENGES : CHALLENGES.filter(c => c.cat === filter);
  const active = Object.values(state.challenges).filter(c => c.started && !c.completed).length;
  const done = Object.values(state.challenges).filter(c => c.completed).length;

  document.getElementById('view-challenges').innerHTML = `
    <div class="page-header">
      <h1>🏆 Challenges</h1>
      <p class="subtitle">Starte eine Challenge und halte sie durch.</p>
    </div>

    <div class="grid-2 section-gap">
      <div class="stat-card">
        <div class="stat-card-icon icon-amber">🔥</div>
        <div class="stat-value">${active}</div>
        <div class="stat-label">Aktiv</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-teal">✅</div>
        <div class="stat-value">${done}</div>
        <div class="stat-label">Abgeschlossen</div>
      </div>
    </div>

    <div class="card section-gap">
      ${categoryTabs(CHALLENGE_CATEGORIES, filter, 'setChallengeFilter')}
    </div>

    <div class="challenge-grid">
      ${filtered.map(c => {
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
                <div class="challenge-duration">⏱ ${c.duration} · ⭐ ${c.xp} XP</div>
              </div>
              <span class="challenge-status-badge ${isActive ? 'badge-active' : isDone ? 'badge-done' : 'badge-inactive'}">
                ${isActive ? 'Aktiv' : isDone ? '✓ Fertig' : 'Start'}
              </span>
            </div>
            <p class="challenge-description">${c.description}</p>
            <p style="font-size:0.78rem;color:var(--green-600);font-style:italic;margin-bottom:12px">💬 ${c.motivation}</p>
            ${isActive || isDone ? `
              <div class="progress-bar-container mb-8">
                <div class="progress-bar-label">
                  <span>${progress} / ${c.totalDays} Tage</span>
                  <span style="font-weight:700">${pct}%</span>
                </div>
                <div class="progress-bar-track">
                  <div class="progress-bar-fill ${isDone ? 'teal' : ''}" style="width:${pct}%"></div>
                </div>
              </div>` : ''}
            <div class="challenge-footer">
              ${isDone
                ? `<button class="challenge-btn btn-done" disabled>✓ Abgeschlossen</button>`
                : isActive
                  ? `<button class="challenge-btn btn-log" onclick="logChallengeDay('${c.id}')">+ Tag einloggen</button>`
                  : `<button class="challenge-btn btn-start" onclick="startChallenge('${c.id}')">Starten →</button>`
              }
            </div>
          </div>`;
      }).join('')}
    </div>
  `;
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
  const prev = state.challenges[id].progress || 0;
  state.challenges[id].progress = Math.min(prev + 1, c.totalDays);

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
    showToast(`+10 XP – Tag ${state.challenges[id].progress}/${c.totalDays} ✓`, 'xp');
    updateNavXP();
  }
  renderChallenges();
}

/* ---- Impact ---- */
function renderImpact() {
  const co2All  = calcCO2(3650);
  const co2Week = calcCO2(7);
  const co2Month= calcCO2(30);
  const wasteAll= calcWaste(3650);
  const activeDays = Object.keys(state.dailyActions).length;
  const carFree = getActionCount(state,'bike') + getActionCount(state,'walk') + getActionCount(state,'transit');
  const consumeFree = (state.tracker.consumptionFreeDays||0) + getActionCount(state,'nobuy');
  const veganTotal = getActionCount(state,'vegan');
  const meatfreeTotal = getActionCount(state,'meatfree') + veganTotal;
  const co2Daily = co2All / Math.max(activeDays, 1);
  const co2Annual = co2Daily * 365;
  const wasteAnnual = (wasteAll / Math.max(activeDays, 1)) * 365;

  document.getElementById('view-impact').innerHTML = `
    <div class="page-header">
      <h1>🌍 Dein Impact</h1>
      <p class="subtitle">Näherungsschätzungen – transparent & ehrlich dargestellt.</p>
    </div>

    <div class="impact-highlight section-gap">
      <div class="impact-highlight-title">Gesamte geschätzte CO₂-Ersparnis</div>
      <div>
        <span class="impact-highlight-value">${co2All.toFixed(1)}</span>
        <span class="impact-highlight-unit"> kg CO₂</span>
      </div>
      <div class="impact-note">ℹ️ Basierend auf ${activeDays} aktiven Tagen mit eingeloggten Aktionen</div>
    </div>

    <div class="section-label">Zeitraum-Vergleich</div>
    <div class="grid-3 section-gap">
      <div class="stat-card">
        <div class="stat-value">${co2Week.toFixed(1)}<span style="font-size:0.9rem"> kg</span></div>
        <div class="stat-label">Diese Woche</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${co2Month.toFixed(1)}<span style="font-size:0.9rem"> kg</span></div>
        <div class="stat-label">Letzter Monat</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${co2All.toFixed(1)}<span style="font-size:0.9rem"> kg</span></div>
        <div class="stat-label">Gesamt</div>
      </div>
    </div>

    <div class="section-label">Deine Highlights</div>
    <div class="grid-2 section-gap">
      <div class="stat-card">
        <div class="stat-card-icon icon-green">🥦</div>
        <div class="stat-value">${veganTotal}</div>
        <div class="stat-label">Vegane Tage</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-teal">🥗</div>
        <div class="stat-value">${meatfreeTotal}</div>
        <div class="stat-label">Fleischlose Tage</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-blue">🚲</div>
        <div class="stat-value">${carFree}</div>
        <div class="stat-label">Autofreie Wege</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-amber">🚫</div>
        <div class="stat-value">${consumeFree}</div>
        <div class="stat-label">Konsumfreie Tage</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-purple">♻️</div>
        <div class="stat-value">${wasteAll.toFixed(1)}<span style="font-size:0.9rem"> kg</span></div>
        <div class="stat-label">Müll vermieden</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon icon-rose">🔧</div>
        <div class="stat-value">${getActionCount(state,'repair') + (state.tracker.repaired||0)}</div>
        <div class="stat-label">Dinge repariert</div>
      </div>
    </div>

    <div class="section-label">Nach Kategorie</div>
    <div class="card section-gap">
      ${[
        { label: 'Ernährung', co2: (getActionCount(state,'vegan')*1.5+getActionCount(state,'meatfree')*0.8+getActionCount(state,'food_waste')*0.5+getActionCount(state,'seasonal')*0.3).toFixed(1), icon: '🥦' },
        { label: 'Mobilität',  co2: (getActionCount(state,'bike')*0.8+getActionCount(state,'walk')*0.3+getActionCount(state,'transit')*0.5).toFixed(1), icon: '🚲' },
        { label: 'Konsum',     co2: (getActionCount(state,'repair')*2+getActionCount(state,'zerowaste')*0.2+getActionCount(state,'nobuy')*0.1).toFixed(1), icon: '♻️' },
        { label: 'Energie',    co2: (getActionCount(state,'energy')*0.4+getActionCount(state,'shower')*0.1+getActionCount(state,'compost')*0.2).toFixed(1), icon: '💡' }
      ].map(cat => `
        <div class="progress-bar-container">
          <div class="progress-bar-label">
            <span>${cat.icon} ${cat.label}</span>
            <span style="font-weight:700">${cat.co2} kg CO₂</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width:${Math.min(parseFloat(cat.co2)/Math.max(co2All,0.1)*100,100).toFixed(0)}%"></div>
          </div>
        </div>`).join('')}
    </div>

    <div class="projection-card section-gap">
      <div class="projection-title">🔮 In 12 Monaten – wenn du so weitermachst…</div>
      <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:12px">Projektion aus ${activeDays} Tagen Datenbasis</p>
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
          <span class="num">${Math.round(veganTotal/Math.max(activeDays,1)*365)}</span>
          <span class="lbl">Vegane Tage</span>
        </div>
        <div class="projection-val">
          <span class="num">${Math.round(carFree/Math.max(activeDays,1)*365)}</span>
          <span class="lbl">Autofreie Wege</span>
        </div>
      </div>
      <p style="font-size:0.72rem;color:var(--text-muted);margin-top:12px">ℹ️ Alle Projektionswerte sind grobe Schätzungen zur Motivation, keine wissenschaftlichen Messungen.</p>
    </div>
  `;
}

/* ---- Investment ---- */
function renderInvestment() {
  const inv = state.investment;
  const greenValue = Math.round((inv.portfolioValue * inv.sustainablePercent) / 100);
  const fossilValue = Math.round((inv.portfolioValue * inv.fossilPercent) / 100);
  const progress = Math.min(Math.round((inv.sustainablePercent / Math.max(inv.targetPercent,1)) * 100), 100);
  const annualGreen = inv.monthlyGreenSaving * 12;

  document.getElementById('view-investment').innerHTML = `
    <div class="page-header">
      <h1>💚 Green Investments</h1>
      <p class="subtitle">Kein Finanzberater – nur Tracking & Reflexion für dich.</p>
    </div>

    <div class="card section-gap">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">📊</span> Portfolio-Übersicht</span>
        <span class="card-badge">${progress}% zum Ziel</span>
      </div>
      <div class="grid-2 mb-16">
        <div class="invest-highlight">
          <span class="invest-icon">💼</span>
          <div class="invest-text">
            <div class="label">Gesamtes Depot</div>
            <div class="value">€${inv.portfolioValue.toLocaleString('de-DE')}</div>
          </div>
        </div>
        <div class="invest-highlight" style="background:rgba(90,171,78,0.08);border-color:rgba(90,171,78,0.2)">
          <span class="invest-icon">🌿</span>
          <div class="invest-text">
            <div class="label">Nachhaltig investiert</div>
            <div class="value" style="color:var(--green-600)">€${greenValue.toLocaleString('de-DE')}</div>
          </div>
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar-label">
          <span>Nachhaltiger Anteil: <strong>${inv.sustainablePercent}%</strong></span>
          <span>Ziel: ${inv.targetPercent}%</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill blue" style="width:${Math.min(inv.sustainablePercent,100)}%"></div>
        </div>
      </div>

      ${inv.fossilPercent > 0 ? `
        <div class="progress-bar-container mt-8">
          <div class="progress-bar-label">
            <span style="color:var(--accent-rose)">Fossil / kontrovers: ${inv.fossilPercent}% (€${fossilValue.toLocaleString('de-DE')})</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width:${inv.fossilPercent}%;background:var(--accent-rose)"></div>
          </div>
        </div>` : ''}

      <div class="grid-2 mt-16">
        <div class="stat-card">
          <div class="stat-card-icon icon-green">📈</div>
          <div class="stat-value">€${inv.monthlyGreenSaving}</div>
          <div class="stat-label">Monatlich grün gespart</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon icon-blue">🌍</div>
          <div class="stat-value">€${annualGreen.toLocaleString('de-DE')}</div>
          <div class="stat-label">Davon pro Jahr</div>
        </div>
      </div>

      ${progress >= 100
        ? `<p class="text-green mt-12" style="font-size:0.9rem;font-weight:600">🎉 Zielquote erreicht! Du bist Green Investor.</p>`
        : `<p class="text-muted mt-12" style="font-size:0.85rem">Noch <strong>${inv.targetPercent - inv.sustainablePercent}%</strong> bis zur Zielquote. Bei €${inv.monthlyGreenSaving}/Monat dauert das ca. <strong>${Math.ceil((inv.targetPercent - inv.sustainablePercent) / Math.max(inv.monthlyGreenSaving / Math.max(inv.portfolioValue,1) * 100, 0.1))} Monate</strong>.</p>`}
    </div>

    <div class="section-label">Daten aktualisieren</div>
    <div class="card section-gap">
      <div class="investment-form">
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Depotwert (€)</label>
            <input type="number" class="form-input" id="inv-portfolio" value="${inv.portfolioValue}" placeholder="z.B. 25000" min="0">
          </div>
          <div class="form-group">
            <label class="form-label">Zielquote (%)</label>
            <input type="number" class="form-input" id="inv-target" value="${inv.targetPercent}" placeholder="z.B. 70" min="0" max="100">
          </div>
          <div class="form-group">
            <label class="form-label">Nachhaltiger Anteil (%)</label>
            <input type="number" class="form-input" id="inv-sustainable" value="${inv.sustainablePercent}" placeholder="z.B. 40" min="0" max="100">
            <span class="form-hint">ESG, SRI, Green Bonds, erneuerbare Energien</span>
          </div>
          <div class="form-group">
            <label class="form-label">Fossil / kontrovers (%)</label>
            <input type="number" class="form-input" id="inv-fossil" value="${inv.fossilPercent}" placeholder="z.B. 10" min="0" max="100">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Monatlicher grüner Sparbetrag (€)</label>
          <input type="number" class="form-input" id="inv-monthly" value="${inv.monthlyGreenSaving}" placeholder="z.B. 150" min="0">
        </div>
        <div class="form-group">
          <label class="form-label">Notizen / Überlegungen</label>
          <textarea class="form-input" id="inv-notes" rows="3" placeholder="z.B. Prüfe MSCI World SRI ETF...">${inv.notes || ''}</textarea>
        </div>
        <button class="btn-primary" onclick="saveInvestment()">💾 Speichern</button>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">💡</span> Orientierungspunkte</span>
      </div>
      <ul style="font-size:0.87rem;color:var(--text-secondary);line-height:2;padding-left:18px">
        <li>Dies ist kein Finanzberatungs-Tool – nur Selbst-Tracking.</li>
        <li>Nachhaltige ETFs: z.B. MSCI World ESG Leaders, MSCI World SRI.</li>
        <li>Greenwashing erkennen: Achte auf echte Ausschlusskriterien.</li>
        <li>Divestment: Fossile Investments schrittweise reduzieren.</li>
        <li>Green Bonds: Anleihen für Klimaprojekte & erneuerbare Energien.</li>
        <li>Überprüfe regelmäßig die Ausschlusslisten deiner Fonds.</li>
      </ul>
    </div>
  `;
}

function saveInvestment() {
  state.investment = {
    portfolioValue:     parseFloat(document.getElementById('inv-portfolio').value)   || 0,
    sustainablePercent: parseFloat(document.getElementById('inv-sustainable').value) || 0,
    fossilPercent:      parseFloat(document.getElementById('inv-fossil').value)      || 0,
    monthlyGreenSaving: parseFloat(document.getElementById('inv-monthly').value)     || 0,
    targetPercent:      parseFloat(document.getElementById('inv-target').value)      || 70,
    notes:              document.getElementById('inv-notes').value || ''
  };
  saveState();
  checkBadges();
  showToast('💾 Investment-Daten gespeichert!', 'success');
  renderInvestment();
}

/* ---- Tracker ---- */
const TRACKER_DEFS = [
  { key: 'notBought',           emoji: '🛍️', name: 'Nicht gekauft',          unit: 'mal',    impact: '~0.1 kg CO₂ pro Verzicht' },
  { key: 'sortedOut',           emoji: '📦', name: 'Dinge aussortiert',       unit: 'Dinge',  impact: 'Raum für Wesentliches' },
  { key: 'repaired',            emoji: '🔧', name: 'Repariert',               unit: 'Dinge',  impact: '~2 kg CO₂ pro Reparatur' },
  { key: 'packagingAvoided',    emoji: '🧴', name: 'Verpackungen vermieden',  unit: 'Stück',  impact: '~0.05 kg Plastik pro Stück' },
  { key: 'secondHand',          emoji: '🔄', name: 'Second Hand gekauft',     unit: 'Dinge',  impact: 'Bis zu 70% CO₂ gespart' },
  { key: 'consumptionFreeDays', emoji: '🚫', name: 'Konsumfreie Tage',        unit: 'Tage',   impact: '€ & Ressourcen gespart' },
  { key: 'compostedTimes',      emoji: '🌿', name: 'Kompostiert',             unit: 'mal',    impact: 'Methan vermieden' },
  { key: 'waterBottlesSaved',   emoji: '💧', name: 'Plastikflaschen vermieden',unit: 'Stück', impact: '~0.2 kg CO₂ pro Flasche' },
  { key: 'selfCooked',          emoji: '🍳', name: 'Selbst gekocht',          unit: 'mal',    impact: 'Lieferung & Verpackung gespart' },
  { key: 'foodWasteAvoided',    emoji: '🍱', name: 'Lebensmittel verwertet',  unit: 'mal',    impact: '~0.5 kg CO₂ pro Verwertung' },
  { key: 'walkedInsteadOfDriven',emoji:'🚶', name: 'Zu Fuß statt Auto',      unit: 'mal',    impact: '~0.3 kg CO₂ pro Weg' },
  { key: 'plantedSomething',    emoji: '🌱', name: 'Etwas gepflanzt',         unit: 'Pflanzen',impact: 'CO₂-Bindung & Biodiversität' }
];

function renderTracker() {
  const t = state.tracker;
  const total = Object.values(t).reduce((a, b) => a + b, 0);

  document.getElementById('view-tracker').innerHTML = `
    <div class="page-header">
      <h1>📊 Minimalismus & Zero Waste</h1>
      <p class="subtitle">Verfolge deinen bewussten Alltag mit einfachen Zählern.</p>
    </div>

    <div class="grid-4 section-gap">
      <div class="stat-card">
        <div class="stat-value">${total}</div>
        <div class="stat-label">Gesamt-Aktionen</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${t.notBought + t.sortedOut}</div>
        <div class="stat-label">Nicht konsumiert</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${t.repaired}</div>
        <div class="stat-label">Repariert</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${t.waterBottlesSaved + t.packagingAvoided}</div>
        <div class="stat-label">Verpackungen weg</div>
      </div>
    </div>

    <div class="section-label">Minimalismus</div>
    <div class="card section-gap">
      <div class="tracker-list">
        ${TRACKER_DEFS.slice(0, 6).map(tr => renderTrackerItem(tr, t[tr.key])).join('')}
      </div>
    </div>

    <div class="section-label">Ressourcen & Energie</div>
    <div class="card section-gap">
      <div class="tracker-list">
        ${TRACKER_DEFS.slice(6).map(tr => renderTrackerItem(tr, t[tr.key])).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">🌍</span> Dein geschätzter Tracker-Impact</span>
      </div>
      <div class="grid-2">
        <div class="stat-card">
          <div class="stat-value">${((t.repaired||0)*2 + (t.waterBottlesSaved||0)*0.2 + (t.foodWasteAvoided||0)*0.5 + (t.walkedInsteadOfDriven||0)*0.3).toFixed(1)} kg</div>
          <div class="stat-label">CO₂ aus Tracker</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${((t.packagingAvoided||0)*0.05 + (t.waterBottlesSaved||0)*0.03).toFixed(2)} kg</div>
          <div class="stat-label">Plastik vermieden</div>
        </div>
      </div>
      <p style="font-size:0.75rem;color:var(--text-muted);margin-top:12px">ℹ️ Näherungsschätzungen</p>
    </div>
  `;
}

function renderTrackerItem(tr, val) {
  return `
    <div class="tracker-item">
      <span class="tracker-icon">${tr.emoji}</span>
      <div class="tracker-info">
        <div class="tracker-name">${tr.name}</div>
        <div class="tracker-count-display">${val||0} ${tr.unit} · ${tr.impact}</div>
      </div>
      <div class="tracker-controls">
        <button class="counter-btn" onclick="adjustTracker('${tr.key}', -1)">−</button>
        <span class="tracker-count">${val||0}</span>
        <button class="counter-btn" onclick="adjustTracker('${tr.key}', 1)">+</button>
      </div>
    </div>`;
}

function adjustTracker(key, delta) {
  state.tracker[key] = Math.max(0, (state.tracker[key] || 0) + delta);
  if (delta > 0) { state.xp += 5; updateNavXP(); showToast('+5 XP für deinen Tracker! 🌿', 'xp'); }
  saveState();
  checkBadges();
  renderTracker();
}

/* ---- Insights ---- */
function renderInsights() {
  const days7 = [];
  let maxActions = 1;
  for (let i = 6; i >= 0; i--) {
    const d = dateStr(-i);
    const count = (state.dailyActions[d] || []).length;
    days7.push({ date: d, count, label: new Date(d+'T12:00:00').toLocaleDateString('de-DE',{weekday:'short'}) });
    if (count > maxActions) maxActions = count;
  }

  const weekTotal = days7.reduce((s,d) => s+d.count, 0);
  const allTotal  = Object.values(state.dailyActions).reduce((s,a) => s+a.length, 0);
  const avg7 = (weekTotal / 7).toFixed(1);

  const catTotals = ACTION_CATEGORIES.filter(c=>c.id!=='all').map(cat => ({
    cat,
    count: DAILY_ACTIONS.filter(a=>a.cat===cat.id).reduce((s,a) => s+getActionCount(state,a.id), 0)
  })).sort((a,b) => b.count - a.count);

  const bestCat = catTotals[0];
  const worstCat = catTotals[catTotals.length-1];

  const days30 = [];
  let maxMonth = 1;
  for (let i = 29; i >= 0; i--) {
    const d = dateStr(-i);
    const count = (state.dailyActions[d] || []).length;
    days30.push({ date: d, count });
    if (count > maxMonth) maxMonth = count;
  }
  const month30Total = days30.reduce((s,d) => s+d.count, 0);

  document.getElementById('view-insights').innerHTML = `
    <div class="page-header">
      <h1>📈 Insights</h1>
      <p class="subtitle">Deine Fortschritte auf einen Blick.</p>
    </div>

    <div class="grid-4 section-gap">
      <div class="stat-card">
        <div class="stat-value">${weekTotal}</div>
        <div class="stat-label">7-Tage-Aktionen</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${month30Total}</div>
        <div class="stat-label">30-Tage-Aktionen</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${avg7}</div>
        <div class="stat-label">∅ Aktionen/Tag</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${allTotal}</div>
        <div class="stat-label">Gesamt</div>
      </div>
    </div>

    <div class="card section-gap">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">📅</span> Letzte 7 Tage</span>
        <span class="card-badge">${weekTotal} Aktionen</span>
      </div>
      <div class="week-chart">
        ${days7.map(d => {
          const h = Math.max(4, Math.round((d.count/maxActions)*70));
          return `<div class="week-bar-wrap">
            <div class="week-bar ${d.date===today()?'today':''}" style="height:${h}px" title="${d.count}"></div>
            <span class="week-bar-label">${d.label}</span>
          </div>`;
        }).join('')}
      </div>
    </div>

    <div class="card section-gap">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">📅</span> Letzte 30 Tage</span>
        <span class="card-badge">${month30Total} Aktionen</span>
      </div>
      <div class="month-chart">
        ${days30.map(d => {
          const h = Math.max(2, Math.round((d.count/maxMonth)*40));
          return `<div class="month-bar" style="height:${h}px" title="${d.date}: ${d.count} Aktionen"></div>`;
        }).join('')}
      </div>
    </div>

    <div class="grid-2 section-gap">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><span class="card-title-icon">⭐</span> Stärkste Kategorie</span>
        </div>
        <div style="text-align:center;padding:12px 0">
          <div style="font-size:2.5rem">${bestCat.cat.icon}</div>
          <div style="font-weight:700;margin-top:6px">${bestCat.cat.label}</div>
          <div style="color:var(--text-muted);font-size:0.82rem;margin-top:3px">${bestCat.count} Aktionen insgesamt</div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title"><span class="card-title-icon">🎯</span> Wachstumspotenzial</span>
        </div>
        <div style="text-align:center;padding:12px 0">
          <div style="font-size:2.5rem">${worstCat.cat.icon}</div>
          <div style="font-weight:700;margin-top:6px">${worstCat.cat.label}</div>
          <div style="color:var(--text-muted);font-size:0.82rem;margin-top:3px">Hier liegt Potenzial</div>
        </div>
      </div>
    </div>

    <div class="card section-gap">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">🏆</span> Alle Kategorien</span>
      </div>
      ${catTotals.map(ct => {
        const pct = allTotal > 0 ? Math.round((ct.count/allTotal)*100) : 0;
        return `<div class="progress-bar-container">
          <div class="progress-bar-label">
            <span>${ct.cat.icon} ${ct.cat.label}</span>
            <span style="font-weight:600">${ct.count}×</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width:${Math.min(pct*2,100)}%"></div>
          </div>
        </div>`;
      }).join('')}
    </div>

    <div class="card section-gap">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">🌿</span> Alle Daily Actions</span>
      </div>
      ${DAILY_ACTIONS.map(a => {
        const count = getActionCount(state, a.id);
        const pct = allTotal > 0 ? Math.min(Math.round((count/allTotal)*100*DAILY_ACTIONS.length/5),100) : 0;
        return `<div class="progress-bar-container">
          <div class="progress-bar-label">
            <span>${a.emoji} ${a.title}</span>
            <span style="font-weight:600">${count}×</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width:${pct}%"></div>
          </div>
        </div>`;
      }).join('')}
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title"><span class="card-title-icon">💡</span> Persönliche Empfehlung</span>
      </div>
      <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.6">
        ${weekTotal === 0
          ? 'Fange einfach an! Hake heute mindestens eine Aktion ab – das ist der erste Schritt.'
          : weekTotal < 7
          ? `Du hast diese Woche ${weekTotal} Aktionen geschafft. Versuche ${Math.min(weekTotal+3,14)} zu erreichen – ein Schritt nach dem anderen!`
          : weekTotal < 20
          ? `Stark! ${weekTotal} Aktionen diese Woche. Probiere mehr aus der Kategorie <strong>${worstCat.cat.label}</strong>.`
          : `Beeindruckend! ${weekTotal} Aktionen – du lebst Nachhaltigkeit. Die Kategorie <strong>${worstCat.cat.label}</strong> könnte noch mehr Tiefe bekommen.`}
      </p>
    </div>
  `;
}

/* ---- Gamification ---- */
function renderGamification() {
  const level = getCurrentLevel();
  const xpInfo = getXpToNext();
  const nextLevel = getNextLevel();
  const completedChallenges = Object.values(state.challenges).filter(c=>c.completed).length;
  const unlockedBadges = state.badges.length;

  document.getElementById('view-gamification').innerHTML = `
    <div class="page-header">
      <h1>🎮 Dein Fortschritt</h1>
      <p class="subtitle">Level, Badges, Streak – dein grüner Weg.</p>
    </div>

    <div class="card section-gap">
      <div style="text-align:center;padding:20px 0 12px">
        <div style="font-size:5rem;line-height:1">${level.icon}</div>
        <div style="font-size:1.5rem;font-weight:800;color:var(--green-600);margin-top:8px">${level.name}</div>
        <div style="color:var(--text-muted);font-size:0.88rem;margin-top:4px;font-style:italic">${level.desc}</div>
        <div style="color:var(--text-secondary);font-size:0.85rem;margin-top:6px">Level ${state.level} von ${LEVELS.length}</div>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-label">
          <span>${state.xp} XP</span>
          <span>${nextLevel ? `${nextLevel.min} XP → ${nextLevel.name} ${nextLevel.icon}` : '✨ Maximales Level erreicht!'}</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width:${nextLevel ? Math.round((xpInfo.current/xpInfo.total)*100) : 100}%"></div>
        </div>
      </div>
      <div class="grid-4 mt-16">
        <div class="stat-card">
          <div class="stat-value" style="font-size:1.3rem">🔥 ${state.streak}</div>
          <div class="stat-label">Streak</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="font-size:1.3rem">${completedChallenges}</div>
          <div class="stat-label">Challenges</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="font-size:1.3rem">${unlockedBadges}/${BADGES.length}</div>
          <div class="stat-label">Badges</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="font-size:1.3rem">${state.totalPoints || state.xp}</div>
          <div class="stat-label">XP gesamt</div>
        </div>
      </div>
    </div>

    <div class="section-label">Level-Pfad</div>
    <div class="card section-gap">
      ${LEVELS.map((l, i) => {
        const reached = state.level > i + 1;
        const current = state.level === i + 1;
        return `<div style="display:flex;align-items:center;gap:12px;padding:10px 0;${i<LEVELS.length-1?'border-bottom:1px solid var(--border-light)':''}">
          <span style="font-size:24px;width:34px;text-align:center">${l.icon}</span>
          <div style="flex:1">
            <div style="font-weight:${current?'700':'600'};font-size:0.9rem;color:${reached?'var(--green-600)':current?'var(--text-primary)':'var(--text-muted)'}">${l.name}</div>
            <div style="font-size:0.75rem;color:var(--text-muted)">${l.min.toLocaleString()} XP · ${l.desc}</div>
          </div>
          ${reached ? `<span style="color:var(--green-500);font-weight:700">✓</span>` :
            current ? `<span style="font-size:0.75rem;background:var(--green-100);color:var(--green-700);padding:3px 10px;border-radius:99px;font-weight:700">Aktuell</span>` :
            `<span style="font-size:0.75rem;color:var(--text-muted)">${l.min} XP</span>`}
        </div>`;
      }).join('')}
    </div>

    <div class="section-label">Badges (${unlockedBadges} / ${BADGES.length} freigeschaltet)</div>
    <div class="badges-grid section-gap">
      ${BADGES.map(badge => {
        const unlocked = state.badges.includes(badge.id);
        return `<div class="badge-item ${unlocked?'unlocked':'locked'}" title="${badge.desc}">
          <span class="badge-emoji">${badge.emoji}</span>
          <span class="badge-name">${badge.name}</span>
          <span class="badge-desc">${badge.desc}</span>
        </div>`;
      }).join('')}
    </div>
  `;
}

/* ---- Nav XP ---- */
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
  document.querySelectorAll('[data-view]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.view));
  });
  document.getElementById('theme-btn').addEventListener('click', toggleTheme);
  navigate('dashboard');
}

document.addEventListener('DOMContentLoaded', init);
