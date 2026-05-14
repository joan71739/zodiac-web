// ============================================================
// CompareSelect.jsx — 合盤選人頁（路由：/compare）
// 星盤優化 V2 — FE-5
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, ListGroup, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

export default function CompareSelect() {
  const navigate = useNavigate();

  const [clients, setClients]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [searchA, setSearchA]   = useState('');
  const [searchB, setSearchB]   = useState('');
  const [selectedA, setSelectedA] = useState(null);
  const [selectedB, setSelectedB] = useState(null);
  const [openA, setOpenA]       = useState(false);
  const [openB, setOpenB]       = useState(false);

  // 載入全部客戶
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/clients');
        setClients(res.data ?? []);
      } catch (e) {
        setError('無法載入客戶清單，請確認後端連線。');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 模糊搜尋
  function filterClients(query) {
    if (!query.trim()) return clients;
    return clients.filter((c) =>
      c.name?.includes(query.trim())
    );
  }

  const filteredA = useMemo(() => filterClients(searchA), [searchA, clients]);
  const filteredB = useMemo(() => filterClients(searchB), [searchB, clients]);

  function selectA(client) {
    setSelectedA(client);
    setSearchA(client.name);
    setOpenA(false);
  }

  function selectB(client) {
    setSelectedB(client);
    setSearchB(client.name);
    setOpenB(false);
  }

  function handleCompare() {
    if (selectedA && selectedB) {
      navigate(`/compare/${selectedA.id}/${selectedB.id}`);
    }
  }

  const canCompare = selectedA && selectedB && selectedA.id !== selectedB.id;

  // ── 下拉選人欄位 ─────────────────────────────
  function ClientPicker({ label, search, setSearch, selected, onSelect, open, setOpen, disabledId }) {
    return (
      <Card className="h-100 shadow-sm border-0">
        <Card.Header className="fw-semibold bg-light py-2">
          {label}
        </Card.Header>
        <Card.Body>
          <Form.Control
            placeholder="搜尋客戶姓名…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
              if (selected && e.target.value !== selected.name) {
                onSelect(null);
              }
            }}
            onFocus={() => setOpen(true)}
          />

          {open && search.length >= 0 && (
            <ListGroup
              className="mt-1 border rounded"
              style={{ maxHeight: 260, overflowY: 'auto', position: 'absolute', zIndex: 1000, width: 'calc(100% - 2.8rem)' }}
            >
              {filterClients(search).length === 0 ? (
                <ListGroup.Item className="text-muted" style={{ fontSize: '0.85rem' }}>
                  找不到符合的客戶
                </ListGroup.Item>
              ) : (
                filterClients(search).map((c) => {
                  const isDisabled = c.id === disabledId;
                  return (
                    <ListGroup.Item
                      key={c.id}
                      action
                      active={selected?.id === c.id}
                      disabled={isDisabled}
                      onClick={() => !isDisabled && onSelect(c)}
                      style={{ fontSize: '0.88rem', cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                    >
                      <span style={{ fontWeight: 500 }}>{c.name}</span>
                      <span className="text-muted ms-2" style={{ fontSize: '0.8rem' }}>
                        {c.birthDate ?? ''}
                      </span>
                      {isDisabled && (
                        <span className="badge bg-secondary ms-2" style={{ fontSize: '0.72rem' }}>
                          已選
                        </span>
                      )}
                    </ListGroup.Item>
                  );
                })
              )}
            </ListGroup>
          )}

          {selected && (
            <div className="mt-3 p-2 bg-light rounded d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-semibold">{selected.name}</div>
                <div className="text-muted" style={{ fontSize: '0.82rem' }}>
                  {selected.birthDate ?? ''}
                  {selected.birthTime ? ` ${selected.birthTime}` : ''}
                  {selected.birthPlace ? `　${selected.birthPlace}` : ''}
                </div>
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => { onSelect(null); setSearch(''); setOpen(true); }}
              >
                ✕
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  }

  // ────────────────────────────────────────────
  // 渲染
  // ────────────────────────────────────────────
  return (
    <Container className="py-4" onClick={() => { setOpenA(false); setOpenB(false); }}>
      <h4 className="mb-1">合盤比較</h4>
      <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
        選擇兩位客戶，查看跨相位與共同特徵
      </p>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" size="sm" className="me-2" />
          載入客戶清單中…
        </div>
      ) : (
        <>
          <Row className="g-4 mb-4">
            <Col md={6} onClick={(e) => { e.stopPropagation(); setOpenB(false); }}>
              <ClientPicker
                label="第一人（外圈）"
                search={searchA}
                setSearch={setSearchA}
                selected={selectedA}
                onSelect={selectA}
                open={openA}
                setOpen={setOpenA}
                disabledId={selectedB?.id}
              />
            </Col>
            <Col md={6} onClick={(e) => { e.stopPropagation(); setOpenA(false); }}>
              <ClientPicker
                label="第二人（內圈）"
                search={searchB}
                setSearch={setSearchB}
                selected={selectedB}
                onSelect={selectB}
                open={openB}
                setOpen={setOpenB}
                disabledId={selectedA?.id}
              />
            </Col>
          </Row>

          <div className="text-center">
            {!canCompare && selectedA && selectedB && (
              <p className="text-danger mb-2" style={{ fontSize: '0.85rem' }}>
                兩人不可為同一位客戶
              </p>
            )}
            <Button
              variant="primary"
              size="lg"
              disabled={!canCompare}
              onClick={handleCompare}
              style={{ minWidth: 160 }}
            >
              開始比較
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}
