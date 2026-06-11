// TransitHouseNotes.jsx — 行運星 × 過境宮位解析頁
// 路由：/transits/planets/:transitPlanet/houses
// 改版說明：從各宮各自一頁，改為單一頁面內含 13 個 Tab（詳細資料 + 一宮~十二宮）

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PLANET_CODE_MAP } from '../utils/codeMap'
import TransitNoteBlock from '../components/TransitNoteBlock'

const TABS = [
    { key: 'detail', label: '詳細資料', transitHouse: null },
    { key: 'house1', label: '一宮', transitHouse: 1 },
    { key: 'house2', label: '二宮', transitHouse: 2 },
    { key: 'house3', label: '三宮', transitHouse: 3 },
    { key: 'house4', label: '四宮', transitHouse: 4 },
    { key: 'house5', label: '五宮', transitHouse: 5 },
    { key: 'house6', label: '六宮', transitHouse: 6 },
    { key: 'house7', label: '七宮', transitHouse: 7 },
    { key: 'house8', label: '八宮', transitHouse: 8 },
    { key: 'house9', label: '九宮', transitHouse: 9 },
    { key: 'house10', label: '十宮', transitHouse: 10 },
    { key: 'house11', label: '十一宮', transitHouse: 11 },
    { key: 'house12', label: '十二宮', transitHouse: 12 },
]

export default function TransitHouseNotes() {
    const { transitPlanet } = useParams()
    const navigate = useNavigate()
    const [activeKey, setActiveKey] = useState('detail')

    const transitLabel = PLANET_CODE_MAP[transitPlanet] ?? transitPlanet
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
                <span style={{ color: '#B0A8C8', fontSize: '0.85rem' }}>過境宮位</span>
            </div>

            <h5 style={{ color: '#D4AF37', marginBottom: 24 }}>
                {transitLabel} 過境宮位
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
                aspectType={null}
                natalPlanet={null}
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