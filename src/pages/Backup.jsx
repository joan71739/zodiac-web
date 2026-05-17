import { useState, useEffect, useRef } from 'react'
import { Card, Button, Table, Alert, Spinner, Badge } from 'react-bootstrap'
import { getBackupList, createBackup, restoreBackup } from '../api/backup'

function Backup() {
    const [backups, setBackups] = useState([])
    const [loading, setLoading] = useState(true)
    const [backingUp, setBackingUp] = useState(false)
    const [restoringId, setRestoringId] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    /**
     * 改用 useRef 儲存計時器 ID，取代原本的 useState。
     *
     * 原因：useEffect 的 cleanup 函數在 [] dependency 下只建立一次，
     * 閉包捕獲的 state 值永遠是 mount 時的初始值（null）。
     * 使用 useState 時，cleanup 內的 refreshTimer 永遠是 null，
     * 組件 unmount 時計時器無法被清除，8 秒後仍會對已 unmount 的組件呼叫 setState。
     *
     * useRef 的值存在 .current 屬性，cleanup 讀取的是 ref 物件本身（不是 state 快照），
     * 所以能拿到最新的 timer ID，確保 unmount 時正確清除。
     */
    const refreshTimerRef = useRef(null)

    useEffect(() => {
        fetchBackups()
        // 離開頁面時清除計時器，避免對已 unmount 的組件呼叫 setState
        return () => {
            if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
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
     * 後端是真正的非同步（Thread 執行 pg_dump，API 立即回傳），
     * 備份何時完成前端無法得知，採用兩段策略：
     *   1. 顯示含「立即重新整理」按鈕的提示，讓使用者可手動確認
     *   2. 同時設定 8 秒後自動 fetchBackups（小型 DB 的友善 UX）
     *
     * 409（備份進行中）由後端 AtomicBoolean 防重複觸發；
     * axios 預設把 4xx 拋為 error，統一在 catch 處理，不需在 try 區塊判斷 res.status。
     */
    const handleBackup = async () => {
        if (!window.confirm('確定要立即執行備份？')) return
        try {
            setBackingUp(true)
            setErrorMsg('')
            setSuccessMsg('')
            await createBackup()

            setSuccessMsg('backup_started')

            // 8 秒後自動重新整理；ref 確保 unmount 時 cleanup 能正確清除
            refreshTimerRef.current = setTimeout(async () => {
                await fetchBackups()
                setSuccessMsg('')
                refreshTimerRef.current = null
            }, 8000)

        } catch (err) {
            // axios 對 4xx/5xx 拋 error，409 與其他錯誤在此分流
            if (err.response?.status === 409) {
                setErrorMsg('備份進行中，請稍後再試')
            } else {
                setErrorMsg('備份失敗，請稍後再試')
            }
        } finally {
            setBackingUp(false)
        }
    }

    /** 手動立即重新整理（配合「立即重新整理」按鈕使用） */
    const handleManualRefresh = async () => {
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current)
            refreshTimerRef.current = null
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