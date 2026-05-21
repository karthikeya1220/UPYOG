# BUGS.md

Track bugs, debugging intelligence, and solutions for reuse.

---

## Resolved Bugs

*(Add bugs here as you encounter and fix them)*

---

## Common React Pitfalls (Prevention)

### 1. State Not Updating in Child Components

**Symptoms**: KPI values don't update when selecting new city

**Root Cause**: 
- Child component not re-rendering because props didn't change
- useState in parent but not passed as prop
- Props passed but child component memoized with stale dependencies

**Prevention**:
```javascript
// ❌ Wrong: State in parent, child doesn't receive it
function Dashboard() {
  const [city, setCity] = useState('Delhi');
  return <KpiCard value={getKpis(city)} />; // Prop passed? ✓
}

// ✅ Right: Pass state and setter
<TenantFilter cities={cities} selected={city} onChange={setCity} />
<KpiCard city={city} {...kpis} /> // city in props ✓
```

**Fix**: 
- Ensure child props change when state changes
- Check React DevTools: Profiler → highlight updates
- Use `console.log(props)` to verify prop changes

---

### 2. Infinite Re-renders with useEffect

**Symptoms**: Console shows hundreds of render logs, app hangs

**Root Cause**: 
- useEffect calls setState, but setState dependency not in array
- Dependency array missing or undefined
- Object/array created in render, added to dependencies (new reference each time)

**Prevention**:
```javascript
// ❌ Wrong: No dependency array
useEffect(() => {
  setCity('Delhi'); // Called every render!
});

// ❌ Wrong: Object created in render
const config = { tenant: selectedCity }; // New object each render
useEffect(() => { updateData(); }, [config]); // Re-runs every time

// ✅ Right: Proper dependencies
useEffect(() => {
  setData(filterData(selectedCity));
}, [selectedCity]); // Only run when selectedCity changes
```

**Fix**:
- Always add dependency array to useEffect
- Move object/array creation outside component or useMemo
- Check: "Does this variable change?" → Add to deps

---

### 3. Filter Not Updating All Components

**Symptoms**: Tenant filter works, but chart/chat don't update

**Root Cause**:
- Filter state in one component, other components read from different state
- Components not connected to same state source
- Child components use local state instead of props

**Prevention**:
```javascript
// ❌ Wrong: Each component has its own state
function Dashboard() {
  return (
    <>
      <TenantFilter /> {/* Has own state */}
      <KpiCards /> {/* Has own state for city */}
      <Chart /> {/* Has own state for city */}
    </>
  );
}

// ✅ Right: Single source of truth
function Dashboard() {
  const [selectedCity, setSelectedCity] = useState('All Cities');
  
  return (
    <>
      <TenantFilter city={selectedCity} onChange={setSelectedCity} />
      <KpiCards city={selectedCity} />
      <Chart city={selectedCity} />
    </>
  );
}
```

**Fix**:
- Move state to parent component (lift state up)
- Pass state + setter through props
- Verify same state object in React DevTools

---

### 4. Tailwind Classes Not Applying

**Symptoms**: "rounded-lg", "shadow-md" don't work, but "p-4" does

**Root Cause**:
- Tailwind not configured in tailwind.config.js
- PurgeCSS removing unused classes
- Class name dynamically generated (not recognized at build time)

**Prevention**:
```javascript
// ❌ Wrong: Dynamic class name
const color = userInput; // "red-500"
return <div className={`bg-${color}`} /> // Not recognized!

// ✅ Right: Static class names
const colorClasses = {
  'blue': 'bg-blue-500',
  'red': 'bg-red-500'
};
return <div className={colorClasses[color]} />
```

**Fix**:
```bash
# Check tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",  // Include all JSX files
  ],
  theme: { extend: {} },
  plugins: [],
}
```

---

### 5. Chart Not Displaying Data

**Symptoms**: Recharts renders but no bars/lines visible

**Root Cause**:
- Data format incorrect (Recharts expects specific structure)
- Domain (Y-axis range) not set correctly
- ResponsiveContainer width/height 0

**Prevention**:
```javascript
// Data format for Recharts BarChart:
const data = [
  { name: 'Delhi', value: 1000, collection: 500000 },
  { name: 'Mumbai', value: 1200, collection: 600000 }
];

// ✅ Correct structure
<BarChart data={data} width={500} height={300}>
  <XAxis dataKey="name" />
  <YAxis />
  <Bar dataKey="collection" fill="#3b82f6" />
</BarChart>

// ✅ Always wrap in ResponsiveContainer
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    ...
  </BarChart>
</ResponsiveContainer>
```

**Fix**:
- Check data shape: `console.log(JSON.stringify(data, null, 2))`
- Verify `dataKey` matches data object keys
- Ensure ResponsiveContainer has parent width

---

## Common API Integration Issues

### 6. API Key Not Found (Claude/Gemini)

**Symptoms**: 
- Error: "VITE_CLAUDE_API_KEY is undefined"
- API calls return 401 Unauthorized

**Root Cause**:
- .env.local not created
- API key name wrong (VITE_ prefix required)
- .env.local not restarted after creation
- API key copied incorrectly

**Fix**:
```bash
# Create .env.local in project root (NOT in src/)
echo "VITE_CLAUDE_API_KEY=sk-ant-YOUR-KEY-HERE" > .env.local

# In code:
const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
console.log('Key exists:', !!apiKey); // Should be true

# Restart dev server
npm run dev
```

**Prevention**:
- Save API key before closing Anthropic console
- Test import immediately: `console.log(import.meta.env.VITE_CLAUDE_API_KEY)`
- Add .env.local to .gitignore BEFORE committing

---

### 7. CORS Error Calling Claude API

