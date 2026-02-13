'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import type { Order, OrderStatus } from '@/types'
import { ChevronLeft, Package, Truck, Check } from 'lucide-react'
import Link from 'next/link'

const statusSteps: OrderStatus[] = ['PENDING', 'SHIPPED', 'DELIVERED']

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:5000/order/${params.id}`, {
          method: 'GET',
          credentials: 'include',
        })
        if (response.ok) {
          const data = await response.json()
          setOrder(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch order:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchOrder()
    }
  }, [user, params.id])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded w-1/3 animate-pulse" />
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-foreground mb-4">Order not found</h2>
        <Link
          href="/dashboard/customer"
          className="text-primary hover:text-primary/80 transition"
        >
          Back to Orders
        </Link>
      </div>
    )
  }

  const currentStepIndex = statusSteps.indexOf(order.status as OrderStatus)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Link
        href="/dashboard/customer"
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition w-fit"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Order #{order.id.slice(0, 8)}
        </h1>
        <p className="text-muted-foreground">
          Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
          {new Date(order.createdAt).toLocaleTimeString()}
        </p>
      </div>

      {/* Order Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Order Status</h2>

        <div className="flex items-center justify-between mb-8">
          {statusSteps.map((status, index) => (
            <div key={status} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition ${
                  index <= currentStepIndex
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {status === 'PENDING' && <Package className="w-5 h-5" />}
                {status === 'SHIPPED' && <Truck className="w-5 h-5" />}
                {status === 'DELIVERED' && <Check className="w-5 h-5" />}
              </div>
              <p className="text-sm font-medium text-foreground text-center">{status}</p>
              {index < statusSteps.length - 1 && (
                <div
                  className={`w-full h-1 mt-4 ${
                    index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                  style={{ gridColumn: 'span 1', marginTop: '0.5rem' }}
                />
              )}
            </div>
          ))}
        </div>

        {order.status === 'CANCELLED' && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive">
            This order has been cancelled.
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Order Items</h2>

        {order.orderItems && order.orderItems.length > 0 ? (
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border"
              >
                <div>
                  <h3 className="font-medium text-foreground">
                    {item.medicine?.name || 'Medicine'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">₹{item.price}</p>
                  <p className="text-sm text-muted-foreground">
                    Total: ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No items in this order</p>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>

        <div className="space-y-3 pb-4 border-b border-border">
          <div className="flex justify-between text-foreground">
            <span>Subtotal</span>
            <span>₹{order.totalPrice}</span>
          </div>
          <div className="flex justify-between text-foreground">
            <span>Shipping</span>
            <span className="text-primary font-medium">Free</span>
          </div>
          <div className="flex justify-between text-foreground">
            <span>Tax</span>
            <span>₹0</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="font-semibold text-foreground">Total Amount</span>
          <span className="text-2xl font-bold text-primary">₹{order.totalPrice}</span>
        </div>
      </div>
    </div>
  )
}
