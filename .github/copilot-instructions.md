# Bank Village Development Guide

## Project Architecture

Bank Village is a full-stack banking application with a **NestJS backend** and **Nuxt 3 frontend**. The system manages accounts (SAVING/STOCK/LOAN), transactions, and interest calculations for a village banking system.

### Core Components

- **Backend**: NestJS API in `/backend` with Prisma ORM, PostgreSQL database, JWT auth
- **Frontend**: Nuxt 3 SPA in `/web-client` with PrimeVue UI, Pinia state management
- **Database**: PostgreSQL with Prisma migrations in `/backend/prisma`

## Key Development Patterns

### Backend Service Pattern
Services follow transaction-based patterns with Prisma:
```typescript
// Always wrap database operations in transactions for financial operations
const [result] = await this.prisma.$transaction([
  this.prisma.account.update({...}),
  this.prisma.transaction.create({...})
]);

// Use Prisma.Decimal for precise financial calculations
const balanceInDecimal = new Prisma.Decimal(amount);
const balanceTotal = account.balance.add(balanceInDecimal);
```

### Frontend API Pattern
All API calls use the `requestAPI()` composable with JWT auth:
```typescript
// In services/
const { requestAuth } = await requestAPI()
const data = await requestAuth<Type>('/endpoint', { method: 'POST', body })
```

### Environment Setup
Create .env files manually:
- Backend: `DATABASE_URL` (Supabase), `SALT_JWT_SECRET`, `SAVING_INTEREST`, `STOCK_INTEREST`, `LOAN_INTEREST`
- Frontend: `API_URL` pointing to backend (https://bank-village-service.onrender.com for prod)

## Critical Workflows

### Database Management
```bash
# Backend development (always run after schema changes)
cd backend
bun run gen:prisma       # Generate Prisma client
npx prisma migrate dev   # Apply migrations
npx prisma migrate reset # Reset database (dev only)
```

### Development Startup
```bash
# Backend
cd backend && bun run start:dev  # Auto-generates Prisma client

# Frontend  
cd web-client && pnpm dev       # Runs on port 3000
```

### Docker Deployment
```bash
# Backend: ./backend/build.sh
# Frontend: ./web-client/deploy-prod.sh
```

## Domain-Specific Logic

### Account Types & Interest
- **SAVING**: Basic savings with configurable interest
- **STOCK**: Investment accounts with higher interest rates  
- **LOAN**: Loan accounts with interest calculations
- Interest rates stored in `InterestRate` table, referenced by environment variables

### Transaction System
All financial operations create `Transaction` records with:
- `previousBalance`, `changeBalance`, `amounts` for audit trail
- `TransactionAction`: DEPOSIT/WITHDRAWAL/TRANSFER/INTEREST
- Rollback functionality via `rollbackTransactionService`

### Authentication Flow
- JWT-based with 4-hour expiration
- Frontend stores token in cookies (`js-cookie`)
- Role-based access (ADMIN/USER) in Prisma schema

## File Structure Conventions

### Backend Modules
Each feature has: `controller.ts`, `service.ts`, `module.ts`, `dto/` folder
Key modules: `auth`, `accounts`, `users`, `reports`, `stats`, `interest`

### Frontend Organization  
- `services/`: API calls to backend
- `composables/`: Reusable logic (`request.ts`, `useInterest.ts`)
- `utils/`: Type definitions and helper functions
- `pages/`: File-based routing with `account/`, `member/` subdirectories

## Integration Points

### Database Connection
Supabase PostgreSQL via `DATABASE_URL` in backend `.env`

### Frontend-Backend Communication
- Base URL configured via `API_URL` environment variable
- All authenticated requests include JWT Bearer token
- Error handling in service layer with `{ isSuccess, data/error }` pattern

### External Dependencies
- **Puppeteer**: PDF generation (requires Google Chrome in Docker)
- **PrimeVue**: UI component library with custom theme
- **ExcelJS**: Report generation
- **Handlebars**: Template rendering for PDFs