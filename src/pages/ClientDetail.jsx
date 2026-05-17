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
  useEffect(() => {
    (async () => {
      setChartLoading(true);
      try {
        const [chart, prefs] = await Promise.all([
          getChartData(id),
          getPreferences(),
        ]);
        setChartData(chart);
        if (prefs) setPreferences(prefs);
      } catch (e) {
        // 星盤資料載入失敗不阻止其他 tab 運作
        console.warn('星盤資料載入失敗', e);
      } finally {
        setChartLoading(false);
      }
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
  // 生日：1993-08-10，出生時間：08:30，出生地：台北，上升點：天秤座 22°01'，天頂：巨蟹座 22°35'
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
            {client.isLord && (
              <Badge bg="warning" text="dark" className="ms-2" style={{ fontSize: '0.75rem' }}>
                ★ 命主星
              </Badge>
            )}
          </h4>
          <div className="text-muted" style={{ fontSize: '0.85rem' }}>
            {client.birthDate && <span className="me-3">🗓 {client.birthDate}</span>}
            {client.birthTime && <span className="me-3">⏰ {client.birthTime}</span>}
            {client.birthPlace && <span>📍 {client.birthPlace}</span>}
          </div>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm" as={Link} to={`/clients/${id}/edit`}>
            編輯
          </Button>
          <Button variant="outline-danger" size="sm" onClick={handleDelete}>
            刪除
          </Button>
          {/* #7 fix：匯出命盤按鈕 */}
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

              {/* NatalChartSVG 自動生成星盤 */}
              {chartLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" size="sm" className="me-2" />
                  生成星盤中…
                </div>
              ) : chartData ? (
                <NatalChartSVG
                  chartData={chartData}
                  preferences={preferences}
                  selected={selected}
                  onPlanetClick={handlePlanetClick}
                />
              ) : (
                <Alert variant="info" className="text-center">
                  尚未有行星資料，請先在「行星位置」Tab 輸入資料後再查看星盤。
                </Alert>
              )}

              {/* 備用：圖片上傳（顯示於自動生成星盤下方） */}
              <div className="mt-3">
                <div className="text-muted mb-1" style={{ fontSize: '0.78rem' }}>
                  備用星盤圖片（手動上傳）
                </div>
                <ChartImage clientId={id} />
              </div>
            </Col>

            <Col lg={5}>
              {/*
               * v9 fix：上升 / 天頂資訊
               * 資料來源改為 GET /api/clients/{id} 回傳的 client 物件
               * 欄位為 null 時顯示「尚未設定」
               */}
              <Card className="mb-3 shadow-sm border-0">
                <Card.Body style={{ fontSize: '0.85rem' }}>
                  <Row>
                    <Col xs={6}>
                      <div className="text-muted mb-1">上升點 ASC</div>
                      <div className="fw-semibold">
                        {client.ascSign
                          ? `${client.ascSign} ${client.ascDegreeNum ?? 0}°${String(client.ascMinuteNum ?? 0).padStart(2, '0')}'`
                          : '尚未設定'}
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="text-muted mb-1">天頂 MC</div>
                      <div className="fw-semibold">
                        {client.mcSign
                          ? `${client.mcSign} ${client.mcDegreeNum ?? 0}°${String(client.mcMinuteNum ?? 0).padStart(2, '0')}'`
                          : '尚未設定'}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* 行星列表摘要 */}
              <PlanetTable clientId={id} />
            </Col>
          </Row>
        </Tab>

        {/* ── Tab 2：宮位守護星 ──────────────── */}
        <Tab eventKey="houses" title="宮位守護星">
          <HouseTable clientId={id} />
        </Tab>

        {/* ── Tab 3：重要相位 ────────────────── */}
        <Tab eventKey="aspects" title="重要相位">
          <AspectTable clientId={id} />
        </Tab>

        {/* ── Tab 4：解析筆記 ────────────────── */}
        <Tab eventKey="notes" title="解析筆記">
          <AnalysisBlock clientId={id} />
        </Tab>

        {/* ── Tab 5：諮詢記錄 ────────────────── */}
        <Tab eventKey="logs" title="諮詢記錄">
          <ConsultationLog clientId={id} />
        </Tab>
      </Tabs>

      {/*
       * AI 解析 Modal
       * #5 fix：原本錯誤傳入 clientId / clientName（AIChatModal 未定義的 props，
       *         React 靜默忽略），導致 AI 拿不到任何客戶背景。
       *         修正：noteTitle = 客戶姓名，noteContent = 生日/出生地/ASC/MC 摘要，
       *         讓 AI system prompt 的「當前解析背景」欄位有意義的客戶資訊。
       */}
      <AIChatModal
        show={showAI}
        onHide={() => setShowAI(false)}
        noteTitle={client.name}
        noteContent={buildAiContext(client)}
      />
    </Container>
  );
}