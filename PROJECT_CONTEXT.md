# PROJECT_CONTEXT.md

**Last Updated**: 2026-05-21  
**Time Elapsed**: Just started  
**Target**: 70+ points to shortlist

---

## 🎯 Current Goal

Build a fully functional Property Tax Analytics Dashboard for UPYOG in 48 hours with:
1. KPI cards (30 pts) + Tenant filter (15 pts)
2. Comparison chart (10 pts)
3. AI chat assistant (25 pts)
4. Clean code & docs (20 pts)

---

## 💾 Current Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Charts**: Recharts (for bar/pie charts)
- **AI API**: Claude (Anthropic) — free trial
- **Data**: properties.json (1,000 records, 10 cities)
- **Styling**: Tailwind utilities + custom CSS
- **Deployment**: GitHub only (no backend required)

---

## 📊 Current Progress

### Phase 1: Planning ✅
- [x] Read assignment PDF
- [x] Understand data structure
- [x] Create markdown files
- [x] Plan component hierarchy
- [ ] Initialize React project

### Phase 2: Core Build (IN PROGRESS)
- [ ] Setup React + Vite + Tailwind
- [ ] Import properties.json
- [ ] Create KPI calculation functions
- [ ] Build KpiCard components (4 cards)
- [ ] Build TenantFilter dropdown
- [ ] Hook them together

### Phase 3: Charts & AI
- [ ] Create Comparison chart (Recharts)
- [ ] Integrate AI chat UI
- [ ] Build API integration layer
- [ ] Test AI responses

### Phase 4: Finalize
- [ ] Code cleanup & comments
- [ ] Test all features
- [ ] Update README
- [ ] Push to GitHub
- [ ] Take screenshots

---

## 🏗 Component Architecture

```
App.jsx
├── TenantFilter (dropdown, updates state)
├── KpiDashboard
│   ├── KpiCard (Total Properties)
│   ├── KpiCard (Approved Count)
│   ├── KpiCard (Rejected Count)
│   └── KpiCard (Total Collection)
├── ComparisonChart
│   └── Recharts BarChart or PieChart
└── ChatAssistant
    ├── ChatMessages
    └── ChatInput → AI API → Response
```

---

## 🧠 Data Processing Logic

### Key Calculations

**Total Properties**: `data.filter(p => p.tenant === selectedCity).length`

**Approved Count**: `data.filter(p => p.tenant === selectedCity && p.status === "Approved").length`

**Rejected Count**: `data.filter(p => p.tenant === selectedCity && p.status === "Rejected").length`

**Total Collection**: `data.filter(p => p.tenant === selectedCity).reduce((sum, p) => sum + p.collection_inr, 0)`

### Cities (10)
Delhi, Mumbai, Pune, Bengaluru, Chennai, Hyderabad, Ahmedabad, Kolkata, Jaipur, Lucknow

---

## ⚙️ Technical Decisions Made

### 1. Claude API over Gemini/OpenAI
- **Why**: Excellent free tier, good context window
- **Trade-off**: Need API key management
- **Decision Record**: See DECISIONS.md

### 2. Recharts for visualization
- **Why**: React-native, easy animations, great docs
- **Trade-off**: Slightly heavier than Chart.js
- **Alternative**: Chart.js if performance issues

### 3. No backend database
- **Why**: Assignment allows direct JSON import
- **Trade-off**: All filtering done in-memory (fine for 1,000 records)
- **Bonus**: Could add PostgreSQL later (+10 pts)

### 4. Tailwind CSS for styling
- **Why**: Fast utility-based styling, no context switching
- **Trade-off**: HTML becomes verbose
- **Plan**: Create reusable component classes

---

## 🚧 Current Constraints

- **Time**: 48 hours total
- **Size Limit**: 1,000 property records (manageable)
- **Cities**: Fixed 10 cities (Delhi, Mumbai, etc.)
- **No Server/DB**: Load data in React only
- **Free Tier API**: Gemini or Claude with free credits
- **Mobile Responsive**: Must work on mobile
- **GitHub Only**: No backend deployment needed

---

## ✅ Next Immediate Tasks (Priority Order)

1. **TODAY** (4-6 hours):
   - [ ] Create React project: `npm create vite@latest upyog-dashboard -- --template react`
   - [ ] Install deps: `npm install recharts tailwindcss`
   - [ ] Copy properties.json into `src/data/`
   - [ ] Create `usePropertyData.js` hook
   - [ ] Build & test KPI card components

2. **TOMORROW** (6-8 hours):
   - [ ] Integrate TenantFilter dropdown
   - [ ] Test all 4 KPIs update on city change
   - [ ] Build Comparison chart (bar chart by city)
   - [ ] Style dashboard grid layout

3. **FINAL PUSH** (6-8 hours):
   - [ ] Setup Claude API integration
   - [ ] Build ChatAssistant component
   - [ ] Generate data summary for AI context
   - [ ] Test 5+ sample questions
   - [ ] Code cleanup & comments
   - [ ] Push to GitHub
   - [ ] Write final README

---

## 🧪 Test Cases to Verify

### KPI Tests
- [ ] "Delhi" selected → correct counts shown
- [ ] "All Cities" → data aggregated correctly
- [ ] Switch between cities → values update instantly

### Chart Tests
- [ ] All 10 cities visible in chart
- [ ] Switching filter updates chart
- [ ] Hover tooltip shows values

### AI Tests
- [ ] "Which city has highest collection?" → Correct answer
- [ ] "How many rejected in Mumbai?" → Exact count
- [ ] "What % approved in Delhi?" → Calculated %
- [ ] "Compare Pune vs Jaipur" → Side-by-side comparison
- [ ] Handles typos gracefully

---

## 📈 Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| KPI Accuracy | 100% | Pending |
| UI Responsiveness | Mobile + Desktop | Pending |
| AI Answer Quality | 5/5 correct | Pending |
| Code Quality | Comments + Clean | Pending |
| Time Used | <48 hours | 0h |

---

## 💭 Open Questions

- Which AI API to use? (Claude recommended)
- Should comparison chart be bar or pie? (Bar better for comparisons)
- How to handle missing/null data? (Use 0 as default)
- Should chat persist data? (No, reset on refresh is fine)

---

## 📝 Session Notes

- Started assessment on 2026-05-21
- Focus on highest-point tasks first (KPI + Filter)
- Don't over-engineer UI — functional > beautiful
- Test early and often
- Update this file daily before stopping

---

**Status**: 🟢 Ready to start coding  
**Confidence**: High — Clear requirements, proven approach  
**Risk**: Time management (48-hour deadline)
