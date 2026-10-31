// import api from './api'  // later: replace the functions below with api.get/post/put/delete
import { initialProducts } from '../data/productsMock'

let products = [...initialProducts]
let counter = products.length + 1

const wait = (data) => new Promise((resolve) => setTimeout(() => resolve(data), 200))

export const getProducts = () => wait([...products])

export const createProduct = (values) => {
  const created = { ...values, id: `PRD-${String(counter++).padStart(3, '0')}` }
  products = [created, ...products]
  return wait(created)
}

export const updateProduct = (id, values) => {
  products = products.map((p) => (p.id === id ? { ...p, ...values } : p))
  return wait(products.find((p) => p.id === id))
}

export const deleteProduct = (id) => {
  products = products.filter((p) => p.id !== id)
  return wait(id)
}
