export type Role = 'CUSTOMER' | 'SELLER' | 'MANAGER' | 'ADMIN'

export type Category = 'prescription' | 'otc' | 'supplement' | 'device' | 'cosmetic' | 'others'

export type OrderStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  emailVerified: boolean
  image?: string
  createdAt: string
  updatedAt: string
}

export interface Medicine {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  manufacturer: string
  sellerID: string
  tags: string[]
  category: Category
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  orderId: string
  medicineId: string
  medicine?: Medicine
}

export interface Order {
  id: string
  totalPrice: number
  status: OrderStatus
  userId: string
  createdAt: string
  updatedAt: string
  orderItems?: OrderItem[]
}

export interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  userId: string
  medicineId: string
}
