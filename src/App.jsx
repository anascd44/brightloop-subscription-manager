import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import PlaceholderPage from './pages/PlaceholderPage'

const routes = [
  { path: '/', title: 'Dashboard' },
  { path: '/products', title: 'Products' },
  { path: '/variants', title: 'Variants' },
  { path: '/plans', title: 'Subscription Plans' },
  { path: '/taxes', title: 'Taxes' },
  { path: '/discounts', title: 'Discounts' },
  { path: '/customers', title: 'Customers' },
  { path: '/staff', title: 'Staff' },
  { path: '/quotations', title: 'Quotations' },
  { path: '/subscriptions', title: 'Subscriptions' },
  { path: '/invoices', title: 'Invoices' },
  { path: '/payments', title: 'Payments' },
  { path: '/reports', title: 'Revenue Reports' },
  { path: '/overdue', title: 'Overdue Invoices' },
]

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={<PlaceholderPage title={r.title} />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}