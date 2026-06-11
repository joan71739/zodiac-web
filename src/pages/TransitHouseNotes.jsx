// TransitHouseNotes.jsx — 行運星 × 過境宮位解析頁
// 路由：/transits/planets/:transitPlanet/houses/:transitHouse
// Fix：麵包屑行星層改為純文字，不跳頁

import { useParams, useNavigate } from 'react-router-dom'
import { PLANET_CODE_MAP, HOUSE_NUM_LABEL_MAP } from '../utils/codeMap'
import TransitNoteBlock from '../components/TransitNoteBlock'

export default function TransitHouseNotes() {
    const { transitPlanet, transitHouse } = useParams()
    const navigate = useNavigate()

    const transitLabel = PLANET_CODE_MAP[transitPlanet] ?? transitPlanet
    const houseNum     = Number(transitHouse)
    const houseLabel   = HOUSE_NUM_LABEL_MAP[houseNum]
        ? `${HOUSE_NUM_LABEL_MAP[houseNum]}宮`
        : `${transitHouse}宮`

    return (
        <div style={{ padding: '32px 40px', color: '#E8E0F0', maxWidth: 900 }}>
            <div className="d-flex align-items-center gap-2 mb-4" style={{ flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/transits')} style={backBtnStyle}>
                    ← 行運解析
                </button>
                <span style={{ color: '#444' }}>/</span>
                <span style={{ color: '#D4AF37', fontSize: '0.85rem' }}>{transitLabel}</span>
                <span style={{ color: '#444' }}>/</span>
                <span style={{ color: '#B0A8C8', fontSize: '0.85rem' }}>過境{houseLabel}</span>
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
    background: 'none', border: 'none',
    color: '#888', cursor: 'pointer',
    fontSize: '0.85rem', padding: 0,
}
