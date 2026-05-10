import { useState } from 'react'
import { Card, Button, Form } from 'react-bootstrap'
import AIChatModal from './AIChatModal'

function AnalysisBlock() {
    const [blocks, setBlocks] = useState([
        { id: 1, title: '', content: '' }
    ])
    const [aiTarget, setAiTarget] = useState(null)
    const [saved, setSaved] = useState(false)

    const handleChange = (id, field, value) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b))
        setSaved(false)
    }

    const handleAdd = () => {
        setBlocks([...blocks, { id: Date.now(), title: '', content: '' }])
    }

    const handleDelete = (id) => {
        if (blocks.length === 1) return
        setBlocks(blocks.filter(b => b.id !== id))
    }

    const handleSave = () => {
        // 後端好了換成 API
        console.log('儲存解析', blocks)
        setSaved(true)
    }

    const handleOpenAI = (block) => {
        setAiTarget(block)
    }

    const handleCloseAI = () => {
        setAiTarget(null)
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">我的解析</h6>
                <div>
                    <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={handleAdd}
                    >
                        + 新增區塊
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSave}
                    >
                        儲存
                    </Button>
                </div>
            </div>

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
                                    onClick={() => handleOpenAI(block)}
                                >
                                    🤖 AI 輔助
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(block.id)}
                                    disabled={blocks.length === 1}
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

            {saved && (
                <p className="text-success small">✅ 已儲存</p>
            )}

            {aiTarget && (
                <AIChatModal
                    show={!!aiTarget}
                    onHide={handleCloseAI}
                    noteTitle={aiTarget.title}
                    noteContent={aiTarget.content}
                />
            )}
        </div>
    )
}

export default AnalysisBlock