// src/components/PackingView.jsx
import React from 'react';

const PackingView = ({ packingList }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Packing List</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {packingList.map((item, idx) => (
        <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <input type="checkbox" className="w-5 h-5 text-blue-600" />
          <span className="text-gray-800">{item}</span>
        </div>
      ))}
    </div>
  </div>
);

export default PackingView;
