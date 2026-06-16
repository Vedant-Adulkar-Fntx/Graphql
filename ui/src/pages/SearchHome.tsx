import React, { useEffect, useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { Clock, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { queryGraphQL } from '../utils/graphqlClient';

export function SearchHome() {
  const navigate = useNavigate();
  const [recentSearches, setRecentSearches] = useState<any[]>([]);

  useEffect(() => {
    const q = `
      query ListFeaturedCompanies {
        tcs: company(cin: "L22210MH1995PLC084781") {
          cin
          company
        }
        sprng: company(cin: "U74999TN2016PTC162587") {
          cin
          company
        }
        neev: company(cin: "AAA-1769") {
          cin
          company
        }
      }
    `;
    queryGraphQL(q)
      .then((data) => {
        if (data) {
          const companies = [];
          if (data.tcs) companies.push(data.tcs);
          if (data.sprng) companies.push(data.sprng);
          if (data.neev) companies.push(data.neev);
          
          setRecentSearches(
            companies.map((c: any) => ({
              id: c.cin,
              name: c.company || 'Unknown Company',
              about: { cin: c.cin }
            }))
          );
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto w-full px-4">
      <div className="text-center mb-10 w-full">
        <h1 className="font-heading text-4xl md:text-5xl text-brand-blue mb-4">
          Corporate Data Intelligence
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Search across millions of companies to access comprehensive financial,
          compliance, and director information.
        </p>
      </div>

      <div className="w-full mb-16">
        <SearchBar size="large" autoFocus />
      </div>

      <div className="w-full max-w-3xl">
        <h3 className="flex items-center text-sm font-heading text-gray-500 uppercase tracking-wider mb-4">
          <Clock className="w-4 h-4 mr-2" />
          Recent Searches
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentSearches.map((company) =>
          <button
            key={company.id}
            onClick={() => navigate(`/company/${company.id}/about`)}
            className="flex flex-col items-start p-4 bg-white border border-gray-200 rounded-lg hover:border-brand-blue hover:shadow-md transition-all text-left">
            
              <div className="flex items-center mb-2 w-full">
                <Building2 className="w-4 h-4 text-brand-blue mr-2 flex-shrink-0" />
                <span className="font-heading text-brand-blue truncate w-full">
                  {company.name}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                CIN: {company.about.cin}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>);

}