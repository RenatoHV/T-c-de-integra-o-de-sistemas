const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const response = {
    status: "healthy",
    versao: "1.0.0",
    timestamp: new Date().toISOString()
  };
  res.json(response);
});

module.exports = router;
