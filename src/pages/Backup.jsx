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
    const [refreshTimer, setRefreshTimer] = useState(null)

    useEffect(() => {
        fetchBackups()
        // 離開頁面時清除計時器，避免 setState on unmounted component
        return () => {
            if (refreshTimer) clearTimeout(refreshTimer)
        }
    }, [])

    const fetchBackups = async () => {
        setLoading(true)
        try {
            const res = await getBackupList()
            setBackups(res.data)
        } catch (err) {
            setErrorMsg('載入備份列表失敗')
        } finally {
            setLoading(false)
        }
    }

    /**
     * 手動觸發備份
     *
     * 後端是真正的非同步（非同步 Thread 執行 pg_dump），API 立即回傳。
     * 因此備份完成時間不確定，前端採用兩段策略：
     *   1. 顯示含「立即重新整理」按鈕的提示，讓使用者可手動確認結果
     *   2. 同時設定 8 秒後自動 fetchBackups（對小型 DB 的友善 UX）
     * 若後端回傳 409（備份進行中），顯示專屬提示訊息。
     */
    const handleBackup = async () => {
        if (!window.confirm('確定要立即執行備份？')) return
        try {
            setBackingUp(true)
            setErrorMsg('')
            setSuccessMsg('')
            const res = await createBackup()

            // 後端回傳 409：備份進行中（AtomicBoolean lock）
            if (res.status === 409) {
                setErrorMsg('備份進行中，請稍後再試')
                return
            }

            setSuccessMsg('backup_started')

            // 8 秒後自動重新整理（較保守的等待時間，應對稍大的 DB）
            const timer = setTimeout(async () => {
                await fetchBackups()
                setSuccessMsg('')
                setRefreshTimer(null)
            }, 8000)
            setRefreshTimer(timer)

        } catch (err) {
            // axios 對 4xx/5xx 會進 catch；409 若未特殊設定也可能到這裡
            if (err.response?.status === 409) {
                setErrorMsg('備份進行中，請稍後再試')
            } else {
                setErrorMsg('備份失敗，請稍後再試')
            }
        } finally {
            setBackingUp(false)
        }
    }

    /** 手動立即重新整理（配合 successMsg 按鈕使用） */
    const handleManualRefresh = async () => {
        if (refreshTimer) {
            clearTimeout(refreshTimer)
            setRefreshTimer(null)
        }
        setSuccessMsg('')
        await fetchBackups()
    }

    /**
     * 還原備份
     * restoringId 為各自獨立的 loading 狀態，不影響其他列按鈕。
     * 還原成功後自動重新整理列表（還原不影響 backup_records 表，刷新僅供確認）。
     */
    const handleRestore = async (id) => {
        if (!window.confirm(`確定還原至備份 #${id}？此操作將覆蓋現有資料，無法復原。`)) return
        try {
            setRestoringId(id)
            setErrorMsg('')
            setSuccessMsg('')
            await restoreBackup(id)
            setSuccessMsg(`還原成功！已還原至備份 #${id}`)
            setTimeout(() => setSuccessMsg(''), 4000)
            // 還原後刷新列表（確認 list 正常顯示）
            await fetchBackups()
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
                    {backingUp
                        ? <><Spinner animation="border" size="sm" className="me-1" />備份中...</>
                        : '立即備份'
                    }
                </Button>
            </div>

            {errorMsg && (
                <Alert variant="danger" dismissible onClose={() => setErrorMsg('')}>
                    {errorMsg}
                </Alert>
            )}

            {/* 備份啟動提示：含手動重新整理按鈕，避免使用者依賴固定計時器 */}
            {successMsg === 'backup_started' && (
                <Alert variant="success" className="d-flex align-items-center justify-content-between">
                    <span>
                        備份已啟動，正在背景執行中。
                        完成後請重新整理確認結果（小型資料庫約 5～10 秒）。
                    </span>
                    <Button
                        variant="outline-success"
                        size="sm"
                        className="ms-3 flex-shrink-0"
                        onClick={handleManualRefresh}
                    >
                        立即重新整理
                    </Button>
                </Alert>
            )}

            {/* 還原成功提示 */}
            {successMsg && successMsg !== 'backup_started' && (
                <Alert variant="success">{successMsg}</Alert>
            )}

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
                                        {/*
                                         * createdAt 格式：LocalDateTime.toString() 回傳
                                         * "2026-05-17T03:00:00" 或 "2026-05-17T03:00:00.123456"
                                         * replace('T',' ').slice(0,19) 均可正確截取為 "2026-05-17 03:00:00"
                                         */}
                                        <td>{b.createdAt?.replace('T', ' ').slice(0, 19)}</td>
                                        <td>
                                            {/*
                                             * Badge 判斷邏輯：
                                             *   note 包含「自動」→ secondary（灰，自動備份）
                                             *   note 不含「自動」、null、空字串 → primary（藍，手動備份）
                                             * b.note?.includes('自動')：null 時 ?. 回傳 undefined（falsy）
                                             * {b.note || '手動備份'}：null / '' 時顯示預設文字
                                             */}
                                            <Badge bg={b.note?.includes('自動') ? 'secondary' : 'primary'}>
                                                {b.note || '手動備份'}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-warning"
                                                onClick={() => handleRestore(b.id)}
                                                disabled={restoringId !== null}
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