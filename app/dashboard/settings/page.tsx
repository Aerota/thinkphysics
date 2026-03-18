'use client'

import { useState, useEffect } from 'react'
import { Download, Database, Save } from 'lucide-react'
import toast from 'react-hot-toast'

interface Settings {
  fee2027Theory: number
  fee2027Paper: number
  fee2028Theory: number
  fee2028Paper: number
  courierFee: number
  bankDetails: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    fee2027Theory: 3800,
    fee2027Paper: 3800,
    fee2028Theory: 3800,
    fee2028Paper: 3800,
    courierFee: 300,
    bankDetails: 'Bank: Example Bank\nAccount: 123456789'
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      setSettings(data)
    } catch (error) {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        toast.success('Settings saved')
      } else {
        toast.error('Failed to save')
      }
    } catch (error) {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const exportData = async (type: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/export?type=${type}`)
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type}-${new Date().toISOString().slice(0,10)}.csv`
      a.click()
      toast.success(`${type} exported successfully`)
    } catch (error) {
      toast.error('Export failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings & Backup</h1>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          {/* Backup Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-red-600" />
              Data Backup
            </h2>
            <p className="text-gray-600 mb-4">Download your data as CSV files for safekeeping.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => exportData('students')}
                disabled={loading}
                className="flex items-center justify-center space-x-2 p-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Export Students</span>
              </button>
              <button
                onClick={() => exportData('payments')}
                disabled={loading}
                className="flex items-center justify-center space-x-2 p-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Export Payments</span>
              </button>
              <button
                onClick={() => exportData('tutes')}
                disabled={loading}
                className="flex items-center justify-center space-x-2 p-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Export Tutes</span>
              </button>
            </div>
          </div>

          {/* Fee Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Class Fees (LKR)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <div>
                <h3 className="font-medium text-gray-700 mb-3">2027 Batch</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Theory Class Fee</label>
                    <input
                      type="number"
                      value={settings.fee2027Theory}
                      onChange={(e) => setSettings({ ...settings, fee2027Theory: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Paper Class Fee</label>
                    <input
                      type="number"
                      value={settings.fee2027Paper}
                      onChange={(e) => setSettings({ ...settings, fee2027Paper: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-3">2028 Batch</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Theory Class Fee</label>
                    <input
                      type="number"
                      value={settings.fee2028Theory}
                      onChange={(e) => setSettings({ ...settings, fee2028Theory: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Paper Class Fee</label>
                    <input
                      type="number"
                      value={settings.fee2028Paper}
                      onChange={(e) => setSettings({ ...settings, fee2028Paper: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Courier Fee (LKR)</label>
                <input
                  type="number"
                  value={settings.courierFee}
                  onChange={(e) => setSettings({ ...settings, courierFee: parseInt(e.target.value) || 0 })}
                  className="w-full max-w-md p-2 border rounded focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account Details</label>
                <textarea
                  value={settings.bankDetails}
                  onChange={(e) => setSettings({ ...settings, bankDetails: e.target.value })}
                  className="w-full max-w-2xl p-2 border rounded focus:ring-2 focus:ring-red-500"
                  rows={4}
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-6 flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}