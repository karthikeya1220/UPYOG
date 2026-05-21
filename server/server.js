import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local from the project root
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Initialize PostgreSQL connection pool
// Defaults to standard Mac local connection parameters
const pool = new pg.Pool({
  user: process.env.PGUSER || 'darshankarthikeya',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'postgres',
  password: process.env.PGPASSWORD || '',
  port: parseInt(process.env.PGPORT, 10) || 5432,
});

// Self-seeding database startup sequence
async function initializeDatabase() {
  try {
    console.log('Connecting to PostgreSQL database...');
    
    // Create properties table if it does not exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS properties (
        property_id VARCHAR PRIMARY KEY,
        tenant VARCHAR NOT NULL,
        owner_name VARCHAR NOT NULL,
        property_type VARCHAR NOT NULL,
        ward VARCHAR NOT NULL,
        area_sqft INTEGER NOT NULL,
        status VARCHAR NOT NULL,
        annual_tax_inr NUMERIC NOT NULL,
        collection_inr NUMERIC NOT NULL,
        registration_date DATE NOT NULL,
        floor_count INTEGER NOT NULL,
        address TEXT NOT NULL
      );
    `);
    console.log('Verified database tables exist.');

    // Check if table is empty
    const checkRes = await pool.query('SELECT COUNT(*) FROM properties');
    const count = parseInt(checkRes.rows[0].count, 10);

    if (count === 0) {
      console.log('Properties table is empty. Starting self-seeding routine...');
      
      const propertiesPath = path.join(__dirname, '../src/data/properties.json');
      if (!fs.existsSync(propertiesPath)) {
        throw new Error(`Data source file not found at: ${propertiesPath}`);
      }

      const rawData = fs.readFileSync(propertiesPath, 'utf8');
      const properties = JSON.parse(rawData);

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        console.log(`Inserting ${properties.length} records in a single transaction...`);

        for (const p of properties) {
          await client.query(
            `INSERT INTO properties (
              property_id, tenant, owner_name, property_type, ward, 
              area_sqft, status, annual_tax_inr, collection_inr, 
              registration_date, floor_count, address
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [
              p.property_id,
              p.tenant,
              p.owner_name,
              p.property_type,
              p.ward,
              p.area_sqft,
              p.status,
              p.annual_tax_inr,
              p.collection_inr,
              p.registration_date,
              p.floor_count,
              p.address
            ]
          );
        }

        await client.query('COMMIT');
        console.log('Seeding completed successfully!');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } else {
      console.log(`Database already populated with ${count} properties.`);
    }
  } catch (err) {
    console.error('Critical database initialization error:', err);
    process.exit(1);
  }
}

