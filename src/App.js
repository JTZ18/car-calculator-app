import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import "./App.css";

// Configuration Comparison Component
const ConfigComparison = ({ configA, configB }) => {
  if (!configA || !configB) return null;

  // Helper function to calculate delta
  const calculateDelta = (valueA, valueB) => {
    const numA = Number(valueA) || 0;
    const numB = Number(valueB) || 0;
    return numB - numA;
  };

  // Helper function to calculate percentage delta
  const calculatePercentDelta = (valueA, valueB) => {
    const numA = Number(valueA) || 0;
    const numB = Number(valueB) || 0;

    if (numA === 0) return numB === 0 ? 0 : 100; // Handle division by zero
    return ((numB - numA) / numA) * 100;
  };

  // Format percentage delta with + or - sign
  const formatPercentDelta = (percentDelta) => {
    if (isNaN(percentDelta) || !isFinite(percentDelta)) return "N/A";
    const sign = percentDelta >= 0 ? "+" : "";
    return `${sign}${percentDelta.toFixed(1)}%`;
  };

  // Format number delta with + or - sign
  const formatDelta = (delta, isCurrency = true) => {
    if (isNaN(delta) || !isFinite(delta)) return "N/A";
    const sign = delta >= 0 ? "+" : "";
    if (isCurrency) {
      return `${sign}$${Math.abs(delta).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    }
    return `${sign}${delta.toFixed(2)}`;
  };

  // Style based on value comparison (green for increase, red for decrease)
  const getDeltaStyle = (delta, inverseColor = false) => {
    if (delta === 0) return { color: "#6c757d" }; // Grey for no change

    // Determine if it's positive or negative
    const isPositive = delta > 0;

    // If inverseColor is true, we flip the colors (e.g., for costs, increase = red)
    const goodColor = inverseColor ? "#dc3545" : "#28a745"; // Green or red
    const badColor = inverseColor ? "#28a745" : "#dc3545"; // Red or green

    return {
      color: isPositive ? goodColor : badColor,
      fontWeight: "bold"
    };
  };

  return (
    <div className="config-comparison">
      <h3>Configuration Comparison</h3>
      <p className="comparison-description">
        Showing changes from Configuration A (left) to Configuration B (right).
        Green indicates beneficial changes, red indicates adverse changes.
      </p>

      <div className="comparison-columns">
        <div className="comparison-column">
          <h4>Configuration A</h4>
        </div>
        <div className="comparison-column">
          <h4>Configuration B</h4>
        </div>
        <div className="comparison-column">
          <h4>Absolute Δ</h4>
        </div>
        <div className="comparison-column">
          <h4>Percentage Δ</h4>
        </div>
      </div>

      <div className="comparison-section">
        <h5>Loan Parameters</h5>
        <div className="comparison-row">
          <div className="comparison-label">Interest Rate (%)</div>
          <div className="comparison-value">{configA.interestRate}</div>
          <div className="comparison-value">{configB.interestRate}</div>
          <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.interestRate, configB.interestRate), true)}>
            {formatDelta(calculateDelta(configA.interestRate, configB.interestRate), false)}
          </div>
          <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.interestRate, configB.interestRate), true)}>
            {formatPercentDelta(calculatePercentDelta(configA.interestRate, configB.interestRate))}
          </div>
        </div>
        <div className="comparison-row">
          <div className="comparison-label">Loan Term (Years)</div>
          <div className="comparison-value">{configA.loanTermYears}</div>
          <div className="comparison-value">{configB.loanTermYears}</div>
          <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.loanTermYears, configB.loanTermYears), false)}>
            {formatDelta(calculateDelta(configA.loanTermYears, configB.loanTermYears), false)}
          </div>
          <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.loanTermYears, configB.loanTermYears), false)}>
            {formatPercentDelta(calculatePercentDelta(configA.loanTermYears, configB.loanTermYears))}
          </div>
        </div>
        <div className="comparison-row">
          <div className="comparison-label">Seller Discount ($)</div>
          <div className="comparison-value">{configA.discountAmount}</div>
          <div className="comparison-value">{configB.discountAmount}</div>
          <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.discountAmount, configB.discountAmount), false)}>
            {formatDelta(calculateDelta(configA.discountAmount, configB.discountAmount))}
          </div>
          <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.discountAmount, configB.discountAmount), false)}>
            {formatPercentDelta(calculatePercentDelta(configA.discountAmount, configB.discountAmount))}
          </div>
        </div>
      </div>

      {configA.useCar1 && configB.useCar1 && (
        <div className="comparison-section">
          <h5>Car 1 Parameters</h5>
          <div className="comparison-row">
            <div className="comparison-label">Car 1 Price ($)</div>
            <div className="comparison-value">{configA.price1}</div>
            <div className="comparison-value">{configB.price1}</div>
            <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.price1, configB.price1), true)}>
              {formatDelta(calculateDelta(configA.price1, configB.price1))}
            </div>
            <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.price1, configB.price1), true)}>
              {formatPercentDelta(calculatePercentDelta(configA.price1, configB.price1))}
            </div>
          </div>
          <div className="comparison-row">
            <div className="comparison-label">Car 1 Loan Amount ($)</div>
            <div className="comparison-value">{configA.loan1}</div>
            <div className="comparison-value">{configB.loan1}</div>
            <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.loan1, configB.loan1), true)}>
              {formatDelta(calculateDelta(configA.loan1, configB.loan1))}
            </div>
            <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.loan1, configB.loan1), true)}>
              {formatPercentDelta(calculatePercentDelta(configA.loan1, configB.loan1))}
            </div>
          </div>
          <div className="comparison-row">
            <div className="comparison-label">Car 1 Trade-in Value ($)</div>
            <div className="comparison-value">{configA.tradeIn1}</div>
            <div className="comparison-value">{configB.tradeIn1}</div>
            <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.tradeIn1, configB.tradeIn1), false)}>
              {formatDelta(calculateDelta(configA.tradeIn1, configB.tradeIn1))}
            </div>
            <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.tradeIn1, configB.tradeIn1), false)}>
              {formatPercentDelta(calculatePercentDelta(configA.tradeIn1, configB.tradeIn1))}
            </div>
          </div>
          <div className="comparison-row">
            <div className="comparison-label">Car 1 Target Percentage (%)</div>
            <div className="comparison-value">{configA.targetPercent1}</div>
            <div className="comparison-value">{configB.targetPercent1}</div>
            <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.targetPercent1, configB.targetPercent1), false)}>
              {formatDelta(calculateDelta(configA.targetPercent1, configB.targetPercent1), false)}
            </div>
            <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.targetPercent1, configB.targetPercent1), false)}>
              {formatPercentDelta(calculatePercentDelta(configA.targetPercent1, configB.targetPercent1))}
            </div>
          </div>
          <div className="comparison-row calculated-row">
            <div className="comparison-label">Car 1 Monthly Payment ($)</div>
            <div className="comparison-value">{configA.monthly1}</div>
            <div className="comparison-value">{configB.monthly1}</div>
            <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.monthly1, configB.monthly1), true)}>
              {formatDelta(calculateDelta(configA.monthly1, configB.monthly1))}
            </div>
            <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.monthly1, configB.monthly1), true)}>
              {formatPercentDelta(calculatePercentDelta(configA.monthly1, configB.monthly1))}
            </div>
          </div>
          <div className="comparison-row calculated-row">
            <div className="comparison-label">Car 1 Cash Required ($)</div>
            <div className="comparison-value">{configA.cash1}</div>
            <div className="comparison-value">{configB.cash1}</div>
            <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.cash1, configB.cash1), true)}>
              {formatDelta(calculateDelta(configA.cash1, configB.cash1))}
            </div>
            <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.cash1, configB.cash1), true)}>
              {formatPercentDelta(calculatePercentDelta(configA.cash1, configB.cash1))}
            </div>
          </div>
        </div>
      )}

      {configA.useCar2 && configB.useCar2 && (
        <div className="comparison-section">
          <h5>Car 2 Parameters</h5>
          <div className="comparison-row">
            <div className="comparison-label">Car 2 Price ($)</div>
            <div className="comparison-value">{configA.price2}</div>
            <div className="comparison-value">{configB.price2}</div>
            <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.price2, configB.price2), true)}>
              {formatDelta(calculateDelta(configA.price2, configB.price2))}
            </div>
            <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.price2, configB.price2), true)}>
              {formatPercentDelta(calculatePercentDelta(configA.price2, configB.price2))}
            </div>
          </div>
          <div className="comparison-row">
            <div className="comparison-label">Car 2 Loan Amount ($)</div>
            <div className="comparison-value">{configA.loan2}</div>
            <div className="comparison-value">{configB.loan2}</div>
            <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.loan2, configB.loan2), true)}>
              {formatDelta(calculateDelta(configA.loan2, configB.loan2))}
            </div>
            <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.loan2, configB.loan2), true)}>
              {formatPercentDelta(calculatePercentDelta(configA.loan2, configB.loan2))}
            </div>
          </div>
          <div className="comparison-row">
            <div className="comparison-label">Car 2 Trade-in Value ($)</div>
            <div className="comparison-value">{configA.tradeIn2}</div>
            <div className="comparison-value">{configB.tradeIn2}</div>
            <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.tradeIn2, configB.tradeIn2), false)}>
              {formatDelta(calculateDelta(configA.tradeIn2, configB.tradeIn2))}
            </div>
            <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.tradeIn2, configB.tradeIn2), false)}>
              {formatPercentDelta(calculatePercentDelta(configA.tradeIn2, configB.tradeIn2))}
            </div>
          </div>
          <div className="comparison-row">
            <div className="comparison-label">Car 2 Target Percentage (%)</div>
            <div className="comparison-value">{configA.targetPercent2}</div>
            <div className="comparison-value">{configB.targetPercent2}</div>
            <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.targetPercent2, configB.targetPercent2), false)}>
              {formatDelta(calculateDelta(configA.targetPercent2, configB.targetPercent2), false)}
            </div>
            <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.targetPercent2, configB.targetPercent2), false)}>
              {formatPercentDelta(calculatePercentDelta(configA.targetPercent2, configB.targetPercent2))}
            </div>
          </div>
          <div className="comparison-row calculated-row">
            <div className="comparison-label">Car 2 Monthly Payment ($)</div>
            <div className="comparison-value">{configA.monthly2}</div>
            <div className="comparison-value">{configB.monthly2}</div>
            <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.monthly2, configB.monthly2), true)}>
              {formatDelta(calculateDelta(configA.monthly2, configB.monthly2))}
            </div>
            <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.monthly2, configB.monthly2), true)}>
              {formatPercentDelta(calculatePercentDelta(configA.monthly2, configB.monthly2))}
            </div>
          </div>
          <div className="comparison-row calculated-row">
            <div className="comparison-label">Car 2 Cash Required ($)</div>
            <div className="comparison-value">{configA.cash2}</div>
            <div className="comparison-value">{configB.cash2}</div>
            <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.cash2, configB.cash2), true)}>
              {formatDelta(calculateDelta(configA.cash2, configB.cash2))}
            </div>
            <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.cash2, configB.cash2), true)}>
              {formatPercentDelta(calculatePercentDelta(configA.cash2, configB.cash2))}
            </div>
          </div>
        </div>
      )}

      <div className="comparison-section">
        <h5>Total Summary Comparison</h5>
        <div className="comparison-row">
          <div className="comparison-label">Total Price ($)</div>
          <div className="comparison-value">{configA.totalPrice}</div>
          <div className="comparison-value">{configB.totalPrice}</div>
          <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.totalPrice, configB.totalPrice), true)}>
            {formatDelta(calculateDelta(configA.totalPrice, configB.totalPrice))}
          </div>
          <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.totalPrice, configB.totalPrice), true)}>
            {formatPercentDelta(calculatePercentDelta(configA.totalPrice, configB.totalPrice))}
          </div>
        </div>
        <div className="comparison-row">
          <div className="comparison-label">Total Loan Amount ($)</div>
          <div className="comparison-value">{configA.totalLoan}</div>
          <div className="comparison-value">{configB.totalLoan}</div>
          <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.totalLoan, configB.totalLoan), true)}>
            {formatDelta(calculateDelta(configA.totalLoan, configB.totalLoan))}
          </div>
          <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.totalLoan, configB.totalLoan), true)}>
            {formatPercentDelta(calculatePercentDelta(configA.totalLoan, configB.totalLoan))}
          </div>
        </div>
        <div className="comparison-row">
          <div className="comparison-label">Total Trade-in Value ($)</div>
          <div className="comparison-value">{configA.totalTradeIn}</div>
          <div className="comparison-value">{configB.totalTradeIn}</div>
          <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.totalTradeIn, configB.totalTradeIn), false)}>
            {formatDelta(calculateDelta(configA.totalTradeIn, configB.totalTradeIn))}
          </div>
          <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.totalTradeIn, configB.totalTradeIn), false)}>
            {formatPercentDelta(calculatePercentDelta(configA.totalTradeIn, configB.totalTradeIn))}
          </div>
        </div>
        <div className="comparison-row highlight-row">
          <div className="comparison-label">Total Monthly Payment ($)</div>
          <div className="comparison-value">{configA.totalMonthly}</div>
          <div className="comparison-value">{configB.totalMonthly}</div>
          <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.totalMonthly, configB.totalMonthly), true)}>
            {formatDelta(calculateDelta(configA.totalMonthly, configB.totalMonthly))}
          </div>
          <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.totalMonthly, configB.totalMonthly), true)}>
            {formatPercentDelta(calculatePercentDelta(configA.totalMonthly, configB.totalMonthly))}
          </div>
        </div>
        <div className="comparison-row highlight-row">
          <div className="comparison-label">Total Cash Required ($)</div>
          <div className="comparison-value">{configA.totalCash}</div>
          <div className="comparison-value">{configB.totalCash}</div>
          <div className="comparison-delta" style={getDeltaStyle(calculateDelta(configA.totalCash, configB.totalCash), true)}>
            {formatDelta(calculateDelta(configA.totalCash, configB.totalCash))}
          </div>
          <div className="comparison-delta" style={getDeltaStyle(calculatePercentDelta(configA.totalCash, configB.totalCash), true)}>
            {formatPercentDelta(calculatePercentDelta(configA.totalCash, configB.totalCash))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

// --- Formatting Helpers ---
const formatScheduleNumber = (num) => {
  const number = Number(num);
  if (isNaN(number)) return "0.00";
  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
const formatSummaryNumber = (num) => {
  const number = Number(num);
  if (isNaN(number)) return "0";
  return number.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
const formatPercent = (num) => {
  if (typeof num !== "number" || isNaN(num)) return "0.0%";
  return num.toFixed(1) + "%";
};

// --- Rule of 78 Calculation Function ---
const calculateRule78ScheduleInternal = (
  loanAmount,
  numberOfMonths,
  totalFinanceCharge,
  monthlyPayment
) => {
  loanAmount = Number(loanAmount) || 0;
  numberOfMonths = Number(numberOfMonths) || 0;
  totalFinanceCharge = Number(totalFinanceCharge) || 0;
  monthlyPayment = Number(monthlyPayment) || 0;

  if (
    loanAmount <= 0 ||
    monthlyPayment <= 0 ||
    numberOfMonths <= 0 ||
    !Number.isInteger(numberOfMonths)
  ) {
    return {
      error:
        "Invalid inputs: Loan Amount, Monthly Payment, and Term (in months) must be positive numbers. Term must be an integer.",
    };
  }
  if (totalFinanceCharge < 0) {
    console.warn(
      "Warning: Total finance charge is negative. Proceeding with 0 interest calculation."
    );
    totalFinanceCharge = 0;
  }
  if (monthlyPayment * numberOfMonths < loanAmount + totalFinanceCharge - 1) {
    console.warn(
      `Potential Issue: Total payments (${(
        monthlyPayment * numberOfMonths
      ).toFixed(2)}) seem less than loan (${loanAmount.toFixed(
        2
      )}) + total interest (${totalFinanceCharge.toFixed(
        2
      )}). Schedule might not amortize correctly.`
    );
  }

  const sumOfDigits = (numberOfMonths * (numberOfMonths + 1)) / 2;
  let schedule = [];
  let currentBalance = loanAmount;
  let accumulatedInterestCheck = 0;

  for (let month = 1; month <= numberOfMonths; month++) {
    const startBalance = parseFloat(currentBalance.toFixed(2));
    let interestForMonth;
    let principalForMonth;
    const isLastMonth = month === numberOfMonths;

    const interestProportion =
      sumOfDigits > 0 ? (numberOfMonths - month + 1) / sumOfDigits : 0;
    interestForMonth =
      totalFinanceCharge > 0 && sumOfDigits > 0
        ? parseFloat((interestProportion * totalFinanceCharge).toFixed(2))
        : 0;

    if (interestForMonth > monthlyPayment && !isLastMonth) {
      console.warn(
        `Month ${month}: Calculated interest (${interestForMonth.toFixed(
          2
        )}) exceeds payment (${monthlyPayment.toFixed(
          2
        )}). Clamping principal to 0.`
      );
      interestForMonth = monthlyPayment;
      principalForMonth = 0;
    }

    if (isLastMonth) {
      principalForMonth = startBalance;
      let lastInterestCalculated = parseFloat(
        (monthlyPayment - principalForMonth).toFixed(2)
      ); // Actual interest based on final payment
      // Still DISPLAY the rule-based interest for consistency with Rule of 78 examples
      interestForMonth =
        totalFinanceCharge > 0 && sumOfDigits > 0
          ? parseFloat(((1 / sumOfDigits) * totalFinanceCharge).toFixed(2))
          : 0;

      if (monthlyPayment < principalForMonth - 0.005) {
        console.warn(
          `Last month's standard payment ($${monthlyPayment.toFixed(
            2
          )}) is less than the remaining balance ($${startBalance.toFixed(
            2
          )}). Adjusting final principal.`
        );
        // Principal is what's left after rule-based interest from fixed payment
        principalForMonth = parseFloat(
          (monthlyPayment - interestForMonth).toFixed(2)
        );
        if (principalForMonth < 0) principalForMonth = 0;
      } else {
        // Ensure principal clears the balance if payment is sufficient
        principalForMonth = startBalance;
      }
    } else {
      principalForMonth = parseFloat(
        (monthlyPayment - interestForMonth).toFixed(2)
      );
      if (principalForMonth < 0) {
        console.warn(
          `Warning: Month ${month} interest ($${interestForMonth.toFixed(
            2
          )}) causes negative principal. Setting principal to 0.`
        );
        principalForMonth = 0;
      }
    }

    let endBalance = parseFloat((startBalance - principalForMonth).toFixed(2));
    schedule.push({
      month: month,
      startBalance: startBalance.toFixed(2),
      interest: interestForMonth.toFixed(2),
      principal: principalForMonth.toFixed(2),
      endBalance:
        isLastMonth && Math.abs(endBalance) < 0.01
          ? "0.00"
          : endBalance.toFixed(2),
    });
    accumulatedInterestCheck += interestForMonth;
    currentBalance = endBalance;
    if (currentBalance < -1) {
      // Allow small negative from rounding
      console.error(
        "Error: Balance went significantly negative during calculation. Stopping."
      );
      return {
        error: "Calculation error resulted in a significant negative balance.",
      };
    }
  }

  const finalAccumulatedInterest = parseFloat(
    accumulatedInterestCheck.toFixed(2)
  );
  const tolerance = Math.max(0.01, numberOfMonths * 0.005);
  if (
    totalFinanceCharge > 0 &&
    Math.abs(finalAccumulatedInterest - totalFinanceCharge) > tolerance
  ) {
    console.warn(
      `Verification Warning: Sum of Rule of 78 monthly interest (${finalAccumulatedInterest.toFixed(
        2
      )}) differs from the initial total finance charge (${totalFinanceCharge.toFixed(
        2
      )}) by more than the tolerance ($${tolerance.toFixed(2)}).`
    );
  }

  return {
    loanAmount: loanAmount,
    monthlyPayment: monthlyPayment,
    numberOfMonths: numberOfMonths,
    schedule: schedule,
    totalFinanceCharge: totalFinanceCharge.toFixed(2),
    sumOfDigits: sumOfDigits,
    error: null,
  };
};

// PayoffChart component for visualizing payment breakdown
const PayoffChart = ({ chartData }) => {
  const [selectedDatasets, setSelectedDatasets] = useState({
    principal: true,
    interest: true,
    balance: true,
  });

  if (!chartData) return null;

  const handleDatasetToggle = (dataset) => {
    setSelectedDatasets((prev) => ({
      ...prev,
      [dataset]: !prev[dataset],
    }));
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
      annotation: chartData.payoffPoint
        ? {
            annotations: {
              payoffLine: {
                type: "line",
                xMin: chartData.payoffPoint,
                xMax: chartData.payoffPoint,
                borderColor: "rgba(255, 0, 0, 0.5)",
                borderWidth: 2,
                label: {
                  display: true,
                  content: "Payoff Point",
                  position: "start",
                },
              },
            },
          }
        : {},
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount ($)",
        },
        ticks: {
          callback: function (value) {
            return new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
              compactDisplay: "short",
            }).format(value);
          },
        },
      },
    },
  };

  // Only include selected datasets
  const datasets = [];

  if (selectedDatasets.principal) {
    datasets.push({
      label: "Principal Payment",
      data: chartData.principal,
      borderColor: "rgba(53, 162, 235, 0.8)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    });
  }

  if (selectedDatasets.interest) {
    datasets.push({
      label: "Interest Payment",
      data: chartData.interest,
      borderColor: "rgba(255, 99, 132, 0.8)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    });
  }

  if (selectedDatasets.balance) {
    datasets.push({
      label: "Remaining Balance",
      data: chartData.balance,
      borderColor: "rgba(75, 192, 192, 0.8)",
      backgroundColor: "rgba(75, 192, 192, 0.5)",
      yAxisID: "y",
    });
  }

  const data = {
    labels: chartData.labels,
    datasets: datasets,
  };

  return (
    <>
      <div className="chart-control-panel">
        <div className="chart-checkboxes">
          <label>
            <input
              type="checkbox"
              checked={selectedDatasets.principal}
              onChange={() => handleDatasetToggle("principal")}
            />
            <span className="principal-color">Principal Payment</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedDatasets.interest}
              onChange={() => handleDatasetToggle("interest")}
            />
            <span className="interest-color">Interest Payment</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedDatasets.balance}
              onChange={() => handleDatasetToggle("balance")}
            />
            <span className="balance-color">Remaining Balance</span>
          </label>
        </div>
      </div>
      <div className="chart-container">
        <Line options={options} data={data} height={300} />
      </div>
    </>
  );
};

function App() {
  // --- State ---
  const [carSelection, setCarSelection] = useState("both");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(2.48);
  const [loanTermYears, setLoanTermYears] = useState(7);
  const [price1, setPrice1] = useState(208988);
  const [loan1, setLoan1] = useState(100000);
  const [tradeIn1, setTradeIn1] = useState(90000);
  const [targetPercent1, setTargetPercent1] = useState(60);
  const [price2, setPrice2] = useState(165988);
  const [loan2, setLoan2] = useState(80000);
  const [tradeIn2, setTradeIn2] = useState(65000);
  const [targetPercent2, setTargetPercent2] = useState(60);
  const [schedule1, setSchedule1] = useState(null);
  const [schedule2, setSchedule2] = useState(null);
  const [payoffDetails1, setPayoffDetails1] = useState(null);
  const [payoffDetails2, setPayoffDetails2] = useState(null);
  const [scheduleCombined, setScheduleCombined] = useState(null);
  const [payoffDetailsCombined, setPayoffDetailsCombined] = useState(null);
  const [payoffMonth1, setPayoffMonth1] = useState(12);
  const [payoffMonth2, setPayoffMonth2] = useState(12);
  const [payoffMonthCombined, setPayoffMonthCombined] = useState(12);

  // --- New configuration comparison state ---
  const [configA, setConfigA] = useState(null);
  const [configB, setConfigB] = useState(null);
  const [showConfigComparison, setShowConfigComparison] = useState(false);

  // --- Calculation Functions ---
  const calculateMonthlyPaymentFlatRate = (
    loanAmount,
    annualRatePercent,
    termYears
  ) => {
    loanAmount = Number(loanAmount) || 0;
    annualRatePercent = Number(annualRatePercent) || 0;
    termYears = Number(termYears) || 0;
    if (loanAmount <= 0 || termYears <= 0) {
      return loanAmount / (termYears * 12) || 0;
    }
    if (annualRatePercent < 0) annualRatePercent = 0;
    const annualRate = annualRatePercent / 100;
    const totalInterest = loanAmount * annualRate * termYears;
    const totalPayable = loanAmount + totalInterest;
    const numberOfMonths = termYears * 12;
    if (numberOfMonths === 0) return 0;
    return Math.round(totalPayable / numberOfMonths);
  };
  const calculateTotalFinanceChargeFlatRate = (
    loanAmount,
    annualRatePercent,
    termYears
  ) => {
    loanAmount = Number(loanAmount) || 0;
    annualRatePercent = Number(annualRatePercent) || 0;
    termYears = Number(termYears) || 0;
    if (loanAmount <= 0 || annualRatePercent < 0 || termYears <= 0) return 0;
    const annualRate = annualRatePercent / 100;
    return loanAmount * annualRate * termYears;
  };
  const calculateLoanPercentage = (loanAmount, carPrice) => {
    loanAmount = Number(loanAmount) || 0;
    carPrice = Number(carPrice) || 0;
    if (carPrice === 0) return 0;
    return (loanAmount / carPrice) * 100;
  };

  // --- Derived Values & Totals ---
  const balance1 = (price1 || 0) - (loan1 || 0);
  const cash1 = balance1 - (tradeIn1 || 0);
  const monthly1 = calculateMonthlyPaymentFlatRate(
    loan1,
    interestRate,
    loanTermYears
  );
  const loanPercent1 = calculateLoanPercentage(loan1, price1);
  const balance2 = (price2 || 0) - (loan2 || 0);
  const cash2 = balance2 - (tradeIn2 || 0);
  const monthly2 = calculateMonthlyPaymentFlatRate(
    loan2,
    interestRate,
    loanTermYears
  );
  const loanPercent2 = calculateLoanPercentage(loan2, price2);
  const useCar1 = carSelection === "car1" || carSelection === "both";
  const useCar2 = carSelection === "car2" || carSelection === "both";
  const effectivePrice1 = useCar1 ? price1 || 0 : 0;
  const effectiveLoan1 = useCar1 ? loan1 || 0 : 0;
  const effectiveTradeIn1 = useCar1 ? tradeIn1 || 0 : 0;
  const effectiveMonthly1 = useCar1 ? monthly1 : 0;
  const effectiveBalance1 = useCar1 ? balance1 : 0;
  const effectivePrice2 = useCar2 ? price2 || 0 : 0;
  const effectiveLoan2 = useCar2 ? loan2 || 0 : 0;
  const effectiveTradeIn2 = useCar2 ? tradeIn2 || 0 : 0;
  const effectiveMonthly2 = useCar2 ? monthly2 : 0;
  const effectiveBalance2 = useCar2 ? balance2 : 0;
  const rawTotalPrice = effectivePrice1 + effectivePrice2;
  const effectiveDiscount = Number(discountAmount) || 0;
  const totalPrice = rawTotalPrice - effectiveDiscount;
  const totalLoan = effectiveLoan1 + effectiveLoan2;
  const totalTradeIn = effectiveTradeIn1 + effectiveTradeIn2;
  const totalMonthly = effectiveMonthly1 + effectiveMonthly2;
  const totalBalance = totalPrice - totalLoan;
  const totalCash = totalBalance - totalTradeIn;

  // --- Update Rule of 78 schedules when inputs change ---
  useEffect(() => {
    // Check if we need to update schedule1
    if (schedule1 && !schedule1.error && useCar1) {
      const months = (loanTermYears || 0) * 12;
      const totalFlatInterest = calculateTotalFinanceChargeFlatRate(
        loan1,
        interestRate,
        loanTermYears
      );
      const result = calculateRule78ScheduleInternal(
        loan1,
        months,
        totalFlatInterest,
        monthly1
      );

      if (result && !result.error) {
        setSchedule1(result);

        // If there was a payoff calculation, update it too
        if (payoffDetails1 && !payoffDetails1.error) {
          handleCalculatePayoff(result, setPayoffDetails1, payoffMonth1);
        }
      }
    }

    // Check if we need to update schedule2
    if (schedule2 && !schedule2.error && useCar2) {
      const months = (loanTermYears || 0) * 12;
      const totalFlatInterest = calculateTotalFinanceChargeFlatRate(
        loan2,
        interestRate,
        loanTermYears
      );
      const result = calculateRule78ScheduleInternal(
        loan2,
        months,
        totalFlatInterest,
        monthly2
      );

      if (result && !result.error) {
        setSchedule2(result);

        // If there was a payoff calculation, update it too
        if (payoffDetails2 && !payoffDetails2.error) {
          handleCalculatePayoff(result, setPayoffDetails2, payoffMonth2);
        }
      }
    }

    // Check if we need to update combined schedule
    if (scheduleCombined && !scheduleCombined.error && carSelection === "both") {
      const months = (loanTermYears || 0) * 12;
      const totalCombinedFlatInterest = calculateTotalFinanceChargeFlatRate(
        totalLoan,
        interestRate,
        loanTermYears
      );
      const result = calculateRule78ScheduleInternal(
        totalLoan,
        months,
        totalCombinedFlatInterest,
        totalMonthly
      );

      if (result && !result.error) {
        setScheduleCombined(result);

        // If there was a payoff calculation, update it too
        if (payoffDetailsCombined && !payoffDetailsCombined.error) {
          handleCalculatePayoff(result, setPayoffDetailsCombined, payoffMonthCombined);
        }
      }
    }
  }, [loan1, loan2, interestRate, loanTermYears, carSelection, totalLoan, monthly1, monthly2, totalMonthly]);

  // --- Handlers ---
  const handleInputChange = (setter) => (event) => {
    const value = event.target.value;
    setter(value === "" ? "" : Number(value));
  };
  const handleSetLoanByPercent = (price, targetPercent, loanSetter) => {
    const priceNum = Number(price) || 0;
    const percentNum = Number(targetPercent) || 0;
    if (priceNum > 0 && percentNum > 0) {
      const newLoanAmount = Math.round(priceNum * (percentNum / 100));
      loanSetter(newLoanAmount);
    } else {
      loanSetter(0);
    }
  };
  const handleCarSelectionChange = (event) => {
    setCarSelection(event.target.value);
    // Optionally clear combined schedule when mode changes from 'both'
    if (event.target.value !== "both") {
      setScheduleCombined(null);
    }
  };

  // --- Configuration saving and comparison functions ---
  const getCurrentConfig = () => {
    return {
      // General settings
      carSelection,
      discountAmount,
      interestRate,
      loanTermYears,

      // Car 1 settings
      price1,
      loan1,
      tradeIn1,
      targetPercent1,
      loanPercent1,
      balance1,
      cash1,
      monthly1,

      // Car 2 settings
      price2,
      loan2,
      tradeIn2,
      targetPercent2,
      loanPercent2,
      balance2,
      cash2,
      monthly2,

      // Usage flags
      useCar1: carSelection === "car1" || carSelection === "both",
      useCar2: carSelection === "car2" || carSelection === "both",

      // Totals
      totalPrice,
      totalLoan,
      totalTradeIn,
      totalMonthly,
      totalCash
    };
  };

  const handleSaveConfigA = () => {
    setConfigA(getCurrentConfig());
    alert("Configuration A saved!");
  };

  const handleSaveConfigB = () => {
    setConfigB(getCurrentConfig());
    alert("Configuration B saved!");
  };

  const handleCompareConfigs = () => {
    if (!configA || !configB) {
      alert("Please save both configurations before comparing.");
      return;
    }
    setShowConfigComparison(true);

    // Clear any existing schedules for clarity
    setSchedule1(null);
    setSchedule2(null);
    setScheduleCombined(null);
    setPayoffDetails1(null);
    setPayoffDetails2(null);
    setPayoffDetailsCombined(null);
  };

  const handleHideComparison = () => {
    setShowConfigComparison(false);
  };
  const handleCalculateSchedule1 = () => {
    setPayoffDetails1(null);
    const months = (loanTermYears || 0) * 12;
    const totalFlatInterest = calculateTotalFinanceChargeFlatRate(
      loan1,
      interestRate,
      loanTermYears
    );
    const result = calculateRule78ScheduleInternal(
      loan1,
      months,
      totalFlatInterest,
      monthly1
    );
    if (result && !result.error) {
      setSchedule1(result);
      setScheduleCombined(null);
    } else {
      setSchedule1({ error: result?.error || "Unknown error." });
      alert(result?.error || "Could not calculate schedule.");
    }
  };
  const handleCalculateSchedule2 = () => {
    setPayoffDetails2(null);
    const months = (loanTermYears || 0) * 12;
    const totalFlatInterest = calculateTotalFinanceChargeFlatRate(
      loan2,
      interestRate,
      loanTermYears
    );
    const result = calculateRule78ScheduleInternal(
      loan2,
      months,
      totalFlatInterest,
      monthly2
    );
    if (result && !result.error) {
      setSchedule2(result);
      setScheduleCombined(null);
    } else {
      setSchedule2({ error: result?.error || "Unknown error." });
      alert(result?.error || "Could not calculate schedule.");
    }
  };
  const handleCalculatePayoff = (
    scheduleData,
    setPayoffDetails,
    payoffMonth
  ) => {
    if (!scheduleData || scheduleData.error || !scheduleData.schedule) {
      alert("Payoff requires a valid schedule.");
      setPayoffDetails({ error: "Invalid schedule data." });
      return;
    }

    // Validate payoff month is within range
    const totalMonths = scheduleData.numberOfMonths;
    if (payoffMonth >= totalMonths) {
      alert(
        `Payoff month must be less than the total term (${totalMonths} months).`
      );
      setPayoffDetails({
        error: `Payoff month (${payoffMonth}) must be less than total term (${totalMonths})`,
      });
      return;
    }

    if (payoffMonth < 1) {
      alert("Payoff month must be at least 1.");
      setPayoffDetails({ error: "Payoff month must be at least 1." });
      return;
    }

    try {
      const monthsToPayoff = scheduleData.schedule.slice(0, payoffMonth);
      const totalPaidPrincipal = monthsToPayoff.reduce(
        (sum, row) => sum + parseFloat(row.principal),
        0
      );
      const totalPaidInterest = monthsToPayoff.reduce(
        (sum, row) => sum + parseFloat(row.interest),
        0
      );
      const totalPaid = totalPaidPrincipal + totalPaidInterest;

      const remainingMonths = totalMonths - payoffMonth;
      const totalSumDigits = scheduleData.sumOfDigits;
      const originalTotalInterest = parseFloat(scheduleData.totalFinanceCharge);
      const originalLoanAmount = scheduleData.loanAmount;
      const monthlyPayment = scheduleData.monthlyPayment;

      const sumDigitsRemaining = (remainingMonths * (remainingMonths + 1)) / 2;
      const interestRebate =
        totalSumDigits > 0
          ? (sumDigitsRemaining / totalSumDigits) * originalTotalInterest
          : 0;

      const totalRemainingPayments = remainingMonths * monthlyPayment;
      const payoffAmount = totalRemainingPayments - interestRebate;

      const remainingPrincipal = originalLoanAmount - totalPaidPrincipal;
      // Ensure remaining interest isn't negative due to rounding
      const remainingInterestInPayoff = Math.max(
        0,
        payoffAmount - remainingPrincipal
      );

      // Calculate additional information for if user continues regular payments
      const remainingInterestIfContinued =
        originalTotalInterest - totalPaidInterest;
      const totalRemainingPaymentIfContinued = remainingMonths * monthlyPayment;
      const remainingPrincipalPayment = remainingPrincipal;

      // Interest percentage breakdown
      const interestPaidPercentage =
        (totalPaidInterest / originalTotalInterest) * 100;
      const interestRemainingPercentage =
        (remainingInterestIfContinued / originalTotalInterest) * 100;

      // Savings analysis
      const interestSavings =
        remainingInterestIfContinued - remainingInterestInPayoff;
      const totalSavings = totalRemainingPaymentIfContinued - payoffAmount;

      // Generate chart data
      const chartData = {
        labels: Array.from({ length: totalMonths }, (_, i) => i + 1),
        principal: scheduleData.schedule.map((row) =>
          parseFloat(row.principal)
        ),
        interest: scheduleData.schedule.map((row) => parseFloat(row.interest)),
        balance: scheduleData.schedule.map((row) =>
          parseFloat(row.startBalance)
        ),
        payoffPoint: payoffMonth,
      };

      setPayoffDetails({
        totalPaidMonths: payoffMonth,
        totalPaidPrincipal: totalPaidPrincipal.toFixed(2),
        totalPaidInterest: totalPaidInterest.toFixed(2),
        totalPaid: totalPaid.toFixed(2),
        payoffAmount: payoffAmount.toFixed(2),
        interestRebate: interestRebate.toFixed(2),
        remainingPrincipalInPayoff: remainingPrincipal.toFixed(2),
        remainingInterestInPayoff: remainingInterestInPayoff.toFixed(2),
        // New fields
        interestPaidPercentage: interestPaidPercentage.toFixed(1),
        interestRemainingPercentage: interestRemainingPercentage.toFixed(1),
        remainingTotalIfContinued: totalRemainingPaymentIfContinued.toFixed(2),
        remainingPrincipalIfContinued: remainingPrincipalPayment.toFixed(2),
        remainingInterestIfContinued: remainingInterestIfContinued.toFixed(2),
        interestSavings: interestSavings.toFixed(2),
        totalSavings: totalSavings.toFixed(2),
        chartData: chartData,
        error: null,
      });
    } catch (e) {
      console.error("Error calculating payoff:", e);
      setPayoffDetails({ error: "Calculation error." });
      alert("Error calculating payoff details.");
    }
  };
  const handleCalculateCombinedSchedule = () => {
    setSchedule1(null);
    setSchedule2(null);
    setPayoffDetails1(null);
    setPayoffDetails2(null);
    setPayoffDetailsCombined(null);
    if (carSelection !== "both") {
      alert("Combined requires 'Both Cars' mode.");
      return;
    }
    if (totalLoan <= 0 || loanTermYears <= 0) {
      alert("Combined requires valid total loan & term.");
      return;
    }

    const months = (loanTermYears || 0) * 12;
    const totalCombinedFlatInterest = calculateTotalFinanceChargeFlatRate(
      totalLoan,
      interestRate,
      loanTermYears
    );
    const result = calculateRule78ScheduleInternal(
      totalLoan,
      months,
      totalCombinedFlatInterest,
      totalMonthly
    );
    if (result && !result.error) {
      setScheduleCombined(result);
    } else {
      setScheduleCombined({ error: result?.error || "Unknown error." });
      alert(result?.error || "Could not calculate combined schedule.");
    }
  };

  // --- JSX ---
  return (
    <div className="App">
      <h1>Electric Vehicle Purchase Calculator</h1>
      
      {/* --- Configuration Comparison Controls --- */}
      <div className="config-section configuration-controls">
        <h3>Configuration Comparison</h3>
        <div className="comparison-controls">
          <div className="comparison-buttons">
            <button 
              className="save-config-button config-a" 
              onClick={handleSaveConfigA}
              title="Save current inputs as Configuration A"
            >
              Save as Config A
            </button>
            <button 
              className="save-config-button config-b" 
              onClick={handleSaveConfigB}
              title="Save current inputs as Configuration B"
            >
              Save as Config B
            </button>
            <button 
              className="compare-button" 
              onClick={handleCompareConfigs}
              disabled={!configA || !configB}
              title="Compare the two saved configurations"
            >
              Compare Configurations
            </button>
          </div>
          <div className="config-status">
            <div className={`config-indicator ${configA ? 'saved' : ''}`}>
              Config A: {configA ? 'Saved' : 'Not Saved'}
            </div>
            <div className={`config-indicator ${configB ? 'saved' : ''}`}>
              Config B: {configB ? 'Saved' : 'Not Saved'}
            </div>
          </div>
        </div>
      </div>

      {/* --- Config Sections --- */}
      <div className="config-section car-selection">
        <h3>Calculation Mode</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="car1"
              checked={carSelection === "car1"}
              onChange={handleCarSelectionChange}
            />{" "}
            Car 1 Only
          </label>
          <label>
            <input
              type="radio"
              value="car2"
              checked={carSelection === "car2"}
              onChange={handleCarSelectionChange}
            />{" "}
            Car 2 Only
          </label>
          <label>
            <input
              type="radio"
              value="both"
              checked={carSelection === "both"}
              onChange={handleCarSelectionChange}
            />{" "}
            Both Cars
          </label>
        </div>
      </div>
      <div className="config-section shared-parameters">
        <h2>Loan Parameters (Shared)</h2>
        <div className="parameter-group">
          <label>
            Annual Interest Rate (%):
            <input
              type="number"
              step="0.01"
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
              min="1"
              value={loanTermYears}
              onChange={handleInputChange(setLoanTermYears)}
              placeholder="e.g., 7"
            />
          </label>
        </div>
      </div>
      <div className="config-section discount-section">
        <h2>Discounts</h2>
        <div className="parameter-group">
          <label>
            Seller Discount ($):
            <input
              type="number"
              step="1"
              value={discountAmount}
              onChange={handleInputChange(setDiscountAmount)}
              placeholder="e.g., 5000"
            />
          </label>
        </div>
      </div>

      {/* --- Car Inputs --- */}
      <div className="inputs-container">
        {useCar1 && (
          <div className="input-group">
            <h2>Car 1 (e.g., HYPTEC)</h2>
            <label>
              New Car Price ($):
              <input
                type="number"
                value={price1}
                onChange={handleInputChange(setPrice1)}
                placeholder="Price"
              />
            </label>
            <label>
              Loan Amount ($):
              <input
                type="number"
                value={loan1}
                onChange={handleInputChange(setLoan1)}
                placeholder="Loan Amount"
              />
            </label>
            <div className="set-percentage-group">
              <label htmlFor="tp1" className="inline-label">
                Set loan to:
              </label>
              <input
                id="tp1"
                type="number"
                step="0.1"
                value={targetPercent1}
                onChange={handleInputChange(setTargetPercent1)}
                className="percentage-input"
              />{" "}
              %
              <button
                onClick={() =>
                  handleSetLoanByPercent(price1, targetPercent1, setLoan1)
                }
                className="apply-button"
              >
                Apply %
              </button>
              <span className="calculated-percentage">
                (Current: {formatPercent(loanPercent1)})
              </span>
            </div>
            <label>
              Trade-in Value ($):
              <input
                type="number"
                value={tradeIn1}
                onChange={handleInputChange(setTradeIn1)}
                placeholder="Trade-in"
              />
            </label>
          </div>
        )}
        {useCar2 && (
          <div className="input-group">
            <h2>Car 2 (e.g., V)</h2>
            <label>
              New Car Price ($):
              <input
                type="number"
                value={price2}
                onChange={handleInputChange(setPrice2)}
                placeholder="Price"
              />
            </label>
            <label>
              Loan Amount ($):
              <input
                type="number"
                value={loan2}
                onChange={handleInputChange(setLoan2)}
                placeholder="Loan Amount"
              />
            </label>
            <div className="set-percentage-group">
              <label htmlFor="tp2" className="inline-label">
                Set loan to:
              </label>
              <input
                id="tp2"
                type="number"
                step="0.1"
                value={targetPercent2}
                onChange={handleInputChange(setTargetPercent2)}
                className="percentage-input"
              />{" "}
              %
              <button
                onClick={() =>
                  handleSetLoanByPercent(price2, targetPercent2, setLoan2)
                }
                className="apply-button"
              >
                Apply %
              </button>
              <span className="calculated-percentage">
                (Current: {formatPercent(loanPercent2)})
              </span>
            </div>
            <label>
              Trade-in Value ($):
              <input
                type="number"
                value={tradeIn2}
                onChange={handleInputChange(setTradeIn2)}
                placeholder="Trade-in"
              />
            </label>
          </div>
        )}
      </div>

      {/* --- Summary Table --- */}
      <h2>Calculation Summary</h2>
      <table className="results-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>{useCar1 ? "Car 1" : "–"}</th>
            <th>{useCar2 ? "Car 2" : "–"}</th>
            <th>Totals</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>New Car Price ($)</td>
            <td>{useCar1 ? formatSummaryNumber(price1) : "–"}</td>
            <td>{useCar2 ? formatSummaryNumber(price2) : "–"}</td>
            <td>{formatSummaryNumber(rawTotalPrice)}</td>
          </tr>
          <tr>
            <td>Loan Amount ($)</td>
            <td>{useCar1 ? formatSummaryNumber(loan1) : "–"}</td>
            <td>{useCar2 ? formatSummaryNumber(loan2) : "–"}</td>
            <td>{formatSummaryNumber(totalLoan)}</td>
          </tr>
          <tr className="percentage-row">
            <td>Loan as % of Price</td>
            <td>{useCar1 ? formatPercent(loanPercent1) : "–"}</td>
            <td>{useCar2 ? formatPercent(loanPercent2) : "–"}</td>
            <td></td>
          </tr>
          <tr className="calculated-row">
            <td>
              Downpayment Required ($)
              <br />
              <small>(Price - Loan)</small>
            </td>
            <td>{useCar1 ? formatSummaryNumber(balance1) : "–"}</td>
            <td>{useCar2 ? formatSummaryNumber(balance2) : "–"}</td>
            <td>
              {formatSummaryNumber(effectiveBalance1 + effectiveBalance2)}
            </td>
          </tr>
          <tr>
            <td>Trade-in Value ($)</td>
            <td>{useCar1 ? formatSummaryNumber(tradeIn1) : "–"}</td>
            <td>{useCar2 ? formatSummaryNumber(tradeIn2) : "–"}</td>
            <td>{formatSummaryNumber(totalTradeIn)}</td>
          </tr>
          <tr className="discount-row">
            <td>Seller Discount ($)</td>
            <td colSpan="2" style={{ textAlign: "center" }}>
              {discountAmount > 0 ? `(Applied)` : "–"}
            </td>
            <td style={{ color: "green", fontWeight: "bold" }}>
              {discountAmount > 0
                ? `(${formatSummaryNumber(discountAmount)})`
                : "–"}
            </td>
          </tr>
          <tr className="calculated-row final-cash">
            <td>
              Cash Upfront ($)
              <br />
              <small>(Downpay - TradeIn - Discount)</small>
            </td>
            <td style={{ color: cash1 < 0 ? "red" : "#28a745" }}>
              {useCar1 ? formatSummaryNumber(cash1) : "–"}
            </td>
            <td style={{ color: cash2 < 0 ? "red" : "#28a745" }}>
              {useCar2 ? formatSummaryNumber(cash2) : "–"}
            </td>
            <td
              style={{
                color: totalCash < 0 ? "red" : "#28a745",
                fontWeight: "bold",
              }}
            >
              {formatSummaryNumber(totalCash)}
            </td>
          </tr>
          <tr className="calculated-row">
            <td>
              Est. Monthly Payment ($)
              <br />
              <small>(Flat Rate)</small>
            </td>
            <td>{useCar1 ? formatSummaryNumber(monthly1) : "–"}</td>
            <td>{useCar2 ? formatSummaryNumber(monthly2) : "–"}</td>
            <td>{formatSummaryNumber(totalMonthly)}</td>
          </tr>
        </tbody>
      </table>

      {/* --- Schedule Triggers --- */}
      <div className="schedule-triggers">
        {useCar1 && loan1 > 0 && loanTermYears > 0 && (
          <button
            onClick={handleCalculateSchedule1}
            disabled={schedule1 && !schedule1.error}
          >
            {schedule1 && !schedule1.error
              ? "Rule of 78 Shown (Car 1)"
              : "Show Rule of 78 (Car 1)"}
          </button>
        )}
        {useCar2 && loan2 > 0 && loanTermYears > 0 && (
          <button
            onClick={handleCalculateSchedule2}
            disabled={schedule2 && !schedule2.error}
          >
            {schedule2 && !schedule2.error
              ? "Rule of 78 Shown (Car 2)"
              : "Show Rule of 78 (Car 2)"}
          </button>
        )}
        {carSelection === "both" && totalLoan > 0 && loanTermYears > 0 && (
          <button
            onClick={handleCalculateCombinedSchedule}
            disabled={scheduleCombined && !scheduleCombined.error}
            className="combined-button"
          >
            {scheduleCombined && !scheduleCombined.error
              ? "Combined Rule of 78 Shown"
              : "Show Combined Rule of 78"}
          </button>
        )}
      </div>

      {/* --- Display Area --- */}
      {/* Car 1 Schedule & Payoff */}
      {schedule1 && !schedule1.error && (
        <div className="amortization-schedule schedule-car1">
          <h3>Rule of 78 Schedule (Car 1)</h3>
          <p className="schedule-info">
            Loan: ${formatScheduleNumber(schedule1.loanAmount)}, Term:{" "}
            {schedule1.numberOfMonths} mo, Flat Int: $
            {formatScheduleNumber(schedule1.totalFinanceCharge)}, M Pmt: $
            {formatSummaryNumber(schedule1.monthlyPayment)}
          </p>

          {schedule1.numberOfMonths >= 2 && !payoffDetails1 && (
            <div className="payoff-controls">
              <div className="payoff-month-select">
                <label>Payoff after month:</label>
                <input
                  type="number"
                  min="1"
                  max={schedule1.numberOfMonths - 1}
                  value={payoffMonth1}
                  onChange={(e) => setPayoffMonth1(Number(e.target.value))}
                />
              </div>
              <button
                onClick={() =>
                  handleCalculatePayoff(
                    schedule1,
                    setPayoffDetails1,
                    payoffMonth1
                  )
                }
                className="payoff-button"
              >
                Calculate Payoff
              </button>
            </div>
          )}

          {payoffDetails1 && (
            <button
              onClick={() => setPayoffDetails1(null)}
              className="hide-payoff-button"
            >
              Hide Payoff
            </button>
          )}
          {payoffDetails1 && payoffDetails1.error && (
            <p className="error">{payoffDetails1.error}</p>
          )}
          {payoffDetails1 && !payoffDetails1.error && (
            <div className="payoff-details">
              <h4>
                Payoff Scenario (End of Month {payoffDetails1.totalPaidMonths})
              </h4>
              <div className="payoff-sections">
                <div className="payoff-section">
                  <h5>Payments to Date</h5>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          Total Paid (First {payoffDetails1.totalPaidMonths}{" "}
                          Mo):
                        </td>
                        <td>
                          ${formatScheduleNumber(payoffDetails1.totalPaid)}
                        </td>
                      </tr>
                      <tr>
                        <td className="indent">Interest Paid:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetails1.totalPaidInterest
                          )}{" "}
                          ({payoffDetails1.interestPaidPercentage}% of total
                          interest)
                        </td>
                      </tr>
                      <tr>
                        <td className="indent">Principal Paid:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetails1.totalPaidPrincipal
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="payoff-section">
                  <h5>Early Payoff Option</h5>
                  <table>
                    <tbody>
                      <tr>
                        <td>Payoff Amount:</td>
                        <td>
                          ${formatScheduleNumber(payoffDetails1.payoffAmount)}
                        </td>
                      </tr>
                      <tr>
                        <td className="indent">Remaining Principal:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetails1.remainingPrincipalInPayoff
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="indent">Remaining Interest:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetails1.remainingInterestInPayoff
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="indent info">(Interest Rebate:</td>
                        <td>
                          ${formatScheduleNumber(payoffDetails1.interestRebate)}
                          )
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="payoff-section">
                  <h5>If Continuing Regular Payments</h5>
                  <table>
                    <tbody>
                      <tr>
                        <td>Total Remaining Payments:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetails1.remainingTotalIfContinued
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="indent">Remaining Principal:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetails1.remainingPrincipalIfContinued
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="indent">Remaining Interest:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetails1.remainingInterestIfContinued
                          )}{" "}
                          ({payoffDetails1.interestRemainingPercentage}% of
                          total interest)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="payoff-section full-width">
                  <h5>Savings Analysis</h5>
                  <table>
                    <tbody>
                      <tr>
                        <td>Total Payment Savings:</td>
                        <td>
                          ${formatScheduleNumber(payoffDetails1.totalSavings)}
                        </td>
                      </tr>
                      <tr>
                        <td>Interest Savings:</td>
                        <td>
                          $
                          {formatScheduleNumber(payoffDetails1.interestSavings)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="chart-section">
                <h5>Payment Breakdown Over Loan Term</h5>
                <PayoffChart chartData={payoffDetails1.chartData} />
              </div>
            </div>
          )}
          <button
            onClick={() => {
              setSchedule1(null);
              setPayoffDetails1(null);
            }}
            className="hide-button"
          >
            Hide Car 1
          </button>
          <table className="results-table schedule-table">
            <thead>
              <tr>
                <th>Mo</th>
                <th>Start Bal</th>
                <th>Interest</th>
                <th>Principal</th>
                <th>End Bal</th>
              </tr>
            </thead>
            <tbody>
              {schedule1.schedule.map((r) => (
                <tr key={`s1-${r.month}`}>
                  <td>{r.month}</td>
                  <td>{formatScheduleNumber(r.startBalance)}</td>
                  <td>{formatScheduleNumber(r.interest)}</td>
                  <td>{formatScheduleNumber(r.principal)}</td>
                  <td>{formatScheduleNumber(r.endBalance)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2">Sum-of-Digits:</td>
                <td>{schedule1.sumOfDigits}</td>
                <td>Total Fin Chg:</td>
                <td>${formatScheduleNumber(schedule1.totalFinanceCharge)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      {schedule1 && schedule1.error && (
        <div className="schedule-error">
          <p>Err(Car 1): {schedule1.error}</p>
          <button onClick={() => setSchedule1(null)} className="hide-button">
            X
          </button>
        </div>
      )}

      {/* Car 2 Schedule & Payoff */}
      {schedule2 && !schedule2.error && (
        <div className="amortization-schedule schedule-car2">
          <h3>Rule of 78 Schedule (Car 2)</h3>
          <p className="schedule-info">
            Loan: ${formatScheduleNumber(schedule2.loanAmount)}, Term:{" "}
            {schedule2.numberOfMonths} mo, Flat Int: $
            {formatScheduleNumber(schedule2.totalFinanceCharge)}, M Pmt: $
            {formatSummaryNumber(schedule2.monthlyPayment)}
          </p>

          {schedule2.numberOfMonths >= 2 && !payoffDetails2 && (
            <div className="payoff-controls">
              <div className="payoff-month-select">
                <label>Payoff after month:</label>
                <input
                  type="number"
                  min="1"
                  max={schedule2.numberOfMonths - 1}
                  value={payoffMonth2}
                  onChange={(e) => setPayoffMonth2(Number(e.target.value))}
                />
              </div>
              <button
                onClick={() =>
                  handleCalculatePayoff(
                    schedule2,
                    setPayoffDetails2,
                    payoffMonth2
                  )
                }
                className="payoff-button"
              >
                Calculate Payoff
              </button>
            </div>
          )}

          {payoffDetails2 && (
            <button
              onClick={() => setPayoffDetails2(null)}
              className="hide-payoff-button"
            >
              Hide Payoff
            </button>
          )}
          {payoffDetails2 && payoffDetails2.error && (
            <p className="error">{payoffDetails2.error}</p>
          )}
          {payoffDetails2 && !payoffDetails2.error && (
            <div className="payoff-details">
              <h4>
                Payoff Scenario (End of Month {payoffDetails2.totalPaidMonths})
              </h4>
              <div className="payoff-sections">
                <div className="payoff-section">
                  <h5>Payments to Date</h5>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          Total Paid (First {payoffDetails2.totalPaidMonths}{" "}
                          Mo):
                        </td>
                        <td>
                          ${formatScheduleNumber(payoffDetails2.totalPaid)}
                        </td>
                      </tr>
                      <tr>
                        <td className="indent">Interest Paid:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetails2.totalPaidInterest
                          )}{" "}
                          ({payoffDetails2.interestPaidPercentage}% of total
                          interest)
                        </td>
                      </tr>
                      <tr>
                        <td className="indent">Principal Paid:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetails2.totalPaidPrincipal
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="payoff-section">
                  <h5>Early Payoff Option</h5>
                  <table>
                    <tbody>
                      <tr>
                        <td>Payoff Amount:</td>
                        <td>
                          ${formatScheduleNumber(payoffDetails2.payoffAmount)}
                        </td>
                      </tr>
                      <tr>
                        <td className="indent">Remaining Principal:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetails2.remainingPrincipalInPayoff
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="indent">Remaining Interest:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetails2.remainingInterestInPayoff
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="indent info">(Interest Rebate:</td>
                        <td>
                          ${formatScheduleNumber(payoffDetails2.interestRebate)}
                          )
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="payoff-section">
                  <h5>If Continuing Regular Payments</h5>
                  <table>
                    <tbody>
                      <tr>
                        <td>Total Remaining Payments:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetails2.remainingTotalIfContinued
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="indent">Remaining Principal:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetails2.remainingPrincipalIfContinued
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="indent">Remaining Interest:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetails2.remainingInterestIfContinued
                          )}{" "}
                          ({payoffDetails2.interestRemainingPercentage}% of
                          total interest)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="payoff-section full-width">
                  <h5>Savings Analysis</h5>
                  <table>
                    <tbody>
                      <tr>
                        <td>Total Payment Savings:</td>
                        <td>
                          ${formatScheduleNumber(payoffDetails2.totalSavings)}
                        </td>
                      </tr>
                      <tr>
                        <td>Interest Savings:</td>
                        <td>
                          $
                          {formatScheduleNumber(payoffDetails2.interestSavings)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="chart-section">
                <h5>Payment Breakdown Over Loan Term</h5>
                <PayoffChart chartData={payoffDetails2.chartData} />
              </div>
            </div>
          )}
          <button
            onClick={() => {
              setSchedule2(null);
              setPayoffDetails2(null);
            }}
            className="hide-button"
          >
            Hide Car 2
          </button>
          <table className="results-table schedule-table">
            <thead>
              <tr>
                <th>Mo</th>
                <th>Start Bal</th>
                <th>Interest</th>
                <th>Principal</th>
                <th>End Bal</th>
              </tr>
            </thead>
            <tbody>
              {schedule2.schedule.map((r) => (
                <tr key={`s2-${r.month}`}>
                  <td>{r.month}</td>
                  <td>{formatScheduleNumber(r.startBalance)}</td>
                  <td>{formatScheduleNumber(r.interest)}</td>
                  <td>{formatScheduleNumber(r.principal)}</td>
                  <td>{formatScheduleNumber(r.endBalance)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2">Sum-of-Digits:</td>
                <td>{schedule2.sumOfDigits}</td>
                <td>Total Fin Chg:</td>
                <td>${formatScheduleNumber(schedule2.totalFinanceCharge)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      {schedule2 && schedule2.error && (
        <div className="schedule-error">
          <p>Err(Car 2): {schedule2.error}</p>
          <button onClick={() => setSchedule2(null)} className="hide-button">
            X
          </button>
        </div>
      )}

      {/* Combined Schedule */}
      {scheduleCombined && !scheduleCombined.error && (
        <div className="amortization-schedule schedule-combined">
          <h3>Combined Rule of 78 Schedule</h3>
          <p className="schedule-info">
            Total Loan: ${formatScheduleNumber(scheduleCombined.loanAmount)},
            Term: {scheduleCombined.numberOfMonths} mo, Flat Int: $
            {formatScheduleNumber(scheduleCombined.totalFinanceCharge)}, Total M
            Pmt: ${formatSummaryNumber(scheduleCombined.monthlyPayment)}
          </p>

          {scheduleCombined.numberOfMonths >= 2 && !payoffDetailsCombined && (
            <div className="payoff-controls">
              <div className="payoff-month-select">
                <label>Payoff after month:</label>
                <input
                  type="number"
                  min="1"
                  max={scheduleCombined.numberOfMonths - 1}
                  value={payoffMonthCombined}
                  onChange={(e) =>
                    setPayoffMonthCombined(Number(e.target.value))
                  }
                />
              </div>
              <button
                onClick={() =>
                  handleCalculatePayoff(
                    scheduleCombined,
                    setPayoffDetailsCombined,
                    payoffMonthCombined
                  )
                }
                className="payoff-button"
              >
                Calculate Payoff
              </button>
            </div>
          )}

          {payoffDetailsCombined && (
            <button
              onClick={() => setPayoffDetailsCombined(null)}
              className="hide-payoff-button"
            >
              Hide Payoff
            </button>
          )}
          {payoffDetailsCombined && payoffDetailsCombined.error && (
            <p className="error">{payoffDetailsCombined.error}</p>
          )}
          {payoffDetailsCombined && !payoffDetailsCombined.error && (
            <div className="payoff-details">
              <h4>
                Payoff Scenario (End of Month{" "}
                {payoffDetailsCombined.totalPaidMonths})
              </h4>
              <div className="payoff-sections">
                <div className="payoff-section">
                  <h5>Payments to Date</h5>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          Total Paid (First{" "}
                          {payoffDetailsCombined.totalPaidMonths} Mo):
                        </td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetailsCombined.totalPaid
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="indent">Interest Paid:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetailsCombined.totalPaidInterest
                          )}{" "}
                          ({payoffDetailsCombined.interestPaidPercentage}% of
                          total interest)
                        </td>
                      </tr>
                      <tr>
                        <td className="indent">Principal Paid:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetailsCombined.totalPaidPrincipal
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="payoff-section">
                  <h5>Early Payoff Option</h5>
                  <table>
                    <tbody>
                      <tr>
                        <td>Payoff Amount:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetailsCombined.payoffAmount
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="indent">Remaining Principal:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetailsCombined.remainingPrincipalInPayoff
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="indent">Remaining Interest:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetailsCombined.remainingInterestInPayoff
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="indent info">(Interest Rebate:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetailsCombined.interestRebate
                          )}
                          )
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="payoff-section">
                  <h5>If Continuing Regular Payments</h5>
                  <table>
                    <tbody>
                      <tr>
                        <td>Total Remaining Payments:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetailsCombined.remainingTotalIfContinued
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="indent">Remaining Principal:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetailsCombined.remainingPrincipalIfContinued
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="indent">Remaining Interest:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetailsCombined.remainingInterestIfContinued
                          )}{" "}
                          ({payoffDetailsCombined.interestRemainingPercentage}%
                          of total interest)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="payoff-section full-width">
                  <h5>Savings Analysis</h5>
                  <table>
                    <tbody>
                      <tr>
                        <td>Total Payment Savings:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetailsCombined.totalSavings
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Interest Savings:</td>
                        <td>
                          $
                          {formatScheduleNumber(
                            payoffDetailsCombined.interestSavings
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="chart-section">
                <h5>Payment Breakdown Over Loan Term</h5>
                <PayoffChart chartData={payoffDetailsCombined.chartData} />
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setScheduleCombined(null);
              setPayoffDetailsCombined(null);
            }}
            className="hide-button"
          >
            Hide Combined
          </button>
          <table className="results-table schedule-table">
            <thead>
              <tr>
                <th>Mo</th>
                <th>Start Bal</th>
                <th>Interest</th>
                <th>Principal</th>
                <th>End Bal</th>
              </tr>
            </thead>
            <tbody>
              {scheduleCombined.schedule.map((r) => (
                <tr key={`sc-${r.month}`}>
                  <td>{r.month}</td>
                  <td>{formatScheduleNumber(r.startBalance)}</td>
                  <td>{formatScheduleNumber(r.interest)}</td>
                  <td>{formatScheduleNumber(r.principal)}</td>
                  <td>{formatScheduleNumber(r.endBalance)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2">Sum-of-Digits:</td>
                <td>{scheduleCombined.sumOfDigits}</td>
                <td>Total Fin Chg:</td>
                <td>
                  ${formatScheduleNumber(scheduleCombined.totalFinanceCharge)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      {scheduleCombined && scheduleCombined.error && (
        <div className="schedule-error">
          <p>Err(Combined): {scheduleCombined.error}</p>
          <button
            onClick={() => setScheduleCombined(null)}
            className="hide-button"
          >
            X
          </button>
        </div>
      )}

      {/* --- Configuration Comparison Display --- */}
      {showConfigComparison && (
        <div className="comparison-container">
          <h2>Configuration Comparison</h2>
          <button
            onClick={handleHideComparison}
            className="hide-comparison-button"
          >
            Hide Comparison
          </button>
          <ConfigComparison configA={configA} configB={configB} />
        </div>
      )}
    </div> // End App
  );
}

export default App;
