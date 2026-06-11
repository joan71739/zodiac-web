// ElementSigns.jsx — 十二星座頁
// 路由：/elements/signs
// 說明：第一批只放匯入匯出按鈕（佔位），功能第二批實作

import { Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { SIGN_OPTIONS } from '../utils/codeMap'

export default function ElementSigns() {
    const navigate = useNavigate()

    const handleExport = () => {
        alert('匯出功能開發中（第二批）')
    }

    const handleImport = () => {
        alert('匯入功能開發中（第二批）')
    }

    return (
        <div style={{ padding: '32px 40px', color: '#E8E0F0' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 style={{ color: '#D4AF37', margin: 0 }}>♈ 十二星座</h4>
                <div className="d-flex gap-2">
                    <button onClick={handleImport} style={btnStyle('#2D2D45')}>
                        ⬆ 匯入 JSON
                    </button>
                    <button onClick={handleExport} style={btnStyle('#2D2D45')}>
                        ⬇ 匯出 JSON
                    </button>
                </div>
            </div>

            <Alert variant="secondary" style={{ backgroundColor: '#1C1C2E', border: '1px solid #2D2D45', color: '#888', fontSize: '0.82rem' }}>
                匯入 / 匯出功能開發中，請點擊左側星座進入解析頁面
            </Alert>

            {/* 星座快速入口 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24 }}>
                {SIGN_OPTIONS.map(({ code, label }) => (
                    <div
                        key={code}
                        onClick={() => navigate(`/elements/signs/${code}`)}
                        style={signCardStyle}
                    >
                        {label}
                    </div>
                ))}
            </div>
        </div>
    )
}

const btnStyle = (bg) => ({
    backgroundColor: bg,
    border: '1px solid #3D3D55',
    color: '#B0A8C8',
    padding: '6px 14px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '0.82rem',
})

const signCardStyle = {
    backgroundColor: '#1C1C2E',
    border: '1px solid #2D2D45',
    borderRadius: 6,
    padding: '10px 20px',
    cursor: 'pointer',
    color: '#E8E0F0',
    fontSize: '0.88rem',
    transition: 'border 0.15s',
}
