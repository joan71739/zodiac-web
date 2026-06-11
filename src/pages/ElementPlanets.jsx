// ElementPlanets.jsx — 十大行星頁
// 路由：/elements/planets
// 說明：第一批只放匯入匯出按鈕（佔位），功能第二批實作

import { Alert } from 'react-bootstrap'
import { SIGN_OPTIONS } from '../utils/codeMap'

// 第一批七顆行星
const PLANET_OPTIONS_7 = [
    { code: 'Q', label: '太陽', icon: '☀️' },
    { code: 'W', label: '月亮', icon: '🌙' },
    { code: 'E', label: '水星', icon: '☿' },
    { code: 'R', label: '金星', icon: '♀' },
    { code: 'T', label: '火星', icon: '♂' },
    { code: 'Y', label: '木星', icon: '♃' },
    { code: 'U', label: '土星', icon: '♄' },
]

export default function ElementPlanets() {
    const handleExport = () => {
        alert('匯出功能開發中（第二批）')
    }

    const handleImport = () => {
        alert('匯入功能開發中（第二批）')
    }

    return (
        <div style={{ padding: '32px 40px', color: '#E8E0F0' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 style={{ color: '#D4AF37', margin: 0 }}>☀️ 十大行星</h4>
                <div className="d-flex gap-2">
                    <button onClick={handleImport} style={btnStyle}>
                        ⬆ 匯入 JSON
                    </button>
                    <button onClick={handleExport} style={btnStyle}>
                        ⬇ 匯出 JSON
                    </button>
                </div>
            </div>

            <Alert variant="secondary" style={{ backgroundColor: '#1C1C2E', border: '1px solid #2D2D45', color: '#888', fontSize: '0.82rem' }}>
                匯入 / 匯出功能開發中，請點擊左側行星展開星座進入解析頁面
            </Alert>

            {/* 行星列表 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24 }}>
                {PLANET_OPTIONS_7.map(({ code, label, icon }) => (
                    <div key={code} style={planetCardStyle}>
                        <span style={{ marginRight: 6 }}>{icon}</span>
                        {label}
                        <div style={{ fontSize: '0.72rem', color: '#555', marginTop: 4 }}>
                            {SIGN_OPTIONS.map(s => s.label.replace('座', '')).join(' ')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const btnStyle = {
    backgroundColor: '#2D2D45',
    border: '1px solid #3D3D55',
    color: '#B0A8C8',
    padding: '6px 14px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '0.82rem',
}

const planetCardStyle = {
    backgroundColor: '#1C1C2E',
    border: '1px solid #2D2D45',
    borderRadius: 6,
    padding: '12px 20px',
    color: '#E8E0F0',
    fontSize: '0.88rem',
    minWidth: 120,
}
