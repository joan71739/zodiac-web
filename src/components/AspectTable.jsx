import { useState, useEffect } from 'react'
import { Table, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap'
import { getAspects, createAspect, updateAspect, deleteAspect } from '../api/clients'

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

function AspectTable({ clientId }) {
    const [aspects, setAspects] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        const fetchAspects = async () => {
            try {
                const res = await getAspects(clientId)
                setAspects(res.data)
            } catch (err) {
                setErrorMsg('載入相位資料失敗')
            } finally {
                setLoading(false)
            }
        }
        if (clientId) fetchAspects()
    }, [clientId])

    const handleFormChange = (field, value) => {
        setForm({ ...form, [field]: value })
    }

    const handleAdd = async () => {
        if (!form.planet1 || !form.aspectType || !form.planet2) return
        try {
            setSaving(true)
            const payload = { ...form, orb: form.orb !== '' ? parseFloat(form.orb) : null }
            const res = await createAspect(clientId, payload)
            setAspects([...aspects, res.data])
            setForm(emptyForm)
        } catch (err) {
            setErrorMsg('新增相位失敗')
        } finally {
            setSaving(false)
        }
    }

    const handleStartEdit = (aspect) => {
        setEditingId(aspect.id)
        setEditForm({ ...aspect })
    }

    const handleEditChange = (field, value) => {
        setEditForm({ ...editForm, [field]: value })
    }

    const handleSaveEdit = async () => {
        try {
            setSaving(true)
            const payload = {
                planet1: editForm.planet1,
                aspectType: editForm.aspectType,
                planet2: editForm.planet2,
                orb: editForm.orb !== '' ? parseFloat(editForm.orb) : null,
                notes: editForm.notes
            }
            const res = await updateAspect(clientId, editingId, payload)
            setAspects(aspects.map(a => a.id === editingId ? res.data : a))
            setEditingId(null)
        } catch (err) {
            setErrorMsg('編輯相位失敗')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('確定刪除此相位？')) return
        try {
            await deleteAspect(clientId, id)
            setAspects(aspects.filter(a => a.id !== id))
        } catch (err) {
            setErrorMsg('刪除相位失敗')
        }
    }

    if (loading) return <div className="text-center py-3"><Spinner animation="border" size="sm" /></div>

    return (
        <div>
            <h6 className="mb-3">重要相位</h6>

            {errorMsg && <Alert variant="danger" dismissible onClose={() => setErrorMsg('')} className="py-2">{errorMsg}</Alert>}

            {/* 新增表單 */}
            <Row className="g-2 mb-3 align-items-end">
                <Col md={2}>
                    <Form.Select size="sm" value={form.planet1} onChange={e => handleFormChange('planet1', e.target.value)}>
                        <option value="">行星 1</option>
                        {PLANETS.map(p => <option key={p} value={p}>{p}</option>)}
                    </Form.Select>
                </Col>
                <Col md={2}>
                    <Form.Select size="sm" value={form.aspectType} onChange={e => handleFormChange('aspectType', e.target.value)}>
                        <option value="">相位</option>
                        {ASPECT_TYPES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                    </Form.Select>
                </Col>
                <Col md={2}>
                    <Form.Select size="sm" value={form.planet2} onChange={e => handleFormChange('planet2', e.target.value)}>
                        <option value="">行星 2</option>
                        {PLANETS.map(p => <option key={p} value={p}>{p}</option>)}
                    </Form.Select>
                </Col>
                <Col md={1}>
                    <Form.Control size="sm" type="number" step="0.1" placeholder="角距" value={form.orb} onChange={e => handleFormChange('orb', e.target.value)} />
                </Col>
                <Col md={3}>
                    <Form.Control size="sm" type="text" placeholder="備註" value={form.notes} onChange={e => handleFormChange('notes', e.target.value)} />
                </Col>
                <Col md={2}>
                    <Button size="sm" variant="success" onClick={handleAdd} disabled={saving}>
                        {saving ? <Spinner animation="border" size="sm" /> : '+ 新增'}
                    </Button>
                </Col>
            </Row>

            {/* 相位列表 */}
            {aspects.length === 0 ? (
                <p className="text-muted small">尚無相位資料</p>
            ) : (
                <Table bordered hover responsive size="sm">
                    <thead className="table-dark">
                        <tr>
                            <th>行星 1</th>
                            <th>相位</th>
                            <th>行星 2</th>
                            <th>角距</th>
                            <th>備註</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {aspects.map(a => (
                            editingId === a.id ? (
                                <tr key={a.id}>
                                    <td>
                                        <Form.Select size="sm" value={editForm.planet1} onChange={e => handleEditChange('planet1', e.target.value)}>
                                            {PLANETS.map(p => <option key={p} value={p}>{p}</option>)}
                                        </Form.Select>
                                    </td>
                                    <td>
                                        <Form.Select size="sm" value={editForm.aspectType} onChange={e => handleEditChange('aspectType', e.target.value)}>
                                            {ASPECT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </Form.Select>
                                    </td>
                                    <td>
                                        <Form.Select size="sm" value={editForm.planet2} onChange={e => handleEditChange('planet2', e.target.value)}>
                                            {PLANETS.map(p => <option key={p} value={p}>{p}</option>)}
                                        </Form.Select>
                                    </td>
                                    <td>
                                        <Form.Control size="sm" type="number" step="0.1" value={editForm.orb} onChange={e => handleEditChange('orb', e.target.value)} />
                                    </td>
                                    <td>
                                        <Form.Control size="sm" type="text" value={editForm.notes} onChange={e => handleEditChange('notes', e.target.value)} />
                                    </td>
                                    <td>
                                        <Button size="sm" variant="primary" className="me-1" onClick={handleSaveEdit} disabled={saving}>確認</Button>
                                        <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>取消</Button>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={a.id}>
                                    <td>{a.planet1}</td>
                                    <td>{ASPECT_TYPES.find(t => t.value === a.aspectType)?.label || a.aspectType}</td>
                                    <td>{a.planet2}</td>
                                    <td>{a.orb}</td>
                                    <td>{a.notes}</td>
                                    <td>
                                        <Button size="sm" variant="outline-warning" className="me-1" onClick={() => handleStartEdit(a)}>編輯</Button>
                                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(a.id)}>刪除</Button>
                                    </td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    )
}

export default AspectTable
