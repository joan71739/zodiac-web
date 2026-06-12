// ElementIndex.jsx — 元素解析首頁
import { useNavigate } from 'react-router-dom'
import NavCard from '../styles/navCard'

export default function ElementIndex() {
    const navigate = useNavigate()
    return (
        <div style={{ padding: '32px 40px', color: '#E8E0F0' }}>
            <h4 style={{ color: '#D4AF37', marginBottom: 8 }}>📖 元素解析</h4>
            <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: 32 }}>
                選擇左側「十二星座」或「十大行星」開始撰寫解析
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
                <NavCard onClick={() => navigate('/elements/signs')} style={{ padding: '24px 32px', minWidth: 180 }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>♈</div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>十二星座</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                        牡羊 金牛 雙子 巨蟹 獅子 處女<br />
                        天秤 天蠍 射手 摩羯 水瓶 雙魚
                    </div>
                </NavCard>
                <NavCard onClick={() => navigate('/elements/planets')} style={{ padding: '24px 32px', minWidth: 180 }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>☀️</div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>十大行星</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                        太陽 月亮 水星 金星 火星<br />
                        木星 土星
                    </div>
                </NavCard>
            </div>
        </div>
    )
}
