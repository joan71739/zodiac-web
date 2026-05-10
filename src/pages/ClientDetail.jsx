import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tabs, Tab, Button, Card, Alert, Spinner } from 'react-bootstrap'
import { useRef } from 'react'
import PlanetTable from '../components/PlanetTable'
import HouseTable from '../components/HouseTable'
import AspectTable from '../components/AspectTable'
import ConsultationLog from '../components/ConsultationLog'
import AnalysisBlock from '../components/AnalysisBlock'
import ChartImage from '../components/ChartImage'

function ClientDetail() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [client, setClient] = useState(null)
    const [loading, setLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState('')

    const [chartImage, setChartImage] = useState(null)
    const fileInputRef = useRef(null)

    useEffect(() => {
        setTimeout(() => {
            // 假資料，後端好了換成 API
            setClient({
                id: 1,
                name: '王小明',
                birthDate: '1993-08-10',
                birthTime: '08:30',
                birthPlace: '台北',
                createdAt: '2025-01-01',
            })
            setLoading(false)
        }, 0)
    }, [id])

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </div>
        )
    }

    if (!client) {
        return <Alert variant="danger">找不到客戶資料</Alert>
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return
        // 後端好了換成 uploadChartImage(id, file)
        const previewUrl = URL.createObjectURL(file)
        setChartImage(previewUrl)
    }

    const handleImageClick = () => {
        fileInputRef.current.click()
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-1">{client.name}</h4>
                    <small className="text-muted">
                        {client.birthDate} ｜ {client.birthTime} ｜ {client.birthPlace}
                    </small>
                </div>
                <div>
                    <Button
                        variant="outline-secondary"
                        className="me-2"
                        onClick={() => navigate('/')}
                    >
                        返回列表
                    </Button>
                    <Button
                        variant="outline-warning"
                        onClick={() => navigate(`/clients/${id}/edit`)}
                    >
                        編輯客戶資訊
                    </Button>
                </div>
            </div>

            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

            <Tabs defaultActiveKey="chart" className="mb-3">
                <Tab eventKey="chart" title="命盤資料">
                    <Card>
                        <Card.Body>
                            <ChartImage />
                            <hr />
                            <PlanetTable />
                            <hr />
                            <HouseTable />
                            <hr />
                            <AspectTable />
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="analysis" title="我的解析">
                    <Card>
                        <Card.Body>
                            <AnalysisBlock />
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="log" title="諮詢 Log">
                    <Card>
                        <Card.Body>
                            <ConsultationLog />
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    )
}

export default ClientDetail