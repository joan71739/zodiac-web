// ReferencePanel.jsx — 解析參考面板（右側）
//
// 結構：
//   ▼ 上升天秤座
//     ├── 一宮 天秤座 ▶  → [星座特性段落]
//     ├── 二宮 天蠍座 ▶
//     └── ...
//
//   ▼ ☉ 太陽（獅子座 · 十宮）
//     ├── 獅子座特性 ▶
//     ├── 獅子座 × 十宮 ▶
//     └── 太陽 × 獅子座 × 十宮 ▶

import { useState, useEffect } from 'react'
import { Spinner, Alert } from 'react-bootstrap'
import { getReferencePanel } from '../api/referencePanel'

// 宮位中文數字對照
const HOUSE_NUM_LABELS = {
    1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六',
    7: '七', 8: '八', 9: '九', 10: '十', 11: '十一', 12: '十二',
}

// 行星符號對照
const PLANET_SYMBOLS = {
    Q: '☉', W: '☽', E: '☿', R: '♀', T: '♂',
    Y: '♃', U: '♄', I: '♅', O: '♆', P: '♇',
}

export default function ReferencePanel({ clientId }) {
    const [data,     setData]     = useState(null)
    const [loading,  setLoading]  = useState(true)
    const [errorMsg, setErrorMsg] = useState('')

    // 展開狀態
    const [ascOpen,        setAscOpen]        = useState(true)
    const [openHouses,     setOpenHouses]     = useState({})     // { houseNumber: bool }
    const [openPlanets,    setOpenPlanets]    = useState({})     // { planet: bool }
    const [openPlanetSubs, setOpenPlanetSubs] = useState({})     // { 'Q-sign': bool, 'Q-signHouse': bool, 'Q-all': bool }

    useEffect(() => {
        if (!clientId) return
        const fetch = async () => {
            setLoading(true)
            try {
                const res = await getReferencePanel(clientId)
                setData(res.data)
            } catch {
                setErrorMsg('載入參考資料失敗')
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [clientId])

    const toggleHouse = (num) =>
        setOpenHouses(p => ({ ...p, [num]: !p[num] }))

    const togglePlanet = (planet) =>
        setOpenPlanets(p => ({ ...p, [planet]: !p[planet] }))

    const togglePlanetSub = (key) =>
        setOpenPlanetSubs(p => ({ ...p, [key]: !p[key] }))

    if (loading) return (
        <div className="text-center py-4">
            <Spinner animation="border" size="sm" />
        </div>
    )

    if (errorMsg) return (
        <Alert variant="danger" className="py-2">{errorMsg}</Alert>
    )

    if (!data) return null

    const { ascSection, planetSections } = data

    return (
        <div style={{ fontSize: '0.82rem', color: '#E8E0F0' }}>

            {/* ── 上升區塊 ── */}
            <SectionHeader
                label={`上升 ${ascSection.ascSignLabel ?? ''}`}
                isOpen={ascOpen}
                onToggle={() => setAscOpen(p => !p)}
                color="#D4AF37"
            />

            {ascOpen && ascSection.houses?.map(h => (
                <div key={h.houseNumber} style={{ paddingLeft: 12 }}>
                    <SubHeader
                        label={`${HOUSE_NUM_LABELS[h.houseNumber] ?? h.houseNumber}宮 ${h.houseSignLabel}`}
                        isOpen={!!openHouses[h.houseNumber]}
                        onToggle={() => toggleHouse(h.houseNumber)}
                        isEmpty={!h.notes?.length}
                    />
                    {openHouses[h.houseNumber] && (
                        <NoteList notes={h.notes} />
                    )}
                </div>
            ))}

            <Divider />

            {/* ── 行星區塊 ── */}
            {planetSections?.map(ps => (
                <div key={ps.planet}>
                    <SectionHeader
                        label={`${PLANET_SYMBOLS[ps.planet] ?? ''} ${ps.planetLabel}（${ps.signLabel} · ${HOUSE_NUM_LABELS[ps.house] ?? ps.house}宮）`}
                        isOpen={!!openPlanets[ps.planet]}
                        onToggle={() => togglePlanet(ps.planet)}
                        color="#B0A8C8"
                    />

                    {openPlanets[ps.planet] && (
                        <div style={{ paddingLeft: 12 }}>
                            {/* 第一層：星座特性 */}
                            <SubHeader
                                label={`${ps.signLabel}特性`}
                                isOpen={!!openPlanetSubs[`${ps.planet}-sign`]}
                                onToggle={() => togglePlanetSub(`${ps.planet}-sign`)}
                                isEmpty={!ps.signNotes?.length}
                            />
                            {openPlanetSubs[`${ps.planet}-sign`] && (
                                <NoteList notes={ps.signNotes} />
                            )}

                            {/* 第二層：星座×宮位 */}
                            <SubHeader
                                label={`${ps.signLabel} × ${HOUSE_NUM_LABELS[ps.house] ?? ps.house}宮`}
                                isOpen={!!openPlanetSubs[`${ps.planet}-signHouse`]}
                                onToggle={() => togglePlanetSub(`${ps.planet}-signHouse`)}
                                isEmpty={!ps.signHouseNotes?.length}
                            />
                            {openPlanetSubs[`${ps.planet}-signHouse`] && (
                                <NoteList notes={ps.signHouseNotes} />
                            )}

                            {/* 第三層：行星×星座×宮位 */}
                            <SubHeader
                                label={`${ps.planetLabel} × ${ps.signLabel} × ${HOUSE_NUM_LABELS[ps.house] ?? ps.house}宮`}
                                isOpen={!!openPlanetSubs[`${ps.planet}-all`]}
                                onToggle={() => togglePlanetSub(`${ps.planet}-all`)}
                                isEmpty={!ps.planetSignHouseNotes?.length}
                            />
                            {openPlanetSubs[`${ps.planet}-all`] && (
                                <NoteList notes={ps.planetSignHouseNotes} />
                            )}
                        </div>
                    )}

                    <Divider light />
                </div>
            ))}
        </div>
    )
}

// ── 子元件 ──────────────────────────────────────────────

function SectionHeader({ label, isOpen, onToggle, color = '#B0A8C8' }) {
    return (
        <div
            onClick={onToggle}
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '7px 8px',
                cursor: 'pointer',
                color,
                fontWeight: 600,
                borderRadius: 4,
                userSelect: 'none',
            }}
        >
            <span>{label}</span>
            <span style={{ fontSize: '0.7rem', color: '#555' }}>{isOpen ? '▲' : '▼'}</span>
        </div>
    )
}

function SubHeader({ label, isOpen, onToggle, isEmpty }) {
    return (
        <div
            onClick={onToggle}
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '5px 8px',
                cursor: 'pointer',
                color: isEmpty ? '#444' : '#9090B8',
                userSelect: 'none',
            }}
        >
            <span>{label}</span>
            <span style={{ fontSize: '0.65rem', color: isEmpty ? '#333' : '#555' }}>
                {isEmpty ? '（無資料）' : isOpen ? '▲' : '▼'}
            </span>
        </div>
    )
}

function NoteList({ notes }) {
    if (!notes?.length) return (
        <div style={{ padding: '4px 16px', color: '#444', fontSize: '0.78rem' }}>
            尚無資料
        </div>
    )
    return (
        <div style={{ paddingLeft: 16, paddingBottom: 4 }}>
            {notes.map(n => (
                <div
                    key={n.id}
                    style={{
                        padding: '6px 8px',
                        marginBottom: 4,
                        backgroundColor: '#1C1C2E',
                        borderLeft: '2px solid #2D2D45',
                        borderRadius: 2,
                    }}
                >
                    {n.title && (
                        <div style={{ color: '#D4AF37', fontWeight: 600, marginBottom: 2 }}>
                            {n.title}
                        </div>
                    )}
                    {n.content && (
                        <div style={{ color: '#B0A8C8', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                            {n.content}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

function Divider({ light }) {
    return (
        <div style={{
            borderTop: `1px solid ${light ? '#252535' : '#2D2D45'}`,
            margin: '4px 0',
        }} />
    )
}
