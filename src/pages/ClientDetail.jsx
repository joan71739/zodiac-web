// ============================================================
// ClientDetail.jsx — 客戶詳細頁（V2 修改版）
// 修改說明：
//   - Tab 1 優先顯示 NatalChartSVG 自動生成星盤
//   - 保留圖片上傳（ChartImage）顯示於生成星盤下方
//   - 載入時新增呼叫 GET /api/chart/{id}/data 與 GET /api/chart/preferences
//   - 加入 ChartSettings 設定面板
//   - v9 fix：ASC/MC 改由 GET /api/clients/{id} 的 client 物件取得，
//             不再依賴 V2 chartData（避免 V2 端點未就緒時資訊消失）
//   - #7 fix：補上 exportChart import + handleExportChart + 匯出命盤按鈕
//   - #5 fix：AIChatModal 在 ClientDetail 呼叫時 props 錯誤（clientId/clientName
//             皆為 AIChatModal 未定義的 prop，靜默忽略），
//             改用正確的 noteTitle/noteContent 並傳入客戶基本資料作為 AI 背景 context
//   - V2-F5 fix：Promise.all → Promise.allSettled，任一失敗不影響另一個請求；
//               新增 chartError state，載入失敗時顯示 Alert（非靜默 console.warn）
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container, Row, Col, Card, Tabs, Tab, Button,
  Spinner, Alert, Badge,
} from 'react-bootstrap';
import axios from 'axios';
import { exportChart } from '../api/export';

// V2 新增 imports
import NatalChartSVG from '../components/NatalChartSVG';
import ChartSettings from '../components/ChartSettings';
import { getChartData, getPreferences, savePreferences, resetPreferences } from '../api/chart';
import { DEFAULT_PREFERENCES } from '../utils/chartMath';

