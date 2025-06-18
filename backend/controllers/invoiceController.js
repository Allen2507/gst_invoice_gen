// const Invoice = require('../models/Invoice');

// exports.createInvoice = async (req, res) => {
//   try {
//     const invoice = new Invoice(req.body);
//     await invoice.save();
//     res.status(201).json(invoice);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getInvoices = async (req, res) => {
//   try {
//     const invoices = await Invoice.find().sort({ createdAt: -1 });
//     res.json(invoices);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


const Invoice = require('../models/Invoice');

exports.createInvoice = async (req, res) => {
  try {
    console.log("Received invoice data:", req.body);

    const invoice = new Invoice(req.body);
    await invoice.save();

    res.status(201).json(invoice);
  } catch (err) {
    console.error(" Error in createInvoice:", err);
    res.status(500).json({ error: err.message });
  }
};
