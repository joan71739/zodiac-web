// ============================================================
// chartMath.js — 黃道計算 / 相位判斷 / 宮位計算共用函式
// 星盤優化 V2
// ============================================================

// ─────────────────────────────────────────────
// 1. 星座對應黃道絕對度數起點
// ─────────────────────────────────────────────
export const SIGN_OFFSETS = {
  牡羊座: 0,
  金牛座: 30,
  雙子座: 60,
  巨蟹座: 90,
  獅子座: 120,
  處女座: 150,
  天秤座: 180,
  天蠍座: 210,
  射手座: 240,
  魔羯座: 270,
  水瓶座: 300,
  雙魚座: 330,
};

// ─────────────────────────────────────────────
// 2. 相位定義（含嚴謹容許度）
// ─────────────────────────────────────────────
export const ASPECT_DEFINITIONS = {
  conjunction: {
    key: 'conjunction',
    name: '合相',
    symbol: '☌',
    angle: 0,
    defaultOrb: 8,
    strictOrb: 5,
    color: '#BA7517',
    strokeDasharray: 'none',
    defaultShow: true,
  },
  sextile: {
    key: 'sextile',
    name: '六分',
    symbol: '✱',
    angle: 60,
    defaultOrb: 6,
    strictOrb: 3,
    color: '#3B6D11',
    strokeDasharray: '8,4',
    defaultShow: true,
  },
  square: {
    key: 'square',
    name: '四分',
    symbol: '□',
    angle: 90,
    defaultOrb: 8,
    strictOrb: 5,
    color: '#A32D2D',
    strokeDasharray: 'none',
    defaultShow: true,
  },
  trine: {
    key: 'trine',
    name: '三分',
    symbol: '△',
    angle: 120,
    defaultOrb: 8,
    strictOrb: 5,
    color: '#185FA5',
    strokeDasharray: 'none',
    defaultShow: true,
  },
  opposition: {
    key: 'opposition',
    name: '對分',
    symbol: '☍',
    angle: 180,
    defaultOrb: 8,
    strictOrb: 5,
    color: '#72243E',
    strokeDasharray: '8,4',
    defaultShow: true,
  },
  semiSextile: {
    key: 'semiSextile',
    name: '半六分',
    symbol: '⌗',
    angle: 30,
    defaultOrb: 2,
    strictOrb: 1,
    color: '#0F6E56',
    strokeDasharray: '3,3',
    defaultShow: false,
  },
  semiSquare: {
    key: 'semiSquare',
    name: '半四分',
    symbol: '∠',
    angle: 45,
    defaultOrb: 2,
    strictOrb: 1,
    color: '#533AB7',
    strokeDasharray: '3,3',
    defaultShow: false,
  },
  quintile: {
    key: 'quintile',
    name: '五分',
    symbol: 'Q',
    angle: 72,
    defaultOrb: 2,
    strictOrb: 1,
    color: '#D85A30',
    strokeDasharray: '3,3',
    defaultShow: false,
  },
  sesquiquadrate: {
    key: 'sesquiquadrate',
    name: '倍半四分',
    symbol: '⊡',
    angle: 135,
    defaultOrb: 2,
    strictOrb: 1,
    color: '#D4537E',
    strokeDasharray: '3,3',
    defaultShow: false,
  },
  quincunx: {
    key: 'quincunx',
    name: '補十二分',
    symbol: '⊻',
    angle: 150,
    defaultOrb: 3,
    strictOrb: 1.5,
    color: '#1D9E75',
    strokeDasharray: '3,3',
    defaultShow: false,
  },
};

