'use client'
import React from 'react'
import type { DefaultCellComponentProps } from 'payload'
import './styles.css'

const StatusCell: React.FC<DefaultCellComponentProps> = ({ cellData, rowData }) => {
  const [status, setStatus] = React.useState(cellData as string)
  const [isUpdating, setIsUpdating] = React.useState(false)

  const orderId = rowData?.id

  const toggleStatus = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!orderId) return
    
    setIsUpdating(true)
    try {
      const newStatus = status === 'pending' ? 'prepared' : 'pending'
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
        setStatus(newStatus)
      } else {
        console.error('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const isPending = status === 'pending'

  return (
    <div className="status-cell">
      <span className={`status-badge ${isPending ? 'pending' : 'prepared'}`}>
        {isPending ? 'Pending' : 'Prepared'}
      </span>
      <button
        onClick={toggleStatus}
        disabled={isUpdating}
        className={`status-toggle-btn ${isPending ? 'mark-prepared' : 'mark-pending'}`}
        title={isPending ? 'Mark as Prepared' : 'Mark as Pending'}
      >
        {isUpdating ? (
          <span className="spinner" />
        ) : isPending ? (
          '✓'
        ) : (
          '↩'
        )}
      </button>
    </div>
  )
}

export default StatusCell

