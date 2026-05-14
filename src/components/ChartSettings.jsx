// ============================================================
// ChartSettings.jsx — 相位與行星設定面板（F3、F4）
// 星盤優化 V2 — FE-2
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  Collapse, Card, Button, Form, Table, Tab, Tabs, Badge, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import { ASPECT_DEFINITIONS, PLANET_DEFINITIONS, DEFAULT_PREFERENCES } from '../utils/chartMath';

// 主要行星（有個別容許度）
const MAJOR_PLANETS = [
  { name: '太陽', key: 'sun' },
  { name: '月亮', key: 'moon' },
  { name: '水星', key: 'mercury' },
  { name: '金星', key: 'venus' },
  { name: '火星', key: 'mars' },
  { name: '木星', key: 'jupiter' },
  { name: '土星', key: 'saturn' },
];

// 外行星 / 軸點（僅顯示開關）
const OUTER_PLANETS = [
  { name: '天王星', key: 'uranus' },
  { name: '海王星', key: 'neptune' },
  { name: '冥王星', key: 'pluto' },
  { name: '上升',   key: 'asc'    },
  { name: '天頂',   key: 'mc'     },
];

// 小天體（預設關）
const MINOR_BODIES = [
  { name: '凱龍',   key: 'chiron'     },
  { name: '穀神',   key: 'ceres'      },
  { name: '智神',   key: 'pallas'     },
  { name: '婚神',   key: 'juno'       },
  { name: '灶神',   key: 'vesta'      },
  { name: '北交',   key: 'northNode'  },
  { name: '南交',   key: 'southNode'  },
  { name: '莉莉絲', key: 'lilith'     },
  { name: '福點',   key: 'pof'        },
  { name: '宿命',   key: 'vertex'     },
  { name: '東昇',   key: 'eastPoint'  },
  { name: '下降',   key: 'dsc'        },
  { name: '天底',   key: 'ic'         },
];

// 主要相位
const MAJOR_ASPECTS = ['conjunction', 'sextile', 'square', 'trine', 'opposition'];
// 次要相位
const MINOR_ASPECTS = ['semiSextile', 'semiSquare', 'quintile', 'sesquiquadrate', 'quincunx'];

/**
 * Props:
 *  preferences   — 目前設定值（從 GET /api/chart/preferences 取得）
 *  onSave        — (updatedPrefs) => void
 *  onReset       — () => void
 */