// ─────────────────────────────────────────────
// 3. 行星定義
// ─────────────────────────────────────────────
export const PLANET_DEFINITIONS = {
  太陽:   { key: 'sun',        symbol: '☉',  type: 'major',   hasOrb: true,  defaultOrb: 8, strictOrb: 5, defaultShow: true  },
  月亮:   { key: 'moon',       symbol: '☽',  type: 'major',   hasOrb: true,  defaultOrb: 8, strictOrb: 5, defaultShow: true  },
  水星:   { key: 'mercury',    symbol: '☿',  type: 'major',   hasOrb: true,  defaultOrb: 6, strictOrb: 4, defaultShow: true  },
  金星:   { key: 'venus',      symbol: '♀',  type: 'major',   hasOrb: true,  defaultOrb: 6, strictOrb: 4, defaultShow: true  },
  火星:   { key: 'mars',       symbol: '♂',  type: 'major',   hasOrb: true,  defaultOrb: 6, strictOrb: 4, defaultShow: true  },
  木星:   { key: 'jupiter',    symbol: '♃',  type: 'major',   hasOrb: true,  defaultOrb: 5, strictOrb: 3, defaultShow: true  },
  土星:   { key: 'saturn',     symbol: '♄',  type: 'major',   hasOrb: true,  defaultOrb: 5, strictOrb: 3, defaultShow: true  },
  天王星: { key: 'uranus',     symbol: '♅',  type: 'outer',   hasOrb: false, defaultShow: true  },
  海王星: { key: 'neptune',    symbol: '♆',  type: 'outer',   hasOrb: false, defaultShow: true  },
  冥王星: { key: 'pluto',      symbol: '♇',  type: 'outer',   hasOrb: false, defaultShow: true  },
  上升:   { key: 'asc',        symbol: 'Asc', type: 'axis',   hasOrb: false, defaultShow: true  },
  天頂:   { key: 'mc',         symbol: 'MC',  type: 'axis',   hasOrb: false, defaultShow: true  },
  凱龍:   { key: 'chiron',     symbol: '⚷',  type: 'minor',   hasOrb: false, defaultShow: false },
  穀神:   { key: 'ceres',      symbol: '⚳',  type: 'minor',   hasOrb: false, defaultShow: false },
  智神:   { key: 'pallas',     symbol: '⚴',  type: 'minor',   hasOrb: false, defaultShow: false },
  婚神:   { key: 'juno',       symbol: '⚵',  type: 'minor',   hasOrb: false, defaultShow: false },
  灶神:   { key: 'vesta',      symbol: '⚶',  type: 'minor',   hasOrb: false, defaultShow: false },
  北交:   { key: 'northNode',  symbol: '☊',  type: 'minor',   hasOrb: false, defaultShow: false },
  南交:   { key: 'southNode',  symbol: '☋',  type: 'minor',   hasOrb: false, defaultShow: false },
  莉莉絲: { key: 'lilith',     symbol: '⚸',  type: 'minor',   hasOrb: false, defaultShow: false },
  福點:   { key: 'pof',        symbol: '⊗',  type: 'minor',   hasOrb: false, defaultShow: false },
  宿命:   { key: 'vertex',     symbol: '⊕',  type: 'minor',   hasOrb: false, defaultShow: false },
  東昇:   { key: 'eastPoint',  symbol: 'EP', type: 'minor',   hasOrb: false, defaultShow: false },
  下降:   { key: 'dsc',        symbol: 'Dsc', type: 'axis',   hasOrb: false, defaultShow: false },
  天底:   { key: 'ic',         symbol: 'IC',  type: 'axis',   hasOrb: false, defaultShow: false },
};

// 元素分類
export const ELEMENT_SIGNS = {
  火象: ['牡羊座', '獅子座', '射手座'],
  土象: ['金牛座', '處女座', '魔羯座'],
  風象: ['雙子座', '天秤座', '水瓶座'],
  水象: ['巨蟹座', '天蠍座', '雙魚座'],
};

// ─────────────────────────────────────────────
// 4. 換算行星黃道絕對度數
// ─────────────────────────────────────────────
export function toAbsoluteDeg(sign, degreeNum, minuteNum) {
  const offset = SIGN_OFFSETS[sign] ?? 0;
  return offset + (degreeNum ?? 0) + (minuteNum ?? 0) / 60;
}

// ─────────────────────────────────────────────
// 5. 黃道度數轉 SVG 角度（以上升點為左側基準，逆時針）
// ─────────────────────────────────────────────
export function eclipticToSVGAngle(eclipticDeg, ascDeg) {
  // 以上升點為 180° 方向（西方），黃道逆時針排列
  return ((180 + ascDeg - eclipticDeg + 360) % 360) * (Math.PI / 180);
}

