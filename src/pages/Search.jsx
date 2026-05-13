import { useState } from 'react'
import { Form, Button, Table, Alert, Spinner, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { searchClients } from '../api/clients'
import { exportSearch } from '../api/export'

// v8：命主星保留在下拉選單，後端查詢時會轉換為 is_lord = TRUE
const PLANETS = [
    '太陽', '月亮', '水星', '金星', '火星',
    '木星', '土星', '天王星', '海王星', '冥王星', '凱龍星', '命主星'
]

const SIGNS = [
    '牡羊座', '金牛座', '雙子座', '巨蟹座', '獅子座', '處女座',
    '天秤座', '天蠍座', '射手座', '摩羯座', '水瓶座', '雙魚座'
]

function Search() {
    const navigate = useNavigate()
    const [planet, setPlanet] = useState('')
    const [sign, setSign] = useState('')
    const [degreeFrom, setDegreeFrom] = useState('')
    const [degreeTo, setDegreeTo] = useState('')
    const [house, setHouse] = useState('')
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const buildParams = () => {
        const params = { planet, sign }
        if (degreeFrom !== '') params.degreeFrom = degreeFrom
        if (degreeTo !== '') params.degreeTo = degreeTo
        if (house !== '') params.house = house
        return params
    }

    const handleSearch = async () => {
        if (!planet || !sign) {
            setErrorMsg('行星與星座為必填欄位')
            return
        }
        try {
            setLoading(true)
            setErrorMsg('')
            const res = await searchClients(buildParams())
            setResults(res.data)
        } catch (err) {
            setErrorMsg('搜尋失敗，請稍後再試')
        } finally {
            setLoading(false)
        }
    }

    const handleExport = async () => {
        if (!planet || !sign) return
        try {
            await exportSearch(buildParams())
        } catch (err) {
            setErrorMsg('匯出失敗')
        }
    }

    return (
        <div>
            <h4 className="mb-4">篩選客戶</h4>

            {errorMsg && <Alert variant="danger" dismissible onClose={() => setErrorMsg('')}>{errorMsg}</Alert>}

            <Row className="g-3 mb-4">
                <Col md={3}>
                    <Form.Label>行星 *</Form.Label>
                    <Form.Select value={planet} onChange={e => setPlanet(e.target.value)}>
                        <option value="">-- 選擇行星 --</option>
                        {PLANETS.map(p => <option key={p} value={p}>{p}</option>)}
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Form.Label>星座 *</Form.Label>
                    <Form.Select value={sign} onChange={e => setSign(e.target.value)}>
                        <option value="">-- 選擇星座 --</option>
                        {SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                    </Form.Select>
                </Col>
                <Col md={2}>
                    <Form.Label>度數區間</Form.Label>
                    <div className="d-flex align-items-center gap-2">
                        <Form.Control
                            type="number"
                            placeholder="從"
                            min="0"
                            max="29"
                            value={degreeFrom}
                            onChange={e => setDegreeFrom(e.target.value)}
                        />
                        <span>－</span>
                        <Form.Control
                            type="number"
                            placeholder="至"
                            min="0"
                            max="29"
                            value={degreeTo}
                            onChange={e => setDegreeTo(e.target.value)}
                        />
                    </div>
                </Col>
                <Col md={2}>
                    <Form.Label>宮位</Form.Label>
                    <Form.Select value={house} onChange={e => setHouse(e.target.value)}>
                        <option value="">-- 不限 --</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                            <option key={h} value={h}>{h} 宮</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={2} className="d-flex align-items-end gap-2">
                    <Button variant="primary" onClick={handleSearch} disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : '搜尋'}
                    </Button>
                    {results !== null && (
                        <Button variant="outline-secondary" onClick={handleExport}>
                            匯出
                        </Button>
                    )}
                </Col>
            </Row>

            {results !== null && (
                results.length === 0 ? (
                    <p className="text-muted">查無符合條件的客戶</p>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th>姓名</th>
                                <th>生日</th>
                                <th>出生地</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(c => (
                                <tr key={c.id}>
                                    <td>{c.name}</td>
                                    <td>{c.birthDate}</td>
                                    <td>{c.birthPlace}</td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            onClick={() => navigate(`/clients/${c.id}`)}
                                        >
                                            查看
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )
            )}
        </div>
    )
}

export default Search
