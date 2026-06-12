// ElementSigns.jsx — 十二星座頁
import { useNavigate } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import { SIGN_OPTIONS } from '../utils/codeMap'
import NavCard from '../styles/navCard'

export default function ElementSigns() {
    const navigate = useNavigate()
    return (
        <div style={{ padding: '32px 40px', color: '#E8E0F0' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 style={{ color: '#D4AF37', margin: 0 }}>♈ 十二星座</h4>
                <div className="d-flex gap-2">
                    <button onClick={() => alert('匯入功能開發中（第二批）')} style={toolBtnStyle}>⬆ 匯入 JSON</button>
                    <button onClick={() => alert('匯出功能開發中（第二批）')} style={toolBtnStyle}>⬇ 匯出 JSON</button>
                </div>
            </div>
            <Alert variant="secondary" style={{ backgroundColor: '#1C1C2E', border: '1px solid #2D2D45', color: '#888', fontSize: '0.82rem' }}>
                匯入 / 匯出功能開發中，請點擊下方或左側星座進入解析頁面
            </Alert>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24 }}>
                {SIGN_OPTIONS.map(({ code, label }) => (
                    <NavCard key={code} onClick={() => navigate(`/elements/signs/${code}`)}>
                        {label}
                    </NavCard>
                ))}
            </div>
        </div>
    )
}

const toolBtnStyle = {
    backgroundColor: '#2D2D45', border: '1px solid #3D3D55',
    color: '#B0A8C8', padding: '6px 14px',
    borderRadius: 4, cursor: 'pointer', fontSize: '0.82rem',
}
