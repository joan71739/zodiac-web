
import { useState, useEffect } from 'react'
import { Card, Button, Table, Alert, Spinner, Badge } from 'react-bootstrap'
import { getBackupList, createBackup, restoreBackup } from '../api/backup'

function Backup() {
    const [backups, setBackups] = useState([])
    const [loading, setLoading] = useState(true)
    const [backingUp, setBackingUp] = useState(false)
    const [restoringId, setRestoringId] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    useEffect(() => {
        fetchBackups()
    }, [])

    const fetchBackups = async () => {
        try {
            const res = await getBackupList()
            setBackups(res.data)
        } catch (err) {
            setErrorMsg('載入備份列表失敗')
        } finally {
            setLoading(false)
        }
    }

    const handleBackup = async () => {
        if (!window.confirm('確定要立即執行備份？')) return
        try {
            setBackingUp(true)
            setErrorMsg('')
            const res = await createBackup()
            setBackups([res.data, ...backups])
            setSuccessMsg('備份成功！')
            setTimeout(() => setSuccessMsg(''), 3000)
        } catch (err) {
            setErrorMsg('備份失敗，請稍後再試')
        } finally {
            setBackingUp(false)
        }
    }

    const handleRestore = async (id) => {
        if (!window.confirm(`確定還原至備份 #${id}？此操作將覆蓋現有資料，無法復原。`)) return
        try {
            setRestoringId(id)
            setErrorMsg('')
            await restoreBackup(id)
            setSuccessMsg(`還原成功！已還原至備份 #${id}`)
            setTimeout(() => setSuccessMsg(''), 4000)
        } catch (err) {
            setErrorMsg('還原失敗，請稍後再試')
        } finally {
            setRestoringId(null)
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">備份管理</h4>
                <Button variant="primary" onClick={handleBackup} disabled={backingUp}>
                    {backingUp ? <><Spinner animation="border" size="sm" className="me-1" />備份中...</> : '立即備份'}
                </Button>
            </div>

            {errorMsg && <Alert variant="danger" dismissible onClose={() => setErrorMsg('')}>{errorMsg}</Alert>}
            {successMsg && <Alert variant="success">{successMsg}</Alert>}

            <Card>
                <Card.Header className="fw-bold">備份歷史</Card.Header>
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : backups.length === 0 ? (
                        <p className="text-muted text-center py-4">尚無備份記錄</p>
                    ) : (
                        <Table hover responsive className="mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>備份時間</th>
                                    <th>類型</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {backups.map(b => (
                                    <tr key={b.id}>
                                        <td>{b.createdAt?.replace('T', ' ').slice(0, 19)}</td>
                                        <td>
                                            <Badge bg={b.note?.includes('自動') ? 'secondary' : 'primary'}>
                                                {b.note || '手動備份'}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-warning"
                                                onClick={() => handleRestore(b.id)}
                                                disabled={restoringId === b.id}
                                            >
                                                {restoringId === b.id
                                                    ? <><Spinner animation="border" size="sm" className="me-1" />還原中</>
                                                    : '還原'
                                                }
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            <div className="mt-3 text-muted small">
                <p className="mb-1">💡 系統每天凌晨 03:00 自動備份，保留最近 30 天。</p>
                <p className="mb-0">⚠️ 還原操作將覆蓋現有所有資料，請謹慎使用。</p>
            </div>
        </div>
    )
}

export default Backup







