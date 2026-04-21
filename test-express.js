import express from 'express';
const app = express();
try {
  app.use('/api/auth', (req, res) => res.send('ok'));
  console.log('app.use works');
} catch(e) { console.log(e.message); }
