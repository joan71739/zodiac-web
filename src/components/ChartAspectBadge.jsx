// ============================================================
// ChartAspectBadge.jsx — 相位標籤（顯示相位名稱 + 角距）
// 星盤優化 V2 — FE-4
// ============================================================

import React from 'react';
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ASPECT_DEFINITIONS } from '../utils/chartMath';

/**
 * Props:
 *  aspectKey  {string}  — e.g. 'conjunction'
 *  orb        {number}  — 角距（度）
 *  showOrb    {boolean} — 是否顯示角距（預設 true）
 *  size       {'sm'|'md'} — 尺寸（預設 'md'）
 */
export default function ChartAspectBadge({ aspectKey, orb, showOrb = true, size = 'md' }) {
  const def = ASPECT_DEFINITIONS[aspectKey];
  if (!def) return null;

  const fontSize = size === 'sm' ? '0.7rem' : '0.82rem';
  const padding   = size === 'sm' ? '2px 6px' : '3px 8px';

  const badge = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: def.color,
        color: '#fff',
        borderRadius: '4px',
        padding,
        fontSize,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
      }}
    >
      <span style={{ fontSize: size === 'sm' ? '0.85em' : '1em' }}>{def.symbol}</span>
      <span>{def.name}</span>
      {showOrb && orb != null && (
        <span style={{ opacity: 0.85, fontSize: '0.88em' }}>
          {Number(orb).toFixed(2)}°
        </span>
      )}
    </span>
  );

  const tooltip = (
    <Tooltip>
      {def.name}（{def.angle}°）角距 {Number(orb ?? 0).toFixed(2)}°
    </Tooltip>
  );

  return (
    <OverlayTrigger placement="top" overlay={tooltip}>
      <span style={{ cursor: 'default' }}>{badge}</span>
    </OverlayTrigger>
  );
}
