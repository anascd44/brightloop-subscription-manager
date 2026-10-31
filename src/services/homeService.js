import { subscriptions, recommended, trending, pendingInvoices } from '../data/homeMock'
const fakeDelay = (data) => new Promise((resolve) => setTimeout(() => resolve(data), 300))
export function getHomeData() {
  return fakeDelay({ subscriptions, recommended, trending, pendingInvoices })
}
