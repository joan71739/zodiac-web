import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Navbar'
import ClientList from './pages/ClientList'
import ClientDetail from './pages/ClientDetail'
import ClientForm from './pages/ClientForm'
import Search from './pages/Search'
import Backup from './pages/Backup'

function App() {
  return (
    <div className="main-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ClientList />} />
          <Route path="/clients/new" element={<ClientForm />} />
          <Route path="/clients/:id" element={<ClientDetail />} />
          <Route path="/clients/:id/edit" element={<ClientForm />} />
          <Route path="/search" element={<Search />} />
          <Route path="/backup" element={<Backup />} />
        </Routes>
      </main>
    </div>
  )
}

export default App