import React, { useState, useEffect } from 'react';
import './App.css'; // We'll create this file next for styling

function App() {
  // --- State for Car 1 Inputs ---
  const [price1, setPrice1] = useState(216988);
  const [loan1, setLoan1] = useState(130000);
  const [tradeIn1, setTradeIn1] = useState(85000);
  const [monthly1, setMonthly1] = useState(1817); // Manual input for now

  // --- State for Car 2 Inputs ---
  const [price2, setPrice2] = useState(171988);
  const [loan2, setLoan2] = useState(90000);
  const [tradeIn2, setTradeIn2] = useState(61000);
  const [monthly2, setMonthly2] = useState(1258); // Manual input for now

  // --- State for Calculated Values (optional, can calculate directly in render) ---
  // We will calculate these directly in the JSX below to ensure they always reflect the latest inputs

  // --- Calculated Values ---
  const balance1 = (price1 || 0) - (loan1 || 0);
  const cash1 = balance1 - (tradeIn1 || 0);

  const balance2 = (price2 || 0) - (loan2 || 0);
  const cash2 = balance2 - (tradeIn2 || 0);

  // --- Totals ---
  const totalPrice = (price1 || 0) + (price2 || 0);
  const totalLoan = (loan1 || 0) + (loan2 || 0);
  const totalBalance = balance1 + balance2;
  const totalTradeIn = (tradeIn1 || 0) + (tradeIn2 || 0);
  const totalCash = cash1 + cash2;
  const totalMonthly = (monthly1 || 0) + (monthly2 || 0);

  // Helper function for formatting numbers as currency
  const formatCurrency = (num) => {
    return num.toLocaleString('en-US', {
      // style: 'currency', // Optional: Adds $ sign
      // currency: 'USD', // Optional: Specify currency
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Generic input handler
  const handleInputChange = (setter) => (event) => {
    // Allow empty input, parse as number otherwise
    const value = event.target.value === '' ? '' : Number(event.target.value);
     // Prevent negative numbers for most fields if desired (optional)
     // if (value !== '' && value < 0) return;
    setter(value);
  };


  return (
    <div className="App">
      <h1>Electric Vehicle Purchase Calculator</h1>

      <div className="inputs-container">
        {/* --- Car 1 Inputs --- */}
        <div className="input-group">
          <h2>Car 1 (e.g., HYPTEC)</h2>
          <label>
            New Car Price ($):
            <input
              type="number"
              value={price1}
              onChange={handleInputChange(setPrice1)}
              placeholder="Enter Price"
            />
          </label>
          <label>
            Loan Amount ($):
            <input
              type="number"
              value={loan1}
              onChange={handleInputChange(setLoan1)}
               placeholder="Enter Loan Amount"
           />
          </label>
          <label>
            Trade-in Value ($):
            <input
              type="number"
              value={tradeIn1}
              onChange={handleInputChange(setTradeIn1)}
               placeholder="Enter Trade-in"
            />
          </label>
           <label>
            Monthly Payment ($):
            <input
              type="number"
              value={monthly1}
              onChange={handleInputChange(setMonthly1)}
               placeholder="Enter Monthly Payment"
           />
          </label>
        </div>

        {/* --- Car 2 Inputs --- */}
        <div className="input-group">
          <h2>Car 2 (e.g., V)</h2>
           <label>
            New Car Price ($):
            <input
              type="number"
              value={price2}
              onChange={handleInputChange(setPrice2)}
               placeholder="Enter Price"
           />
          </label>
          <label>
            Loan Amount ($):
            <input
              type="number"
              value={loan2}
              onChange={handleInputChange(setLoan2)}
               placeholder="Enter Loan Amount"
            />
          </label>
          <label>
            Trade-in Value ($):
            <input
              type="number"
              value={tradeIn2}
              onChange={handleInputChange(setTradeIn2)}
               placeholder="Enter Trade-in"
           />
          </label>
           <label>
            Monthly Payment ($):
            <input
              type="number"
              value={monthly2}
              onChange={handleInputChange(setMonthly2)}
               placeholder="Enter Monthly Payment"
            />
          </label>
        </div>
      </div>

      {/* --- Results Table --- */}
      <h2>Calculation Summary</h2>
      <table className="results-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Car 1 (HYPTEC)</th>
            <th>Car 2 (V)</th>
            <th>Totals</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>New Car Price ($)</td>
            <td>{formatCurrency(price1 || 0)}</td>
            <td>{formatCurrency(price2 || 0)}</td>
            <td>{formatCurrency(totalPrice)}</td>
          </tr>
          <tr>
            <td>Loan Amount ($)</td>
            <td>{formatCurrency(loan1 || 0)}</td>
            <td>{formatCurrency(loan2 || 0)}</td>
            <td>{formatCurrency(totalLoan)}</td>
          </tr>
          <tr className="calculated-row">
            <td>Balance Payable ($)</td>
            <td>{formatCurrency(balance1)}</td>
            <td>{formatCurrency(balance2)}</td>
            <td>{formatCurrency(totalBalance)}</td>
          </tr>
           <tr>
            <td>Trade-in Value ($)</td>
            <td>{formatCurrency(tradeIn1 || 0)}</td>
            <td>{formatCurrency(tradeIn2 || 0)}</td>
            <td>{formatCurrency(totalTradeIn)}</td>
          </tr>
           <tr className="calculated-row final-cash">
            <td>Cash Upfront ($)</td>
            <td>{formatCurrency(cash1)}</td>
            <td>{formatCurrency(cash2)}</td>
            <td>{formatCurrency(totalCash)}</td>
          </tr>
           <tr>
            <td>Monthly Payment ($)</td>
            <td>{formatCurrency(monthly1 || 0)}</td>
            <td>{formatCurrency(monthly2 || 0)}</td>
            <td>{formatCurrency(totalMonthly)}</td>
          </tr>
        </tbody>
         {/* Optional Footer for Totals again */}
         {/* <tfoot>
           <tr>
             <th>Total</th>
             <th>-</th>
             <th>-</th>
             <th>{formatCurrency(totalPrice)}</th> // Example
           </tr>
        </tfoot> */}
      </table>
    </div>
  );
}

export default App;