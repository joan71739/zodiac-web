// TransitNoteBlock.jsx — 行運解析區塊
// 邏輯完全照 ElementNoteBlock，只換 API 呼叫來源
// 樣式對齊 AnalysisBlock（我的解析），差異只有：
//   - 無 AI諮詢 按鈕
//   - 第二列：標籤輸入框 ＋ 主題下拉（取代行星/星座/宮位/主題）

import { useState, useEffect } from 'react'
import { Card, Button, Form, Spinner, Alert, Row, Col } from 'react-bootstrap'
import {
    getTransitNotes,
    createTransitNote,
    updateTransitNote,
    deleteTransitNote,
} from '../api/transitNotes'
import { TOPIC_OPTIONS } from '../utils/codeMap'

export default function TransitNoteBlock({
    transitPlanet,
    aspectType = null,
    natalPlanet = null,
    transitHouse = null,
}) {
    const [blocks, setBlocks] = useState([])
    const [loading, setLoading] = useState(true)
    const [savingId, setSavingId] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')
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
                title: block.title,
                content: block.content,
                tag: block.tag,
                topic: block.topic || null,
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
        if (!window.confirm('確定刪除這筆解析？刪除後無法復原。')) return
        try {
            await deleteTransitNote(id)
            setBlocks(blocks.filter(b => b.id !== id))
        } catch {
            setErrorMsg('刪除失敗')
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
                <h6 className="mb-0">解析筆記</h6>
                <Button variant="outline-primary" size="sm" onClick={handleAdd}>
                    + 新增解析
                </Button>
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
                                placeholder="標題（例：土星合相本命太陽）"
                                value={block.title ?? ''}
                                onChange={e => handleChange(block.id, 'title', e.target.value)}
                                style={{ maxWidth: '300px' }}
                            />
                            <div className="d-flex gap-2 align-items-center flex-shrink-0">
                                <Button
                                    variant="outline-success"
                                    size="sm"
                                    disabled={savingId === block.id}
                                    onClick={() => handleSave(block)}
                                >
                                    {savingId === block.id
                                        ? <Spinner animation="border" size="sm" />
                                        : successId === block.id ? '✓ 已儲存' : '儲存'
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

                        {/* 第二列：標籤 ＋ 主題 */}
                        <Row className="mb-2 g-2">
                            <Col xs={12} sm={9}>
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    placeholder="標籤（選填，逗號分隔）"
                                    value={block.tag ?? ''}
                                    onChange={e => handleChange(block.id, 'tag', e.target.value)}
                                />
                            </Col>
                            <Col xs={12} sm={3}>
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
        </div>
    )
}