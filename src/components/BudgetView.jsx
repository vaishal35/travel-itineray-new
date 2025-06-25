// src/components/BudgetView.jsx
import React from 'react';

const BudgetView = ({ tripBudget, expenses }) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Budget Tracker</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">${tripBudget}</div>
          <div className="text-sm text-gray-600">Total Budget</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Spent</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">${(tripBudget - totalExpenses).toFixed(2)}</div>
          <div className="text-sm text-gray-600">Remaining</div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No expenses recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">{expense.description}</div>
                  <div className="text-sm text-gray-600">{expense.category} • {expense.date}</div>
                </div>
                <div className="font-medium text-gray-800">${expense.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetView;
