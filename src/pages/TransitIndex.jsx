// TransitIndex.jsx — 行運解析首頁
// 路由：/transits
// 內容：導覽入口（同 ElementIndex）

import { useNavigate } from 'react-router-dom'

const OUTER_PLANETS = [
    { code: 'Y', label: '木星' },
    { code: 'U', label: '土星' },
    { code: 'I', label: '天王星' },
    { code: 'O', label: '海王星' },
    { code: 'P', label: '冥王星' },
]

export default function TransitIndex() {
    const navigate = useNavigate()

    return (
        <div style={{ padding: '32px 40px', color: '#E8E0F0' }}>
            <h4 style={{ color: '#D4AF37', marginBottom: 24 }}>🔄 行運解析</h4>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: 32 }}>
                選擇左側行星進入解析頁面，或點擊下方快速入口。
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {OUTER_PLANETS.map(({ code, label }) => (
                    <div
                        key={code}
                        onClick={() => navigate(`/transits/planets/${code}`)}
                        style={cardStyle}
                    >
                        {label}
                    </div>
                ))}
            </div>
        </div>
    )
}

const cardStyle = {
    backgroundColor: '#1C1C2E',
    border: '1px solid #2D2D45',
    borderRadius: 6,
    padding: '10px 24px',
    cursor: 'pointer',
    color: '#E8E0F0',
    fontSize: '0.88rem',
}
