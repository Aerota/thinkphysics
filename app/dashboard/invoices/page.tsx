'use client'

import { useState, useEffect } from 'react'
import { Download, Share2, CheckCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

interface Invoice {
  id: string
  invoiceNo: string
  studentName: string
  studentId: string
  address: string
  batch: string
  month: string
  year: number
  classFee: number
  courierFee: number
  totalAmount: number
  status: 'Paid' | 'Pending'
  trackingId: string
  paymentDate?: string
  tutes?: { name: string; tuteId: string }[] // We'll keep optional
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }))
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedBatch, setSelectedBatch] = useState('all')

  useEffect(() => {
    fetchInvoices()
  }, [selectedMonth, selectedYear, selectedBatch])

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        month: selectedMonth,
        year: selectedYear.toString(),
        batch: selectedBatch
      })
      const res = await fetch(`/api/invoices?${params}`)
      const data = await res.json()
      setInvoices(data)
    } catch (error) {
      toast.error('Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }

  const generateStyledInvoiceHTML = (invoice: Invoice) => {
    const addressLines = invoice.address.split(',').map(line => line.trim())

    // For tutes, we don't have them yet, so we'll show a placeholder or omit.
    // You could fetch tute details from TuteSent if you want to display them.
    const tuteRows = `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">1</td>
        <td style="padding: 8px; border: 1px solid #ddd;">Monthly Tute Pack</td>
        <td style="padding: 8px; border: 1px solid #ddd;">1.00 pcs</td>
        <td style="padding: 8px; border: 1px solid #ddd;">0.00</td>
        <td style="padding: 8px; border: 1px solid #ddd;">0.00</td>
      </tr>
    `

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice ${invoice.invoiceNo}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0,0,0,0.15); }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { color: #333; margin: 0; }
          .balance-due { text-align: right; font-size: 18px; margin: 10px 0; }
          .balance-due span { background: #f0f0f0; padding: 5px 10px; }
          .from-to { display: flex; justify-content: space-between; margin: 20px 0; }
          .from, .to { width: 45%; }
          .to { text-align: right; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .totals { text-align: right; margin: 10px 0; }
          .totals p { margin: 5px 0; }
          .grand-total { font-size: 18px; font-weight: bold; }
          .notes { margin-top: 30px; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <h1>INVOICE</h1>
            <h2>${invoice.invoiceNo}</h2>
          </div>
          <div class="balance-due">
            <span>Balance Due <strong>LKR ${invoice.status === 'Paid' ? '0.00' : invoice.totalAmount.toFixed(2)}</strong></span>
          </div>
          <div class="from-to">
            <div class="from">
              <strong>Think Physics</strong><br>
              Sri Lanka<br>
              thinkphysicspg@gmail.com
            </div>
            <div class="to">
              <strong>Bill To</strong><br>
              ${invoice.studentName}<br>
              ${addressLines.join('<br>')}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item & Description</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${tuteRows}
            </tbody>
          </table>
          <div class="totals">
            <p>Sub Total: 0.00</p>
            <p>Shipping charge: ${invoice.courierFee.toFixed(2)}</p>
            <p>Class Fee: ${invoice.classFee.toFixed(2)}</p>
            <p class="grand-total">Total: LKR ${invoice.totalAmount.toFixed(2)}</p>
            <p>Payment Made: (-) ${invoice.paymentDate ? invoice.totalAmount.toFixed(2) : '0.00'}</p>
            <p class="grand-total">Balance Due: LKR ${invoice.status === 'Paid' ? '0.00' : invoice.totalAmount.toFixed(2)}</p>
          </div>
          <div class="notes">
            <p>Notes</p>
            <p>Thanks for your business.</p>
            <p>Track your shipment: <a href="https://slpmail.slpost.gov.lk/track/?code=${invoice.trackingId}" target="_blank">${invoice.trackingId}</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  const handleShareViaWhatsApp = (invoice: Invoice) => {
    const invoiceHTML = generateStyledInvoiceHTML(invoice)
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = invoiceHTML
    const text = tempDiv.textContent || tempDiv.innerText || ''
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleDownloadInvoice = (invoice: Invoice) => {
    const invoiceHTML = generateStyledInvoiceHTML(invoice)
    const blob = new Blob([invoiceHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Invoice-${invoice.invoiceNo}.html`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Invoice downloaded')
  }

  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Paid' })
      })
      if (res.ok) {
        toast.success('Payment status updated')
        fetchInvoices()
      } else {
        toast.error('Failed to update')
      }
    } catch (error) {
      toast.error('Failed to update')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <div className="flex space-x-3">
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {[2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="all">All Batches</option>
            <option value="2028 AL">2028 AL</option>
            <option value="2027 AL">2027 AL</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Total Invoices</p>
          <p className="text-2xl font-bold">{invoices.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Paid Amount</p>
          <p className="text-2xl font-bold text-green-600">
            LKR {invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.totalAmount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Pending Amount</p>
          <p className="text-2xl font-bold text-yellow-600">
            LKR {invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.totalAmount, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4">Invoice No</th>
                  <th className="text-left py-3 px-4">Student</th>
                  <th className="text-left py-3 px-4">Batch</th>
                  <th className="text-left py-3 px-4">Month</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Tracking ID</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono">{invoice.invoiceNo}</td>
                    <td className="py-3 px-4">{invoice.studentName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                        {invoice.batch}
                      </span>
                    </td>
                    <td className="py-3 px-4">{invoice.month} {invoice.year}</td>
                    <td className="py-3 px-4">LKR {invoice.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs w-fit ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {invoice.status === 'Paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{invoice.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-sm">{invoice.trackingId}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownloadInvoice(invoice)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Download Invoice"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleShareViaWhatsApp(invoice)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Share via WhatsApp"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        {invoice.status === 'Pending' && (
                          <button
                            onClick={() => handleMarkAsPaid(invoice.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Mark as Paid"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
