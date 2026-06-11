// ============================================================
// Navbar.jsx — v11
// 修改說明：新增「元素解析」展開選單
//   - 元素解析：點擊跳頁 /elements + 展開子選單
//   - 十二星座：點擊跳頁 /elements/signs + 展開星座列表
//   - 各星座：點擊跳頁 /elements/signs/:signKey
//   - 十大行星：點擊跳頁 /elements/planets + 展開行星列表
//   - 各行星：點擊只展開/收合，不跳頁
//   - 行星×星座：點擊跳頁 /elements/planets/:planetKey/signs/:signKey
// ============================================================

import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { SIGN_OPTIONS } from '../utils/codeMap';

// 第一批七顆行星
const PLANETS_7 = [
    { code: 'Q', label: '太陽' },
    { code: 'W', label: '月亮' },
    { code: 'E', label: '水星' },
    { code: 'R', label: '金星' },
    { code: 'T', label: '火星' },
    { code: 'Y', label: '木星' },
    { code: 'U', label: '土星' },
]

const NAV_ITEMS = [
    { to: '/',       label: '客戶列表', icon: '👥' },
    { to: '/search', label: '行星篩選', icon: '🔍' },
    { to: '/backup', label: '備份管理', icon: '💾' },
]

export default function Navbar() {
    const [collapsed,       setCollapsed]       = useState(false)
    const [elemOpen,        setElemOpen]        = useState(false)   // 元素解析
    const [signsOpen,       setSignsOpen]       = useState(false)   // 十二星座
    const [planetsOpen,     setPlanetsOpen]     = useState(false)   // 十大行星
    const [openPlanetCode,  setOpenPlanetCode]  = useState(null)    // 展開中的行星代碼

    const location = useLocation()
    const navigate = useNavigate()
    const isOnElement = location.pathname.startsWith('/elements')

    const width = collapsed ? 56 : 220

    // ── 點擊「元素解析」：跳頁 + 展開 ──────────────
    const handleElemClick = () => {
        navigate('/elements')
        setElemOpen(prev => !prev)
    }

    // ── 點擊「十二星座」：跳頁 + 展開 ──────────────
    const handleSignsClick = () => {
        navigate('/elements/signs')
        setSignsOpen(prev => !prev)
    }

    // ── 點擊「十大行星」：跳頁 + 展開 ──────────────
    const handlePlanetsClick = () => {
        navigate('/elements/planets')
        setPlanetsOpen(prev => !prev)
    }

    // ── 點擊行星：只展開/收合，不跳頁 ──────────────
    const handlePlanetClick = (code) => {
        setOpenPlanetCode(prev => prev === code ? null : code)
    }

    return (
        <div
            style={{
                width,
                minHeight: '100vh',
                backgroundColor: '#1C1C2E',
                color: '#E8E0F0',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 0.2s ease',
                overflow: 'hidden',
                flexShrink: 0,
                position: 'sticky',
                top: 0,
                height: '100vh',
                overflowY: 'auto',
            }}
        >
            {/* Logo / 標題列 */}
            <div
                style={{
                    padding: '16px 12px',
                    borderBottom: '1px solid #2D2D45',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    flexShrink: 0,
                }}
            >
                {!collapsed && (
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.04em', color: '#D4AF37' }}>
                        ✦ 占星顧問後台
                    </span>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1rem', padding: 0, lineHeight: 1 }}
                    title={collapsed ? '展開側欄' : '收合側欄'}
                >
                    {collapsed ? '▶' : '◀'}
                </button>
            </div>

            {/* 導覽項目 */}
            <nav style={{ flex: 1, paddingTop: 8 }}>

                {/* ── 既有三個項目 ── */}
                {NAV_ITEMS.map(({ to, label, icon }) => {
                    const isActive = to === '/'
                        ? location.pathname === '/'
                        : location.pathname.startsWith(to)

                    return (
                        <NavLink
                            key={to}
                            to={to}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: collapsed ? 0 : 10,
                                justifyContent: collapsed ? 'center' : 'flex-start',
                                padding: collapsed ? '12px 0' : '10px 16px',
                                color: isActive ? '#D4AF37' : '#B0A8C8',
                                backgroundColor: isActive ? '#2D2D45' : 'transparent',
                                borderLeft: isActive ? '3px solid #D4AF37' : '3px solid transparent',
                                textDecoration: 'none',
                                fontSize: '0.88rem',
                                fontWeight: isActive ? 600 : 400,
                                transition: 'background 0.15s, color 0.15s',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                        >
                            <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
                            {!collapsed && <span>{label}</span>}
                            {collapsed && (
                                <span style={tooltipStyle} className="navbar-tooltip">{label}</span>
                            )}
                        </NavLink>
                    )
                })}

                {/* ── 元素解析（第四個） ── */}
                {!collapsed && (
                    <>
                        {/* 元素解析 主按鈕 */}
                        <div
                            onClick={handleElemClick}
                            style={{
                                ...menuItemStyle,
                                color: isOnElement ? '#D4AF37' : '#B0A8C8',
                                backgroundColor: isOnElement ? '#2D2D45' : 'transparent',
                                borderLeft: isOnElement ? '3px solid #D4AF37' : '3px solid transparent',
                            }}
                        >
                            <span style={{ fontSize: '1rem' }}>📖</span>
                            <span style={{ flex: 1 }}>元素解析</span>
                            <span style={{ fontSize: '0.7rem', color: '#555' }}>
                                {elemOpen ? '▲' : '▼'}
                            </span>
                        </div>

                        {/* 展開：十二星座 + 十大行星 */}
                        {elemOpen && (
                            <div style={{ paddingLeft: 12 }}>

                                {/* 十二星座 */}
                                <div
                                    onClick={handleSignsClick}
                                    style={{
                                        ...subMenuItemStyle,
                                        color: location.pathname === '/elements/signs' ? '#D4AF37' : '#9090B8',
                                    }}
                                >
                                    <span style={{ marginRight: 6 }}>♈</span>
                                    <span style={{ flex: 1 }}>十二星座</span>
                                    <span style={{ fontSize: '0.65rem', color: '#555' }}>
                                        {signsOpen ? '▲' : '▼'}
                                    </span>
                                </div>

                                {/* 十二星座列表 */}
                                {signsOpen && (
                                    <div style={{ paddingLeft: 12 }}>
                                        {SIGN_OPTIONS.map(({ code, label }) => {
                                            const active = location.pathname === `/elements/signs/${code}`
                                            return (
                                                <NavLink
                                                    key={code}
                                                    to={`/elements/signs/${code}`}
                                                    style={{
                                                        display: 'block',
                                                        padding: '5px 10px',
                                                        color: active ? '#D4AF37' : '#7070A0',
                                                        backgroundColor: active ? '#252540' : 'transparent',
                                                        borderLeft: active ? '2px solid #D4AF37' : '2px solid transparent',
                                                        textDecoration: 'none',
                                                        fontSize: '0.82rem',
                                                        whiteSpace: 'nowrap',
                                                        transition: 'color 0.15s',
                                                    }}
                                                >
                                                    {label}
                                                </NavLink>
                                            )
                                        })}
                                    </div>
                                )}

                                {/* 十大行星 */}
                                <div
                                    onClick={handlePlanetsClick}
                                    style={{
                                        ...subMenuItemStyle,
                                        color: location.pathname === '/elements/planets' ? '#D4AF37' : '#9090B8',
                                    }}
                                >
                                    <span style={{ marginRight: 6 }}>☀️</span>
                                    <span style={{ flex: 1 }}>十大行星</span>
                                    <span style={{ fontSize: '0.65rem', color: '#555' }}>
                                        {planetsOpen ? '▲' : '▼'}
                                    </span>
                                </div>

                                {/* 行星列表 */}
                                {planetsOpen && (
                                    <div style={{ paddingLeft: 12 }}>
                                        {PLANETS_7.map(({ code, label }) => {
                                            const isOpen = openPlanetCode === code
                                            return (
                                                <div key={code}>
                                                    {/* 行星：只展開，不跳頁 */}
                                                    <div
                                                        onClick={() => handlePlanetClick(code)}
                                                        style={{
                                                            ...subMenuItemStyle,
                                                            color: '#8080B0',
                                                            fontSize: '0.82rem',
                                                        }}
                                                    >
                                                        <span style={{ flex: 1 }}>{label}</span>
                                                        <span style={{ fontSize: '0.65rem', color: '#555' }}>
                                                            {isOpen ? '▲' : '▼'}
                                                        </span>
                                                    </div>

                                                    {/* 行星展開：十二星座 */}
                                                    {isOpen && (
                                                        <div style={{ paddingLeft: 12 }}>
                                                            {SIGN_OPTIONS.map(({ code: sCode, label: sLabel }) => {
                                                                const path = `/elements/planets/${code}/signs/${sCode}`
                                                                const active = location.pathname === path
                                                                return (
                                                                    <NavLink
                                                                        key={sCode}
                                                                        to={path}
                                                                        style={{
                                                                            display: 'block',
                                                                            padding: '4px 8px',
                                                                            color: active ? '#D4AF37' : '#5A5A80',
                                                                            backgroundColor: active ? '#252540' : 'transparent',
                                                                            borderLeft: active ? '2px solid #D4AF37' : '2px solid transparent',
                                                                            textDecoration: 'none',
                                                                            fontSize: '0.78rem',
                                                                            whiteSpace: 'nowrap',
                                                                            transition: 'color 0.15s',
                                                                        }}
                                                                    >
                                                                        {sLabel}
                                                                    </NavLink>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* 收合狀態下元素解析只顯示 icon */}
                {collapsed && (
                    <div
                        onClick={handleElemClick}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            padding: '12px 0',
                            cursor: 'pointer',
                            color: isOnElement ? '#D4AF37' : '#B0A8C8',
                            position: 'relative',
                        }}
                    >
                        <span style={{ fontSize: '1rem' }}>📖</span>
                        <span style={tooltipStyle} className="navbar-tooltip">元素解析</span>
                    </div>
                )}
            </nav>

            {/* 底部版本資訊 */}
            {!collapsed && (
                <div style={{ padding: '10px 16px', borderTop: '1px solid #2D2D45', fontSize: '0.7rem', color: '#555', letterSpacing: '0.03em' }}>
                    v11
                </div>
            )}

            <style>{`
                nav a:hover { background-color: #2A2A40 !important; color: #D4AF37 !important; }
                nav a:hover .navbar-tooltip { display: block !important; }
            `}</style>
        </div>
    )
}

// ── 共用樣式 ────────────────────────────────────────────
const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '0.88rem',
    fontWeight: 400,
    whiteSpace: 'nowrap',
    transition: 'background 0.15s, color 0.15s',
    userSelect: 'none',
}

const subMenuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '7px 10px',
    cursor: 'pointer',
    fontSize: '0.84rem',
    whiteSpace: 'nowrap',
    transition: 'color 0.15s',
    userSelect: 'none',
}

const tooltipStyle = {
    position: 'absolute',
    left: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#2D2D45',
    color: '#E8E0F0',
    padding: '4px 10px',
    borderRadius: 4,
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',
    zIndex: 1000,
    display: 'none',
    pointerEvents: 'none',
}
