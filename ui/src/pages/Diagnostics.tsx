import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { queryGraphQL } from '../utils/graphqlClient';
import { CheckCircle2, AlertTriangle, Database, Info } from 'lucide-react';

interface FieldStatus {
  name: string;
  category: string;
  count: number;
  status: 'Loaded' | 'Empty' | 'Error';
  description: string;
}

export function Diagnostics() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [statuses, setStatuses] = useState<FieldStatus[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const q = `
      query CheckDiagnostics($cin: String!) {
        company(cin: $cin) {
          company
          directors { din }
          assetCharges { chargeId }
          shareholdingRecords { category }
          noncurrentInvestments { affiliateName }
          financials { year }
          cashflow { year }
          auditorDetails { auditorName }
          auditReports { year }
          gst { gstin }
          creditRatings { rating }
          ncltCases { caseNumber }
          epfoRecords { wageMonth }
        }
      }
    `;

    queryGraphQL(q, { cin: id })
      .then((data) => {
        if (data && data.company) {
          setCompanyName(data.company.company || 'Unknown');
          
          const c = data.company;
          const fields: FieldStatus[] = [
            {
              name: 'Directors',
              category: 'People',
              count: (c.directors || []).length,
              status: (c.directors || []).length > 0 ? 'Loaded' : 'Empty',
              description: 'Director profiles and designations'
            },
            {
              name: 'Asset Charges',
              category: 'Compliance',
              count: (c.assetCharges || []).length,
              status: (c.assetCharges || []).length > 0 ? 'Loaded' : 'Empty',
              description: 'Bank borrowing and charge values'
            },
            {
              name: 'Shareholding Records',
              category: 'Structure',
              count: (c.shareholdingRecords || []).length,
              status: (c.shareholdingRecords || []).length > 0 ? 'Loaded' : 'Empty',
              description: 'Ownership structures and patterns'
            },
            {
              name: 'Non-current Investments',
              category: 'Structure',
              count: (c.noncurrentInvestments || []).length,
              status: (c.noncurrentInvestments || []).length > 0 ? 'Loaded' : 'Empty',
              description: 'Subsidiaries, associates, and joint ventures'
            },
            {
              name: 'Financial Statements',
              category: 'Financials',
              count: (c.financials || []).length,
              status: (c.financials || []).length > 0 ? 'Loaded' : 'Empty',
              description: 'Balance sheets and P&L figures'
            },
            {
              name: 'Cashflow Items',
              category: 'Financials',
              count: (c.cashflow || []).length,
              status: (c.cashflow || []).length > 0 ? 'Loaded' : 'Empty',
              description: 'Operating and investing cash flows'
            },
            {
              name: 'Auditor Details',
              category: 'Financials',
              count: (c.auditorDetails || []).length,
              status: (c.auditorDetails || []).length > 0 ? 'Loaded' : 'Empty',
              description: 'Assigned audit firms and partners'
            },
            {
              name: 'Audit Reports',
              category: 'Compliance',
              count: (c.auditReports || []).length,
              status: (c.auditReports || []).length > 0 ? 'Loaded' : 'Empty',
              description: 'Yearly statutory auditor reports'
            },
            {
              name: 'GST Registrations',
              category: 'Taxation',
              count: (c.gst || []).length,
              status: (c.gst || []).length > 0 ? 'Loaded' : 'Empty',
              description: 'Active and inactive GSTIN numbers'
            },
            {
              name: 'Credit Ratings',
              category: 'Finance',
              count: (c.creditRatings || []).length,
              status: (c.creditRatings || []).length > 0 ? 'Loaded' : 'Empty',
              description: 'Instrument ratings from agencies (ICRA/CRISIL)'
            },
            {
              name: 'NCLT Cases',
              category: 'Legal',
              count: (c.ncltCases || []).length,
              status: (c.ncltCases || []).length > 0 ? 'Loaded' : 'Empty',
              description: 'Insolvency and legal litigation records'
            },
            {
              name: 'EPFO Contribution Payrolls',
              category: 'Operations',
              count: (c.epfoRecords || []).length,
              status: (c.epfoRecords || []).length > 0 ? 'Loaded' : 'Empty',
              description: 'Monthly employee contribution logs'
            }
          ];
          setStatuses(fields);
        } else {
          setCompanyName('Not Found');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Database className="w-12 h-12 text-brand-blue animate-pulse mb-4" />
        <span className="text-gray-500 text-sm">Scanning active schemas and Excel sheet records...</span>
      </div>
    );
  }

  const loadedCount = statuses.filter(s => s.status === 'Loaded').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl text-brand-blue">Data Diagnostics</h1>
          <p className="text-sm text-gray-500 mt-1">CIN: {id} • Company: {companyName}</p>
        </div>
        <div className="px-4 py-2 bg-brand-blue/5 border border-brand-blue/10 rounded-lg text-sm text-brand-blue font-semibold">
          {loadedCount} of {statuses.length} Categories Loaded
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-start gap-4">
        <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-heading text-base text-gray-900 mb-1">About Data Diagnostics</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            This dashboard queries all GraphQL backend resolvers for the active company. It scans corresponding sheets in your loaded Excel workbook (based on the company name or CIN) to determine if rows are present. If a category is marked as "No Data Found", its respective tab will not display information on the UI.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statuses.map((item, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-lg border shadow-sm transition-all flex items-start gap-4 ${
              item.status === 'Loaded'
                ? 'bg-green-50/20 border-green-200'
                : 'bg-yellow-50/20 border-yellow-200'
            }`}
          >
            <div className="mt-1 flex-shrink-0">
              {item.status === 'Loaded' ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-heading text-base text-gray-900 truncate">{item.name}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase">
                  {item.category}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-500">Records found in Excel:</span>
                <span className={`font-semibold ${item.status === 'Loaded' ? 'text-green-700' : 'text-yellow-700'}`}>
                  {item.status === 'Loaded' ? `${item.count} rows` : 'No Data Found (0 rows)'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
