import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap'
import { getClient, createClient, updateClient } from '../api/clients'

const SIGNS = [
    '牡羊座', '金牛座', '雙子座', '巨蟹座', '獅子座', '處女座',
    '天秤座', '天蠍座', '射手座', '摩羯座', '水瓶座', '雙魚座'
]

function ClientForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEdit = !!id

    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        birthTime: '',
        birthPlace: '',
        ascSign: '',
        ascDegreeNum: '',
        ascMinuteNum: '',
        mcSign: '',
        mcDegreeNum: '',
        mcMinuteNum: '',
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
                    name:         c.name        || '',
                    birthDate:    c.birthDate   || '',
                    birthTime:    c.birthTime   || '',
                    birthPlace:   c.birthPlace  || '',
                    ascSign:      c.ascSign      ?? '',
                    ascDegreeNum: c.ascDegreeNum != null ? String(c.ascDegreeNum) : '',
                    ascMinuteNum: c.ascMinuteNum != null ? String(c.ascMinuteNum) : '',
                    mcSign:       c.mcSign       ?? '',
                    mcDegreeNum:  c.mcDegreeNum  != null ? String(c.mcDegreeNum)  : '',
                    mcMinuteNum:  c.mcMinuteNum  != null ? String(c.mcMinuteNum)  : '',
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

            // 數字欄位空字串 → null，避免後端 Integer 轉型錯誤
            const payload = {
                name:         formData.name.trim(),
                birthDate:    formData.birthDate   || null,
                birthTime:    formData.birthTime   || null,
                birthPlace:   formData.birthPlace  || null,
                ascSign:      formData.ascSign      || null,
                ascDegreeNum: formData.ascDegreeNum !== '' ? Number(formData.ascDegreeNum) : null,
                ascMinuteNum: formData.ascMinuteNum !== '' ? Number(formData.ascMinuteNum) : null,
                mcSign:       formData.mcSign       || null,
                mcDegreeNum:  formData.mcDegreeNum  !== '' ? Number(formData.mcDegreeNum)  : null,
                mcMinuteNum:  formData.mcMinuteNum  !== '' ? Number(formData.mcMinuteNum)  : null,
            }

            if (isEdit) {
                await updateClient(id, payload)
            } else {
                await createClient(payload)
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

            {errorMsg && (
                <Alert variant="danger" dismissible onClose={() => setErrorMsg('')}>
                    {errorMsg}
                </Alert>
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

                        {/* ── 四軸資訊（選填）────────────────── */}
                        <hr />
                        <h6 className="mb-3 text-muted">四軸資訊（選填）</h6>

                        <Form.Label className="fw-semibold">上升點 ASC</Form.Label>
                        <Row className="mb-3 g-2">
                            <Col md={5}>
                                <Form.Select
                                    name="ascSign"
                                    value={formData.ascSign}
                                    onChange={handleChange}
                                >
                                    <option value="">-- 星座 --</option>
                                    {SIGNS.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col md={3}>
                                <Form.Control
                                    type="number"
                                    name="ascDegreeNum"
                                    placeholder="度 (0-29)"
                                    min={0}
                                    max={29}
                                    value={formData.ascDegreeNum}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Control
                                    type="number"
                                    name="ascMinuteNum"
                                    placeholder="分 (0-59)"
                                    min={0}
                                    max={59}
                                    value={formData.ascMinuteNum}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>

                        <Form.Label className="fw-semibold">天頂 MC</Form.Label>
                        <Row className="mb-4 g-2">
                            <Col md={5}>
                                <Form.Select
                                    name="mcSign"
                                    value={formData.mcSign}
                                    onChange={handleChange}
                                >
                                    <option value="">-- 星座 --</option>
                                    {SIGNS.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col md={3}>
                                <Form.Control
                                    type="number"
                                    name="mcDegreeNum"
                                    placeholder="度 (0-29)"
                                    min={0}
                                    max={29}
                                    value={formData.mcDegreeNum}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Control
                                    type="number"
                                    name="mcMinuteNum"
                                    placeholder="分 (0-59)"
                                    min={0}
                                    max={59}
                                    value={formData.mcMinuteNum}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>

                        <Button
                            variant="primary"
                            type="submit"
                            className="me-2"
                            disabled={submitting}
                        >
                            {submitting
                                ? <Spinner animation="border" size="sm" />
                                : (isEdit ? '儲存編輯' : '新增客戶')}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/')}
                            disabled={submitting}
                        >
                            取消
                        </Button>

                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default ClientForm
