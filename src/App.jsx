// ============================================================
// App.jsx — V2 修改版
// 修改說明：新增路由 /compare 與 /compare/:idA/:idB
// 星盤優化 V2 — FE-10
// ============================================================

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// 既有頁面（v8）
import ClientList from './pages/ClientList';
import ClientForm from './pages/ClientForm';
import ClientDetail from './pages/ClientDetail';
import Search from './pages/Search';
import Backup from './pages/Backup';

// V2 新增頁面
import CompareSelect from './pages/CompareSelect';
import CompareDetail from './pages/CompareDetail';

export default function App() {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* 側欄 Navbar */}
      <Navbar />

      {/* 主內容區 */}
      <div className="flex-grow-1" style={{ overflowX: 'hidden' }}>
        <Routes>
          {/* ── 既有路由（v8）─────────────────── */}
          <Route path="/" element={<ClientList />} />
          <Route path="/clients/new" element={<ClientForm />} />
          <Route path="/clients/:id" element={<ClientDetail />} />
          <Route path="/clients/:id/edit" element={<ClientForm />} />
          <Route path="/search" element={<Search />} />
          <Route path="/backup" element={<Backup />} />

          {/* ── V2 新增路由 ───────────────────── */}
          <Route path="/compare" element={<CompareSelect />} />
          <Route path="/compare/:idA/:idB" element={<CompareDetail />} />

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