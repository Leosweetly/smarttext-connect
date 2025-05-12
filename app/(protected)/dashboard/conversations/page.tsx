'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Search, Filter, Plus, MessageSquare } from 'lucide-react'
import Link from 'next/link'

// Sample conversation data
const sampleConversations = [
  {
    id: 1,
    name: 'John Smith',
    initials: 'JS',
    lastMessage: 'When will my car be ready?',
    time: '5m ago',
    unread: true
  },
  {
    id: 2,
    name: 'Amy Lee',
    initials: 'AL',
    lastMessage: 'I need to reschedule my appointment',
    time: '1h ago',
    unread: true
  },
  {
    id: 3,
    name: 'Tom Morgan',
    initials: 'TM',
    lastMessage: 'Do you have any openings today?',
    time: '3h ago',
    unread: false
  },
  {
    id: 4,
    name: 'Rita Kim',
    initials: 'RK',
    lastMessage: 'Thanks for the quick service',
    time: 'Yesterday',
    unread: false
  },
  {
    id: 5,
    name: 'Michael Johnson',
    initials: 'MJ',
    lastMessage: 'I have a question about my bill',
    time: 'Yesterday',
    unread: false
  },
  {
    id: 6,
    name: 'Sarah Williams',
    initials: 'SW',
    lastMessage: 'Can I get a quote for a new service?',
    time: '2 days ago',
    unread: false
  }
]

export default function Conversations() {
  const { user, business, isLoading } = useAuth()
  const [conversations, setConversations] = useState(sampleConversations)
  const [searchQuery, setSearchQuery] = useState('')

  // Show loading state while checking auth
  if (isLoading || !business) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading conversations...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Conversations</h1>
          <p className="text-gray-600">Manage and respond to customer messages</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Plus size={16} className="mr-2" />
          New Conversation
        </button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search conversations..." 
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
        <div className="divide-y divide-gray-100">
          {conversations.length === 0 ? (
            <div className="p-6 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No conversations</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new conversation.</p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  New Conversation
                </button>
              </div>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div 
                key={conversation.id} 
                className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${conversation.unread ? 'bg-blue-600' : 'bg-gray-500'}`}>
                  {conversation.initials}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${conversation.unread ? 'text-gray-900 font-semibold' : 'text-gray-900'}`}>
                      {conversation.name}
                    </h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {conversation.time}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${conversation.unread ? 'text-gray-900' : 'text-gray-500'}`}>
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unread && (
                  <div className="w-3 h-3 rounded-full bg-blue-600 flex-shrink-0"></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
