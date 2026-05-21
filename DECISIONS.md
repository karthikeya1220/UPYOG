# DECISIONS.md

Track all technical decisions, their rationale, and tradeoffs.

---

## 1. Frontend Framework: React + Vite

**Decision Date**: 2026-05-21  
**Status**: ✅ Final

### Choice
React 18 with Vite (not Create React App, not Next.js)

### Rationale
- **Assignment requires React** (explicitly stated)
- **Vite is fastest** for development/build
- **Simpler than Next.js** — no API routes needed
- **No SEO needed** — this is a dashboard
- **Instant HMR** — better DX for rapid iteration

### Tradeoff
- Lose file-based routing (not needed for SPA)
- Lose SSR capabilities (not needed for analytics dashboard)
- Lose built-in API routes (load data client-side instead)

### Alternative Considered
- Create React App: Slower, more bloated setup
- Next.js: Overkill, adds complexity, not needed
- Vue/Svelte: Assignment specifies React

**Conclusion**: Vite is the right call for speed and simplicity.

---

## 2. Charting Library: Recharts

**Decision Date**: 2026-05-21  
**Status**: ✅ Final

### Choice
Recharts for all charts (bar, pie, etc.)

### Rationale
- **React-native components** — no DOM manipulation needed
- **Excellent animations** — smooth transitions
- **Built-in responsiveness** — mobile-friendly
- **Extensive examples** — great documentation
- **Active community** — long-term support

### Tradeoff
- Slightly heavier bundle than Chart.js (~40KB)
- Less customization than D3.js
- Not ideal for real-time streaming data

### Alternative Considered
- Chart.js: Lighter, but more boilerplate
- D3.js: Overkill, steep learning curve
- Plotly.js: Good, but Recharts is simpler

**Conclusion**: Recharts is best balance of ease + power.

---

## 3. AI API Choice: Claude (Anthropic)

**Decision Date**: 2026-05-21  
**Status**: ✅ Final

### Choice
Claude via Anthropic API (not Gemini, not OpenAI)

### Rationale
- **Generous free tier** — enough credits for testing
- **Excellent context handling** — good for data summaries
- **Clear pricing** — no surprises
- **Solid documentation** — API is well-documented
- **Strong reasoning** — better at analytical questions

### Tradeoff
- Slightly higher latency than Gemini
- Less widely used than OpenAI (but still robust)
- Requires API key management

### Alternative Considered
- Google Gemini: Free tier is generous, but less reliable
- OpenAI: Requires paid credits, chat-focused not analytics
- Open-source (Ollama): Requires local setup, slower

**Conclusion**: Claude is best for data analysis and cost-efficiency.

---

## 4. Data Loading: Client-Side (No Backend)

**Decision Date**: 2026-05-21  
**Status**: ✅ Final (but revisit if bonus attempted)

### Choice
Import properties.json directly in React (not from API/backend)

### Rationale
- **Assignment allows it** — "no database or server required"
- **Simplicity** — no backend infrastructure needed
- **Speed** — data loads instantly
- **Zero deployment complexity** — GitHub only
- **1,000 records is manageable** — no performance issues
- **Prototype-friendly** — quick iteration

### Tradeoff
- All filtering happens in-memory (fine for 1,000 records)
- Can't do real-time updates
- Can't handle large datasets (>100K records)
- No data persistence/updates

### Bonus Path (If Attempted +10 points)
If we want the bonus, we could:
1. Create Node.js/Express API
2. Setup PostgreSQL with 1,000 properties
3. Create REST endpoints for filtering
4. Migrate client-side logic to backend

**Conclusion**: Start with client-side. Add backend only if time permits for +10 bonus.

---

## 5. State Management: React Hooks (No Redux)

**Decision Date**: 2026-05-21  
**Status**: ✅ Final

### Choice
Use React useState + useCallback (not Redux/Zustand/Context)

### Rationale
- **Minimal state** — only tenant filter needed
- **No prop drilling** — dashboard is flat
- **Faster to implement** — saves time
- **Easier to debug** — no middleware complexity
- **Sufficient for this scope** — overkill to add Redux

### Tradeoff
- Won't scale to mega-complex state trees
- Can't debug with Redux DevTools
- No time-travel debugging

### When to Reconsider
If we add features like:
- Multiple filters (date range, property type, etc.)
- Persistent user preferences
- Complex undo/redo logic

**Conclusion**: Hooks are sufficient. Upgrade to Context API or Zustand only if state gets complex.

---

## 6. Styling: Tailwind CSS (No Component Library)

**Decision Date**: 2026-05-21  
**Status**: ✅ Final

### Choice
Tailwind CSS utilities (not Material-UI, Shadcn, or Chakra)

### Rationale
- **Fast utility-based styling** — no context switching
- **Small bundle** — only used classes included
- **No design system overhead** — direct control
- **Mobile-first responsive** — built-in
- **Great documentation** — huge community

