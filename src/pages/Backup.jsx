import { useState } from 'react'
import { Card, Button, Table, Alert, Badge } from 'react-bootstrap'

function Backup() {
    const [backups, setBackups] = useState([
        { id: 1, createdAt: '2025-05-01 03:00:00', note: '自動備份' },
        { id: 2, createdAt: '2025-05-05 14:23:11', note: '手動備份' },
        { id: 3, createdAt: '2025-05-09 03:00:00', note: '自動備份' },
    ])
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const handleBackup = async () => {
        // 後端好了換成 API
        const newBackup = {
            id: Date.now(),
            createdAt: new Date().toLocaleString('zh-TW'),
            note: '手動備份',
        }
        setBackups([newBackup, ...backups])
        setSuccessMsg('備份成功')
        setErrorMsg('')
        setTimeout(() => setSuccessMsg(''), 3000)
    }

    const handleRestore = (id) => {
        if (!window.confirm('確定要還原此備份？目前資料將被覆蓋')) return
        // 後端好了換成 API
        setSuccessMsg('還原成功')
        setErrorMsg('')
        setTimeout(() => setSuccessMsg(''), 3000)
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">備份管理</h4>
                <Button variant="primary" onClick={handleBackup}>
                    立即備份
                </Button>
            </div>

            {successMsg && (
                <Alert variant="success">{successMsg}</Alert>
            )}
            {errorMsg && (
                <Alert variant="danger">{errorMsg}</Alert>
            )}

            <Card>
                <Card.Header className="fw-bold">備份歷史</Card.Header>
                <Card.Body className="p-0">
                    {backups.length === 0 ? (
                        <p className="text-muted text-center p-4">尚無備份記錄</p>
                    ) : (
                        <Table hover responsive className="mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th>備份時間</th>
                                    <th>類型</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {backups.map(backup => (
                                    <tr key={backup.id}>
                                        <td>{backup.createdAt}</td>
                                        <td>
                                            <Badge
                                                bg={backup.note === '手動備份' ? 'primary' : 'secondary'}
                                            >
                                                {backup.note}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button
                                                variant="outline-warning"
                                                size="sm"
                                                onClick={() => handleRestore(backup.id)}
                                            >
                                                還原
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            <Card className="mt-3">
                <Card.Header className="fw-bold">備份說明</Card.Header>
                <Card.Body>
                    <ul className="mb-0 small text-muted">
                        <li>系統每天凌晨自動備份一次</li>
                        <li>備份保留 30 天</li>
                        <li>建議每次新增客戶後手動備份一次</li>
                        <li>還原後目前所有資料將被覆蓋，請謹慎操作</li>
                    </ul>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Backup