'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Package, Edit } from 'lucide-react'
import toast from 'react-hot-toast'

interface Tute {
  id: string
  tuteId: string
  name: string
  month: string
  year: number
  batch: string
}

export default function TutesPage() {
  const [tutes, setTutes] = useState<Tute[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editTute, setEditTute] = useState<Tute | null>(null)
  const [newTute, setNewTute] = useState({
    name: '',
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear(),
    batch: '2028 AL'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTutes()
  }, [])

  const fetchTutes = async () => {
    try {
      const res = await fetch('/api/tutes')
      const data = await res.json()
      setTutes(data)
    } catch (error) {
      toast.error('Failed to fetch tutes')
    }
  }

  const handleAddTute = async () => {
    if (!newTute.name) {
      toast.error('Please enter tute name')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/tutes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTute)
      })
      if (res.ok) {
        toast.success('Tute added')
        setShowAddModal(false)
        setNewTute({
          name: '',
          month: new Date().toLocaleString('default', { month: 'long' }),
          year: new Date().getFullYear(),
          batch: '2028 AL'
        })
        fetchTutes()
      } else {
        toast.error('Failed to add tute')
      }
    } catch (error) {
      toast.error('Failed to add tute')
    } finally {
      setLoading(false)
    }
  }

  const handleEditTute = async () => {
    if (!editTute) return
    setLoading(true)
    try {
      const res = await fetch(`/api/tutes?id=${editTute.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editTute.name,
          month: editTute.month,
          year: editTute.year,
          batch: editTute.batch
        })
      })
      if (res.ok) {
        toast.success('Tute updated')
        setShowEditModal(false)
        fetchTutes()
      } else {
        toast.error('Failed to update')
      }
    } catch (error) {
      toast.error('Failed to update')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTute = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      const res = await fetch(`/api/tutes?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('Tute deleted')
        fetchTutes()
      } else {
        toast.error('Failed to delete')
      }
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tute Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tute</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutes.map((tute) => (
          <div key={tute.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditTute(tute)
                    setShowEditModal(true)
                  }}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTute(tute.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">{tute.name}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Month: {tute.month} {tute.year}</p>
              <p>Batch: {tute.batch}</p>
              <p className="text-xs text-gray-400">ID: {tute.tuteId}</p>
            </div>
          </div>
        ))}
        {tutes.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No tutes yet. Click "Add Tute" to create one.
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Tute</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Tute Name"
                className="w-full p-2 border rounded"
                value={newTute.name}
                onChange={(e) => setNewTute({...newTute, name: e.target.value})}
              />
              <select
                className="w-full p-2 border rounded"
                value={newTute.month}
                onChange={(e) => setNewTute({...newTute, month: e.target.value})}
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Year"
                className="w-full p-2 border rounded"
                value={newTute.year}
                onChange={(e) => setNewTute({...newTute, year: parseInt(e.target.value)})}
              />
              <select
                className="w-full p-2 border rounded"
                value={newTute.batch}
                onChange={(e) => setNewTute({...newTute, batch: e.target.value})}
              >
                <option value="2028 AL">2028 AL</option>
                <option value="2027 AL">2027 AL</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTute}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Tute'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editTute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Tute</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Tute Name"
                className="w-full p-2 border rounded"
                value={editTute.name}
                onChange={(e) => setEditTute({...editTute, name: e.target.value})}
              />
              <select
                className="w-full p-2 border rounded"
                value={editTute.month}
                onChange={(e) => setEditTute({...editTute, month: e.target.value})}
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Year"
                className="w-full p-2 border rounded"
                value={editTute.year}
                onChange={(e) => setEditTute({...editTute, year: parseInt(e.target.value)})}
              />
              <select
                className="w-full p-2 border rounded"
                value={editTute.batch}
                onChange={(e) => setEditTute({...editTute, batch: e.target.value})}
              >
                <option value="2028 AL">2028 AL</option>
                <option value="2027 AL">2027 AL</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTute}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}