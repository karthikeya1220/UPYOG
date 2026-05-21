# PROMPTS.md

Store high-quality AI prompts for code generation, debugging, and data analysis.

---

## 1. Code Review Prompt

**Use Case**: Review React components for quality

```
Review the following React component for:
- Performance (unnecessary re-renders, missing memoization)
- Accessibility (ARIA labels, semantic HTML)
- Best practices (prop naming, error handling)
- Tailwind usage (utility consistency, responsive design)
- Type safety (missing PropTypes)

Provide specific suggestions with code examples.

Component:
[INSERT CODE]

Format: List issues as "Issue: Fix:" pairs.
```

---

## 2. Data Analysis Prompt (For Chat Context)

**Use Case**: Generate AI context from properties data

```
Analyze this property tax dataset and provide a concise summary:

Dataset Summary:
{
  "totalProperties": 1000,
  "cities": ["Delhi", "Mumbai", "Pune", ...],
  "citySummary": {
    "Delhi": {
      "totalRegistered": 120,
      "approved": 85,
      "rejected": 15,
      "pending": 20,
      "totalCollection": 1250000
    },
    ...
  },
  "topCity": "Mumbai",
  "highestRejectionCity": "Pune"
}

Based on this, when a user asks a question, answer accurately using:
1. The exact numbers from the data
2. Percentages calculated from the totals
3. City comparisons directly from the dataset

Always cite which city you're referring to. Be concise but accurate.
```

---

## 3. Data Aggregation Function Generation

**Use Case**: Generate utility functions for calculations

```
Generate JavaScript functions to calculate these metrics from an array of property objects:

Properties structure:
{
  property_id: string,
  tenant: string,
  status: "Approved" | "Rejected" | "Pending",
  collection_inr: number,
  area_sqft: number,
  annual_tax_inr: number,
  registration_date: string
}

Create functions:
1. getTotalPropertiesBy(data, city) → number
2. getApprovedBy(data, city) → number
3. getRejectedBy(data, city) → number
4. getTotalCollectionBy(data, city) → number
5. getAggregateByCity(data) → { [city]: { total, approved, rejected, collection } }

Include:
- JSDoc comments
- Input validation (check for null/undefined)
- Handle case-sensitivity in city names
- Return 0 if no data found (don't error)

Use vanilla JavaScript (no libraries).
```

---

## 4. React Hook Generation

**Use Case**: Create custom data hooks

```
Generate a custom React hook called "usePropertyData" that:

1. Imports properties.json (1,000 records)
2. Maintains state for "selectedCity" (default: "All Cities")
3. Provides these properties/methods:
   - allData: full array of 1,000 properties
   - cities: ["Delhi", "Mumbai", ...] (10 cities)
   - selectedCity: current filter
   - setSelectedCity(city): function to update filter
   - filteredData: properties for selected city
   - totalProperties: count
   - approvedCount: count of approved
   - rejectedCount: count of rejected
   - totalCollection: sum of collection_inr
   - citySummary: aggregated data for all cities

4. Recalculate on selectedCity change

Include:
- Proper dependencies in useEffect
- Memoized calculations (useMemo)
- Comment explaining each section

Return an object with all properties.
```

---

## 5. Component UI Generation: KPI Card

**Use Case**: Generate reusable KPI display component

```
Create a React component called "KpiCard" that displays a single metric:

Props:
- title: string (e.g., "Total Properties")
- value: number | string
- icon: React component (optional)
- color: "blue" | "green" | "red" | "amber" (for icon background)
- format: "number" | "currency" | "percent" (optional)

Requirements:
- Use Tailwind CSS (no Material-UI)
- Rounded corners (rounded-lg)
- Shadow effect
- Icon on left, value + title on right
- Responsive (stack on mobile)
- Format values: 18450.50 as "₹18,450.50" if currency, etc.

Return a clean, professional card with proper spacing.
```

---

## 6. Chart Component Generation

**Use Case**: Create bar chart for city comparison

```
Create a React component using Recharts that displays:

Chart Type: Bar Chart
X-Axis: City names (all 10 cities)
Y-Axis: Total collection (₹ in rupees)
Data Input: Array of { city, totalCollection }

Requirements:
- Responsive to container width
- Show ₹ symbol on Y-axis
- Hover tooltip shows city name + exact amount
- Colors: use Tailwind colors (blue-500 as primary)
- Mobile: rotate labels 45° if width < 768px
- Legend at bottom

Props:
- data: array of {city, totalCollection}
- height: number (default 300)
- loading: boolean (show spinner if true)

Import from "recharts".
```

---

## 7. Chat UI Component Generation

**Use Case**: Create message display + input box

