import React, { useState } from 'react';
import { 
  Calculator, 
  Download, 
  Edit3, 
  Save, 
  Plus, 
  Trash2,
  DollarSign,
  FileSpreadsheet
} from 'lucide-react';
import { useInspection } from '../context/InspectionContext';

interface RepairItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unitCost: number;
  laborMultiplier: number;
  totalCost: number;
  notes: string;
}

interface PricingRule {
  category: string;
  basePrice: number;
  unit: string;
  laborMultiplier: number;
}

const Estimate: React.FC = () => {
  const { photos, selectedFrames } = useInspection();
  const totalImages = photos.length + selectedFrames.length;
  const [repairItems, setRepairItems] = useState<RepairItem[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Mock pricing rules
  const pricingRules: PricingRule[] = [
    { category: 'Wall Damage', basePrice: 75, unit: 'item', laborMultiplier: 1.5 },
    { category: 'Floor Damage', basePrice: 150, unit: 'sq_ft', laborMultiplier: 2.0 },
    { category: 'Stain', basePrice: 25, unit: 'item', laborMultiplier: 1.2 },
    { category: 'Scratch', basePrice: 50, unit: 'linear_ft', laborMultiplier: 1.3 },
    { category: 'Painting', basePrice: 30, unit: 'sq_ft', laborMultiplier: 1.0 },
    { category: 'Cleaning', basePrice: 20, unit: 'hour', laborMultiplier: 1.0 },
  ];

  // Mock detected issues
  const mockDetectedIssues = [
    {
      category: 'Wall Damage',
      description: 'Small hole in drywall near entrance (detected in video frame)',
      estimatedQuantity: 1,
      room: 'Living Room'
    },
    {
      category: 'Stain',
      description: 'Water stain on ceiling above sink (detected in video frame)',
      estimatedQuantity: 1,
      room: 'Kitchen'
    },
    {
      category: 'Scratch',
      description: 'Scratch on hardwood floor near window (detected in video frame)',
      estimatedQuantity: 2,
      room: 'Bedroom'
    }
  ];

  React.useEffect(() => {
    if (repairItems.length === 0) {
      generateInitialEstimates();
    }
  }, []);

  const generateInitialEstimates = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const initialItems: RepairItem[] = mockDetectedIssues.map((issue, index) => {
        const rule = pricingRules.find(r => r.category === issue.category) || pricingRules[0];
        const unitCost = rule.basePrice;
        const totalCost = unitCost * issue.estimatedQuantity * rule.laborMultiplier;
        
        return {
          id: (index + 1).toString(),
          category: issue.category,
          description: issue.description,
          quantity: issue.estimatedQuantity,
          unitCost: unitCost,
          laborMultiplier: rule.laborMultiplier,
          totalCost: totalCost,
          notes: `Detected in ${issue.room}`
        };
      });
      
      setRepairItems(initialItems);
      setIsCalculating(false);
    }, 2000);
  };

  const updateRepairItem = (id: string, updates: Partial<RepairItem>) => {
    setRepairItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          // Recalculate total cost
          updated.totalCost = updated.quantity * updated.unitCost * updated.laborMultiplier;
          return updated;
        }
        return item;
      })
    );
  };

  const addRepairItem = () => {
    const newItem: RepairItem = {
      id: Date.now().toString(),
      category: 'Wall Damage',
      description: 'New repair item',
      quantity: 1,
      unitCost: 75,
      laborMultiplier: 1.5,
      totalCost: 112.5,
      notes: ''
    };
    
    setRepairItems(prev => [...prev, newItem]);
    setIsEditing(newItem.id);
    setShowAddItem(false);
  };

  const removeRepairItem = (id: string) => {
    setRepairItems(prev => prev.filter(item => item.id !== id));
  };

  const exportToCSV = () => {
    const headers = ['Category', 'Description', 'Quantity', 'Unit Cost', 'Labor Multiplier', 'Total Cost', 'Notes'];
    const rows = repairItems.map(item => [
      item.category,
      item.description,
      item.quantity.toString(),
      `$${item.unitCost.toFixed(2)}`,
      item.laborMultiplier.toString(),
      `$${item.totalCost.toFixed(2)}`,
      item.notes
    ]);
    
    const csvContent = [headers, ...rows].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repair_estimate_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalEstimate = repairItems.reduce((sum, item) => sum + item.totalCost, 0);
  const laborCost = repairItems.reduce((sum, item) => sum + (item.unitCost * item.quantity * (item.laborMultiplier - 1)), 0);
  const materialCost = totalEstimate - laborCost;

  if (totalImages === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Data for Cost Estimation
          </h3>
          <p className="text-gray-600 mb-4">
            Complete the video recording and review process to generate repair cost estimates.
          </p>
          <button
            onClick={() => window.location.href = '/capture'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Start New Inspection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Repair Cost Estimation
        </h1>
        <p className="mt-2 text-gray-600">
          AI-generated repair cost estimates based on video analysis and detected damage
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                ${totalEstimate.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Total Estimate</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calculator className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                ${materialCost.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Materials</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calculator className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                ${laborCost.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Labor</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileSpreadsheet className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {repairItems.length}
              </p>
              <p className="text-sm text-gray-600">Repair Items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Repair Items & Estimates
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Review and adjust AI-generated cost estimates
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <button
              onClick={() => setShowAddItem(true)}
              className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              <Plus className="h-4 w-4" />
              <span>Add Item</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Repair Items Table */}
      {isCalculating ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Calculating Estimates...
          </h3>
          <p className="text-gray-600">
            Processing detected damage and generating cost estimates
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category & Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Labor Mult.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {repairItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {isEditing === item.id ? (
                        <div className="space-y-2">
                          <select
                            value={item.category}
                            onChange={(e) => updateRepairItem(item.id, { category: e.target.value })}
                            className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          >
                            {pricingRules.map(rule => (
                              <option key={rule.category} value={rule.category}>
                                {rule.category}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateRepairItem(item.id, { description: e.target.value })}
                            className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Description"
                          />
                          <input
                            type="text"
                            value={item.notes}
                            onChange={(e) => updateRepairItem(item.id, { notes: e.target.value })}
                            className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Notes"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.category}
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.description}
                          </div>
                          {item.notes && (
                            <div className="text-xs text-gray-500 mt-1">
                              {item.notes}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === item.id ? (
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={item.quantity}
                          onChange={(e) => updateRepairItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                          className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">
                          {item.quantity}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === item.id ? (
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitCost}
                          onChange={(e) => updateRepairItem(item.id, { unitCost: parseFloat(e.target.value) || 0 })}
                          className="w-24 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">
                          ${item.unitCost.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === item.id ? (
                        <input
                          type="number"
                          min="1"
                          step="0.1"
                          value={item.laborMultiplier}
                          onChange={(e) => updateRepairItem(item.id, { laborMultiplier: parseFloat(e.target.value) || 1 })}
                          className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">
                          {item.laborMultiplier}x
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        ${item.totalCost.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {isEditing === item.id ? (
                          <button
                            onClick={() => setIsEditing(null)}
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Save changes"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setIsEditing(item.id)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Edit item"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => removeRepairItem(item.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add New Item Row */}
          {showAddItem && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  Add new repair item
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={addRepairItem}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddItem(false)}
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Summary Footer */}
          <div className="bg-gray-50 border-t border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <p>Total Items: {repairItems.length}</p>
                <p>Material Cost: ${materialCost.toFixed(2)} | Labor Cost: ${laborCost.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  Total Estimate: ${totalEstimate.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Generated by AI analysis
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Rules Reference */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          💡 Pricing Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-blue-800">
          {pricingRules.map((rule, index) => (
            <div key={index} className="bg-white rounded p-3">
              <div className="font-medium">{rule.category}</div>
              <div>${rule.basePrice}/{rule.unit}</div>
              <div className="text-xs text-blue-600">Labor: {rule.laborMultiplier}x</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Estimate;