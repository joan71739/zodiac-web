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
export const topicLabel = (code) => TOPIC_CODE_MAP[code] ?? code

/** 相位完整標籤（含符號），找不到時 fallback */
export const aspectFullLabel = (code) =>
  ASPECT_OPTIONS.find(o => o.code === code)?.label ?? code

