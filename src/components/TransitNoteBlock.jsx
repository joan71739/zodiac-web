// TransitNoteBlock.jsx — 行運解析區塊
// 邏輯完全照 ElementNoteBlock，只換 API 呼叫來源

import { useState, useEffect } from 'react'
import { Card, Button, Form, Spinner, Alert } from 'react-bootstrap'
import {
    getTransitNotes,
    createTransitNote,
    updateTransitNote,
    deleteTransitNote,
} from '../api/transitNotes'
import { TOPIC_OPTIONS } from '../utils/codeMap'

export default function TransitNoteBlock({
    transitPlanet,
    aspectType    = null,
    natalPlanet   = null,
    transitHouse  = null,
}) {
    const [blocks,    setBlocks]    = useState([])
    const [loading,   setLoading]   = useState(true)
    const [savingId,  setSavingId]  = useState(null)
    const [errorMsg,  setErrorMsg]  = useState('')
    const [successId, setSuccessId] = useState(null)

    useEffect(() => {
        if (!transitPlanet) return
        const fetch = async () => {
            setLoading(true)
            try {
                const res = await getTransitNotes(transitPlanet, aspectType, natalPlanet, transitHouse)
                setBlocks(res.data)
            } catch {
                setErrorMsg('載入解析資料失敗')
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [transitPlanet, aspectType, natalPlanet, transitHouse])

    const handleChange = (id, field, value) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b))
    }

    const handleAdd = async () => {
        try {
            const res = await createTransitNote(
                transitPlanet, aspectType, natalPlanet, transitHouse,
                { title: '', content: '', tag: '', topic: null }
            )
            setBlocks([res.data, ...blocks])
        } catch {
            setErrorMsg('新增解析失敗')
        }
    }

    const handleSave = async (block) => {
        try {
            setSavingId(block.id)
            const res = await updateTransitNote(block.id, {
                title:   block.title,
                content: block.content,
                tag:     block.tag,
                topic:   block.topic || null,
            })
            setBlocks(blocks.map(b => b.id === block.id ? res.data : b))
            setSuccessId(block.id)
            setTimeout(() => setSuccessId(null), 2000)
        } catch {
            setErrorMsg('儲存失敗')
        } finally {
            setSavingId(null)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('確定刪除這筆解析？')) return
        try {
            await deleteTransitNote(id)
            setBlocks(blocks.filter(b => b.id !== id))
        } catch {
            setErrorMsg('刪除失敗')
        }
    }

    if (loading) return (
        <div className="text-center py-4">
            <Spinner animation="border" size="sm" />
        </div>
    )

    return (
        <div>
            {errorMsg && (
                <Alert variant="danger" dismissible onClose={() => setErrorMsg('')}>
                    {errorMsg}
                </Alert>
            )}

            <div className="d-flex justify-content-end mb-3">
                <Button size="sm" variant="outline-primary" onClick={handleAdd}>
                    ＋ 新增解析
                </Button>
            </div>

            {blocks.length === 0 && (
                <div className="text-center text-muted py-4" style={{ fontSize: '0.9rem' }}>
                    尚無解析，點擊「新增解析」開始撰寫
                </div>
            )}

            {blocks.map(block => (
                <Card
                    key={block.id}
                    className="mb-3"
                    style={{
                        border: successId === block.id
                            ? '1px solid #4CAF50'
                            : '1px solid #2D2D45',
                        backgroundColor: '#1C1C2E',
                    }}
                >
                    <Card.Body>
                        {/* 標題列 + 操作按鈕 */}
                        <div className="d-flex justify-content-between align-items-center mb-2 gap-2">
                            <Form.Control
                                type="text"
                                size="sm"
                                placeholder="標題"
                                value={block.title ?? ''}
                                onChange={e => handleChange(block.id, 'title', e.target.value)}
                                style={{
                                    maxWidth: '300px',
                                    backgroundColor: '#2D2D45',
                                    border: '1px solid #3D3D55',
                                    color: '#E8E0F0',
                                }}
                            />
                            <div className="d-flex gap-2 align-items-center flex-shrink-0">
                                {/* 主題分類 */}
                                <Form.Select
                                    size="sm"
                                    value={block.topic ?? ''}
                                    onChange={e => handleChange(block.id, 'topic', e.target.value || null)}
                                    style={{
                                        maxWidth: '130px',
                                        backgroundColor: '#2D2D45',
                                        border: '1px solid #3D3D55',
                                        color: '#B0A8C8',
                                        fontSize: '0.78rem',
                                    }}
                                >
                                    <option value="">未分類</option>
                                    {TOPIC_OPTIONS.map(({ code, label }) => (
                                        <option key={code} value={code}>{label}</option>
                                    ))}
                                </Form.Select>

                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleSave(block)}
                                    disabled={savingId === block.id}
                                >
                                    {savingId === block.id
                                        ? <Spinner animation="border" size="sm" />
                                        : successId === block.id ? '✅ 已儲存' : '儲存'}
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

                        {/* tag 欄位 */}
                        <Form.Control
                            type="text"
                            size="sm"
                            placeholder="標籤（選填）"
                            value={block.tag ?? ''}
                            onChange={e => handleChange(block.id, 'tag', e.target.value)}
                            className="mb-2"
                            style={{
                                backgroundColor: '#2D2D45',
                                border: '1px solid #3D3D55',
                                color: '#E8E0F0',
                                fontSize: '0.82rem',
                            }}
                        />

                        {/* 解析內容 */}
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="在這裡輸入解析內容..."
                            value={block.content ?? ''}
                            onChange={e => handleChange(block.id, 'content', e.target.value)}
                            style={{
                                backgroundColor: '#2D2D45',
                                border: '1px solid #3D3D55',
                                color: '#E8E0F0',
                            }}
                        />
                    </Card.Body>
                </Card>
            ))}
        </div>
    )
}
