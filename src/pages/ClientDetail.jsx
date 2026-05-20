// ============================================================
// ClientDetail.jsx — 客戶詳細頁（v10 規格）
//
// 修改說明：
//   - v8：命主星 Badge、AIChatModal（正確 props：noteTitle/noteContent）
//   - v9：Tab 1 顯示上升點 ASC / 天頂 MC（來源：GET /api/clients/{id}）
//   - #7 fix：exportChart import + handleExportChart + 匯出命盤按鈕
//   - #5 fix：AIChatModal props 修正（noteTitle/noteContent + buildAiContext）
//   - V2（F1～F6）：尚未開發，相關 import / state / handler 全數移除
//
// Tab 結構（規格書 v10）：
//   Tab 1 命盤資料  — 上升/天頂資訊卡 + 星盤圖片 + 行星 + 宮位 + 相位
//   Tab 2 我的解析  — AnalysisBlock
//   Tab 3 諮詢記錄  — ConsultationLog
//
// AI 諮詢觸發（頁首按鈕）：
//   noteTitle  = 客戶姓名
//   noteContent = buildAiContext(client) 組裝之基本資料摘要
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container, Row, Col, Card, Tabs, Tab, Button,
  Spinner, Alert, Badge,
} from 'react-bootstrap';
import axios from 'axios';
import { exportChart } from '../api/export';

import ChartImage      from '../components/ChartImage';
import PlanetTable     from '../components/PlanetTable';
import HouseTable      from '../components/HouseTable';
import AspectTable     from '../components/AspectTable';
import AnalysisBlock   from '../components/AnalysisBlock';
import ConsultationLog from '../components/ConsultationLog';
import AIChatModal     from '../components/AIChatModal';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client,  setClient]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [showAI,  setShowAI]  = useState(false);

  // 載入客戶基本資訊（含 ASC/MC 欄位，來源：GET /api/clients/{id}）
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

  // 刪除客戶
  async function handleDelete() {
    if (!window.confirm(`確定要刪除「${client?.name}」嗎？此動作無法復原。`)) return;
    try {
      await axios.delete(`/api/clients/${id}`);
      navigate('/');
    } catch (e) {
      alert('刪除失敗，請稍後再試。');
    }
  }

  // 匯出命盤（planets + houses + aspects）
  async function handleExportChart() {
    try {
      await exportChart(id);
    } catch (e) {
      alert('匯出命盤失敗，請稍後再試。');
    }
  }

  // 組裝 AI 背景 context
  // AIChatModal 僅接受 noteTitle / noteContent；
  // 從客戶詳細頁發起時，以基本資料摘要填入 noteContent。
  // null 欄位以 .filter(Boolean) 過濾，不產生空白行。
  function buildAiContext(c) {
    return [
      c.birthDate  && `生日：${c.birthDate}`,
      c.birthTime  && `出生時間：${c.birthTime}`,
      c.birthPlace && `出生地：${c.birthPlace}`,
      c.ascSign
        && `上升點：${c.ascSign} ${c.ascDegreeNum ?? 0}°${String(c.ascMinuteNum ?? 0).padStart(2, '0')}'`,
      c.mcSign
        && `天頂：${c.mcSign} ${c.mcDegreeNum ?? 0}°${String(c.mcMinuteNum ?? 0).padStart(2, '0')}'`,
    ]
      .filter(Boolean)
      .join('\n');
  }

  // ── 渲染 ──────────────────────────────────────
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
            {client.birthDate  && <span className="me-3">🗓 {client.birthDate}</span>}
            {client.birthTime  && <span className="me-3">⏰ {client.birthTime}</span>}
            {client.birthPlace && <span>📍 {client.birthPlace}</span>}
          </div>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Button variant="outline-primary"   size="sm" as={Link} to={`/clients/${id}/edit`}>
            編輯
          </Button>
          <Button variant="outline-danger"    size="sm" onClick={handleDelete}>
            刪除
          </Button>
          <Button variant="outline-success"   size="sm" onClick={handleExportChart}>
            ⬇ 匯出命盤
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={() => setShowAI(true)}>
            🤖 AI 解析
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultActiveKey="chart" className="mb-3" mountOnEnter>

        {/* ── Tab 1：命盤資料 ──────────────────────────────────── */}
        <Tab eventKey="chart" title="命盤資料">
          <Row>
            <Col lg={7} className="mb-3">

              {/* v9：上升點 / 天頂資訊卡（來源：GET /api/clients/{id}） */}
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

              {/* 星盤圖片（手動上傳） */}
              <ChartImage clientId={id} />
            </Col>

            <Col lg={5} className="mb-3">
              {/* 行星位置 */}
              <PlanetTable clientId={id} />
            </Col>
          </Row>

          {/* 宮位守護星 */}
          <HouseTable clientId={id} />

          {/* 重要相位 */}
          <AspectTable clientId={id} />
        </Tab>

        {/* ── Tab 2：我的解析 ──────────────────────────────────── */}
        <Tab eventKey="analysis" title="我的解析">
          <AnalysisBlock clientId={id} />
        </Tab>

        {/* ── Tab 3：諮詢記錄 ──────────────────────────────────── */}
        <Tab eventKey="log" title="諮詢記錄">
          <ConsultationLog clientId={id} />
        </Tab>

      </Tabs>

      {/* AI 諮詢 Modal（條件渲染：關閉時 unmount 自動清空 state）
          noteTitle / noteContent 對應 AIChatModal props 規格（#5 fix） */}
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
