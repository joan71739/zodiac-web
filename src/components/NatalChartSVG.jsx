// ============================================================
// NatalChartSVG.jsx — 本命星盤 SVG 繪製核心元件（F1、F2）
// 星盤優化 V2 — FE-1
// ============================================================

import React, { useMemo } from 'react';
import {
  SIGN_OFFSETS,
  ASPECT_DEFINITIONS,
  toAbsoluteDeg,
  eclipticToSVGAngle,
  polarToCartesian,
  getHouseCusps,
  calcAllAspects,
  enrichPlanetsWithAbsDeg,
  ascToAbsDeg,
  formatDegMin,
  getPlanetSymbol,
  DEFAULT_PREFERENCES,
} from '../utils/chartMath';

// ── 常數 ──────────────────────────────────────
const SIZE      = 500;
const CX        = SIZE / 2;
const CY        = SIZE / 2;
const R_ZODIAC_OUT = 230;  // 黃道帶外圓
const R_ZODIAC_IN  = 192;  // 黃道帶內圓
const R_PLANET     = 170;  // 行星符號圓
const R_HOUSE      = 150;  // 宮位線外圓
const R_ASPECT     = 110;  // 相位線圓
const R_CENTER     = 40;   // 中心圓

// 星座元素顏色
const ELEMENT_COLORS = {
  火象: { bg: '#FDECEA', text: '#B71C1C', border: '#EF9A9A' },
  土象: { bg: '#F1F8E9', text: '#33691E', border: '#AED581' },
  風象: { bg: '#E3F2FD', text: '#0D47A1', border: '#90CAF9' },
  水象: { bg: '#E8EAF6', text: '#1A237E', border: '#9FA8DA' },
};

const SIGN_ELEMENTS = {
  牡羊座: '火象', 獅子座: '火象', 射手座: '火象',
  金牛座: '土象', 處女座: '土象', 魔羯座: '土象',
  雙子座: '風象', 天秤座: '風象', 水瓶座: '風象',
  巨蟹座: '水象', 天蠍座: '水象', 雙魚座: '水象',
};

const SIGN_SYMBOLS = {
  牡羊座: '♈', 金牛座: '♉', 雙子座: '♊', 巨蟹座: '♋',
  獅子座: '♌', 處女座: '♍', 天秤座: '♎', 天蠍座: '♏',
  射手座: '♐', 魔羯座: '♑', 水瓶座: '♒', 雙魚座: '♓',
};

const SIGNS_ORDER = Object.keys(SIGN_OFFSETS);

/**
 * Props:
 *  chartData    — GET /api/chart/{id}/data 回傳值
 *  preferences  — GET /api/chart/preferences 回傳值
 *  selected     — Set<string>（選中的行星名稱集合）
 *  onPlanetClick — (planetName: string) => void
 */
