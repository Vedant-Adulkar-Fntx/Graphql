import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ReferenceDocsPanel } from '../components/ReferenceDocsPanel';
import { Download } from 'lucide-react';
import { downloadCSV } from '../utils/export';
import { fetchCompanyCharges } from '../utils/graphqlClient';

export function OpenCharges() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCompanyCharges(id)
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
    return <div className="p-8 text-center text-gray-500">Loading charges...</div>;
  }

  if (!company) {
    return (
      <div className="p-8 text-center text-gray-500">Company not found.</div>);

  }
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            Open
          </span>);

      case 'Closed':
      case 'Satisfied':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            {status}
          </span>);

      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            {status}
          </span>);

    }
  };
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl text-brand-blue">
          Charge Details
        </h1>
        <button
          onClick={() => downloadCSV(company.charges, 'charge-details')}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors">
          
          <Download className="w-4 h-4 mr-2 text-gray-500" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Holder
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {company.charges.length > 0 ?
              company.charges.map((charge, index) =>
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors">
                
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-blue">
                      {charge.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {charge.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {charge.holder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {charge.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(charge.status)}
                    </td>
                  </tr>
              ) :

              <tr>
                  <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-gray-500">
                  
                    No charges information available.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <ReferenceDocsPanel docs={company.referenceDocs?.charges} />
    </div>);

}