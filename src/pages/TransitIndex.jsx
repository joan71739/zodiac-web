// TransitIndex.jsx — 行運解析首頁
// 路由：/transits
// v2：加上匯入匯出按鈕，接上真實 API

import { useRef, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { OUTER_PLANET_OPTIONS } from '../utils/codeMap'
import { exportTransitNotes } from '../api/export'
import { importTransitNotes } from '../api/import'

export default function TransitIndex() {
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const [msg, setMsg] = useState(null)

    // ── 匯出 ────────────────────────────────────────────────
    const handleExport = async () => {
        try {
            await exportTransitNotes()
        } catch {
            setMsg({ type: 'danger', text: '匯出失敗，請稍後再試' })
        }
    }

    // ── 匯入 ────────────────────────────────────────────────
    const handleImportClick = () => fileInputRef.current?.click()

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        e.target.value = ''
        try {
            const res = await importTransitNotes(file)
            const { inserted, updated, skipped } = res.data
            setMsg({
                type: 'success',
                text: `匯入完成：新增 ${inserted} 筆、更新 ${updated} 筆、略過 ${skipped} 筆`
            })
        } catch {
            setMsg({ type: 'danger', text: '匯入失敗，請確認 JSON 格式正確' })
        }
    }

    return (
        <div style={{ padding: '32px 40px', color: '#E8E0F0' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 style={{ color: '#D4AF37', margin: 0 }}>🔄 行運解析</h4>
                <div className="d-flex gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <button onClick={handleImportClick} style={btnStyle}>
                        ⬆ 匯入 JSON
                    </button>
                    <button onClick={handleExport} style={btnStyle}>
                        ⬇ 匯出 JSON
                    </button>
                </div>
            </div>

            {msg && (
                <Alert
                    variant={msg.type}
                    dismissible
                    onClose={() => setMsg(null)}
                    style={{ fontSize: '0.84rem' }}
                >
                    {msg.text}
                </Alert>
            )}

            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: 24 }}>
                選擇左側行星進入解析頁面，或點擊下方快速入口。
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {OUTER_PLANET_OPTIONS.map(({ code, label }) => (
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

const btnStyle = {
    backgroundColor: '#2D2D45',
    border: '1px solid #3D3D55',
    color: '#B0A8C8',
    padding: '6px 14px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '0.82rem',
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
