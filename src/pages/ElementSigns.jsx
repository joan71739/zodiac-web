// ElementSigns.jsx — 十二星座頁
// 路由：/elements/signs
// v2：匯入匯出接上真實 API

import { useRef, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { SIGN_OPTIONS } from '../utils/codeMap'
import { exportElementSigns } from '../api/export'
import { importElementNotes } from '../api/import'

export default function ElementSigns() {
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const [msg, setMsg] = useState(null) // { type: 'success'|'danger', text }

    // ── 匯出 ────────────────────────────────────────────────
    const handleExport = async () => {
        try {
            await exportElementSigns()
        } catch {
            setMsg({ type: 'danger', text: '匯出失敗，請稍後再試' })
        }
    }

    // ── 匯入 ────────────────────────────────────────────────
    const handleImportClick = () => fileInputRef.current?.click()

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        e.target.value = ''   // 允許重複選同一檔案
        try {
            const res = await importElementNotes(file)
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
                <h4 style={{ color: '#D4AF37', margin: 0 }}>♈ 十二星座</h4>
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

            {/* 星座快速入口 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
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

const btnStyle = {
    backgroundColor: '#2D2D45',
    border: '1px solid #3D3D55',
    color: '#B0A8C8',
    padding: '6px 14px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '0.82rem',
}

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
