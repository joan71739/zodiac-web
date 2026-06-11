// PlanetSignNotes.jsx — 行星×星座解析頁
// 路由：/elements/planets/:planetKey/signs/:signKey
// Fix：移除 maxWidth: 900，改用自訂 tab 列（nowrap + overflow-x: auto），解決提早換行問題

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SIGN_OPTIONS, PLANET_OPTIONS } from '../utils/codeMap'
import ElementNoteBlock from '../components/ElementNoteBlock'

const PLANET_7 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U']

const TABS = [
    { key: 'trait', label: '星座特性', houseKey: null },
    { key: 'house1', label: '一宮', houseKey: 1 },
    { key: 'house2', label: '二宮', houseKey: 2 },
    { key: 'house3', label: '三宮', houseKey: 3 },
    { key: 'house4', label: '四宮', houseKey: 4 },
    { key: 'house5', label: '五宮', houseKey: 5 },
    { key: 'house6', label: '六宮', houseKey: 6 },
    { key: 'house7', label: '七宮', houseKey: 7 },
    { key: 'house8', label: '八宮', houseKey: 8 },
    { key: 'house9', label: '九宮', houseKey: 9 },
    { key: 'house10', label: '十宮', houseKey: 10 },
    { key: 'house11', label: '十一宮', houseKey: 11 },
    { key: 'house12', label: '十二宮', houseKey: 12 },
]

export default function PlanetSignNotes() {
    const { planetKey, signKey } = useParams()
    const navigate = useNavigate()
    const [activeKey, setActiveKey] = useState('trait')

    const planet = PLANET_OPTIONS.find(p => p.code === planetKey)
    const sign = SIGN_OPTIONS.find(s => s.code === signKey)

    if (!planet || !sign || !PLANET_7.includes(planetKey)) {
        return (
            <div style={{ padding: '32px 40px', color: '#E8E0F0' }}>
                <p>找不到此頁面：行星 {planetKey} / 星座 {signKey}</p>
                <button onClick={() => navigate('/elements/planets')} style={backBtnStyle}>
                    ← 返回十大行星
                </button>
            </div>
        )
    }

    const activeTab = TABS.find(t => t.key === activeKey) ?? TABS[0]

    return (
        <div style={{ padding: '32px 40px', color: '#E8E0F0' }}>
            {/* 麵包屑 */}
            <div className="d-flex align-items-center gap-2 mb-4" style={{ flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/elements/planets')} style={backBtnStyle}>
                    ← 十大行星
                </button>
                <span style={{ color: '#444' }}>/</span>
                <span style={{ color: '#D4AF37', fontSize: '0.85rem' }}>{planet.label}</span>
                <span style={{ color: '#444' }}>/</span>
                <span style={{ color: '#B0A8C8', fontSize: '0.85rem' }}>{sign.label}</span>
            </div>

            <h4 style={{ color: '#D4AF37', marginBottom: 24 }}>
                {planet.label} × {sign.label}
            </h4>

            {/* Tab 列：nowrap + overflow-x: auto，永不換行 */}
            <div style={{
                overflowX: 'auto',
                borderBottom: '1px solid #dee2e6',
                marginBottom: 20,
            }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    gap: 0,
                    minWidth: 'max-content',
                }}>
                    {TABS.map(({ key, label }) => {
                        const isActive = key === activeKey
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveKey(key)}
                                style={{
                                    padding: '8px 14px',
                                    border: 'none',
                                    borderBottom: isActive ? '2px solid #0d6efd' : '2px solid transparent',
                                    background: 'transparent',
                                    color: isActive ? '#0d6efd' : '#6c757d',
                                    fontWeight: isActive ? 600 : 400,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'color 0.15s, border-color 0.15s',
                                }}
                            >
                                {label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Tab 內容 */}
            <ElementNoteBlock
                key={activeKey}
                signKey={signKey}
                planetKey={planetKey}
                houseKey={activeTab.houseKey}
            />
        </div>
    )
}

const backBtnStyle = {
    background: 'none',
    border: '1px solid #2D2D45',
    color: '#B0A8C8',
    padding: '4px 12px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '0.82rem',
}