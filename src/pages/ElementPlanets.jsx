// ElementPlanets.jsx — 十大行星總覽頁
// 路由：/elements/planets
// 說明：行星卡片可點擊，跳至 /elements/planets/:planetKey

import { useNavigate } from 'react-router-dom'
import { Alert } from 'react-bootstrap'

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
    const navigate = useNavigate()

    return (
        <div style={{ padding: '32px 40px', color: '#E8E0F0' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 style={{ color: '#D4AF37', margin: 0 }}>☀️ 十大行星</h4>
                <div className="d-flex gap-2">
                    <button onClick={() => alert('匯入功能開發中（第二批）')} style={btnStyle}>
                        ⬆ 匯入 JSON
                    </button>
                    <button onClick={() => alert('匯出功能開發中（第二批）')} style={btnStyle}>
                        ⬇ 匯出 JSON
                    </button>
                </div>
            </div>

            <Alert variant="secondary" style={{
                backgroundColor: '#1C1C2E', border: '1px solid #2D2D45',
                color: '#888', fontSize: '0.82rem',
            }}>
                點擊行星進入各星座解析頁面，或從左側導覽列展開選擇
            </Alert>

            {/* 行星卡片（可點擊） */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 24 }}>
                {PLANET_OPTIONS_7.map(({ code, label, icon }) => (
                    <div
                        key={code}
                        onClick={() => navigate(`/elements/planets/${code}`)}
                        style={planetCardStyle}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#D4AF37'
                            e.currentTarget.style.color = '#D4AF37'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#2D2D45'
                            e.currentTarget.style.color = '#E8E0F0'
                        }}
                    >
                        <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{icon}</div>
                        <div style={{ fontWeight: 600 }}>{label}</div>
                        <div style={{ fontSize: '0.72rem', color: '#888', marginTop: 4 }}>
                            點擊查看 12 星座 →
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
    borderRadius: 8,
    padding: '16px 24px',
    color: '#E8E0F0',
    fontSize: '0.9rem',
    cursor: 'pointer',
    minWidth: 120,
    textAlign: 'center',
    transition: 'border-color 0.15s, color 0.15s',
}
