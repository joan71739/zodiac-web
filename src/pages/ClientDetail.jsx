import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tabs, Tab, Button, Card, Alert, Spinner } from 'react-bootstrap'
import { getClient } from '../api/clients'
import { exportChart } from '../api/export'
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

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const res = await getClient(id)
                setClient(res.data)
            } catch (err) {
                setErrorMsg('載入客戶資料失敗')
            } finally {
                setLoading(false)
            }
        }
        fetchClient()
    }, [id])

    const handleExportChart = async () => {
        try {
            await exportChart(id)
        } catch (err) {
            setErrorMsg('匯出失敗，請稍後再試')
        }
    }

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
                        variant="outline-success"
                        className="me-2"
                        onClick={handleExportChart}
                    >
                        匯出命盤
                    </Button>
                    <Button
                        variant="outline-warning"
                        onClick={() => navigate(`/clients/${id}/edit`)}
                    >
                        編輯客戶資訊
                    </Button>
                </div>
            </div>

            {errorMsg && <Alert variant="danger" dismissible onClose={() => setErrorMsg('')}>{errorMsg}</Alert>}

            <Tabs defaultActiveKey="chart" className="mb-3">
                <Tab eventKey="chart" title="命盤資料">
                    <Card>
                        <Card.Body>
                            <ChartImage clientId={id} />
                            <hr />
                            <PlanetTable clientId={id} />
                            <hr />
                            <HouseTable clientId={id} />
                            <hr />
                            <AspectTable clientId={id} />
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="analysis" title="我的解析">
                    <Card>
                        <Card.Body>
                            <AnalysisBlock clientId={id} />
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="log" title="諮詢 Log">
                    <Card>
                        <Card.Body>
                            <ConsultationLog clientId={id} />
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    )
}

export default ClientDetail
