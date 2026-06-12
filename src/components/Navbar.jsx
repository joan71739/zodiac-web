// ============================================================
// Navbar.jsx — v15
// 修改說明：元素解析 > 十大行星 > 各行星
//   舊：點擊行星名稱 → 只展開/收合星座，不跳頁
//   新：點擊行星名稱 → 跳至 /elements/planets/:planetKey + 同時展開星座列表
// ============================================================

import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    SIGN_OPTIONS,
    PLANET_7_OPTIONS,
    OUTER_PLANET_OPTIONS,
    PERSONAL_PLANET_OPTIONS,
    ASPECT_SIMPLE_OPTIONS,
} from '../utils/codeMap';

const NAV_ITEMS = [
    { to: '/',       label: '客戶列表', icon: '👥' },
    { to: '/search', label: '行星篩選', icon: '🔍' },
    { to: '/backup', label: '備份管理', icon: '💾' },
]

export default function Navbar() {
    const [collapsed,         setCollapsed]         = useState(false)
    // 元素解析
    const [elemOpen,          setElemOpen]          = useState(false)
    const [signsOpen,         setSignsOpen]         = useState(false)
    const [planetsOpen,       setPlanetsOpen]       = useState(false)
    const [openPlanetCode,    setOpenPlanetCode]    = useState(null)
    // 行運解析
    const [transitOpen,       setTransitOpen]       = useState(false)
    const [openTransitPlanet, setOpenTransitPlanet] = useState(null)
    const [openAspectKey,     setOpenAspectKey]     = useState(null)

    const location = useLocation()
    const navigate = useNavigate()

    const isOnElement = location.pathname.startsWith('/elements')
    const isOnTransit = location.pathname.startsWith('/transits')
    const width = collapsed ? 56 : 220

    // ── 元素解析 handlers ────────────────────────────
    const handleElemClick    = () => { navigate('/elements');         setElemOpen(p => !p) }
    const handleSignsClick   = () => { navigate('/elements/signs');   setSignsOpen(p => !p) }
    const handlePlanetsClick = () => { navigate('/elements/planets'); setPlanetsOpen(p => !p) }

    // 行星點擊：跳至行星入口頁 + 展開/收合星座列表
    const handlePlanetClick = (code) => {
        navigate(`/elements/planets/${code}`)
        setOpenPlanetCode(p => p === code ? null : code)
    }

    // ── 行運解析 handlers ────────────────────────────
    const handleTransitClick = () => { navigate('/transits'); setTransitOpen(p => !p) }
    const handleTransitPlanetClick = (code) => {
        setOpenTransitPlanet(p => p === code ? null : code)
        setOpenAspectKey(null)
    }
    const handleAspectToggle = (planetCode, aspectCode) => {
        const key = `${planetCode}-${aspectCode}`
        setOpenAspectKey(p => p === key ? null : key)
    }

    return (
        <div style={{
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
        }}>
            {/* Logo */}
            <div style={{
                padding: '16px 12px',
                borderBottom: '1px solid #2D2D45',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'space-between',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                flexShrink: 0,
            }}>
                {!collapsed && (
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.04em', color: '#D4AF37' }}>
                        ✦ 占星顧問後台
                    </span>
                )}
                <button onClick={() => setCollapsed(!collapsed)} style={{
                    background: 'none', border: 'none', color: '#888',
                    cursor: 'pointer', fontSize: '1rem', padding: 0, lineHeight: 1,
                }}>
                    {collapsed ? '▶' : '◀'}
                </button>
            </div>

            <nav style={{ flex: 1, paddingTop: 8 }}>

                {/* ── 既有三個項目 ── */}
                {NAV_ITEMS.map(({ to, label, icon }) => {
                    const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
                    return (
                        <NavLink key={to} to={to} style={{
                            display: 'flex', alignItems: 'center',
                            gap: collapsed ? 0 : 10,
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            padding: collapsed ? '12px 0' : '10px 16px',
                            color: isActive ? '#D4AF37' : '#B0A8C8',
                            backgroundColor: isActive ? '#2D2D45' : 'transparent',
                            borderLeft: isActive ? '3px solid #D4AF37' : '3px solid transparent',
                            textDecoration: 'none', fontSize: '0.88rem',
                            fontWeight: isActive ? 600 : 400,
                            transition: 'background 0.15s, color 0.15s',
                            whiteSpace: 'nowrap', overflow: 'hidden', position: 'relative',
                        }}>
                            <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
                            {!collapsed && <span>{label}</span>}
                            {collapsed && <span style={tooltipStyle} className="navbar-tooltip">{label}</span>}
                        </NavLink>
                    )
                })}

                {/* ── 元素解析 ── */}
                {!collapsed && (
                    <>
                        <div onClick={handleElemClick} style={{
                            ...menuItemStyle,
                            color: isOnElement ? '#D4AF37' : '#B0A8C8',
                            backgroundColor: isOnElement ? '#2D2D45' : 'transparent',
                            borderLeft: isOnElement ? '3px solid #D4AF37' : '3px solid transparent',
                        }}>
                            <span style={{ fontSize: '1rem' }}>📖</span>
                            <span style={{ flex: 1 }}>元素解析</span>
                            <span style={{ fontSize: '0.7rem', color: '#555' }}>{elemOpen ? '▲' : '▼'}</span>
                        </div>

                        {elemOpen && (
                            <div style={{ paddingLeft: 12 }}>
                                {/* 十二星座 */}
                                <div onClick={handleSignsClick} style={{
                                    ...subMenuItemStyle,
                                    color: location.pathname === '/elements/signs' ? '#D4AF37' : '#9090B8',
                                }}>
                                    <span style={{ flex: 1 }}>♈ 十二星座</span>
                                    <span style={{ fontSize: '0.65rem', color: '#555' }}>{signsOpen ? '▲' : '▼'}</span>
                                </div>
                                {signsOpen && (
                                    <div style={{ paddingLeft: 10 }}>
                                        {SIGN_OPTIONS.map(({ code, label }) => (
                                            <NavLink key={code} to={`/elements/signs/${code}`}
                                                style={({ isActive }) => ({
                                                    ...leafItemStyle,
                                                    color: isActive ? '#D4AF37' : '#5A5A80',
                                                    backgroundColor: isActive ? '#252540' : 'transparent',
                                                    borderLeft: isActive ? '2px solid #D4AF37' : '2px solid transparent',
                                                })}>
                                                {label}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}

                                {/* 十大行星 */}
                                <div onClick={handlePlanetsClick} style={{
                                    ...subMenuItemStyle,
                                    color: location.pathname === '/elements/planets' ? '#D4AF37' : '#9090B8',
                                }}>
                                    <span style={{ flex: 1 }}>☀️ 十大行星</span>
                                    <span style={{ fontSize: '0.65rem', color: '#555' }}>{planetsOpen ? '▲' : '▼'}</span>
                                </div>
                                {planetsOpen && (
                                    <div style={{ paddingLeft: 10 }}>
                                        {PLANET_7_OPTIONS.map(({ code, label }) => {
                                            const isOpen = openPlanetCode === code
                                            const isPlanetActive = location.pathname.startsWith(`/elements/planets/${code}`)
                                            return (
                                                <div key={code}>
                                                    {/* 行星名稱：點擊跳頁 + 展開星座 */}
                                                    <div
                                                        onClick={() => handlePlanetClick(code)}
                                                        style={{
                                                            ...subMenuItemStyle,
                                                            fontSize: '0.82rem',
                                                            color: isPlanetActive ? '#D4AF37' : '#8080B0',
                                                            backgroundColor: isPlanetActive ? '#252540' : 'transparent',
                                                            borderLeft: isPlanetActive ? '2px solid #D4AF37' : '2px solid transparent',
                                                        }}
                                                    >
                                                        <span style={{ flex: 1 }}>{label}</span>
                                                        <span style={{ fontSize: '0.65rem', color: '#555' }}>{isOpen ? '▲' : '▼'}</span>
                                                    </div>
                                                    {/* 展開後顯示 12 個星座葉節點 */}
                                                    {isOpen && (
                                                        <div style={{ paddingLeft: 10 }}>
                                                            {SIGN_OPTIONS.map(({ code: sCode, label: sLabel }) => (
                                                                <NavLink
                                                                    key={sCode}
                                                                    to={`/elements/planets/${code}/signs/${sCode}`}
                                                                    style={({ isActive }) => ({
                                                                        ...leafItemStyle,
                                                                        color: isActive ? '#D4AF37' : '#5A5A80',
                                                                        backgroundColor: isActive ? '#252540' : 'transparent',
                                                                        borderLeft: isActive ? '2px solid #D4AF37' : '2px solid transparent',
                                                                    })}
                                                                >
                                                                    {sLabel}
                                                                </NavLink>
                                                            ))}
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

                {/* ── 行運解析 ── */}
                {!collapsed && (
                    <>
                        <div onClick={handleTransitClick} style={{
                            ...menuItemStyle,
                            color: isOnTransit ? '#D4AF37' : '#B0A8C8',
                            backgroundColor: isOnTransit ? '#2D2D45' : 'transparent',
                            borderLeft: isOnTransit ? '3px solid #D4AF37' : '3px solid transparent',
                        }}>
                            <span style={{ fontSize: '1rem' }}>🔄</span>
                            <span style={{ flex: 1 }}>行運解析</span>
                            <span style={{ fontSize: '0.7rem', color: '#555' }}>{transitOpen ? '▲' : '▼'}</span>
                        </div>

                        {transitOpen && (
                            <div style={{ paddingLeft: 12 }}>
                                {OUTER_PLANET_OPTIONS.map(({ code: pCode, label: pLabel }) => {
                                    const isPlanetOpen = openTransitPlanet === pCode
                                    return (
                                        <div key={pCode}>
                                            <div onClick={() => handleTransitPlanetClick(pCode)} style={{
                                                ...subMenuItemStyle, color: '#9090B8',
                                            }}>
                                                <span style={{ flex: 1 }}>{pLabel}</span>
                                                <span style={{ fontSize: '0.65rem', color: '#555' }}>{isPlanetOpen ? '▲' : '▼'}</span>
                                            </div>

                                            {isPlanetOpen && (
                                                <div style={{ paddingLeft: 10 }}>
                                                    {/* 過境宮位：直接跳頁 */}
                                                    <NavLink
                                                        to={`/transits/planets/${pCode}/houses`}
                                                        style={({ isActive }) => ({
                                                            ...leafItemStyle,
                                                            color: isActive ? '#D4AF37' : '#8080B0',
                                                            backgroundColor: isActive ? '#252540' : 'transparent',
                                                            borderLeft: isActive ? '2px solid #D4AF37' : '2px solid transparent',
                                                            fontSize: '0.82rem',
                                                            padding: '7px 8px',
                                                        })}
                                                    >
                                                        過境宮位
                                                    </NavLink>

                                                    {/* 各相位 */}
                                                    {ASPECT_SIMPLE_OPTIONS.map(({ code: aCode, label: aLabel }) => {
                                                        const aspectKey = `${pCode}-${aCode}`
                                                        const isAspectOpen = openAspectKey === aspectKey
                                                        return (
                                                            <div key={aCode}>
                                                                <div onClick={() => handleAspectToggle(pCode, aCode)} style={{
                                                                    ...subMenuItemStyle, color: '#8080B0', fontSize: '0.82rem',
                                                                }}>
                                                                    <span style={{ flex: 1 }}>{aLabel}</span>
                                                                    <span style={{ fontSize: '0.65rem', color: '#555' }}>{isAspectOpen ? '▲' : '▼'}</span>
                                                                </div>
                                                                {isAspectOpen && (
                                                                    <div style={{ paddingLeft: 10 }}>
                                                                        {PERSONAL_PLANET_OPTIONS.map(({ code: nCode, label: nLabel }) => (
                                                                            <NavLink key={nCode}
                                                                                to={`/transits/planets/${pCode}/aspects/${aCode}/natal/${nCode}`}
                                                                                style={({ isActive }) => ({
                                                                                    ...leafItemStyle,
                                                                                    color: isActive ? '#D4AF37' : '#5A5A80',
                                                                                    backgroundColor: isActive ? '#252540' : 'transparent',
                                                                                    borderLeft: isActive ? '2px solid #D4AF37' : '2px solid transparent',
                                                                                })}>
                                                                                本命{nLabel}
                                                                            </NavLink>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* 收合狀態 icon */}
                {collapsed && (
                    <>
                        <div onClick={handleElemClick} style={{
                            display: 'flex', justifyContent: 'center',
                            padding: '12px 0', cursor: 'pointer',
                            color: isOnElement ? '#D4AF37' : '#B0A8C8', position: 'relative',
                        }}>
                            <span style={{ fontSize: '1rem' }}>📖</span>
                            <span style={tooltipStyle} className="navbar-tooltip">元素解析</span>
                        </div>
                        <div onClick={handleTransitClick} style={{
                            display: 'flex', justifyContent: 'center',
                            padding: '12px 0', cursor: 'pointer',
                            color: isOnTransit ? '#D4AF37' : '#B0A8C8', position: 'relative',
                        }}>
                            <span style={{ fontSize: '1rem' }}>🔄</span>
                            <span style={tooltipStyle} className="navbar-tooltip">行運解析</span>
                        </div>
                    </>
                )}
            </nav>

            {!collapsed && (
                <div style={{ padding: '10px 16px', borderTop: '1px solid #2D2D45', fontSize: '0.7rem', color: '#555' }}>
                    v15
                </div>
            )}

            <style>{`
                nav a:hover { background-color: #2A2A40 !important; color: #D4AF37 !important; }
                nav a:hover .navbar-tooltip { display: block !important; }
            `}</style>
        </div>
    )
}

const menuItemStyle = {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 16px', cursor: 'pointer',
    fontSize: '0.88rem', fontWeight: 400,
    whiteSpace: 'nowrap', transition: 'background 0.15s, color 0.15s',
    userSelect: 'none',
}

const subMenuItemStyle = {
    display: 'flex', alignItems: 'center',
    padding: '7px 10px', cursor: 'pointer',
    fontSize: '0.84rem', whiteSpace: 'nowrap',
    transition: 'color 0.15s', userSelect: 'none',
}

const leafItemStyle = {
    display: 'block', padding: '5px 8px',
    textDecoration: 'none', fontSize: '0.78rem',
    whiteSpace: 'nowrap', transition: 'color 0.15s',
}

const tooltipStyle = {
    position: 'absolute', left: '100%', top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#2D2D45', color: '#E8E0F0',
    padding: '4px 10px', borderRadius: 4,
    fontSize: '0.8rem', whiteSpace: 'nowrap',
    zIndex: 1000, display: 'none', pointerEvents: 'none',
}
