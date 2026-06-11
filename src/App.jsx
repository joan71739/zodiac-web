// ============================================================
// App.jsx — v12
// 修改說明：新增行運解析相關路由
//   /transits                                                    → TransitIndex
//   /transits/planets/:transitPlanet                             → TransitIndex（導覽用，可選）
//   /transits/planets/:transitPlanet/aspects/:aspectType/natal/:natalPlanet → TransitPlanetNotes
//   /transits/planets/:transitPlanet/houses/:transitHouse        → TransitHouseNotes
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

// 元素解析頁面
import ElementIndex      from './pages/ElementIndex';
import ElementSigns      from './pages/ElementSigns';
import ElementPlanets    from './pages/ElementPlanets';
import SignNotes         from './pages/SignNotes';
import PlanetSignNotes   from './pages/PlanetSignNotes';

// 行運解析頁面（新增）
import TransitIndex       from './pages/TransitIndex';
import TransitPlanetNotes from './pages/TransitPlanetNotes';
import TransitHouseNotes  from './pages/TransitHouseNotes';

export default function App() {
    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            <Navbar />
            <div className="flex-grow-1" style={{ overflowX: 'hidden' }}>
                <Routes>
                    {/* ── 既有路由 ── */}
                    <Route path="/"                  element={<ClientList />}   />
                    <Route path="/clients/new"        element={<ClientForm />}   />
                    <Route path="/clients/:id"        element={<ClientDetail />} />
                    <Route path="/clients/:id/edit"   element={<ClientForm />}   />
                    <Route path="/search"             element={<Search />}       />
                    <Route path="/backup"             element={<Backup />}       />

                    {/* ── 元素解析 ── */}
                    <Route path="/elements"                                          element={<ElementIndex />}    />
                    <Route path="/elements/signs"                                    element={<ElementSigns />}    />
                    <Route path="/elements/signs/:signKey"                           element={<SignNotes />}       />
                    <Route path="/elements/planets"                                  element={<ElementPlanets />}  />
                    <Route path="/elements/planets/:planetKey/signs/:signKey"        element={<PlanetSignNotes />} />

                    {/* ── 行運解析（新增）── */}
                    <Route path="/transits"                                                                        element={<TransitIndex />}       />
                    <Route path="/transits/planets/:transitPlanet"                                                 element={<TransitIndex />}       />
                    <Route path="/transits/planets/:transitPlanet/aspects/:aspectType/natal/:natalPlanet"          element={<TransitPlanetNotes />} />
                    <Route path="/transits/planets/:transitPlanet/houses/:transitHouse"                            element={<TransitHouseNotes />}  />

                    {/* 404 */}
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
