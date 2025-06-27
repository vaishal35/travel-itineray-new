
import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard } from 'lucide-react';

const BudgetView = ({ tripBudget, expenses }) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = tripBudget - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-5 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
              <Wallet size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Budget Tracker</h2>
              <p className="text-gray-600 mt-1">Monitor your travel expenses</p>
            </div>
          </div>
        </div>

        {/* Budget Overview Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                  <DollarSign size={20} className="text-blue-600" />
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">BUDGET</span>
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-1">${tripBudget}</div>
              <div className="text-sm text-blue-700">Total allocated</div>
            </div>

            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                  <TrendingUp size={20} className="text-red-600" />
                </div>
                <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">SPENT</span>
              </div>
              <div className="text-3xl font-bold text-red-900 mb-1">${totalExpenses.toFixed(2)}</div>
              <div className="text-sm text-red-700">
                {tripBudget > 0 ? `${((totalExpenses / tripBudget) * 100).toFixed(1)}% of budget` : 'No budget set'}
              </div>
            </div>

            <div className={`${remaining >= 0 ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'} rounded-xl p-6 border`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${remaining >= 0 ? 'bg-green-100' : 'bg-orange-100'}`}>
                  {remaining >= 0 ? (
                    <TrendingDown size={20} className="text-green-600" />
                  ) : (
                    <TrendingUp size={20} className="text-orange-600" />
                  )}
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${remaining >= 0 ? 'text-green-600 bg-green-100' : 'text-orange-600 bg-orange-100'}`}>
                  {remaining >= 0 ? 'REMAINING' : 'OVER BUDGET'}
                </span>
              </div>
              <div className={`text-3xl font-bold mb-1 ${remaining >= 0 ? 'text-green-900' : 'text-orange-900'}`}>
                ${Math.abs(remaining).toFixed(2)}
              </div>
              <div className={`text-sm ${remaining >= 0 ? 'text-green-700' : 'text-orange-700'}`}>
                {remaining >= 0 ? 'Available to spend' : 'Over your budget'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <CreditCard size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
          </div>
        </div>

        <div className="p-6">
          {expenses.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <CreditCard size={32} className="text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No expenses yet</h3>
              <p className="text-gray-600">Your travel expenses will appear here once you start tracking them.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-lg">
                      <DollarSign size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{expense.description}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <span className="bg-gray-200 px-2 py-1 rounded text-xs font-medium capitalize">
                          {expense.category}
                        </span>
                        <span>•</span>
                        <span>{expense.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">${expense.amount.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetView;
