import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import PlaceholderPage from './pages/PlaceholderPage'
import Home from './pages/Home'
import Subscriptions from './pages/Subscriptions'

const routes = [
  { path: '/invoices', title: 'Invoices' },
  { path: '/payments', title: 'Payments' },
]

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={<PlaceholderPage title={r.title} />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
