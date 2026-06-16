import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShareholdingRow } from '../data/mockData';
import { ReferenceDocsPanel } from '../components/ReferenceDocsPanel';
import { Download } from 'lucide-react';
import { downloadCSV } from '../utils/export';
import { fetchCompanyStructure } from '../utils/graphqlClient';

export function CompanyStructure() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCompanyStructure(id)
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
    return <div className="p-8 text-center text-gray-500">Loading company structure...</div>;
  }

  if (!company) {
    return (
      <div className="p-8 text-center text-gray-500">Company not found.</div>);

  }
  const { structure } = company;
  if (!structure) {
    return (
      <div className="p-8 text-center text-gray-500">
        Structure data not available for this company.
      </div>);

  }
  const renderShareholdingTable = (data: ShareholdingRow[], title: string) => {
    const totalEquity = data.reduce((sum, row) => sum + row.equityShares, 0);
    const totalEquityPercent = data.reduce(
      (sum, row) => sum + row.equityPercent,
      0
    );
    const totalPref = data.reduce((sum, row) => sum + row.prefShares, 0);
    const totalPrefPercent = data.reduce((sum, row) => sum + row.prefPercent, 0);
    return (
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-md text-brand-blue">{title}</h3>
          <button
            onClick={() => downloadCSV(data, 'shareholding')}
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors">
            
            <Download className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
            Export
          </button>
        </div>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Category
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Equity - Number of Shares
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Equity - Percentage
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Preference - Number of Shares
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Preference - Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, idx) => {
                const isHeader =
                !row.category.startsWith('(') &&
                !row.category.match(/^\d+\./) &&
                row.category !== 'Total';
                return (
                  <tr
                    key={idx}
                    className={`hover:bg-gray-50 transition-colors ${isHeader ? 'bg-gray-50/50' : ''}`}>
                    
                    <td
                      className={`px-4 py-2 whitespace-nowrap text-sm ${isHeader ? 'font-semibold text-gray-900' : 'text-gray-600 pl-8'}`}>
                      
                      {row.category}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                      {row.equityShares.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                      {row.equityPercent.toFixed(2)}%
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                      {row.prefShares.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                      {row.prefPercent.toFixed(2)}%
                    </td>
                  </tr>);

              })}
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  Total
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                  {totalEquity.toLocaleString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                  {totalEquityPercent.toFixed(2)}%
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                  {totalPref.toLocaleString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                  {totalPrefPercent.toFixed(2)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>);

  };
  const renderRelatedCorporatesTable = (data: any[], title: string) => {
    if (data.length === 0) {
      return (
        <div className="mt-6">
          <h3 className="font-heading text-md text-brand-blue mb-3">{title}</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-sm text-gray-500">
            No data available
          </div>
        </div>);

    }
    return (
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-md text-brand-blue">{title}</h3>
          <button
            onClick={() => downloadCSV(data, 'related-corporates')}
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors">
            
            <Download className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
            Export
          </button>
        </div>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Corporate Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Shareholding (%)
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  City
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  PUC (₹ cr.)
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  SOC (₹ cr.)
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Incorp. Date
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, idx) =>
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-brand-blue">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {row.shareholdingPercent.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {row.city}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {row.puc}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {row.soc}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {row.incorpDate}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      {row.status}
                    </span>
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
          Company Structure
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Promoter %
          </span>
          <span className="text-2xl font-heading text-brand-blue">
            {structure.summary.promoterPercent}%
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Public %
          </span>
          <span className="text-2xl font-heading text-brand-blue">
            {structure.summary.publicPercent}%
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Shareholders
          </span>
          <span className="text-2xl font-heading text-brand-blue">
            {structure.summary.shareholdersCount}
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Total Equity
          </span>
          <span className="text-2xl font-heading text-brand-blue">
            {structure.summary.totalEquityShares.toLocaleString()}
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Total Preference
          </span>
          <span className="text-2xl font-heading text-brand-blue">
            {structure.summary.totalPrefShares.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 1. Share Holding Pattern */}
      <div
        id="share-holding-pattern"
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-24">
        
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-heading text-lg text-brand-blue">
            1. Share Holding Pattern
          </h2>
        </div>
        <div className="p-6">
          {renderShareholdingTable(
            structure.shareholdingPattern.promoters,
            '1.1. Promoters as on 31st March 2025'
          )}
          {renderShareholdingTable(
            structure.shareholdingPattern.public,
            '1.2. Public / Other than Promoters as on 31st March 2025'
          )}
        </div>
      </div>

      {/* 2. Directors Shareholding */}
      <div
        id="directors-shareholding"
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-24">
        
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="font-heading text-lg text-brand-blue">
            2. Directors Shareholding
          </h2>
          <button
            onClick={() =>
            downloadCSV(
              structure.directorsShareholding,
              'directors-shareholding'
            )
            }
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors">
            
            <Download className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
            Export
          </button>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  DIN
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Designation
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Shareholding (%)
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Number of Shares
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {structure.directorsShareholding.map((row, idx) =>
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-brand-blue">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {row.din}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {row.designation}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {row.shareholdingPercent.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {row.numberOfShares.toLocaleString()}
                  </td>
                </tr>
              )}
              {structure.directorsShareholding.length === 0 &&
              <tr>
                  <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-gray-500">
                  
                    No director shareholding data available.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Shareholding more than 5% */}
      <div
        id="major-shareholders"
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-24">
        
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="font-heading text-lg text-brand-blue">
            3. Shareholding more than 5%
          </h2>
          <button
            onClick={() =>
            downloadCSV(structure.majorShareholders, 'major-shareholders')
            }
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors">
            
            <Download className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
            Export
          </button>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Shareholding (%)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {structure.majorShareholders.map((row, idx) =>
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-brand-blue">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {row.shareholdingPercent.toFixed(2)}%
                  </td>
                </tr>
              )}
              {structure.majorShareholders.length === 0 &&
              <tr>
                  <td
                  colSpan={2}
                  className="px-4 py-8 text-center text-sm text-gray-500">
                  
                    No major shareholders data available.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Securities Allotment */}
      <div
        id="securities-allotment"
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-24">
        
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="font-heading text-lg text-brand-blue">
            4. Securities Allotment
          </h2>
          <button
            onClick={() =>
            downloadCSV(structure.securitiesAllotment, 'securities-allotment')
            }
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors">
            
            <Download className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
            Export
          </button>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Allotment Date
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Allotment Type
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Instrument
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Amount (₹ Cr)
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  No. of Securities
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Nominal Value (₹)
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Premium Value (₹)
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-xs font-heading font-bold text-gray-500 uppercase tracking-wider">
                  
                  Ref URL
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {structure.securitiesAllotment.map((row, idx) =>
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {row.date}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {row.type}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {row.instrument}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {row.amount}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {row.securitiesAllotted.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {row.nominalValue}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {row.premiumValue}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-brand-blue hover:underline cursor-pointer">
                    URL
                  </td>
                </tr>
              )}
              {structure.securitiesAllotment.length === 0 &&
              <tr>
                  <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-sm text-gray-500">
                  
                    No securities allotment data available.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Related Corporates */}
      <div
        id="related-corporates"
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-24">
        
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-heading text-lg text-brand-blue">
            5. Related Corporates
          </h2>
        </div>
        <div className="p-6">
          {renderRelatedCorporatesTable(
            structure.relatedCorporates.holding,
            '5.1. Holding Corporates'
          )}
          {renderRelatedCorporatesTable(
            structure.relatedCorporates.subsidiary,
            '5.2. Subsidiary Corporates'
          )}
          {renderRelatedCorporatesTable(
            structure.relatedCorporates.associate,
            '5.3. Associate Corporates'
          )}
          {renderRelatedCorporatesTable(
            structure.relatedCorporates.jointVenture,
            '5.4. Joint Ventures'
          )}
          {renderRelatedCorporatesTable(
            structure.relatedCorporates.other,
            '5.5 Other'
          )}
        </div>
      </div>

      <ReferenceDocsPanel docs={company.referenceDocs?.structure} />
    </div>);

}