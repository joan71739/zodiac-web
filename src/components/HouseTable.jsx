import { useState, useEffect } from 'react'
import { Table, Form, Button, Spinner, Alert } from 'react-bootstrap'
import { getHouses, createHouses, updateHouse } from '../api/clients'

const SIGNS = [
    '牡羊座', '金牛座', '雙子座', '巨蟹座', '獅子座', '處女座',
    '天秤座', '天蠍座', '射手座', '摩羯座', '水瓶座', '雙魚座'
]

const PLANETS = [
    '太陽', '月亮', '水星', '金星', '火星',
    '木星', '土星', '天王星', '海王星', '冥王星', '凱龍星', '命主星'
]

const HOUSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

const defaultRows = () =>
    Array.from({ length: 12 }, (_, i) => ({
        id: null,
        houseNumber: i + 1,
        rulingPlanet: '',
        fliesToSign: '',
        fliesToHouse: ''
    }))

function HouseTable({ clientId }) {
    const [houses, setHouses] = useState(defaultRows())
    const [loading, setLoading] = useState(true)
    const [savingIndex, setSavingIndex] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')
    const [successIndex, setSuccessIndex] = useState(null)
    const isFirstCreate = houses.every(h => h.id === null)

    useEffect(() => {
        const fetchHouses = async () => {
            try {
                const res = await getHouses(clientId)
                if (res.data && res.data.length > 0) {
                    const merged = defaultRows().map(def => {
                        const found = res.data.find(h => h.houseNumber === def.houseNumber)
                        return found ? { ...def, ...found } : def
                    })
                    setHouses(merged)
                }
            } catch (err) {
                setErrorMsg('載入宮位資料失敗')
            } finally {
                setLoading(false)
            }
        }
        if (clientId) fetchHouses()
    }, [clientId])

    const handleChange = (index, field, value) => {
        const updated = [...houses]
        updated[index] = { ...updated[index], [field]: value }
        setHouses(updated)
    }

    // 初次建立：POST 整批 12 筆
    // BUG FIX：改用 merge 模式，確保 JPA saveAll 回傳順序不影響 UI 宮位排序
    const handleCreateAll = async () => {
        try {
            setSavingIndex('all')
            const payload = houses.map(h => ({
                houseNumber: h.houseNumber,
                rulingPlanet: h.rulingPlanet,
                fliesToSign: h.fliesToSign,
                fliesToHouse: h.fliesToHouse !== '' ? parseInt(h.fliesToHouse) : null
            }))
            const res = await createHouses(clientId, payload)
            // merge by houseNumber，確保 1~12 宮固定順序，不受 JPA saveAll 回傳順序影響
            const merged = defaultRows().map(def => {
                const found = res.data.find(h => h.houseNumber === def.houseNumber)
                return found ? { ...def, ...found } : def
            })
            setHouses(merged)
        } catch (err) {
            setErrorMsg('建立宮位資料失敗')
        } finally {
            setSavingIndex(null)
        }
    }

    // 單列儲存：PUT
    const handleSaveRow = async (index) => {
        const row = houses[index]
        if (!row.id) return
        try {
            setSavingIndex(index)
            const payload = {
                houseNumber: row.houseNumber,
                rulingPlanet: row.rulingPlanet,
                fliesToSign: row.fliesToSign,
                fliesToHouse: row.fliesToHouse !== '' ? parseInt(row.fliesToHouse) : null
            }
            const res = await updateHouse(clientId, row.id, payload)
            const updated = [...houses]
            updated[index] = { ...row, ...res.data }
            setHouses(updated)
            setSuccessIndex(index)
            setTimeout(() => setSuccessIndex(null), 2000)
        } catch (err) {
            setErrorMsg(`第 ${index + 1} 宮儲存失敗`)
        } finally {
            setSavingIndex(null)
        }
    }

    if (loading) return <div className="text-center py-3"><Spinner animation="border" size="sm" /></div>

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">宮位守護星</h6>
                {isFirstCreate && (
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleCreateAll}
                        disabled={savingIndex === 'all'}
                    >
                        {savingIndex === 'all'
                            ? <Spinner animation="border" size="sm" /> : '初次建立全部'}
                    </Button>
                )}
            </div>

            {errorMsg && <Alert variant="danger" dismissible onClose={() => setErrorMsg('')} className="py-2">{errorMsg}</Alert>}

            <Table bordered hover responsive size="sm">
                <thead className="table-dark">
                    <tr>
                        <th>宮位</th>
                        <th>守護星</th>
                        <th>飛入星座</th>
                        <th>飛入宮位</th>
                        {!isFirstCreate && <th></th>}
                    </tr>
                </thead>
                <tbody>
                    {houses.map((row, index) => (
                        <tr key={row.houseNumber}>
                            <td className="align-middle fw-bold text-center">{row.houseNumber} 宮</td>
                            <td>
                                <Form.Select
                                    size="sm"
                                    value={row.rulingPlanet}
                                    onChange={e => handleChange(index, 'rulingPlanet', e.target.value)}
                                >
                                    <option value="">--</option>
                                    {PLANETS.map(p => <option key={p} value={p}>{p}</option>)}
                                </Form.Select>
                            </td>
                            <td>
                                <Form.Select
                                    size="sm"
                                    value={row.fliesToSign}
                                    onChange={e => handleChange(index, 'fliesToSign', e.target.value)}
                                >
                                    <option value="">--</option>
                                    {SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                                </Form.Select>
                            </td>
                            <td>
                                <Form.Select
                                    size="sm"
                                    value={row.fliesToHouse}
                                    onChange={e => handleChange(index, 'fliesToHouse', e.target.value)}
                                >
                                    <option value="">--</option>
                                    {HOUSES.map(h => <option key={h} value={h}>{h} 宮</option>)}
                                </Form.Select>
                            </td>
                            {!isFirstCreate && (
                                <td className="text-center align-middle">
                                    {successIndex === index ? (
                                        <span className="text-success small">✅</span>
                                    ) : (
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => handleSaveRow(index)}
                                            disabled={savingIndex === index}
                                        >
                                            {savingIndex === index
                                                ? <Spinner animation="border" size="sm" />
                                                : '儲存'}
                                        </Button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default HouseTable
