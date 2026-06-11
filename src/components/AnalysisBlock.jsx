// AnalysisBlock.jsx — 我的解析 (v17)
//
// 修改說明：新增四個選填標記欄位
//   planet_key / sign_key / house_key / topic
//   全部選填，不填等同舊版行為
//
// GET  /api/clients/{id}/notes  → 後端依 sort_order DESC 回傳，最新在最上
// POST → 新增後 prepend 至列表最頂端
// PUT  → 更新 state 中對應項目，不重新 fetch
// DEL  → 從 state 移除，不重新 fetch

import { useState, useEffect } from 'react'
import { Card, Button, Form, Spinner, Alert, Row, Col } from 'react-bootstrap'
import AIChatModal from './AIChatModal'
import { getNotes, createNote, updateNote, deleteNote } from '../api/clients'
import { exportNotes } from '../api/export'
import { PLANET_OPTIONS, SIGN_OPTIONS, TOPIC_OPTIONS } from '../utils/codeMap'

// 宮位選項
const HOUSE_OPTIONS = [
    { value: 1,  label: '一宮'   }, { value: 2,  label: '二宮'   },
    { value: 3,  label: '三宮'   }, { value: 4,  label: '四宮'   },
    { value: 5,  label: '五宮'   }, { value: 6,  label: '六宮'   },
    { value: 7,  label: '七宮'   }, { value: 8,  label: '八宮'   },
    { value: 9,  label: '九宮'   }, { value: 10, label: '十宮'   },
    { value: 11, label: '十一宮' }, { value: 12, label: '十二宮' },
]

function AnalysisBlock({ clientId }) {
    const [blocks,    setBlocks]    = useState([])
    const [loading,   setLoading]   = useState(true)
    const [savingId,  setSavingId]  = useState(null)
    const [errorMsg,  setErrorMsg]  = useState('')
    const [successId, setSuccessId] = useState(null)
    const [aiTarget,  setAiTarget]  = useState(null)

    // 初次載入
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

    // 新增：預設四個標記欄位為 null
    const handleAdd = async () => {
        try {
            const res = await createNote(clientId, {
                title:     '',
                content:   '',
                planetKey: null,
                signKey:   null,
                houseKey:  null,
                topic:     null,
            })
            setBlocks([res.data, ...blocks])
        } catch (err) {
            setErrorMsg('新增解析失敗')
        }
    }

    // 儲存：包含四個標記欄位
    const handleSave = async (block) => {
        try {
            setSavingId(block.id)
            const res = await updateNote(clientId, block.id, {
                title:     block.title,
                content:   block.content,
                planetKey: block.planetKey  || null,
                signKey:   block.signKey    || null,
                houseKey:  block.houseKey   ? Number(block.houseKey) : null,
                topic:     block.topic      || null,
            })
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

            {/* 解析列表 */}
            {blocks.map(block => (
                <Card key={block.id} className="mb-3">
                    <Card.Body>

                        {/* 第一列：標題 + 操作按鈕 */}
                        <div className="d-flex justify-content-between align-items-center mb-2 gap-2">
                            <Form.Control
                                type="text"
                                size="sm"
                                placeholder="標題（例：太陽的壓抑）"
                                value={block.title ?? ''}
                                onChange={e => handleChange(block.id, 'title', e.target.value)}
                                style={{ maxWidth: '300px' }}
                            />
                            <div className="d-flex gap-2 flex-shrink-0">
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

                        {/* 第二列：選填標記欄位 */}
                        <Row className="g-2 mb-2">
                            {/* 行星 */}
                            <Col xs={6} sm={3}>
                                <Form.Select
                                    size="sm"
                                    value={block.planetKey ?? ''}
                                    onChange={e => handleChange(block.id, 'planetKey', e.target.value || null)}
                                >
                                    <option value="">行星（選填）</option>
                                    {PLANET_OPTIONS.map(({ code, label }) => (
                                        <option key={code} value={code}>{label}</option>
                                    ))}
                                </Form.Select>
                            </Col>

                            {/* 星座 */}
                            <Col xs={6} sm={3}>
                                <Form.Select
                                    size="sm"
                                    value={block.signKey ?? ''}
                                    onChange={e => handleChange(block.id, 'signKey', e.target.value || null)}
                                >
                                    <option value="">星座（選填）</option>
                                    {SIGN_OPTIONS.map(({ code, label }) => (
                                        <option key={code} value={code}>{label}</option>
                                    ))}
                                </Form.Select>
                            </Col>

                            {/* 宮位 */}
                            <Col xs={6} sm={3}>
                                <Form.Select
                                    size="sm"
                                    value={block.houseKey ?? ''}
                                    onChange={e => handleChange(block.id, 'houseKey', e.target.value || null)}
                                >
                                    <option value="">宮位（選填）</option>
                                    {HOUSE_OPTIONS.map(({ value, label }) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </Form.Select>
                            </Col>

                            {/* 主題 */}
                            <Col xs={6} sm={3}>
                                <Form.Select
                                    size="sm"
                                    value={block.topic ?? ''}
                                    onChange={e => handleChange(block.id, 'topic', e.target.value || null)}
                                >
                                    <option value="">主題（選填）</option>
                                    {TOPIC_OPTIONS.map(({ code, label }) => (
                                        <option key={code} value={code}>{label}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>

                        {/* 第三列：解析內容 */}
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

            {/* AI 諮詢 Modal */}
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
