'use client'

import React from 'react'
import Link from 'next/link'

const KitchenDashboardLink: React.FC = () => {
  return (
    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
      <Link 
        href="/admin/kitchen-dashboard"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: 'var(--theme-elevation-500)',
          color: 'var(--theme-elevation-0)',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
        }}
      >
        Go to Kitchen Dashboard
      </Link>
    </div>
  )
}

export default KitchenDashboardLink
