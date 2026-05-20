// AnalysisBlock.jsx — 我的解析
//
// GET  /api/clients/{id}/notes  → 後端依 sort_order DESC 回傳，最新在最上
// POST → 新增後 prepend 至列表最頂端（setBlocks([res.data, ...blocks])）
// PUT  → 更新 state 中對應項目，不重新 fetch
// DEL  → 從 state 移除，不重新 fetch
// 每筆解析旁有「🤖 AI 諮詢」按鈕，開啟 AIChatModal 並傳入該筆 title + content

import { useState, useEffect } from 'react'
import { Card, Button, Form, Spinner, Alert } from 'react-bootstrap'
import AIChatModal from './AIChatModal'
import { getNotes, createNote, updateNote, deleteNote } from '../api/clients'
import { exportNotes } from '../api/export'

function AnalysisBlock({ clientId }) {
    const [blocks,    setBlocks]    = useState([])
    const [loading,   setLoading]   = useState(true)
    const [savingId,  setSavingId]  = useState(null)
    const [errorMsg,  setErrorMsg]  = useState('')
    const [successId, setSuccessId] = useState(null)
    const [aiTarget,  setAiTarget]  = useState(null)

    // 初次載入：後端已依 sort_order DESC 排序，直接使用
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

    // 新增後 prepend 至列表最頂端；sort_order 由後端自動遞增，前端不傳
    const handleAdd = async () => {
        try {
            const res = await createNote(clientId, { title: '', content: '' })
            setBlocks([res.data, ...blocks])
        } catch (err) {
            setErrorMsg('新增解析失敗')
        }
    }

    // 儲存：僅更新 title / content，不重新 fetch 整個列表
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

    // 刪除：從 state 移除，不重新 fetch
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

    if (loading) return (
        <div className="text-center py-3">
            <Spinner animation="border" size="sm" />
        </div>
    )

    return (
        <div>
            {/* 標題列 */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">我的解析</h6>
                <div>
                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={handleExport}>
                        匯出
                    </Button>
                    <Button variant="outline-primary" size="sm" onClick={handleAdd}>
                        + 新增解析
                    </Button>
                </div>
            </div>

            {/* 錯誤提示 */}
            {errorMsg && (
                <Alert variant="danger" dismissible onClose={() => setErrorMsg('')} className="py-2">
                    {errorMsg}
                </Alert>
            )}

            {/* 空狀態 */}
            {blocks.length === 0 && (
                <p className="text-muted small">尚無解析，點擊「+ 新增解析」開始建立</p>
            )}

            {/* 解析列表（後端已降序，最新在最上） */}
            {blocks.map(block => (
                <Card key={block.id} className="mb-3">
                    <Card.Body>
                        {/* 標題列 + 操作按鈕 */}
                        <div className="d-flex justify-content-between align-items-center mb-2 gap-2">
                            <Form.Control
                                type="text"
                                size="sm"
                                placeholder="標題（例：感情運勢）"
                                value={block.title ?? ''}
                                onChange={e => handleChange(block.id, 'title', e.target.value)}
                                style={{ maxWidth: '300px' }}
                            />
                            <div className="d-flex gap-2 flex-shrink-0">
                                {/* AI 諮詢：傳入該筆解析的 title + content 作為背景 */}
                                <Button
                                    variant="outline-info"
                                    size="sm"
                                    onClick={() => setAiTarget(block)}
                                >
                                    🤖 AI 諮詢
                                </Button>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleSave(block)}
                                    disabled={savingId === block.id}
                                >
                                    {savingId === block.id
                                        ? <Spinner animation="border" size="sm" />
                                        : successId === block.id
                                            ? '✅ 已儲存'
                                            : '儲存'}
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

                        {/* 解析內容 */}
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="在這裡輸入解析內容..."
                            value={block.content ?? ''}
                            onChange={e => handleChange(block.id, 'content', e.target.value)}
                        />
                    </Card.Body>
                </Card>
            ))}

            {/* AI 諮詢 Modal — 以當前解析的 title/content 作為 AI 背景 context */}
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
