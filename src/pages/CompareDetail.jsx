// ============================================================
// CompareDetail.jsx — 合盤詳細頁（路由：/compare/:idA/:idB）
// 星盤優化 V2 — FE-6
// 修改說明（V2-F5 fix）：
//   Promise.all → Promise.allSettled
//   synastry 失敗 → setError（顯示給用戶）
//   prefs 失敗   → 靜默降級使用 DEFAULT_PREFERENCES（不影響合盤顯示）
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Button, Spinner, Alert, Table, Badge, Card,
} from 'react-bootstrap';
import { getSynastryData, getPreferences } from '../api/chart';
import SynastrySVG from '../components/SynastrySVG';
import ChartAspectBadge from '../components/ChartAspectBadge';
import {
  enrichPlanetsWithAbsDeg,
  ascToAbsDeg,
  calcCrossAspects,
  getHouseForPlanet,
  formatDegMin,
  getPlanetSymbol,
  getSignElement,
  ELEMENT_SIGNS,
  DEFAULT_PREFERENCES,
} from '../utils/chartMath';

// ─── 排序輔助 ────────────────────────────────
// Bug fix（V2-F5）：crossAspects 的 row 結構為 { pA, pB, aspect }，
// 排序 key 需支援巢狀存取（如 'pA.planet' / 'aspect.orb'），
// 改用 accessor 函式取代字串 key，避免 a['pA.planet'] 永遠為 undefined。
function useSortableTable(initialData, initialKey, initialDir) {
  const [sortKey, setSortKey]   = useState(initialKey);
  const [sortDir, setSortDir]   = useState(initialDir); // 'asc' | 'desc'

  // 定義各 sortKey 對應的取值函式
  const ACCESSORS = {
    'pA.planet':  (row) => row.pA?.planet  ?? '',
    'pB.planet':  (row) => row.pB?.planet  ?? '',
    'aspect.orb': (row) => row.aspect?.orb ?? 0,
    'orb':        (row) => row.aspect?.orb ?? 0,  // alias
  };

  const sorted = useMemo(() => {
    if (!initialData || !sortKey) return initialData ?? [];
    const accessor = ACCESSORS[sortKey] ?? ((row) => row[sortKey]);
    return [...initialData].sort((a, b) => {
      const va = accessor(a);
      const vb = accessor(b);
      const cmp = typeof va === 'string' ? va.localeCompare(vb) : va - vb;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [initialData, sortKey, sortDir]);

  function handleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function SortIcon({ col }) {
    if (col !== sortKey) return <span className="text-muted ms-1" style={{ fontSize: '0.7rem' }}>↕</span>;
    return <span className="ms-1" style={{ fontSize: '0.7rem' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  return { sorted, handleSort, SortIcon, sortKey, sortDir };
}

export default function CompareDetail() {
  const { idA, idB } = useParams();
  const navigate      = useNavigate();

  const [synastryData, setSynastryData]   = useState(null);
  const [preferences,  setPreferences]    = useState(DEFAULT_PREFERENCES);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [outerClient, setOuterClient]     = useState('A');

  // 載入資料
  // V2-F5 fix：Promise.all → Promise.allSettled
  //   synastry 失敗 → setError（合盤資料是必需的，失敗應顯示錯誤）
  //   prefs 失敗    → 靜默降級使用 DEFAULT_PREFERENCES（設定非必需）
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      const [synResult, prefsResult] = await Promise.allSettled([
        getSynastryData(idA, idB),
        getPreferences(),
      ]);

      if (synResult.status === 'fulfilled') {
        setSynastryData(synResult.value);
      } else {
        console.warn('[CompareDetail] 合盤資料載入失敗', synResult.reason);
        setError('無法載入合盤資料，請稍後再試。');
      }

      if (prefsResult.status === 'fulfilled' && prefsResult.value) {
        setPreferences(prefsResult.value);
      } else if (prefsResult.status === 'rejected') {
        // 降級使用 DEFAULT_PREFERENCES（初始值），不影響合盤顯示
        console.warn('[CompareDetail] 偏好設定載入失敗，使用預設值', prefsResult.reason);
      }

      setLoading(false);
    })();
  }, [idA, idB]);

  // ── 行星資料 ─────────────────────────────────
  const planetsA = useMemo(
    () => enrichPlanetsWithAbsDeg(synastryData?.clientA?.planets ?? []),
    [synastryData]
  );
  const planetsB = useMemo(
    () => enrichPlanetsWithAbsDeg(synastryData?.clientB?.planets ?? []),
    [synastryData]
  );

  const ascDegA = useMemo(() => ascToAbsDeg(synastryData?.clientA?.ascendant), [synastryData]);
  const ascDegB = useMemo(() => ascToAbsDeg(synastryData?.clientB?.ascendant), [synastryData]);

  // ── 跨相位計算 ───────────────────────────────
  const crossAspects = useMemo(
    () => calcCrossAspects(planetsA, planetsB, preferences),
    [planetsA, planetsB, preferences]
  );

  const { sorted, handleSort, SortIcon } = useSortableTable(crossAspects, 'orb', 'asc');

  // ── 載入中 ───────────────────────────────────
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" size="sm" className="me-2" />
        載入合盤資料中…
      </Container>
    );
  }

  // ── 錯誤（合盤資料載入失敗） ─────────────────
  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate('/compare')}>← 返回選人頁</Button>
      </Container>
    );
  }

  const nameA = synastryData?.clientA?.name ?? 'A';
  const nameB = synastryData?.clientB?.name ?? 'B';

  // ── 共同特徵計算 ────────────────────────────
  const commonSigns = planetsA
    .filter((pA) => planetsB.some((pB) => pB.sign === pA.sign))
    .map((p) => `${p.planet}（${p.sign}）`);

  const commonDegrees = planetsA
    .flatMap((pA) =>
      planetsB
        .filter((pB) => Math.abs(pA.absoluteDeg - pB.absoluteDeg) <= 2)
        .map((pB) => `${pA.planet} ≈ ${pB.planet}（誤差 ${Math.abs(pA.absoluteDeg - pB.absoluteDeg).toFixed(1)}°）`)
    );

  const elementsA = [...new Set(planetsA.map((p) => getSignElement(p.sign)).filter(Boolean))];
  const elementsB = [...new Set(planetsB.map((p) => getSignElement(p.sign)).filter(Boolean))];
  const commonElements = elementsA.filter((el) => elementsB.includes(el));

  // ── 渲染 ─────────────────────────────────────
  return (
    <Container fluid className="py-3 px-4">
      {/* 標題 */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">
          合盤：{nameA} × {nameB}
        </h4>
        <Button variant="outline-secondary" size="sm" onClick={() => navigate('/compare')}>
          ← 返回選人頁
        </Button>
      </div>

      <Row>
        {/* ── 雙輪星盤 ─────────────────────────── */}
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center gap-3 mb-2">
                <span style={{ fontSize: '0.85rem', color: '#555' }}>外圈 / 內圈：</span>
                <Button
                  variant={outerClient === 'A' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setOuterClient('A')}
                >
                  {nameA} 外 / {nameB} 內
                </Button>
                <Button
                  variant={outerClient === 'B' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setOuterClient('B')}
                >
                  {nameB} 外 / {nameA} 內
                </Button>
              </div>
              <SynastrySVG
                synastryData={synastryData}
                preferences={preferences}
                outerClient={outerClient}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          {/* ── B 行星落入 A 宮位 ─────────────────── */}
          <Card className="border-0 shadow-sm mb-3">
            <Card.Header style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {nameB} 行星落入 {nameA} 宮位
            </Card.Header>
            <Card.Body className="p-2">
              <Table size="sm" hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>{nameB} 行星</th>
                    <th>星座 / 度數</th>
                    <th>落入 {nameA} 第幾宮</th>
                  </tr>
                </thead>
                <tbody>
                  {planetsB.map((pB) => (
                    <tr key={pB.planet}>
                      <td>{getPlanetSymbol(pB.planet)} {pB.planet}</td>
                      <td>{pB.sign} {formatDegMin(pB.degreeNum, pB.minuteNum)}</td>
                      <td>第 {getHouseForPlanet(pB.absoluteDeg, ascDegA)} 宮</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* ── 共同特徵 ──────────────────────────── */}
          <Card className="border-0 shadow-sm mb-3">
            <Card.Header style={{ fontSize: '0.9rem', fontWeight: 600 }}>共同特徵</Card.Header>
            <Card.Body style={{ fontSize: '0.85rem' }}>
              <div className="mb-2">
                <strong>同星座：</strong>
                {commonSigns.length > 0 ? commonSigns.join('、') : '無'}
              </div>
              <div className="mb-2">
                <strong>同度數（誤差≤2°）：</strong>
                {commonDegrees.length > 0 ? commonDegrees.join('、') : '無'}
              </div>
              <div>
                <strong>共同元素：</strong>
                {commonElements.length > 0
                  ? commonElements.map((el) => (
                      <Badge key={el} bg="secondary" className="me-1">{el}</Badge>
                    ))
                  : '無'}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ── 跨相位列表 ────────────────────────────── */}
      <Card className="border-0 shadow-sm">
        <Card.Header style={{ fontSize: '0.9rem', fontWeight: 600 }}>
          跨相位列表（{sorted.length} 條）
        </Card.Header>
        <Card.Body className="p-2">
          <Table size="sm" hover responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('pA.planet')}>
                  {nameA} 行星 <SortIcon col="pA.planet" />
                </th>
                <th>{nameA} 星座</th>
                <th>{nameA} 度數</th>
                <th>相位</th>
                <th>{nameB} 行星</th>
                <th>{nameB} 星座</th>
                <th>{nameB} 度數</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('orb')}>
                  Orb <SortIcon col="orb" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => (
                <tr key={i}>
                  <td>{getPlanetSymbol(row.pA.planet)} {row.pA.planet}</td>
                  <td>{row.pA.sign}</td>
                  <td>{formatDegMin(row.pA.degreeNum, row.pA.minuteNum)}</td>
                  <td><ChartAspectBadge aspect={row.aspect} /></td>
                  <td>{getPlanetSymbol(row.pB.planet)} {row.pB.planet}</td>
                  <td>{row.pB.sign}</td>
                  <td>{formatDegMin(row.pB.degreeNum, row.pB.minuteNum)}</td>
                  <td style={{ fontSize: '0.82rem', color: '#666' }}>
                    {row.aspect.orb.toFixed(2)}°
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-3">
                    無符合條件的跨相位
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
