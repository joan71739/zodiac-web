// ============================================================
// Navbar.jsx — v12
// 修改說明：新增「行運解析」展開選單
//   - 行運解析：點擊跳頁 /transits + 展開子選單
//   - 各外行星：點擊只展開/收合，不跳頁
//   - 過境宮位：點擊跳頁 /transits/planets/:planet/houses/:house
//   - 各相位：點擊只展開/收合，不跳頁
//   - 本命星：點擊跳頁 /transits/planets/:planet/aspects/:aspect/natal/:natal
// ============================================================

import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { SIGN_OPTIONS } from '../utils/codeMap';

// 元素解析：第一批七顆行星
const PLANETS_7 = [
    { code: 'Q', label: '太陽' },
    { code: 'W', label: '月亮' },
    { code: 'E', label: '水星' },
    { code: 'R', label: '金星' },
    { code: 'T', label: '火星' },
    { code: 'Y', label: '木星' },
    { code: 'U', label: '土星' },
]

// 行運解析：外行星
const OUTER_PLANETS = [
    { code: 'Y', label: '木星' },
    { code: 'U', label: '土星' },
    { code: 'I', label: '天王星' },
    { code: 'O', label: '海王星' },
    { code: 'P', label: '冥王星' },
]

// 行運解析：相位
const ASPECTS = [
    { code: 'q', label: '合相' },
    { code: 'w', label: '對分相' },
    { code: 'e', label: '三分相' },
    { code: 'r', label: '四分相' },
    { code: 't', label: '六分相' },
]

// 行運解析：本命個人行星
const PERSONAL_PLANETS = [
    { code: 'Q', label: '太陽' },
    { code: 'W', label: '月亮' },
    { code: 'E', label: '水星' },
    { code: 'R', label: '金星' },
    { code: 'T', label: '火星' },
]

// 過境宮位
const HOUSES = [
    { num: 1, label: '一宮' }, { num: 2, label: '二宮' }, { num: 3, label: '三宮' },
    { num: 4, label: '四宮' }, { num: 5, label: '五宮' }, { num: 6, label: '六宮' },
    { num: 7, label: '七宮' }, { num: 8, label: '八宮' }, { num: 9, label: '九宮' },
    { num: 10, label: '十宮' }, { num: 11, label: '十一宮' }, { num: 12, label: '十二宮' },
]

const NAV_ITEMS = [
    { to: '/',       label: '客戶列表', icon: '👥' },
    { to: '/search', label: '行星篩選', icon: '🔍' },
    { to: '/backup', label: '備份管理', icon: '💾' },
]

