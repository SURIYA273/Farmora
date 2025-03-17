import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });
const app = express();
const port = process.env.PORT || 3000;

// Supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ======================== Authentication ========================
app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json(user);
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const { session, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json(session);
});

app.post('/api/auth/logout', async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Logged out successfully' });
});

// ======================== Farms ========================
app.get('/api/farms', async (req, res) => {
  const { data, error } = await supabase.from('farms').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/farms', async (req, res) => {
  const { data, error } = await supabase.from('farms').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// ======================== Irrigation & Water Management ========================
app.get('/api/irrigation', async (req, res) => {
  const { data, error } = await supabase.from('irrigation_schedule').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/irrigation', async (req, res) => {
  const { data, error } = await supabase.from('irrigation_schedule').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// ======================== Farm Reports ========================
app.get('/api/farm-reports', async (req, res) => {
  const { data, error } = await supabase.from('farm_reports').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/farm-reports', async (req, res) => {
  const { data, error } = await supabase.from('farm_reports').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// ======================== Notifications ========================
app.get('/api/notifications', async (req, res) => {
  const { data, error } = await supabase.from('notifications').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/notifications', async (req, res) => {
  const { data, error } = await supabase.from('notifications').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// ======================== Health Check ========================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
