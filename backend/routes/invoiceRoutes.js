const express = require('express');
const router = express.Router();
const { createInvoice, getInvoices } = require('../controllers/invoiceController');

router.post('/invoices', createInvoice);
router.get('/invoices', getInvoices);

module.exports = router;