**Symptoms**: 
- Error: "Access to XMLHttpRequest blocked by CORS policy"
- Calls work in Postman but not in browser

**Root Cause**:
- Claude API doesn't allow browser requests (needs server)
- Try to call from JavaScript directly (no proxy)

**Solution**:
Option A: Create Node.js backend (can do for bonus +10)
Option B: Use Anthropic official SDK (if available for browser)
Option C: Embed AI responses via API Gateway or Netlify Functions

**For Now (Hacky but works)**:
```javascript
// Use CORS proxy (NOT for production)
const corsProxy = 'https://api.allorigins.win/raw?url=';
const response = await fetch(corsProxy + encodeURIComponent(claudeUrl), {
  headers: { 'Content-Type': 'application/json', ... }
});
```

**Better Solution**:
Create a simple backend endpoint:
```javascript
// backend/api/chat.js (Node.js)
export default async (req, res) => {
  const { question, dataSummary } = req.body;
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({ model: 'claude-3-5-sonnet-20241022', ... })
  });
  return res.json(await response.json());
};
```

---

### 8. AI Response Takes Too Long or Times Out

**Symptoms**:
- Chat stuck with loading spinner for 30+ seconds
- User sees "Request timeout"

**Root Cause**:
- Network latency (API is slow)
- Claude processing large context
- No timeout set on fetch

**Fix**:
```javascript
async function askAI(question, context) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 sec timeout
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      ...
    });
    clearTimeout(timeoutId);
    return await response.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      return { error: 'API took too long. Try again.' };
    }
    throw err;
  }
}
```

---

## Common Data Issues

### 9. Wrong Calculations (Off-by-one, rounding)

**Symptoms**:
- KPI shows 99 properties but should be 100
- Collection shows 18,450 instead of 18,450.50

**Root Cause**:
- Rounding errors in calculations
- Filtering logic excludes edge cases (null, undefined)
- parseInt() instead of parseFloat()

**Fix**:
```javascript
// ❌ Wrong: Loses decimals
const total = properties.reduce((sum, p) => sum + Math.floor(p.collection_inr), 0);

// ✅ Right: Preserve decimals
const total = properties
  .filter(p => p.collection_inr != null) // Exclude null/undefined
  .reduce((sum, p) => sum + (parseFloat(p.collection_inr) || 0), 0);

// Format for display:
const formatted = total.toLocaleString('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2
});
```

---

### 10. Case Sensitivity in City Names

**Symptoms**:
- Filter works for "Delhi" but not "delhi"
- Some cities missing from dropdown

**Root Cause**:
- properties.json has "Delhi", code checks for "delhi"
- Inconsistent case in import/display

**Fix**:
```javascript
// ✅ Normalize city names
const cities = [...new Set(data.map(p => p.tenant.trim().toLowerCase()))];

// ✅ Case-insensitive filtering
const filtered = data.filter(p => 
  p.tenant.toLowerCase() === selectedCity.toLowerCase()
);

// ✅ Or: Maintain original case from data
const cities = [...new Set(data.map(p => p.tenant))]; // Keep original
```

---

## Performance Issues

### 11. Dashboard Slow with 1,000 Records

**Symptoms**:
- Noticeable lag when switching cities
- Takes 2+ seconds to update chart

**Root Cause**:
- Filtering done on every render
- Calculations not memoized
- All 1,000 records processed even for single city

**Fix**:
```javascript
// Use useMemo to cache calculations
const filteredData = useMemo(
  () => data.filter(p => p.tenant === selectedCity),
  [data, selectedCity]
);

const totalCollection = useMemo(
  () => filteredData.reduce((sum, p) => sum + p.collection_inr, 0),
  [filteredData]
);

// For Recharts: Pre-aggregate data
const chartData = useMemo(() => {
  const byCity = {};
  data.forEach(p => {
    byCity[p.tenant] ??= 0;
    byCity[p.tenant] += p.collection_inr;
  });
  return Object.entries(byCity).map(([city, total]) => ({ name: city, value: total }));
}, [data]);
```

**Prevention**:
- Use React DevTools Profiler to identify slow renders
- Profile: "Rank by duration" to find culprits
- Add useMemo to expensive calculations

---

## Testing Checklist

Before final submission, test these scenarios:

### KPI Tests
- [ ] "Delhi" selected → shows Delhi-only data
- [ ] "All Cities" selected → shows aggregated data
- [ ] Switching cities updates all 4 KPIs
- [ ] Collection shows ₹ symbol correctly
- [ ] Large numbers formatted with commas

### Chart Tests
- [ ] All 10 cities visible
- [ ] Hover shows exact values
- [ ] Responsive (test mobile viewport)
- [ ] Update on city filter change
- [ ] Handles empty data gracefully

### AI Chat Tests
- [ ] Sample Q: "Highest collection?" → Correct city
- [ ] Sample Q: "Rejected in Mumbai?" → Exact count
- [ ] Sample Q: "% approved in Delhi?" → Calculated correctly
- [ ] Error message if API fails
- [ ] Loading spinner while waiting

### Edge Cases
- [ ] No collection_inr for pending properties
- [ ] Missing fields in some records
- [ ] Special characters in addresses/names
- [ ] Very long property owner names

---

## Resources for Debugging

| Tool | Purpose | Link |
|------|---------|------|
| React DevTools | Component inspection | [Chrome extension](https://chrome.google.com/webstore) |
| Profiler | Performance analysis | Built into DevTools |
| Network Tab | API debugging | F12 → Network |
| Console | Error messages | F12 → Console |
| Recharts Docs | Chart issues | [recharts.org](https://recharts.org) |

---

**Last Updated**: 2026-05-21  
**Total Issues Tracked**: 11 common patterns  
**Next**: Add issues as you encounter them
