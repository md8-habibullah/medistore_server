'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import type { Medicine, Category } from '@/types'
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react'

const CATEGORIES: Category[] = ['prescription', 'otc', 'supplement', 'device', 'cosmetic', 'others']

interface NewMedicine {
  name: string
  description: string
  price: number
  stock: number
  manufacturer: string
  category: Category
  tags: string
}

export default function SellerInventoryPage() {
  const { user } = useAuth()
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState<NewMedicine>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    manufacturer: '',
    category: 'otc',
    tags: '',
  })

  useEffect(() => {
    fetchMedicines()
  }, [])

  const fetchMedicines = async () => {
    try {
      const response = await fetch(`http://localhost:5000/medicine?sellerID=${user?.id}&take=100`, {
        method: 'GET',
      })
      if (response.ok) {
        const data = await response.json()
        setMedicines(data.data || [])
      }
    } catch (err) {
      setError('Failed to load medicines')
    } finally {
      setLoading(false)
    }
  }

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://localhost:5000/medicine', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price.toString()),
          stock: parseInt(formData.stock.toString()),
          manufacturer: formData.manufacturer,
          category: formData.category,
          tags: formData.tags.split(',').map((t) => t.trim()),
        }),
      })

      if (response.ok) {
        setSuccess('Medicine added successfully')
        setShowForm(false)
        setFormData({
          name: '',
          description: '',
          price: 0,
          stock: 0,
          manufacturer: '',
          category: 'otc',
          tags: '',
        })
        fetchMedicines()
      } else {
        const error = await response.json()
        setError(error.message || 'Failed to add medicine')
      }
    } catch (err) {
      setError('An error occurred while adding medicine')
    }
  }

  const handleDeleteMedicine = async (medicineId: string) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return

    try {
      const response = await fetch(`http://localhost:5000/medicine/${medicineId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        setSuccess('Medicine deleted successfully')
        fetchMedicines()
      } else {
        setError('Failed to delete medicine')
      }
    } catch (err) {
      setError('An error occurred while deleting medicine')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Medicines</h1>
          <p className="text-muted-foreground">Manage your medicine inventory</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add Medicine
        </button>
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

      {/* Add Medicine Form */}
      {showForm && (
        <form onSubmit={handleAddMedicine} className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Add New Medicine</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Medicine Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              step="0.01"
              required
              className="px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              required
              className="px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="text"
              placeholder="Manufacturer"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              required
              className="px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              className="px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium"
            >
              Add Medicine
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 rounded-lg border border-input hover:bg-muted transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Medicines Table */}
      {medicines.length > 0 ? (
        <div className="overflow-x-auto bg-card border border-border rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((medicine) => (
                <tr key={medicine.id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="px-6 py-4 text-foreground">{medicine.name}</td>
                  <td className="px-6 py-4 text-primary font-semibold">₹{medicine.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        medicine.stock > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {medicine.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground capitalize">{medicine.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingId(medicine.id)}
                        className="p-2 hover:bg-primary/10 rounded transition text-primary"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMedicine(medicine.id)}
                        className="p-2 hover:bg-destructive/10 rounded transition text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground mb-4">No medicines added yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-block px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium"
          >
            Add Your First Medicine
          </button>
        </div>
      )}
    </div>
  )
}
