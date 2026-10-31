import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DataProvider } from './store/DataContext'
import AppLayout from './components/layout/AppLayout'
import PlaceholderPage from './pages/PlaceholderPage'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Plans from './pages/Plans'
import Taxes from './pages/Taxes'
import Discounts from './pages/Discounts'
import Subscriptions from './pages/Subscriptions'
import Invoices from './pages/Invoices'
import Payments from './pages/Payments'
import Overdue from './pages/Overdue'

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/taxes" element={<Taxes />} />
            <Route path="/discounts" element={<Discounts />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/overdue" element={<Overdue />} />
            <Route path="/variants" element={<PlaceholderPage title="Variants" />} />
            <Route path="/customers" element={<PlaceholderPage title="Customers" />} />
            <Route path="/staff" element={<PlaceholderPage title="Staff" />} />
            <Route path="/quotations" element={<PlaceholderPage title="Quotations" />} />
            <Route path="/reports" element={<PlaceholderPage title="Revenue Reports" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  )
}