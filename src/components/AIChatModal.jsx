import { useState, useRef, useEffect } from 'react'
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap'
import { sendAIChat } from '../api/ai'

function AIChatModal({ show, onHide, noteTitle, noteContent }) {
    const [messages, setMessages] = useState([]) // { role: 'user'|'assistant', content: string }
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const bottomRef = useRef(null)

    // Modal 每次開啟時清空對話
    useEffect(() => {
        if (show) {
            setMessages([])
            setInput('')
            setErrorMsg('')
        }
    }, [show])

    // 自動捲到最新訊息
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async () => {
        const userMessage = input.trim()
        if (!userMessage || loading) return

        const newMessages = [...messages, { role: 'user', content: userMessage }]
        setMessages(newMessages)
        setInput('')
        setLoading(true)
        setErrorMsg('')

        try {
            // history = 不含本次訊息的歷史（上一輪的 user/assistant pair）
            const history = messages.map(m => ({ role: m.role, content: m.content }))

            const res = await sendAIChat({
                noteTitle,
                noteContent,
                history,
                userMessage
            })

            const reply = res.data.reply
            setMessages([...newMessages, { role: 'assistant', content: reply }])
        } catch (err) {
            setErrorMsg('AI 回應失敗，請稍後再試')
            // 移除剛加入的 user 訊息（讓使用者可以重試）
            setMessages(messages)
            setInput(userMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <Modal show={show} onHide={onHide} size="lg" backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>🤖 AI 占星顧問助理</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {noteTitle && (
                    <div className="bg-light rounded p-2 mb-3 small text-muted">
                        <strong>解析背景：</strong>{noteTitle}
                    </div>
                )}

                {errorMsg && <Alert variant="danger" className="py-2">{errorMsg}</Alert>}

                {/* 對話區 */}
                <div
                    style={{
                        height: '380px',
                        overflowY: 'auto',
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        padding: '12px',
                        backgroundColor: '#f8f9fa'
                    }}
                >
                    {messages.length === 0 && (
                        <p className="text-muted text-center small mt-4">
                            請輸入問題，AI 將根據目前解析內容回應
                        </p>
                    )}

                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                            <div
                                style={{
                                    maxWidth: '75%',
                                    padding: '8px 12px',
                                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                    backgroundColor: msg.role === 'user' ? '#0d6efd' : '#ffffff',
                                    color: msg.role === 'user' ? '#fff' : '#212529',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    whiteSpace: 'pre-wrap',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="d-flex justify-content-start mb-3">
                            <div style={{
                                padding: '8px 14px',
                                borderRadius: '16px 16px 16px 4px',
                                backgroundColor: '#ffffff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}>
                                <Spinner animation="grow" size="sm" className="me-1" />
                                <Spinner animation="grow" size="sm" className="me-1" style={{ animationDelay: '0.15s' }} />
                                <Spinner animation="grow" size="sm" style={{ animationDelay: '0.3s' }} />
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* 輸入區 */}
                <div className="d-flex gap-2 mt-3">
                    <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="輸入問題（Enter 送出，Shift+Enter 換行）"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />
                    <Button
                        variant="primary"
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        style={{ minWidth: '72px' }}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : '送出'}
                    </Button>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <small className="text-muted me-auto">對話於關閉後清除，不做持久化儲存</small>
                <Button variant="secondary" onClick={onHide}>關閉</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AIChatModal
