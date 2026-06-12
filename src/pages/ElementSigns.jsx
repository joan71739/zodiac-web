// ElementSigns.jsx — 十二星座頁
// 路由：/elements/signs
// v3：加上「匯入格式說明」下載按鈕

import { useRef, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { SIGN_OPTIONS } from '../utils/codeMap'
import { exportElementSigns } from '../api/export'
import { importElementNotes } from '../api/import'

const FORMAT_TXT = `=== 元素解析 匯入格式說明 ===

--- 星座代碼 (signKey) ---
a=牡羊座 s=金牛座 d=雙子座 f=巨蟹座
g=獅子座 h=處女座 j=天秤座 k=天蠍座
l=射手座 z=摩羯座 x=水瓶座 c=雙魚座

--- 行星代碼 (planetKey) ---
Q=太陽 W=月亮 E=水星 R=金星 T=火星
Y=木星 U=土星 null=純星座解析

--- 主題代碼 (topic) ---
general=核心特質 career=事業 love=感情
wealth=財富 challenge=課題 null=未分類

--- JSON 範例 ---
[
  {
    "signKey": "g",
    "planetKey": "Q",
    "houseKey": null,
    "title": "標題",
    "content": "內容",
    "tag": "",
    "topic": "general"
  }
]
`

export default function ElementSigns() {
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const [msg, setMsg] = useState(null)

    const handleExport = async () => {
        try {
            await exportElementSigns()
        } catch {
            setMsg({ type: 'danger', text: '匯出失敗，請稍後再試' })
        }
    }

    const handleImportClick = () => fileInputRef.current?.click()

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        e.target.value = ''
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

    const handleFormatDownload = () => {
        const blob = new Blob([FORMAT_TXT], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'element_notes_import_format.txt'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
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
                    <button onClick={handleFormatDownload} style={btnStyleSecondary}>
                        📄 匯入格式說明
                    </button>
                    <button onClick={handleImportClick} style={btnStyle}>
                        ⬆ 匯入 JSON
                    </button>
                    <button onClick={handleExport} style={btnStyle}>
                        ⬇ 匯出 JSON
                    </button>
                </div>
            </div>

            {msg && (
                <Alert variant={msg.type} dismissible onClose={() => setMsg(null)} style={{ fontSize: '0.84rem' }}>
                    {msg.text}
                </Alert>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                {SIGN_OPTIONS.map(({ code, label }) => (
                    <div key={code} onClick={() => navigate(`/elements/signs/${code}`)} style={signCardStyle}>
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

const btnStyleSecondary = {
    backgroundColor: '#2D2D45',
    border: '1px solid #2D2D45',
    color: '#888',
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
}
