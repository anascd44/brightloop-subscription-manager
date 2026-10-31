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

const placeholders = [
  { path: '/variants', title: 'Variants' },
  { path: '/customers', title: 'Customers' },
  { path: '/staff', title: 'Staff' },
  { path: '/quotations', title: 'Quotations' },
  { path: '/reports', title: 'Revenue Reports' },
]

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}></Route>