import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer as createViteServer } from 'vite';

// Controllers
import * as authCtrl from './backend/controllers/authController';
import * as itemCtrl from './backend/controllers/itemController';
import * as orderCtrl from './backend/controllers/orderController';

// Middleware
import { auth, authorize } from './backend/middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
const api = express.Router();

// Auth
api.post('/auth/register', authCtrl.register);
api.post('/auth/login', authCtrl.login);

// Items
api.get('/items', itemCtrl.getItems);
api.post('/items', auth, authorize(['shopkeeper']), itemCtrl.addItem);
api.patch('/items/:id/stock', auth, authorize(['shopkeeper']), itemCtrl.toggleStock);
api.delete('/items/:id', auth, authorize(['shopkeeper']), itemCtrl.deleteItem);

// Orders
api.get('/orders', auth, orderCtrl.getOrders);
api.post('/orders', auth, orderCtrl.placeOrder);
api.patch('/orders/:id/status', auth, authorize(['shopkeeper']), orderCtrl.updateStatus);

app.use('/api', api);

// Database Connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGODB_URI not provided. Running in memory mode (limited functionality).');
}

// Vite / Static Files
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite();
