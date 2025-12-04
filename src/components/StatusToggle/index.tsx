'use client'
import React from 'react'

interface StatusToggleProps {
  orderId: string
  currentStatus: string
}

const StatusToggle: React.FC<StatusToggleProps> = ({ orderId, currentStatus }) => {
  const [isUpdating, setIsUpdating] = React.useState(false)

  const toggleStatus = async () => {
    setIsUpdating(true)
    try {
      const newStatus = currentStatus === 'pending' ? 'prepared' : 'pending'
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (res.ok) {
        window.location.reload()
      } else {
        alert('Failed to update status')
      }
    } catch (error) {
      alert('Error updating status')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <button
      onClick={toggleStatus}
      disabled={isUpdating}
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: currentStatus === 'pending' ? 'var(--theme-success-500)' : 'var(--theme-warning-500)',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '0.875rem',
        fontWeight: '600',
        cursor: isUpdating ? 'not-allowed' : 'pointer',
        opacity: isUpdating ? 0.6 : 1,
        transition: 'all 0.2s',
      }}
    >
      {isUpdating ? 'Updating...' : currentStatus === 'pending' ? 'Mark Prepared' : 'Mark Pending'}
    </button>
  )
}

export default StatusToggle
