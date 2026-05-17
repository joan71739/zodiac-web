// ============================================================
// SynastrySVG.jsx — 合盤雙輪 SVG 繪製元件（F6）
// 星盤優化 V2 — FE-3
// ============================================================

import React, { useMemo } from 'react';
import {
  SIGN_OFFSETS,
  ASPECT_DEFINITIONS,
  ELEMENT_SIGNS,
  eclipticToSVGAngle,
  polarToCartesian,
  calcCrossAspects,
  enrichPlanetsWithAbsDeg,
  ascToAbsDeg,
  formatDegMin,
  getPlanetSymbol,
  DEFAULT_PREFERENCES,
} from '../utils/chartMath';

// ── 常數 ──────────────────────────────────────
const SIZE = 520;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R_ZODIAC_OUT = 240;
const R_ZODIAC_IN = 202;
const R_PLANET_A = 180;  // 外圈行星（A）
const R_HOUSE = 158;
const R_ASPECT = 130;  // 相位線
const R_SEPARATOR = 110;  // 內外圈分隔
const R_PLANET_B = 88;   // 內圈行星（B）
const R_CENTER = 40;

const SIGN_SYMBOLS = {
  牡羊座: '♈', 金牛座: '♉', 雙子座: '♊', 巨蟹座: '♋',
  獅子座: '♌', 處女座: '♍', 天秤座: '♎', 天蠍座: '♏',
  射手座: '♐', 魔羯座: '♑', 水瓶座: '♒', 雙魚座: '♓',
};

const ELEMENT_COLORS = {
  火象: { bg: '#FDECEA', border: '#EF9A9A' },
  土象: { bg: '#F1F8E9', border: '#AED581' },
  風象: { bg: '#E3F2FD', border: '#90CAF9' },
  水象: { bg: '#E8EAF6', border: '#9FA8DA' },
};

// ── 改後（與 NatalChartSVG 相同寫法）──
const SIGN_ELEMENTS = Object.fromEntries(
  Object.entries(ELEMENT_SIGNS).flatMap(([elem, signs]) =>
    signs.map((s) => [s, elem])
  )
);

const SIGNS_ORDER = Object.keys(SIGN_OFFSETS);

/**
 * Props:
 *  synastryData  — GET /api/chart/synastry 的回傳值
 *  preferences   — 相位設定
 *  outerClient   — 'A' | 'B'（預設 'A'）
 */
