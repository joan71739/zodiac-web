// PlanetIndex.jsx — 各行星入口頁
import { useParams, useNavigate } from 'react-router-dom'
import { PLANET_7_OPTIONS, SIGN_OPTIONS } from '../utils/codeMap'
import NavCard from '../styles/navCard'

const PLANET_7 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U']
const PLANET_ICON = { Q: '☀️', W: '🌙', E: '☿', R: '♀', T: '♂', Y: '♃', U: '♄' }

export default function PlanetIndex() {
    const { planetKey } = useParams()
    const navigate = useNavigate()
    const planet = PLANET_7_OPTIONS.find(p => p.code === planetKey)

    if (!planet || !PLANET_7.includes(planetKey)) {
        return (
            <div style={{ padding: '32px 40px', color: '#E8E0F0' }}>
                <p>找不到此行星代碼：{planetKey}</p>
                <button onClick={() => navigate('/elements/planets')} style={backBtnStyle}>← 返回十大行星</button>
            </div>
        )
    }

    return (
        <div style={{ padding: '32px 40px', color: '#E8E0F0' }}>
            <div className="d-flex align-items-center gap-3 mb-4">
                <button onClick={() => navigate('/elements/planets')} style={backBtnStyle}>← 十大行星</button>
                <h4 style={{ color: '#D4AF37', margin: 0 }}>{PLANET_ICON[planetKey]} {planet.label}</h4>
            </div>
            <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: 28 }}>
                選擇星座，進入 {planet.label} × 星座解析頁面
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {SIGN_OPTIONS.map(({ code, label }) => (
                    <NavCard key={code} onClick={() => navigate(`/elements/planets/${planetKey}/signs/${code}`)}>
                        {label}
                    </NavCard>
                ))}
            </div>
        </div>
    )
}

const backBtnStyle = {
    background: 'none', border: '1px solid #2D2D45',
    color: '#B0A8C8', padding: '4px 12px',
    borderRadius: 4, cursor: 'pointer', fontSize: '0.82rem',
}
