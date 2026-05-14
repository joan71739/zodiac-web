// ============================================================
// ClientDetail.jsx — 客戶詳細頁（V2 修改版）
// 修改說明：
//   - Tab 1 優先顯示 NatalChartSVG 自動生成星盤
//   - 保留圖片上傳（ChartImage）顯示於生成星盤下方
//   - 載入時新增呼叫 GET /api/chart/{id}/data 與 GET /api/chart/preferences
//   - 加入 ChartSettings 設定面板
// 星盤優化 V2 — FE-9
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container, Row, Col, Card, Tabs, Tab, Button,
  Spinner, Alert, Badge,
} from 'react-bootstrap';
import axios from 'axios';

// V2 新增 imports
import NatalChartSVG  from '../components/NatalChartSVG';
import ChartSettings  from '../components/ChartSettings';
import { getChartData, getPreferences, savePreferences, resetPreferences } from '../api/chart';
import { DEFAULT_PREFERENCES } from '../utils/chartMath';

// v8 既有 components（保留）
import ChartImage        from '../components/ChartImage';
import PlanetTable       from '../components/PlanetTable';
import HouseTable        from '../components/HouseTable';
import AspectTable       from '../components/AspectTable';
import AnalysisBlock     from '../components/AnalysisBlock';
import ConsultationLog   from '../components/ConsultationLog';
import AIChatModal       from '../components/AIChatModal';

export default function ClientDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  // ── 客戶基本資訊 ─────────────────────────────
  const [client,  setClient]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // ── V2：星盤資料 + 設定 ──────────────────────
  const [chartData,    setChartData]    = useState(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [preferences,  setPreferences]  = useState(DEFAULT_PREFERENCES);
  const [selected,     setSelected]     = useState(new Set());
  const [showAI,       setShowAI]       = useState(false);

  // ── 載入客戶基本資訊 ─────────────────────────
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
          <Button variant="outline-secondary" size="sm" onClick={() => setShowAI(true)}>
            🤖 AI 解析
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultActiveKey="chart" className="mb-3" mountOnEnter>

        {/* ── Tab 1：命盤資料（V2 修改）────────── */}
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
              {/* 上升 / 天頂資訊 */}
              {chartData && (
                <Card className="mb-3 shadow-sm border-0">
                  <Card.Body style={{ fontSize: '0.85rem' }}>
                    <Row>
                      <Col xs={6}>
                        <div className="text-muted mb-1">上升點 ASC</div>
                        <div className="fw-semibold">
                          {chartData.ascendant?.sign ?? '—'}{' '}
                          {chartData.ascendant
                            ? `${chartData.ascendant.degreeNum}°${String(chartData.ascendant.minuteNum).padStart(2, '0')}'`
                            : ''}
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div className="text-muted mb-1">天頂 MC</div>
                        <div className="fw-semibold">
                          {chartData.midheaven?.sign ?? '—'}{' '}
                          {chartData.midheaven
                            ? `${chartData.midheaven.degreeNum}°${String(chartData.midheaven.minuteNum).padStart(2, '0')}'`
                            : ''}
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}

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

      {/* AI 解析 Modal */}
      <AIChatModal
        show={showAI}
        onHide={() => setShowAI(false)}
        clientId={id}
        clientName={client.name}
      />
    </Container>
  );
}
