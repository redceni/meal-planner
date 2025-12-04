'use client'

import React, { useState, useEffect } from 'react'
import './styles.css'

type Order = {
  id: string
  date: string
  mealType: 'breakfast' | 'lunch' | 'dinner'
  status: 'pending' | 'prepared'
  highCalorie?: boolean
  aversions?: string
  notes?: string
  breakfast?: {
    standardBreakfast?: boolean
    bread?: string[]
    puree?: boolean
    preparation?: string
    spreads?: string[]
    beverages?: string[]
    additions?: string[]
  }
  lunch?: {
    portionSize?: string
    soup?: boolean
    dessert?: boolean
    specialPreparation?: string[]
    restrictions?: string[]
  }
  dinner?: {
    standardDinner?: boolean
    bread?: string[]
    preparation?: string
    spreads?: string[]
    soup?: boolean
    puree?: boolean
    noFish?: boolean
    beverages?: string[]
    additions?: string[]
  }
}

const KitchenDashboard: React.FC = () => {
  const [date, setDate] = useState<string>('')
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setDate(new Date().toISOString().split('T')[0])
  }, [])

  useEffect(() => {
    if (!date) return

    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        // Create a range for the selected date to ensure we catch all orders for that day
        // regardless of the specific time stored in the DB.
        const startOfDay = `${date}T00:00:00.000Z`
        const endOfDay = `${date}T23:59:59.999Z`
        
        const query = `where[date][greater_than_equal]=${startOfDay}&where[date][less_than_equal]=${endOfDay}&where[mealType][equals]=${mealType}&limit=1000`
        
        console.log('Fetching orders with query:', query) // Debug log
        const res = await fetch(`/api/orders?${query}`)
        if (!res.ok) throw new Error('Failed to fetch orders')
        const data = await res.json()
        setOrders(data.docs)
      } catch (err) {
        console.error(err)
        setError('Error loading orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [date, mealType])

  const aggregateData = () => {
    const counts: Record<string, Record<string, number>> = {}

    const increment = (category: string, item: string) => {
      if (!counts[category]) counts[category] = {}
      if (!counts[category][item]) counts[category][item] = 0
      counts[category][item]++
    }

    orders.forEach(order => {
      if (order.highCalorie) increment('General', 'High Calorie')

      if (mealType === 'breakfast' && order.breakfast) {
        const b = order.breakfast
        if (b.standardBreakfast) increment('General', 'Standard Breakfast')
        if (b.puree) increment('General', 'Puree')
        if (b.preparation) increment('Preparation', b.preparation)
        b.bread?.forEach(i => increment('Bread', i))
        b.spreads?.forEach(i => increment('Spreads', i))
        b.beverages?.forEach(i => increment('Beverages', i))
        b.additions?.forEach(i => increment('Additions', i))
      }

      if (mealType === 'lunch' && order.lunch) {
        const l = order.lunch
        if (l.portionSize) increment('Portion', l.portionSize)
        if (l.soup) increment('General', 'Soup')
        if (l.dessert) increment('General', 'Dessert')
        l.specialPreparation?.forEach(i => increment('Special Prep', i))
        l.restrictions?.forEach(i => increment('Restrictions', i))
      }

      if (mealType === 'dinner' && order.dinner) {
        const d = order.dinner
        if (d.standardDinner) increment('General', 'Standard Dinner')
        if (d.soup) increment('General', 'Soup')
        if (d.puree) increment('General', 'Puree')
        if (d.noFish) increment('General', 'No Fish')
        if (d.preparation) increment('Preparation', d.preparation)
        d.bread?.forEach(i => increment('Bread', i))
        d.spreads?.forEach(i => increment('Spreads', i))
        d.beverages?.forEach(i => increment('Beverages', i))
        d.additions?.forEach(i => increment('Additions', i))
      }
    })

    return counts
  }

  const aggregated = aggregateData()

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Kitchen Dashboard</h1>
          <a 
            href="/admin/collections/orders"
            style={{
              padding: '8px 16px',
              backgroundColor: '#eee',
              textDecoration: 'none',
              borderRadius: '4px',
              color: '#333'
            }}
          >
            &larr; Back to Orders
          </a>
        </div>
      </div>

      <div className="dashboard-controls">
        <div className="control-group">
          <label>Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </div>
        <div className="control-group">
          <label>Meal Type</label>
          <select 
            value={mealType} 
            onChange={(e) => setMealType(e.target.value as any)}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>
        <div className="control-group" style={{ justifyContent: 'flex-end' }}>
          <button 
            onClick={() => {
              // Force re-fetch by toggling a dummy state or just calling a refresh function
              // For simplicity, we can just reset the date to trigger effect, or better:
              const current = date;
              setDate('');
              setTimeout(() => setDate(current), 10);
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: 'auto'
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && <div className="loading">Loading orders...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="dashboard-content">
          <div className="aggregation-card summary-card">
            <h3>Summary</h3>
            <div className="aggregation-list">
              <div className="aggregation-item">
                <span>Total Orders</span>
                <span className="count">{orders.length}</span>
              </div>
              <div className="aggregation-item">
                <span>Pending</span>
                <span className="count">{orders.filter(o => o.status === 'pending').length}</span>
              </div>
              <div className="aggregation-item">
                <span>Prepared</span>
                <span className="count">{orders.filter(o => o.status === 'prepared').length}</span>
              </div>
            </div>
          </div>

          {Object.entries(aggregated).map(([category, items]) => (
            <div key={category} className="aggregation-card">
              <h3>{category}</h3>
              <div className="aggregation-list">
                {Object.entries(items).map(([item, count]) => (
                  <div key={item} className="aggregation-item">
                    <span>{item}</span>
                    <span className="count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Special Notes Section */}
      {!loading && !error && orders.some(o => o.aversions || o.notes) && (
        <div className="notes-section">
          <h2>Special Notes & Aversions</h2>
          <div className="notes-list">
            {orders
              .filter(o => o.aversions || o.notes)
              .map(order => (
                <div key={order.id} className="note-card">
                  <div className="note-header">
                    <span className="note-order-id">Order #{String(order.id).slice(-6)}</span>
                    <span className={`note-status ${order.status}`}>{order.status}</span>
                  </div>
                  {order.aversions && (
                    <div className="note-item">
                      <strong>Dislikes:</strong> {order.aversions}
                    </div>
                  )}
                  {order.notes && (
                    <div className="note-item">
                      <strong>Notes:</strong> {order.notes}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default KitchenDashboard
