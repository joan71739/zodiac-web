import { useState, useRef, useEffect } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { uploadChartImage } from '../api/clients'
import api from '../api/axiosConfig'

function ChartImage({ clientId }) {
    const [chartUrl, setChartUrl] = useState(null)
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const res = await api.get(`/clients/${clientId}/chart-image`, {
                    responseType: 'blob'
                })
                const url = URL.createObjectURL(res.data)
                setChartUrl(url)
            } catch (err) {
                // 404 = 尚未上傳，其他才是真正錯誤
                if (err.response?.status !== 404) {
                    console.error('載入星盤圖片失敗', err)
                }
            } finally {
                setLoading(false)
            }
        }
        if (clientId) fetchImage()
    }, [clientId])

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        try {
            setUploading(true)
            await uploadChartImage(clientId, file)
            // 上傳成功後重新用 blob URL 顯示
            const url = URL.createObjectURL(file)
            setChartUrl(url)
        } catch (err) {
            console.error('上傳星盤圖片失敗', err)
        } finally {
            setUploading(false)
        }
    }

    if (loading) {
        return <div className="text-center py-3"><Spinner animation="border" size="sm" /></div>
    }

    return (
        <div>
            <h6 className="mb-3">星盤圖片</h6>

            <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                ref={fileInputRef}
                onChange={handleImageUpload}
                style={{ display: 'none' }}
            />

            {chartUrl ? (
                <div className="text-center">
                    <img
                        src={chartUrl}
                        alt="星盤圖片"
                        className="img-fluid rounded mb-2"
                        style={{ maxHeight: '400px', cursor: 'pointer' }}
                        onClick={() => fileInputRef.current.click()}
                    />
                    <br />
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => fileInputRef.current.click()}
                        disabled={uploading}
                    >
                        {uploading ? <Spinner animation="border" size="sm" /> : '重新上傳'}
                    </Button>
                </div>
            ) : (
                <div
                    className="border rounded text-center text-muted p-5"
                    style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
                    onClick={() => fileInputRef.current.click()}
                >
                    {uploading ? (
                        <Spinner animation="border" />
                    ) : (
                        <>
                            <div className="mb-2" style={{ fontSize: '2rem' }}>🖼️</div>
                            <p className="mb-0">點擊上傳星盤圖片</p>
                            <small>支援 JPG、PNG、WEBP</small>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default ChartImage
