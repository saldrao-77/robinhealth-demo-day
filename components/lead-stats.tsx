"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"

export function LeadStats() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processed: 0,
    mri: 0,
    ct: 0,
    xray: 0,
    ultrasound: 0,
    other: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all submissions
        const { data, error } = await supabase.from("lead_submissions").select("*")

        if (error) {
          throw error
        }

        // Calculate stats
        const submissions = data || []
        const pending = submissions.filter((sub) => !sub.processed).length
        const processed = submissions.filter((sub) => sub.processed).length
        const mri = submissions.filter((sub) => sub.imaging_type === "mri").length
        const ct = submissions.filter((sub) => sub.imaging_type === "ct").length
        const xray = submissions.filter((sub) => sub.imaging_type === "xray").length
        const ultrasound = submissions.filter((sub) => sub.imaging_type === "ultrasound").length
        const other = submissions.length - mri - ct - xray - ultrasound

        setStats({
          total: submissions.length,
          pending,
          processed,
          mri,
          ct,
          xray,
          ultrasound,
          other,
        })
      } catch (err) {
        console.error("Error fetching stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="p-4 bg-gray-50 rounded-lg">Loading stats...</div>
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Lead Submission Stats</h3>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Submissions</dt>
              <dd className="mt-1 text-3xl font-semibold text-blue-600">{stats.total}</dd>
            </div>
          </div>

          <div className="bg-yellow-50 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
              <dd className="mt-1 text-3xl font-semibold text-yellow-600">{stats.pending}</dd>
            </div>
          </div>

          <div className="bg-green-50 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Processed</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">{stats.processed}</dd>
            </div>
          </div>
        </div>

        <h4 className="text-md leading-6 font-medium text-gray-700 mt-6 mb-3">By Imaging Type</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-gray-50 p-3 rounded-md text-center">
            <div className="text-sm font-medium text-gray-500">MRI</div>
            <div className="text-xl font-semibold text-gray-700">{stats.mri}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md text-center">
            <div className="text-sm font-medium text-gray-500">CT</div>
            <div className="text-xl font-semibold text-gray-700">{stats.ct}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md text-center">
            <div className="text-sm font-medium text-gray-500">X-Ray</div>
            <div className="text-xl font-semibold text-gray-700">{stats.xray}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md text-center">
            <div className="text-sm font-medium text-gray-500">Ultrasound</div>
            <div className="text-xl font-semibold text-gray-700">{stats.ultrasound}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md text-center">
            <div className="text-sm font-medium text-gray-500">Other</div>
            <div className="text-xl font-semibold text-gray-700">{stats.other}</div>
          </div>
        </div>
      </div>
    </div>
  \
}
}
