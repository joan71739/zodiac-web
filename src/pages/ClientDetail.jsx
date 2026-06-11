// ClientDetail.jsx — 客戶詳細頁
//
// Tab 結構：
//   Tab 1 命盤資料  — 上升/天頂資訊卡 + 星盤圖片 + 行星 + 宮位 + 相位
//   Tab 2 我的解析  — 左側 AnalysisBlock + 右側 ReferencePanel（參考面板）
//   Tab 3 諮詢記錄  — ConsultationLog

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container, Row, Col, Card, Tabs, Tab, Button,
  Spinner, Alert,
} from 'react-bootstrap';
import axios from 'axios';
import { exportChart } from '../api/export';
import { signLabel } from '../utils/codeMap';

import ChartImage      from '../components/ChartImage';
import PlanetTable     from '../components/PlanetTable';
import HouseTable      from '../components/HouseTable';
import AspectTable     from '../components/AspectTable';
import AnalysisBlock   from '../components/AnalysisBlock';
import ConsultationLog from '../components/ConsultationLog';
import AIChatModal     from '../components/AIChatModal';
import ReferencePanel  from '../components/ReferencePanel';  // 新增

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client,  setClient]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [showAI,  setShowAI]  = useState(false);

  // 右側面板收合狀態（預設展開）
  const [panelOpen, setPanelOpen] = useState(true);

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

  async function handleDelete() {
    if (!window.confirm(`確定要刪除「${client?.name}」嗎？此動作無法復原。`)) return;
    try {
      await axios.delete(`/api/clients/${id}`);
      navigate('/');
    } catch (e) {
      alert('刪除失敗，請稍後再試。');
    }
  }

  async function handleExportChart() {
    try {
      await exportChart(id);
    } catch (e) {
      setError('匯出命盤失敗，請稍後再試。');
    }
  }

  function buildAiContext(c) {
    return [
      c.birthDate  && `生日：${c.birthDate}`,
      c.birthTime  && `出生時間：${c.birthTime}`,
      c.birthPlace && `出生地：${c.birthPlace}`,
      c.ascSign
        && `上升點：${signLabel(c.ascSign)} ${c.ascDegreeNum ?? 0}°${String(c.ascMinuteNum ?? 0).padStart(2, '0')}'`,
      c.mcSign
        && `天頂：${signLabel(c.mcSign)} ${c.mcDegreeNum ?? 0}°${String(c.mcMinuteNum ?? 0).padStart(2, '0')}'`,
    ].filter(Boolean).join('\n');
  }

  if (loading) return (
    <Container className="py-5 text-center">
      <Spinner animation="border" size="sm" className="me-2" />載入中…
    </Container>
  );

  if (error || !client) return (
    <Container className="py-4">
      <Alert variant="danger">{error ?? '找不到此客戶'}</Alert>
      <Button variant="secondary" onClick={() => navigate('/')}>← 返回列表</Button>
    </Container>
  );

  return (
    <Container fluid className="py-3 px-4">

      {/* 頁首 */}
      <div className="d-flex align-items-start justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-1">{client.name}</h4>
          <div className="text-muted" style={{ fontSize: '0.85rem' }}>
            {client.birthDate  && <span className="me-3">🗓 {client.birthDate}</span>}
            {client.birthTime  && <span className="me-3">⏰ {client.birthTime}</span>}
            {client.birthPlace && <span>📍 {client.birthPlace}</span>}
          </div>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary"   size="sm" as={Link} to={`/clients/${id}/edit`}>編輯</Button>
          <Button variant="outline-danger"    size="sm" onClick={handleDelete}>刪除</Button>
          <Button variant="outline-success"   size="sm" onClick={handleExportChart}>⬇ 匯出命盤</Button>
          <Button variant="outline-secondary" size="sm" onClick={() => setShowAI(true)}>🤖 AI 解析</Button>
        </div>
      </div>

      <Tabs defaultActiveKey="chart" className="mb-3" mountOnEnter>

        {/* ── Tab 1：命盤資料 ── */}
        <Tab eventKey="chart" title="命盤資料">
          <Row>
            <Col lg={7} className="mb-3">
              <Card className="mb-3">
                <Card.Body>
                  <Row>
                    <Col xs={6}>
                      <div className="text-muted mb-1">上升 ASC</div>
                      <div className="fw-semibold">
                        {client.ascSign
                          ? `${signLabel(client.ascSign)} ${client.ascDegreeNum ?? 0}°${String(client.ascMinuteNum ?? 0).padStart(2, '0')}'`
                          : '尚未設定'}
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="text-muted mb-1">天頂 MC</div>
                      <div className="fw-semibold">
                        {client.mcSign
                          ? `${signLabel(client.mcSign)} ${client.mcDegreeNum ?? 0}°${String(client.mcMinuteNum ?? 0).padStart(2, '0')}'`
                          : '尚未設定'}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <ChartImage clientId={id} />
            </Col>
            <Col lg={5} className="mb-3">
              <PlanetTable clientId={id} />
            </Col>
          </Row>
          <HouseTable clientId={id} />
          <AspectTable clientId={id} />
        </Tab>

        {/* ── Tab 2：我的解析（左右分欄）── */}
        <Tab eventKey="analysis" title="我的解析">
          <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start' }}>

            {/* 左側：解析輸入區 */}
            <div style={{ flex: 1, minWidth: 0, paddingRight: panelOpen ? 16 : 0 }}>
              <AnalysisBlock clientId={id} />
            </div>

            {/* 右側：參考面板 */}
            <div style={{
              width: panelOpen ? 340 : 32,
              flexShrink: 0,
              transition: 'width 0.2s ease',
              borderLeft: '1px solid #2D2D45',
              paddingLeft: panelOpen ? 16 : 0,
              overflow: 'hidden',
              position: 'sticky',
              top: 16,
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
            }}>
              {/* 收合按鈕 */}
              <div
                onClick={() => setPanelOpen(p => !p)}
                style={{
                  cursor: 'pointer',
                  color: '#555',
                  fontSize: '0.75rem',
                  padding: '4px 0',
                  marginBottom: panelOpen ? 8 : 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                }}
              >
                {panelOpen ? '▶ 收合參考' : '◀'}
              </div>

              {panelOpen && <ReferencePanel clientId={id} />}
            </div>
          </div>
        </Tab>

        {/* ── Tab 3：諮詢記錄 ── */}
        <Tab eventKey="log" title="諮詢記錄">
          <ConsultationLog clientId={id} />
        </Tab>

      </Tabs>

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