export default function SynastrySVG({
  synastryData,
  preferences = DEFAULT_PREFERENCES,
  outerClient = 'A',
}) {
  if (!synastryData) {
    return (
      <div className="text-center text-muted py-5">
        載入合盤資料中…
      </div>
    );
  }

  // 依照 outerClient 決定哪個為外圈
  const outer = outerClient === 'A' ? synastryData.clientA : synastryData.clientB;
  const inner = outerClient === 'A' ? synastryData.clientB : synastryData.clientA;

  // 上升點
  const ascDeg = useMemo(() => ascToAbsDeg(outer?.ascendant), [outer]);

  // 行星（含 absoluteDeg）
  const planetsOuter = useMemo(
    () => enrichPlanetsWithAbsDeg(outer?.planets ?? []),
    [outer]
  );
  const planetsInner = useMemo(
    () => enrichPlanetsWithAbsDeg(inner?.planets ?? []),
    [inner]
  );

  // 跨相位
  const crossAspects = useMemo(
    () => calcCrossAspects(planetsOuter, planetsInner, preferences),
    [planetsOuter, planetsInner, preferences]
  );

  // ── 繪製：黃道帶 ─────────────────────────────
  function renderZodiacBelt() {
    return SIGNS_ORDER.map((sign) => {
      const startDeg = SIGN_OFFSETS[sign];
      const endDeg = startDeg + 30;
      const startAngle = eclipticToSVGAngle(startDeg, ascDeg);
      const endAngle = eclipticToSVGAngle(endDeg, ascDeg);

      const element = SIGN_ELEMENTS[sign];
      const colors = ELEMENT_COLORS[element] || { bg: '#f5f5f5', border: '#ddd' };

      const p1 = polarToCartesian(CX, CY, R_ZODIAC_OUT, startAngle);
      const p2 = polarToCartesian(CX, CY, R_ZODIAC_OUT, endAngle);
      const p3 = polarToCartesian(CX, CY, R_ZODIAC_IN, endAngle);
      const p4 = polarToCartesian(CX, CY, R_ZODIAC_IN, startAngle);

      const angleDiff = ((endAngle - startAngle) + 2 * Math.PI) % (2 * Math.PI);
      const largeArc = angleDiff > Math.PI ? 1 : 0;

      const d = [
        `M ${p1.x} ${p1.y}`,
        `A ${R_ZODIAC_OUT} ${R_ZODIAC_OUT} 0 ${largeArc} 0 ${p2.x} ${p2.y}`,
        `L ${p3.x} ${p3.y}`,
        `A ${R_ZODIAC_IN} ${R_ZODIAC_IN} 0 ${largeArc} 1 ${p4.x} ${p4.y}`,
        'Z',
      ].join(' ');

      const midAngle = (startAngle + endAngle) / 2;
      const symR = (R_ZODIAC_OUT + R_ZODIAC_IN) / 2;
      const sym = polarToCartesian(CX, CY, symR, midAngle);

      return (
        <g key={sign}>
          <path d={d} fill={colors.bg} stroke={colors.border} strokeWidth="0.5" />
          <text x={sym.x} y={sym.y} textAnchor="middle" dominantBaseline="central" fontSize="12" fill="#555">
            {SIGN_SYMBOLS[sign]}
          </text>
        </g>
      );
    });
  }

  // ── 繪製：宮位線 ─────────────────────────────
  function renderHouseLines() {
    return Array.from({ length: 12 }, (_, i) => {
      const eclipticDeg = (ascDeg + i * 30) % 360;
      const angle = eclipticToSVGAngle(eclipticDeg, ascDeg);
      const inner_ = polarToCartesian(CX, CY, R_CENTER, angle);
      const outer_ = polarToCartesian(CX, CY, R_ZODIAC_IN, angle);
      const isAxis = [0, 3, 6, 9].includes(i);
      return (
        <line
          key={i}
          x1={inner_.x} y1={inner_.y}
          x2={outer_.x} y2={outer_.y}
          stroke={isAxis ? '#666' : '#ccc'}
          strokeWidth={isAxis ? 1.8 : 0.7}
          strokeDasharray={isAxis ? 'none' : '3,3'}
        />
      );
    });
  }

  // ── 繪製：跨相位線 ───────────────────────────
  function renderCrossAspectLines() {
    return crossAspects.map(({ pA, pB, aspect }, idx) => {
      const angleA = eclipticToSVGAngle(pA.absoluteDeg, ascDeg);
      const angleB = eclipticToSVGAngle(pB.absoluteDeg, ascDeg);
      const posA = polarToCartesian(CX, CY, R_ASPECT, angleA);
      const posB = polarToCartesian(CX, CY, R_ASPECT, angleB);
      const def = ASPECT_DEFINITIONS[aspect.key];
      return (
        <line
          key={idx}
          x1={posA.x} y1={posA.y}
          x2={posB.x} y2={posB.y}
          stroke={def?.color ?? '#999'}
          strokeWidth="1.2"
          strokeDasharray={def?.strokeDasharray === 'none' ? undefined : def?.strokeDasharray}
          opacity="0.75"
        />
      );
    });
  }

  // ── 繪製：外圈行星 ───────────────────────────
  function renderOuterPlanets() {
    return planetsOuter.map((p) => {
      const angle = eclipticToSVGAngle(p.absoluteDeg, ascDeg);
      const pos = polarToCartesian(CX, CY, R_PLANET_A, angle);
      const symbol = getPlanetSymbol(p.planet);
      return (
        <g key={`outer-${p.planet}`}>
          <circle cx={pos.x} cy={pos.y} r="10" fill="#FFF9E6" stroke="#DAA520" strokeWidth="0.8" />
          <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fontSize="9" fill="#7A5C00">
            {symbol}
          </text>
          <title>{`${outer?.name ?? 'A'} ${p.planet} ${p.sign} ${formatDegMin(p.degreeNum, p.minuteNum)}`}</title>
        </g>
      );
    });
  }

  // ── 繪製：內圈行星 ───────────────────────────
  function renderInnerPlanets() {
    return planetsInner.map((p) => {
      const angle = eclipticToSVGAngle(p.absoluteDeg, ascDeg);
      const pos = polarToCartesian(CX, CY, R_PLANET_B, angle);
      const symbol = getPlanetSymbol(p.planet);
      return (
        <g key={`inner-${p.planet}`}>
          <circle cx={pos.x} cy={pos.y} r="10" fill="#E8F0FF" stroke="#4A6FA5" strokeWidth="0.8" />
          <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fontSize="9" fill="#1A3A6B">
            {symbol}
          </text>
          <title>{`${inner?.name ?? 'B'} ${p.planet} ${p.sign} ${formatDegMin(p.degreeNum, p.minuteNum)}`}</title>
        </g>
      );
    });
  }

  // ────────────────────────────────────────────
  // 渲染
  // ────────────────────────────────────────────
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width="100%"
      style={{ display: 'block', maxWidth: SIZE, userSelect: 'none' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 背景圓 */}
      <circle cx={CX} cy={CY} r={R_ZODIAC_OUT} fill="#FAFAFA" stroke="#DDD" strokeWidth="1" />

      {/* 黃道帶 */}
      {renderZodiacBelt()}

      {/* 宮位線 */}
      {renderHouseLines()}

      {/* 相位圓 */}
      <circle cx={CX} cy={CY} r={R_ASPECT} fill="none" stroke="#E0E0E0" strokeWidth="0.7" />

      {/* 跨相位線 */}
      {renderCrossAspectLines()}

      {/* 內外圈分隔圓 */}
      <circle cx={CX} cy={CY} r={R_SEPARATOR} fill="#F5F8FF" stroke="#B0C4DE" strokeWidth="1" />

      {/* 外圈行星（A） */}
      {renderOuterPlanets()}

      {/* 內圈行星（B） */}
      {renderInnerPlanets()}

      {/* 中心圓 */}
      <circle cx={CX} cy={CY} r={R_CENTER} fill="#FFF" stroke="#DDD" strokeWidth="1" />
      <text x={CX} y={CY - 8} textAnchor="middle" fontSize="8" fill="#DAA520" fontWeight="700">
        {outer?.name ?? 'A'}
      </text>
      <text x={CX} y={CY + 2} textAnchor="middle" fontSize="7" fill="#AAA">
        ⇄
      </text>
      <text x={CX} y={CY + 13} textAnchor="middle" fontSize="8" fill="#4A6FA5" fontWeight="700">
        {inner?.name ?? 'B'}
      </text>

      {/* 圖例 */}
      <circle cx={CX - 90} cy={SIZE - 18} r="6" fill="#FFF9E6" stroke="#DAA520" strokeWidth="0.8" />
      <text x={CX - 82} y={SIZE - 14} fontSize="9" fill="#7A5C00">{outer?.name ?? '外圈'}</text>
      <circle cx={CX + 20} cy={SIZE - 18} r="6" fill="#E8F0FF" stroke="#4A6FA5" strokeWidth="0.8" />
      <text x={CX + 28} y={SIZE - 14} fontSize="9" fill="#1A3A6B">{inner?.name ?? '內圈'}</text>
    </svg>
  );
}
