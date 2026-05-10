import { useState } from 'react'
import { Card, Button, Form, Alert } from 'react-bootstrap'

const emptyForm = { consultationDate: '', notes: '' }

function ConsultationLog() {
    const [logs, setLogs] = useState([
        { id: 1, consultationDate: '2025-01-15 14:00', notes: '第一次諮詢，討論感情運勢' },
        { id: 2, consultationDate: '2025-03-20 16:00', notes: '討論工作轉換時機' },
    ])
    const [form, setForm] = useState(emptyForm)
    const [showForm, setShowForm] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const handleFormChange = (field, value) => {
        setForm({ ...form, [field]: value })
    }

    const handleAdd = () => {
        if (!form.consultationDate || !form.notes.trim()) {
            setErrorMsg('請填寫日期與說明')
            return
        }
        setLogs([...logs, { ...form, id: Date.now() }])
        setForm(emptyForm)
        setShowForm(false)
        setErrorMsg('')
    }

    const handleDelete = (id) => {
        if (!window.confirm('確定刪除此筆記錄？')) return
        setLogs(logs.filter(l => l.id !== id))
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">諮詢記錄</h6>
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? '取消' : '+ 新增記錄'}
                </Button>
            </div>

            {errorMsg && <Alert variant="danger" className="py-2">{errorMsg}</Alert>}

            {/* 新增表單 */}
            {showForm && (
                <Card className="mb-3">
                    <Card.Body>
                        <Form.Group className="mb-2">
                            <Form.Label className="small">諮詢日期時間</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                size="sm"
                                value={form.consultationDate}
                                onChange={e => handleFormChange('consultationDate', e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small">說明</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                size="sm"
                                placeholder="諮詢內容說明"
                                value={form.notes}
                                onChange={e => handleFormChange('notes', e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" size="sm" onClick={handleAdd}>
                            新增
                        </Button>
                    </Card.Body>
                </Card>
            )}

            {/* 記錄列表 */}
            {logs.length === 0 ? (
                <p className="text-muted small">尚無諮詢記錄</p>
            ) : (
                logs.map(log => (
                    <Card key={log.id} className="mb-2">
                        <Card.Body className="py-2">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <small className="text-muted">{log.consultationDate}</small>
                                    <p className="mb-0 mt-1">{log.notes}</p>
                                </div>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(log.id)}
                                >
                                    刪除
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                ))
            )}
        </div>
    )
}

export default ConsultationLog