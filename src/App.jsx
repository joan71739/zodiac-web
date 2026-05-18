// ============================================================
// App.jsx — v9 版本（V2 compare 路由暫時尚未開發）
// 修改說明：移除 CompareSelect / CompareDetail import 與對應路由
// ============================================================

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// 既有頁面
import ClientList   from './pages/ClientList';
import ClientForm   from './pages/ClientForm';
import ClientDetail from './pages/ClientDetail';
import Search       from './pages/Search';
import Backup       from './pages/Backup';

export default function App() {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* 側欄 Navbar */}
      <Navbar />

      {/* 主內容區 */}
      <div className="flex-grow-1" style={{ overflowX: 'hidden' }}>
        <Routes>
          <Route path="/"                element={<ClientList />}   />
          <Route path="/clients/new"     element={<ClientForm />}   />
          <Route path="/clients/:id"     element={<ClientDetail />} />
          <Route path="/clients/:id/edit" element={<ClientForm />}  />
          <Route path="/search"          element={<Search />}       />
          <Route path="/backup"          element={<Backup />}       />

          {/* 404 fallback */}
          <Route path="*" element={
            <div className="d-flex align-items-center justify-content-center" style={{ height: '80vh' }}>
              <div className="text-center text-muted">
                <div style={{ fontSize: '3rem' }}>404</div>
                <div>找不到此頁面</div>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}
