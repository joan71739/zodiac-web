// PlanetIndex.jsx — 各行星入口頁
// 路由：/elements/planets/:planetKey
// 說明：顯示該行星標題 + 12 個星座按鈕，點擊進入 PlanetSignNotes

import { useParams, useNavigate } from 'react-router-dom'
import { PLANET_7_OPTIONS, SIGN_OPTIONS } from '../utils/codeMap'

const PLANET_7 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U']

const PLANET_ICON = {
    Q: '☀️', W: '🌙', E: '☿', R: '♀', T: '♂', Y: '♃', U: '♄',
}

export default function PlanetIndex() {
    const { planetKey } = useParams()
    const navigate = useNavigate()

    const planet = PLANET_7_OPTIONS.find(p => p.code === planetKey)

    if (!planet || !PLANET_7.includes(planetKey)) {
        return (
            <div style={{ padding: '32px 40px', color: '#E8E0F0' }}>
                <p>找不到此行星代碼：{planetKey}</p>
                <button onClick={() => navigate('/elements/planets')} style={backBtnStyle}>
                    ← 返回十大行星
                </button>
            </div>
        )
    }

    return (
        <div style={{ padding: '32px 40px', color: '#E8E0F0' }}>
            {/* 頁首 */}
            <div className="d-flex align-items-center gap-3 mb-4">
                <button onClick={() => navigate('/elements/planets')} style={backBtnStyle}>
                    ← 十大行星
                </button>
                <h4 style={{ color: '#D4AF37', margin: 0 }}>
                    {PLANET_ICON[planetKey]} {planet.label}
                </h4>
            </div>

            <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: 28 }}>
                選擇星座，進入 {planet.label} × 星座解析頁面
            </p>

            {/* 12 個星座按鈕 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {SIGN_OPTIONS.map(({ code, label }) => (
                    <button
                        key={code}
                        onClick={() => navigate(`/elements/planets/${planetKey}/signs/${code}`)}
                        style={signCardStyle}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#D4AF37'
                            e.currentTarget.style.color = '#D4AF37'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#2D2D45'
                            e.currentTarget.style.color = '#E8E0F0'
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>
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

const signCardStyle = {
    backgroundColor: '#1C1C2E',
    border: '1px solid #2D2D45',
    borderRadius: 6,
    padding: '12px 24px',
    color: '#E8E0F0',
    fontSize: '0.92rem',
    cursor: 'pointer',
    minWidth: 110,
    textAlign: 'center',
    transition: 'border-color 0.15s, color 0.15s',
}
