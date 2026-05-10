import { useState } from 'react'
import { Table, Form, Button } from 'react-bootstrap'

const PLANETS = [
    '太陽', '月亮', '水星', '金星', '火星',
    '木星', '土星', '天王星', '海王星', '冥王星'
]

const SIGNS = [
    '牡羊座', '金牛座', '雙子座', '巨蟹座', '獅子座', '處女座',
    '天秤座', '天蠍座', '射手座', '摩羯座', '水瓶座', '雙魚座'
]

const HOUSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

function HouseTable() {
    const [houses, setHouses] = useState(
        Array.from({ length: 12 }, (_, i) => ({
            houseNumber: i + 1,
            rulingPlanet: '',
            fliestoSign: '',
            fliestoHouse: '',
        }))
    )
    const [saved, setSaved] = useState(false)

    const handleChange = (index, field, value) => {
        const updated = [...houses]
        updated[index][field] = value
        setHouses(updated)
        setSaved(false)
    }

    const handleSave = () => {
        // 後端好了換成 API
        console.log('儲存宮位資料', houses)
        setSaved(true)
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">宮位守護星</h6>
                <Button variant="primary" size="sm" onClick={handleSave}>
                    儲存
                </Button>
            </div>

            <Table bordered hover responsive size="sm">
                <thead className="table-dark">
                    <tr>
                        <th>宮位</th>
                        <th>守護星</th>
                        <th>飛入星座</th>
                        <th>飛入宮位</th>
                    </tr>
                </thead>
                <tbody>
                    {houses.map((row, index) => (
                        <tr key={row.houseNumber}>
                            <td className="align-middle fw-bold">
                                第 {row.houseNumber} 宮
                            </td>
                            <td>
                                <Form.Select
                                    size="sm"
                                    value={row.rulingPlanet}
                                    onChange={e => handleChange(index, 'rulingPlanet', e.target.value)}
                                >
                                    <option value="">-- 選擇行星 --</option>
                                    {PLANETS.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </Form.Select>
                            </td>
                            <td>
                                <Form.Select
                                    size="sm"
                                    value={row.fliestoSign}
                                    onChange={e => handleChange(index, 'fliestoSign', e.target.value)}
                                >
                                    <option value="">-- 選擇星座 --</option>
                                    {SIGNS.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </Form.Select>
                            </td>
                            <td>
                                <Form.Select
                                    size="sm"
                                    value={row.fliestoHouse}
                                    onChange={e => handleChange(index, 'fliestoHouse', e.target.value)}
                                >
                                    <option value="">--</option>
                                    {HOUSES.map(h => (
                                        <option key={h} value={h}>{h} 宮</option>
                                    ))}
                                </Form.Select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {saved && (
                <p className="text-success small">✅ 已儲存</p>
            )}
        </div>
    )
}

export default HouseTable