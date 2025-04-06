import React, { useState, useEffect } from 'react';
import './App.css'; // We'll update this file next

function App() {
  // --- Shared Loan Parameters ---
  const [interestRate, setInterestRate] = useState(2.48); // Default based on UOB example
  const [loanTermYears, setLoanTermYears] = useState(7); // Default based on UOB example

  // --- State for Car 1 Inputs ---
  const [price1, setPrice1] = useState(216988);
  const [loan1, setLoan1] = useState(130000);
  const [tradeIn1, setTradeIn1] = useState(85000);
  const [targetPercent1, setTargetPercent1] = useState(95); // For the "Set to %" feature

  // --- State for Car 2 Inputs ---
  const [price2, setPrice2] = useState(171988);
  const [loan2, setLoan2] = useState(90000);
  const [tradeIn2, setTradeIn2] = useState(61000);
  const [targetPercent2, setTargetPercent2] = useState(95); // For the "Set to %" feature

  // --- Calculation Functions ---

  // Flat Rate Monthly Payment Calculation
  const calculateMonthlyPayment = (loanAmount, annualRatePercent, termYears) => {
    loanAmount = Number(loanAmount) || 0;
    annualRatePercent = Number(annualRatePercent) || 0;
    termYears = Number(termYears) || 0;

    if (loanAmount <= 0 || annualRatePercent <= 0 || termYears <= 0) {
      return 0; // No payment if inputs are invalid/zero
    }
    const annualRate = annualRatePercent / 100;
    const totalInterest = loanAmount * annualRate * termYears;
    const totalPayable = loanAmount + totalInterest;
    const numberOfMonths = termYears * 12;

    if (numberOfMonths === 0) return 0; // Avoid division by zero

    // Round to match UOB example (integer) - use toFixed(2) for cents
    return Math.round(totalPayable / numberOfMonths);
  };

  // Calculate Loan Percentage
  const calculateLoanPercentage = (loanAmount, carPrice) => {
    loanAmount = Number(loanAmount) || 0;
    carPrice = Number(carPrice) || 0;
    if (carPrice === 0) return 0; // Avoid division by zero
    return (loanAmount / carPrice) * 100;
  };

  // --- Derived Values (Calculated directly for display) ---
  const balance1 = (price1 || 0) - (loan1 || 0);
  const cash1 = balance1 - (tradeIn1 || 0);
  const monthly1 = calculateMonthlyPayment(loan1, interestRate, loanTermYears);
  const loanPercent1 = calculateLoanPercentage(loan1, price1);

  const balance2 = (price2 || 0) - (loan2 || 0);
  const cash2 = balance2 - (tradeIn2 || 0);
  const monthly2 = calculateMonthlyPayment(loan2, interestRate, loanTermYears);
  const loanPercent2 = calculateLoanPercentage(loan2, price2);

  // --- Totals ---
  const totalPrice = (price1 || 0) + (price2 || 0);
  const totalLoan = (loan1 || 0) + (loan2 || 0);
  const totalBalance = balance1 + balance2;
  const totalTradeIn = (tradeIn1 || 0) + (tradeIn2 || 0);
  const totalCash = cash1 + cash2;
  const totalMonthly = monthly1 + monthly2;

  // --- Helper Functions ---

  // Format numbers as currency (without $ sign, with commas)
  const formatNumber = (num) => {
    if (typeof num !== 'number') return '0';
    // Use toLocaleString for comma separation, handle potential NaN
    return (isNaN(num) ? 0 : num).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
  };

   // Format percentage
   const formatPercent = (num) => {
    if (typeof num !== 'number' || isNaN(num)) return '0.0%';
    return num.toFixed(1) + '%'; // One decimal place for percentage
   };

  // Generic input handler (ensures value is treated as number)
  const handleInputChange = (setter) => (event) => {
    const value = event.target.value;
    // Allow empty string for clearing, otherwise convert to number
    setter(value === '' ? '' : Number(value));
  };

   // Handlers to set loan based on percentage
   const handleSetLoanByPercent = (price, targetPercent, loanSetter) => {
      const priceNum = Number(price) || 0;
      const percentNum = Number(targetPercent) || 0;
      if (priceNum > 0 && percentNum > 0) {
          const newLoanAmount = Math.round(priceNum * (percentNum / 100));
          loanSetter(newLoanAmount);
      } else {
          loanSetter(0); // Set loan to 0 if price or percent is invalid
      }
   };


  return (
    <div className="App">
      <h1>Electric Vehicle Purchase Calculator</h1>

      {/* --- Shared Loan Parameters --- */}
      <div className="shared-parameters">
        <h2>Loan Parameters (Shared)</h2>
        <div className="parameter-group">
           <label>
            Annual Interest Rate (%):
            <input
              type="number"
              step="0.01" // Allow decimals
              value={interestRate}
              onChange={handleInputChange(setInterestRate)}
              placeholder="e.g., 2.48"
            />
          </label>
          <label>
            Loan Term (Years):
            <input
              type="number"
              step="1"
              value={loanTermYears}
              onChange={handleInputChange(setLoanTermYears)}
              placeholder="e.g., 7"
            />
          </label>
        </div>
      </div>

      {/* --- Car Specific Inputs --- */}
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
          {/* --- Set Loan by Percentage Feature --- */}
           <div className="set-percentage-group">
             <label htmlFor="targetPercent1Input" className="inline-label">Set loan to:</label>
             <input
                id="targetPercent1Input"
                type="number"
                step="0.1"
                value={targetPercent1}
                onChange={handleInputChange(setTargetPercent1)}
                className="percentage-input"
              /> %
              <button onClick={() => handleSetLoanByPercent(price1, targetPercent1, setLoan1)} className="apply-button">
                Apply %
              </button>
              <span className="calculated-percentage">
                 (Current: {formatPercent(loanPercent1)})
              </span>
           </div>
          {/* --- End Set Loan by Percentage --- */}
          <label>
            Trade-in Value ($):
            <input
              type="number"
              value={tradeIn1}
              onChange={handleInputChange(setTradeIn1)}
              placeholder="Enter Trade-in"
            />
          </label>
          {/* Monthly payment is now calculated, not input */}
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
           {/* --- Set Loan by Percentage Feature --- */}
           <div className="set-percentage-group">
             <label htmlFor="targetPercent2Input" className="inline-label">Set loan to:</label>
             <input
                id="targetPercent2Input"
                type="number"
                step="0.1"
                value={targetPercent2}
                onChange={handleInputChange(setTargetPercent2)}
                className="percentage-input"
              /> %
              <button onClick={() => handleSetLoanByPercent(price2, targetPercent2, setLoan2)} className="apply-button">
                Apply %
              </button>
               <span className="calculated-percentage">
                 (Current: {formatPercent(loanPercent2)})
               </span>
           </div>
           {/* --- End Set Loan by Percentage --- */}
          <label>
            Trade-in Value ($):
            <input
              type="number"
              value={tradeIn2}
              onChange={handleInputChange(setTradeIn2)}
              placeholder="Enter Trade-in"
            />
          </label>
          {/* Monthly payment is now calculated, not input */}
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
            <td>{formatNumber(price1)}</td>
            <td>{formatNumber(price2)}</td>
            <td>{formatNumber(totalPrice)}</td>
          </tr>
          <tr>
            <td>Loan Amount ($)</td>
            <td>{formatNumber(loan1)}</td>
            <td>{formatNumber(loan2)}</td>
            <td>{formatNumber(totalLoan)}</td>
          </tr>
           {/* --- New Row: Loan Percentage --- */}
           <tr className="percentage-row">
              <td>Loan as % of Price</td>
              <td>{formatPercent(loanPercent1)}</td>
              <td>{formatPercent(loanPercent2)}</td>
              <td>{/* Total % isn't very meaningful, so leave blank or calculate weighted avg if needed */}</td>
            </tr>
           {/* --- End New Row --- */}
          <tr className="calculated-row">
            <td>Balance Payable ($)</td>
            <td>{formatNumber(balance1)}</td>
            <td>{formatNumber(balance2)}</td>
            <td>{formatNumber(totalBalance)}</td>
          </tr>
          <tr>
            <td>Trade-in Value ($)</td>
            <td>{formatNumber(tradeIn1)}</td>
            <td>{formatNumber(tradeIn2)}</td>
            <td>{formatNumber(totalTradeIn)}</td>
          </tr>
          <tr className="calculated-row final-cash">
            <td>Cash Upfront ($)</td>
            {/* Add styling for negative cash if needed - basic coloring done in CSS */}
            <td style={{ color: cash1 < 0 ? 'red' : '#28a745' }}>{formatNumber(cash1)}</td>
            <td style={{ color: cash2 < 0 ? 'red' : '#28a745' }}>{formatNumber(cash2)}</td>
            <td style={{ color: totalCash < 0 ? 'red' : '#28a745', fontWeight: 'bold' }}>{formatNumber(totalCash)}</td>
          </tr>
          <tr className="calculated-row">
            <td>Est. Monthly Payment ($)</td>
            <td>{formatNumber(monthly1)}</td>
            <td>{formatNumber(monthly2)}</td>
            <td>{formatNumber(totalMonthly)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;