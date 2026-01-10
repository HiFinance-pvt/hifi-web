<p align="center">
  <img src="https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4IFohZsLPWtz9SeL3INaoxjGB5JZbvQuOHPXgf" alt="Hi-Fi Logo" width="80" height="80" />
</p>

<h1 align="center">Hi-Fi! 🎯</h1>

<p align="center">
  <strong>India's First Privacy-First AI Financial Multi-Agent System</strong>
</p>

<p align="center">
  <em>Connect your real-time financial footprint to AI — enabling it to reason, simulate, and act.</em>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#agent-fleet">Agent Fleet</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#google-technologies">Google Technologies</a>
</p>

---

## 🌟 Overview

**Hi-Fi** (High-Fidelity Finance) is a privacy-first, India-specific AI financial multi-agent system that transforms fragmented financial data into actionable intelligence. Built on top of **Fi Money's MCP (Model Context Protocol)** and powered by **Google Gemini**, Hi-Fi brings intelligent, personalized financial decision-making to every user.

### The Problem We Solve

| Challenge                    | Current Reality                                                                     | Hi-Fi Solution                                     |
| ---------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------- |
| **Scattered Financial Life** | Users manage money across 10+ platforms (banks, UPI, credit cards, MFs, loans, EPF) | Unified AI-powered financial context               |
| **Generic Tools**            | Dashboards show numbers, not insights                                               | Context-driven personalized answers                |
| **AI Without Context**       | LLMs are blind to your actual financial data                                        | Real-time financial data integration               |
| **No Strategy or Action**    | Tools operate in silos, manual coordination required                                | Autonomous agents that simulate, optimize, and act |

---

## 🤖 Agent Fleet

Hi-Fi deploys a coordinated fleet of specialized, autonomous AI agents:

### 🛡️ SEBI Agent

> _Your Compliance Watchdog_

Monitors transactions, ensures regulatory compliance, identifies potential fraud, and flags risks in real-time.

- Trade compliance verification
- Risk flagging & assessment
- Regulatory filing guidance
- Anomaly detection

### 📊 Tax-Mitra Agent

> _Your Friendly Tax Sidekick_

Breaks down complex Indian tax laws into actionable guidance. From ITR filing to deduction tracking.

- Auto ITR filing assistance
- Section 80C/80D optimization
- Old vs New regime comparison
- Form 16/26AS processing
- Advance tax calculations

### 💳 Debt-Squasher Agent

> _Brutal on Debt, Soft on You_

Calculates DTI/FOIR, analyzes liabilities, and builds optimized payoff strategies.

- EMI optimization
- Debt consolidation strategies
- Snowball vs avalanche methods
- Credit score improvement
- Loan refinancing guidance

### 📈 Trader Agent

> _Built for the Bold_

Real-time signals, market analysis, and portfolio management with Zerodha integration.

- Portfolio rebalancing
- Technical indicator analysis
- Market sentiment tracking
- Live trading execution via Zerodha APIs

---

## ✨ Features

### 🧠 Multi-Agent Intelligence

- Modular, autonomous, memory-aware agents
- Inter-agent collaboration via shared financial memory
- Orchestrated via Google Agent Development Kit (ADK)

### 📡 Real-Time Financial Context (via Fi MCP)

- Structured ingestion from **18+ financial sources**
- Banks, UPI, EPF, Mutual Funds, Credit Cards, Income, Liabilities
- Normalized AI-ready JSON data
- Temporal, transactional, and behavioral reasoning

### 💬 Natural Language Interface

- Chat-based contextual queries
- Goal-aware, simulation-capable prompts
- Multilingual support (English, Hindi, Gujarati, Marathi)
- Financial intent extraction via Gemini

### 🚀 Strategic Financial Execution

- Zerodha-integrated trading flows
- Auto-generated ITR summaries
- EMI optimization via FOIR/DTI modeling
- Risk flagging & retirement goal tracking

### 🇮🇳 India-Native Financial Intelligence

- Supports ELSS, PPF, EPF, 80C/80D, Form 16/26AS, LTCG
- Handles Indian-specific tax logic & TDS reconciliation
- Dual tax regime calculations

### 🔒 Privacy & User Control

