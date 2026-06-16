import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CreditRatingRow } from '../data/mockData';
import { ReferenceDocsPanel } from '../components/ReferenceDocsPanel';
import { Download } from 'lucide-react';
import { downloadCSV } from '../utils/export';
import { fetchCompanyCreditRatings } from '../utils/graphqlClient';

export function CreditRatings() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCompanyCreditRatings(id)
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
    return <div className="p-8 text-center text-gray-500">Loading credit ratings...</div>;
  }

  if (!company) {
    return (
      <div className="p-8 text-center text-gray-500">Company not found.</div>);

  }
  const { creditRatings } = company;
  if (!creditRatings) {
    return (
      <div className="p-8 text-center text-gray-500">
        Credit Ratings data not available.
      </div>);

  }
  const renderRatingTable = (
  data: CreditRatingRow[],
  title: string,
  tableId: string) =>
  {
    if (data.length === 0) {
      return (
        <div
          id={tableId}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-24">
          
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-heading text-lg text-brand-blue">{title}</h2>
          </div>
          <div className="p-6 text-center text-sm text-gray-500">
            No data found for {title}.
          </div>
        </div>);

    }
    return (
      <div
        id={tableId}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-24">
        
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="font-heading text-lg text-brand-blue">{title}</h2>
          <button
            onClick={() =>
            downloadCSV(data, title.toLowerCase().replace(/\s+/g, '-'))
            }
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
                  Instrument
                </th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  Outlook
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, idx) =>
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-blue">
                    {row.instrument}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {row.rating}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.outlook}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>);

  };
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl text-brand-blue">
          Credit Ratings
        </h1>
      </div>

      {renderRatingTable(creditRatings.crisil, 'CRISIL', 'crisil')}
      {renderRatingTable(creditRatings.icra, 'ICRA', 'icra')}
      {renderRatingTable(
        creditRatings.unaccepted,
        'Unaccepted Ratings',
        'unaccepted-ratings'
      )}

      <ReferenceDocsPanel docs={company.referenceDocs?.creditRatings} />
    </div>);

}