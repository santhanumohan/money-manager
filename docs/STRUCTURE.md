# Project Structure Recommendation

For this Next.js 14 + Supabase + Drizzle stack, we recommend the following feature-based structure:

```
src/
├── actions/                # Server Actions
│   ├── transactions.ts     # Transaction related actions
│   └── ...
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth related routes
│   ├── (dashboard)/        # Protected dashboard routes
│   ├── api/                # API Routes (if needed)
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/             # React Components
│   ├── ui/                 # Shadcn/UI components
│   ├── forms/              # Form components
│   └── ...
├── db/                     # Database Configuration
│   ├── index.ts            # Drizzle client setup
│   ├── schema.ts           # Database schema definition
│   └── triggers.sql        # Raw SQL triggers
├── lib/                    # Utilities and Libraries
│   ├── supabase/           # Supabase client setup
│   │   ├── client.ts       # Client-side client
│   │   └── server.ts       # Server-side client
│   └── utils.ts            # Helper functions
├── types/                  # TypeScript definitions
└── ...
```

## Key Decisions
- **`src/db`**: Centralizes all database logic (schema, client, raw SQL).
- **`src/actions`**: Separates Server Actions from UI components for better reusability and testing.
- **`src/lib/supabase`**: clear separation of client/server Supabase clients.
