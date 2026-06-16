import React from 'react';
import { FileText, ExternalLink, Download } from 'lucide-react';
import { ReferenceDocument } from '../data/mockData';
export function ReferenceDocsPanel({ docs }: {docs?: ReferenceDocument[];}) {
  if (!docs || docs.length === 0) return null;
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-6">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="w-4 h-4 text-brand-blue mr-2" />
          <h3 className="font-heading text-sm font-semibold text-brand-blue">
            Reference Documents
          </h3>
        </div>
        <button
          onClick={() => alert('Downloading documents archive...')}
          className="inline-flex items-center text-xs font-medium text-brand-blue hover:text-blue-800 transition-colors">
          
          <Download className="w-3 h-3 mr-1" />
          Download All
        </button>
      </div>
      <div className="p-4">
        <ul className="space-y-3">
          {docs.map((doc, idx) =>
          <li
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
            
              <div>
                <a
                href={doc.url}
                className="font-medium text-brand-blue hover:underline flex items-center"
                target="_blank"
                rel="noopener noreferrer">
                
                  {doc.name}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
                <div className="text-gray-500 text-xs mt-0.5 flex items-center gap-2">
                  <span>{doc.documentType}</span>
                  <span>&bull;</span>
                  <span>{doc.source}</span>
                </div>
              </div>
              <div className="text-gray-400 text-xs whitespace-nowrap">
                {doc.date}
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>);

}