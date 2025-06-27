
import React, { useState } from 'react';
import { Package, Check, Plus, X } from 'lucide-react';

const PackingView = ({ packingList }) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [newItem, setNewItem] = useState('');
  const [customItems, setCustomItems] = useState([]);

  const toggleItem = (index) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const addCustomItem = () => {
    if (newItem.trim()) {
      setCustomItems([...customItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeCustomItem = (index) => {
    setCustomItems(customItems.filter((_, i) => i !== index));
  };

  const allItems = [...packingList, ...customItems];
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progress = allItems.length > 0 ? (checkedCount / allItems.length) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
              <Package size={24} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Packing List</h2>
              <p className="text-gray-600 mt-1">
                {checkedCount} of {allItems.length} items packed
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">{Math.round(progress)}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-white rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Add New Item */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add custom item..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
            />
            <button
              onClick={addCustomItem}
              className="flex items-center justify-center w-10 h-10 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allItems.map((item, idx) => {
            const isCustom = idx >= packingList.length;
            const isChecked = checkedItems[idx];
            
            return (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  isChecked 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleItem(idx)}
                    className={`flex items-center justify-center w-6 h-6 rounded border-2 transition-colors ${
                      isChecked
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {isChecked && <Check size={14} />}
                  </button>
                  <span className={`font-medium ${
                    isChecked ? 'text-green-800 line-through' : 'text-gray-900'
                  }`}>
                    {item}
                  </span>
                  {isCustom && (
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">Custom</span>
                  )}
                </div>
                
                {isCustom && (
                  <button
                    onClick={() => removeCustomItem(idx - packingList.length)}
                    className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {allItems.length === 0 && (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Package size={32} className="text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items yet</h3>
            <p className="text-gray-600">Add some items to start packing!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackingView;
