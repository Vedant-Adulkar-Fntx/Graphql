import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ReferenceDocsPanel } from '../components/ReferenceDocsPanel';
import { fetchAboutCompany } from '../utils/graphqlClient';
const DetailItem = ({
  label,
  value,
  fullWidth = false




}: {label: string;value: string;fullWidth?: boolean;}) =>
<div
  className={`flex flex-col ${fullWidth ? 'col-span-1 md:col-span-2 lg:col-span-3' : ''}`}>
  
    <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
    <dd className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-100 min-h-[2.5rem] flex items-center">
      {value || '-'}
    </dd>
  </div>;

export function AboutCompany() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchAboutCompany(id)
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
    return <div className="p-8 text-center text-gray-500">Loading company details...</div>;
  }

  if (!company) {
    return (
      <div className="p-8 text-center text-gray-500">Company not found.</div>);

  }
  const { about } = company;
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl text-brand-blue">About Company</h1>
      </div>

      {/* Corporate Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-heading text-lg text-brand-blue">
            Corporate Summary
          </h2>
        </div>
        <div className="p-6">
          <p className="text-gray-700 text-sm leading-relaxed">
            {about.aboutCorporate}
          </p>
        </div>
      </div>

      {/* Key Identifiers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-heading text-lg text-brand-blue">
            Key Identifiers
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailItem label="CIN" value={about.cin} />
          <DetailItem label="PAN" value={about.pan} />
          <DetailItem label="LEI" value={about.lei} />
          <DetailItem label="Company Status" value={about.companyStatus} />
          <DetailItem
            label="Active Compliance"
            value={about.activeCompliance} />
          
          <DetailItem label="Type of Entity" value={about.typeOfEntity} />
          <DetailItem
            label="Date of Incorporation"
            value={about.dateOfIncorporation} />
          
          <DetailItem label="Listing Status" value={about.listingStatus} />
          <DetailItem label="Date of Last AGM" value={about.dateOfLastAgm} />
        </div>
      </div>

      {/* Contact & Address */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-heading text-lg text-brand-blue">
            Contact & Address
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailItem label="Email" value={about.email} />
          <DetailItem label="Phone" value={about.phone} />
          <DetailItem label="Website" value={about.website} />
          <DetailItem
            label="Registered Address"
            value={about.registeredAddress}
            fullWidth />
          
          <DetailItem
            label="Business Address"
            value={about.businessAddress}
            fullWidth />
          
        </div>
      </div>

      {/* Financials & Industry */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-heading text-lg text-brand-blue">
            Financials & Industry
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailItem
            label="Authorised Capital"
            value={about.authorisedCapital} />
          
          <DetailItem label="Paid Up Capital" value={about.paidUpCapital} />
          <DetailItem label="Sum of Charges" value={about.sumOfCharges} />
          <DetailItem
            label="Broad Industry Category"
            value={about.broadIndustryCategory} />
          
          <DetailItem label="Industry" value={about.industry} />
          <DetailItem label="Segment(s)" value={about.segments} />
        </div>
      </div>

      <ReferenceDocsPanel docs={company.referenceDocs?.about} />
    </div>);

}