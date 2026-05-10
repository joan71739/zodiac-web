import { useState } from 'react'
import { Table, Form, Button } from 'react-bootstrap'

const PLANETS = [
    '太陽', '月亮', '水星', '金星', '火星',
    '木星', '土星', '天王星', '海王星', '冥王星',
    '凱龍星', '命主星'
]

const SIGNS = [
    '牡羊座', '金牛座', '雙子座', '巨蟹座', '獅子座', '處女座',
    '天秤座', '天蠍座', '射手座', '摩羯座', '水瓶座', '雙魚座'
]

const HOUSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

function PlanetTable() {
    const [planets, setPlanets] = useState(
        PLANETS.map(name => ({ planet: name, sign: '', degree: '', house: '', notes: '' }))
    )
    const [saved, setSaved] = useState(false)

    const handleChange = (index, field, value) => {
        const updated = [...planets]
        updated[index][field] = value
        setPlanets(updated)
        setSaved(false)
    }

    const handleSave = () => {
        // 後端好了換成 API
        console.log('儲存行星資料', planets)
        setSaved(true)
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">行星位置</h6>
                <Button variant="primary" size="sm" onClick={handleSave}>
                    儲存
                </Button>
            </div>

            <Table bordered hover responsive size="sm">
                <thead className="table-dark">
                    <tr>
                        <th>行星</th>
                        <th>星座</th>
                        <th>度數</th>
                        <th>宮位</th>
                        <th>備註</th>
                    </tr>
                </thead>
                <tbody>
                    {planets.map((row, index) => (
                        <tr key={row.planet}>
                            <td className="align-middle fw-bold">{row.planet}</td>
                            <td>
                                <Form.Select
                                    size="sm"
                                    value={row.sign}
                                    onChange={e => handleChange(index, 'sign', e.target.value)}
                                >
                                    <option value="">-- 選擇星座 --</option>
                                    {SIGNS.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </Form.Select>
                            </td>
                            <td>
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    placeholder="例：17'"
                                    value={row.degree}
                                    onChange={e => handleChange(index, 'degree', e.target.value)}
                                />
                            </td>
                            <td>
                                <Form.Select
                                    size="sm"
                                    value={row.house}
                                    onChange={e => handleChange(index, 'house', e.target.value)}
                                >
                                    <option value="">--</option>
                                    {HOUSES.map(h => (
                                        <option key={h} value={h}>{h} 宮</option>
                                    ))}
                                </Form.Select>
                            </td>
                            <td>
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    placeholder="備註"
                                    value={row.notes}
                                    onChange={e => handleChange(index, 'notes', e.target.value)}
                                />
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

export default PlanetTable