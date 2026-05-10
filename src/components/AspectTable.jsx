import { useState } from 'react'
import { Table, Form, Button, Row, Col } from 'react-bootstrap'

const PLANETS = [
    '太陽', '月亮', '水星', '金星', '火星',
    '木星', '土星', '天王星', '海王星', '冥王星'
]

const ASPECT_TYPES = [
    { value: 'CONJUNCTION', label: '☌ 合相（0°）' },
    { value: 'SEXTILE', label: '✱ 六分相（60°）' },
    { value: 'SQUARE', label: '☐ 四分相（90°）' },
    { value: 'TRINE', label: '△ 三分相（120°）' },
    { value: 'OPPOSITION', label: '☍ 對分相（180°）' },
]

const emptyForm = { planet1: '', aspectType: '', planet2: '', orb: '', notes: '' }

function AspectTable() {
    const [aspects, setAspects] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [saved, setSaved] = useState(false)

    const handleFormChange = (field, value) => {
        setForm({ ...form, [field]: value })
    }

    const handleAdd = () => {
        if (!form.planet1 || !form.aspectType || !form.planet2) return
        setAspects([...aspects, { ...form, id: Date.now() }])
        setForm(emptyForm)
        setSaved(false)
    }

    const handleDelete = (id) => {
        setAspects(aspects.filter(a => a.id !== id))
        setSaved(false)
    }

    const handleSave = () => {
        // 後端好了換成 API
        console.log('儲存相位資料', aspects)
        setSaved(true)
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">重要相位</h6>
                <Button variant="primary" size="sm" onClick={handleSave}>
                    儲存
                </Button>
            </div>

            {/* 新增相位表單 */}
            <Row className="g-2 mb-3 align-items-end">
                <Col md={2}>
                    <Form.Label className="small">行星一</Form.Label>
                    <Form.Select
                        size="sm"
                        value={form.planet1}
                        onChange={e => handleFormChange('planet1', e.target.value)}
                    >
                        <option value="">-- 選擇 --</option>
                        {PLANETS.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Form.Label className="small">相位</Form.Label>
                    <Form.Select
                        size="sm"
                        value={form.aspectType}
                        onChange={e => handleFormChange('aspectType', e.target.value)}
                    >
                        <option value="">-- 選擇 --</option>
                        {ASPECT_TYPES.map(a => (
                            <option key={a.value} value={a.value}>{a.label}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={2}>
                    <Form.Label className="small">行星二</Form.Label>
                    <Form.Select
                        size="sm"
                        value={form.planet2}
                        onChange={e => handleFormChange('planet2', e.target.value)}
                    >
                        <option value="">-- 選擇 --</option>
                        {PLANETS.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={2}>
                    <Form.Label className="small">容許度</Form.Label>
                    <Form.Control
                        size="sm"
                        type="number"
                        placeholder="例：2"
                        value={form.orb}
                        onChange={e => handleFormChange('orb', e.target.value)}
                    />
                </Col>
                <Col md={2}>
                    <Form.Label className="small">備註</Form.Label>
                    <Form.Control
                        size="sm"
                        type="text"
                        placeholder="備註"
                        value={form.notes}
                        onChange={e => handleFormChange('notes', e.target.value)}
                    />
                </Col>
                <Col md={1}>
                    <Button
                        variant="outline-primary"
                        size="sm"
                        className="w-100"
                        onClick={handleAdd}
                    >
                        + 新增
                    </Button>
                </Col>
            </Row>

            {/* 相位列表 */}
            {aspects.length === 0 ? (
                <p className="text-muted small">尚未新增相位</p>
            ) : (
                <Table bordered hover responsive size="sm">
                    <thead className="table-dark">
                        <tr>
                            <th>行星一</th>
                            <th>相位</th>
                            <th>行星二</th>
                            <th>容許度</th>
                            <th>備註</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {aspects.map(a => (
                            <tr key={a.id}>
                                <td>{a.planet1}</td>
                                <td>{ASPECT_TYPES.find(t => t.value === a.aspectType)?.label}</td>
                                <td>{a.planet2}</td>
                                <td>{a.orb ? `${a.orb}°` : '-'}</td>
                                <td>{a.notes || '-'}</td>
                                <td>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDelete(a.id)}
                                    >
                                        刪除
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {saved && (
                <p className="text-success small">✅ 已儲存</p>
            )}
        </div>
    )
}

export default AspectTable