import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  description: String,
  qty: Number,
  rate: Number,
  amount: Number,
});

const InvoiceSchema = new mongoose.Schema({
  customerName: String,
  customerAddress: String,
  customerGSTIN: String,
  items: [ItemSchema],
  transport: Number,
  cgst: Number,
  sgst: Number,
  subtotal: Number,
  cgstAmount: Number,
  sgstAmount: Number,
  grandTotal: Number,
  amountWords: String,
  createdAt: { type: Date, default: Date.now },
});

// module.exports = mongoose.model('Invoice', InvoiceSchema);
export default mongoose.model('Invoice', InvoiceSchema);
