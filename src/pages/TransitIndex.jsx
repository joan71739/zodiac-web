// TransitIndex.jsx — 行運解析首頁
// 路由：/transits
// v3：加上「匯入格式說明」下載按鈕

import { useRef, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { OUTER_PLANET_OPTIONS } from '../utils/codeMap'
import { exportTransitNotes } from '../api/export'
import { importTransitNotes } from '../api/import'

const FORMAT_TXT = `=== 行運解析 匯入格式說明 ===

--- 行運行星代碼 (transitPlanet) ---
Y=木星 U=土星 I=天王星 O=海王星 P=冥王星

--- 相位代碼 (aspectType) ---
q=合相 w=對分相 e=三分相 r=四分相 t=六分相
null=過境宮位情境（不對應相位）

--- 本命星代碼 (natalPlanet) ---
Q=太陽 W=月亮 E=水星 R=金星 T=火星
null=過境宮位情境（不對應本命星）

--- 主題代碼 (topic) ---
general=核心特質 career=事業 love=感情
wealth=財富 challenge=課題 null=未分類

--- JSON 範例 ---
[
  {
    "transitPlanet": "Y",
    "aspectType": "q",
    "natalPlanet": "Q",
    "transitHouse": null,
    "title": "標題",
    "content": "內容",
    "tag": "",
    "topic": "general"
  }
]
`

export default function TransitIndex() {
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const [msg, setMsg] = useState(null)

    const handleExport = async () => {
        try {
            await exportTransitNotes()
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

    const handleFormatDownload = () => {
        const blob = new Blob([FORMAT_TXT], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'transit_notes_import_format.txt'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
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

            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: 24 }}>
                選擇左側行星進入解析頁面，或點擊下方快速入口。
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {OUTER_PLANET_OPTIONS.map(({ code, label }) => (
                    <div key={code} onClick={() => navigate(`/transits/planets/${code}`)} style={cardStyle}>
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

const cardStyle = {
    backgroundColor: '#1C1C2E',
    border: '1px solid #2D2D45',
    borderRadius: 6,
    padding: '10px 24px',
    cursor: 'pointer',
    color: '#E8E0F0',
    fontSize: '0.88rem',
}
