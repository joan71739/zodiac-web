// src/styles/navCard.js
// ============================================================
// 全站「可點擊導航卡片」共用樣式
// 要改顏色只需改這一個檔案
// ============================================================

const PRIMARY = '#5599FF'

// 基底樣式（inline style 物件）
export const navCardStyle = {
    backgroundColor: `${PRIMARY}11`,
    border: `1px solid ${PRIMARY}44`,
    borderRadius: 8,
    padding: '12px 24px',
    cursor: 'pointer',
    color: PRIMARY,
    fontSize: '0.92rem',
    textAlign: 'center',
    transition: 'border-color 0.15s, background-color 0.15s',
}

// hover 時疊加的 style（onMouseEnter 用）
export const navCardHoverStyle = {
    backgroundColor: `${PRIMARY}22`,
    borderColor: PRIMARY,
}

// hover 離開時還原（onMouseLeave 用）
export const navCardLeaveStyle = {
    backgroundColor: `${PRIMARY}11`,
    borderColor: `${PRIMARY}44`,
}

// ── 共用元件：直接在 JSX 裡用 <NavCard onClick={...}> ──────
// 用法：
//   import NavCard from '../styles/navCard'
//   <NavCard onClick={() => navigate('/somewhere')}>文字</NavCard>
//
// 需要自訂 padding / minWidth 等，傳 style prop 覆蓋：
//   <NavCard style={{ padding: '24px 32px', minWidth: 180 }}>...</NavCard>

import React from 'react'

export default function NavCard({ onClick, children, style = {} }) {
    return (
        <div
            onClick={onClick}
            style={{ ...navCardStyle, ...style }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, navCardHoverStyle)}
            onMouseLeave={e => Object.assign(e.currentTarget.style, navCardLeaveStyle)}
        >
            {children}
        </div>
    )
}