```
Create a React component called "ChatAssistant" that:

Visual Layout:
- Header: "Property Tax Analytics Assistant"
- Messages area: scrollable, 300px height
  - User messages: blue background, right-aligned
  - AI messages: gray background, left-aligned
- Input area: text input + send button (fixed at bottom)

State:
- messages: array of {role: "user"|"assistant", text: string}
- inputValue: string
- isLoading: boolean (show spinner during API call)

Functions:
- handleSend(): validate input, add to messages, call API
- handleInputChange(e): update inputValue
- Auto-scroll to latest message

Styling:
- Tailwind CSS only
- Clean, professional (white background)
- Message bubbles with padding/border-radius
- Loading indicator (spinner)

Return the component.
```

---

## 8. Bug Debugging Prompt

**Use Case**: When state updates aren't reflected in UI

```
The component is not re-rendering when state changes. Here's the code:

[INSERT CODE]

Debug checklist:
1. Are state updates in useEffect? (Check dependencies)
2. Is setState called correctly?
3. Are there multiple useState calls in wrong order?
4. Is component wrapped in React.memo() improperly?
5. Are child components memoized with stale props?

Find the issue and provide the fix with explanation.
```

---

## 9. API Integration Prompt

**Use Case**: Setup Claude API calls with context

```
Create a function "askPropertyQuestion(userQuestion, dataSummary, apiKey)" that:

1. Takes:
   - userQuestion: user's plain English question (e.g., "Which city has highest collection?")
   - dataSummary: object with aggregated data {cities, totals, etc.}
   - apiKey: Claude API key from .env

2. Constructs a message to Claude with:
   - System message: "You are a property tax analyst. Answer using ONLY the provided data."
   - User message: dataSummary + userQuestion
   - Instructions: "Be concise (1-2 sentences). Always cite the city name."

3. Calls Claude API at https://api.anthropic.com/v1/messages

4. Returns: string (AI's response text)

5. Error handling: catch and return helpful error message

Include:
- Proper async/await
- Timeout handling (30 seconds max)
- Request validation
- Comments explaining each step

Use fetch() (no SDK dependencies).
```

---

## 10. Performance Optimization Prompt

**Use Case**: When app feels slow

```
The React dashboard is slow when filtering between cities. Analyze this code:

[INSERT CODE]

Check for:
1. Unnecessary re-renders (add React DevTools profiler)
2. Large calculations in render path (move to useMemo)
3. Child components re-rendering without props change
4. Unoptimized Recharts (check data format)
5. Inefficient filtering (O(n) vs O(n²))

Suggest optimizations with priority (quick wins first).
```

---

## 11. TypeScript Prop Types Generation

**Use Case**: Add runtime prop validation

```
Create PropTypes for these React components:

Components:
1. KpiCard (title, value, icon, color, format)
2. TenantFilter (cities, selectedCity, onSelect)
3. ComparisonChart (data, loading)
4. ChatAssistant (onSendMessage, isLoading)

Requirements:
- Use PropTypes library
- Mark required vs optional
- Include default values
- Use PropTypes.oneOf() for enums (color, format)
- Validate data shapes (array of objects)

Provide the PropTypes export for each.
```

---

## 12. Testing Data Prompt

**Use Case**: Generate sample test data

```
Create a small dataset of property records for unit testing:

Need 3 records per city (3 cities = 9 total):
- Delhi: 2 Approved, 1 Pending
- Mumbai: 1 Approved, 1 Rejected, 1 Approved
- Pune: 2 Rejected, 1 Pending

Structure:
{
  property_id: "UPYOG-[CITY-CODE]-[0000]",
  tenant: "[City Name]",
  status: "Approved" | "Rejected" | "Pending",
  collection_inr: [amount if Approved, 0 if not],
  ...other fields
}

Make numbers easy to verify in tests:
- Delhi approved collection: exactly 1000 each = 2000 total
- Mumbai approved collection: 500 each = 1000 total
- Pune collection: 0 (all rejected/pending)

Export as constant for test files.
```

---

## How to Use These Prompts

1. **Copy the prompt** exactly as written
2. **Replace placeholders** ([INSERT CODE], {field}, etc.)
3. **Paste into Claude chat** or API call
4. **Refine based on output** — adjust if output doesn't match needs

---

## When to Create New Prompts

- Writing the same code pattern multiple times
- Debugging the same type of error repeatedly
- Using a prompt successfully (save it!)
- Discovering a better way to ask something

Update this file as you discover better prompts.

---

## Quick Reference

| Prompt | Purpose | Complexity |
|--------|---------|-----------|
| Code Review | QA | Medium |
| Data Analysis | AI Context | High |
| Data Functions | Backend | Medium |
| React Hook | Frontend | Medium |
| KPI Card | Components | Easy |
| Chart | Components | Medium |
| Chat UI | Components | Medium |
| Bug Debug | Troubleshooting | High |
| API Integration | Backend | High |
| Performance | Optimization | High |
| PropTypes | Type Safety | Easy |
| Test Data | Testing | Easy |

---

**Last Updated**: 2026-05-21  
**Status**: 12 prompts ready to use  
**Next**: Add prompts as you discover patterns
