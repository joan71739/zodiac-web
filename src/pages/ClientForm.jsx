import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Button, Card, Alert } from 'react-bootstrap'

function ClientForm() {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEdit = !!id

    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        birthTime: '',
        birthPlace: '',
    })
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        if (isEdit) {
            // 假資料，後端好了換成 API
            setTimeout(() => {
                setFormData({
                    name: '王小明',
                    birthDate: '1993-08-10',
                    birthTime: '08:30',
                    birthPlace: '台北',
                })
            }, 0)
        }
    }, [id])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault() // 先擋掉預設行為
        if (!formData.name.trim()) {
            setErrorMsg('請輸入姓名')
            return
        }
        // 後端好了在這裡呼叫 createClient / updateClient
        alert(isEdit ? '編輯成功（假）' : '新增成功（假）')
        navigate('/')
    }

    return (
        <div>
            <h4 className="mb-4">{isEdit ? '編輯客戶' : '新增客戶'}</h4>

            {errorMsg && (
                <Alert variant="danger">{errorMsg}</Alert>
            )}

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

                        <Button variant="primary" type="submit" className="me-2">
                            {isEdit ? '儲存編輯' : '新增客戶'}
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/')}>
                            取消
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default ClientForm