export default function ChartSettings({ preferences, onSave, onReset }) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showMinorAspects, setShowMinorAspects] = useState(false);

  // 當外部 preferences 更新時同步到 local
  useEffect(() => {
    if (preferences) setLocal(JSON.parse(JSON.stringify(preferences)));
  }, [preferences]);

  if (!local) return null;

  // ── Aspect 更新 ─────────────────────────────
  function updateAspectOrb(key, value) {
    setLocal((prev) => ({
      ...prev,
      aspects: {
        ...prev.aspects,
        [key]: { ...prev.aspects[key], orb: parseFloat(value) || 0 },
      },
    }));
  }

  function toggleAspectShow(key) {
    setLocal((prev) => ({
      ...prev,
      aspects: {
        ...prev.aspects,
        [key]: { ...prev.aspects[key], show: !prev.aspects[key].show },
      },
    }));
  }

  function toggleStrictMode() {
    setLocal((prev) => ({ ...prev, strictMode: !prev.strictMode }));
  }

  // ── Planet Orb 更新 ──────────────────────────
  function updatePlanetOrb(key, value) {
    setLocal((prev) => ({
      ...prev,
      planetOrbs: { ...prev.planetOrbs, [key]: parseFloat(value) || 0 },
    }));
  }

  // ── Planet Visibility 更新 ───────────────────
  function togglePlanetVisibility(key) {
    setLocal((prev) => ({
      ...prev,
      planetVisibility: {
        ...prev.planetVisibility,
        [key]: !prev.planetVisibility[key],
      },
    }));
  }

  // ── 儲存 ─────────────────────────────────────
  async function handleSave() {
    setSaving(true);
    try {
      await onSave(local);
    } finally {
      setSaving(false);
    }
  }

  // ── 還原 ─────────────────────────────────────
  async function handleReset() {
    setSaving(true);
    try {
      await onReset();
    } finally {
      setSaving(false);
    }
  }

  // ── 相位表格渲染 ─────────────────────────────
  function renderAspectRows(keys) {
    return keys.map((key) => {
      const def  = ASPECT_DEFINITIONS[key];
      const pref = local.aspects[key] || { orb: def.defaultOrb, show: def.defaultShow };
      return (
        <tr key={key}>
          <td>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: def.color,
                }}
              />
              <span style={{ fontWeight: 500 }}>{def.symbol}</span>
              <span style={{ fontSize: '0.85rem' }}>{def.name}</span>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                ({def.angle}°)
              </span>
            </span>
          </td>
          <td style={{ width: 90 }}>
            <Form.Control
              type="number"
              size="sm"
              min={0}
              max={15}
              step={0.5}
              value={pref.orb}
              onChange={(e) => updateAspectOrb(key, e.target.value)}
              disabled={local.strictMode}
              style={{ width: 70 }}
            />
          </td>
          <td style={{ width: 80, textAlign: 'center' }}>
            {local.strictMode ? (
              <Badge bg="secondary">{def.strictOrb}°</Badge>
            ) : (
              <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                {def.strictOrb}°
              </span>
            )}
          </td>
          <td style={{ textAlign: 'center', width: 60 }}>
            <Form.Check
              type="switch"
              checked={pref.show}
              onChange={() => toggleAspectShow(key)}
              label=""
            />
          </td>
        </tr>
      );
    });
  }

  // ────────────────────────────────────────────
  // 渲染
  // ────────────────────────────────────────────
  return (
    <div className="mb-3">
      {/* 齒輪按鈕 */}
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => setOpen(!open)}
        aria-controls="chart-settings-panel"
        aria-expanded={open}
      >
        ⚙️ 星盤設定
        {open ? ' ▲' : ' ▼'}
      </Button>

      <Collapse in={open}>
        <div id="chart-settings-panel">
          <Card className="mt-2 border-0 shadow-sm">
            <Card.Body>
              <Tabs defaultActiveKey="aspects" className="mb-3">

                {/* ── Tab 1：相位設定 ────────────────── */}
                <Tab eventKey="aspects" title="相位設定">
                  {/* 嚴謹模式 */}
                  <div className="d-flex align-items-center gap-3 mb-3 p-2 bg-light rounded">
                    <Form.Check
                      type="switch"
                      id="strict-mode-switch"
                      label={
                        <span>
                          嚴謹模式
                          <span className="text-muted ms-2" style={{ fontSize: '0.8rem' }}>
                            （啟用後使用固定嚴謹容許度）
                          </span>
                        </span>
                      }
                      checked={local.strictMode}
                      onChange={toggleStrictMode}
                    />
                  </div>

                  {/* 主要相位 */}
                  <div className="mb-1 fw-semibold" style={{ fontSize: '0.82rem', color: '#555' }}>
                    主要相位
                  </div>
                  <Table size="sm" bordered hover className="mb-2">
                    <thead className="table-light">
                      <tr>
                        <th>相位</th>
                        <th>容許度 (°)</th>
                        <th>嚴謹容許度</th>
                        <th>顯示</th>
                      </tr>
                    </thead>
                    <tbody>{renderAspectRows(MAJOR_ASPECTS)}</tbody>
                  </Table>

                  {/* 次要相位（收合） */}
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 mb-1"
                    onClick={() => setShowMinorAspects(!showMinorAspects)}
                    style={{ fontSize: '0.82rem', color: '#666', textDecoration: 'none' }}
                  >
                    {showMinorAspects ? '▲' : '▶'} 次要相位
                  </Button>
                  <Collapse in={showMinorAspects}>
                    <div>
                      <Table size="sm" bordered hover className="mb-2">
                        <thead className="table-light">
                          <tr>
                            <th>相位</th>
                            <th>容許度 (°)</th>
                            <th>嚴謹容許度</th>
                            <th>顯示</th>
                          </tr>
                        </thead>
                        <tbody>{renderAspectRows(MINOR_ASPECTS)}</tbody>
                      </Table>
                    </div>
                  </Collapse>
                </Tab>

                {/* ── Tab 2：行星設定 ────────────────── */}
                <Tab eventKey="planets" title="行星設定">
                  {/* 主要行星 */}
                  <div className="mb-1 fw-semibold" style={{ fontSize: '0.82rem', color: '#555' }}>
                    主要行星
                  </div>
                  <Table size="sm" bordered hover className="mb-3">
                    <thead className="table-light">
                      <tr>
                        <th>行星</th>
                        <th>容許度 (°)</th>
                        <th>嚴謹容許度</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MAJOR_PLANETS.map(({ name, key }) => {
                        const def = PLANET_DEFINITIONS[name];
                        return (
                          <tr key={key}>
                            <td>
                              <span style={{ marginRight: 6 }}>{def?.symbol}</span>
                              {name}
                            </td>
                            <td style={{ width: 100 }}>
                              <Form.Control
                                type="number"
                                size="sm"
                                min={0}
                                max={15}
                                step={0.5}
                                value={local.planetOrbs?.[key] ?? def?.defaultOrb ?? 5}
                                onChange={(e) => updatePlanetOrb(key, e.target.value)}
                                disabled={local.strictMode}
                                style={{ width: 70 }}
                              />
                            </td>
                            <td style={{ width: 100 }}>
                              {local.strictMode ? (
                                <Badge bg="secondary">{def?.strictOrb ?? '-'}°</Badge>
                              ) : (
                                <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                                  {def?.strictOrb ?? '-'}°
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>

                  {/* 外行星 / 軸點 */}
                  <div className="mb-1 fw-semibold" style={{ fontSize: '0.82rem', color: '#555' }}>
                    外行星 / 軸點
                  </div>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {OUTER_PLANETS.map(({ name, key }) => {
                      const def = PLANET_DEFINITIONS[name];
                      const visible = local.planetVisibility?.[key] ?? true;
                      return (
                        <Form.Check
                          key={key}
                          type="switch"
                          id={`vis-${key}`}
                          label={`${def?.symbol ?? ''} ${name}`}
                          checked={visible}
                          onChange={() => togglePlanetVisibility(key)}
                          style={{ fontSize: '0.85rem' }}
                        />
                      );
                    })}
                  </div>

                  {/* 小天體 */}
                  <div className="mb-1 fw-semibold" style={{ fontSize: '0.82rem', color: '#555' }}>
                    小天體
                    <span className="text-muted ms-2" style={{ fontSize: '0.75rem' }}>（資料擴充後生效）</span>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {MINOR_BODIES.map(({ name, key }) => {
                      const def = PLANET_DEFINITIONS[name];
                      const visible = local.planetVisibility?.[key] ?? false;
                      return (
                        <Form.Check
                          key={key}
                          type="switch"
                          id={`vis-${key}`}
                          label={`${def?.symbol ?? ''} ${name}`}
                          checked={visible}
                          onChange={() => togglePlanetVisibility(key)}
                          style={{ fontSize: '0.85rem' }}
                          disabled
                        />
                      );
                    })}
                  </div>
                </Tab>
              </Tabs>

              {/* 操作按鈕 */}
              <div className="d-flex gap-2 mt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? '儲存中…' : '儲存設定'}
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleReset}
                  disabled={saving}
                >
                  還原預設
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Collapse>
    </div>
  );
}
