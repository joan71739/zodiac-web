import { useState, useEffect } from 'react'
import { Table, Form, Button, Spinner, Alert } from 'react-bootstrap'
import { getPlanets, createPlanets, updatePlanet } from '../api/clients'

// v8：移除「命主星」，改為 checkbox
const PLANETS = [
    '太陽', '月亮', '水星', '金星', '火星',
    '木星', '土星', '天王星', '海王星', '冥王星',
    '凱龍星'
]

// 只有這 7 個內行星可以標記為命主星
const LORD_ELIGIBLE = new Set(['太陽', '月亮', '水星', '金星', '火星', '木星', '土星'])

const SIGNS = [
    '牡羊座', '金牛座', '雙子座', '巨蟹座', '獅子座', '處女座',
    '天秤座', '天蠍座', '射手座', '摩羯座', '水瓶座', '雙魚座'
]

const HOUSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

const defaultRows = () =>
    PLANETS.map(name => ({
        id: null,
        planet: name,
        sign: '',
        degreeNum: '',
        minuteNum: '',
        house: '',
        notes: '',
        isLord: false   // v8 新增
    }))

function PlanetTable({ clientId }) {
    const [planets, setPlanets] = useState(defaultRows())
    const [loading, setLoading] = useState(true)
    const [savingIndex, setSavingIndex] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')
    const [successIndex, setSuccessIndex] = useState(null)
    const isFirstCreate = planets.every(p => p.id === null)

    useEffect(() => {
        const fetchPlanets = async () => {
            try {
                const res = await getPlanets(clientId)
                if (res.data && res.data.length > 0) {
                    const merged = defaultRows().map(def => {
                        const found = res.data.find(p => p.planet === def.planet)
                        return found ? { ...def, ...found } : def
                    })
                    setPlanets(merged)
                }
            } catch (err) {
                setErrorMsg('載入行星資料失敗')
            } finally {
                setLoading(false)
            }
        }
        if (clientId) fetchPlanets()
    }, [clientId])

    const handleChange = (index, field, value) => {
        const updated = [...planets]
        updated[index] = { ...updated[index], [field]: value }
        setPlanets(updated)
    }

    // v8：命主星 checkbox — 點選後同批其他行全部取消（只能有一個）
    const handleLordToggle = (index) => {
        const isCurrentlyLord = planets[index].isLord
        const updated = planets.map((p, i) => ({
            ...p,
            isLord: i === index ? !isCurrentlyLord : false
        }))
        setPlanets(updated)
    }

    // 初次建立：POST 整批
    const handleCreateAll = async () => {
        try {
            setSavingIndex('all')
            const payload = planets.map(p => ({
                planet: p.planet,
                sign: p.sign,
                degreeNum: p.degreeNum !== '' ? parseInt(p.degreeNum) : null,
                minuteNum: p.minuteNum !== '' ? parseInt(p.minuteNum) : null,
                house: p.house !== '' ? parseInt(p.house) : null,
                notes: p.notes,
                isLord: p.isLord  // v8 新增
            }))
            const res = await createPlanets(clientId, payload)
            const merged = defaultRows().map(def => {
                const found = res.data.find(p => p.planet === def.planet)
                return found ? { ...def, ...found } : def
            })
            setPlanets(merged)
        } catch (err) {
            setErrorMsg('建立行星資料失敗')
        } finally {
            setSavingIndex(null)
        }
    }

    // 單列儲存：PUT
    const handleSaveRow = async (index) => {
        const row = planets[index]
        if (!row.id) return
        try {
            setSavingIndex(index)
            const payload = {
                planet: row.planet,
                sign: row.sign,
                degreeNum: row.degreeNum !== '' ? parseInt(row.degreeNum) : null,
                minuteNum: row.minuteNum !== '' ? parseInt(row.minuteNum) : null,
                house: row.house !== '' ? parseInt(row.house) : null,
                notes: row.notes,
                isLord: row.isLord  // v8 新增
            }
            const res = await updatePlanet(clientId, row.id, payload)
            const updated = [...planets]
            updated[index] = { ...row, ...res.data }
            setPlanets(updated)
            setSuccessIndex(index)
            setTimeout(() => setSuccessIndex(null), 2000)
        } catch (err) {
            setErrorMsg(`第 ${index + 1} 列儲存失敗`)
        } finally {
            setSavingIndex(null)
        }
    }

    if (loading) return <div className="text-center py-3"><Spinner animation="border" size="sm" /></div>

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">行星位置</h6>
                {isFirstCreate && (
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleCreateAll}
                        disabled={savingIndex === 'all'}
                    >
                        {savingIndex === 'all' ? <Spinner animation="border" size="sm" /> : '初次建立全部'}
                    </Button>
                )}
            </div>

            {errorMsg && (
                <Alert variant="danger" dismissible onClose={() => setErrorMsg('')} className="py-2">
                    {errorMsg}
                </Alert>
            )}

            <Table bordered hover responsive size="sm">
                <thead className="table-dark">
                    <tr>
                        <th style={{ width: '60px' }} className="text-center">命主星</th>
                        <th>行星</th>
                        <th>星座</th>
                        <th style={{ width: '70px' }}>度</th>
                        <th style={{ width: '70px' }}>分</th>
                        <th style={{ width: '90px' }}>宮位</th>
                        <th>備註</th>
                        {!isFirstCreate && <th style={{ width: '60px' }}></th>}
                    </tr>
                </thead>
                <tbody>
                    {planets.map((row, index) => (
                        <tr
                            key={row.planet}
                            style={row.isLord ? { backgroundColor: '#fff8e1' } : {}}
                        >
                            {/* 命主星 checkbox：只有 7 個內行星顯示 */}
                            <td className="text-center align-middle">
                                {LORD_ELIGIBLE.has(row.planet) ? (
                                    <Form.Check
                                        type="checkbox"
                                        checked={!!row.isLord}
                                        onChange={() => handleLordToggle(index)}
                                        title="標記為命主星"
                                    />
                                ) : null}
                            </td>

                            <td className="align-middle fw-bold">
                                {row.planet}
                                {row.isLord && <span className="ms-1 text-warning">★</span>}
                            </td>

                            <td>
                                <Form.Select
                                    size="sm"
                                    value={row.sign}
                                    onChange={e => handleChange(index, 'sign', e.target.value)}
                                >
                                    <option value="">--</option>
                                    {SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                                </Form.Select>
                            </td>

                            <td>
                                <Form.Control
                                    size="sm"
                                    type="number"
                                    min="0"
                                    max="29"
                                    placeholder="0~29"
                                    value={row.degreeNum}
                                    onChange={e => handleChange(index, 'degreeNum', e.target.value)}
                                />
                            </td>

                            <td>
                                <Form.Control
                                    size="sm"
                                    type="number"
                                    min="0"
                                    max="59"
                                    placeholder="0~59"
                                    value={row.minuteNum}
                                    onChange={e => handleChange(index, 'minuteNum', e.target.value)}
                                />
                            </td>

                            <td>
                                <Form.Select
                                    size="sm"
                                    value={row.house}
                                    onChange={e => handleChange(index, 'house', e.target.value)}
                                >
                                    <option value="">--</option>
                                    {HOUSES.map(h => <option key={h} value={h}>{h} 宮</option>)}
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

export default PlanetTable
