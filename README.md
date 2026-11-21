# SuperClinic & Pharmacy Store

> **Unified Multi-Tenant Clinic HIS & Standalone Pharmacy Store SaaS Platform**

Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL 15+)** with strict **Row-Level Security (RLS)**.

---

## 🌟 Features Overview

### 1. Public Marketing Landing Page (`/`)
- **Interactive Dual Preview in Hero**: Live switch between Clinic HIS and Pharmacy Store views in ₹ INR.
- **Dedicated Standalone Pharmacy Store Owner Section**: Explicitly marketed for independent retail chemist & pharmacy shop owners (inventory, expiry tracking, walk-in billing counter in ₹, and monthly turnover/profit charts).
- **Features Showcase**: Tabbed comparison of Clinic HIS, Standalone Pharmacy Store, and the zero-coupling QR token bridge.
- **Transparent Pricing in ₹ INR**: Monthly/Annual toggle featuring the dedicated **₹2,499/mo Standalone Pharmacy Store** tier, Clinic Starter (₹1,999/mo), Clinic Pro (₹4,999/mo), and Complete Healthcare Suite (₹7,999/mo).
- **Interactive FAQ & About Sections**: Highlighting PostgreSQL RLS isolation, HIPAA/GDPR audit logging, and ESC/POS thermal printer compatibility.
- **Multi-Hospital & Multi-Pharmacy Portal Switcher**: Select from Apollo Hospital, City Health Clinic, Fortis Healthcare, Apex Care Pharmacy Store, MedPlus Chemist, or register a new organization!

---

### 2. Clinic HIS Portal (`/clinic`)
- **Reception Lobby Queue**: Live OPD queue tracking waiting patients with emergency priority elevation.
- **Doctor Cabin & Prescriptions**: Diagnostic editor with validated ICD-10 search (`J06.9`, `E11.9`, `I10`), medication schedule with Indian medicines (Dolo 650, Augmentin 625, Pan 40), and doctor advice.
- **Dual Fee Collection Routing (Requirement 6)**:
  - **Option A (Collect in Cabin)**: Doctor collects consultation fee (₹500) directly in the cabin via UPI/Cash and completes consult.
  - **Option B (Send to Reception Desk)**: Doctor routes the patient to the Reception Desk, where the receptionist collects the pending fee and issues the receipt!
- **Consultation History Ledger (Requirement 5)**:
  - Once consultation is completed, the patient is **automatically removed from the Reception Lobby** and moved to the Consultation History ledger with full diagnostic notes and prescription history!
- **Auto-Generated Dispense Token**: Automatically generates a secure, de-identified QR/UUID token for external pharmacy dispensing without database coupling.
- **WhatsApp Delay Broadcast Simulator**: Send bulk announcements to all waiting patients when emergencies cause OPD delays.
- **Financial & Footfall Analytics (₹ INR)**: Daily collections and payment method distributions.

---

### 3. Standalone Pharmacy Store POS Portal (`/pharmacy`)
- **Top 30 Indian Essential & Most-Selling Medicines (Requirement 4)**:
  - Initialized with **100 units in stock** for all 30 top Indian branded medicines:
    1. Dolo 650
    2. Augmentin 625 Duo
    3. Azee 500
    4. Pan 40
    5. Omez-D
    6. Glycomet 500
    7. Amaryl 2
    8. Telma 40
    9. Amlong 5
    10. Atorva 10
    11. Montair LC
    12. Cetzine 10
    13. Ciplox 500
    14. Taxim-O 200
    15. Zerodol-SP
    16. Voveran 50
    17. Combiflam
    18. Emeset 4
    19. Vomistop
    20. Flagyl 400
    21. Rantac 150
    22. Losar 50
    23. Rosuvas 10
    24. Deplatt 75
    25. Thyronorm 50
    26. Calcirol Sachet (Uprise D3 60k)
    27. Becosules Z
    28. Shelcal 500
    29. Ascoril-D Plus Syrup
    30. Electral ORS WHO Formula
- **Real-Time Stock Decrement & Revenue Addition**:
  - Selling an item decrements stock levels in real time (`stock_level - quantity`).
  - Total Sales Revenue and Today's Sales automatically accumulate in ₹ INR.
  - Stock limits are strictly checked (prevents selling more than available units or when out of stock).
- **Rapid Walk-in POS Billing Counter**: Barcode search, cart adjustments, discounts, and UPI/Cash/Card checkout with printable thermal receipts.
- **Batch Expiry Date Guardian**: Expiry tracker preventing expired medicines from being rung up at the counter with 30/60/90-day alert thresholds.
- **Monthly Turnover & Profit Analytics**: Monthly sales totals in ₹, Cost of Goods (COGS), and gross profit margins.
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
│   │   ├── routes/            # Clinic HIS, Pharmacy Store, and WhatsApp Webhooks
│   │   ├── types/             # TypeScript definitions
│   │   └── server.ts          # Server entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/                  # Next.js 14 App Router Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx       # Public Marketing Landing Page
│   │   │   ├── clinic/        # Clinic HIS Portal (Lobby, Cabin, History, Billing)
│   │   │   └── pharmacy/      # Standalone Pharmacy Store POS (30 Indian Medicines, Stock & Revenue)
│   │   ├── components/        # UI Components (Hero, Navbar, Pricing, FAQ, AuthModal)
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
