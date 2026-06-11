// SignNotes.jsx — 各星座解析頁
// 路由：/elements/signs/:signKey
// 說明：13 個頁籤（星座特性 + 一宮~十二宮），每個頁籤內嵌 ElementNoteBlock

import { useParams, useNavigate } from 'react-router-dom'
import { Tab, Tabs } from 'react-bootstrap'
import { SIGN_OPTIONS } from '../utils/codeMap'
import ElementNoteBlock from '../components/ElementNoteBlock'

// 13 個頁籤定義
const TABS = [
    { key: 'trait',   label: '星座特性', houseKey: null },
    { key: 'house1',  label: '一宮',     houseKey: 1  },
    { key: 'house2',  label: '二宮',     houseKey: 2  },
    { key: 'house3',  label: '三宮',     houseKey: 3  },
    { key: 'house4',  label: '四宮',     houseKey: 4  },
    { key: 'house5',  label: '五宮',     houseKey: 5  },
    { key: 'house6',  label: '六宮',     houseKey: 6  },
    { key: 'house7',  label: '七宮',     houseKey: 7  },
    { key: 'house8',  label: '八宮',     houseKey: 8  },
    { key: 'house9',  label: '九宮',     houseKey: 9  },
    { key: 'house10', label: '十宮',     houseKey: 10 },
    { key: 'house11', label: '十一宮',   houseKey: 11 },
    { key: 'house12', label: '十二宮',   houseKey: 12 },
]

export default function SignNotes() {
    const { signKey } = useParams()
    const navigate    = useNavigate()

    // 找對應的星座中文名
    const sign = SIGN_OPTIONS.find(s => s.code === signKey)

    if (!sign) {
        return (
            <div style={{ padding: '32px 40px', color: '#E8E0F0' }}>
                <p>找不到此星座代碼：{signKey}</p>
                <button onClick={() => navigate('/elements/signs')} style={backBtnStyle}>
                    ← 返回十二星座
                </button>
            </div>
        )
    }

    return (
        <div style={{ padding: '32px 40px', color: '#E8E0F0', maxWidth: 900 }}>
            {/* 頁首 */}
            <div className="d-flex align-items-center gap-3 mb-4">
                <button onClick={() => navigate('/elements/signs')} style={backBtnStyle}>
                    ← 十二星座
                </button>
                <h4 style={{ color: '#D4AF37', margin: 0 }}>{sign.label}</h4>
            </div>

            {/* 13 Tab */}
            <Tabs
                defaultActiveKey="trait"
                className="mb-3"
                style={{ borderBottom: '1px solid #2D2D45' }}
            >
                {TABS.map(({ key, label, houseKey }) => (
                    <Tab
                        key={key}
                        eventKey={key}
                        title={label}
                    >
                        <div style={{ paddingTop: 20 }}>
                            <ElementNoteBlock
                                signKey={signKey}
                                planetKey={null}
                                houseKey={houseKey}
                            />
                        </div>
                    </Tab>
                ))}
            </Tabs>
        </div>
    )
}

const backBtnStyle = {
    background: 'none',
    border: '1px solid #2D2D45',
    color: '#B0A8C8',
    padding: '4px 12px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '0.82rem',
}