- OAuth 2.0 scoped, consent-driven access
- Sensitive logic runs offline via Gemma
- Full data export, audit trail, and revocation control

---

## 🛠️ Tech Stack

### Frontend

| Technology          | Version | Purpose                         |
| ------------------- | ------- | ------------------------------- |
| **Next.js**         | 15.4.2  | React framework with App Router |
| **React**           | 19.1.0  | UI library                      |
| **TypeScript**      | 5.x     | Type safety                     |
| **Tailwind CSS**    | 4.x     | Styling                         |
| **Framer Motion**   | 12.x    | Animations                      |
| **Zustand**         | 5.x     | State management                |
| **TanStack Query**  | 5.x     | Server state & caching          |
| **React Hook Form** | 7.x     | Form handling                   |
| **Zod**             | 4.x     | Schema validation               |

### Backend & Services

| Technology                | Purpose                                 |
| ------------------------- | --------------------------------------- |
| **Firebase Auth**         | Authentication (Google, Email/Password) |
| **Firestore**             | NoSQL database for user data            |
| **Google Gemini**         | Core LLM for AI capabilities            |
| **Google Vertex AI**      | Multi-agent orchestration               |
| **Google ADK**            | Agent Development Kit framework         |
| **Fi Money MCP**          | Real-time financial data integration    |
| **Google Compute Engine** | FastAPI backend hosting                 |

### UI Components

| Library            | Purpose             |
| ------------------ | ------------------- |
| **Lucide React**   | Icon library        |
| **Sonner**         | Toast notifications |
| **React Markdown** | Markdown rendering  |
| **Three.js**       | 3D visualizations   |
| **GSAP**           | Advanced animations |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Firebase project with Auth enabled
- Access to Fi Money MCP Server
- Google Cloud project with Gemini API access

### Environment Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/hifi-web.git
   cd hifi-web
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file based on `env.example`:

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_FI_MCP_SERVER_URL=your_fi_mcp_server_url
   NEXT_PUBLIC_SSID=your_session_id

   # Environment
   NODE_ENV=development
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command             | Description                             |
| ------------------- | --------------------------------------- |
| `pnpm dev`          | Start development server with Turbopack |
| `pnpm build`        | Create production build                 |
| `pnpm start`        | Start production server                 |
| `pnpm lint`         | Run ESLint                              |
| `pnpm lint:fix`     | Fix ESLint errors                       |
| `pnpm format`       | Format code with Prettier               |
| `pnpm format:check` | Check code formatting                   |

---

## 📁 Project Structure