export default function NatalChartSVG({
  chartData,
  preferences = DEFAULT_PREFERENCES,
  selected = new Set(),
  onPlanetClick,
}) {
  // ── 上升點 ──────────────────────────────────
  const ascDeg = useMemo(() => ascToAbsDeg(chartData?.ascendant), [chartData]);

  // ── 行星（含 absoluteDeg）───────────────────
  const planets = useMemo(() => {
    if (!chartData?.planets) return [];
    return enrichPlanetsWithAbsDeg(chartData.planets);
  }, [chartData]);

  // ── 相位計算 ─────────────────────────────────
  const allAspects = useMemo(
    () => calcAllAspects(planets, preferences),
    [planets, preferences]
  );

  // ── 選中行星相關的相位 ───────────────────────
  const highlightedAspects = useMemo(() => {
    if (selected.size === 0) return allAspects;
    return allAspects.filter(
      ({ pA, pB }) => selected.has(pA.planet) || selected.has(pB.planet)
    );
  }, [allAspects, selected]);

  // ── 宮位線 ───────────────────────────────────
  const houseCusps = useMemo(() => getHouseCusps(ascDeg), [ascDeg]);

  if (!chartData) {
    return (
      <div className="text-center text-muted py-5">
        <span>載入星盤資料中…</span>
      </div>
    );
  }

  // ────────────────────────────────────────────
  // 繪製函式
  // ────────────────────────────────────────────

  /** 黃道帶：12 星座分區 */
  function renderZodiacBelt() {
    return SIGNS_ORDER.map((sign) => {
      const startDeg = SIGN_OFFSETS[sign];
      const endDeg   = startDeg + 30;
      const startAngle = eclipticToSVGAngle(startDeg, ascDeg);
      const endAngle   = eclipticToSVGAngle(endDeg, ascDeg);

      const element = SIGN_ELEMENTS[sign];
      const colors  = ELEMENT_COLORS[element] || { bg: '#f5f5f5', text: '#333' };

      // 扇形路徑
      const p1 = polarToCartesian(CX, CY, R_ZODIAC_OUT, startAngle);
      const p2 = polarToCartesian(CX, CY, R_ZODIAC_OUT, endAngle);
      const p3 = polarToCartesian(CX, CY, R_ZODIAC_IN,  endAngle);
      const p4 = polarToCartesian(CX, CY, R_ZODIAC_IN,  startAngle);

      // 大弧旗標（跨越 180° 時為 1）
      const angleDiff = ((endAngle - startAngle) + 2 * Math.PI) % (2 * Math.PI);
      const largeArc = angleDiff > Math.PI ? 1 : 0;

      const d = [
        `M ${p1.x} ${p1.y}`,
        `A ${R_ZODIAC_OUT} ${R_ZODIAC_OUT} 0 ${largeArc} 0 ${p2.x} ${p2.y}`,
        `L ${p3.x} ${p3.y}`,
        `A ${R_ZODIAC_IN} ${R_ZODIAC_IN} 0 ${largeArc} 1 ${p4.x} ${p4.y}`,
        'Z',
      ].join(' ');

      // 符號位置（扇形中心）
      const midAngle = (startAngle + endAngle) / 2;
      const symR = (R_ZODIAC_OUT + R_ZODIAC_IN) / 2;
      const sym  = polarToCartesian(CX, CY, symR, midAngle);

      return (
        <g key={sign}>
          <path d={d} fill={colors.bg} stroke={colors.border} strokeWidth="0.5" />
          <text
            x={sym.x}
            y={sym.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="13"
            fill={colors.text}
          >
            {SIGN_SYMBOLS[sign]}
          </text>
        </g>
      );
    });
  }

  /** 宮位線 */
  function renderHouseLines() {
    return houseCusps.map(({ house, eclipticDeg }) => {
      const angle = eclipticToSVGAngle(eclipticDeg, ascDeg);
      const inner = polarToCartesian(CX, CY, R_CENTER, angle);
      const outer = polarToCartesian(CX, CY, R_ZODIAC_IN, angle);

      // 軸線（1/4/7/10 宮）加粗
      const isAxis = [1, 4, 7, 10].includes(house);

      return (
        <line
          key={house}
          x1={inner.x} y1={inner.y}
          x2={outer.x} y2={outer.y}
          stroke={isAxis ? '#555' : '#bbb'}
          strokeWidth={isAxis ? 2 : 0.8}
          strokeDasharray={isAxis ? 'none' : '4,3'}
        />
      );
    });
  }

  /** 宮位號碼 */
  function renderHouseNumbers() {
    return houseCusps.map(({ house, eclipticDeg }, i) => {
      const nextDeg = houseCusps[(i + 1) % 12].eclipticDeg;
      // 宮位中點
      let midDeg = eclipticDeg + 15;
      if (midDeg >= 360) midDeg -= 360;
      const angle = eclipticToSVGAngle(midDeg, ascDeg);
      const pos = polarToCartesian(CX, CY, (R_HOUSE + R_ASPECT) / 2, angle);

      return (
        <text
          key={house}
          x={pos.x} y={pos.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="9"
          fill="#999"
        >
          {house}
        </text>
      );
    });
  }

  /** 相位線 */
  function renderAspectLines() {
    return highlightedAspects.map(({ pA, pB, aspect }, idx) => {
      const angleA = eclipticToSVGAngle(pA.absoluteDeg, ascDeg);
      const angleB = eclipticToSVGAngle(pB.absoluteDeg, ascDeg);
      const posA = polarToCartesian(CX, CY, R_ASPECT, angleA);
      const posB = polarToCartesian(CX, CY, R_ASPECT, angleB);

      const isHighlighted =
        selected.size === 0 ||
        selected.has(pA.planet) ||
        selected.has(pB.planet);

      const def = ASPECT_DEFINITIONS[aspect.key];

      return (
        <line
          key={idx}
          x1={posA.x} y1={posA.y}
          x2={posB.x} y2={posB.y}
          stroke={def?.color ?? '#999'}
          strokeWidth={isHighlighted ? 1.5 : 0.6}
          strokeDasharray={def?.strokeDasharray === 'none' ? undefined : def?.strokeDasharray}
          opacity={isHighlighted ? 0.85 : 0.25}
        />
      );
    });
  }

  /** 行星符號（可點擊） */
  function renderPlanets() {
    return planets.map((p) => {
      const angle = eclipticToSVGAngle(p.absoluteDeg, ascDeg);
      const pos   = polarToCartesian(CX, CY, R_PLANET, angle);
      const isSelected = selected.has(p.planet);
      const symbol = getPlanetSymbol(p.planet);

      return (
        <g
          key={p.planet}
          style={{ cursor: 'pointer' }}
          onClick={() => onPlanetClick && onPlanetClick(p.planet)}
        >
          {/* 選中光暈 */}
          {isSelected && (
            <circle
              cx={pos.x} cy={pos.y} r="13"
              fill="#FFD700" opacity="0.35"
            />
          )}
          {/* 行星圓底 */}
          <circle
            cx={pos.x} cy={pos.y} r="11"
            fill={isSelected ? '#FFF8DC' : '#fff'}
            stroke={isSelected ? '#DAA520' : '#ccc'}
            strokeWidth={isSelected ? 1.8 : 1}
          />
          {/* 行星符號 */}
          <text
            x={pos.x} y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="10"
            fontWeight={isSelected ? '700' : '400'}
            fill={isSelected ? '#8B6914' : '#333'}
          >
            {symbol}
          </text>

          {/* 度數小標（懸浮 Tooltip 替代 — 直接顯示於圓外側） */}
          <title>{`${p.planet} ${p.sign} ${formatDegMin(p.degreeNum, p.minuteNum)} 第${p.house}宮${p.notes ? ' ' + p.notes : ''}${p.isLord ? ' ★命主星' : ''}`}</title>
        </g>
      );
    });
  }

  /** 軸點標籤（ASC / DSC / MC / IC） */
  function renderAxisLabels() {
    const axes = [
      { label: 'ASC', eclipticDeg: ascDeg },
      { label: 'DSC', eclipticDeg: (ascDeg + 180) % 360 },
      { label: 'MC',  eclipticDeg: chartData.midheaven ? toAbsoluteDeg(chartData.midheaven.sign, chartData.midheaven.degreeNum, chartData.midheaven.minuteNum) : (ascDeg + 90) % 360 },
      { label: 'IC',  eclipticDeg: chartData.midheaven ? (toAbsoluteDeg(chartData.midheaven.sign, chartData.midheaven.degreeNum, chartData.midheaven.minuteNum) + 180) % 360 : (ascDeg + 270) % 360 },
    ];

    return axes.map(({ label, eclipticDeg }) => {
      const angle = eclipticToSVGAngle(eclipticDeg, ascDeg);
      const pos = polarToCartesian(CX, CY, R_ZODIAC_OUT + 14, angle);
      return (
        <text
          key={label}
          x={pos.x} y={pos.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="9"
          fontWeight="700"
          fill="#555"
        >
          {label}
        </text>
      );
    });
  }

  // ────────────────────────────────────────────
  // 渲染
  // ────────────────────────────────────────────
  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: SIZE }}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width="100%"
        style={{ display: 'block', userSelect: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 背景 */}
        <circle cx={CX} cy={CY} r={R_ZODIAC_OUT} fill="#FAFAFA" stroke="#DDD" strokeWidth="1" />

        {/* 黃道帶 */}
        {renderZodiacBelt()}

        {/* 宮位線 */}
        {renderHouseLines()}
        {renderHouseNumbers()}

        {/* 相位圓 */}
        <circle cx={CX} cy={CY} r={R_ASPECT} fill="none" stroke="#E8E8E8" strokeWidth="0.8" />

        {/* 相位線 */}
        {renderAspectLines()}

        {/* 行星 */}
        {renderPlanets()}

        {/* 軸點標籤 */}
        {renderAxisLabels()}

        {/* 中心圓 */}
        <circle cx={CX} cy={CY} r={R_CENTER} fill="#FFF" stroke="#DDD" strokeWidth="1" />
        <text x={CX} y={CY - 6} textAnchor="middle" fontSize="8" fill="#AAA">
          {chartData?.client?.name ?? ''}
        </text>
        <text x={CX} y={CY + 7} textAnchor="middle" fontSize="7" fill="#BBB">
          {chartData?.client?.birthDate ?? ''}
        </text>
      </svg>

      {/* 行星列表（點選高亮輔助）*/}
      <div className="d-flex flex-wrap gap-1 mt-2 justify-content-center">
        {planets.map((p) => {
          const symbol = getPlanetSymbol(p.planet);
          const isSelected = selected.has(p.planet);
          return (
            <button
              key={p.planet}
              onClick={() => onPlanetClick && onPlanetClick(p.planet)}
              style={{
                background: isSelected ? '#FFF8DC' : '#f5f5f5',
                border: `1px solid ${isSelected ? '#DAA520' : '#ddd'}`,
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: isSelected ? '700' : '400',
                color: isSelected ? '#8B6914' : '#555',
                whiteSpace: 'nowrap',
              }}
            >
              {symbol} {p.planet}
            </button>
          );
        })}
        {selected.size > 0 && (
          <button
            onClick={() => onPlanetClick && onPlanetClick('__clear__')}
            style={{
              background: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '0.78rem',
              cursor: 'pointer',
              color: '#888',
            }}
          >
            清除
          </button>
        )}
      </div>
    </div>
  );
}
