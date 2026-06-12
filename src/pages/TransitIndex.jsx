// TransitIndex.jsx — 行運解析首頁
import { useNavigate } from 'react-router-dom'
import { OUTER_PLANET_OPTIONS } from '../utils/codeMap'
import NavCard from '../styles/navCard'

export default function TransitIndex() {
    const navigate = useNavigate()
    return (
        <div style={{ padding: '32px 40px', color: '#E8E0F0' }}>
            <h4 style={{ color: '#D4AF37', marginBottom: 24 }}>🔄 行運解析</h4>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: 32 }}>
                選擇左側行星進入解析頁面，或點擊下方快速入口。
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {OUTER_PLANET_OPTIONS.map(({ code, label }) => (
                    <NavCard key={code} onClick={() => navigate(`/transits/planets/${code}`)}>
                        {label}
                    </NavCard>
                ))}
            </div>
        </div>
    )
}
