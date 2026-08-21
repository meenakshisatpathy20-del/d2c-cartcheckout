import React from 'react';
import { Package } from 'lucide-react';
import { api } from '../../services/api';

export default function InventoryManager({ products, onRefresh }) {
  const handleStockUpdate = async (skuId, newStock) => {
    try {
      await api.updateStock(skuId, newStock);
      onRefresh();
    } catch (err) {}
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
        <Package className="w-5 h-5 mr-2 text-orange-500" /> Warehouse Inventory Allocations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{p.brand}</p>
            <p className="font-semibold text-sm text-slate-800 mt-1 line-clamp-1">{p.name}</p>
            <p className="text-xs text-slate-500 mb-3">{p.warehouseCity}</p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-xs text-slate-600 font-medium">Available Stock:</span>
              <input
                type="number"
                defaultValue={p.stock}
                key={p.stock}
                onBlur={(e) => handleStockUpdate(p.id, e.target.value)}
                className="w-16 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-center bg-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}