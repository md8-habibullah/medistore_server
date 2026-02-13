'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Pill, Truck, Shield, Search } from 'lucide-react'
import Link from 'next/link'
import type { Medicine } from '@/types'

export default function Home() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch('http://localhost:5000/medicine?page=1&take=6&stock=true', {
          method: 'GET',
        })
        if (response.ok) {
          const data = await response.json()
          setMedicines(data.data || [])
        }
      } catch (error) {
        console.error('Failed to fetch medicines:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicines()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Pill className="w-12 h-12 text-primary" />
              <h1 className="text-5xl sm:text-6xl font-bold text-foreground">MediStore</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Your Trusted Online Medicine Shop
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium text-lg"
              >
                Browse Medicines
              </Link>
              <Link
                href="/auth?tab=register"
                className="px-8 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition font-medium text-lg"
              >
                Join as Seller
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for medicines, vitamins, health products..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Why Choose MediStore?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg bg-background border border-border hover:border-primary transition">
              <Truck className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Get your medicines delivered quickly and safely to your doorstep
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg bg-background border border-border hover:border-primary transition">
              <Shield className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Verified Sellers</h3>
              <p className="text-muted-foreground">
                All medicines are from verified and trusted pharmaceutical sellers
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg bg-background border border-border hover:border-primary transition">
              <Pill className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Authentic Products</h3>
              <p className="text-muted-foreground">
                100% authentic medicines with proper certifications and quality assurance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Medicines Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Featured Medicines</h2>
            <Link href="/shop" className="text-primary hover:text-primary/80 transition font-medium">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicines.map((medicine) => (
                <Link
                  key={medicine.id}
                  href={`/shop/${medicine.id}`}
                  className="group rounded-lg bg-card border border-border overflow-hidden hover:border-primary transition"
                >
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Pill className="w-16 h-16 text-primary/30" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition">
                        {medicine.name}
                      </h3>
                      {medicine.stock < 1 && (
                        <span className="px-2 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-medium">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {medicine.description || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-primary">₹{medicine.price}</span>
                      </div>
                      <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium capitalize">
                        {medicine.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Sign up now to browse our complete range of medicines and place your first order
          </p>
          <Link
            href="/auth?tab=register"
            className="inline-block px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium"
          >
            Sign Up Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">About MediStore</h3>
              <p className="text-sm text-muted-foreground">
                Your trusted online medicine shop delivering authentic medicines with fast and safe delivery
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/shop" className="hover:text-primary transition">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-primary transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-primary transition">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-primary transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary transition">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 MediStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
