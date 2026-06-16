import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ReferenceDocsPanel } from '../components/ReferenceDocsPanel';
import { Download } from 'lucide-react';
import { downloadCSV } from '../utils/export';
import { fetchCompanyCompliance } from '../utils/graphqlClient';

export function Compliance() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<'standalone' | 'consolidated'>(
    'standalone'
  );

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCompanyCompliance(id)
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
    return <div className="p-8 text-center text-gray-500">Loading compliance data...</div>;
  }

  if (!company) {
    return (
      <div className="p-8 text-center text-gray-500">Company not found.</div>);

  }
  const { compliance } = company;
  if (!compliance) {
    return (
      <div className="p-8 text-center text-gray-500">
        Compliance data not available.
      </div>);

  }
  const auditorRemarksData = compliance.auditorRemarks[viewType];
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl text-brand-blue">Compliance</h1>
      </div>

      {/* Auditor Remarks */}
      <div
        id="auditor-remarks"
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-24">
        
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="font-heading text-lg text-brand-blue">
            Auditor Remarks
          </h2>
          <div className="flex items-center gap-3">
            <div className="inline-flex bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button
                onClick={() => setViewType('standalone')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewType === 'standalone' ? 'bg-white text-brand-blue shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                
                Standalone
              </button>
              <button
                onClick={() => setViewType('consolidated')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewType === 'consolidated' ? 'bg-white text-brand-blue shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                
                Consolidated
              </button>
            </div>
            <button
              onClick={() =>
              downloadCSV(auditorRemarksData, `auditor-remarks-${viewType}`)
              }
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors">
              
              <Download className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  Financial Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditorRemarksData.map((row, idx) =>
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-blue">
                    {row.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.remarks}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suit Filed */}
      <div
        id="suit-filed"
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-24">
        
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-heading text-lg text-brand-blue">Suit Filed</h2>
        </div>
        <div className="p-6 text-center text-sm text-gray-500">
          No suit filed records found against given company / directors.
        </div>
      </div>

      {/* CDR */}
      <div
        id="cdr"
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-24">
        
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-heading text-lg text-brand-blue">
            Corporate Debt Restructuring (CDR)
          </h2>
        </div>
        <div className="p-6 text-center text-sm text-gray-500">
          No records found.
        </div>
      </div>

      {/* BIFR History */}
      <div
        id="bifr-history"
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-24">
        
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-heading text-lg text-brand-blue">BIFR History</h2>
        </div>
        <div className="p-6 text-center text-sm text-gray-500">
          No BIFR records found.
        </div>
      </div>

      <ReferenceDocsPanel docs={company.referenceDocs?.compliance} />
    </div>);

}