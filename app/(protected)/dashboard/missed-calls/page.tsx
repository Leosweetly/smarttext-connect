'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Search, Filter, ArrowUpDown, Phone, PhoneMissed } from 'lucide-react'
import Link from 'next/link'

// Sample missed calls data
const sampleMissedCalls = [
  {
    id: 1,
    phoneNumber: '(555) 123-4567',
    date: 'Today',
    time: '2:30 PM',
    duration: '0:15',
    status: 'Not Called Back'
  },
  {
    id: 2,
    phoneNumber: '(555) 987-6543',
    date: 'Today',
    time: '11:15 AM',
    duration: '0:32',
    status: 'Not Called Back'
  },
  {
    id: 3,
    phoneNumber: '(555) 456-7890',
    date: 'Yesterday',
    time: '4:45 PM',
    duration: '0:08',
    status: 'Not Called Back'
  },
  {
    id: 4,
    phoneNumber: '(555) 234-5678',
    date: 'Yesterday',
    time: '1:20 PM',
    duration: '0:22',
    status: 'Called Back'
  },
  {
    id: 5,
    phoneNumber: '(555) 876-5432',
    date: '2 days ago',
    time: '3:10 PM',
    duration: '0:45',
    status: 'Called Back'
  }
]

export default function MissedCalls() {
  const { user, business, isLoading } = useAuth()
  const [missedCalls, setMissedCalls] = useState(sampleMissedCalls)
  const [searchQuery, setSearchQuery] = useState('')

  // Function to handle marking a call as called back
  const handleCallBack = (id: number) => {
    setMissedCalls(missedCalls.map(call => 
      call.id === id ? { ...call, status: 'Called Back' } : call
    ))
  }

  // Show loading state while checking auth
  if (isLoading || !business) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading missed calls...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Missed Calls</h1>
          <p className="text-gray-600">Track and follow up on missed customer calls</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search phone numbers..." 
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Filter size={16} className="mr-2" />
          Filter
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {missedCalls.length === 0 ? (
          <div className="p-6 text-center">
            <PhoneMissed className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No missed calls</h3>
            <p className="mt-1 text-sm text-gray-500">When you miss a call, it will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left p-4 text-gray-500 font-medium text-sm">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Phone Number</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th className="text-left p-4 text-gray-500 font-medium text-sm">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Date & Time</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th className="text-left p-4 text-gray-500 font-medium text-sm">Duration</th>
                  <th className="text-left p-4 text-gray-500 font-medium text-sm">Status</th>
                  <th className="text-right p-4 text-gray-500 font-medium text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {missedCalls.map((call) => (
                  <tr key={call.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-900 font-medium">{call.phoneNumber}</td>
                    <td className="p-4 text-gray-500">
                      {call.date}, {call.time}
                    </td>
                    <td className="p-4 text-gray-500">{call.duration}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        call.status === 'Called Back' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {call.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleCallBack(call.id)}
                        disabled={call.status === 'Called Back'}
                        className={`inline-flex items-center px-3 py-1 border rounded-md text-sm font-medium ${
                          call.status === 'Called Back' 
                            ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                            : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <Phone size={16} className="mr-1" />
                        {call.status === 'Called Back' ? 'Called' : 'Call Back'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
