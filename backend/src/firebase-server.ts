import express from 'express';
import cors from 'cors';
import firebaseRoutes from './firebase-routes';

const app = express();
const port = process.env.PORT || 3001;

// 미들웨어 설정
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
}));

app.use(express.json());

// 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'JobBoard Firebase API is running!' });
});

// Firebase API 라우트
app.use('/api', firebaseRoutes);

// 404 에러 핸들링
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// 전역 에러 핸들링
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`🔥 Firebase JobBoard API server is running on http://localhost:${port}`);
});

export default app;