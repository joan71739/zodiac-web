// ElementIndex.jsx — 元素解析首頁
// 路由：/elements
// 說明：導覽入口，引導使用者選擇「十二星座」或「十大行星」

import { useNavigate } from 'react-router-dom'

export default function ElementIndex() {
    const navigate = useNavigate()

    return (
        <div style={{ padding: '32px 40px', color: '#E8E0F0' }}>
            <h4 style={{ color: '#D4AF37', marginBottom: 8 }}>📖 元素解析</h4>
            <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: 32 }}>
                選擇左側「十二星座」或「十大行星」開始撰寫解析
            </p>

            <div style={{ display: 'flex', gap: 16 }}>
                <div
                    onClick={() => navigate('/elements/signs')}
                    style={cardStyle}
                >
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>♈</div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>十二星座</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>
                        牡羊 金牛 雙子 巨蟹 獅子 處女<br />
                        天秤 天蠍 射手 摩羯 水瓶 雙魚
                    </div>
                </div>

                <div
                    onClick={() => navigate('/elements/planets')}
                    style={cardStyle}
                >
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>☀️</div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>十大行星</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>
                        太陽 月亮 水星 金星 火星<br />
                        木星 土星
                    </div>
                </div>
            </div>
        </div>
    )
}

const cardStyle = {
    backgroundColor: '#1C1C2E',
    border: '1px solid #2D2D45',
    borderRadius: 8,
    padding: '24px 32px',
    cursor: 'pointer',
    minWidth: 180,
    transition: 'border 0.15s, background 0.15s',
    color: '#E8E0F0',
}
