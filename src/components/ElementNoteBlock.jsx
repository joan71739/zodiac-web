// ============================================================
// ElementNoteBlock.jsx — 元素解析區塊
//
// 邏輯參考 AnalysisBlock.jsx，差異：
//   - 無 clientId，改用 signKey / planetKey / houseKey 定位
//   - 多一個 tag 欄位（手動輸入，第二批細作 UI）
//   - 無 AI 諮詢按鈕（元素解析暫不接 AI）
//
// GET  → 後端依 sort_order DESC 回傳，最新在最上
// POST → 新增後 prepend 至列表最頂端
// PUT  → 更新 state 中對應項目，不重新 fetch
// DEL  → 從 state 移除，不重新 fetch
// ============================================================

import { useState, useEffect } from 'react'
import { Card, Button, Form, Spinner, Alert } from 'react-bootstrap'
import {
    getElementNotes,
    createElementNote,
    updateElementNote,
    deleteElementNote,
} from '../api/elementNotes'

export default function ElementNoteBlock({ signKey, planetKey = null, houseKey = null }) {
    const [blocks,    setBlocks]    = useState([])
    const [loading,   setLoading]   = useState(true)
    const [savingId,  setSavingId]  = useState(null)
    const [errorMsg,  setErrorMsg]  = useState('')
    const [successId, setSuccessId] = useState(null)

    // ── 初次載入 ────────────────────────────────────────
    useEffect(() => {
        if (!signKey) return
        const fetch = async () => {
            setLoading(true)
            try {
                const res = await getElementNotes(signKey, planetKey, houseKey)
                setBlocks(res.data)
            } catch {
                setErrorMsg('載入解析資料失敗')
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [signKey, planetKey, houseKey])

    // ── 欄位變更 ─────────────────────────────────────────
    const handleChange = (id, field, value) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b))
    }

    // ── 新增 ─────────────────────────────────────────────
    const handleAdd = async () => {
        try {
            const res = await createElementNote(
                signKey, planetKey, houseKey,
                { title: '', content: '', tag: '' }
            )
            setBlocks([res.data, ...blocks])
        } catch {
            setErrorMsg('新增解析失敗')
        }
    }

    // ── 儲存 ─────────────────────────────────────────────
    const handleSave = async (block) => {
        try {
            setSavingId(block.id)
            const res = await updateElementNote(block.id, {
                title:   block.title,
                content: block.content,
                tag:     block.tag,
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

    // ── 刪除 ─────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!window.confirm('確定刪除這筆解析？')) return
        try {
            await deleteElementNote(id)
            setBlocks(blocks.filter(b => b.id !== id))
        } catch {
            setErrorMsg('刪除失敗')
        }
    }

    // ── render ───────────────────────────────────────────
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
                            ? '1px solid #28a745'
                            : '1px solid #2D2D45',
                        backgroundColor: '#16162A',
                        transition: 'border 0.3s',
                    }}
                >
                    <Card.Body>
                        {/* 標題 */}
                        <Form.Control
                            type="text"
                            placeholder="標題"
                            value={block.title || ''}
                            onChange={e => handleChange(block.id, 'title', e.target.value)}
                            className="mb-2"
                            style={{
                                backgroundColor: '#1C1C2E',
                                color: '#E8E0F0',
                                border: '1px solid #2D2D45',
                                fontSize: '0.9rem',
                            }}
                        />

                        {/* 內容 */}
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="解析內容..."
                            value={block.content || ''}
                            onChange={e => handleChange(block.id, 'content', e.target.value)}
                            className="mb-2"
                            style={{
                                backgroundColor: '#1C1C2E',
                                color: '#E8E0F0',
                                border: '1px solid #2D2D45',
                                fontSize: '0.88rem',
                                resize: 'vertical',
                            }}
                        />

                        {/* 標籤（第一批先開欄位，第二批細作 UI） */}
                        <Form.Control
                            type="text"
                            placeholder="標籤（可用逗號分隔，例如：本質, 火元素）"
                            value={block.tag || ''}
                            onChange={e => handleChange(block.id, 'tag', e.target.value)}
                            className="mb-3"
                            style={{
                                backgroundColor: '#1C1C2E',
                                color: '#E8E0F0',
                                border: '1px solid #2D2D45',
                                fontSize: '0.82rem',
                            }}
                        />

                        {/* 操作列 */}
                        <div className="d-flex justify-content-between align-items-center">
                            {/* 建立/更新時間 */}
                            <span style={{ fontSize: '0.72rem', color: '#555' }}>
                                {block.updatedAt
                                    ? `更新：${new Date(block.updatedAt).toLocaleString('zh-TW')}`
                                    : ''}
                            </span>

                            <div className="d-flex gap-2">
                                {/* 儲存成功提示 */}
                                {successId === block.id && (
                                    <span style={{ fontSize: '0.8rem', color: '#28a745', lineHeight: '31px' }}>
                                        ✓ 已儲存
                                    </span>
                                )}

                                <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => handleDelete(block.id)}
                                >
                                    刪除
                                </Button>

                                <Button
                                    size="sm"
                                    variant="outline-success"
                                    onClick={() => handleSave(block)}
                                    disabled={savingId === block.id}
                                >
                                    {savingId === block.id
                                        ? <Spinner animation="border" size="sm" />
                                        : '儲存'}
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </div>
    )
}
