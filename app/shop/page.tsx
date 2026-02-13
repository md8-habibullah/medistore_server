'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Pill, Search, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import type { Medicine, Category } from '@/types'

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'prescription', label: 'Prescription' },
  { value: 'otc', label: 'OTC' },
  { value: 'supplement', label: 'Supplement' },
  { value: 'device', label: 'Device' },
  { value: 'cosmetic', label: 'Cosmetic' },
  { value: 'others', label: 'Others' },
]

export default function ShopPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [manufacturerFilter, setManufacturerFilter] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)

  // UI state
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)
  const [manufacturers, setManufacturers] = useState<string[]>([])

  // Fetch medicines
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/medicine?page=1&take=100&stock=${inStockOnly}`,
          { method: 'GET' }
        )
        if (response.ok) {
          const data = await response.json()
          const medicineList = data.data || []
          setMedicines(medicineList)

          // Extract unique manufacturers
          const uniqueManufacturers = [...new Set(medicineList.map((m: Medicine) => m.manufacturer))]
          setManufacturers(uniqueManufacturers as string[])
        }
      } catch (error) {
        console.error('Failed to fetch medicines:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicines()
  }, [inStockOnly])

  // Apply filters
  useEffect(() => {
    let filtered = medicines

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((m) => selectedCategories.includes(m.category))
    }

    // Price range filter
    filtered = filtered.filter((m) => m.price >= priceRange[0] && m.price <= priceRange[1])

    // Manufacturer filter
    if (manufacturerFilter) {
      filtered = filtered.filter((m) => m.manufacturer === manufacturerFilter)
    }

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter((m) => m.stock > 0)
    }

    setFilteredMedicines(filtered)
  }, [medicines, searchQuery, selectedCategories, priceRange, manufacturerFilter, inStockOnly])

  const toggleCategory = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Shop Medicines</h1>
          <p className="text-muted-foreground">Find and order the medicines you need</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Search */}
              <div>
                <label htmlFor="search" className="block text-sm font-semibold text-foreground mb-3">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Medicine name..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <button
                  onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                  className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-muted text-foreground font-semibold hover:bg-muted/80 transition"
                >
                  Categories
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${categoryMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {categoryMenuOpen && (
                  <div className="mt-2 space-y-2 p-2 bg-card rounded-lg border border-border">
                    {CATEGORIES.map((cat) => (
                      <label key={cat.value} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-muted rounded">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.value)}
                          onChange={() => toggleCategory(cat.value)}
                          className="w-4 h-4 rounded border-input cursor-pointer"
                        />
                        <span className="text-sm text-foreground">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Manufacturer */}
              {manufacturers.length > 0 && (
                <div>
                  <label htmlFor="manufacturer" className="block text-sm font-semibold text-foreground mb-2">
                    Manufacturer
                  </label>
                  <select
                    id="manufacturer"
                    value={manufacturerFilter}
                    onChange={(e) => setManufacturerFilter(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option value="">All Manufacturers</option>
                    {manufacturers.map((mfr) => (
                      <option key={mfr} value={mfr}>
                        {mfr}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* In Stock Only */}
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg bg-muted hover:bg-muted/80 transition">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-input cursor-pointer"
                />
                <span className="text-sm font-medium text-foreground">In Stock Only</span>
              </label>

              {/* Clear Filters */}
              {(searchQuery ||
                selectedCategories.length > 0 ||
                manufacturerFilter ||
                inStockOnly ||
                priceRange[1] < 1000) && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategories([])
                    setPriceRange([0, 1000])
                    setManufacturerFilter('')
                    setInStockOnly(false)
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition font-medium text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredMedicines.length > 0 ? (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {filteredMedicines.length} result{filteredMedicines.length !== 1 ? 's' : ''}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredMedicines.map((medicine) => (
                    <Link
                      key={medicine.id}
                      href={`/shop/${medicine.id}`}
                      className="group rounded-lg bg-card border border-border overflow-hidden hover:border-primary transition"
                    >
                      <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Pill className="w-20 h-20 text-primary/30" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition line-clamp-2">
                            {medicine.name}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          By {medicine.manufacturer}
                        </p>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {medicine.description || 'No description available'}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-primary">₹{medicine.price}</span>
                            {medicine.stock < 1 && (
                              <span className="text-xs text-destructive font-medium">Out of Stock</span>
                            )}
                            {medicine.stock > 0 && medicine.stock <= 5 && (
                              <span className="text-xs text-accent font-medium">Only {medicine.stock} left</span>
                            )}
                          </div>
                          <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium capitalize">
                            {medicine.category}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-center">
                <Pill className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No medicines found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters to find what you are looking for
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategories([])
                    setPriceRange([0, 1000])
                    setManufacturerFilter('')
                    setInStockOnly(false)
                  }}
                  className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
