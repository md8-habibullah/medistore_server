'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Trash2, ShoppingCart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

interface CartItem {
  medicineId: string
  quantity: number
  price: number
  name: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(cart)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  const updateQuantity = (medicineId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(medicineId)
      return
    }

    const updated = cartItems.map((item) =>
      item.medicineId === medicineId ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const removeItem = (medicineId: string) => {
    const updated = cartItems.filter((item) => item.medicineId !== medicineId)
    setCartItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = async () => {
    if (!user) {
      router.push('/auth')
      return
    }

    try {
      // Create order
      const response = await fetch('http://localhost:5000/order', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            medicineId: item.medicineId,
            quantity: item.quantity,
            price: item.price,
          })),
          totalPrice,
        }),
      })

      if (response.ok) {
        localStorage.removeItem('cart')
        router.push('/dashboard/customer/orders')
      }
    } catch (error) {
      console.error('Checkout failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Link href="/shop" className="flex items-center gap-2 text-primary hover:text-primary/80 transition mb-8 w-fit">
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some medicines to get started</p>
            <Link
              href="/shop"
              className="inline-block px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                {cartItems.map((item) => (
                  <div key={item.medicineId} className="p-4 border-b border-border last:border-b-0 flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                      <p className="text-primary font-bold">₹{item.price}</p>
                    </div>

                    <div className="flex items-center border border-input rounded-lg bg-background">
                      <button
                        onClick={() => updateQuantity(item.medicineId, item.quantity - 1)}
                        className="px-3 py-2 hover:bg-muted transition"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.medicineId, parseInt(e.target.value) || 1)}
                        className="w-12 text-center border-none bg-background focus:outline-none"
                      />
                      <button
                        onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
                        className="px-3 py-2 hover:bg-muted transition"
                      >
                        +
                      </button>
                    </div>

                    <div className="w-24 text-right">
                      <p className="font-semibold text-foreground">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    <button
                      onClick={() => removeItem(item.medicineId)}
                      className="p-2 hover:bg-destructive/10 rounded transition text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Items</span>
                    <span>{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Shipping</span>
                    <span className="text-primary font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Tax</span>
                    <span>₹0</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-3xl font-bold text-primary">₹{totalPrice.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-semibold mb-3"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/shop"
                  className="block text-center px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition font-medium"
                >
                  Continue Shopping
                </Link>

                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> This is a demo cart. Payment will be cash on delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
