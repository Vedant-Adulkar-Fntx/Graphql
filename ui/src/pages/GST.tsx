import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GSTINDetail } from '../data/mockData';
import { ReferenceDocsPanel } from '../components/ReferenceDocsPanel';
import { Download, X } from 'lucide-react';
import { downloadCSV } from '../utils/export';
import { fetchCompanyGST } from '../utils/graphqlClient';

export function GST() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGSTIN, setSelectedGSTIN] = useState<GSTINDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCompanyGST(id)
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
    return <div className="p-8 text-center text-gray-500">Loading GST records...</div>;
  }

  if (!company) {
    return (
      <div className="p-8 text-center text-gray-500">Company not found.</div>);

  }
  const { gst } = company;
  if (!gst) {
    return (
      <div className="p-8 text-center text-gray-500">
        GST data not available.
      </div>);

  }
  const DetailRow = ({ label, value }: {label: string;value: string;}) =>
  <div className="flex flex-col py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <span className="text-sm text-gray-900 mt-1">{value}</span>
    </div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl text-brand-blue">GST</h1>
      </div>

      {/* Active GSTINs */}
      <div
        id="active-gstins"
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-24">
        
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="font-heading text-lg text-brand-blue">
            Active GSTINs
          </h2>
          <button
            onClick={() =>
            downloadCSV(
              gst.active.map((a) => ({
                GSTIN: a.gstin,
                State: a.state,
                FY: a.fy,
                Type: a.type,
                LatestFilingDate: a.latestFilingDate,
                TaxPeriod: a.taxPeriod
              })),
              'active-gstins'
            )
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
                  GST IN
                </th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  FY
                </th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  GST Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  Latest Filing Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  Tax Period
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gst.active.map((row, idx) =>
              <tr
                key={idx}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedGSTIN(row.details)}>
                
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-blue hover:underline">
                    {row.gstin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.state}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.fy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.latestFilingDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.taxPeriod}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inactive GSTINs */}
      <div
        id="inactive-gstins"
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-24">
        
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="font-heading text-lg text-brand-blue">
            Inactive GSTINs
          </h2>
          <button
            onClick={() =>
            downloadCSV(
              gst.inactive.map((i) => ({
                GSTIN: i.gstin,
                State: i.state,
                Status: i.status
              })),
              'inactive-gstins'
            )
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
                  GST IN
                </th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gst.inactive.map((row, idx) =>
              <tr
                key={idx}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedGSTIN(row.details)}>
                
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-blue hover:underline">
                    {row.gstin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.state}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      {row.status}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReferenceDocsPanel docs={company.referenceDocs?.gst} />

      {/* GSTIN Detail Modal */}
      {selectedGSTIN &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="font-heading text-xl text-brand-blue">
                GSTIN Details
              </h2>
              <button
              onClick={() => setSelectedGSTIN(null)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
              
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <DetailRow
                label="Legal Name of Business"
                value={selectedGSTIN.legalName} />
              
                <DetailRow label="Trade Name" value={selectedGSTIN.tradeName} />
                <DetailRow label="GSTIN Status" value={selectedGSTIN.status} />
                <DetailRow
                label="Date of Registration"
                value={selectedGSTIN.registrationDate} />
              
                <DetailRow
                label="Taxpayer Type"
                value={selectedGSTIN.taxpayerType} />
              
                <DetailRow
                label="Nature of Business Activities"
                value={selectedGSTIN.natureOfBusiness} />
              
                <DetailRow label="State" value={selectedGSTIN.state} />
                <DetailRow
                label="State Jurisdiction"
                value={selectedGSTIN.stateJurisdiction} />
              
                <DetailRow
                label="Centre Jurisdiction"
                value={selectedGSTIN.centreJurisdiction} />
              
                <DetailRow
                label="Return Type"
                value={selectedGSTIN.returnType} />
              
                <DetailRow label="Financial Year" value={selectedGSTIN.fy} />
                <DetailRow label="Tax Period" value={selectedGSTIN.taxPeriod} />
                <DetailRow
                label="Filing Due Date"
                value={selectedGSTIN.filingDueDate} />
              
                <DetailRow
                label="Date of Filing"
                value={selectedGSTIN.dateOfFiling} />
              
                <DetailRow label="Status" value={selectedGSTIN.filingStatus} />
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}