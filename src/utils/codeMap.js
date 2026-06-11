// src/utils/codeMap.js
// 與後端 code_references 表、schema.sql 完全對齊
// category: planet / sign / aspect

// ─── 行星 ────────────────────────────────────────────────
export const PLANET_CODE_MAP = {
  Q: '太陽',
  W: '月亮',
  E: '水星',
  R: '金星',
  T: '火星',
  Y: '木星',
  U: '土星',
  I: '天王星',
  O: '海王星',
  P: '冥王星',
  '‹': '北交點',
  Z: 'ASC',
  X: 'MC',
}

// ─── 星座 ────────────────────────────────────────────────
export const SIGN_CODE_MAP = {
  a: '牡羊座',
  s: '金牛座',
  d: '雙子座',
  f: '巨蟹座',
  g: '獅子座',
  h: '處女座',
  j: '天秤座',
  k: '天蠍座',
  l: '射手座',
  z: '摩羯座',
  x: '水瓶座',
  c: '雙魚座',
}

// ─── 相位 ────────────────────────────────────────────────
export const ASPECT_CODE_MAP = {
  q: '合相',
  t: '六分相',
  r: '四分相',
  e: '三分相',
  w: '對分相',
}

// ─── 反查 map（中文 → 代碼） ─────────────────────────────
export const PLANET_NAME_TO_CODE = Object.fromEntries(
  Object.entries(PLANET_CODE_MAP).map(([code, name]) => [name, code])
)

export const SIGN_NAME_TO_CODE = Object.fromEntries(
  Object.entries(SIGN_CODE_MAP).map(([code, name]) => [name, code])
)

export const ASPECT_NAME_TO_CODE = Object.fromEntries(
  Object.entries(ASPECT_CODE_MAP).map(([code, name]) => [name, code])
)

// ─── 供 Select 下拉用的陣列（{ code, label }） ───────────

/** 行星選項（不含 ASC / MC / 北交點，僅命盤行星） */
export const PLANET_OPTIONS = [
  { code: 'Q', label: '太陽' },
  { code: 'W', label: '月亮' },
  { code: 'E', label: '水星' },
  { code: 'R', label: '金星' },
  { code: 'T', label: '火星' },
  { code: 'Y', label: '木星' },
  { code: 'U', label: '土星' },
  { code: 'I', label: '天王星' },
  { code: 'O', label: '海王星' },
  { code: 'P', label: '冥王星' },
]

/** 外行星選項（行運解析用：木星～冥王星） */
export const OUTER_PLANET_OPTIONS = [
  { code: 'Y', label: '木星' },
  { code: 'U', label: '土星' },
  { code: 'I', label: '天王星' },
  { code: 'O', label: '海王星' },
  { code: 'P', label: '冥王星' },
]

/** 個人行星選項（行運解析本命星用：太陽～火星） */
export const PERSONAL_PLANET_OPTIONS = [
  { code: 'Q', label: '太陽' },
  { code: 'W', label: '月亮' },
  { code: 'E', label: '水星' },
  { code: 'R', label: '金星' },
  { code: 'T', label: '火星' },
]

/** 元素解析行星選項（第一批七顆） */
export const PLANET_7_OPTIONS = [
  { code: 'Q', label: '太陽' },
  { code: 'W', label: '月亮' },
  { code: 'E', label: '水星' },
  { code: 'R', label: '金星' },
  { code: 'T', label: '火星' },
  { code: 'Y', label: '木星' },
  { code: 'U', label: '土星' },
]

/** 星座選項 */
export const SIGN_OPTIONS = [
  { code: 'a', label: '牡羊座' },
  { code: 's', label: '金牛座' },
  { code: 'd', label: '雙子座' },
  { code: 'f', label: '巨蟹座' },
  { code: 'g', label: '獅子座' },
  { code: 'h', label: '處女座' },
  { code: 'j', label: '天秤座' },
  { code: 'k', label: '天蠍座' },
  { code: 'l', label: '射手座' },
  { code: 'z', label: '摩羯座' },
  { code: 'x', label: '水瓶座' },
  { code: 'c', label: '雙魚座' },
]

/** 相位選項（含占星符號） */
export const ASPECT_OPTIONS = [
  { code: 'q', label: '☌ 合相（0°）' },
  { code: 't', label: '✱ 六分相（60°）' },
  { code: 'r', label: '☐ 四分相（90°）' },
  { code: 'e', label: '△ 三分相（120°）' },
  { code: 'w', label: '☍ 對分相（180°）' },
]

/** 相位選項（純文字，Navbar 行運選單用） */
export const ASPECT_SIMPLE_OPTIONS = [
  { code: 'q', label: '合相' },
  { code: 'w', label: '對分相' },
  { code: 'e', label: '三分相' },
  { code: 'r', label: '四分相' },
  { code: 't', label: '六分相' },
]

/** 宮位選項（數字 + 中文，表單 Select 用） */
export const HOUSE_OPTIONS = [
  { num: 1,  label: '一宮'   }, { num: 2,  label: '二宮'   },
  { num: 3,  label: '三宮'   }, { num: 4,  label: '四宮'   },
  { num: 5,  label: '五宮'   }, { num: 6,  label: '六宮'   },
  { num: 7,  label: '七宮'   }, { num: 8,  label: '八宮'   },
  { num: 9,  label: '九宮'   }, { num: 10, label: '十宮'   },
  { num: 11, label: '十一宮' }, { num: 12, label: '十二宮' },
]

/** 宮位數字 → 中文（ReferencePanel、TransitHouseNotes 等顯示用） */
export const HOUSE_NUM_LABEL_MAP = {
  1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六',
  7: '七', 8: '八', 9: '九', 10: '十', 11: '十一', 12: '十二',
}

/** 行星占星符號（ReferencePanel 顯示用） */
export const PLANET_SYMBOL_MAP = {
  Q: '☉', W: '☽', E: '☿', R: '♀', T: '♂',
  Y: '♃', U: '♄', I: '♅', O: '♆', P: '♇',
}

/** 主題分類選項（對應 code_references category='topic'） */
export const TOPIC_OPTIONS = [
  { code: 'general',   label: '核心特質／本質' },
  { code: 'career',    label: '事業／職場／天賦' },
  { code: 'love',      label: '感情／婚姻／人際' },
  { code: 'wealth',    label: '金錢／財運／自我價值' },
  { code: 'challenge', label: '盲點／危機／課題' },
]

export const TOPIC_CODE_MAP = {
  general:   '核心特質／本質',
  career:    '事業／職場／天賦',
  love:      '感情／婚姻／人際',
  wealth:    '金錢／財運／自我價值',
  challenge: '盲點／危機／課題',
}

// ─── 轉換工具函式 ────────────────────────────────────────

/** 代碼 → 中文，找不到時 fallback 顯示原始值 */
export const planetLabel  = (code) => PLANET_CODE_MAP[code]  ?? code
export const signLabel    = (code) => SIGN_CODE_MAP[code]    ?? code
export const aspectLabel  = (code) => ASPECT_CODE_MAP[code]  ?? code
export const topicLabel   = (code) => TOPIC_CODE_MAP[code]   ?? code

/** 宮位數字 → 中文宮名（例：10 → '十宮'） */
export const houseLabel = (num) =>
  HOUSE_NUM_LABEL_MAP[num] != null ? `${HOUSE_NUM_LABEL_MAP[num]}宮` : `${num}宮`

/** 相位完整標籤（含符號），找不到時 fallback */
export const aspectFullLabel = (code) =>
  ASPECT_OPTIONS.find(o => o.code === code)?.label ?? code
