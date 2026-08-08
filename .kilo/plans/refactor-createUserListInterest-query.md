# Result: Refactor `createUserListInterest` Query

**Target file:** `backend/src/reports/reports.service.ts` — method `createUserListInterest` (lines 13–82)
**No changes** to controller, schema, or other files.

---

## Status

Refactor **completed**. Prisma query migrated from `user.findMany` to `account.findMany`.

> **Note:** Grouping (plan Q1/Q4/Q7 — aggregate multiple accounts into 1 row per user via `Map`) was **not** implemented. The JS post-processing loop was retained as-is (1 output row per account, so a user with multiple matching accounts yields multiple rows). The `console.log` debug line was also left in place.

---

## Design Decisions (final)

| # | Decision | Implemented? |
|---|----------|--------------|
| Q1 | Aggregate multiple accounts → 1 row per user | ❌ No (1 row per account kept) |
| Q2 | Exclude accounts with zero interest transactions | ✅ Yes (Prisma `some` clause) |
| Q3 | Keep `super` username exclusion in JS post-processing (NOT Prisma) | ✅ Yes |
| Q4 | Sum all balances across matching accounts | ❌ No (single account balance per row) |
| Q5 | Filter empty transactions at Prisma level (`transactions: { some: {...} }`) | ✅ Yes |
| Q6 | JS filter: `f.owner.username !== 'super'` | ✅ Yes (via `excludeUser` includes) |
| Q7 | Group accounts by `owner.id` using `Map` / `reduce` | ❌ No |
| Q8 | Output structure unchanged: `{ userAndTransaction, totalBalance, totalInterest }` with `{ id, runNo, name, balance, sumOfinterest }` | ✅ Yes |

---

## What Was Changed

### Prisma query (lines 15–40) — CHANGED

`this.prisma.user.findMany(...)` → `this.prisma.account.findMany(...)`, querying accounts directly with nested `owner` and filtered `transactions` (only `INTEREST` within the date window):

```ts
const result = await this.prisma.account.findMany({
  where: {
    type: option.accountType,
    transactions: {
      some: {
        createdAt: { gte: startDate, lte: endDate },
        action: 'INTEREST',
      },
    },
  },
  select: {
    balance: true,
    owner: {
      select: { id: true, firstname: true, surname: true, username: true },
    },
    transactions: {
      where: {
        createdAt: { gte: startDate, lte: endDate },
        action: 'INTEREST',
      },
      select: { interest: true },
      orderBy: { createdAt: 'desc' },
    },
  },
  orderBy: { owner: { id: 'asc' } },
});
```

### Post-processing (lines 42–81) — UNCHANGED from original

The loop still emits one row per account:

```ts
console.log(JSON.parse(JSON.stringify(result)))   // debug line kept

const initValue = new Prisma.Decimal(0);
const excludeUser = ['super'];

const filterAccount = result.filter(f => !excludeUser.includes(f.owner.username));

let i = 0;
let userAndTransaction: {
  id: number; runNo: number; name: string; balance: number; sumOfinterest: number;
}[] = []
for (const acc of filterAccount) {
  const uid = acc.owner.id;
  const template = {
    id: uid,
    runNo: ++i,
    name: acc.owner.firstname + ' ' + acc.owner.surname,
    balance: +acc.balance,
    sumOfinterest: +acc.transactions
      .map(t => t.interest ?? initValue)
      .reduce((a, b) => a.add(b), initValue),
  }
  userAndTransaction.push(template)
}

const totalBalance = userAndTransaction.map(m => m.balance).reduce((a, b) => a + b, 0);
const totalInterest = userAndTransaction.map(m => m.sumOfinterest).reduce((a, b) => a + b, 0);

const template = { userAndTransaction, totalBalance, totalInterest };
return template;
```

---

## Key Behavioral Changes

1. **Query source**: now reads from `account`, so each account (with at least one `INTEREST` transaction in the window) yields a row; the output can contain duplicate `id`/`name` entries when a user holds multiple matching accounts.
2. **Empty-transaction filtering** happens at the Prisma level via `some` (Q5).
3. **Super exclusion** still applied in JS via `excludeUser` / `f.owner.username` (Q6).
4. **`console.log` debug line** remains in place (Step 3 of the original plan was not applied).

---

## Validation

1. `npm run build` in `backend/` — TypeScript compiles clean.
2. `GET /reports/list-user-receive-interest?accountType=SAVING&year=2024` returns `{ userAndTransaction, totalBalance, totalInterest }` — structurally unchanged.
3. Excel download path unaffected (controller untouched).

## Optional follow-up (not yet done)

If 1-row-per-user is required, apply grouping by `owner.id` in the post-processing loop (plan Q1/Q4/Q7) and remove the `console.log` debug line (plan Step 3).