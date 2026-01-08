const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');


router.post('/chat', aiController.getFeaturedBlogInsights);

module.exports = router;