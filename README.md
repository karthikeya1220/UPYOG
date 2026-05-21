# UPYOG Property Tax Analytics Dashboard

> A modern React dashboard for analyzing property tax data across 10 Indian cities with AI-powered chat insights.

## 🎯 Problem Statement

Build a multi-tenant property tax analytics dashboard for the UPYOG platform that serves 10 Indian cities. The dashboard must display key metrics, provide comparative analysis across cities, and enable natural language queries about property data through an AI assistant.

## ✨ Features

- **KPI Dashboard** — Real-time metrics (Total Properties, Approved Count, Rejected Count, Total Collection)
- **City Tenant Filter** — Switch between 10 cities or view all data aggregated
- **Comparison Charts** — Bar charts, pie charts, and grouped comparisons across cities
- **AI Chat Assistant** — Natural language queries answered by Claude/Gemini API
- **Responsive Design** — Works seamlessly on desktop and mobile

## 🛠 Tech Stack

- **Frontend**: React 18+ with Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **AI API**: Claude (Anthropic) / Gemini / OpenAI
- **Data**: 1,000 property records (JSON) — no database required
- **Deployment**: GitHub (source) + Vercel/Netlify (optional)

## 📊 Dataset Overview

- **Records**: 1,000 properties
- **Cities**: Delhi, Mumbai, Pune, Bengaluru, Chennai, Hyderabad, Ahmedabad, Kolkata, Jaipur, Lucknow
- **Fields**: property_id, tenant, owner_name, property_type, ward, area_sqft, status, annual_tax_inr, collection_inr, registration_date, floor_count, address
- **Statuses**: Approved, Rejected, Pending

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- API key from Claude, Gemini, or OpenAI (free tier)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/upyog-property-dashboard.git
cd upyog-property-dashboard

# Install dependencies
npm install

# Create .env file
touch .env.local

# Add your API key (never commit this!)
echo "VITE_CLAUDE_API_KEY=your_key_here" >> .env.local
# OR
echo "VITE_GEMINI_API_KEY=your_key_here" >> .env.local
```

### Running Locally

```bash
npm run dev
# Open http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
upyog-property-dashboard/
├── src/
│   ├── components/
│   │   ├── KpiCard.jsx
│   │   ├── TenantFilter.jsx
│   │   ├── ComparisonChart.jsx
│   │   ├── ChatAssistant.jsx
│   │   └── Dashboard.jsx
│   ├── hooks/
│   │   └── usePropertyData.js
│   ├── utils/
│   │   ├── dataProcessor.js
│   │   ├── aiClient.js
│   │   └── constants.js
│   ├── data/
│   │   └── properties.json
│   ├── App.jsx
│   └── index.css
├── public/
│   └── properties.json (optional)
├── docs/
│   ├── PROJECT_CONTEXT.md
│   ├── TASKS.md
│   ├── DECISIONS.md
│   ├── PROMPTS.md
│   ├── BUGS.md
│   ├── ARCHITECTURE.md
│   ├── STYLE_GUIDE.md
│   ├── API_CONTRACTS.md
│   ├── LEARNINGS.md
│   └── EXPERIMENTS.md
├── .env.local (ignored)
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Scoring Breakdown (100 points)

| Component | Points | Status |
|-----------|--------|--------|
| KPI Dashboard (4 cards) | 30 | ⏳ In Progress |
| Tenant Filter | 15 | ⏳ In Progress |
| Comparison Chart | 10 | ⏳ In Progress |
| AI Chat Assistant | 25 | ⏳ In Progress |
| Code Quality & Structure | 10 | ⏳ In Progress |
| README & Setup | 10 | ✅ Done |
| **Total** | **100** | |

### Shortlisting Criteria

- **70+**: Shortlisted for interview
- **55-69**: Manual review
- **<55**: Not shortlisted

## 🤖 AI Assistant Examples

The chat should answer questions like:

- "Which city has the highest total collection?"
- "How many properties are rejected in Mumbai?"
- "What percentage of Delhi properties are approved?"
- "Which city has the most pending properties?"
- "Compare total registrations between Pune and Jaipur."

## 🔐 Security Notes

- **Never commit API keys** — use `.env.local` with `.gitignore`
- Store sensitive keys in environment variables
- Validate all user inputs before sending to API
- Consider rate limiting for chat requests

## 📝 Important Dates

- **Assessment Duration**: 48 hours
- **Submission**: GitHub repo + screenshots to HR email
- **Shortlist Announcement**: [Insert date]

## 💡 Tips for Success

1. Start with KPI dashboard (highest points)
2. Get the tenant filter working early — it affects multiple components
3. Use sample data queries first, then integrate real data
4. Test AI responses with edge cases
5. Write clean, commented code
6. Update PROJECT_CONTEXT.md daily

## 🐛 Troubleshooting

See `docs/BUGS.md` for common issues and solutions.

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Recharts Gallery](https://recharts.org/examples)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Claude API Guide](https://docs.anthropic.com)
- [Gemini API Guide](https://ai.google.dev)

## ✅ Checklist Before Submission

- [ ] All 4 KPIs display correctly
- [ ] Tenant filter updates all components
- [ ] Chart renders with multiple cities
- [ ] AI chat responds to at least 5 sample questions
- [ ] Code is well-structured and commented
- [ ] properties.json is in repo
- [ ] .env file is in .gitignore
- [ ] README has complete setup instructions
- [ ] Screenshots taken and ready
- [ ] GitHub repo is public

## 📧 Questions?

Check `docs/PROJECT_CONTEXT.md` first, then refer to the assessment PDF for contact details.

---

**Last Updated**: [Will auto-update in PROJECT_CONTEXT.md]  
**Status**: Just started 🚀
