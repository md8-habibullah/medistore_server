'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { User, Save, AlertCircle } from 'lucide-react'

export default function CustomerProfilePage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const response = await fetch('http://localhost:5000/user/profile', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
        }),
      })

      if (response.ok) {
        setSuccess('Profile updated successfully')
      } else {
        setError('Failed to update profile')
      }
    } catch (err) {
      setError('An error occurred while updating your profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg bg-green-100 border border-green-300 text-green-800">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-card border border-border rounded-lg p-6 space-y-6">
        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-4">Profile Picture</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-input hover:bg-muted transition text-sm font-medium"
            >
              Change Picture
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-input bg-muted text-foreground/60 focus:outline-none cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">Email address cannot be changed</p>
        </div>

        {/* Account Status */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Account Status</label>
          <div className="p-4 rounded-lg bg-muted border border-border">
            <p className="text-foreground font-medium mb-1">Role: {user?.role}</p>
            <p className="text-sm text-muted-foreground">
              {user?.emailVerified ? 'Email Verified' : 'Email Not Verified'}
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h2>
        <button className="px-6 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition font-medium text-sm">
          Delete Account
        </button>
        <p className="text-xs text-muted-foreground mt-2">
          Once you delete your account, there is no going back. Please be certain.
        </p>
      </div>
    </div>
  )
}
