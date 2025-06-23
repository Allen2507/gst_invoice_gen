





import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toWords } from 'number-to-words';
import '../styles/InvoiceForm.css';

const InvoiceForm = () => {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: '',
    address: '',
    gstin: ''
  });

  const [items, setItems] = useState([
    { description: '', qty: '', rate: '', amount: '' }
  ]);

  const [charges, setCharges] = useState({
    transport: '',
    cgst: 2.5,
    sgst: 2.5
  });

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...items];
    updated[index][name] = value;

    if (name === 'qty' || name === 'rate') {
      const qty = parseFloat(updated[index].qty) || 0;
      const rate = parseFloat(updated[index].rate) || 0;
      updated[index].amount = (qty * rate).toFixed(2);
    }

    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { description: '', qty: '', rate: '', amount: '' }]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleChargesChange = (e) => {
    const { name, value } = e.target;
    setCharges((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreview = async () => {
    const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);
    const transport = parseFloat(charges.transport) || 0;
    const cgstAmount = (subtotal + transport) * (parseFloat(charges.cgst) || 0) / 100;
    const sgstAmount = (subtotal + transport) * (parseFloat(charges.sgst) || 0) / 100;
    const grandTotal = subtotal + transport + cgstAmount + sgstAmount;
    const amountWords = toWords(Math.round(grandTotal)).toUpperCase() + ' RUPEES ONLY';

    const invoiceData = {
      customerName: customer.name,
      customerAddress: customer.address,
      customerGSTIN: customer.gstin,
      items: items.map(item => ({
        description: item.description,
        qty: parseFloat(item.qty) || 0,
        rate: parseFloat(item.rate) || 0,
        amount: parseFloat(item.amount) || 0,
      })),
      transport,
      cgst: parseFloat(charges.cgst) || 0,
      sgst: parseFloat(charges.sgst) || 0,
      subtotal,
      cgstAmount,
      sgstAmount,
      grandTotal,
      amountWords
    };

    try {
      console.log('Invoice data sent to server:', invoiceData);
      await axios.post('http://localhost:5000/api/invoices', invoiceData);
      console.log(' Invoice saved to DB');
      navigate('/preview', { state: { customer, items, charges } });
    } catch (error) {
      console.error('Error saving invoice:', error.message);
      alert('Failed to save invoice. Please check the server logs or MongoDB connection.');
    }
  };

  return (
    <div className="invoice-form">
      <div className="form-header">
        <h1 className="form-title">GST Invoice Generator</h1>
      </div>

      <div className="form-group">
        <label className="form-label">Customer Name</label>
        <input
          type="text"
          name="name"
          value={customer.name}
          onChange={handleCustomerChange}
          className="form-input"
          placeholder="Enter customer name"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Customer Address</label>
        <textarea
          name="address"
          value={customer.address}
          onChange={handleCustomerChange}
          className="form-textarea"
          placeholder="Enter complete address"
        />
      </div>

      <div className="form-group mb-3">
        <label className="form-label">Customer GSTIN</label>
        <input
          type="text"
          name="gstin"
          value={customer.gstin}
          onChange={handleCustomerChange}
          className="form-input"
          placeholder="GSTIN number"
        />
      </div>

      <h3 className="section-title">Items Details</h3>
      <div className="item-container">
        {items.map((item, index) => (
          <div key={index} className="item-row">
            <input
              type="text"
              name="description"
              value={item.description}
              onChange={(e) => handleItemChange(index, e)}
              className="item-input"
              placeholder="Item description"
            />
            <input
              type="number"
              name="qty"
              value={item.qty}
              onChange={(e) => handleItemChange(index, e)}
              className="item-input"
              placeholder="Qty"
              min="0"
            />
            <input
              type="number"
              name="rate"
              value={item.rate}
              onChange={(e) => handleItemChange(index, e)}
              className="item-input"
              placeholder="Rate"
              min="0"
              step="0.01"
            />
            <input
              type="number"
              name="amount"
              value={item.amount}
              readOnly
              className="item-input"
              placeholder="Amount"
            />
            <button
              onClick={() => removeItem(index)}
              className="btn btn-danger"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button onClick={addItem} className="btn btn-success mb-3">
        Add New Item
      </button>

      <h3 className="section-title">Tax & Charges</h3>
      <div className="charges-grid">
        <div className="form-group">
          <label className="form-label">Transport Charges (₹)</label>
          <input
            type="number"
            name="transport"
            value={charges.transport}
            onChange={handleChargesChange}
            className="form-input"
            min="0"
          />
        </div>
        <div className="form-group">
          <label className="form-label">CGST (%)</label>
          <input
            type="number"
            name="cgst"
            value={charges.cgst}
            onChange={handleChargesChange}
            className="form-input"
            min="0"
            step="0.1"
          />
        </div>
        <div className="form-group">
          <label className="form-label">SGST (%)</label>
          <input
            type="number"
            name="sgst"
            value={charges.sgst}
            onChange={handleChargesChange}
            className="form-input"
            min="0"
            step="0.1"
          />
        </div>
      </div>

      <div className="button-group text-center">
        <button onClick={handlePreview} className="btn btn-primary">
          Preview Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoiceForm;
