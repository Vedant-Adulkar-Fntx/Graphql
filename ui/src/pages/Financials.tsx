import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FinancialRow } from '../data/mockData';
import { ReferenceDocsPanel } from '../components/ReferenceDocsPanel';
import { downloadCSV } from '../utils/export';
import { fetchCompanyFinancials } from '../utils/graphqlClient';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar } from
'recharts';
import { X, TrendingUp, Download } from 'lucide-react';
export function Financials() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<'standalone' | 'consolidated'>(
    'standalone'
  );
  const [unit, setUnit] = useState<'cr' | 'lakhs'>('cr');
  const [showTrends, setShowTrends] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCompanyFinancials(id)
      .then((data) => {
        setCompany(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading financials...</div>;
  }

  if (!company) {
    return (
      <div className="p-8 text-center text-gray-500">Company not found.</div>);

  }
  const { financials } = company;
  if (!financials) {
    return (
      <div className="p-8 text-center text-gray-500">
        Financial data not available for this company.
      </div>);

  }
  const data =
  viewType === 'standalone' ? financials.standalone : financials.consolidated;
  const formatValue = (val: string, label: string, tableId: string) => {
    if (val === '-' || val === '') return val;
    if (unit === 'cr') return val;
    // Do not convert percentages, EPS, or ratios
    if (label.includes('%') || label === 'EPS in Rs' || tableId === 'ratios') {
      return val;
    }
    // Remove commas before parsing
    const cleanStr = val.toString().replace(/,/g, '');
    const num = parseFloat(cleanStr);
    if (isNaN(num)) return val;
    
    // Convert Crores to Lakhs (* 100)
    const converted = num * 100;
    
    // Format back with Indian comma style (or standard locale)
    return converted.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  const renderFinancialTable = (
  rows: FinancialRow[],
  title: string,
  id: string) =>
  {
    const handleExport = () => {
      const exportData = rows.map((row) => {
        const rowData: any = {
          Particulars: row.label
        };
        financials.years.forEach((year, idx) => {
          rowData[year] = formatValue(row.values[idx], row.label, id);
        });
        return rowData;
      });
      downloadCSV(exportData, `${id}-${viewType}`);
    };
    return (
      <div
        id={id}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-24 mb-8">
        
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="font-heading text-lg text-brand-blue">{title}</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors">
              
              <Download className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
              Export
            </button>
            <span className="text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded border border-gray-200">
              {id === 'ratios' ?
              'Ratios / %' :
              `₹ in ${unit === 'cr' ? 'Cr.' : 'Lakhs'}`}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r border-gray-200">
                  
                  Particulars
                </th>
                {financials.years.map((year) =>
                <th
                  key={year}
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-heading font-bold text-gray-500 uppercase tracking-wider min-w-[100px]">
                  
                    {year}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row, idx) => {
                const isBold =
                row.label.startsWith('Total') ||
                row.label === 'Net Profit' ||
                row.label === 'Operating Profit' ||
                row.label === 'Gross Block' ||
                row.label === 'Net Cash Flow' ||
                row.label === 'Free Cash Flow';
                return (
                  <tr
                    key={idx}
                    className={`hover:bg-gray-50 transition-colors ${isBold ? 'bg-gray-50/50' : ''}`}>
                    
                    <td
                      className={`px-6 py-3 whitespace-nowrap text-sm sticky left-0 bg-white z-10 border-r border-gray-200 ${isBold ? 'font-bold text-brand-blue' : 'text-gray-700'}`}>
                      
                      {row.label}
                    </td>
                    {row.values.map((val, vIdx) =>
                    <td
                      key={vIdx}
                      className={`px-6 py-3 whitespace-nowrap text-sm text-right ${isBold ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                      
                        {formatValue(val, row.label, id)}
                      </td>
                    )}
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>);

  };
  // Prepare chart data (chronological order)
  const chartData = [...financials.years].reverse().map((year, index) => {
    const originalIndex = financials.years.length - 1 - index;
    const getValue = (
    table: FinancialRow[],
    label: string,
    tableId: string) =>
    {
      const row = table.find((r) => r.label === label);
      if (!row) return 0;
      const val = row.values[originalIndex];
      if (val === '-') return 0;
      const cleanStr = val.toString().replace(/,/g, '');
      const num = parseFloat(cleanStr) || 0;
      if (
      unit === 'lakhs' &&
      !label.includes('%') &&
      label !== 'EPS in Rs' &&
      tableId !== 'ratios')
      {
        return num * 100;
      }
      return num;
    };
    return {
      year,
      'Total Assets': getValue(
        data.balanceSheet,
        'Total Assets',
        'balance-sheet'
      ),
      'Total Liabilities': getValue(
        data.balanceSheet,
        'Total Liabilities',
        'balance-sheet'
      ),
      Sales: getValue(data.profitAndLoss, 'Sales', 'profit-loss'),
      'Net Profit': getValue(data.profitAndLoss, 'Net Profit', 'profit-loss'),
      'Net Cash Flow': getValue(data.cashFlow, 'Net Cash Flow', 'cash-flow'),
      'ROE %': getValue(data.ratios, 'Return on Equity (ROE) %', 'ratios'),
      'Net Profit Margin %': getValue(
        data.ratios,
        'Net Profit Margin %',
        'ratios'
      )
    };
  });
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <h1 className="font-heading text-2xl text-brand-blue">Financials</h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle */}
          <div className="inline-flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setViewType('standalone')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewType === 'standalone' ? 'bg-white text-brand-blue shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
              
              Standalone
            </button>
            <button
              onClick={() => setViewType('consolidated')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewType === 'consolidated' ? 'bg-white text-brand-blue shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
              
              Consolidated
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="inline-flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setUnit('cr')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${unit === 'cr' ? 'bg-white text-brand-blue shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
              
              ₹ Cr
            </button>
            <button
              onClick={() => setUnit('lakhs')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${unit === 'lakhs' ? 'bg-white text-brand-blue shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
              
              ₹ Lakhs
            </button>
          </div>

          {/* View Trends Button */}
          <button
            onClick={() => setShowTrends(true)}
            className="inline-flex items-center px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition-colors shadow-sm">
            
            <TrendingUp className="w-4 h-4 mr-2" />
            View Trends
          </button>
        </div>
      </div>

      {renderFinancialTable(
        data.balanceSheet,
        'Balance Sheet',
        'balance-sheet'
      )}
      {renderFinancialTable(data.profitAndLoss, 'Profit & Loss', 'profit-loss')}
      {renderFinancialTable(data.cashFlow, 'Cash Flow', 'cash-flow')}
      {renderFinancialTable(data.ratios, 'Ratios', 'ratios')}

      {/* Auditor(s) */}
      <div
        id="auditors"
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-24">
        
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="font-heading text-lg text-brand-blue">Auditor(s)</h2>
          <button
            onClick={() => downloadCSV(financials.auditors, 'auditors')}
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors">
            
            <Download className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
            Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Year
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Auditor Name(s)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Auditor Firm
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Name(s)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  PAN
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {financials.auditors.map((auditor, idx) =>
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-blue">
                    {auditor.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {auditor.auditorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {auditor.auditorFirm}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {auditor.names}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {auditor.pan}
                  </td>
                  <td
                  className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate"
                  title={auditor.address}>
                  
                    {auditor.address}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReferenceDocsPanel docs={company.referenceDocs?.financials} />

      {/* Trends Modal */}
      {showTrends &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-heading text-xl text-brand-blue">
                  Financial Trends
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {viewType === 'standalone' ? 'Standalone' : 'Consolidated'} •
                  Values in {unit === 'cr' ? '₹ Crore' : '₹ Lakhs'}
                </p>
              </div>
              <button
              onClick={() => setShowTrends(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Balance Sheet Trend */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-heading text-md text-brand-blue mb-4">
                  Balance Sheet Growth
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 20,
                      bottom: 5,
                      left: 0
                    }}>
                    
                      <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB" />
                    
                      <XAxis
                      dataKey="year"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: '#6B7280'
                      }} />
                    
                      <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: '#6B7280'
                      }} />
                    
                      <Tooltip
                      cursor={{
                        fill: '#F3F4F6'
                      }}
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }} />
                    
                      <Legend
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: '12px'
                      }} />
                    
                      <Bar
                      dataKey="Total Assets"
                      fill="#0A1264"
                      radius={[4, 4, 0, 0]} />
                    
                      <Bar
                      dataKey="Total Liabilities"
                      fill="#FFC832"
                      radius={[4, 4, 0, 0]} />
                    
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* P&L Trend */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-heading text-md text-brand-blue mb-4">
                  Revenue & Profitability
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 20,
                      bottom: 5,
                      left: 0
                    }}>
                    
                      <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB" />
                    
                      <XAxis
                      dataKey="year"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: '#6B7280'
                      }} />
                    
                      <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: '#6B7280'
                      }} />
                    
                      <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }} />
                    
                      <Legend
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: '12px'
                      }} />
                    
                      <Line
                      type="monotone"
                      dataKey="Sales"
                      stroke="#0A1264"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        strokeWidth: 2
                      }}
                      activeDot={{
                        r: 6
                      }} />
                    
                      <Line
                      type="monotone"
                      dataKey="Net Profit"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        strokeWidth: 2
                      }}
                      activeDot={{
                        r: 6
                      }} />
                    
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cash Flow Trend */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-heading text-md text-brand-blue mb-4">
                  Net Cash Flow
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 20,
                      bottom: 5,
                      left: 0
                    }}>
                    
                      <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB" />
                    
                      <XAxis
                      dataKey="year"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: '#6B7280'
                      }} />
                    
                      <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: '#6B7280'
                      }} />
                    
                      <Tooltip
                      cursor={{
                        fill: '#F3F4F6'
                      }}
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }} />
                    
                      <Legend
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: '12px'
                      }} />
                    
                      <Bar
                      dataKey="Net Cash Flow"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]} />
                    
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Ratios Trend */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-heading text-md text-brand-blue mb-4">
                  Key Ratios (%)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 20,
                      bottom: 5,
                      left: 0
                    }}>
                    
                      <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB" />
                    
                      <XAxis
                      dataKey="year"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: '#6B7280'
                      }} />
                    
                      <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: '#6B7280'
                      }} />
                    
                      <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }} />
                    
                      <Legend
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: '12px'
                      }} />
                    
                      <Line
                      type="monotone"
                      dataKey="ROE %"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        strokeWidth: 2
                      }}
                      activeDot={{
                        r: 6
                      }} />
                    
                      <Line
                      type="monotone"
                      dataKey="Net Profit Margin %"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        strokeWidth: 2
                      }}
                      activeDot={{
                        r: 6
                      }} />
                    
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}