"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Search, Check, X, Edit, Save, RefreshCw, Download, Trash2, Plus, Info } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

// Define the lead submission type
type LeadSubmission = {
  id: number
  zip_code: string
  phone: string
  imaging_type: string
  body_part: string | null
  has_order: boolean | null
  full_name: string | null
  created_at: string
  processed: boolean
  engaged: boolean
  notes: string | null
  utm_source: string | null
}

// Define status type for better type safety
type SubmissionStatus = "pending" | "processed" | "engaged"

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<LeadSubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<LeadSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | SubmissionStatus>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editNotes, setEditNotes] = useState<string>("")
  const [editStatus, setEditStatus] = useState<SubmissionStatus>("pending")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [showNewRowForm, setShowNewRowForm] = useState(false)
  const [newSubmission, setNewSubmission] = useState({
    zip_code: "",
    phone: "",
    imaging_type: "mri",
    body_part: "",
    has_order: false,
    full_name: "",
    status: "pending" as SubmissionStatus,
    notes: "",
    utm_source: "",
  })
  const [latestSubmissions, setLatestSubmissions] = useState<LeadSubmission[]>([])
  const [showLatestInfo, setShowLatestInfo] = useState(false)

  // Fetch submissions from Supabase
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch ALL submissions
        const { data, error } = await supabase
          .from("lead_submissions")
          .select("*")
          .order("created_at", { ascending: sortDirection === "asc" })

        if (error) {
          throw error
        }

        // Ensure engaged field exists (for backward compatibility)
        const processedData = (data || []).map((submission) => ({
          ...submission,
          engaged: submission.engaged === undefined ? false : submission.engaged,
        }))

        setSubmissions(processedData)
        setFilteredSubmissions(processedData)

        // Get the latest two submissions for debugging
        const sortedData = [...processedData].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        setLatestSubmissions(sortedData.slice(0, 2))
      } catch (err) {
        console.error("Error fetching submissions:", err)
        setError(err instanceof Error ? err.message : "An error occurred while fetching submissions")
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [refreshTrigger, sortDirection])

  // Helper function to determine submission status
  const getSubmissionStatus = (submission: LeadSubmission): SubmissionStatus => {
    if (submission.engaged) return "engaged"
    if (submission.processed) return "processed"
    return "pending"
  }

  // Filter submissions based on search term and filters
  useEffect(() => {
    let filtered = [...submissions]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (sub) =>
          sub.zip_code.toLowerCase().includes(term) ||
          sub.phone.toLowerCase().includes(term) ||
          sub.imaging_type.toLowerCase().includes(term) ||
          (sub.body_part && sub.body_part.toLowerCase().includes(term)) ||
          (sub.notes && sub.notes.toLowerCase().includes(term)),
      )
    }

    // Apply status filter
    if (filterStatus !== "all") {
      if (filterStatus === "engaged") {
        filtered = filtered.filter((sub) => sub.engaged)
      } else if (filterStatus === "processed") {
        filtered = filtered.filter((sub) => sub.processed && !sub.engaged)
      } else {
        filtered = filtered.filter((sub) => !sub.processed && !sub.engaged)
      }
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((sub) => sub.imaging_type === filterType)
    }

    // Apply date range filter
    if (startDate) {
      const startDateTime = new Date(startDate + "T00:00:00")
      filtered = filtered.filter((sub) => {
        const subDate = new Date(sub.created_at)
        return subDate >= startDateTime
      })
    }

    if (endDate) {
      const endDateTime = new Date(endDate + "T23:59:59")
      filtered = filtered.filter((sub) => {
        const subDate = new Date(sub.created_at)
        return subDate <= endDateTime
      })
    }

    setFilteredSubmissions(filtered)
  }, [submissions, searchTerm, filterStatus, filterType, startDate, endDate])

  // Get unique imaging types for filter dropdown
  const imagingTypes = ["all", ...new Set(submissions.map((sub) => sub.imaging_type))]

  // Calculate stats
  const stats = {
    total: submissions.length,
    pending: submissions.filter((sub) => !sub.processed && !sub.engaged).length,
    processed: submissions.filter((sub) => sub.processed && !sub.engaged).length,
    engaged: submissions.filter((sub) => sub.engaged).length,
  }

  // Handle cycling through status
  const cycleStatus = async (id: number, currentStatus: SubmissionStatus) => {
    try {
      let newStatus: SubmissionStatus
      let processed: boolean
      let engaged: boolean

      // Cycle through: pending -> processed -> engaged -> pending
      if (currentStatus === "pending") {
        newStatus = "processed"
        processed = true
        engaged = false
      } else if (currentStatus === "processed") {
        newStatus = "engaged"
        processed = true
        engaged = true
      } else {
        newStatus = "pending"
        processed = false
        engaged = false
      }

      const { error } = await supabase.from("lead_submissions").update({ processed, engaged }).eq("id", id)

      if (error) {
        throw error
      }

      // Update local state
      setSubmissions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, processed, engaged } : sub)))
    } catch (err) {
      console.error("Error updating status:", err)
      alert("Failed to update status. Please try again.")
    }
  }

  // Handle saving notes and status
  const saveNotes = async (id: number) => {
    try {
      // Convert status to processed/engaged flags
      const processed = editStatus === "processed" || editStatus === "engaged"
      const engaged = editStatus === "engaged"

      const { error } = await supabase
        .from("lead_submissions")
        .update({
          notes: editNotes,
          processed,
          engaged,
        })
        .eq("id", id)

      if (error) {
        throw error
      }

      // Update local state
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, notes: editNotes, processed, engaged } : sub)),
      )
      setEditingId(null)
    } catch (err) {
      console.error("Error updating submission:", err)
      alert("Failed to update submission. Please try again.")
    }
  }

  // Handle deleting a record
  const deleteRecord = async (id: number) => {
    try {
      const { error } = await supabase.from("lead_submissions").delete().eq("id", id)

      if (error) {
        throw error
      }

      // Update local state
      setSubmissions((prev) => prev.filter((sub) => sub.id !== id))
      setDeleteConfirmId(null)
    } catch (err) {
      console.error("Error deleting record:", err)
      alert("Failed to delete record. Please try again.")
    }
  }

  // Handle creating a new submission
  const createNewSubmission = async () => {
    try {
      // Validate required fields
      if (!newSubmission.zip_code || !newSubmission.phone || !newSubmission.imaging_type) {
        alert("Please fill in all required fields (ZIP code, phone, and imaging type).")
        return
      }

      // Format phone number (remove non-digits)
      const formattedPhone = newSubmission.phone.replace(/\D/g, "")

      // Convert status to processed/engaged flags
      const processed = newSubmission.status === "processed" || newSubmission.status === "engaged"
      const engaged = newSubmission.status === "engaged"

      const { data, error } = await supabase
        .from("lead_submissions")
        .insert([
          {
            zip_code: newSubmission.zip_code,
            phone: formattedPhone,
            imaging_type: newSubmission.imaging_type,
            body_part: newSubmission.body_part || null,
            has_order: newSubmission.has_order,
            full_name: newSubmission.full_name || null,
            processed,
            engaged,
            notes: newSubmission.notes || null,
            utm_source: newSubmission.utm_source || null,
          },
        ])
        .select()

      if (error) {
        throw error
      }

      // Reset form and hide it
      setNewSubmission({
        zip_code: "",
        phone: "",
        imaging_type: "mri",
        body_part: "",
        has_order: false,
        full_name: "",
        status: "pending",
        notes: "",
        utm_source: "",
      })
      setShowNewRowForm(false)

      // Refresh data
      setRefreshTrigger((prev) => prev + 1)
    } catch (err) {
      console.error("Error creating submission:", err)
      alert("Failed to create submission. Please try again.")
    }
  }

  // Format phone number for display
  const formatPhone = (phone: string) => {
    if (phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`
    }
    return phone
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Check if a submission is recent (within the last hour)
  const isRecent = (dateString: string) => {
    const submissionDate = new Date(dateString)
    const now = new Date()
    const diffInMinutes = (now.getTime() - submissionDate.getTime()) / (1000 * 60)
    return diffInMinutes < 60
  }

  // Export submissions to CSV
  const exportToCSV = () => {
    // Define CSV headers
    const headers = [
      "ID",
      "Zip Code",
      "Phone",
      "Full Name",
      "Imaging Type",
      "Body Part",
      "Has Order",
      "UTM Source",
      "Created At",
      "Status",
      "Notes",
    ]

    // Convert submissions to CSV rows
    const csvRows = [
      headers.join(","),
      ...filteredSubmissions.map((sub) => {
        const status = getSubmissionStatus(sub)
        return [
          sub.id,
          sub.zip_code,
          sub.phone,
          sub.full_name || "",
          sub.imaging_type,
          sub.body_part || "",
          sub.has_order === null ? "" : sub.has_order ? "Yes" : "No",
          sub.utm_source || "",
          new Date(sub.created_at).toLocaleString(),
          status.charAt(0).toUpperCase() + status.slice(1),
          sub.notes ? `"${sub.notes.replace(/"/g, '""')}"` : "",
        ].join(",")
      }),
    ]

    // Create CSV content
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n")

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `lead-submissions-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)

    // Trigger download
    link.click()
    document.body.removeChild(link)
  }

  // Get status badge color
  const getStatusBadgeColor = (status: SubmissionStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processed":
        return "bg-green-100 text-green-800"
      case "engaged":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get row background color based on status
  const getRowBackgroundColor = (status: SubmissionStatus, isRecentSubmission: boolean, is1107Submission: boolean) => {
    if (is1107Submission) return "bg-blue-100"
    if (isRecentSubmission) return ""

    switch (status) {
      case "pending":
        return ""
      case "processed":
        return "bg-green-50"
      case "engaged":
        return "bg-purple-50"
      default:
        return ""
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Lead Submissions Dashboard</h1>
            <div className="flex gap-1">
              <button
                onClick={() => setSortDirection(sortDirection === "desc" ? "asc" : "desc")}
                className="flex items-center gap-1 bg-purple-50 text-purple-600 px-2 py-1 rounded text-xs font-medium hover:bg-purple-100"
              >
                {sortDirection === "desc" ? "Newest First" : "Oldest First"}
              </button>
              <button
                onClick={() => setRefreshTrigger((prev) => prev + 1)}
                className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-medium hover:bg-blue-100"
              >
                <RefreshCw size={14} />
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded text-xs font-medium hover:bg-green-100"
              >
                <Download size={14} />
                Export
              </button>
              <button
                onClick={() => setShowNewRowForm(true)}
                className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-blue-700"
              >
                <Plus size={14} />
                Add New
              </button>
              <button
                onClick={() => setShowLatestInfo(!showLatestInfo)}
                className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2 py-1 rounded text-xs font-medium hover:bg-yellow-100"
              >
                <Info size={14} />
                Latest
              </button>
            </div>
          </div>

          {/* Latest Submissions Info */}
          {showLatestInfo && latestSubmissions.length > 0 && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-2">Latest 2 Submissions</h3>
              <div className="space-y-4">
                {latestSubmissions.map((sub, index) => (
                  <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p>
                          <strong>ID:</strong> {sub.id}
                        </p>
                        <p>
                          <strong>Created:</strong> {formatDate(sub.created_at)}
                        </p>
                        <p>
                          <strong>ZIP:</strong> {sub.zip_code}
                        </p>
                        <p>
                          <strong>Phone:</strong> {formatPhone(sub.phone)}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Type:</strong> {sub.imaging_type}
                        </p>
                        <p>
                          <strong>Body Part:</strong> {sub.body_part || "N/A"}
                        </p>
                        <p>
                          <strong>Has Order:</strong>{" "}
                          {sub.has_order === null ? "Unknown" : sub.has_order ? "Yes" : "No"}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(getSubmissionStatus(sub))}`}
                          >
                            {getSubmissionStatus(sub).charAt(0).toUpperCase() + getSubmissionStatus(sub).slice(1)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className="mt-2">
                      <strong>Notes:</strong> {sub.notes || "No notes"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Raw timestamp: {sub.created_at}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* New Row Form */}
          {showNewRowForm && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Add New Submission</h2>
                <button onClick={() => setShowNewRowForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="zip_code"
                    className="block w-full border border-gray-300 rounded-md p-2"
                    value={newSubmission.zip_code}
                    onChange={(e) => setNewSubmission({ ...newSubmission, zip_code: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="phone"
                    className="block w-full border border-gray-300 rounded-md p-2"
                    value={newSubmission.phone}
                    onChange={(e) => setNewSubmission({ ...newSubmission, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="imaging_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Imaging Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="imaging_type"
                    className="block w-full border border-gray-300 rounded-md p-2"
                    value={newSubmission.imaging_type}
                    onChange={(e) => setNewSubmission({ ...newSubmission, imaging_type: e.target.value })}
                    required
                  >
                    <option value="mri">MRI</option>
                    <option value="ct">CT</option>
                    <option value="xray">X-Ray</option>
                    <option value="ultrasound">Ultrasound</option>
                    <option value="pet">PET</option>
                    <option value="mammography">Mammography</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="body_part" className="block text-sm font-medium text-gray-700 mb-1">
                    Body Part
                  </label>
                  <input
                    type="text"
                    id="body_part"
                    className="block w-full border border-gray-300 rounded-md p-2"
                    value={newSubmission.body_part}
                    onChange={(e) => setNewSubmission({ ...newSubmission, body_part: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="has_order" className="block text-sm font-medium text-gray-700 mb-1">
                    Has Order
                  </label>
                  <select
                    id="has_order"
                    className="block w-full border border-gray-300 rounded-md p-2"
                    value={newSubmission.has_order ? "yes" : "no"}
                    onChange={(e) => setNewSubmission({ ...newSubmission, has_order: e.target.value === "yes" })}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    className="block w-full border border-gray-300 rounded-md p-2"
                    value={newSubmission.full_name || ""}
                    onChange={(e) => setNewSubmission({ ...newSubmission, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="utm_source" className="block text-sm font-medium text-gray-700 mb-1">
                    UTM Source
                  </label>
                  <input
                    type="text"
                    id="utm_source"
                    className="block w-full border border-gray-300 rounded-md p-2"
                    value={newSubmission.utm_source || ""}
                    onChange={(e) => setNewSubmission({ ...newSubmission, utm_source: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    className="block w-full border border-gray-300 rounded-md p-2"
                    value={newSubmission.status}
                    onChange={(e) => setNewSubmission({ ...newSubmission, status: e.target.value as SubmissionStatus })}
                  >
                    <option value="pending">Pending</option>
                    <option value="processed">Processed</option>
                    <option value="engaged">Engaged</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    className="block w-full border border-gray-300 rounded-md p-2"
                    rows={3}
                    value={newSubmission.notes}
                    onChange={(e) => setNewSubmission({ ...newSubmission, notes: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={createNewSubmission}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Submission
                </button>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
              {/* Search */}
              <div className="md:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search by zip, phone, type, body part..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status-filter"
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as "all" | SubmissionStatus)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processed">Processed</option>
                  <option value="engaged">Engaged</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Imaging Type
                </label>
                <select
                  id="type-filter"
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  {imagingTypes
                    .filter((type) => type !== "all")
                    .map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                </select>
              </div>

              {/* Date Range Filter */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-500">Total: {stats.total}</div>
                <div className="text-sm text-gray-500">Pending: {stats.pending}</div>
                <div className="text-sm text-gray-500">Processed: {stats.processed}</div>
                <div className="text-sm text-gray-500">Engaged: {stats.engaged}</div>
              </div>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading submissions...</p>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No submissions found matching your criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Contact Info
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Full Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Imaging Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        UTM Source
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Notes
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubmissions.map((submission) => {
                      const isRecentSubmission = isRecent(submission.created_at)
                      const submissionDate = new Date(submission.created_at)
                      const is1107Submission =
                        submissionDate.getHours() === 11 &&
                        submissionDate.getMinutes() === 7 &&
                        submissionDate.getDate() === new Date().getDate()
                      const status = getSubmissionStatus(submission)

                      return (
                        <tr
                          key={submission.id}
                          className={getRowBackgroundColor(status, isRecentSubmission, is1107Submission)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {submission.id}
                            {is1107Submission && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                New 11:07am
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm text-gray-900">ZIP: {submission.zip_code}</div>
                                <div className="text-sm text-gray-500">Phone: {formatPhone(submission.phone)}</div>
                                <div className="text-sm text-gray-500">{formatDate(submission.created_at)}</div>
                              </div>
                              <div className="ml-2">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(status)}`}
                                >
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{submission.full_name || "Not provided"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              Type: {submission.imaging_type.charAt(0).toUpperCase() + submission.imaging_type.slice(1)}
                            </div>
                            <div className="text-sm text-gray-500">
                              Body Part: {submission.body_part || "Not specified"}
                            </div>
                            <div className="text-sm text-gray-500">
                              Has Order:{" "}
                              {submission.has_order === null ? "Unknown" : submission.has_order ? "Yes" : "No"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{submission.utm_source || ""}</div>
                          </td>
                          <td className="px-6 py-4">
                            {editingId === submission.id ? (
                              <div className="space-y-3">
                                <div>
                                  <label
                                    htmlFor={`status-${submission.id}`}
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                  >
                                    Status
                                  </label>
                                  <select
                                    id={`status-${submission.id}`}
                                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value as SubmissionStatus)}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="processed">Processed</option>
                                    <option value="engaged">Engaged</option>
                                  </select>
                                </div>
                                <div>
                                  <label
                                    htmlFor={`notes-${submission.id}`}
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                  >
                                    Notes
                                  </label>
                                  <textarea
                                    id={`notes-${submission.id}`}
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    rows={3}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500 max-w-xs break-words">
                                {submission.notes || "No notes"}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {editingId === submission.id ? (
                                <>
                                  <button
                                    onClick={() => saveNotes(submission.id)}
                                    className="text-green-600 hover:text-green-900"
                                    title="Save changes"
                                  >
                                    <Save className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="text-red-600 hover:text-red-900"
                                    title="Cancel editing"
                                  >
                                    <X className="h-5 w-5" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingId(submission.id)
                                      setEditNotes(submission.notes || "")
                                      setEditStatus(status)
                                    }}
                                    className="text-blue-600 hover:text-blue-900"
                                    title="Edit submission"
                                  >
                                    <Edit className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => cycleStatus(submission.id, status)}
                                    className="text-purple-600 hover:text-purple-900"
                                    title={`Change status (currently ${status})`}
                                  >
                                    {status === "pending" ? (
                                      <Check className="h-5 w-5" />
                                    ) : status === "processed" ? (
                                      <Check className="h-5 w-5 text-green-600" />
                                    ) : (
                                      <X className="h-5 w-5" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(submission.id)}
                                    className="text-red-600 hover:text-red-900"
                                    title="Delete record"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                </>
                              )}
                            </div>
                            {deleteConfirmId === submission.id && (
                              <div className="mt-2 bg-red-50 p-2 rounded-md">
                                <p className="text-xs text-red-700 mb-1">Delete this record?</p>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => deleteRecord(submission.id)}
                                    className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                  >
                                    Yes
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300"
                                  >
                                    No
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
