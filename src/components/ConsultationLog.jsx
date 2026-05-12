import { useState, useEffect } from 'react'
import { Card, Button, Form, Spinner, Alert } from 'react-bootstrap'
import { getLogs, createLog, updateLog, deleteLog } from '../api/clients'
import { exportLogs } from '../api/export'

const emptyForm = { consultationDate: '', notes: '' }

function ConsultationLog({ clientId }) {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await getLogs(clientId)
                setLogs(res.data)
            } catch (err) {
                setErrorMsg('載入諮詢記錄失敗')
            } finally {
                setLoading(false)
            }
        }
        if (clientId) fetchLogs()
    }, [clientId])

    const handleAdd = async () => {
        if (!form.consultationDate) return
        try {
            setSaving(true)
            const res = await createLog(clientId, form)
            setLogs([res.data, ...logs])
            setForm(emptyForm)
            setShowForm(false)
        } catch (err) {
            setErrorMsg('新增諮詢記錄失敗')
        } finally {
            setSaving(false)
        }
    }

    const handleStartEdit = (log) => {
        setEditingId(log.id)
        setEditForm({
            consultationDate: log.consultationDate?.slice(0, 16) || '',
            notes: log.notes || ''
        })
    }

    const handleSaveEdit = async () => {
        try {
            setSaving(true)
            const res = await updateLog(clientId, editingId, editForm)
            setLogs(logs.map(l => l.id === editingId ? res.data : l))
            setEditingId(null)
        } catch (err) {
            setErrorMsg('編輯諮詢記錄失敗')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('確定刪除此諮詢記錄？')) return
        try {
            await deleteLog(clientId, id)
            setLogs(logs.filter(l => l.id !== id))
        } catch (err) {
            setErrorMsg('刪除諮詢記錄失敗')
        }
    }

    const handleExport = async () => {
        try {
            await exportLogs(clientId)
        } catch (err) {
            setErrorMsg('匯出失敗')
        }
    }

    if (loading) return <div className="text-center py-3"><Spinner animation="border" size="sm" /></div>

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">諮詢 Log</h6>
                <div>
                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={handleExport}>
                        匯出
                    </Button>
                    <Button
                        variant={showForm ? 'secondary' : 'outline-primary'}
                        size="sm"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? '取消' : '+ 新增記錄'}
                    </Button>
                </div>
            </div>

            {errorMsg && <Alert variant="danger" dismissible onClose={() => setErrorMsg('')} className="py-2">{errorMsg}</Alert>}

            {/* 新增表單 */}
            {showForm && (
                <Card className="mb-3">
                    <Card.Body>
                        <Form.Group className="mb-2">
                            <Form.Label className="small">諮詢日期時間 *</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                size="sm"
                                value={form.consultationDate}
                                onChange={e => setForm({ ...form, consultationDate: e.target.value })}
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
                                onChange={e => setForm({ ...form, notes: e.target.value })}
                            />
                        </Form.Group>
                        <Button variant="primary" size="sm" onClick={handleAdd} disabled={saving}>
                            {saving ? <Spinner animation="border" size="sm" /> : '新增'}
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
                            {editingId === log.id ? (
                                <>
                                    <Form.Control
                                        type="datetime-local"
                                        size="sm"
                                        className="mb-2"
                                        value={editForm.consultationDate}
                                        onChange={e => setEditForm({ ...editForm, consultationDate: e.target.value })}
                                    />
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        size="sm"
                                        className="mb-2"
                                        value={editForm.notes}
                                        onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                                    />
                                    <Button size="sm" variant="primary" className="me-2" onClick={handleSaveEdit} disabled={saving}>確認</Button>
                                    <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>取消</Button>
                                </>
                            ) : (
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <small className="text-muted">{log.consultationDate?.replace('T', ' ').slice(0, 16)}</small>
                                        <p className="mb-0 mt-1">{log.notes}</p>
                                    </div>
                                    <div>
                                        <Button variant="outline-warning" size="sm" className="me-1" onClick={() => handleStartEdit(log)}>編輯</Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(log.id)}>刪除</Button>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                ))
            )}
        </div>
    )
}

export default ConsultationLog
