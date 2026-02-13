'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Pill, ChevronLeft, ShoppingCart, Heart } from 'lucide-react'
import Link from 'next/link'
import type { Medicine } from '@/types'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export default function MedicineDetailPage({ params }: { params: { id: string } }) {
  const [medicine, setMedicine] = useState<Medicine | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const response = await fetch(`http://localhost:5000/medicine/${params.id}`, {
          method: 'GET',
        })
        if (response.ok) {
          const data = await response.json()
          setMedicine(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch medicine:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicine()
  }, [params.id])

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/auth')
      return
    }

    setAddingToCart(true)
    try {
      // Store in localStorage for now - would connect to API later
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingItem = cart.find((item: any) => item.medicineId === medicine?.id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cart.push({
          medicineId: medicine?.id,
          quantity,
          price: medicine?.price,
          name: medicine?.name,
        })
      }

      localStorage.setItem('cart', JSON.stringify(cart))
      router.push('/cart')
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-96 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded-lg w-2/3" />
            <div className="h-20 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Medicine not found</h1>
          <Link href="/shop" className="text-primary hover:text-primary/80 transition">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link
          href="/shop"
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition mb-8 w-fit"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Product Image */}
          <div className="md:col-span-1">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center sticky top-4">
              <Pill className="w-32 h-32 text-primary/30" />
            </div>
          </div>

          {/* Product Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{medicine.name}</h1>
                  <p className="text-muted-foreground">By {medicine.manufacturer}</p>
                </div>
                <button className="p-2 rounded-lg hover:bg-muted transition">
                  <Heart className="w-6 h-6 text-muted-foreground hover:text-destructive transition" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary font-semibold capitalize">
                  {medicine.category}
                </span>
                {medicine.stock < 1 && (
                  <span className="inline-block px-3 py-1 rounded-lg bg-destructive/10 text-destructive font-semibold">
                    Out of Stock
                  </span>
                )}
                {medicine.stock > 0 && medicine.stock <= 5 && (
                  <span className="inline-block px-3 py-1 rounded-lg bg-accent/20 text-accent font-semibold">
                    Only {medicine.stock} left
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="border-b border-border pb-6">
              <p className="text-5xl font-bold text-primary mb-2">₹{medicine.price}</p>
              <p className="text-muted-foreground">Free shipping on orders above ₹500</p>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Description</h2>
              <p className="text-foreground leading-relaxed">
                {medicine.description || 'No description available for this medicine.'}
              </p>
            </div>

            {/* Tags */}
            {medicine.tags.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">Uses & Benefits</h2>
                <div className="flex flex-wrap gap-2">
                  {medicine.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Info */}
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Stock Available:</strong> {medicine.stock > 0 ? `${medicine.stock} units` : 'Out of Stock'}
              </p>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-input rounded-lg bg-background">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={medicine.stock < 1}
                    className="px-4 py-2 hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(medicine.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                    min="1"
                    max={medicine.stock}
                    disabled={medicine.stock < 1}
                    className="w-16 text-center border-none bg-background focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(medicine.stock, quantity + 1))}
                    disabled={medicine.stock < 1}
                    className="px-4 py-2 hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={medicine.stock < 1 || addingToCart}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                {addingToCart ? 'Adding...' : medicine.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button className="w-full px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition font-semibold">
                Buy Now
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Why Buy from MediStore?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ 100% Authentic Medicines</li>
                <li>✓ Verified Sellers & Quality Assured</li>
                <li>✓ Fast & Safe Delivery</li>
                <li>✓ Easy Returns & Refunds</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
