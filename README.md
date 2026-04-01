# RupeePulse 🚀

A production-ready, real-time crypto trading platform built for Indian investors.
Trade Bitcoin, Ethereum & 50+ coins live in INR.

---

## Tech Stack

| Layer          | Technology                                          |
|----------------|-----------------------------------------------------|
| Framework      | Next.js 14 (App Router)                             |
| Frontend       | React 18, Tailwind CSS, Framer Motion               |
| Charts         | Lightweight Charts (TradingView) + Recharts         |
| Real-time      | Binance WebSocket (mock fallback built-in)          |
| Auth           | NextAuth v4 — Credentials + Google OAuth            |
| Database       | MongoDB with Mongoose                               |
| State          | Zustand                                             |
| Validation     | Zod                                                 |
| Deployment     | Vercel (frontend) + MongoDB Atlas (database)        |

---

## Features

### Authentication
- Email/password sign up & sign in (bcrypt hashed)
- Google OAuth one-click login
- JWT sessions via NextAuth
- Protected routes — redirect to login if unauthenticated

### Dashboard
- Real-time price ticker (Binance WebSocket → mock fallback)
- Portfolio stats: total value, P&L, balance
- Candlestick charts with 6 timeframes (1m / 5m / 1h / 4h / 1D / 1W)
- Quick trade panel
- Watchlist mini view
- Top gainers/losers market table with sparklines
- Portfolio allocation donut chart
- Recent orders

### Trading
- Buy / Sell with Market, Limit, Stop-Loss order types
- Order book (bids & asks)
- 24h High/Low/Volume/Market Cap stats
- 0.1% fee simulation
- Full wallet debit/credit on order execution

### Portfolio
- Live holdings table with unrealised P&L per coin
- 12-month performance area chart
- Allocation donut chart

### Markets
- All 15 supported coins, searchable & sortable
- Sort by price, 24h change, or volume
- Watchlist toggle inline

### Watchlist
- Add / remove coins
- Live prices with trade shortcut

### Alerts
- Create price alerts (above / below)
- Toggle on/off, delete
- Triggered alert status

### History
- Full order history with filters (buy/sell, status)
- CSV export button
- Summary stats: total bought, sold, fees paid

### Settings
- Profile tab (name, email, phone, currency)
- Security tab (change password, 2FA placeholder)
- Notifications tab (granular toggles)
- Appearance tab (theme / compact mode)
- API Keys tab

---

## Quick Start

```bash
# 1. Clone / unzip the project
cd rupeepulse

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local — set MONGODB_URI and NEXTAUTH_SECRET at minimum

# 4. (Optional) Seed demo data
node scripts/seed.js

# 5. Run dev server
npm run dev
# → http://localhost:3000
```

The app works **without any API keys** — it uses simulated prices when
Binance WebSocket or CoinGecko API is unavailable.

---

## Environment Variables

| Variable                    | Required | Description                                   |
|-----------------------------|----------|-----------------------------------------------|
| `NEXTAUTH_URL`              | Yes      | Your app URL (e.g. `http://localhost:3000`)   |
| `NEXTAUTH_SECRET`           | Yes      | Random 32+ char secret for JWT signing        |
| `MONGODB_URI`               | Yes      | MongoDB connection string                     |
| `GOOGLE_CLIENT_ID`          | Optional | Enable Google OAuth                           |
| `GOOGLE_CLIENT_SECRET`      | Optional | Enable Google OAuth                           |
| `COINGECKO_API_KEY`         | Optional | Faster/higher-rate CoinGecko API              |

---

## Folder Structure

```
rupeepulse/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Sign in
│   │   └── signup/page.tsx         # Register
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth handler
│   │   ├── auth/signup/            # Registration endpoint
│   │   ├── orders/                 # Place & list orders
│   │   ├── portfolio/              # Portfolio value
│   │   ├── prices/                 # CoinGecko proxy
│   │   ├── watchlist/              # Watchlist CRUD
│   │   └── alerts/                 # Alerts CRUD
│   └── dashboard/
│       ├── page.tsx                # Main dashboard
│       ├── trade/page.tsx          # Trading terminal
│       ├── portfolio/page.tsx      # Portfolio overview
│       ├── markets/page.tsx        # Market browser
│       ├── watchlist/page.tsx      # Watchlist manager
│       ├── alerts/page.tsx         # Price alerts
│       ├── history/page.tsx        # Order history
│       └── settings/page.tsx       # User settings
├── components/
│   ├── charts/CandleChart.tsx      # LightweightCharts OHLCV + MiniChart
│   ├── layout/Sidebar.tsx          # Collapsible nav sidebar
│   ├── layout/Topbar.tsx           # Ticker + search + notifications
│   ├── portfolio/Holdings.tsx      # Holdings list
│   ├── portfolio/PortfolioDonut.tsx
│   ├── portfolio/PerformanceChart.tsx
│   ├── trading/TradePanel.tsx      # Buy/sell form
│   ├── trading/MarketTable.tsx     # Sortable coin table
│   └── ui/                         # Card, Button, StatCard, Badge, etc.
├── hooks/
│   └── usePriceFeed.ts             # Binance WS + mock fallback
├── lib/
│   ├── auth.ts                     # NextAuth config
│   ├── coingecko.ts                # CoinGecko API client
│   ├── db.ts                       # MongoDB connection
│   ├── utils.ts                    # formatINR, calcFee, etc.
│   └── websocket.ts                # WS feed manager
├── models/
│   ├── User.ts                     # User schema
│   ├── Wallet.ts                   # Wallet + holdings
│   ├── Order.ts                    # Order history
│   └── Watchlist.ts                # Watchlist + Alerts
├── store/
│   └── usePriceStore.ts            # Zustand (prices, trade, UI, portfolio)
├── types/index.ts                  # Global TypeScript types
└── scripts/seed.js                 # Demo data seeder
```

---

## Deployment

### Vercel (Frontend)
```bash
npx vercel --prod
# Set all env vars in Vercel dashboard → Settings → Environment Variables
```

### MongoDB Atlas (Database)
1. Create a free cluster at mongodb.com/atlas
2. Get your connection string
3. Set `MONGODB_URI=mongodb+srv://...` in your env

---

## API Reference

| Method | Path                    | Description              |
|--------|-------------------------|--------------------------|
| POST   | /api/auth/signup        | Register new user        |
| POST   | /api/auth/signin        | Sign in (NextAuth)       |
| GET    | /api/prices             | All coin market prices   |
| GET    | /api/portfolio          | User's portfolio value   |
| GET    | /api/orders             | Order history            |
| POST   | /api/orders             | Place buy/sell order     |
| GET    | /api/watchlist          | Get watchlist            |
| POST   | /api/watchlist          | Add to watchlist         |
| DELETE | /api/watchlist?symbol=X | Remove from watchlist    |
| GET    | /api/alerts             | Get price alerts         |
| POST   | /api/alerts             | Create alert             |
| PATCH  | /api/alerts             | Toggle alert on/off      |
| DELETE | /api/alerts?id=X        | Delete alert             |

---

## Demo Account

After running `npm run dev`, you can sign up with any email or use:
- **Email:** demo@rupeepulse.in
- **Password:** Demo@1234

Starting balance: **₹10,00,000** (demo funds)

---

## License

MIT — free to use for learning and portfolio projects.
