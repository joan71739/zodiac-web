import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Spinner, Alert } from 'react-bootstrap'
import { getClients, deleteClient } from '../api/clients'
import { exportClients } from '../api/export'

function ClientList() {
    const navigate = useNavigate()
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        fetchClients()
    }, [])

    const fetchClients = async () => {
        try {
            setLoading(true)
            const res = await getClients()
            setClients(res.data)
        } catch (err) {
            setErrorMsg('載入客戶列表失敗')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('確定要刪除此客戶？刪除後無法復原。')) return
        try {
            await deleteClient(id)
            setClients(clients.filter(c => c.id !== id))
        } catch (err) {
            setErrorMsg('刪除失敗，請稍後再試')
        }
    }

    const handleExport = async () => {
        try {
            await exportClients()
        } catch (err) {
            setErrorMsg('匯出失敗，請稍後再試')
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">客戶列表</h4>
                <div>
                    <Button
                        variant="outline-secondary"
                        className="me-2"
                        onClick={handleExport}
                    >
                        匯出 JSON
                    </Button>
                    <Button variant="primary" onClick={() => navigate('/clients/new')}>
                        + 新增客戶
                    </Button>
                </div>
            </div>

            {errorMsg && <Alert variant="danger" dismissible onClose={() => setErrorMsg('')}>{errorMsg}</Alert>}

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
