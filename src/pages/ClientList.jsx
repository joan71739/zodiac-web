import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Spinner, Alert } from 'react-bootstrap'

function ClientList() {

    const navigate = useNavigate()
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        setTimeout(() => {
            const mockData = [
                { id: 1, name: '王小明', birthDate: '1993-08-10', birthPlace: '台北', createdAt: '2025-01-01' },
                { id: 2, name: '李小花', birthDate: '1990-03-22', birthPlace: '台中', createdAt: '2025-02-15' },
                { id: 3, name: '張大偉', birthDate: '1985-11-05', birthPlace: '高雄', createdAt: '2025-03-20' },
            ]
            setClients(mockData)
            setLoading(false)
        }, 0)
    }, [])

    const handleDelete = (id) => {
        if (!window.confirm('確定要刪除此客戶？')) return
        setClients(clients.filter(c => c.id !== id))
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">客戶列表</h4>
                <Button variant="primary" onClick={() => navigate('/clients/new')}>
                    + 新增客戶
                </Button>
            </div>

            {errorMsg && (
                <Alert variant="danger">{errorMsg}</Alert>
            )}

            {loading ? (
                <div className="text-center mt-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>姓名</th>
                            <th>生日</th>
                            <th>出生地</th>
                            <th>建立日期</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center text-muted">
                                    尚無客戶資料
                                </td>
                            </tr>
                        ) : (
                            clients.map(client => (
                                <tr key={client.id}>
                                    <td>{client.name}</td>
                                    <td>{client.birthDate}</td>
                                    <td>{client.birthPlace}</td>
                                    <td>{client.createdAt?.slice(0, 10)}</td>
                                    <td>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => navigate(`/clients/${client.id}`)}
                                        >
                                            查看
                                        </Button>
                                        <Button
                                            variant="outline-warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => navigate(`/clients/${client.id}/edit`)}
                                        >
                                            編輯
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDelete(client.id)}
                                        >
                                            刪除
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}
        </div>
    )
}

export default ClientList