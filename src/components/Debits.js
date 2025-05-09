/*==================================================
src/components/Debits.js

The Debits component contains information for Debits page view.
Note: You need to work on this file for the Assignment.
==================================================*/
import React from 'react';
import {Link} from 'react-router-dom';

const Debits = (props) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const description = e.target.description.value;
    const amount = parseFloat(e.target.amount.value);
    const date = new Date().toISOString();
    props.addDebit({ description, amount, date });
    e.target.reset();
  };
  // Render the list of Debit items and a form to input new Debit item
  return (
    <div>
      <h1>Debits</h1>
      <ul>
        {props.debits.map((debit, index) => (
          <li key={index}>
            {debit.description} - ${debit.amount.toFixed(2)} on {debit.date.slice(0, 10)}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" name="description" placeholder="Description" required />
        <input type="number" name="amount" placeholder="Amount" step="0.01" required />
        <button type="submit">Add Debit</button>
      </form>
      <Link to="/">Return to Home</Link>
    </div>
  );
};

export default Debits;