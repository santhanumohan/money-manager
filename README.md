# Money Management App

A modern, feature-rich personal finance application built with Next.js 16, Shadcn UI, and Supabase.

## 🚀 Features

### Core Functionality
*   **Transaction Management:** Record Income, Expenses, and Transfers between wallets.
*   **Multi-Wallet Support:** Manage multiple accounts (Cash, Bank, E-Wallet).
*   **Custom Categories:** Create, edit, and personalize transaction categories with colors.
*   **Monthly Budgeting:** Set budget limits per category and track progress in real-time.

### Analytics & Reporting
*   **Interactive Dashboard:** Quick summary of balance, recent activity, and budget status.
*   **Detailed Analytics:** Visual Pie Charts and Bar Charts for spending analysis (6-month history).
*   **Data Export:** Export transaction history to CSV for external analysis.

### User Experience
*   **Mobile First Design:** Optimized layout for mobile devices with Floating Action Button (FAB).
*   **Dark Mode:** Fully supported light and dark themes.
*   **Command Palette (`Ctrl+K`):** Quick navigation and actions for power users.
*   **Advanced Filtering:** Filter transactions by date range, type, and search queries.

## 🛠️ Tech Stack

*   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Database:** [PostgreSQL](https://postgresql.org) (via [Supabase](https://supabase.com/))
*   **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
*   **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Charts:** [Recharts](https://recharts.org/)
*   **Authentication:** Supabase Auth

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/wayosu/money-manager.git
    cd money-manager
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    DATABASE_URL=postgres://user:password@host:port/db
    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```

4.  **Run Database Migrations:**
    Push the schema to your Supabase database:
    ```bash
    npx drizzle-kit push
    ```

5.  **Start Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/).

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  Add the Environment Variables in Vercel settings.
4.  Deploy!

## 📂 Project Structure

*   `actions/`: Server Actions for backend logic (DB operations).
*   `app/`: Next.js App Router pages and layouts.
*   `components/`: Reusable UI components.
    *   `ui/`: Shadcn primitives.
    *   `dashboard/`, `transactions/`, `categories/`: Feature-specific components.
*   `db/`: Database schema and connection config.
*   `lib/`: Utility functions and Supabase client.
*   `types/`: TypeScript interface definitions.

## 📝 License

MIT License.
