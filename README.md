# Meal Planner for Elderly Care Homes

A digital meal ordering system built with **Payload CMS** to replace the manual paper-based workflow in elderly care homes. This application allows caregivers to capture meal preferences digitally, and kitchen staff to view aggregated ingredient needs and track meal preparation progress.

## Features

- **Digital Meal Orders**: Replace paper forms with a digital ordering system for breakfast, lunch, and dinner
- **Role-Based Access Control**: Three user roles (Admin, Caregiver, Kitchen) with appropriate permissions
- **Kitchen Dashboard**: Aggregated ingredient view for meal planning
- **Quick Status Toggle**: Kitchen staff can mark orders as prepared directly from the list view
- **Historical Data**: All orders are stored for analytics and planning

## Quick Start with Docker

### Prerequisites
- [Docker](https://www.docker.com/get-started) and Docker Compose installed

### Running the Application

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd meal-planner
   ```

2. Create your environment file:
   ```bash
   cp .env.example .env
   ```

3. Start the application:
   ```bash
   docker-compose up
   ```

4. Open [http://localhost:3000/admin](http://localhost:3000/admin) in your browser

The seed script runs automatically on startup and creates sample data.

### Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `test` |
| Caregiver | `caregiver@example.com` | `test` |
| Kitchen | `kitchen@example.com` | `test` |

## Quick Start without Docker

### Prerequisites
- Node.js 18.20.2+ or 20.9.0+
- PostgreSQL database

### Running the Application

1. Clone and install dependencies:
   ```bash
   git clone <repository-url>
   cd meal-planner
   npm install
   ```

2. Create your environment file and configure the database:
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL connection string
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000/admin](http://localhost:3000/admin) in your browser

## Design Decisions

### Data Model

The data model consists of three main collections:

1. **Users** - Authentication with role-based access (admin, caregiver, kitchen)

2. **Residents** - Permanent resident information including:
   - Name, room number, table, station
   - Dietary restrictions
   - Aversions and notes

3. **Orders** - Meal orders with:
   - Date and meal type (breakfast, lunch, dinner)
   - Relationship to resident
   - Status tracking (pending/prepared)
   - Meal-specific fields in conditional groups that only appear for the selected meal type

The meal-specific fields are organized as **conditional groups** (`breakfast`, `lunch`, `dinner`) that only display when the corresponding meal type is selected. This keeps the UI clean and mirrors the structure of the original paper forms.

### Access Control

| Collection | Admin | Caregiver | Kitchen |
|------------|-------|-----------|---------|
| **Users** | Full access | Read own only | Read own only |
| **Residents** | Full access | Read only | Read only |
| **Orders** | Full access | Create, Read, Update | Read, Update status only |

**Field-level access for Orders:**
- Kitchen staff can only update the `status` field
- All other order fields (date, mealType, resident, meal details) are read-only for kitchen users

### Kitchen Dashboard

The Kitchen Dashboard (`/admin/kitchen-dashboard`) provides:

1. **Date and Meal Type Selection** - Filter orders by date and meal type
2. **Summary Card** - Shows total orders, pending, and prepared counts
3. **Aggregated Ingredients** - Groups all order items by category (Bread, Spreads, Beverages, etc.) with counts

### Quick Status Toggle

To improve kitchen workflow, a custom **StatusCell** component was added to the orders list view. This allows kitchen staff to toggle order status (pending ↔ prepared) with a single click directly from the list, without opening each order individually.

## Project Structure

```
src/
├── access/
│   └── roles.ts              # Access control helpers
├── collections/
│   ├── Users.ts              # User authentication & roles
│   ├── Residents.ts          # Resident information
│   └── Orders.ts             # Meal orders
├── components/
│   ├── KitchenDashboard/     # Custom dashboard view
│   ├── KitchenDashboardLink/ # Navigation link component
│   └── StatusCell/           # List view status toggle
├── seed/
│   └── index.ts              # Seed script for sample data
└── payload.config.ts         # Payload CMS configuration
```

## Tech Stack

- **Payload CMS** 3.65.0
- **Next.js** 15.4.7
- **PostgreSQL** (via @payloadcms/db-postgres)
- **React** 19.1.0
- **TypeScript** 5.7.3


