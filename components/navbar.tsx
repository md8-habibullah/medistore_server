'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const getDashboardLink = () => {
    if (!user) return null
    switch (user.role) {
      case 'CUSTOMER':
        return { href: '/dashboard/customer', label: 'My Dashboard' }
      case 'SELLER':
        return { href: '/dashboard/seller', label: 'Seller Dashboard' }
      case 'ADMIN':
        return { href: '/dashboard/admin', label: 'Admin Panel' }
      default:
        return null
    }
  }

  const dashboardLink = getDashboardLink()

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              M
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline">MediStore</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-foreground hover:text-primary transition">
              Shop
            </Link>
            {dashboardLink && (
              <Link href={dashboardLink.href} className="text-foreground hover:text-primary transition">
                {dashboardLink.label}
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 hover:bg-muted rounded-lg transition">
              <ShoppingCart className="w-5 h-5 text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </Link>

            {/* Auth Section */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-foreground">{user.name.split(' ')[0]}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="px-4 py-2 text-primary hover:bg-muted rounded-lg transition text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth?tab=register"
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition text-sm font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition"
            >
              {menuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <Link
              href="/shop"
              className="block px-4 py-2 text-foreground hover:text-primary transition"
            >
              Shop
            </Link>
            {dashboardLink && (
              <Link
                href={dashboardLink.href}
                className="block px-4 py-2 text-foreground hover:text-primary transition"
              >
                {dashboardLink.label}
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-destructive hover:bg-destructive/10 transition"
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2 px-4 pt-2">
                <Link
                  href="/auth"
                  className="px-4 py-2 text-center text-primary hover:bg-muted rounded-lg transition text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth?tab=register"
                  className="px-4 py-2 text-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
