import { Link, useLocation } from 'react-router-dom'

function Sidebar() {
    const location = useLocation()

    return (
        <div className="sidebar-wrapper flex-shrink-0 p-3">
            <Link
                to="/"
                className="d-flex align-items-center pb-3 mb-3 link-body-emphasis text-decoration-none border-bottom"
            >
                <span className="fs-5 fw-semibold">🔮 占星顧問系統</span>
            </Link>

            <ul className="list-unstyled ps-0">
                <li className="mb-1">
                    <button
                        className="btn btn-toggle d-inline-flex align-items-center rounded border-0"
                        data-bs-toggle="collapse"
                        data-bs-target="#menu-collapse"
                        aria-expanded="true"
                    >
                        選單
                    </button>
                    <div className="collapse show" id="menu-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li>
                                <Link
                                    to="/"
                                    className={`d-inline-flex text-decoration-none rounded ${location.pathname === '/' ? 'active' : ''}`}
                                >
                                    👥 客戶列表
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/search"
                                    className={`d-inline-flex text-decoration-none rounded ${location.pathname === '/search' ? 'active' : ''}`}
                                >
                                    🔍 篩選客戶
                                </Link>
                            </li>
                        </ul>
                    </div>
                </li>

                <li className="border-top my-3"></li>

                <li className="mb-1">
                    <button
                        className="btn btn-toggle d-inline-flex align-items-center rounded border-0"
                        data-bs-toggle="collapse"
                        data-bs-target="#system-collapse"
                        aria-expanded="true"
                    >
                        系統
                    </button>
                    <div className="collapse show" id="system-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li>
                                <Link
                                    to="/backup"
                                    className={`d-inline-flex text-decoration-none rounded ${location.pathname === '/backup' ? 'active' : ''}`}
                                >
                                    💾 備份管理
                                </Link>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default Sidebar