// Helper function to build WHERE clause dynamically based on query params
function buildFilterQuery(queryParams) {
  const { city, ward, status, startDate, endDate, search } = queryParams;
  let whereClauses = [];
  const params = [];
  let paramIndex = 1;

  if (city && city !== 'All Cities') {
    whereClauses.push(`LOWER(tenant) = LOWER($${paramIndex})`);
    params.push(city);
    paramIndex++;
  }
  if (ward && ward !== 'All Wards') {
    whereClauses.push(`LOWER(ward) = LOWER($${paramIndex})`);
    params.push(ward);
    paramIndex++;
  }
  if (status && status !== 'All Statuses') {
    whereClauses.push(`LOWER(status) = LOWER($${paramIndex})`);
    params.push(status);
    paramIndex++;
  }
  if (startDate) {
    whereClauses.push(`registration_date >= $${paramIndex}`);
    params.push(startDate);
    paramIndex++;
  }
  if (endDate) {
    whereClauses.push(`registration_date <= $${paramIndex}`);
    params.push(endDate);
    paramIndex++;
  }
  if (search) {
    whereClauses.push(`(LOWER(owner_name) LIKE LOWER($${paramIndex}) OR LOWER(property_id) LIKE LOWER($${paramIndex}))`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereSql = whereClauses.length > 0 ? ` WHERE ${whereClauses.join(' AND ')}` : '';
  return { whereSql, params, nextParamIndex: paramIndex };
}

// Endpoint: GET /api/properties (Paginated list of properties)
app.get('/api/properties', async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { whereSql, params, nextParamIndex } = buildFilterQuery(req.query);

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM properties${whereSql}`;
    const countRes = await pool.query(countQuery, params);
    const totalCount = parseInt(countRes.rows[0].count, 10);

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 8;
    const offset = (pageNum - 1) * limitNum;

    const query = `
      SELECT * FROM properties
      ${whereSql}
      ORDER BY property_id ASC
      LIMIT $${nextParamIndex} OFFSET $${nextParamIndex + 1}
    `;
    
    const queryParams = [...params, limitNum, offset];
    const propertiesRes = await pool.query(query, queryParams);

    res.json({
      properties: propertiesRes.rows,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
    });
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: GET /api/properties/export (Non-paginated filtered properties for CSV export)
app.get('/api/properties/export', async (req, res) => {
  try {
    const { whereSql, params } = buildFilterQuery(req.query);
    const query = `
      SELECT * FROM properties
      ${whereSql}
      ORDER BY property_id ASC
    `;
    const propertiesRes = await pool.query(query, params);
    res.json(propertiesRes.rows);
  } catch (err) {
    console.error('Error exporting properties:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: GET /api/analytics/kpis (Dynamically calculates KPIs based on active filters)
app.get('/api/analytics/kpis', async (req, res) => {
  try {
    const { whereSql, params } = buildFilterQuery(req.query);
    const query = `
      SELECT 
        COUNT(*) as "totalRegistered",
        SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as "approved",
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as "rejected",
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as "pending",
        SUM(CASE WHEN status = 'Approved' THEN collection_inr ELSE 0 END) as "totalCollection"
      FROM properties
      ${whereSql}
    `;

    const kpiRes = await pool.query(query, params);
    const row = kpiRes.rows[0];

    res.json({
      totalRegistered: parseInt(row.totalRegistered, 10) || 0,
      approved: parseInt(row.approved, 10) || 0,
      rejected: parseInt(row.rejected, 10) || 0,
      pending: parseInt(row.pending, 10) || 0,
      totalCollection: parseFloat(row.totalCollection) || 0,
    });
  } catch (err) {
    console.error('Error fetching KPIs:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: GET /api/analytics/summaries (Aggregates collections and counts per city for comparison chart)
app.get('/api/analytics/summaries', async (req, res) => {
  try {
    const query = `
      SELECT 
        tenant as "city",
        COUNT(*) as "totalRegistered",
        SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as "approved",
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as "rejected",
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as "pending",
        SUM(CASE WHEN status = 'Approved' THEN collection_inr ELSE 0 END) as "totalCollection"
      FROM properties
      GROUP BY tenant
      ORDER BY "totalCollection" DESC
    `;

    const summariesRes = await pool.query(query);
    const summaries = summariesRes.rows.map(r => ({
      city: r.city,
      totalRegistered: parseInt(r.totalRegistered, 10) || 0,
      approved: parseInt(r.approved, 10) || 0,
      rejected: parseInt(r.rejected, 10) || 0,
      pending: parseInt(r.pending, 10) || 0,
      totalCollection: parseFloat(r.totalCollection) || 0,
    }));

    res.json(summaries);
  } catch (err) {
    console.error('Error fetching aggregates:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: GET /api/analytics/type-distribution (Aggregates count of properties by type)
app.get('/api/analytics/type-distribution', async (req, res) => {
  try {
    const { whereSql, params } = buildFilterQuery(req.query);
    const query = `
      SELECT 
        property_type as "name",
        COUNT(*) as "value"
      FROM properties
      ${whereSql}
      GROUP BY property_type
      ORDER BY "value" DESC
    `;

    const distRes = await pool.query(query, params);
    const data = distRes.rows.map(r => ({
      name: r.name,
      value: parseInt(r.value, 10) || 0
    }));

    res.json(data);
  } catch (err) {
    console.error('Error fetching type distribution:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: GET /api/wards (Unique list of wards for a city)
app.get('/api/wards', async (req, res) => {
  try {
    const { city } = req.query;
    let query = 'SELECT DISTINCT ward FROM properties';
    const params = [];

    if (city && city !== 'All Cities') {
      query += ' WHERE LOWER(tenant) = LOWER($1)';
      params.push(city);
    }
    query += ' ORDER BY ward ASC';

    const wardsRes = await pool.query(query, params);
    res.json(wardsRes.rows.map(r => r.ward));
  } catch (err) {
    console.error('Error fetching wards:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: GET /api/cities (Unique list of cities)
app.get('/api/cities', async (req, res) => {
  try {
    const query = 'SELECT DISTINCT tenant FROM properties ORDER BY tenant ASC';
    const citiesRes = await pool.query(query);
    res.json(citiesRes.rows.map(r => r.tenant));
  } catch (err) {
    console.error('Error fetching cities:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: POST /api/chat (Secure proxy for Gemini API)
app.post('/api/chat', async (req, res) => {
  try {
    const { question, activeCity } = req.body;
    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your-gemini-api-key-here') {
      return res.status(400).json({ 
        error: 'Gemini API key is not configured on the server. Please check your .env.local file.' 
      });
    }

    // Dynamic database aggregations for prompt context
    const summaryRes = await pool.query(`
      SELECT 
        COUNT(*) as "totalProperties",
        SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as "approved",
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as "rejected",
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as "pending",
        SUM(CASE WHEN status = 'Approved' THEN collection_inr ELSE 0 END) as "totalCollection"
      FROM properties
    `);
    const cityBreakdownRes = await pool.query(`
      SELECT 
        tenant as "city",
        COUNT(*) as "total",
        SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as "approved",
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as "rejected",
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as "pending",
        SUM(CASE WHEN status = 'Approved' THEN collection_inr ELSE 0 END) as "collection"
      FROM properties
      GROUP BY tenant
    `);

    const dataSummary = {
      totalProperties: parseInt(summaryRes.rows[0].totalProperties, 10),
      approved: parseInt(summaryRes.rows[0].approved, 10),
      rejected: parseInt(summaryRes.rows[0].rejected, 10),
      pending: parseInt(summaryRes.rows[0].pending, 10),
      totalCollection: parseFloat(summaryRes.rows[0].totalCollection),
      cityBreakdown: cityBreakdownRes.rows.reduce((acc, r) => {
        acc[r.city] = {
          total: parseInt(r.total, 10),
          approved: parseInt(r.approved, 10),
          rejected: parseInt(r.rejected, 10),
          pending: parseInt(r.pending, 10),
          collection: parseFloat(r.collection) || 0
        };
        return acc;
      }, {})
    };

    const systemPrompt = `You are UPYOG's Property Tax AI Assistant. You have access to a dataset of 1,000 property records across 10 Indian cities.
Answer the user's question using ONLY the following summarized data. 
If the answer cannot be calculated from the context, politely explain that you don't have that information.
Keep your response short and precise (1-2 sentences max). Always format currency amounts in INR (₹) using Indian number grouping (e.g. ₹12,34,567).

DATASET CONTEXT SUMMARY:
${JSON.stringify(dataSummary, null, 2)}

Active Filter City: ${activeCity || 'All Cities'}
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser Question: ${question}\nAnswer:`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 150
        }
      })
    });

    if (!apiResponse.ok) {
      throw new Error(`API error: ${apiResponse.statusText}`);
    }

    const resJson = await apiResponse.json();
    const responseText = resJson.contents?.[0]?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }

    res.json({ answer: responseText.trim() });
  } catch (err) {
    console.error('Error processing chat assistant proxy request:', err);
    res.status(500).json({ error: err.message || 'Error communicating with AI service' });
  }
});

// Start Express server and run db self-seeding sequence
app.listen(PORT, async () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  await initializeDatabase();
});
