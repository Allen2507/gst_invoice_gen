import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import {toWords} from 'number-to-words';
import '../styles/InvoicePreview.css';

const companyInfo = {
  name: 'NEW JJ CATERERS',
  address: 'No.131 Door No.1D, KKR Doctor’s Court, M.H. Road, Perambur, Chennai-600011',
  gstin: '33AAJPE1075G1Z4',
  mobile: '+91 98848 15501',
  bank: {
    accNo: '1234567890',
    ifsc: 'ABCD0123456',
    bankName: 'XYZ Bank',
    branch: 'Chennai'
  },
  logo: '/logo.png',
  signature: '/signature.png'
};

const InvoicePreview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  if (!state) return <p>No invoice data found</p>;

  const { customer, items, charges } = state;

  const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);
  const transport = parseFloat(charges.transport) || 0;
  const cgst = (subtotal + transport) * (parseFloat(charges.cgst) || 0) / 100;
  const sgst = (subtotal + transport) * (parseFloat(charges.sgst) || 0) / 100;
  const grandTotal = subtotal + transport + cgst + sgst;
  const amountInWords = toWords(Math.round(grandTotal)).toUpperCase()+' RUPEES ONLY';

  const downloadPDF = () => {
    const invoiceElement = document.getElementById('invoicePreview');
    html2pdf().from(invoiceElement).save('invoice.pdf');
  };

  return (
    <div style={{ padding: '20px', background: '#f7f7f7' }}>
      <div id="invoicePreview" style={{ background: 'white', padding: '20px', maxWidth: '900px', margin: 'auto', border: '1px solid #ccc' }}>
        <div style={{ textAlign: 'center' }}>
          <img src={companyInfo.logo} alt="Logo" style={{ width: '100px' }} />
          <h2>{companyInfo.name}</h2>
          <p>{companyInfo.address}</p>
          <p><strong>GSTIN:</strong> {companyInfo.gstin}</p>
          <p><strong>Mobile:</strong> {companyInfo.mobile}</p>
        </div>

        <hr />

        <h3>Customer Details</h3>
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Address:</strong> {customer.address}</p>
        <p><strong>GSTIN:</strong> {customer.gstin}</p>

        <h3>Items</h3>
        <table width="100%" border="1" cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              {/* <th>Date</th> */}
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                {/* <td>{item.date}</td> */}
                <td>{item.description}</td>
                <td>{item.qty}</td>
                <td>{item.rate}</td>
                <td>{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Summary</h3>
        <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
        <p><strong>Transport:</strong> ₹{transport.toFixed(2)}</p>
        <p><strong>CGST:</strong> ₹{cgst.toFixed(2)}</p>
        <p><strong>SGST:</strong> ₹{sgst.toFixed(2)}</p>
        <p><strong>Grand Total:</strong> ₹{grandTotal.toFixed(2)}</p>
        <p><strong>Amount in Words:</strong> <span className='amount-in-words'>{amountInWords} </span> </p>

        <h3>Bank Details</h3>
        <p><strong>Bank:</strong> {companyInfo.bank.bankName}, {companyInfo.bank.branch}</p>
        <p><strong>Account No:</strong> {companyInfo.bank.accNo}</p>
        <p><strong>IFSC:</strong> {companyInfo.bank.ifsc}</p>

        <div style={{ marginTop: '40px' }}>
          <p><strong>Authorized Signature:</strong></p>
          <img src={companyInfo.signature} alt="Signature" style={{ width: '150px' }} />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={downloadPDF} style={{ marginRight: '10px' }}>Download PDF</button>
        <button onClick={() => navigate('/')}>Go Back to Edit</button>
      </div>
    </div>
  );
};

export default InvoicePreview;
