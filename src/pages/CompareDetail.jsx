// ============================================================
// CompareDetail.jsx — 合盤詳細頁（路由：/compare/:idA/:idB）
// 星盤優化 V2 — FE-6
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
function useSortableTable(initialData, initialKey, initialDir) {
  const [sortKey, setSortKey]   = useState(initialKey);
  const [sortDir, setSortDir]   = useState(initialDir); // 'asc' | 'desc'

  const sorted = useMemo(() => {
    if (!initialData || !sortKey) return initialData ?? [];
    return [...initialData].sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (typeof va === 'string') va = va.localeCompare(vb);
      else va = va - vb;
      return sortDir === 'asc' ? va : -va;
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
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [syn, prefs] = await Promise.all([
          getSynastryData(idA, idB),
          getPreferences(),
        ]);
        setSynastryData(syn);
        setPreferences(prefs ?? DEFAULT_PREFERENCES);
      } catch (e) {
        setError('無法載入合盤資料，請稍後再試。');
      } finally {
        setLoading(false);
      }
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

  // 上升絕對度數（A）
  const ascADeg = useMemo(
    () => ascToAbsDeg(synastryData?.clientA?.ascendant),
    [synastryData]
  );

  // ── 第一區塊：B 的行星落入 A 的宮位 ──────────
  const bInAHouses = useMemo(() => {
    return planetsB.map((pB) => ({
      planet:  pB.planet,
      sign:    pB.sign,
      degree:  pB.degreeNum,
      minute:  pB.minuteNum,
      house:   getHouseForPlanet(pB.absoluteDeg, ascADeg),
      absDeg:  pB.absoluteDeg,
    }));
  }, [planetsB, ascADeg]);

  // ── 第二區塊：共同特徵 ───────────────────────
  const sharedSign = useMemo(() => {
    const results = [];
    for (const pA of planetsA) {
      for (const pB of planetsB) {
        if (pA.sign === pB.sign) {
          results.push({ pA, pB });
        }
      }
    }
    return results;
  }, [planetsA, planetsB]);

  const sharedDegree = useMemo(() => {
    const results = [];
    for (const pA of planetsA) {
      for (const pB of planetsB) {
        if (Math.abs(pA.degreeNum - pB.degreeNum) <= 2) {
          results.push({ pA, pB, diff: Math.abs(pA.degreeNum - pB.degreeNum) });
        }
      }
    }
    return results;
  }, [planetsA, planetsB]);

  const sharedElement = useMemo(() => {
    const elementMap = {};
    const getEl = (sign) => getSignElement(sign);
    for (const pA of planetsA) {
      const el = getEl(pA.sign);
      if (el) {
        if (!elementMap[el]) elementMap[el] = { A: [], B: [] };
        elementMap[el].A.push(pA);
      }
    }
    for (const pB of planetsB) {
      const el = getEl(pB.sign);
      if (el && elementMap[el]) {
        elementMap[el].B.push(pB);
      }
    }
    return Object.entries(elementMap)
      .filter(([, { A, B }]) => A.length > 0 && B.length > 0)
      .map(([element, { A, B }]) => ({ element, A, B }));
  }, [planetsA, planetsB]);

  // ── 第三區塊：跨相位列表 ─────────────────────
  const rawCrossAspects = useMemo(
    () => calcCrossAspects(planetsA, planetsB, preferences),
    [planetsA, planetsB, preferences]
  );

  // 整理為表格用資料
  const aspectRows = useMemo(() =>
    rawCrossAspects.map(({ pA, pB, aspect }) => ({
      planetA:  pA.planet,
      signA:    pA.sign,
      degreeA:  pA.absoluteDeg,
      degStrA:  formatDegMin(pA.degreeNum, pA.minuteNum),
      planetB:  pB.planet,
      signB:    pB.sign,
      degreeB:  pB.absoluteDeg,
      degStrB:  formatDegMin(pB.degreeNum, pB.minuteNum),
      aspectKey: aspect.key,
      orb:       aspect.orb,
    })),
    [rawCrossAspects]
  );

  const { sorted: sortedAspects, handleSort, SortIcon } = useSortableTable(
    aspectRows, 'orb', 'asc'
  );

  const nameA = synastryData?.clientA?.name ?? '第一人';
  const nameB = synastryData?.clientB?.name ?? '第二人';

  // ────────────────────────────────────────────
  // 渲染
  // ────────────────────────────────────────────
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" size="sm" className="me-2" />
        載入合盤資料中…
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate('/compare')}>← 返回</Button>
      </Container>
    );
  }

  return (
    <Container fluid className="py-3 px-4">
      {/* 頁首 */}
      <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
        <Button variant="outline-secondary" size="sm" onClick={() => navigate('/compare')}>
          ← 返回選人
        </Button>
        <h5 className="mb-0">
          <span style={{ color: '#8B6914' }}>{nameA}</span>
          <span className="text-muted mx-2">⇄</span>
          <span style={{ color: '#1A3A6B' }}>{nameB}</span>
        </h5>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setOuterClient((c) => (c === 'A' ? 'B' : 'A'))}
        >
          切換內外圈
        </Button>
        <span className="text-muted" style={{ fontSize: '0.82rem' }}>
          目前外圈：<strong>{outerClient === 'A' ? nameA : nameB}</strong>
        </span>
      </div>

      <Row>
        {/* 左側：雙輪星盤 */}
        <Col lg={5} className="mb-4">
          <SynastrySVG
            synastryData={synastryData}
            preferences={preferences}
            outerClient={outerClient}
          />
        </Col>

        {/* 右側：分析區塊 */}
        <Col lg={7}>
          {/* 第一區塊：B 的行星落入 A 的宮位 */}
          <Card className="mb-3 shadow-sm border-0">
            <Card.Header className="fw-semibold bg-light">
              【第一區塊】{nameB} 的行星落入 {nameA} 的宮位
            </Card.Header>
            <Card.Body className="p-0">
              <Table size="sm" bordered hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>{nameB} 行星</th>
                    <th>星座 / 度數</th>
                    <th>落入 {nameA} 宮位</th>
                  </tr>
                </thead>
                <tbody>
                  {bInAHouses.map((row) => (
                    <tr key={row.planet}>
                      <td>
                        <span style={{ marginRight: 4 }}>{getPlanetSymbol(row.planet)}</span>
                        {row.planet}
                      </td>
                      <td>
                        {row.sign} {formatDegMin(row.degree, row.minute)}
                      </td>
                      <td>
                        <Badge bg="secondary">第 {row.house} 宮</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* 第二區塊：共同特徵 */}
          <Card className="mb-3 shadow-sm border-0">
            <Card.Header className="fw-semibold bg-light">
              【第二區塊】共同特徵
            </Card.Header>
            <Card.Body>
              {/* A. 同星座 */}
              <div className="mb-2">
                <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>A. 同星座</span>
                {sharedSign.length === 0 ? (
                  <span className="text-muted ms-2" style={{ fontSize: '0.82rem' }}>無</span>
                ) : (
                  <ul className="mb-0 mt-1" style={{ fontSize: '0.83rem', paddingLeft: '1.2rem' }}>
                    {sharedSign.map(({ pA, pB }, i) => (
                      <li key={i}>
                        {nameA} {getPlanetSymbol(pA.planet)}{pA.planet}（{pA.sign}）× {nameB} {getPlanetSymbol(pB.planet)}{pB.planet}（{pB.sign}）
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* B. 同度數 */}
              <div className="mb-2">
                <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>B. 同度數（誤差 ≤ 2°）</span>
                {sharedDegree.length === 0 ? (
                  <span className="text-muted ms-2" style={{ fontSize: '0.82rem' }}>無</span>
                ) : (
                  <ul className="mb-0 mt-1" style={{ fontSize: '0.83rem', paddingLeft: '1.2rem' }}>
                    {sharedDegree.map(({ pA, pB, diff }, i) => (
                      <li key={i}>
                        {nameA} {getPlanetSymbol(pA.planet)}{pA.planet}（{pA.sign} {pA.degreeNum}°）≈ {nameB} {getPlanetSymbol(pB.planet)}{pB.planet}（{pB.sign} {pB.degreeNum}°）差 {diff}°
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* C. 同元素 */}
              <div>
                <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>C. 同元素</span>
                {sharedElement.length === 0 ? (
                  <span className="text-muted ms-2" style={{ fontSize: '0.82rem' }}>無</span>
                ) : (
                  <ul className="mb-0 mt-1" style={{ fontSize: '0.83rem', paddingLeft: '1.2rem' }}>
                    {sharedElement.map(({ element, A, B }, i) => (
                      <li key={i}>
                        {element}：
                        {nameA}（{A.map((p) => getPlanetSymbol(p.planet) + p.planet).join('、')}）× {nameB}（{B.map((p) => getPlanetSymbol(p.planet) + p.planet).join('、')}）
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* 第三區塊：跨相位列表 */}
          <Card className="shadow-sm border-0">
            <Card.Header className="fw-semibold bg-light d-flex justify-content-between align-items-center">
              <span>【第三區塊】跨相位列表（{sortedAspects.length} 個）</span>
              <span className="text-muted" style={{ fontSize: '0.78rem' }}>預設以 Orb 升序排列</span>
            </Card.Header>
            <Card.Body className="p-0" style={{ maxHeight: 420, overflowY: 'auto' }}>
              <Table size="sm" bordered hover className="mb-0" style={{ fontSize: '0.82rem' }}>
                <thead className="table-light sticky-top">
                  <tr>
                    <th onClick={() => handleSort('planetA')} style={{ cursor: 'pointer' }}>
                      {nameA} 行星 <SortIcon col="planetA" />
                    </th>
                    <th onClick={() => handleSort('signA')} style={{ cursor: 'pointer' }}>
                      星座 <SortIcon col="signA" />
                    </th>
                    <th onClick={() => handleSort('degreeA')} style={{ cursor: 'pointer' }}>
                      度數 <SortIcon col="degreeA" />
                    </th>
                    <th>相位</th>
                    <th onClick={() => handleSort('planetB')} style={{ cursor: 'pointer' }}>
                      {nameB} 行星 <SortIcon col="planetB" />
                    </th>
                    <th onClick={() => handleSort('signB')} style={{ cursor: 'pointer' }}>
                      星座 <SortIcon col="signB" />
                    </th>
                    <th onClick={() => handleSort('degreeB')} style={{ cursor: 'pointer' }}>
                      度數 <SortIcon col="degreeB" />
                    </th>
                    <th onClick={() => handleSort('orb')} style={{ cursor: 'pointer' }}>
                      Orb <SortIcon col="orb" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAspects.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center text-muted py-3">
                        無符合的跨相位
                      </td>
                    </tr>
                  ) : (
                    sortedAspects.map((row, i) => (
                      <tr key={i}>
                        <td>
                          {getPlanetSymbol(row.planetA)} {row.planetA}
                        </td>
                        <td>{row.signA}</td>
                        <td>{row.degStrA}</td>
                        <td>
                          <ChartAspectBadge
                            aspectKey={row.aspectKey}
                            orb={row.orb}
                            size="sm"
                          />
                        </td>
                        <td>
                          {getPlanetSymbol(row.planetB)} {row.planetB}
                        </td>
                        <td>{row.signB}</td>
                        <td>{row.degStrB}</td>
                        <td>{Number(row.orb).toFixed(2)}°</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