```
hifi-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── agents/             # Agent-specific pages
│   │   │   ├── debt-squasher/  # Debt management agent
│   │   │   ├── sebi-agent/     # SEBI compliance agent
│   │   │   ├── tax-mitra/      # Tax filing agent
│   │   │   ├── trader-agent/   # Trading agent
│   │   │   └── page.tsx        # Agents hub
│   │   ├── dashboard/          # Main dashboard
│   │   │   ├── [session_id]/   # Dynamic session pages
│   │   │   └── page.tsx        # Session creation
│   │   ├── login/              # Authentication
│   │   ├── signup/             # User registration
│   │   └── layout.tsx          # Root layout
│   │
│   ├── components/             # React components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── landing/            # Landing page components
│   │   ├── sidenav/            # Sidebar navigation
│   │   └── ui/                 # UI primitives
│   │
│   ├── contexts/               # React contexts
│   │   └── AuthContext.tsx     # Authentication context
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── adk.ts              # ADK API hooks
│   │   ├── useChat.ts          # Chat functionality
│   │   ├── useCheckSession.ts  # Session validation
│   │   └── useKite.ts          # Zerodha integration
│   │
│   ├── lib/                    # Utilities & services
│   │   ├── api/                # API clients
│   │   │   ├── adk.ts          # ADK (Agent) API
│   │   │   ├── kite.ts         # Zerodha Kite API
│   │   │   └── mcp.ts          # Fi MCP API
│   │   ├── firebase/           # Firebase configuration
│   │   ├── validations/        # Zod schemas
│   │   └── env.ts              # Environment variables
│   │
│   ├── stores/                 # Zustand stores
│   │   ├── sessionStore.ts     # Session management
│   │   ├── taxTraderStore.ts   # Tax preferences
│   │   ├── debtSquasherStore.ts# Debt preferences
│   │   └── boolStore.ts        # UI state
│   │
│   ├── constants/              # App constants
│   │   ├── agentPrompts.ts     # Agent system prompts
│   │   └── mockData.ts         # Sample data
│   │
│   ├── theme/                  # Theme configuration
│   │   └── hifi-theme.ts       # Color & design tokens
│   │
│   ├── types/                  # TypeScript types
│   │   └── chat.ts             # Chat-related types
│   │
│   └── ui/                     # UI animations
│       ├── Animations/         # Motion components
│       └── TextAnimations/     # Text effects
│
├── public/                     # Static assets
├── env.example                 # Environment template
├── package.json                # Dependencies
├── tailwind.config.ts          # Tailwind configuration
└── tsconfig.json               # TypeScript config
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                           │
│                     (Next.js + React + Tailwind)                 │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      Firebase Auth        │
                    │   (Google + Email Auth)   │
                    └─────────────┬─────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────────┐
│                        Agent Orchestration                       │
│                     (Google ADK + Vertex AI)                     │
├─────────────┬─────────────┬─────────────┬──────────────────────┤
│ SEBI Agent  │ Tax-Mitra   │   Debt      │   Trader Agent       │
│             │   Agent     │  Squasher   │                      │
└──────┬──────┴──────┬──────┴──────┬──────┴─────────┬────────────┘
       │             │             │                │
       └─────────────┴─────────────┴────────────────┘
                           │
         ┌─────────────────▼─────────────────┐
         │         Google Gemini Pro          │
         │        (Financial Reasoning)       │
         └─────────────────┬─────────────────┘
                           │
    ┌──────────────────────▼──────────────────────┐
    │             Fi Money MCP Server              │
    │    (Real-time Financial Data Integration)    │
    ├──────────────────────────────────────────────┤
    │  Banks  │  UPI  │  EPF  │  MF  │  Credit    │
    │         │       │       │      │  Cards     │
    └──────────────────────────────────────────────┘
```

---

## 🔧 Google Technologies

| Technology                             | Use Case                                     |
| -------------------------------------- | -------------------------------------------- |
| **Google Agent Development Kit (ADK)** | Framework for developing AI Agents           |
| **Firestore**                          | NoSQL database for user data at scale        |
| **Google Gemini**                      | Core LLM powering AI capabilities            |
| **Firebase Auth**                      | Secure user authentication & sessions        |
| **Google Vertex AI**                   | Multi-agent orchestration & model deployment |
| **Google Compute Engine**              | FastAPI backend server hosting               |
| **Google Generative AI**               | Real-time Indian language translation        |

---

## 🔐 Security & Privacy

- **OAuth 2.0**: Scoped, revocable access with user consent
- **On-Device Reasoning**: Sensitive computations (tax, liabilities) run locally via Gemma
- **Data Sovereignty**: Users maintain complete ownership of their data
- **Audit Trail**: Full transparency with data export capabilities
- **Consent-Driven**: No data access without explicit user permission

---

## 🛣️ Roadmap

### Phase 1: Agent Expansion

- [ ] Insurance Planning Agent
- [ ] Goal-Based Budgeting Agent
- [ ] Freelancer Taxation Agent
- [ ] Family/Team financial agents

### Phase 2: Mobile Evolution

- [ ] iOS & Android native apps
- [ ] Push notifications & widgets
- [ ] Offline-first capability

### Phase 3: Ecosystem Integration

- [ ] Upstox, Splitwise, CRED, Jar integration
- [ ] GST-linked systems
- [ ] B2B invoicing tools

### Phase 4: Platform as a Service

- [ ] White-labeled agent orchestration
- [ ] APIs for fintechs & neobanks
- [ ] Customizable agent templates

---

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 🙏 Acknowledgments

- **Fi Money** - For the MCP infrastructure enabling real-time financial data
- **Google Cloud** - For Gemini, Vertex AI, and Firebase services
- **Zerodha** - For Kite trading API integration

---

<p align="center">
  <strong>Built with ❤️ for Bharat's Financial Future</strong>
</p>

<p align="center">
  <em>Empowering every Indian with AI-powered financial intelligence</em>
</p>
