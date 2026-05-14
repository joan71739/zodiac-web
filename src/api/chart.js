// ============================================================
// chart.js — chart 相關 API 呼叫封裝
// 星盤優化 V2
// ============================================================

import axios from 'axios';

const BASE = '/api/chart';

// ─────────────────────────────────────────────
// 單一客戶星盤聚合資料
// GET /api/chart/{clientId}/data
// ─────────────────────────────────────────────
export async function getChartData(clientId) {
  const res = await axios.get(`${BASE}/${clientId}/data`);
  return res.data;
}

// ─────────────────────────────────────────────
// 合盤雙人資料
// GET /api/chart/synastry?clientA={id}&clientB={id}
// ─────────────────────────────────────────────
export async function getSynastryData(clientAId, clientBId) {
  const res = await axios.get(`${BASE}/synastry`, {
    params: { clientA: clientAId, clientB: clientBId },
  });
  return res.data;
}

// ─────────────────────────────────────────────
// 取得全域設定
// GET /api/chart/preferences
// ─────────────────────────────────────────────
export async function getPreferences() {
  const res = await axios.get(`${BASE}/preferences`);
  return res.data;
}

// ─────────────────────────────────────────────
// 儲存設定
// PUT /api/chart/preferences
// ─────────────────────────────────────────────
export async function savePreferences(preferences) {
  const res = await axios.put(`${BASE}/preferences`, preferences);
  return res.data;
}

// ─────────────────────────────────────────────
// 還原預設設定
// POST /api/chart/preferences/reset
// ─────────────────────────────────────────────
export async function resetPreferences() {
  const res = await axios.post(`${BASE}/preferences/reset`);
  return res.data;
}
