// TransitPlanetNotes.jsx — 行運星 × 相位 × 本命星解析頁
// 路由：/transits/planets/:transitPlanet/aspects/:aspectType/natal/:natalPlanet
// 說明：13 個頁籤（詳細資料 + 過境一宮~十二宮）+ TransitNoteBlock
// Fix：麵包屑行星層改為純文字，不跳頁（/transits/planets/:planet 沒有獨立頁面）

import { useParams, useNavigate } from 'react-router-dom'
import { Tab, Tabs } from 'react-bootstrap'
import { PLANET_CODE_MAP, ASPECT_CODE_MAP } from '../utils/codeMap'
import TransitNoteBlock from '../components/TransitNoteBlock'

// 13 個頁籤定義
// transit_house=null → 詳細資料頁籤；transit_house=1~12 → 過境宮位頁籤
const TABS = [
    { key: 'detail',  label: '詳細資料',  transitHouse: null },
    { key: 'house1',  label: '過境一宮',  transitHouse: 1  },
    { key: 'house2',  label: '過境二宮',  transitHouse: 2  },
    { key: 'house3',  label: '過境三宮',  transitHouse: 3  },
    { key: 'house4',  label: '過境四宮',  transitHouse: 4  },
    { key: 'house5',  label: '過境五宮',  transitHouse: 5  },
    { key: 'house6',  label: '過境六宮',  transitHouse: 6  },
    { key: 'house7',  label: '過境七宮',  transitHouse: 7  },
    { key: 'house8',  label: '過境八宮',  transitHouse: 8  },
    { key: 'house9',  label: '過境九宮',  transitHouse: 9  },
    { key: 'house10', label: '過境十宮',  transitHouse: 10 },
    { key: 'house11', label: '過境十一宮', transitHouse: 11 },
    { key: 'house12', label: '過境十二宮', transitHouse: 12 },
]

export default function TransitPlanetNotes() {
    const { transitPlanet, aspectType, natalPlanet } = useParams()
    const navigate = useNavigate()

    const transitLabel = PLANET_CODE_MAP[transitPlanet] ?? transitPlanet
    const aspectLabel  = ASPECT_CODE_MAP[aspectType]    ?? aspectType
    const natalLabel   = PLANET_CODE_MAP[natalPlanet]   ?? natalPlanet

    return (
        <div style={{ padding: '32px 40px', color: '#E8E0F0', maxWidth: 900 }}>
            {/* 麵包屑 */}
            <div className="d-flex align-items-center gap-2 mb-4" style={{ flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/transits')} style={backBtnStyle}>
                    ← 行運解析
                </button>
                <span style={{ color: '#444' }}>/</span>
                {/* 行星層：純文字，不跳頁（無獨立行星頁面） */}
                <span style={{ color: '#D4AF37', fontSize: '0.85rem' }}>
                    {transitLabel}
                </span>
                <span style={{ color: '#444' }}>/</span>
                <span style={{ color: '#D4AF37', fontSize: '0.85rem' }}>
                    {aspectLabel}
                </span>
                <span style={{ color: '#444' }}>/</span>
                <span style={{ color: '#B0A8C8', fontSize: '0.85rem' }}>
                    本命{natalLabel}
                </span>
            </div>

            <h5 style={{ color: '#D4AF37', marginBottom: 24 }}>
                {transitLabel} {aspectLabel} 本命{natalLabel}
            </h5>

            <Tabs defaultActiveKey="detail" className="mb-3" variant="pills">
                {TABS.map(({ key, label, transitHouse }) => (
                    <Tab key={key} eventKey={key} title={label}>
                        <div style={{ paddingTop: 16 }}>
                            <TransitNoteBlock
                                transitPlanet={transitPlanet}
                                aspectType={aspectType}
                                natalPlanet={natalPlanet}
                                transitHouse={transitHouse}
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
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    fontSize: '0.85rem',
    padding: 0,
}