export default function Navbar() {
    const [collapsed,        setCollapsed]        = useState(false)
    // 元素解析
    const [elemOpen,         setElemOpen]         = useState(false)
    const [signsOpen,        setSignsOpen]        = useState(false)
    const [planetsOpen,      setPlanetsOpen]      = useState(false)
    const [openPlanetCode,   setOpenPlanetCode]   = useState(null)
    // 行運解析
    const [transitOpen,      setTransitOpen]      = useState(false)
    const [openTransitPlanet, setOpenTransitPlanet] = useState(null)   // 展開中的外行星
    const [openHousesFor,    setOpenHousesFor]    = useState(null)     // 展開宮位的行星
    const [openAspectKey,    setOpenAspectKey]    = useState(null)     // 'Y-q' 格式

    const location = useLocation()
    const navigate = useNavigate()

    const isOnElement = location.pathname.startsWith('/elements')
    const isOnTransit = location.pathname.startsWith('/transits')
    const width = collapsed ? 56 : 220

    // ── 元素解析 handlers ────────────────────────────
    const handleElemClick    = () => { navigate('/elements');        setElemOpen(p => !p) }
    const handleSignsClick   = () => { navigate('/elements/signs');  setSignsOpen(p => !p) }
    const handlePlanetsClick = () => { navigate('/elements/planets'); setPlanetsOpen(p => !p) }
    const handlePlanetClick  = (code) => setOpenPlanetCode(p => p === code ? null : code)

    // ── 行運解析 handlers ────────────────────────────
    const handleTransitClick = () => { navigate('/transits'); setTransitOpen(p => !p) }
    const handleTransitPlanetClick = (code) => {
        setOpenTransitPlanet(p => p === code ? null : code)
        setOpenHousesFor(null)
        setOpenAspectKey(null)
    }
    const handleHousesToggle = (planetCode) => {
        setOpenHousesFor(p => p === planetCode ? null : planetCode)
    }
    const handleAspectToggle = (planetCode, aspectCode) => {
        const key = `${planetCode}-${aspectCode}`
        setOpenAspectKey(p => p === key ? null : key)
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
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1rem', padding: 0, lineHeight: 1 }}
                >
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
                                            <NavLink key={code} to={`/elements/signs/${code}`} style={({ isActive }) => ({
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
                                        {PLANETS_7.map(({ code, label }) => {
                                            const isOpen = openPlanetCode === code
                                            return (
                                                <div key={code}>
                                                    <div onClick={() => handlePlanetClick(code)} style={{
                                                        ...subMenuItemStyle,
                                                        color: '#8080B0', fontSize: '0.82rem',
                                                    }}>
                                                        <span style={{ flex: 1 }}>{label}</span>
                                                        <span style={{ fontSize: '0.65rem', color: '#555' }}>{isOpen ? '▲' : '▼'}</span>
                                                    </div>
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

                {/* ── 行運解析（新增）── */}
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
                                {OUTER_PLANETS.map(({ code: pCode, label: pLabel }) => {
                                    const isPlanetOpen = openTransitPlanet === pCode
                                    const isHousesOpen = openHousesFor === pCode

                                    return (
                                        <div key={pCode}>
                                            {/* 外行星：展開/收合 */}
                                            <div onClick={() => handleTransitPlanetClick(pCode)} style={{
                                                ...subMenuItemStyle,
                                                color: '#9090B8',
                                            }}>
                                                <span style={{ flex: 1 }}>{pLabel}</span>
                                                <span style={{ fontSize: '0.65rem', color: '#555' }}>{isPlanetOpen ? '▲' : '▼'}</span>
                                            </div>

                                            {isPlanetOpen && (
                                                <div style={{ paddingLeft: 10 }}>

                                                    {/* 過境宮位 */}
                                                    <div onClick={() => handleHousesToggle(pCode)} style={{
                                                        ...subMenuItemStyle,
                                                        color: '#8080B0', fontSize: '0.82rem',
                                                    }}>
                                                        <span style={{ flex: 1 }}>過境宮位</span>
                                                        <span style={{ fontSize: '0.65rem', color: '#555' }}>{isHousesOpen ? '▲' : '▼'}</span>
                                                    </div>
                                                    {isHousesOpen && (
                                                        <div style={{ paddingLeft: 10 }}>
                                                            {HOUSES.map(({ num, label: hLabel }) => (
                                                                <NavLink
                                                                    key={num}
                                                                    to={`/transits/planets/${pCode}/houses/${num}`}
                                                                    style={({ isActive }) => ({
                                                                        ...leafItemStyle,
                                                                        color: isActive ? '#D4AF37' : '#5A5A80',
                                                                        backgroundColor: isActive ? '#252540' : 'transparent',
                                                                        borderLeft: isActive ? '2px solid #D4AF37' : '2px solid transparent',
                                                                    })}
                                                                >
                                                                    {hLabel}
                                                                </NavLink>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* 各相位 */}
                                                    {ASPECTS.map(({ code: aCode, label: aLabel }) => {
                                                        const aspectKey = `${pCode}-${aCode}`
                                                        const isAspectOpen = openAspectKey === aspectKey
                                                        return (
                                                            <div key={aCode}>
                                                                <div onClick={() => handleAspectToggle(pCode, aCode)} style={{
                                                                    ...subMenuItemStyle,
                                                                    color: '#8080B0', fontSize: '0.82rem',
                                                                }}>
                                                                    <span style={{ flex: 1 }}>{aLabel}</span>
                                                                    <span style={{ fontSize: '0.65rem', color: '#555' }}>{isAspectOpen ? '▲' : '▼'}</span>
                                                                </div>
                                                                {isAspectOpen && (
                                                                    <div style={{ paddingLeft: 10 }}>
                                                                        {PERSONAL_PLANETS.map(({ code: nCode, label: nLabel }) => (
                                                                            <NavLink
                                                                                key={nCode}
                                                                                to={`/transits/planets/${pCode}/aspects/${aCode}/natal/${nCode}`}
                                                                                style={({ isActive }) => ({
                                                                                    ...leafItemStyle,
                                                                                    color: isActive ? '#D4AF37' : '#5A5A80',
                                                                                    backgroundColor: isActive ? '#252540' : 'transparent',
                                                                                    borderLeft: isActive ? '2px solid #D4AF37' : '2px solid transparent',
                                                                                })}
                                                                            >
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

            {/* 底部版本 */}
            {!collapsed && (
                <div style={{ padding: '10px 16px', borderTop: '1px solid #2D2D45', fontSize: '0.7rem', color: '#555' }}>
                    v12
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
