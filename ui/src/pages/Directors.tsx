import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ReferenceDocsPanel } from '../components/ReferenceDocsPanel';
import { Download } from 'lucide-react';
import { downloadCSV } from '../utils/export';
import { fetchCompanyDirectors } from '../utils/graphqlClient';

export function Directors() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCompanyDirectors(id)
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
    return <div className="p-8 text-center text-gray-500">Loading directors...</div>;
  }

  if (!company) {
    return (
      <div className="p-8 text-center text-gray-500">Company not found.</div>);

  }
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl text-brand-blue">
          Directors & Signatories
        </h1>
        <button
          onClick={() => downloadCSV(company.directors, 'directors')}
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
                  
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  DIN
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Present Designation
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Present Designation Appt. Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Original Appt. Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Cessation Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {company.directors.length > 0 ?
              company.directors.map((director, index) =>
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors">
                
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-blue">
                      {director.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {director.din}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {director.designation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {director.designationDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {director.originalDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {director.cessationDate || '-'}
                    </td>
                  </tr>
              ) :

              <tr>
                  <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-sm text-gray-500">
                  
                    No director information available.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <ReferenceDocsPanel docs={company.referenceDocs?.directors} />
    </div>);

}