### Tradeoff
- HTML becomes verbose (many classes)
- Need to know Tailwind utility names
- Less component reusability out-of-box

### When to Add UI Library
If we want pre-built components:
- Shadcn/ui: Excellent, but adds dependencies
- Material-UI: Great but heavier

**Conclusion**: Tailwind is sufficient for dashboard. Keep it simple.

---

## 7. Data Aggregation: Custom Hook (`usePropertyData`)

**Decision Date**: 2026-05-21  
**Status**: ⏳ To Implement

### Choice
Create custom `usePropertyData()` hook for all data logic

### Rationale
- **Centralized logic** — single source of truth
- **Reusable** — all components use same calculations
- **Testable** — hook logic separated from UI
- **Maintainable** — easy to fix bugs

### Hook Will Provide
```javascript
const {
  allData,           // Full 1,000 records
  cities,            // Array of 10 cities
  selectedCity,      // Current filter
  setSelectedCity,   // Update filter
  filteredData,      // Filtered by selected city
  
  // KPI calculations
  totalProperties,
  approvedCount,
  rejectedCount,
  totalCollection,
  
  // Chart data
  citySummary        // Aggregated data per city
} = usePropertyData();
```

### Benefit
Single place to update if data structure changes.

**Conclusion**: Worth the setup time for maintainability.

---

## 8. API Key Management: .env.local

**Decision Date**: 2026-05-21  
**Status**: ✅ Final

### Choice
Store API keys in `.env.local` file (not hardcoded)

### Rationale
- **Security** — keys never committed to GitHub
- **Flexibility** — easy to change keys
- **Standard practice** — industry best practice
- **Vite support** — VITE_ prefix for client-side keys

### Implementation
```
.env.local (gitignored):
VITE_CLAUDE_API_KEY=sk-ant-...

In code:
const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
```

### .gitignore Entry
```
.env
.env.local
.env.*.local
```

**Conclusion**: Non-negotiable for security.

---

## 9. Chat History: In-Memory (No Persistence)

**Decision Date**: 2026-05-21  
**Status**: ✅ Final

### Choice
Chat history resets on page refresh (no localStorage)

### Rationale
- **Simpler implementation** — no persistence logic
- **Saves assignment time** — not a requirement
- **Matches assessment brief** — just answer questions
- **Cleaner UI** — fresh start for each user

### Tradeoff
- Users lose conversation history on refresh
- No replay of previous conversations

### If Time Permits
Could add localStorage to persist chat:
```javascript
const [messages, setMessages] = useState(() => {
  const saved = localStorage.getItem('chatHistory');
  return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
  localStorage.setItem('chatHistory', JSON.stringify(messages));
}, [messages]);
```

**Conclusion**: Skip persistence for now. Add if time allows.

---

## 10. Chart Type: Bar Chart (Default)

**Decision Date**: 2026-05-21  
**Status**: ✅ Final

### Choice
Primary chart: Bar chart (cities on X-axis, collection on Y-axis)

### Rationale
- **Better for comparison** — easier to compare 10 cities
- **Simpler implementation** — one Recharts component
- **More informative** — shows exact values on hover
- **Assessment asks for "recommended"** — bar is recommended
- **Mobile-friendly** — scales well

### Alternatives Considered
- Pie chart: Good for proportions, but 10 slices is crowded
- Grouped bar: Good for Approved vs Rejected, more complex

### If Time Permits
Add secondary chart:
- Pie: Property type distribution
- Grouped bar: Approved vs Rejected vs Pending

**Conclusion**: Start with bar chart. Add pie if there's extra time.

---

## Summary of All Decisions

| Decision | Choice | Confidence | Revisit? |
|----------|--------|------------|----------|
| Framework | React + Vite | ✅ High | No |
| Charting | Recharts | ✅ High | No |
| AI API | Claude | ✅ High | Maybe |
| Data | Client-side JSON | ✅ High | Yes (if bonus) |
| State | Hooks | ✅ High | No |
| Styling | Tailwind | ✅ High | No |
| Data Logic | Custom Hook | ✅ High | No |
| Keys | .env.local | ✅ High | No |
| Chat | In-memory | ✅ High | No |
| Chart | Bar (primary) | ✅ High | Yes (if time) |

---

## When to Reconsider Decisions

1. **If performance is slow**: Consider caching in Context API
2. **If styling takes too long**: Consider Shadcn/ui components
3. **If AI responses are bad**: Switch to Gemini or OpenAI
4. **If 1,000 records becomes too slow**: Add backend + DB
5. **If chat gets complex**: Consider message persistence

**Rule**: Only revisit if there's clear evidence the decision is wrong.

---

**Last Updated**: 2026-05-21  
**Status**: All core decisions made. Ready to implement.
