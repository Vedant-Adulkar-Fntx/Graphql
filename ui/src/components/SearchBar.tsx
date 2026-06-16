import React, { useEffect, useState, useRef } from 'react';
import { Search, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Company } from '../data/mockData';
import { queryGraphQL } from '../utils/graphqlClient';
interface SearchBarProps {
  autoFocus?: boolean;
  size?: 'large' | 'normal';
}
export function SearchBar({
  autoFocus = false,
  size = 'normal'
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Company[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    
    const delayDebounce = setTimeout(() => {
      const q = `
        query SearchCompanies($name: String!) {
          companies(filter: { name: $name }, pagination: { page: 0, pageSize: 10 }) {
            cin
            company
            regActiveStatus
          }
        }
      `;
      queryGraphQL(q, { name: query })
        .then((data) => {
          if (data && data.companies) {
            const uiCompanies = data.companies.map((c: any) => ({
              id: c.cin,
              name: c.company || 'Unknown',
              status: c.regActiveStatus || 'Active',
              about: { cin: c.cin }
            })) as unknown as Company[];
            setResults(uiCompanies);
          }
        })
        .catch((err) => console.error('Search error:', err));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node))
      {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleSelect = (companyId: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/company/${companyId}/about`);
  };
  const isLarge = size === 'large';
  return (
    <div ref={wrapperRef} className="relative w-full max-w-3xl mx-auto">
      <div
        className={`relative flex items-center w-full bg-white border border-gray-300 rounded-lg shadow-sm focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue transition-all ${isLarge ? 'h-14' : 'h-10'}`}>
        
        <Search
          className={`text-gray-400 ml-4 ${isLarge ? 'w-6 h-6' : 'w-5 h-5'}`} />
        
        <input
          type="text"
          className={`w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 px-4 ${isLarge ? 'text-lg' : 'text-base'}`}
          placeholder="Search by company name or CIN..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          autoFocus={autoFocus} />
        
      </div>

      {isOpen && results.length > 0 &&
      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <ul className="py-2">
            {results.map((company) =>
          <li key={company.id}>
                <button
              className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex flex-col transition-colors"
              onClick={() => handleSelect(company.id)}>
              
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-brand-blue text-base">
                      {company.name}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      {company.status}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1 space-x-3">
                    <span className="flex items-center">
                      <Building2 className="w-3 h-3 mr-1" />
                      CIN: {company.about.cin}
                    </span>
                  </div>
                </button>
              </li>
          )}
          </ul>
        </div>
      }

      {isOpen && query.trim() !== '' && results.length === 0 &&
      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No companies found matching "{query}"
        </div>
      }
    </div>);

}