// v8 既有 components（保留）
import ChartImage from '../components/ChartImage';
import PlanetTable from '../components/PlanetTable';
import HouseTable from '../components/HouseTable';
import AspectTable from '../components/AspectTable';
import AnalysisBlock from '../components/AnalysisBlock';
import ConsultationLog from '../components/ConsultationLog';
import AIChatModal from '../components/AIChatModal';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ── 客戶基本資訊（含 v9 ASC/MC 欄位）────────
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── V2：星盤資料 + 設定 ──────────────────────
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(false);
  // V2-F5 fix：新增 chartError，失敗時顯示 Alert 而非靜默 console.warn
  const [chartError, setChartError] = useState(null);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [selected, setSelected] = useState(new Set());
  const [showAI, setShowAI] = useState(false);

  // ── 載入客戶基本資訊（v9 ASC/MC 隨此一起回傳）
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/api/clients/${id}`);
        setClient(res.data);
      } catch (e) {
        setError('無法載入客戶資料');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ── V2：載入星盤聚合資料 + 全域設定 ──────────
  // Bug fix（V2-F5）：
  //   原本 Promise.all 語意：任一 reject → 整個 Promise reject → 兩者皆丟失。
  //   改為 Promise.allSettled：每個請求獨立處理，互不影響。
  //   getChartData 失敗 → chartError 顯示 Alert，星盤 tab 有錯誤提示。
  //   getPreferences 失敗 → 靜默降級使用 DEFAULT_PREFERENCES，其他 tab 不受影響。
  useEffect(() => {
    (async () => {
      setChartLoading(true);
      setChartError(null);

      const [chartResult, prefsResult] = await Promise.allSettled([
        getChartData(id),
        getPreferences(),
      ]);

      if (chartResult.status === 'fulfilled') {
        setChartData(chartResult.value);
      } else {
        console.warn('[ClientDetail] 星盤資料載入失敗', chartResult.reason);
        setChartError('星盤資料載入失敗，請重新整理頁面，或確認後端服務是否正常。');
      }

      if (prefsResult.status === 'fulfilled' && prefsResult.value) {
        setPreferences(prefsResult.value);
      } else if (prefsResult.status === 'rejected') {
        // 設定載入失敗：靜默降級，使用前端 DEFAULT_PREFERENCES，不阻斷其他功能
        console.warn('[ClientDetail] 偏好設定載入失敗，使用預設值', prefsResult.reason);
      }

      setChartLoading(false);
    })();
  }, [id]);

  // ── 行星點擊（多選 / 清除） ───────────────────
  const handlePlanetClick = useCallback((planetName) => {
    if (planetName === '__clear__') {
      setSelected(new Set());
      return;
    }
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(planetName)) next.delete(planetName);
      else next.add(planetName);
      return next;
    });
  }, []);

  // ── 設定儲存 / 還原 ──────────────────────────
  async function handleSavePrefs(updatedPrefs) {
    const saved = await savePreferences(updatedPrefs);
    setPreferences(saved ?? updatedPrefs);
  }

  async function handleResetPrefs() {
    const defaultPrefs = await resetPreferences();
    setPreferences(defaultPrefs ?? DEFAULT_PREFERENCES);
  }

  // ── 刪除客戶 ─────────────────────────────────
  async function handleDelete() {
    if (!window.confirm(`確定要刪除「${client?.name}」嗎？此動作無法復原。`)) return;
    try {
      await axios.delete(`/api/clients/${id}`);
      navigate('/');
    } catch (e) {
      alert('刪除失敗，請稍後再試。');
    }
  }

  // ── 匯出命盤（#7 fix）────────────────────────
  async function handleExportChart() {
    try {
      await exportChart(id);
    } catch (e) {
      alert('匯出命盤失敗，請稍後再試。');
    }
  }

  // ── AI 背景 context 組裝（#5 fix）────────────
  // AIChatModal 的 prop 是 noteTitle / noteContent，
  // 從 ClientDetail 發起時以客戶基本資料作為背景 context，
  // 傳入後端 buildSystemPrompt() 的「當前解析背景」欄位，
  // 讓 AI 能正確識別正在討論哪位客戶的命盤。
  const buildAiContext = (c) => {
    return [
      c.birthDate && `生日：${c.birthDate}`,
      c.birthTime && `出生時間：${c.birthTime}`,
      c.birthPlace && `出生地：${c.birthPlace}`,
      c.ascSign
      && `上升點：${c.ascSign} ${c.ascDegreeNum ?? 0}°${String(c.ascMinuteNum ?? 0).padStart(2, '0')}'`,
      c.mcSign
      && `天頂：${c.mcSign} ${c.mcDegreeNum ?? 0}°${String(c.mcMinuteNum ?? 0).padStart(2, '0')}'`,
    ].filter(Boolean).join('，');
  };

  // ────────────────────────────────────────────
  // 渲染
  // ────────────────────────────────────────────
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" size="sm" className="me-2" />
        載入中…
      </Container>
    );
  }

  if (error || !client) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error ?? '找不到此客戶'}</Alert>
        <Button variant="secondary" onClick={() => navigate('/')}>← 返回列表</Button>
      </Container>
    );
  }

  return (
    <Container fluid className="py-3 px-4">
      {/* 頁首：客戶資訊列 */}
      <div className="d-flex align-items-start justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-1">
            {client.name}
          </h4>
          <div className="text-muted" style={{ fontSize: '0.85rem' }}>
            {client.birthDate && <span className="me-3">🗓 {client.birthDate}</span>}
            {client.birthTime && <span className="me-3">⏰ {client.birthTime}</span>}
            {client.birthPlace && <span>📍 {client.birthPlace}</span>}
          </div>
          {/* v9：ASC / MC 顯示 */}
          {(client.ascSign || client.mcSign) && (
            <div className="text-muted mt-1" style={{ fontSize: '0.82rem' }}>
              {client.ascSign
                ? `上升：${client.ascSign} ${client.ascDegreeNum ?? 0}°${String(client.ascMinuteNum ?? 0).padStart(2, '0')}'`
                : '上升：尚未設定'}
              <span className="mx-3">|</span>
              {client.mcSign
                ? `天頂：${client.mcSign} ${client.mcDegreeNum ?? 0}°${String(client.mcMinuteNum ?? 0).padStart(2, '0')}'`
                : '天頂：尚未設定'}
            </div>
          )}
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Button variant="outline-primary" size="sm" as={Link} to={`/clients/${id}/edit`}>
            編輯
          </Button>
          <Button variant="outline-danger" size="sm" onClick={handleDelete}>
            刪除
          </Button>
          <Button variant="outline-success" size="sm" onClick={handleExportChart}>
            ⬇ 匯出命盤
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={() => setShowAI(true)}>
            🤖 AI 解析
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultActiveKey="chart" className="mb-3" mountOnEnter>

        {/* ── Tab 1：命盤資料 ───────────────────── */}
        <Tab eventKey="chart" title="命盤資料">
          <Row>
            <Col lg={7} className="mb-3">
              {/* ChartSettings 設定面板 */}
              <ChartSettings
                preferences={preferences}
                onSave={handleSavePrefs}
                onReset={handleResetPrefs}
              />

              {/* 星盤區塊：載入中 / 錯誤 / 正常顯示 */}
              {chartLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" size="sm" className="me-2" />
                  生成星盤中…
                </div>
              ) : chartError ? (
                // V2-F5 fix：星盤載入失敗時顯示 Alert，其他 tab 功能不受影響
                <Alert variant="warning" className="mb-3">
                  <Alert.Heading style={{ fontSize: '0.95rem' }}>⚠️ 星盤資料載入失敗</Alert.Heading>
                  <p className="mb-2" style={{ fontSize: '0.85rem' }}>{chartError}</p>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => {
                      setChartError(null);
                      setChartLoading(true);
                      Promise.allSettled([getChartData(id), getPreferences()]).then(
                        ([chartResult, prefsResult]) => {
                          if (chartResult.status === 'fulfilled') setChartData(chartResult.value);
                          else setChartError('星盤資料載入失敗，請確認後端服務是否正常。');
                          if (prefsResult.status === 'fulfilled' && prefsResult.value)
                            setPreferences(prefsResult.value);
                          setChartLoading(false);
                        }
                      );
                    }}
                  >
                    重新載入
                  </Button>
                </Alert>
              ) : chartData ? (
                <NatalChartSVG
                  chartData={chartData}
                  preferences={preferences}
                  selectedPlanets={selected}
                  onPlanetClick={handlePlanetClick}
                />
              ) : null}

              {/* 星盤圖片（備用，V2 自動生成星盤下方） */}
              <div className="mt-3">
                <ChartImage clientId={id} />
              </div>
            </Col>

            <Col lg={5} className="mb-3">
              {/* 行星位置 */}
              <PlanetTable clientId={id} />
            </Col>
          </Row>

          {/* 宮位守護星 */}
          <HouseTable clientId={id} />

          {/* 相位 */}
          <AspectTable clientId={id} />
        </Tab>

        {/* ── Tab 2：我的解析 ──────────────────── */}
        <Tab eventKey="analysis" title="我的解析">
          <AnalysisBlock clientId={id} client={client} />
        </Tab>

        {/* ── Tab 3：諮詢記錄 ─────────────────── */}
        <Tab eventKey="log" title="諮詢記錄">
          <ConsultationLog clientId={id} />
        </Tab>
      </Tabs>

      {/* AI 對話 Modal（#5 fix：用 noteTitle/noteContent props） */}
      {showAI && (
        <AIChatModal
          show={showAI}
          onHide={() => setShowAI(false)}
          noteTitle={client.name}
          noteContent={buildAiContext(client)}
        />
      )}
    </Container>
  );
}
