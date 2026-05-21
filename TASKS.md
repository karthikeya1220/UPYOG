# TASKS.md

**Last Updated**: 2026-05-21

---

## 🔴 Active (Current Sprint)

### Setup & Infrastructure
- [ ] Initialize React + Vite project
- [ ] Install Recharts and Tailwind CSS
- [ ] Copy properties.json to src/data/
- [ ] Setup .env.local with API key
- [ ] Create .gitignore (include .env.local)

### Core KPI Dashboard (30 points)
- [ ] Create `usePropertyData.js` hook with data loading
- [ ] Build `KpiCard.jsx` component (reusable)
- [ ] Create KPI calculation functions:
  - [ ] countTotalProperties(data, city)
  - [ ] countApprovedProperties(data, city)
  - [ ] countRejectedProperties(data, city)
  - [ ] sumTotalCollection(data, city)
- [ ] Render all 4 KPI cards on dashboard
- [ ] Format collection values as currency (₹)
- [ ] Test KPI values with sample data

### Tenant Filter (15 points)
- [ ] Build `TenantFilter.jsx` dropdown component
- [ ] Add option for "All Cities"
- [ ] Connect to state management (useState)
- [ ] Ensure all 4 KPIs update on city change
- [ ] Test filter switching between 10 cities
- [ ] Test "All Cities" aggregation

### Comparison Chart (10 points)
- [ ] Build `ComparisonChart.jsx` component
- [ ] Decide: Bar chart (default) or Pie chart?
- [ ] Create data aggregator for all cities
- [ ] Implement Recharts BarChart with city labels
- [ ] Show total collection per city
- [ ] Make chart responsive
- [ ] Test chart updates on filter change

### AI Chat Assistant (25 points)
- [ ] Build `ChatAssistant.jsx` component with message display
- [ ] Create `aiClient.js` API integration layer
- [ ] Setup Claude API key handling
- [ ] Create data summary generator (totals, top cities, etc.)
- [ ] Build chat UI: messages + input field
- [ ] Implement send message handler
- [ ] Integrate with Claude API
- [ ] Test with 5+ sample questions:
  - [ ] "Which city has the highest total collection?"
  - [ ] "How many properties are rejected in Mumbai?"
  - [ ] "What percentage of Delhi properties are approved?"
  - [ ] "Which city has the most pending properties?"
  - [ ] "Compare registrations between Pune and Jaipur"
- [ ] Handle API errors gracefully
- [ ] Add loading indicator while waiting for response

### Code Quality & Structure (10 points)
- [ ] Add JSDoc comments to all functions
- [ ] Clean up component prop types
- [ ] Create utils folder with helper functions
- [ ] Organize imports logically
- [ ] Remove console.logs before submission
- [ ] Check for code duplication
- [ ] Ensure consistent naming conventions

### Documentation (10 points)
- [ ] Complete README.md with setup steps ✅
- [ ] Create PROJECT_CONTEXT.md ✅
- [ ] Create DECISIONS.md
- [ ] Create PROMPTS.md
- [ ] Create BUGS.md
- [ ] Create ARCHITECTURE.md
- [ ] Document any workarounds in BUGS.md

---

## 🟡 Backlog (Nice-to-Have)

### Advanced Features
- [ ] Add more chart types (Pie chart for property type distribution)
- [ ] Implement data export to CSV
- [ ] Add date range filter
- [ ] Show property type breakdown per city
- [ ] Implement ward-level details
- [ ] Add data loading animation

### UI/UX Improvements
- [ ] Add dark mode toggle
- [ ] Improve mobile layout
- [ ] Add loading skeletons
- [ ] Better error messages
- [ ] Smooth transitions between filters
- [ ] Add animations to KPI cards

### Backend Bonus (Optional +10 points)
- [ ] Setup PostgreSQL database
- [ ] Create Node.js/Express backend
- [ ] Migrate data to DB
- [ ] Create REST API endpoints
- [ ] Add database indexing for performance
- [ ] Deploy backend to Render/Railway

### Testing
- [ ] Write unit tests for calculations
- [ ] Test edge cases (empty data, invalid city)
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Performance testing with large datasets

---

## ✅ Completed

- [x] Read assignment PDF thoroughly
- [x] Analyze properties.json structure
- [x] Plan component architecture
- [x] Create markdown documentation files
- [x] Create README.md with setup instructions
- [x] Create PROJECT_CONTEXT.md
- [x] Create TASKS.md (this file)

---

## 🎯 Daily Checklist

### Start of Day
- [ ] Open PROJECT_CONTEXT.md
- [ ] Review Active tasks
- [ ] Check remaining time
- [ ] Pick 3 priority tasks

### During Coding
- [ ] Update task status as you complete them
- [ ] Note any blockers in BUGS.md
- [ ] Test as you go

### End of Day
- [ ] Update PROJECT_CONTEXT.md with progress
- [ ] Move incomplete tasks to tomorrow
- [ ] Commit code with clear messages
- [ ] Note any learnings in LEARNINGS.md

---

## ⏱️ Time Allocation (48 hours)

| Phase | Hours | Deadline |
|-------|-------|----------|
| Setup + KPI | 12h | First 12 hours |
| Filter + Chart | 12h | First 24 hours |
| AI Chat | 12h | First 36 hours |
| Testing + Polish | 10h | Last 10 hours |
| Buffer | 2h | Emergency use |

---

## 🚨 Critical Path (Must Do in Order)

1. **Setup React + data loading** (blocker for everything)
2. **KPI calculations** (blocker for dashboard)
3. **Tenant filter** (blocker for testing multiple cities)
4. **Chart** (10 points, moderate difficulty)
5. **AI chat** (25 points, requires API setup)
6. **Polish** (final 10 points)

---

## 💡 Notes

- Don't overthink styling — functional > beautiful
- Test KPIs manually before moving to chart
- Get Claude API key from console.anthropic.com (free credits)
- Commit every 2-3 hours
- Push to GitHub early (don't wait until end)
- Save screenshots as you go (proof of progress)

---

**Current Priority**: Setup React project  
**Estimated Completion**: 2026-05-22 (48h from start)  
**Status**: 🟢 Ready to begin
