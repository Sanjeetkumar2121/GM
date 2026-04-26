'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import OpportunityCard from '@/components/OpportunityCard'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { apiService } from '@/lib/apiService'
import { useRouter } from 'next/navigation'
import { Search, Filter } from 'lucide-react'

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([])
  const [filteredOpportunities, setFilteredOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [appliedIds, setAppliedIds] = useState(new Set())
  const { user } = useAuth()
  const { addToast } = useToast()
  const router = useRouter()

  const categories = ['all', 'Internship', 'Fellowship', 'Accelerator']

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchOpportunities = async () => {
      try {
        setLoading(true)
        const data = await apiService.getOpportunities()
        setOpportunities(data)
        setFilteredOpportunities(data)
        // Load applied opportunities from localStorage
        const stored = localStorage.getItem(`appliedOpportunities_${user.id}`)
        if (stored) {
          setAppliedIds(new Set(JSON.parse(stored)))
        }
      } catch (error) {
        addToast('Failed to load opportunities', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchOpportunities()
  }, [user, router, addToast])

  useEffect(() => {
    let filtered = opportunities

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(o => o.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(o =>
        o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredOpportunities(filtered)
  }, [searchQuery, selectedCategory, opportunities])

  const handleApply = async (opportunityId) => {
    try {
      await apiService.applyToOpportunity(opportunityId)
      const newAppliedIds = new Set(appliedIds)
      newAppliedIds.add(opportunityId)
      setAppliedIds(newAppliedIds)
      localStorage.setItem(`appliedOpportunities_${user.id}`, JSON.stringify([...newAppliedIds]))
      addToast('Successfully applied to opportunity!', 'success')
    } catch (error) {
      addToast('Failed to apply to opportunity', 'error')
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <LoadingSpinner fullPage message="Loading opportunities..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-2">Opportunities</h1>
        <p className="text-secondary mb-8">Browse and apply to opportunities</p>

        {/* Search and Filter */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-secondary" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-secondary" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="text-sm text-secondary mb-6">
          Showing {filteredOpportunities.length} of {opportunities.length} opportunities
        </div>

        {filteredOpportunities.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-secondary mb-4">No opportunities found</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="text-primary font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map(opportunity => (
              <div key={opportunity.id} className="relative">
                <OpportunityCard 
                  opportunity={opportunity}
                  applied={appliedIds.has(opportunity.id)}
                />
                {!appliedIds.has(opportunity.id) && (
                  <button
                    onClick={() => handleApply(opportunity.id)}
                    className="absolute bottom-6 right-6 bg-success text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
