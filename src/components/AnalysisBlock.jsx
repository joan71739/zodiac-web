import { useState, useEffect } from 'react'
import { Card, Button, Form, Spinner, Alert } from 'react-bootstrap'
import AIChatModal from './AIChatModal'
import { getNotes, createNote, updateNote, deleteNote } from '../api/clients'
import { exportNotes } from '../api/export'

function AnalysisBlock({ clientId }) {
    const [blocks, setBlocks] = useState([])
    const [loading, setLoading] = useState(true)
    const [savingId, setSavingId] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')
    const [successId, setSuccessId] = useState(null)
    const [aiTarget, setAiTarget] = useState(null)

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await getNotes(clientId)
                setBlocks(res.data)
            } catch (err) {
                setErrorMsg('載入解析資料失敗')
            } finally {
                setLoading(false)
            }
        }
        if (clientId) fetchNotes()
    }, [clientId])

    const handleChange = (id, field, value) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b))
    }

    const handleAdd = async () => {
        try {
            const res = await createNote(clientId, { title: '', content: '' })
            setBlocks([...blocks, res.data])
        } catch (err) {
            setErrorMsg('新增解析失敗')
        }
    }

    const handleSave = async (block) => {
        try {
            setSavingId(block.id)
            const res = await updateNote(clientId, block.id, { title: block.title, content: block.content })
            setBlocks(blocks.map(b => b.id === block.id ? res.data : b))
            setSuccessId(block.id)
            setTimeout(() => setSuccessId(null), 2000)
        } catch (err) {
            setErrorMsg('儲存解析失敗')
        } finally {
            setSavingId(null)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('確定刪除此解析？刪除後無法復原。')) return
        try {
            await deleteNote(clientId, id)
            setBlocks(blocks.filter(b => b.id !== id))
        } catch (err) {
            setErrorMsg('刪除解析失敗')
        }
    }

    const handleExport = async () => {
        try {
            await exportNotes(clientId)
        } catch (err) {
            setErrorMsg('匯出失敗')
        }
    }

    if (loading) return <div className="text-center py-3"><Spinner animation="border" size="sm" /></div>

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">我的解析</h6>
                <div>
                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={handleExport}>
                        匯出
                    </Button>
                    <Button variant="outline-primary" size="sm" onClick={handleAdd}>
                        + 新增區塊
                    </Button>
                </div>
            </div>

            {errorMsg && <Alert variant="danger" dismissible onClose={() => setErrorMsg('')} className="py-2">{errorMsg}</Alert>}

            {blocks.length === 0 && <p className="text-muted small">尚無解析，點擊「新增區塊」開始建立</p>}

            {blocks.map(block => (
                <Card key={block.id} className="mb-3">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <Form.Control
                                type="text"
                                placeholder="標題（例：感情運勢）"
                                value={block.title}
                                onChange={e => handleChange(block.id, 'title', e.target.value)}
                                style={{ maxWidth: '300px' }}
                            />
                            <div>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => setAiTarget(block)}
                                >
                                    🤖 AI 輔助
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleSave(block)}
                                    disabled={savingId === block.id}
                                >
                                    {savingId === block.id
                                        ? <Spinner animation="border" size="sm" />
                                        : successId === block.id ? '✅ 已儲存' : '儲存'
                                    }
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(block.id)}
                                >
                                    刪除
                                </Button>
                            </div>
                        </div>

                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="在此輸入解析內容..."
                            value={block.content}
                            onChange={e => handleChange(block.id, 'content', e.target.value)}
                        />
                    </Card.Body>
                </Card>
            ))}

            {aiTarget && (
                <AIChatModal
                    show={!!aiTarget}
                    onHide={() => setAiTarget(null)}
                    noteTitle={aiTarget.title}
                    noteContent={aiTarget.content}
                />
            )}
        </div>
    )
}

export default AnalysisBlock
