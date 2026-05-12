import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap'
import { getClient, createClient, updateClient } from '../api/clients'

function ClientForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEdit = !!id

    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        birthTime: '',
        birthPlace: ''
    })
    const [loading, setLoading] = useState(isEdit)
    const [submitting, setSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        if (!isEdit) return
        const fetchClient = async () => {
            try {
                const res = await getClient(id)
                const c = res.data
                setFormData({
                    name: c.name || '',
                    birthDate: c.birthDate || '',
                    birthTime: c.birthTime || '',
                    birthPlace: c.birthPlace || ''
                })
            } catch (err) {
                setErrorMsg('載入客戶資料失敗')
            } finally {
                setLoading(false)
            }
        }
        fetchClient()
    }, [id, isEdit])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.name.trim()) {
            setErrorMsg('姓名為必填欄位')
            return
        }
        try {
            setSubmitting(true)
            if (isEdit) {
                await updateClient(id, formData)
            } else {
                await createClient(formData)
            }
            navigate('/')
        } catch (err) {
            setErrorMsg(isEdit ? '編輯失敗，請稍後再試' : '新增失敗，請稍後再試')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        )
    }

    return (
        <div>
            <h4 className="mb-4">{isEdit ? '編輯客戶' : '新增客戶'}</h4>

            {errorMsg && <Alert variant="danger" dismissible onClose={() => setErrorMsg('')}>{errorMsg}</Alert>}

            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>姓名 *</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="請輸入姓名"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>生日</Form.Label>
                            <Form.Control
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>出生時間</Form.Label>
                            <Form.Control
                                type="time"
                                name="birthTime"
                                value={formData.birthTime}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>出生地</Form.Label>
                            <Form.Control
                                type="text"
                                name="birthPlace"
                                placeholder="例：台北"
                                value={formData.birthPlace}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="me-2" disabled={submitting}>
                            {submitting ? <Spinner animation="border" size="sm" /> : (isEdit ? '儲存編輯' : '新增客戶')}
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/')} disabled={submitting}>
                            取消
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default ClientForm
