import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useParams, useLocation } from 'react-router-dom';
import {
  Search,
  Building,
  Users,
  FileText,
  Database,
  Network,
  LineChart,
  BarChart2,
  ShieldCheck,
  Receipt,
  Award,
  Scale,
  Briefcase } from
'lucide-react';
import { SearchBar } from './SearchBar';
import { queryGraphQL } from '../utils/graphqlClient';
import logo from '../assets/logo.png';

export function Layout() {
  const { id } = useParams();
  const location = useLocation();
  const isSearchHome = location.pathname === '/';
  const isStructureActive = location.pathname.includes('/structure');
  const isFinancialsActive = location.pathname.includes('/financials');
  const isComplianceActive = location.pathname.includes('/compliance');
  const isGSTActive = location.pathname.includes('/gst');
  const isCreditRatingsActive = location.pathname.includes('/credit-ratings');
  const isLegalHistoryActive = location.pathname.includes('/legal-history');
  
  const [selectedCompany, setSelectedCompany] = useState<{name: string, status: string, about: {cin: string}} | null>(null);

  useEffect(() => {
    if (!id) {
      setSelectedCompany(null);
      return;
    }
    const q = `
      query GetCompanyHeader($cin: String!) {
        company(cin: $cin) {
          cin
          company
          regActiveStatus
        }
      }
    `;
    queryGraphQL(q, { cin: id })
      .then((data) => {
        if (data && data.company) {
          setSelectedCompany({
            name: data.company.company || 'Unknown Company',
            status: data.company.regActiveStatus || 'Active',
            about: { cin: data.company.cin }
          });
        }
      })
      .catch((err) => console.error(err));
  }, [id]);
  const navItems = [
  {
    name: 'Search',
    path: '/',
    icon: Search,
    exact: true
  },
  {
    name: 'About Company',
    path: id ? `/company/${id}/about` : '#',
    icon: Building,
    disabled: !id
  },
  {
    name: 'Company Structure',
    path: id ? `/company/${id}/structure` : '#',
    icon: Network,
    disabled: !id,
    subSections: [
    {
      name: 'Share Holding Pattern',
      id: 'share-holding-pattern'
    },
    {
      name: 'Directors Shareholding',
      id: 'directors-shareholding'
    },
    {
      name: 'Shareholding > 5%',
      id: 'major-shareholders'
    },
    {
      name: 'Securities Allotment',
      id: 'securities-allotment'
    },
    {
      name: 'Related Corporates',
      id: 'related-corporates'
    }]

  },
  {
    name: 'Financials',
    path: id ? `/company/${id}/financials` : '#',
    icon: LineChart,
    disabled: !id,
    subSections: [
    {
      name: 'Balance Sheet',
      id: 'balance-sheet'
    },
    {
      name: 'Profit & Loss',
      id: 'profit-loss'
    },
    {
      name: 'Cash Flow',
      id: 'cash-flow'
    },
    {
      name: 'Ratios',
      id: 'ratios'
    },
    {
      name: 'Auditor(s)',
      id: 'auditors'
    }]

  },
  {
    name: 'Peer Comparison',
    path: id ? `/company/${id}/peers` : '#',
    icon: BarChart2,
    disabled: !id
  },
  {
    name: 'Directors',
    path: id ? `/company/${id}/directors` : '#',
    icon: Users,
    disabled: !id
  },
  {
    name: 'Charge Details',
    path: id ? `/company/${id}/charges` : '#',
    icon: FileText,
    disabled: !id
  },
  {
    name: 'Compliance',
    path: id ? `/company/${id}/compliance` : '#',
    icon: ShieldCheck,
    disabled: !id,
    subSections: [
    {
      name: 'Auditor Remarks',
      id: 'auditor-remarks'
    },
    {
      name: 'Suit Filed',
      id: 'suit-filed'
    },
    {
      name: 'Corporate Debt Restructuring (CDR)',
      id: 'cdr'
    },
    {
      name: 'BIFR History',
      id: 'bifr-history'
    }]

  },
  {
    name: 'GST',
    path: id ? `/company/${id}/gst` : '#',
    icon: Receipt,
    disabled: !id,
    subSections: [
    {
      name: 'Active GSTINs',
      id: 'active-gstins'
    },
    {
      name: 'Inactive GSTINs',
      id: 'inactive-gstins'
    }]

  },
  {
    name: 'Credit Ratings',
    path: id ? `/company/${id}/credit-ratings` : '#',
    icon: Award,
    disabled: !id,
    subSections: [
    {
      name: 'CRISIL',
      id: 'crisil'
    },
    {
      name: 'ICRA',
      id: 'icra'
    },
    {
      name: 'Unaccepted Ratings',
      id: 'unaccepted-ratings'
    }]

  },
  {
    name: 'Legal History',
    path: id ? `/company/${id}/legal-history` : '#',
    icon: Scale,
    disabled: !id,
    subSections: [
    {
      name: 'Cases Filed Against',
      id: 'cases-against'
    },
    {
      name: 'Cases Filed By',
      id: 'cases-by'
    }]

  },
  {
    name: 'EPFO',
    path: id ? `/company/${id}/epfo` : '#',
    icon: Briefcase,
    disabled: !id
  }];

  const handleScrollTo = (
  e: React.MouseEvent<HTMLAnchorElement>,
  targetId: string) =>
  {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return (
    <div className="flex h-screen bg-gray-50 font-body overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-blue text-white flex flex-col flex-shrink-0">
        <div className="h-24 flex items-center justify-center border-b border-white/10 px-2 py-1">
          <img src={logo} alt="Logo" className="w-[90%] h-20 object-fill" />
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.disabled) {
              return (
                <div
                  key={item.name}
                  className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-white/40 cursor-not-allowed">
                  
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  {item.name}
                </div>);

            }
            return (
              <div key={item.name} className="flex flex-col">
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-white/10 text-brand-yellow' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`
                  }>
                  
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  {item.name}
                </NavLink>

                {/* Sub-sections rendering */}
                {item.subSections && (
                isStructureActive && item.name === 'Company Structure' ||
                isFinancialsActive && item.name === 'Financials' ||
                isComplianceActive && item.name === 'Compliance' ||
                isGSTActive && item.name === 'GST' ||
                isCreditRatingsActive && item.name === 'Credit Ratings' ||
                isLegalHistoryActive &&
                item.name === 'Legal History') &&
                <div className="mt-1 ml-11 space-y-1 border-l border-white/10 pl-3 py-1">
                      {item.subSections.map((sub) =>
                  <a
                    key={sub.id}
                    href={`#${sub.id}`}
                    onClick={(e) => handleScrollTo(e, sub.id)}
                    className="block px-2 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors">
                    
                          {sub.name}
                        </a>
                  )}
                    </div>
                }
              </div>);

          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {!isSearchHome &&
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex-1 max-w-2xl">
              <SearchBar size="normal" />
            </div>
            {selectedCompany &&
          <div className="ml-6 flex items-center text-right">
                <div className="mr-4 hidden md:block">
                  <h2 className="font-heading text-brand-blue text-lg leading-tight">
                    {selectedCompany.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    CIN: {selectedCompany.about.cin}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {selectedCompany.status}
                </span>
              </div>
          }
          </header>
        }

        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>);

}