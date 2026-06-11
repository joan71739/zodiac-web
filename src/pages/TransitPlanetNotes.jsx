// TransitPlanetNotes.jsx — 行運星 × 相位 × 本命星解析頁
// 路由：/transits/planets/:transitPlanet/aspects/:aspectType/natal/:natalPlanet
// Fix：移除 maxWidth: 900，改用自訂 tab 列（nowrap + overflow-x: auto），解決提早換行問題

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PLANET_CODE_MAP, ASPECT_CODE_MAP } from '../utils/codeMap'
import TransitNoteBlock from '../components/TransitNoteBlock'

const TABS = [
    { key: 'detail', label: '詳細資料', transitHouse: null },
    { key: 'house1', label: '過境一宮', transitHouse: 1 },
    { key: 'house2', label: '過境二宮', transitHouse: 2 },
    { key: 'house3', label: '過境三宮', transitHouse: 3 },
    { key: 'house4', label: '過境四宮', transitHouse: 4 },
    { key: 'house5', label: '過境五宮', transitHouse: 5 },
    { key: 'house6', label: '過境六宮', transitHouse: 6 },
    { key: 'house7', label: '過境七宮', transitHouse: 7 },
    { key: 'house8', label: '過境八宮', transitHouse: 8 },
    { key: 'house9', label: '過境九宮', transitHouse: 9 },
    { key: 'house10', label: '過境十宮', transitHouse: 10 },
    { key: 'house11', label: '過境十一宮', transitHouse: 11 },
    { key: 'house12', label: '過境十二宮', transitHouse: 12 },
]

export default function TransitPlanetNotes() {
    const { transitPlanet, aspectType, natalPlanet } = useParams()
    const navigate = useNavigate()
    const [activeKey, setActiveKey] = useState('detail')

    const transitLabel = PLANET_CODE_MAP[transitPlanet] ?? transitPlanet
    const aspectLabel = ASPECT_CODE_MAP[aspectType] ?? aspectType
    const natalLabel = PLANET_CODE_MAP[natalPlanet] ?? natalPlanet

    const activeTab = TABS.find(t => t.key === activeKey) ?? TABS[0]

    return (
        <div style={{ padding: '32px 40px', color: '#E8E0F0' }}>
            {/* 麵包屑 */}
            <div className="d-flex align-items-center gap-2 mb-4" style={{ flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/transits')} style={backBtnStyle}>
                    ← 行運解析
                </button>
                <span style={{ color: '#444' }}>/</span>
                <span style={{ color: '#D4AF37', fontSize: '0.85rem' }}>{transitLabel}</span>
                <span style={{ color: '#444' }}>/</span>
                <span style={{ color: '#D4AF37', fontSize: '0.85rem' }}>{aspectLabel}</span>
                <span style={{ color: '#444' }}>/</span>
                <span style={{ color: '#B0A8C8', fontSize: '0.85rem' }}>本命{natalLabel}</span>
            </div>

            <h5 style={{ color: '#D4AF37', marginBottom: 24 }}>
                {transitLabel} {aspectLabel} 本命{natalLabel}
            </h5>

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
            <TransitNoteBlock
                key={activeKey}
                transitPlanet={transitPlanet}
                aspectType={aspectType}
                natalPlanet={natalPlanet}
                transitHouse={activeTab.transitHouse}
            />
        </div>
    )
}

const backBtnStyle = {
    background: 'none',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    fontSize: '0.85rem',
    padding: 0,
}