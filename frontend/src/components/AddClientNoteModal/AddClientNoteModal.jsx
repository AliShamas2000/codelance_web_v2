import React, { useState, useEffect } from 'react'
import Modal from '../Modal/Modal'
import barberApi from '../../api/barber'

const AddClientNoteModal = ({
  isOpen = false,
  onClose,
  onSave,
  client = null,
  isLoading = false,
  className = ""
}) => {
  const [notes, setNotes] = useState('')
  const [lastEdited, setLastEdited] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isOpen && client) {
      // Fetch current notes when modal opens
      fetchClientNotes()
    }
  }, [isOpen, client])

  const fetchClientNotes = async () => {
    if (!client?.id) return
    
    try {
      // Pass phone number as parameter
      const params = client?.phone ? { phone: client.phone } : {}
      const response = await barberApi.getClientNotes(client.id, params)
      // API returns {success: true, data: {notes: ...}}
      const notesData = response.data || response
      setNotes(notesData.notes || client.notes || '')
      setLastEdited(notesData.last_edited || notesData.lastEdited || client.notesLastEdited || null)
    } catch (error) {
      console.error('Error fetching client notes:', error)
      // Use client notes if available
      setNotes(client.notes || '')
      setLastEdited(client.notesLastEdited || null)
    }
  }

  const handleSave = async () => {
    if (!client?.id) return

    setIsSaving(true)
    try {
      // Pass phone number along with notes
      const updateData = { notes }
      if (client?.phone) {
        updateData.phone = client.phone
      }
      const data = await barberApi.updateClientNotes(client.id, updateData)
      // Update last edited timestamp
      setLastEdited(new Date().toISOString())
      
      if (onSave) {
        onSave(client.id, { notes, lastEdited: new Date().toISOString() })
      }
      onClose()
    } catch (error) {
      console.error('Error saving notes:', error)
      alert('Failed to save notes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const formatLastEdited = (dateString) => {
    if (!dateString) return null
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    } catch (error) {
      return null
    }
  }

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Client Notes"
      maxWidth="max-w-lg"
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSaving || isLoading}
            className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="px-5 py-2.5 rounded-xl bg-primary text-[#111816] font-bold shadow-lg shadow-primary/20 hover:bg-[#0fb37d] transition-colors text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#111816]"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Save Notes</span>
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 -mx-6 -mt-6 mb-0">
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          For <span className="font-semibold text-gray-900 dark:text-gray-200">{client?.name || 'Unknown Client'}</span>
        </p>
      </div>
      
      <div className="p-6">
        <label 
          htmlFor="client-notes" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Private Barber Notes
        </label>
        <div className="relative">
          <textarea
            id="client-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full min-h-[180px] p-4 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-sm focus:border-primary focus:ring-primary dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none shadow-inner transition-colors"
            placeholder="Enter preferences, hair type details, conversation topics, or any specific notes for the next visit..."
          />
          {lastEdited && (
            <div className="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none">
              Last edited: {formatLastEdited(lastEdited)}
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <span className="material-symbols-outlined text-[14px]">info</span>
          </span>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            These notes are private and only visible to staff.
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default AddClientNoteModal

