'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Package, User, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth')
    } else if (user.role !== 'CUSTOMER') {
      router.push('/')
    } else {
      setIsLoading(false)
    }
  }, [user, router])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-4">
              {/* User Info */}
              <div className="mb-6 pb-6 border-b border-border">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mb-3">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-semibold text-foreground">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <span className="inline-block mt-2 px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                  {user?.role}
                </span>
              </div>

              {/* Menu */}
              <nav className="space-y-2">
                <Link
                  href="/dashboard/customer"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition text-foreground"
                >
                  <Package className="w-5 h-5 text-primary" />
                  <span>My Orders</span>
                </Link>
                <Link
                  href="/dashboard/customer/profile"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition text-foreground"
                >
                  <User className="w-5 h-5 text-primary" />
                  <span>Profile Settings</span>
                </Link>
              </nav>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full mt-6 pt-6 border-t border-border flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-destructive/10 transition text-destructive text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  )
}
