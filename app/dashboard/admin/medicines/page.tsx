'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import type { Medicine } from '@/types'
import { Package, AlertCircle, Trash2 } from 'lucide-react'

export default function AdminMedicinesPage() {
  const { user } = useAuth()
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchMedicines()
  }, [])

  const fetchMedicines = async () => {
    try {
      const response = await fetch('http://localhost:5000/medicine?take=100', {
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
      setError('An error occurred')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">All Medicines</h1>
        <p className="text-muted-foreground">Overview of all medicines in the system</p>
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

      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm text-foreground font-semibold">Total Medicines: {medicines.length}</p>
      </div>

      {medicines.length > 0 ? (
        <div className="overflow-x-auto bg-card border border-border rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Manufacturer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((medicine) => (
                <tr key={medicine.id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="px-6 py-4 text-foreground font-medium">{medicine.name}</td>
                  <td className="px-6 py-4 text-foreground text-sm">{medicine.manufacturer}</td>
                  <td className="px-6 py-4 text-primary font-bold">₹{medicine.price}</td>
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
                    <button
                      onClick={() => handleDeleteMedicine(medicine.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition text-xs font-medium"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No medicines found</p>
        </div>
      )}
    </div>
  )
}
