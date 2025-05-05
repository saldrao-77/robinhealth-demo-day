"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Send } from "lucide-react"

interface ChatPopupProps {
  isOpen: boolean
  onClose: () => void
  phoneNumber: string
}

export function ChatPopup({ isOpen, onClose, phoneNumber }: ChatPopupProps) {
  const [message, setMessage] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Focus input when popup opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      // Open SMS app with pre-filled message
      window.open(`sms:${phoneNumber}?body=${encodeURIComponent(message)}`, "_blank")
      setMessage("")
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-end justify-center md:items-center p-4">
      <div
        className="bg-white rounded-t-xl md:rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold text-lg">Chat with Robin Health</h3>
          <button onClick={onClose} className="text-white hover:bg-blue-700 rounded-full p-1">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 bg-blue-50">
          <p className="text-sm text-blue-800">
            Hi there! Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full border border-gray-300 rounded-md p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="flex justify-between items-center mt-4">
            <p className="text-xs text-gray-500">Message will be sent to {phoneNumber}</p>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Send size={16} />
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
