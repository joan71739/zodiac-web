// TransitHouseNotes.jsx — 行運星 × 過境宮位解析頁
// 路由：/transits/planets/:transitPlanet/houses/:transitHouse
// 說明：單頁，無頁籤，直接顯示 TransitNoteBlock
// Fix：麵包屑第二層改為純文字，不做跳頁（/transits/planets/:planet 沒有獨立頁面）

import { useParams, useNavigate } from 'react-router-dom'
import { PLANET_CODE_MAP } from '../utils/codeMap'
import TransitNoteBlock from '../components/TransitNoteBlock'

const HOUSE_LABELS = {
    1: '一宮', 2: '二宮', 3: '三宮', 4: '四宮',
    5: '五宮', 6: '六宮', 7: '七宮', 8: '八宮',
    9: '九宮', 10: '十宮', 11: '十一宮', 12: '十二宮',
}

export default function TransitHouseNotes() {
    const { transitPlanet, transitHouse } = useParams()
    const navigate = useNavigate()

    const transitLabel = PLANET_CODE_MAP[transitPlanet] ?? transitPlanet
    const houseNum     = Number(transitHouse)
    const houseLabel   = HOUSE_LABELS[houseNum] ?? `${transitHouse}宮`

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
                <span style={{ color: '#B0A8C8', fontSize: '0.85rem' }}>
                    過境{houseLabel}
                </span>
            </div>

            <h5 style={{ color: '#D4AF37', marginBottom: 24 }}>
                {transitLabel} 過境{houseLabel}
            </h5>

            <TransitNoteBlock
                transitPlanet={transitPlanet}
                aspectType={null}
                natalPlanet={null}
                transitHouse={houseNum}
            />
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
