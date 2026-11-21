# SuperClinic & RxPOS

> **Unified Multi-Tenant Clinic HIS & Standalone Pharmacy POS SaaS Platform**

Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL 15+)** with strict **Row-Level Security (RLS)**.

---

## 🌟 Features Overview

### 1. Public Marketing Landing Page (`/`)
- **Interactive Dual Preview in Hero**: Live switch between Clinic HIS and Pharmacy POS views.
- **Dedicated Standalone Pharmacy Store Owner Section**: Explicitly marketed for independent retail chemist & pharmacy shop owners (inventory, expiry tracking, walk-in billing counter, and monthly turnover/profit charts).
- **Features Showcase**: Tabbed comparison of Clinic HIS, Standalone Pharmacy POS, and the zero-coupling QR token bridge.
- **Transparent Pricing**: Monthly/Annual toggle featuring the dedicated **$49/mo Standalone Pharmacy POS** tier, Clinic Starter ($29/mo), Clinic Pro ($79/mo), and Complete Healthcare Suite ($109/mo).
- **Interactive FAQ & About Sections**: Highlighting PostgreSQL RLS isolation, HIPAA/GDPR audit logging, and ESC/POS thermal printer compatibility.
- **1-Click Test Persona Switcher**: Instant access to pre-seeded roles (`Dr. Smith`, `Alex Pharmacist`, `Emily Receptionist`).

---

### 2. Clinic HIS Portal (`/clinic`)
- **Smart Queue & Token Manager**: Live OPD tokens, automated emergency priority bumping (promotes critical patients to Token #1 with audible/visual alerts), and walk-in patient intake.
- **Patient EMR Directory**: Tabbed medical records with vitals (height, weight, BP, blood group), chronic conditions, and allergy warnings loaded live from Supabase.
- **Digital Prescriptions with ICD-10 Search**: Form with validated ICD-10 search codes (`J06.9`, `E11.9`, `I10`), medication schedule, advice, and printable PDF prescription with doctor signature block.
- **Auto-Generated Dispense Token**: Automatically generates a secure, de-identified QR/UUID token for external pharmacy dispensing without database coupling.
- **Fee Collection & Invoicing**: Record consultation charges via UPI/Cash/Card and print branded receipts.
- **WhatsApp Delay Broadcast Simulator**: Send bulk announcements to all waiting patients when emergencies cause OPD delays.
- **Financial & Footfall Analytics**: Daily collections and payment method distributions.

---

### 3. Standalone Pharmacy POS Portal (`/pharmacy`)
- **Rapid Walk-in POS Billing Counter**:
  - Live medicine search with barcode/SKU scanner simulation.
  - Interactive cart with strip/tablet quantity adjusters, discount percentages, tax calculation, and Grand Total.
  - Cash, UPI, and Card checkout with thermal receipt / A4 print modal.
  - **Atomic stock decrement**: Sales automatically decrement stock levels in real time.
- **Stock & Batch Inventory**: Live stock levels, batch numbers, cost prices, selling MRP, and low-stock reorder alert badges.
- **Expiry Date Guardian**: Expiry tracker preventing expired medicines from being rung up at the counter with 30/60/90-day alert thresholds.
- **Monthly Turnover & Profit Analytics**: Monthly sales totals, Cost of Goods (COGS), and gross profit margins.
- **Prescription Token Fulfillment Bridge**:
  - Enter or scan the clinic prescription token UUID.
  - Securely inspects the medication snapshot without accessing the clinic's private EMR database.
  - 1-Click "Load into POS Cart & Dispense" to fulfill prescriptions without any database coupling.

---

## 📁 Repository Structure

```
superclinic/
├── backend/                   # Node.js / Express API Architecture
│   ├── src/
│   │   ├── middleware/        # Supabase Auth, Tenant Isolation, RBAC & EMR Audit Logger
│   │   ├── routes/            # Clinic HIS, Pharmacy POS, and WhatsApp Webhooks
│   │   ├── types/             # TypeScript definitions
│   │   └── server.ts          # Server entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/                  # Next.js 14 App Router Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx       # Public Marketing Landing Page
│   │   │   ├── clinic/        # Clinic HIS Portal
│   │   │   └── pharmacy/      # Standalone Pharmacy POS Portal
│   │   ├── components/        # UI Components (Hero, Navbar, Pricing, FAQ, etc.)
│   │   ├── lib/               # Supabase Client & Service Role helpers
│   │   └── types/             # Frontend Types
│   ├── .env.example
│   └── package.json
│
└── supabase/                  # Database Migrations & Seeds
    ├── migrations/
    │   └── 20261112000000_init_schema.sql  # Complete PostgreSQL DDL, RLS & Triggers
    └── seed.sql               # Seed data for Clinic & Pharmacy Tenants
```

---

## 🚀 Getting Started

### 1. Database Setup (Supabase)
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Run [`supabase/migrations/20261112000000_init_schema.sql`](supabase/migrations/20261112000000_init_schema.sql).
4. Run [`supabase/seed.sql`](supabase/seed.sql) to populate sample tenants, patients, and pharmacy inventory.

### 2. Configure Environment Variables

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

**Backend (`backend/.env`):**
```env
PORT=4000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Tenant Isolation

- **Row-Level Security (RLS)**: Enforced directly at the PostgreSQL engine level.
- **Tenant Type Separation**: `clinic` tenants cannot access pharmacy tables; `pharmacy` tenants cannot access clinic EMR records.
- **Cryptographic Prescription Bridge**: Pharmacies fulfill clinic prescriptions via an isolated UUID token (`prescription_dispense_tokens`) containing a medication snapshot, preventing any cross-tenant database leakage.

---

## 📄 License
MIT
