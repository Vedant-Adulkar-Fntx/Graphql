import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Info, Building2, Download } from 'lucide-react';
import { ReferenceDocsPanel } from '../components/ReferenceDocsPanel';
import { downloadCSV } from '../utils/export';
import { fetchCompanyFinancials } from '../utils/graphqlClient';

export function PeerComparison() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

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
    return <div className="p-8 text-center text-gray-500">Loading peer comparison...</div>;
  }

  if (!company) {
    return (
      <div className="p-8 text-center text-gray-500">Company not found.</div>);

  }
  const { peerComparison } = company;
  if (!peerComparison) {
    return (
      <div className="p-8 text-center text-gray-500">
        Peer comparison data not available for this company.
      </div>);

  }
  const latestYear = peerComparison.years[0];
  const rankMetric = peerComparison.rankByMetric;
  // Lower-is-better metrics (leverage & working-capital efficiency)
  const isLowerBetter = (label: string) =>
  label === 'Debt/Equity' ||
  label.includes('(Days)') ||
  label.includes('Cash Conversion Cycle');
  // Company's latest-FY value for a metric (from the data rows, latest is index 0)
  const getCompanyLatest = (label: string): number | null => {
    const row = peerComparison.data.find((r) => r.label === label);
    if (!row) return null;
    const v = parseFloat(row.values[0]);
    return isNaN(v) ? null : v;
  };
  // Median across peers for a metric (latest FY)
  const getPeerMedian = (label: string): number | null => {
    const vals = peerComparison.peers.
    map((p) => p.values[label]).
    filter((v) => typeof v === 'number' && isFinite(v)).
    sort((a, b) => a - b);
    if (vals.length === 0) return null;
    const mid = Math.floor(vals.length / 2);
    return vals.length % 2 !== 0 ? vals[mid] : (vals[mid - 1] + vals[mid]) / 2;
  };
  const formatNum = (n: number, label: string) => {
    if (label.includes('(Days)') || label === '# of Peers')
    return Math.round(n).toString();
    return n.toFixed(2);
  };
  // Rank computation for the ranking metric (latest FY)
  const companyRankVal = getCompanyLatest(rankMetric);
  const universe: number[] = [
  ...(companyRankVal != null ? [companyRankVal] : []),
  ...peerComparison.peers.
  map((p) => p.values[rankMetric]).
  filter((v) => typeof v === 'number' && isFinite(v))];

  const lowerBetter = isLowerBetter(rankMetric);
  const sorted = [...universe].sort((a, b) => lowerBetter ? a - b : b - a);
  const currentRank =
  companyRankVal != null ? sorted.indexOf(companyRankVal) + 1 : '-';
  const totalRanked = universe.length;
  // Table rows exclude the redundant "# of Peers" row
  const tableRows = peerComparison.data.filter((r) => r.label !== '# of Peers');
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="font-heading text-2xl text-brand-blue">
          Peer Comparison
        </h1>
      </div>

      {/* Ranking Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="bg-brand-blue/10 px-4 py-3 rounded-lg flex-shrink-0">
            <span className="font-heading text-2xl text-brand-blue">
              #{currentRank}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-lg text-gray-900">
                Ranked #{currentRank} of {totalRanked} by {rankMetric}
              </h3>
              <div className="relative">
                <button
                  type="button"
                  aria-label="How ranking is calculated"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onFocus={() => setShowTooltip(true)}
                  onBlur={() => setShowTooltip(false)}
                  className="text-gray-400 hover:text-brand-blue transition-colors">
                  
                  <Info className="w-4 h-4" />
                </button>
                {showTooltip &&
                <div
                  role="tooltip"
                  className="absolute z-20 w-72 p-3 mt-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg left-0">
                  
                    Rank is based on <strong>{rankMetric}</strong> for{' '}
                    <strong>{latestYear}</strong> (the latest financial year),
                    comparing {company.name} against{' '}
                    {peerComparison.peers.length} peer companies in the same
                    industry and revenue band. Rank #1 is best (
                    {isLowerBetter(rankMetric) ? 'lowest' : 'highest'} value).
                  </div>
                }
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Ranking metric: {rankMetric} · Period: {latestYear} (latest)
            </p>
          </div>
        </div>
      </div>

      {/* Who are the peers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-heading text-lg text-brand-blue">
            Peer Set ({peerComparison.peers.length})
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {peerComparison.peers.map((peer) =>
          <div
            key={peer.name}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
            
              <Building2 className="w-4 h-4 text-brand-blue flex-shrink-0" />
              <span className="text-sm text-gray-800">{peer.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="font-heading text-lg text-brand-blue">
            Financial Parameters
          </h2>
          <button
            onClick={() => {
              const exportData = tableRows.map((row) => {
                const rowData: any = {
                  Parameter: row.label
                };
                peerComparison.years.forEach((year, idx) => {
                  rowData[year] = row.values[idx];
                });
                const median = getPeerMedian(row.label);
                rowData['Peer Median'] =
                median != null ? formatNum(median, row.label) : '-';
                return rowData;
              });
              downloadCSV(exportData, 'peer-comparison');
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
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-heading font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r border-gray-200">
                  
                  Parameters
                </th>
                {peerComparison.years.map((year) =>
                <th
                  key={year}
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-heading font-bold text-gray-500 uppercase tracking-wider min-w-[100px]">
                  
                    {year}
                  </th>
                )}
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-heading font-bold text-brand-blue uppercase tracking-wider min-w-[120px] bg-brand-yellow/15 border-l border-gray-200">
                  
                  Peer Median ({latestYear})
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableRows.map((row, idx) => {
                const median = getPeerMedian(row.label);
                return (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap text-sm sticky left-0 z-10 border-r border-gray-200 bg-white text-gray-700">
                      {row.label}
                    </td>
                    {row.values.map((val, vIdx) =>
                    <td
                      key={vIdx}
                      className="px-6 py-3 whitespace-nowrap text-sm text-right text-gray-600">
                      
                        {val}
                      </td>
                    )}
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-medium text-brand-blue bg-brand-yellow/10 border-l border-gray-200">
                      {median != null ? formatNum(median, row.label) : '-'}
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>

      <ReferenceDocsPanel docs={company.referenceDocs?.peers} />
    </div>);

}