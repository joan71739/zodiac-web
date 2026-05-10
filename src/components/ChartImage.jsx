import { useState, useRef } from 'react'
import { Button, Card } from 'react-bootstrap'

function ChartImage() {
    const [chartImage, setChartImage] = useState(null)
    const fileInputRef = useRef(null)

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
            <h6 className="mb-3">星盤圖片</h6>

            <input
                type="file"
                accept="image/jpg, image/png, image/webp"
                ref={fileInputRef}
                onChange={handleImageUpload}
                style={{ display: 'none' }}
            />

            {chartImage ? (
                <div className="text-center">
                    <img
                        src={chartImage}
                        alt="星盤圖片"
                        className="img-fluid rounded mb-2"
                        style={{ maxHeight: '400px', cursor: 'pointer' }}
                        onClick={handleImageClick}
                    />
                    <br />
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={handleImageClick}
                    >
                        重新上傳
                    </Button>
                </div>
            ) : (
                <div
                    className="border rounded text-center text-muted p-5"
                    style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
                    onClick={handleImageClick}
                >
                    <div className="mb-2" style={{ fontSize: '2rem' }}>🖼️</div>
                    <p className="mb-0">點擊上傳星盤圖片</p>
                    <small>支援 JPG、PNG、WEBP</small>
                </div>
            )}
        </div>
    )
}

export default ChartImage