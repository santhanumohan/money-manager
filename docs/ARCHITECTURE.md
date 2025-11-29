# System Architecture

## Overview
The Money Management App is designed as a monolithic Next.js application that leverages Server Actions for backend logic and React Server Components (RSC) for efficient data fetching. This architecture minimizes client-side JavaScript and optimizes initial load performance.

## 🏗️ Architectural Patterns

### 1. Server-First Data Fetching
*   **Pattern:** Data is fetched directly in `page.tsx` (Server Components) using Drizzle ORM.
*   **Parallelization:** We use `Promise.all()` to fetch independent data streams (e.g., Wallets, Transactions, Categories) simultaneously, reducing waterfall delays.
*   **Benefit:** Faster First Contentful Paint (FCP) and SEO friendliness (though the app is behind auth).

### 2. Server Actions for Mutations
*   **Location:** `actions/` directory.
*   **Role:** Handle all `POST`, `PUT`, `DELETE` operations (Forms, Buttons).
*   **Validation:** All inputs are validated using **Zod** schemas before touching the database.
*   **Security:** Every action verifies user authentication via Supabase Auth (`getUser()`) and checks resource ownership (e.g., "Does this wallet belong to this user?").

### 3. Database Schema (PostgreSQL + Drizzle)
The database is normalized to ensure data integrity.

*   **Users:** Managed by Supabase Auth (`auth.users`).
*   **Wallets:** Stores account balances. Linked to `auth.users`.
*   **Categories:** Income/Expense categories. Linked to `auth.users`.
*   **Transactions:** The core ledger.
    *   `walletId` (Source) -> **Cascade Delete** (If wallet deleted, transactions go).
    *   `targetWalletId` (Destination for transfers) -> **Set Null** (If target wallet deleted, transaction remains as record).
*   **Budgets:** Monthly spending limits.
    *   Composite Unique Index: `(user_id, category_id, period)` to prevent duplicate budgets.

### 4. State Management
*   **Server State:** Managed by Next.js Cache and `revalidatePath`. When a Server Action completes, it invalidates the cache, automatically updating the UI.
*   **Client State:** Minimal local state (React `useState`) used only for UI interactions like opening Dialogs, switching Tabs, or managing Form inputs.

## 🔒 Security Measures

1.  **Row Level Security (RLS):** While Drizzle handles queries, we enforce logical RLS in the application layer. Every query includes `where: eq(table.userId, user.id)`.
2.  **Input Sanitization:** Zod prevents invalid data types.
3.  **Authentication:** Relies on secure HttpOnly cookies managed by Supabase.

## 🧩 Component Hierarchy

*   **Layouts:** `RootLayout` (Providers) -> `DashboardLayout` (Sidebar + Header).
*   **Pages:**
    *   `Dashboard`: Summary Cards, Recent Transactions, Budget Progress.
    *   `Transactions`: Filterable/Searchable List (Pagination).
    *   `Analytics`: Charts and Reports.
    *   `Categories`: CRUD Management.
*   **Shared Components:** `ui/` (Shadcn), `Dialogs` (Create/Edit forms).

## 🚀 Scalability Considerations

*   **Database:** PostgreSQL can handle millions of rows. Indexes are added to frequently queried columns (`date`, `userId`, `type`).
*   **Performance:** Pagination is implemented on the Transactions page to prevent rendering thousands of DOM nodes.
*   **Codebase:** Strict typing (TypeScript) and modular folder structure allow easy addition of new features without regression.
