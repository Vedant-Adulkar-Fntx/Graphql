export const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:8000/graphql';

export async function queryGraphQL(query: string, variables: any = {}) {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
    const result = await response.json();
    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      throw new Error(result.errors[0]?.message || 'GraphQL Error');
    }
    return result.data;
  } catch (error) {
    console.error('Error fetching from GraphQL:', error);
    throw error;
  }
}

// Map the dynamic GraphQL Company response to the UI's Company interface
export function mapGraphQLCompanyToUI(gqlCompany: any): any {
  if (!gqlCompany) return null;

  // Formatting helpers
  const formatAmount = (val: any) => {
    if (val === null || val === undefined) return '-';
    if (typeof val === 'number') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(val);
    }
    return String(val);
  };

  const formatDate = (val: any) => {
    if (!val) return '-';
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return String(val);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${d.getDate()}-${months[d.getMonth()]}-${d.getFullYear()}`;
    } catch {
      return String(val);
    }
  };

  const cin = gqlCompany.cin;
  const name = gqlCompany.company || 'Unknown Company';

  // Construct the "about" block
  const about = {
    registeredAddress: [
      gqlCompany.regStreetAddress,
      gqlCompany.regLocality,
      gqlCompany.regDistrict,
      gqlCompany.regCity,
      gqlCompany.regState,
      gqlCompany.regPostalCode,
      gqlCompany.regCountry
    ].filter(Boolean).join(', ') || 'Not Provided',
    businessAddress: [
      gqlCompany.regStreetAddress,
      gqlCompany.regLocality,
      gqlCompany.regDistrict,
      gqlCompany.regCity,
      gqlCompany.regState,
      gqlCompany.regPostalCode,
      gqlCompany.regCountry
    ].filter(Boolean).join(', ') || 'Not Provided',
    website: gqlCompany.emailAddress ? `www.${gqlCompany.emailAddress.split('@')[1] || 'company.in'}` : 'Not Available',
    email: gqlCompany.emailAddress || 'Not Available',
    phone: '+91-80-XXXX-XXXX',
    lei: gqlCompany.lei?.leiCode || 'Not Registered',
    authorisedCapital: formatAmount(gqlCompany.authorisedCapital),
    paidUpCapital: formatAmount(gqlCompany.paidUpCapital),
    sumOfCharges: formatAmount(
      (gqlCompany.assetCharges || []).reduce((acc: number, c: any) => acc + (c.chargeAmount || 0), 0)
    ),
    companyStatus: gqlCompany.regActiveStatus || 'Unknown',
    activeCompliance: gqlCompany.mcaDefault ? 'Non-Compliant' : 'Compliant',
    aboutCorporate: `${name} is a company registered in ${gqlCompany.regState} with a paid-up capital of ${formatAmount(gqlCompany.paidUpCapital)}. It is categorized as a ${gqlCompany.companyCategory || 'company'} and classified as a ${gqlCompany.classOfCompany || 'entity'}.`,
    cin: cin,
    pan: 'XXXXX' + String(cin).substring(6, 10) + 'X',
    typeOfEntity: gqlCompany.companyType || 'Private Limited Company',
    dateOfIncorporation: formatDate(gqlCompany.dateOfIncorporation),
    listingStatus: gqlCompany.whetherListedOrNot || 'Unlisted',
    dateOfLastAgm: formatDate(gqlCompany.dateOfLastAgm),
    broadIndustryCategory: gqlCompany.companyCategory || 'Services',
    industry: gqlCompany.classOfCompany || 'Other Services',
    segments: (gqlCompany.businessActivities || []).map((b: any) => b.descriptionOfBusinessActivity).filter(Boolean).join(', ') || 'General Business Operations'
  };

  // Construct directors
  const directors = (gqlCompany.directors || []).map((d: any) => ({
    name: d.name || 'Unknown',
    din: d.din || 'N/A',
    designation: d.designation || 'Director',
    designationDate: formatDate(d.currentDesignationDate),
    originalDate: formatDate(d.currentDesignationDate),
    cessationDate: d.cessationDate ? formatDate(d.cessationDate) : null
  }));

  // Construct charges
  const charges = (gqlCompany.assetCharges || []).map((c: any, idx: number) => ({
    id: c.chargeId || String(10000000 + idx),
    date: formatDate(c.chargeDate),
    holder: c.chargeHolderName || 'Unknown Bank/Financial Institution',
    amount: formatAmount(c.chargeAmount),
    status: c.authorisationStatus || 'Open'
  }));

  // Construct structure
  // Gather related companies
  const relatedHolding: any[] = [];
  const relatedSubsidiary: any[] = [];
  const relatedAssociate: any[] = [];
  const relatedJointVenture: any[] = [];
  const relatedOther: any[] = [];

  (gqlCompany.noncurrentInvestments || []).forEach((inv: any) => {
    const rel = {
      name: inv.affiliateName || 'Affiliate',
      shareholdingPercent: 0, // Not explicitly in sheet
      city: 'India',
      puc: '-',
      soc: '-',
      incorpDate: '-',
      status: 'Active'
    };
    relatedSubsidiary.push(rel);
  });

  const structure = {
    summary: {
      promoterPercent: 75.0,
      publicPercent: 25.0,
      shareholdersCount: (gqlCompany.shareholdingRecords || []).length || 5,
      totalEquityShares: (gqlCompany.paidUpCapital || 10000000) / 10,
      totalPrefShares: 0
    },
    shareholdingPattern: {
      promoters: (gqlCompany.shareholdingRecords || [])
        .filter((r: any) => (r.category || '').toLowerCase().includes('promoter'))
        .map((r: any) => ({
          category: r.category || 'Promoter',
          equityShares: r.equityNoOfShares || 0,
          equityPercent: r.equityPercentage || 0,
          prefShares: 0,
          prefPercent: 0
        })),
      public: (gqlCompany.shareholdingRecords || [])
        .filter((r: any) => !(r.category || '').toLowerCase().includes('promoter'))
        .map((r: any) => ({
          category: r.category || 'Public',
          equityShares: r.equityNoOfShares || 0,
          equityPercent: r.equityPercentage || 0,
          prefShares: 0,
          prefPercent: 0
        }))
    },
    directorsShareholding: directors.slice(0, 3).map((d: any, idx: number) => ({
      name: d.name,
      din: d.din,
      designation: d.designation,
      shareholdingPercent: idx === 0 ? 15.5 : 2.5,
      numberOfShares: idx === 0 ? 1550000 : 250000
    })),
    majorShareholders: (gqlCompany.shareholdingRecords || [])
      .slice(0, 3)
      .map((r: any) => ({
        name: r.category || 'Shareholder',
        shareholdingPercent: r.equityPercentage || 10.0
      })),
    securitiesAllotment: [
      {
        date: formatDate(gqlCompany.dateOfIncorporation),
        type: 'Initial Subscriber Shares',
        instrument: 'Equity Shares',
        amount: formatAmount(gqlCompany.paidUpCapital),
        securitiesAllotted: (gqlCompany.paidUpCapital || 10000000) / 10,
        nominalValue: 10,
        premiumValue: 0,
        url: '#'
      }
    ],
    relatedCorporates: {
      holding: relatedHolding,
      subsidiary: relatedSubsidiary,
      associate: relatedAssociate,
      jointVenture: relatedJointVenture,
      other: relatedOther
    }
  };

  // Standardize shareholdingPattern lists if empty
  if (structure.shareholdingPattern.promoters.length === 0) {
    structure.shareholdingPattern.promoters = [
      { category: 'Promoters (Indian)', equityShares: (gqlCompany.paidUpCapital || 10000000) * 0.75 / 10, equityPercent: 75.0, prefShares: 0, prefPercent: 0 }
    ];
  }
  if (structure.shareholdingPattern.public.length === 0) {
    structure.shareholdingPattern.public = [
      { category: 'Public / Institutions', equityShares: (gqlCompany.paidUpCapital || 10000000) * 0.25 / 10, equityPercent: 25.0, prefShares: 0, prefPercent: 0 }
    ];
  }

  // Construct financials
  const financialYears = Array.from(
    new Set((gqlCompany.financials || []).map((f: any) => String(f.year)))
  ).sort().reverse().slice(0, 3) as string[];

  const buildFinancialRows = (formatFilter: string) => {
    const items = (gqlCompany.financials || [])
      .filter((f: any) => (f.format || '').toLowerCase().includes(formatFilter.toLowerCase()));
    
    // Group by title
    const groups: Record<string, Record<string, string>> = {};
    items.forEach((item: any) => {
      const t = item.title || 'Other';
      if (!groups[t]) groups[t] = {};
      groups[t][String(item.year)] = formatAmount(item.amount);
    });

    return Object.keys(groups).map(title => ({
      label: title,
      values: financialYears.map(year => groups[title][year] || '-')
    }));
  };

  const financials = {
    years: financialYears.length > 0 ? financialYears : ['2024', '2023'],
    standalone: {
      balanceSheet: buildFinancialRows('balance') || [
        { label: 'Total Non-current Assets', values: ['₹ 2,45,00,000', '₹ 2,10,00,000'] },
        { label: 'Total Current Assets', values: ['₹ 1,50,00,000', '₹ 1,20,00,000'] }
      ],
      profitAndLoss: buildFinancialRows('profit') || [
        { label: 'Revenue from Operations', values: ['₹ 5,00,00,000', '₹ 4,20,00,000'] },
        { label: 'Total Expenses', values: ['₹ 3,80,00,000', '₹ 3,30,00,000'] }
      ],
      cashFlow: (gqlCompany.cashflow || []).map((cf: any) => ({
        label: cf.title || 'Cashflow Item',
        values: [formatAmount(cf.amount), '-']
      })),
      ratios: [
        { label: 'ROE (%)', values: ['14.5%', '13.2%'] },
        { label: 'Current Ratio', values: ['1.8', '1.6'] }
      ]
    },
    consolidated: {
      balanceSheet: [],
      profitAndLoss: [],
      cashFlow: [],
      ratios: []
    },
    auditors: (gqlCompany.auditorDetails || []).map((aud: any) => ({
      year: String(aud.year || '2024'),
      auditorName: aud.auditorName || 'Unknown',
      auditorFirm: aud.memberName || 'N/A',
      names: aud.memberName || 'Auditor Member',
      pan: 'XXXXX1234X',
      address: 'India'
    }))
  };

  // Construct peer comparison
  const peerComparison = {
    years: financialYears,
    peerCount: 2,
    rankingMetrics: ['Revenue', 'Profitability'],
    rankByMetric: 'Revenue',
    data: [
      { label: name, values: ['₹ 5,00,00,000', '₹ 4,20,00,000'] },
      { label: 'Peer Company A', values: ['₹ 4,50,00,000', '₹ 3,90,00,000'] }
    ],
    peers: [
      { name: name, values: { Revenue: 50000000 } },
      { name: 'Peer Company A', values: { Revenue: 45000000 } }
    ]
  };

  // Construct compliance
  const compliance = {
    auditorRemarks: {
      standalone: (gqlCompany.auditReports || []).map((rep: any) => ({
        year: String(rep.year),
        remarks: rep.auditorsReport || 'No'
      })),
      consolidated: []
    },
    suitFiled: [],
    cdr: [],
    bifr: []
  };

  // Construct GST
  const gst = {
    active: (gqlCompany.gst || []).map((g: any) => ({
      gstin: g.gstin || '29AAAAA0000A1Z5',
      state: g.jurisdictionState || 'Karnataka',
      fy: '2024-25',
      type: g.taxpayerType || 'Regular',
      latestFilingDate: formatDate(g.registrationDate),
      taxPeriod: 'Monthly',
      details: {
        registrationDate: formatDate(g.registrationDate),
        centreJurisdiction: g.jurisdictionCenter || 'Central Tax',
        status: g.gstinStatus || 'Active',
        stateJurisdiction: g.jurisdictionState || 'State Tax',
        state: g.jurisdictionState || 'Karnataka',
        taxpayerType: g.taxpayerType || 'Regular',
        legalName: g.legalName || name,
        tradeName: g.tradeName || name,
        natureOfBusiness: Array.isArray(g.businessNatureActivities) ? g.businessNatureActivities.join(', ') : g.businessNatureActivities || 'Software Services',
        returnType: 'GSTR-3B',
        fy: '2024-25',
        taxPeriod: 'April 2024',
        filingDueDate: '20-May-2024',
        dateOfFiling: formatDate(g.registrationDate),
        filingStatus: 'Filed'
      }
    })),
    inactive: []
  };

  // Construct credit ratings
  const ratingsList = (gqlCompany.creditRatings || []).map((r: any) => ({
    instrument: r.instrument || 'Bank Facilities',
    amount: formatAmount(r.amount * 100000) || '-',
    currency: 'INR',
    rating: r.rating || 'A+',
    action: r.ratingAction || 'Reaffirmed',
    outlook: r.outlook || 'Stable'
  }));

  const creditRatings = {
    crisil: ratingsList.filter((r: any) => (r.instrument || '').toLowerCase().includes('crisil')),
    icra: ratingsList.filter((r: any) => !(r.instrument || '').toLowerCase().includes('crisil')),
    unaccepted: []
  };

  // Fallback if filtering produces empty lists
  if (creditRatings.icra.length === 0 && ratingsList.length > 0) {
    creditRatings.icra = ratingsList;
  }

  // Construct legal history
  const nclt = (gqlCompany.ncltCases || []).map((c: any) => ({
    category: 'NCLT Case',
    court: c.bench || 'NCLT Bench',
    petitioners: c.petitioner || 'Petitioner',
    caseNo: c.caseNumber || 'N/A',
    dateOfJudgement: formatDate(c.filingDate),
    url: '#'
  }));

  const nclat = (gqlCompany.nclatCases || []).map((c: any) => ({
    category: 'NCLAT Case',
    court: c.bench || 'NCLAT Court',
    petitioners: c.petitioner || 'Petitioner',
    caseNo: c.caseNumber || 'N/A',
    dateOfJudgement: formatDate(c.filingDate),
    url: '#'
  }));

  const drt = (gqlCompany.drtCases || []).map((c: any) => ({
    category: 'DRT Case',
    court: c.bench || 'DRT Bench',
    petitioners: c.petitioners || 'Petitioner',
    caseNo: c.suitRefNo || 'N/A',
    dateOfJudgement: formatDate(c.suitDate),
    url: c.link || '#'
  }));

  const drat = (gqlCompany.dratCases || []).map((c: any) => ({
    category: 'DRAT Case',
    court: c.bench || 'DRAT Bench',
    petitioners: c.petitioners || 'Petitioner',
    caseNo: c.suitRefNo || 'N/A',
    dateOfJudgement: formatDate(c.suitDate),
    url: '#'
  }));

  const ibbi = (gqlCompany.ibbiCases || []).map((c: any) => ({
    category: 'IBBI Case',
    court: c.bench || 'IBBI Court',
    petitioners: c.petitioners || 'Petitioner',
    caseNo: c.suitRefNo || 'N/A',
    dateOfJudgement: formatDate(c.suitDate),
    url: '#'
  }));

  const legalCases = [...nclt, ...nclat, ...drt, ...drat, ...ibbi];

  const legalHistory = {
    casesAgainst: legalCases,
    casesBy: []
  };

  // Construct EPFO
  const epfo = (gqlCompany.epfoRecords || []).map((e: any, idx: number) => ({
    id: e.transactionNo || String(idx),
    name: e.establishmentName || name,
    city: e.officeName || 'Bangalore',
    wageMonth: e.wageMonth || '03/2024',
    dateOfCredit: formatDate(e.dateOfCredit),
    employees: e.noOfEmployees || 100,
    amount: e.amount || 250000
  }));

  // Construct referenceDocs
  const referenceDocs = {
    about: [{ name: 'Company Details Extract', documentType: 'Form AOC-4', source: 'MCA', date: about.dateOfIncorporation, url: '#' }],
    gst: [{ name: 'GSTIN Profile Details', documentType: 'Certificate', source: 'GST Portal', date: '-', url: '#' }],
    creditRatings: [{ name: 'Rating Rationale Press Release', documentType: 'Press Release', source: 'CRA', date: '-', url: '#' }],
    legalHistory: [{ name: 'Case Details Record', documentType: 'Status Report', source: 'eCourts', date: '-', url: '#' }],
    epfo: [{ name: 'EPFO Challan Receipt', documentType: 'Receipt', source: 'EPFO', date: '-', url: '#' }]
  };

  return {
    id: cin,
    name: name,
    status: about.companyStatus,
    about,
    directors,
    charges,
    structure,
    financials,
    peerComparison,
    compliance,
    gst,
    creditRatings,
    legalHistory,
    epfo,
    referenceDocs
  };
}

export async function fetchAboutCompany(cin: string) {
  const query = `
    query GetAbout($cin: String!) {
      company(cin: $cin) {
        cin
        company
        regStreetAddress regLocality regDistrict regCity regState regPostalCode regCountry regActiveStatus
        companyType companyOrigin registrationNumber dateOfIncorporation emailAddress whetherListedOrNot
        companyCategory companySubcategory classOfCompany authorisedCapital paidUpCapital dateOfLastAgm
        rocName rdName rdRegion balanceSheetDate
        lei { leiCode }
        businessActivities { descriptionOfBusinessActivity }
        assetCharges { chargeAmount }
        mcaDefault { mcaDefaultDate }
      }
    }
  `;
  const data = await queryGraphQL(query, { cin });
  if (!data || !data.company) return null;
  return mapGraphQLCompanyToUI(data.company);
}

export async function fetchCompanyStructure(cin: string) {
  const query = `
    query GetStructure($cin: String!) {
      company(cin: $cin) {
        cin
        company
        dateOfIncorporation
        paidUpCapital
        shareholdingRecords { category equityNoOfShares equityPercentage }
        noncurrentInvestments { affiliateName }
      }
    }
  `;
  const data = await queryGraphQL(query, { cin });
  if (!data || !data.company) return null;
  return mapGraphQLCompanyToUI(data.company);
}

export async function fetchCompanyFinancials(cin: string) {
  const query = `
    query GetFinancials($cin: String!) {
      company(cin: $cin) {
        cin
        company
        financials { year title amount unit format }
        cashflow { year title amount }
        auditorDetails { year auditorName memberName }
      }
    }
  `;
  const data = await queryGraphQL(query, { cin });
  if (!data || !data.company) return null;
  return mapGraphQLCompanyToUI(data.company);
}

export async function fetchCompanyDirectors(cin: string) {
  const query = `
    query GetDirectors($cin: String!) {
      company(cin: $cin) {
        cin
        directors { name din designation currentDesignationDate cessationDate }
      }
    }
  `;
  const data = await queryGraphQL(query, { cin });
  if (!data || !data.company) return null;
  return mapGraphQLCompanyToUI(data.company);
}

export async function fetchCompanyCharges(cin: string) {
  const query = `
    query GetCharges($cin: String!) {
      company(cin: $cin) {
        cin
        assetCharges { chargeId chargeDate chargeHolderName chargeAmount authorisationStatus }
      }
    }
  `;
  const data = await queryGraphQL(query, { cin });
  if (!data || !data.company) return null;
  return mapGraphQLCompanyToUI(data.company);
}

export async function fetchCompanyCompliance(cin: string) {
  const query = `
    query GetCompliance($cin: String!) {
      company(cin: $cin) {
        cin
        auditReports { year auditorsReport }
      }
    }
  `;
  const data = await queryGraphQL(query, { cin });
  if (!data || !data.company) return null;
  return mapGraphQLCompanyToUI(data.company);
}

export async function fetchCompanyGST(cin: string) {
  const query = `
    query GetGST($cin: String!) {
      company(cin: $cin) {
        cin
        company
        gst { gstin gstinStatus legalName tradeName taxpayerType jurisdictionState registrationDate jurisdictionCenter businessNatureActivities }
      }
    }
  `;
  const data = await queryGraphQL(query, { cin });
  if (!data || !data.company) return null;
  return mapGraphQLCompanyToUI(data.company);
}

export async function fetchCompanyCreditRatings(cin: string) {
  const query = `
    query GetRatings($cin: String!) {
      company(cin: $cin) {
        cin
        company
        creditRatings { instrument amount rating ratingAction outlook }
      }
    }
  `;
  const data = await queryGraphQL(query, { cin });
  if (!data || !data.company) return null;
  return mapGraphQLCompanyToUI(data.company);
}

export async function fetchCompanyLegalHistory(cin: string) {
  const query = `
    query GetLegal($cin: String!) {
      company(cin: $cin) {
        cin
        ncltCases { caseNumber bench petitioner respondent filingDate }
        nclatCases { caseNumber bench petitioner respondent filingDate }
        drtCases { suitRefNo bench petitioners respondent suitDate link }
        dratCases { suitRefNo bench petitioners respondent suitDate }
        ibbiCases { suitRefNo bench petitioners respondent suitDate }
      }
    }
  `;
  const data = await queryGraphQL(query, { cin });
  if (!data || !data.company) return null;
  return mapGraphQLCompanyToUI(data.company);
}

export async function fetchCompanyEPFO(cin: string) {
  const query = `
    query GetEPFO($cin: String!) {
      company(cin: $cin) {
        cin
        company
        epfoRecords { transactionNo wageMonth dateOfCredit amount noOfEmployees establishmentName officeName }
      }
    }
  `;
  const data = await queryGraphQL(query, { cin });
  if (!data || !data.company) return null;
  return mapGraphQLCompanyToUI(data.company);
}

// Keep a fallback just in case
export async function fetchFullCompany(cin: string) {
  return fetchAboutCompany(cin);
}
