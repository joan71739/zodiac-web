// ============================================================
// Navbar.jsx — v9 版本（V2 合盤比較入口暫時尚未開發）
// 修改說明：移除「合盤比較」導覽項目與 V2 badge，更新版本標示
// ============================================================

import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/',       label: '客戶列表', icon: '👥' },
  { to: '/search', label: '行星篩選', icon: '🔍' },
  { to: '/backup', label: '備份管理', icon: '💾' },
];

export default function Navbar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const width = collapsed ? 56 : 200;

  return (
    <div
      style={{
        width,
        minHeight: '100vh',
        backgroundColor: '#1C1C2E',
        color: '#E8E0F0',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      {/* Logo / 標題列 */}
      <div
        style={{
          padding: '16px 12px',
          borderBottom: '1px solid #2D2D45',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {!collapsed && (
          <span
            style={{
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.04em',
              color: '#D4AF37',
            }}
          >
            ✦ 占星顧問後台
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'none',
            border: 'none',
            color: '#888',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: 0,
            lineHeight: 1,
          }}
          title={collapsed ? '展開側欄' : '收合側欄'}
        >
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* 導覽項目 */}
      <nav style={{ flex: 1, paddingTop: 8 }}>
        {NAV_ITEMS.map(({ to, label, icon }) => {
          const isActive = to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: collapsed ? 0 : 10,
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '12px 0' : '10px 16px',
                color: isActive ? '#D4AF37' : '#B0A8C8',
                backgroundColor: isActive ? '#2D2D45' : 'transparent',
                borderLeft: isActive ? '3px solid #D4AF37' : '3px solid transparent',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontWeight: isActive ? 600 : 400,
                transition: 'background 0.15s, color 0.15s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
              {!collapsed && <span>{label}</span>}

              {/* 收合狀態下的 Tooltip */}
              {collapsed && (
                <span
                  style={{
                    position: 'absolute',
                    left: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: '#2D2D45',
                    color: '#E8E0F0',
                    padding: '4px 10px',
                    borderRadius: 4,
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                    zIndex: 1000,
                    display: 'none',
                    pointerEvents: 'none',
                  }}
                  className="navbar-tooltip"
                >
                  {label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* 底部版本資訊 */}
      {!collapsed && (
        <div
          style={{
            padding: '10px 16px',
            borderTop: '1px solid #2D2D45',
            fontSize: '0.7rem',
            color: '#555',
            letterSpacing: '0.03em',
          }}
        >
          v10
        </div>
      )}

      {/* CSS for tooltip on hover */}
      <style>{`
        nav a:hover .navbar-tooltip {
          display: block !important;
        }
        nav a:hover {
          background-color: #2A2A40 !important;
          color: #D4AF37 !important;
        }
      `}</style>
    </div>
  );
}
