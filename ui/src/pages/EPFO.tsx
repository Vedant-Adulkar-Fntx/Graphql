import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EPFORow } from '../data/mockData';
import { ReferenceDocsPanel } from '../components/ReferenceDocsPanel';
import { Download, TrendingUp, X } from 'lucide-react';
import { downloadCSV } from '../utils/export';
import { fetchCompanyEPFO } from '../utils/graphqlClient';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer } from
'recharts';
export function EPFO() {
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [unit, setUnit] = useState<'lakhs' | 'crore'>('lakhs');
  const [showTrends, setShowTrends] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCompanyEPFO(id)
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
    return <div className="p-8 text-center text-gray-500">Loading EPFO contributions...</div>;
  }

  if (!company) {
    return (
      <div className="p-8 text-center text-gray-500">Company not found.</div>);

  }
  const { epfo } = company;
  if (!epfo) {
    return (
      <div className="p-8 text-center text-gray-500">
        EPFO data not available.
      </div>);

  }
  const formatAmount = (amount: number) => {
    if (unit === 'crore') {
      return (amount / 10000000).toFixed(2);
    }
    return (amount / 100000).toFixed(2);
  };
  const chartData = [...epfo].reverse().map((row) => ({
    month: row.wageMonth,
    Employees: row.employees,
    Amount: unit === 'crore' ? row.amount / 10000000 : row.amount / 100000
  }));
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <h1 className="font-heading text-2xl text-brand-blue">EPFO</h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Unit Toggle */}
          <div className="inline-flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setUnit('lakhs')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${unit === 'lakhs' ? 'bg-white text-brand-blue shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
              
              ₹ Lakhs
            </button>
            <button
              onClick={() => setUnit('crore')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${unit === 'crore' ? 'bg-white text-brand-blue shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
              
              ₹ Crore
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="font-heading text-lg text-brand-blue">
            EPFO Contributions
          </h2>
          <button
            onClick={() => {
              const exportData = epfo.map((row) => ({
                'Establishment ID': row.id,
                'Establishment Name': row.name,
                City: row.city,
                'Latest Wage Month': row.wageMonth,
                'Latest Date of Credit': row.dateOfCredit,
                'No. of Employees': row.employees,
                [`Amount (₹ ${unit === 'crore' ? 'Crore' : 'Lakhs'})`]:
                formatAmount(row.amount)
              }));
              downloadCSV(exportData, 'epfo-contributions');
            }}
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors">
            
            <Download className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
            Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  Establishment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  Establishment Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  Latest Wage Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  Latest Date of Credit
                </th>
                <th className="px-6 py-3 text-right text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  No. of Employees
                </th>
                <th className="px-6 py-3 text-right text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  Amount (₹ {unit === 'crore' ? 'Cr' : 'Lakhs'})
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {epfo.map((row, idx) =>
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-blue">
                    {row.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.wageMonth}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.dateOfCredit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {row.employees}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    {formatAmount(row.amount)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReferenceDocsPanel docs={company.referenceDocs?.epfo} />

      {/* Trends Modal */}
      {showTrends &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-heading text-xl text-brand-blue">
                  EPFO Trends
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Values in ₹ {unit === 'crore' ? 'Crore' : 'Lakhs'}
                </p>
              </div>
              <button
              onClick={() => setShowTrends(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 gap-8">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-heading text-md text-brand-blue mb-4">
                  Employees & Contributions
                </h3>
                <div className="h-72">
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
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: '#6B7280'
                      }} />
                    
                      <YAxis
                      yAxisId="left"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: '#6B7280'
                      }} />
                    
                      <YAxis
                      yAxisId="right"
                      orientation="right"
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
                      yAxisId="left"
                      type="monotone"
                      dataKey="Employees"
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
                      yAxisId="right"
                      type="monotone"
                      dataKey="Amount"
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
            </div>
          </div>
        </div>
      }
    </div>);

}