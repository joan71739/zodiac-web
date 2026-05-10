import { useState } from 'react'
import { Form, Button, Table, Alert, Row, Col, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const PLANETS = [
    '太陽', '月亮', '水星', '金星', '火星',
    '木星', '土星', '天王星', '海王星', '冥王星', '命主星'
]

const SIGNS = [
    '牡羊座', '金牛座', '雙子座', '巨蟹座', '獅子座', '處女座',
    '天秤座', '天蠍座', '射手座', '摩羯座', '水瓶座', '雙魚座'
]

const HOUSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

function Search() {
    const navigate = useNavigate()
    const [planet, setPlanet] = useState('')
    const [sign, setSign] = useState('')
    const [results, setResults] = useState([])
    const [searched, setSearched] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [degreeFrom, setDegreeFrom] = useState('')
    const [degreeTo, setDegreeTo] = useState('')
    const [house, setHouse] = useState('')

    const handleSearch = async () => {
        if (!planet || !sign) {
            setErrorMsg('請選擇行星與星座')
            return
        }
        setErrorMsg('')

        // 假資料，後端好了換成 API
        const mockResults = [
            { id: 1, name: '王小明', birthDate: '1993-08-10', birthPlace: '台北' },
            { id: 2, name: '李小花', birthDate: '1990-03-22', birthPlace: '台中' },
        ]
        setResults(mockResults)
        setSearched(true)
    }

    const handleReset = () => {
        setPlanet('')
        setSign('')
        setDegreeFrom('')
        setDegreeTo('')
        setResults([])
        setHouse('')
        setSearched(false)
        setErrorMsg('')
    }

    return (
        <div>
            <h4 className="mb-4">篩選客戶</h4>

            <Card className="mb-4">
                <Card.Body>
                    <Row className="g-3 align-items-end">
                        <Col md={2}>
                            <Form.Label>行星</Form.Label>
                            <Form.Select
                                value={planet}
                                onChange={e => setPlanet(e.target.value)}
                            >
                                <option value="">-- 選擇行星 --</option>
                                {PLANETS.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <Form.Label>星座</Form.Label>
                            <Form.Select
                                value={sign}
                                onChange={e => setSign(e.target.value)}
                            >
                                <option value="">-- 選擇星座 --</option>
                                {SIGNS.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col md={3}>
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
                            <Form.Select
                                value={house}
                                onChange={e => setHouse(e.target.value)}
                            >
                                <option value="">-- 選擇 --</option>
                                {HOUSES.map(h => (
                                    <option key={h} value={h}>{h} 宮</option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <Button
                                variant="primary"
                                className="me-2"
                                onClick={handleSearch}
                            >
                                搜尋
                            </Button>
                            <Button
                                variant="outline-secondary"
                                onClick={handleReset}
                            >
                                重置
                            </Button>
                        </Col>
                    </Row>

                    {errorMsg && (
                        <Alert variant="danger" className="mt-3 mb-0">
                            {errorMsg}
                        </Alert>
                    )}
                </Card.Body>
            </Card>

            {searched && (
                <>
                    <p className="text-muted small mb-2">
                        共找到 {results.length} 筆結果｜{planet} 在 {sign}
                        {degreeFrom && degreeTo && `，度數 ${degreeFrom}° - ${degreeTo}°`}
                        {house && `，第 ${house} 宮`}
                    </p>

                    {results.length === 0 ? (
                        <Alert variant="warning">找不到符合條件的客戶</Alert>
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
                                {results.map(client => (
                                    <tr key={client.id}>
                                        <td>{client.name}</td>
                                        <td>{client.birthDate}</td>
                                        <td>{client.birthPlace}</td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => navigate(`/clients/${client.id}`)}
                                            >
                                                查看
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </>
            )}
        </div>
    )
}

export default Search