// ─────────────────────────────────────────────
// 6. SVG 角度 + 半徑 → (x, y) 座標
// ─────────────────────────────────────────────
export function polarToCartesian(cx, cy, radius, angleRad) {
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

// ─────────────────────────────────────────────
// 7. 相位判斷
//    考量 preferences 中的容許度 + 嚴謹模式
// ─────────────────────────────────────────────
export function detectAspect(deg1, deg2, preferences) {
  let diff = Math.abs(deg1 - deg2);
  if (diff > 180) diff = 360 - diff;

  const strictMode = preferences?.strictMode ?? false;
  const aspects = preferences?.aspects ?? {};

  for (const [key, def] of Object.entries(ASPECT_DEFINITIONS)) {
    const aspPref = aspects[key];
    if (!aspPref) continue;
    if (!aspPref.show) continue;

    const orb = strictMode ? def.strictOrb : (aspPref.orb ?? def.defaultOrb);
    const angleDiff = Math.abs(diff - def.angle);

    if (angleDiff <= orb) {
      return {
        key,
        name: def.name,
        symbol: def.symbol,
        color: def.color,
        strokeDasharray: def.strokeDasharray,
        orb: angleDiff,
        angle: def.angle,
      };
    }
  }
  return null;
}

// ─────────────────────────────────────────────
// 8. Equal House 宮位計算（以上升點為基準，每宮 30°）
// ─────────────────────────────────────────────
export function getHouseCusps(ascDeg) {
  return Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    eclipticDeg: (ascDeg + i * 30) % 360,
  }));
}

// ─────────────────────────────────────────────
// 9. 行星落入哪個宮位（Equal House）
// ─────────────────────────────────────────────
export function getHouseForPlanet(planetAbsDeg, ascAbsDeg) {
  const diff = ((planetAbsDeg - ascAbsDeg) + 360) % 360;
  return Math.floor(diff / 30) + 1;
}

// ─────────────────────────────────────────────
// 10. 計算所有行星對之間的相位
// ─────────────────────────────────────────────
export function calcAllAspects(planets, preferences) {
  const results = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const pA = planets[i];
      const pB = planets[j];
      const aspect = detectAspect(pA.absoluteDeg, pB.absoluteDeg, preferences);
      if (aspect) {
        results.push({ pA, pB, aspect });
      }
    }
  }
  return results;
}

// ─────────────────────────────────────────────
// 11. 計算兩人間的跨相位（合盤）
// ─────────────────────────────────────────────
export function calcCrossAspects(planetsA, planetsB, preferences) {
  const results = [];
  for (const pA of planetsA) {
    for (const pB of planetsB) {
      const aspect = detectAspect(pA.absoluteDeg, pB.absoluteDeg, preferences);
      if (aspect) results.push({ pA, pB, aspect });
    }
  }
  return results;
}

// ─────────────────────────────────────────────
// 12. 為行星列表補上 absoluteDeg
// ─────────────────────────────────────────────
export function enrichPlanetsWithAbsDeg(planets) {
  return planets.map((p) => ({
    ...p,
    absoluteDeg: toAbsoluteDeg(p.sign, p.degreeNum, p.minuteNum),
  }));
}

// ─────────────────────────────────────────────
// 13. 上升點絕對度數（從 ascendant 物件）
// ─────────────────────────────────────────────
export function ascToAbsDeg(ascendant) {
  if (!ascendant) return 0;
  return toAbsoluteDeg(ascendant.sign, ascendant.degreeNum, ascendant.minuteNum);
}

// ─────────────────────────────────────────────
// 14. 度分格式化
// ─────────────────────────────────────────────
export function formatDegMin(degreeNum, minuteNum) {
  return `${degreeNum ?? 0}°${String(minuteNum ?? 0).padStart(2, '0')}'`;
}

// ─────────────────────────────────────────────
// 15. 取得行星符號（依名稱查表）
// ─────────────────────────────────────────────
export function getPlanetSymbol(planetName) {
  return PLANET_DEFINITIONS[planetName]?.symbol ?? planetName;
}

// ─────────────────────────────────────────────
// 16. 取得星座所屬元素
// ─────────────────────────────────────────────
export function getSignElement(sign) {
  for (const [element, signs] of Object.entries(ELEMENT_SIGNS)) {
    if (signs.includes(sign)) return element;
  }
  return null;
}

// ─────────────────────────────────────────────
// 17. 預設 preferences 結構
// ─────────────────────────────────────────────
export const DEFAULT_PREFERENCES = {
  aspects: Object.fromEntries(
    Object.entries(ASPECT_DEFINITIONS).map(([key, def]) => [
      key,
      { orb: def.defaultOrb, show: def.defaultShow },
    ])
  ),
  strictMode: false,
  planetOrbs: {
    sun: 8,
    moon: 8,
    mercury: 6,
    venus: 6,
    mars: 6,
    jupiter: 5,
    saturn: 5,
  },
  planetVisibility: {
    uranus: true,
    neptune: true,
    pluto: true,
    asc: true,
    mc: true,
    chiron: false,
    ceres: false,
    pallas: false,
    juno: false,
    vesta: false,
    northNode: false,
    southNode: false,
    lilith: false,
    pof: false,
    vertex: false,
    eastPoint: false,
    dsc: false,
    ic: false,
  },
};
