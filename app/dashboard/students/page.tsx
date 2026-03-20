'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Printer, Send, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface Student {
  id: string
  studentId: string
  username: string
  name: string
  addressLine1: string
  addressLine2: string
  city: string
  batch: string
  enrolledClasses: string[]
  contactNo: string
  email: string
}

interface Tute {
  id: string
  tuteId: string
  name: string
  month: string
  year: number
  batch: string
}

const classOptions = {
  '2028 AL': ['2028 Theory', '2028 Paper'],
  '2027 AL': ['2027 Theory', '2027 Paper']
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [tutes, setTutes] = useState<Tute[]>([])
  const [sentTuteIds, setSentTuteIds] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBatch, setSelectedBatch] = useState('all')
  const [newStudent, setNewStudent] = useState({
    username: '',
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    batch: '2028 AL',
    enrolledClasses: [] as string[],
    contactNo: '',
    email: ''
  })
  const [editStudent, setEditStudent] = useState<Student | null>(null)
  const [selectedTuteIds, setSelectedTuteIds] = useState<string[]>([])
  const [trackingId, setTrackingId] = useState('')
  const [addClassFee, setAddClassFee] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStudents()
    fetchTutes()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students')
      const data = await res.json()
      const formatted = data.map((s: any) => ({
        ...s,
        enrolledClasses: s.enrolledClasses || []
      }))
      setStudents(formatted)
    } catch (error) {
      toast.error('Failed to fetch students')
    }
  }

  const fetchTutes = async () => {
    try {
      const res = await fetch('/api/tutes')
      const data = await res.json()
      setTutes(data)
    } catch (error) {
      toast.error('Failed to fetch tutes')
    }
  }

  const fetchSentTutes = async (studentId: string) => {
    try {
      const res = await fetch(`/api/tutes/sent/${studentId}`)
      const data = await res.json()
      setSentTuteIds(data.sentTuteIds || [])
    } catch (error) {
      toast.error('Failed to fetch sent tutes')
    }
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBatch = selectedBatch === 'all' || student.batch === selectedBatch
    return matchesSearch && matchesBatch
  })

  const handleAddStudent = async () => {
    if (!newStudent.username || !newStudent.name || !newStudent.addressLine1 || !newStudent.city || !newStudent.contactNo) {
      toast.error('Please fill all required fields')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      })
      if (res.ok) {
        toast.success('Student added successfully')
        setShowAddModal(false)
        setNewStudent({
          username: '',
          name: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          batch: '2028 AL',
          enrolledClasses: [],
          contactNo: '',
          email: ''
        })
        fetchStudents()
      } else {
        const error = await res.json()
        toast.error(error.error || 'Failed to add student')
      }
    } catch (error) {
      toast.error('Failed to add student')
    } finally {
      setLoading(false)
    }
  }

  const handleEditStudent = async () => {
    if (!editStudent) return
    setLoading(true)
    try {
      const res = await fetch(`/api/students?id=${editStudent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editStudent)
      })
      if (res.ok) {
        toast.success('Student updated')
        setShowEditModal(false)
        fetchStudents()
      } else {
        toast.error('Failed to update')
      }
    } catch (error) {
      toast.error('Failed to update')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStudent = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      const res = await fetch(`/api/students?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('Student deleted')
        fetchStudents()
      } else {
        toast.error('Failed to delete')
      }
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const handlePrintLabels = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Address Labels</title>
            <style>
              body { margin: 0; padding: 20px; font-family: Arial; }
              .label-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
              .label { border: 1px dashed #ccc; padding: 10px; margin: 5px; page-break-inside: avoid; }
              @media print {
                .label { border: none; }
              }
            </style>
          </head>
          <body>
            <div class="label-container">
              ${students.map(s => `
                <div class="label">
                  <strong>${s.name}</strong><br>
                  ${s.addressLine1}<br>
                  ${s.addressLine2 ? s.addressLine2 + '<br>' : ''}
                  ${s.city}<br>
                  Sri Lanka
                </div>
              `).join('')}
            </div>
            <script>
              window.onload = () => { window.print(); }
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const openSendModal = (student: Student) => {
    setSelectedStudent(student)
    setSelectedTuteIds([])
    setTrackingId('')
    setAddClassFee(true) // reset to default
    fetchSentTutes(student.id)
    setShowSendModal(true)
  }

  const handleSendTutes = async () => {
    if (!trackingId) {
      toast.error('Please enter tracking ID')
      return
    }
    if (selectedTuteIds.length === 0) {
      toast.error('Please select at least one tute')
      return
    }
    setLoading(true)
    try {
      const now = new Date()
      const month = now.toLocaleString('default', { month: 'long' })
      const year = now.getFullYear()
      const batch = selectedStudent?.batch

      const res = await fetch('/api/tutes/sent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent?.id,
          tuteIds: selectedTuteIds,
          trackingId,
          month,
          year,
          batch,
          addClassFee,
        })
      })
      if (res.ok) {
        toast.success('Tutes sent successfully')
        setShowSendModal(false)
        if (selectedStudent) fetchSentTutes(selectedStudent.id)
      } else {
        const error = await res.json()
        toast.error(error.error || 'Failed to send tutes')
      }
    } catch (error) {
      toast.error('Failed to send tutes')
    } finally {
      setLoading(false)
    }
  }

  const isTuteSent = (tuteId: string) => sentTuteIds.includes(tuteId)

  const toggleClass = (classType: string, isEditing: boolean) => {
    if (isEditing) {
      if (!editStudent) return
      const current = editStudent.enrolledClasses || []
      if (current.includes(classType)) {
        setEditStudent({ ...editStudent, enrolledClasses: current.filter(c => c !== classType) })
      } else {
        setEditStudent({ ...editStudent, enrolledClasses: [...current, classType] })
      }
    } else {
      const current = newStudent.enrolledClasses || []
      if (current.includes(classType)) {
        setNewStudent({ ...newStudent, enrolledClasses: current.filter(c => c !== classType) })
      } else {
        setNewStudent({ ...newStudent, enrolledClasses: [...current, classType] })
      }
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Students Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={handlePrintLabels}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Printer className="w-4 h-4" />
            <span>Print Labels</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, ID, or username..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="all">All Batches</option>
            <option value="2028 AL">2028 AL</option>
            <option value="2027 AL">2027 AL</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Student ID</th>
                <th className="text-left py-3 px-4">Username</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Batch</th>
                <th className="text-left py-3 px-4">Enrolled Classes</th>
                <th className="text-left py-3 px-4">Contact</th>
                <th className="text-left py-3 px-4">City</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono">{student.studentId}</td>
                  <td className="py-3 px-4 font-mono text-red-600">{student.username}</td>
                  <td className="py-3 px-4">{student.name}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                      {student.batch}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {student.enrolledClasses?.map(cls => (
                        <span key={cls} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {cls}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">{student.contactNo}</td>
                  <td className="py-3 px-4">{student.city}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditStudent(student)
                          setShowEditModal(true)
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openSendModal(student)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Send Tutes"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Student</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username * (unique code)"
                className="w-full p-2 border rounded"
                value={newStudent.username}
                onChange={(e) => setNewStudent({...newStudent, username: e.target.value})}
              />
              <input
                type="text"
                placeholder="Full Name *"
                className="w-full p-2 border rounded"
                value={newStudent.name}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Address Line 1 *"
                className="w-full p-2 border rounded"
                value={newStudent.addressLine1}
                onChange={(e) => setNewStudent({...newStudent, addressLine1: e.target.value})}
              />
              <input
                type="text"
                placeholder="Address Line 2"
                className="w-full p-2 border rounded"
                value={newStudent.addressLine2}
                onChange={(e) => setNewStudent({...newStudent, addressLine2: e.target.value})}
              />
              <input
                type="text"
                placeholder="City *"
                className="w-full p-2 border rounded"
                value={newStudent.city}
                onChange={(e) => setNewStudent({...newStudent, city: e.target.value})}
              />
              <select
                className="w-full p-2 border rounded"
                value={newStudent.batch}
                onChange={(e) => {
                  const batch = e.target.value
                  setNewStudent({
                    ...newStudent,
                    batch,
                    enrolledClasses: []
                  })
                }}
              >
                <option value="2028 AL">2028 AL</option>
                <option value="2027 AL">2027 AL</option>
              </select>

              <div>
                <label className="block text-sm font-medium mb-2">Enrolled Classes (select all that apply)</label>
                <div className="space-y-2">
                  {classOptions[newStudent.batch as keyof typeof classOptions]?.map(cls => (
                    <label key={cls} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newStudent.enrolledClasses.includes(cls)}
                        onChange={() => toggleClass(cls, false)}
                        className="rounded text-red-600"
                      />
                      <span>{cls}</span>
                    </label>
                  ))}
                </div>
              </div>

              <input
                type="text"
                placeholder="Contact Number *"
                className="w-full p-2 border rounded"
                value={newStudent.contactNo}
                onChange={(e) => setNewStudent({...newStudent, contactNo: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded"
                value={newStudent.email}
                onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Student'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && editStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Student</h2>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full p-2 border rounded"
                value={editStudent.username}
                onChange={(e) => setEditStudent({...editStudent, username: e.target.value})}
              />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-2 border rounded"
                value={editStudent.name}
                onChange={(e) => setEditStudent({...editStudent, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Address Line 1"
                className="w-full p-2 border rounded"
                value={editStudent.addressLine1}
                onChange={(e) => setEditStudent({...editStudent, addressLine1: e.target.value})}
              />
              <input
                type="text"
                placeholder="Address Line 2"
                className="w-full p-2 border rounded"
                value={editStudent.addressLine2}
                onChange={(e) => setEditStudent({...editStudent, addressLine2: e.target.value})}
              />
              <input
                type="text"
                placeholder="City"
                className="w-full p-2 border rounded"
                value={editStudent.city}
                onChange={(e) => setEditStudent({...editStudent, city: e.target.value})}
              />
              <select
                className="w-full p-2 border rounded"
                value={editStudent.batch}
                onChange={(e) => {
                  const batch = e.target.value
                  setEditStudent({
                    ...editStudent,
                    batch,
                    enrolledClasses: []
                  })
                }}
              >
                <option value="2028 AL">2028 AL</option>
                <option value="2027 AL">2027 AL</option>
              </select>

              <div>
                <label className="block text-sm font-medium mb-2">Enrolled Classes</label>
                <div className="space-y-2">
                  {classOptions[editStudent.batch as keyof typeof classOptions]?.map(cls => (
                    <label key={cls} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editStudent.enrolledClasses?.includes(cls) || false}
                        onChange={() => toggleClass(cls, true)}
                        className="rounded text-red-600"
                      />
                      <span>{cls}</span>
                    </label>
                  ))}
                </div>
              </div>

              <input
                type="text"
                placeholder="Contact Number"
                className="w-full p-2 border rounded"
                value={editStudent.contactNo}
                onChange={(e) => setEditStudent({...editStudent, contactNo: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded"
                value={editStudent.email}
                onChange={(e) => setEditStudent({...editStudent, email: e.target.value})}
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditStudent}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Tutes Modal */}
      {showSendModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Send Tutes to {selectedStudent.name}</h2>
              <button onClick={() => setShowSendModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">SL Post Tracking ID</label>
              <input
                type="text"
                placeholder="Enter tracking ID (e.g., SL123456789LK)"
                className="w-full p-2 border rounded"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={addClassFee}
                  onChange={(e) => setAddClassFee(e.target.checked)}
                  className="rounded text-red-600"
                />
                <span className="text-sm text-gray-700">Add class fee to invoice</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Uncheck if this tute delivery does not include a class fee (e.g., for past tutes).
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Tutes (gray ones have been sent before)</label>
              <div className="border rounded max-h-60 overflow-y-auto">
                {tutes
                  .filter(t => t.batch === selectedStudent.batch)
                  .map((tute) => {
                    const sent = isTuteSent(tute.tuteId)
                    return (
                      <label
                        key={tute.id}
                        className={`flex items-center space-x-3 p-3 hover:bg-gray-50 border-b ${sent ? 'bg-gray-100' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTuteIds.includes(tute.tuteId)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTuteIds([...selectedTuteIds, tute.tuteId])
                            } else {
                              setSelectedTuteIds(selectedTuteIds.filter(id => id !== tute.tuteId))
                            }
                          }}
                          className="rounded text-red-600"
                        />
                        <div>
                          <p className={`font-medium ${sent ? 'line-through text-gray-500' : ''}`}>
                            {tute.name}
                          </p>
                          <p className="text-sm text-gray-500">{tute.month} {tute.year}</p>
                        </div>
                      </label>
                    )
                  })}
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSendModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendTutes}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Tutes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
