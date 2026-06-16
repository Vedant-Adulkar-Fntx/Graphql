export interface ReferenceDocument {
  name: string;
  documentType: string;
  source: string;
  date: string;
  url: string;
}

export interface Director {
  name: string;
  din: string;
  designation: string;
  designationDate: string;
  originalDate: string;
  cessationDate: string | null;
}

export interface Charge {
  id: string;
  date: string;
  holder: string;
  amount: string;
  status: 'Open' | 'Closed' | 'Satisfied';
}

export interface ShareholdingRow {
  category: string;
  equityShares: number;
  equityPercent: number;
  prefShares: number;
  prefPercent: number;
}

export interface DirectorShareholding {
  name: string;
  din: string;
  designation: string;
  shareholdingPercent: number;
  numberOfShares: number;
}

export interface MajorShareholder {
  name: string;
  shareholdingPercent: number;
}

export interface SecuritiesAllotment {
  date: string;
  type: string;
  instrument: string;
  amount: string;
  securitiesAllotted: number;
  nominalValue: number;
  premiumValue: number;
  url: string;
}

export interface RelatedCorporate {
  name: string;
  shareholdingPercent: number;
  city: string;
  puc: string;
  soc: string;
  incorpDate: string;
  status: string;
}

export interface FinancialRow {
  label: string;
  values: string[];
}

export interface Auditor {
  year: string;
  auditorName: string;
  auditorFirm: string;
  names: string;
  pan: string;
  address: string;
}

export interface PeerComparisonRow {
  label: string;
  values: string[];
}

export interface PeerEntity {
  name: string;
  values: Record<string, number>;
}

export interface PeerComparison {
  years: string[];
  peerCount: number;
  rankingMetrics: string[];
  rankByMetric: string;
  data: PeerComparisonRow[];
  peers: PeerEntity[];
}

export interface AuditorRemark {
  year: string;
  remarks: 'Yes' | 'No';
}

export interface Compliance {
  auditorRemarks: {
    standalone: AuditorRemark[];
    consolidated: AuditorRemark[];
  };
  suitFiled: any[];
  cdr: any[];
  bifr: any[];
}

export interface GSTINDetail {
  registrationDate: string;
  centreJurisdiction: string;
  status: string;
  stateJurisdiction: string;
  state: string;
  taxpayerType: string;
  legalName: string;
  tradeName: string;
  natureOfBusiness: string;
  returnType: string;
  fy: string;
  taxPeriod: string;
  filingDueDate: string;
  dateOfFiling: string;
  filingStatus: string;
}

export interface ActiveGSTIN {
  gstin: string;
  state: string;
  fy: string;
  type: string;
  latestFilingDate: string;
  taxPeriod: string;
  details: GSTINDetail;
}

export interface InactiveGSTIN {
  gstin: string;
  state: string;
  status: string;
  details: GSTINDetail;
}

export interface GST {
  active: ActiveGSTIN[];
  inactive: InactiveGSTIN[];
}

export interface CreditRatingRow {
  instrument: string;
  amount: string;
  currency: string;
  rating: string;
  action: string;
  outlook: string;
}

export interface CreditRatings {
  crisil: CreditRatingRow[];
  icra: CreditRatingRow[];
  unaccepted: CreditRatingRow[];
}

export interface LegalCase {
  category: string;
  court: string;
  petitioners: string;
  caseNo: string;
  dateOfJudgement: string;
  url: string;
}

export interface LegalHistory {
  casesAgainst: LegalCase[];
  casesBy: LegalCase[];
}

export interface EPFORow {
  id: string;
  name: string;
  city: string;
  wageMonth: string;
  dateOfCredit: string;
  employees: number;
  amount: number;
}

export interface Financials {
  years: string[];
  standalone: {
    balanceSheet: FinancialRow[];
    profitAndLoss: FinancialRow[];
    cashFlow: FinancialRow[];
    ratios: FinancialRow[];
  };
  consolidated: {
    balanceSheet: FinancialRow[];
    profitAndLoss: FinancialRow[];
    cashFlow: FinancialRow[];
    ratios: FinancialRow[];
  };
  auditors: Auditor[];
}

export interface CompanyStructure {
  summary: {
    promoterPercent: number;
    publicPercent: number;
    shareholdersCount: number;
    totalEquityShares: number;
    totalPrefShares: number;
  };
  shareholdingPattern: {
    promoters: ShareholdingRow[];
    public: ShareholdingRow[];
  };
  directorsShareholding: DirectorShareholding[];
  majorShareholders: MajorShareholder[];
  securitiesAllotment: SecuritiesAllotment[];
  relatedCorporates: {
    holding: RelatedCorporate[];
    subsidiary: RelatedCorporate[];
    associate: RelatedCorporate[];
    jointVenture: RelatedCorporate[];
    other: RelatedCorporate[];
  };
}

export interface Company {
  id: string;
  name: string;
  status: string;
  about: {
    registeredAddress: string;
    businessAddress: string;
    website: string;
    email: string;
    phone: string;
    lei: string;
    authorisedCapital: string;
    paidUpCapital: string;
    sumOfCharges: string;
    companyStatus: string;
    activeCompliance: string;
    aboutCorporate: string;
    cin: string;
    pan: string;
    typeOfEntity: string;
    dateOfIncorporation: string;
    listingStatus: string;
    dateOfLastAgm: string;
    broadIndustryCategory: string;
    industry: string;
    segments: string;
  };
  directors: Director[];
  charges: Charge[];
  structure?: CompanyStructure;
  financials?: Financials;
  peerComparison?: PeerComparison;
  compliance?: Compliance;
  gst?: GST;
  creditRatings?: CreditRatings;
  legalHistory?: LegalHistory;
  epfo?: EPFORow[];
  referenceDocs?: Record<string, ReferenceDocument[]>;
}

export const mockCompanies: Company[] = [
{
  id: 'c1',
  name: 'Network Tech Pvt Ltd',
  status: 'Active',
  about: {
    registeredAddress:
    '12/A, Tech Park, Electronic City Phase 1, Bangalore, Karnataka 560100',
    businessAddress:
    '12/A, Tech Park, Electronic City Phase 1, Bangalore, Karnataka 560100',
    website: 'www.dummynetworktech.in',
    email: 'compliance@networktech-dummy.in',
    phone: '+91-80-4567-8901',
    lei: '335800QWERT123456789',
    authorisedCapital: '₹ 50,00,00,000',
    paidUpCapital: '₹ 35,50,00,000',
    sumOfCharges: '₹ 12,00,00,000',
    companyStatus: 'Active',
    activeCompliance: 'Compliant',
    aboutCorporate:
    'Network Tech Pvt Ltd is a leading data intelligence and analytics provider specializing in corporate risk assessment, financial modeling, and market intelligence solutions for enterprise clients across the APAC region.',
    cin: 'U72900KA2018PTC123456',
    pan: 'AABCN1234E',
    typeOfEntity: 'Private Limited Company',
    dateOfIncorporation: '15-May-2018',
    listingStatus: 'Unlisted',
    dateOfLastAgm: '30-Sep-2023',
    broadIndustryCategory: 'Information Technology',
    industry: 'Software & Services',
    segments: 'Data Analytics, Risk Management Software'
  },
  directors: [
  {
    name: 'Rajesh Kumar',
    din: '01234567',
    designation: 'Managing Director',
    designationDate: '15-May-2018',
    originalDate: '15-May-2018',
    cessationDate: null
  },
  {
    name: 'Priya Sharma',
    din: '07654321',
    designation: 'Whole-time Director',
    designationDate: '01-Apr-2020',
    originalDate: '01-Apr-2020',
    cessationDate: null
  },
  {
    name: 'Amit Patel',
    din: '09876543',
    designation: 'Independent Director',
    designationDate: '10-Aug-2021',
    originalDate: '10-Aug-2021',
    cessationDate: null
  },
  {
    name: 'Sneha Reddy',
    din: '04567891',
    designation: 'Nominee Director',
    designationDate: '22-Nov-2019',
    originalDate: '22-Nov-2019',
    cessationDate: '31-Dec-2023'
  }],

  charges: [
  {
    id: '10012345',
    date: '12-Jan-2022',
    holder: 'HDFC Bank Limited',
    amount: '₹ 5,00,00,000',
    status: 'Open'
  },
  {
    id: '10012346',
    date: '05-Mar-2021',
    holder: 'State Bank of India',
    amount: '₹ 7,00,00,000',
    status: 'Open'
  },
  {
    id: '10009876',
    date: '18-Jul-2019',
    holder: 'ICICI Bank Limited',
    amount: '₹ 2,50,00,000',
    status: 'Satisfied'
  }],

  referenceDocs: {
    about: [
    {
      name: 'Company Master Data',
      documentType: 'Incorporation (Form SPICe+ / INC-32)',
      source: 'MCA21 Registry',
      date: '15-May-2018',
      url: '#'
    },
    {
      name: 'Particulars of Registered Office',
      documentType: 'Form INC-22',
      source: 'MCA21 Registry',
      date: '20-May-2018',
      url: '#'
    }],

    'share-holding-pattern': [
    {
      name: 'Annual Return 2023-24',
      documentType: 'Form MGT-7',
      source: 'MCA21 Registry',
      date: '30-Oct-2024',
      url: '#'
    }],

    'directors-shareholding': [
    {
      name: 'Annual Return 2023-24',
      documentType: 'Form MGT-7',
      source: 'MCA21 Registry',
      date: '30-Oct-2024',
      url: '#'
    }],

    'major-shareholders': [
    {
      name: 'Annual Return 2023-24',
      documentType: 'Form MGT-7',
      source: 'MCA21 Registry',
      date: '30-Oct-2024',
      url: '#'
    }],

    'securities-allotment': [
    {
      name: 'Return of Allotment',
      documentType: 'Form PAS-3',
      source: 'MCA21 Registry',
      date: '25-Nov-2022',
      url: '#'
    }],

    'related-corporates': [
    {
      name: 'Annual Return 2023-24',
      documentType: 'Form MGT-7',
      source: 'MCA21 Registry',
      date: '30-Oct-2024',
      url: '#'
    }],

    'balance-sheet': [
    {
      name: 'Financial Statements 2023-24',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '30-Oct-2024',
      url: '#'
    },
    {
      name: 'Financial Statements 2022-23',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '28-Oct-2023',
      url: '#'
    },
    {
      name: 'Financial Statements 2021-22',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '25-Oct-2022',
      url: '#'
    },
    {
      name: 'Financial Statements 2020-21',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '29-Oct-2021',
      url: '#'
    },
    {
      name: 'Financial Statements 2019-20',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '30-Oct-2020',
      url: '#'
    }],

    'profit-loss': [
    {
      name: 'Financial Statements 2023-24',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '30-Oct-2024',
      url: '#'
    },
    {
      name: 'Financial Statements 2022-23',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '28-Oct-2023',
      url: '#'
    },
    {
      name: 'Financial Statements 2021-22',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '25-Oct-2022',
      url: '#'
    },
    {
      name: 'Financial Statements 2020-21',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '29-Oct-2021',
      url: '#'
    },
    {
      name: 'Financial Statements 2019-20',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '30-Oct-2020',
      url: '#'
    }],

    'cash-flow': [
    {
      name: 'Financial Statements 2023-24',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '30-Oct-2024',
      url: '#'
    },
    {
      name: 'Financial Statements 2022-23',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '28-Oct-2023',
      url: '#'
    },
    {
      name: 'Financial Statements 2021-22',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '25-Oct-2022',
      url: '#'
    },
    {
      name: 'Financial Statements 2020-21',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '29-Oct-2021',
      url: '#'
    },
    {
      name: 'Financial Statements 2019-20',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '30-Oct-2020',
      url: '#'
    }],

    ratios: [
    {
      name: 'Financial Statements 2023-24',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '30-Oct-2024',
      url: '#'
    },
    {
      name: 'Financial Statements 2022-23',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '28-Oct-2023',
      url: '#'
    },
    {
      name: 'Financial Statements 2021-22',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '25-Oct-2022',
      url: '#'
    },
    {
      name: 'Financial Statements 2020-21',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '29-Oct-2021',
      url: '#'
    },
    {
      name: 'Financial Statements 2019-20',
      documentType: 'Form AOC-4',
      source: 'MCA21 Registry',
      date: '30-Oct-2020',
      url: '#'
    }],

    auditors: [
    {
      name: 'Notice of Appointment of Auditor',
      documentType: 'Form ADT-1',
      source: 'MCA21 Registry',
      date: '15-Sep-2023',
      url: '#'
    }],

    directors: [
    {
      name: 'Particulars of Appointment of Directors',
      documentType: 'Form DIR-12',
      source: 'MCA21 Registry',
      date: '12-Aug-2021',
      url: '#'
    },
    {
      name: 'Director KYC',
      documentType: 'Form DIR-3 KYC',
      source: 'MCA21 Registry',
      date: '30-Sep-2023',
      url: '#'
    }],

    charges: [
    {
      name: 'Creation of Charge',
      documentType: 'Form CHG-1',
      source: 'MCA21 Registry',
      date: '15-Jan-2022',
      url: '#'
    },
    {
      name: 'Satisfaction of Charge',
      documentType: 'Form CHG-4',
      source: 'MCA21 Registry',
      date: '20-Jul-2019',
      url: '#'
    }],

    peers: [
    {
      name: 'Industry Benchmarking Report',
      documentType: 'Research Report',
      source: 'NSE Filings & Internal DB',
      date: '01-Feb-2024',
      url: '#'
    }],

    compliance: [
    {
      name: "Independent Auditor's Report & CARO FY24",
      documentType: "Form AOC-4 (Auditor's Report)",
      source: 'MCA21 Registry',
      date: '28-Oct-2024',
      url: '#'
    },
    {
      name: 'Annual Return FY24',
      documentType: 'Form MGT-7',
      source: 'MCA21 Registry',
      date: '28-Nov-2024',
      url: '#'
    }],

    gst: [
    {
      name: 'GST Returns Dashboard (GSTR-1 / GSTR-3B)',
      documentType: 'GST Return Filing',
      source: 'GST Portal (gst.gov.in)',
      date: '11-May-2025',
      url: '#'
    },
    {
      name: 'GST Registration Certificate (Form REG-06)',
      documentType: 'Form GST REG-06',
      source: 'GST Portal (gst.gov.in)',
      date: '01-Jul-2018',
      url: '#'
    }],

    creditRatings: [
    {
      name: 'CRISIL Rating Rationale',
      documentType: 'Credit Rating Press Release',
      source: 'CRISIL Ratings',
      date: '15-Jan-2025',
      url: '#'
    },
    {
      name: 'ICRA Rating Rationale',
      documentType: 'Credit Rating Press Release',
      source: 'ICRA Limited',
      date: '20-Feb-2025',
      url: '#'
    }],

    legalHistory: [
    {
      name: 'Court Case Records (NCLT / High Court)',
      documentType: 'Court Filing Records',
      source: 'eCourts / NCLT',
      date: '10-Mar-2025',
      url: '#'
    }],

    epfo: [
    {
      name: 'EPFO Electronic Challan cum Return (ECR)',
      documentType: 'EPFO Return',
      source: 'EPFO Portal',
      date: '15-Apr-2024',
      url: '#'
    }]

  },
  structure: {
    summary: {
      promoterPercent: 78.5,
      publicPercent: 21.5,
      shareholdersCount: 45,
      totalEquityShares: 35500000,
      totalPrefShares: 0
    },
    shareholdingPattern: {
      promoters: [
      {
        category: '1.1 Individual / Hindu Undivided Family',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '(i) Indian',
        equityShares: 15500000,
        equityPercent: 43.66,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '(ii) Non-resident Indian (others)',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '(iii) Foreign national (other than NRI)',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '2. Government',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '(i) Central Government',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '(ii) State Government',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '(iii) Government companies',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '3. Insurance companies',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '4. Banks',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '5. Financial institutions',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '6. Foreign institutional investors',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '7. Mutual funds',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '8. Venture capital',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '9. Body corporate (not mentioned above)',
        equityShares: 12367500,
        equityPercent: 34.84,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '10. Others',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      }],

      public: [
      {
        category: '1.1 Individual / Hindu Undivided Family',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '(i) Indian',
        equityShares: 2500000,
        equityPercent: 7.04,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '(ii) Non-resident Indian (others)',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '(iii) Foreign national (other than NRI)',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '2. Government',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '(i) Central Government',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '(ii) State Government',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '(iii) Government companies',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '3. Insurance companies',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '4. Banks',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '5. Financial institutions',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '6. Foreign institutional investors',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '7. Mutual funds',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '8. Venture capital',
        equityShares: 5132500,
        equityPercent: 14.46,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '9. Body corporate (not mentioned above)',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      },
      {
        category: '10. Others',
        equityShares: 0,
        equityPercent: 0,
        prefShares: 0,
        prefPercent: 0
      }]

    },
    directorsShareholding: [
    {
      name: 'Rajesh Kumar',
      din: '01234567',
      designation: 'Managing Director',
      shareholdingPercent: 25.5,
      numberOfShares: 9052500
    },
    {
      name: 'Priya Sharma',
      din: '07654321',
      designation: 'Whole-time Director',
      shareholdingPercent: 18.16,
      numberOfShares: 6447500
    }],

    majorShareholders: [
    { name: 'Rajesh Kumar', shareholdingPercent: 25.5 },
    { name: 'Priya Sharma', shareholdingPercent: 18.16 },
    { name: 'Network Tech Holdings Pvt Ltd', shareholdingPercent: 34.84 },
    { name: 'TechVentures India Fund', shareholdingPercent: 14.46 }],

    securitiesAllotment: [
    {
      date: '15-May-2018',
      type: 'Initial Subscription',
      instrument: 'Equity Shares',
      amount: '1.00',
      securitiesAllotted: 1000000,
      nominalValue: 10,
      premiumValue: 0,
      url: '#'
    },
    {
      date: '10-Aug-2020',
      type: 'Rights Issue',
      instrument: 'Equity Shares',
      amount: '15.50',
      securitiesAllotted: 15500000,
      nominalValue: 10,
      premiumValue: 0,
      url: '#'
    },
    {
      date: '22-Nov-2022',
      type: 'Private Placement',
      instrument: 'Equity Shares',
      amount: '19.00',
      securitiesAllotted: 19000000,
      nominalValue: 10,
      premiumValue: 45,
      url: '#'
    }],

    relatedCorporates: {
      holding: [
      {
        name: 'Network Tech Holdings Pvt Ltd',
        shareholdingPercent: 34.84,
        city: 'Mumbai',
        puc: '50.00',
        soc: '0.00',
        incorpDate: '10-Jan-2015',
        status: 'Active'
      }],

      subsidiary: [
      {
        name: 'Network Tech Data Solutions Pvt Ltd',
        shareholdingPercent: 100,
        city: 'Bangalore',
        puc: '5.00',
        soc: '2.50',
        incorpDate: '05-Jun-2020',
        status: 'Active'
      }],

      associate: [],
      jointVenture: [],
      other: []
    }
  },
  financials: {
    years: ['FY24', 'FY23', 'FY22', 'FY21', 'FY20'],
    standalone: {
      balanceSheet: [
      {
        label: 'Equity Capital',
        values: ['35.50', '35.50', '35.50', '16.50', '16.50']
      },
      {
        label: 'Reserves',
        values: ['120.40', '95.20', '70.10', '45.80', '30.20']
      },
      {
        label: 'Borrowings',
        values: ['15.00', '18.50', '22.00', '25.00', '10.00']
      },
      {
        label: 'Long term Borrowings',
        values: ['10.00', '12.00', '15.00', '18.00', '8.00']
      },
      {
        label: 'Short term Borrowings',
        values: ['5.00', '6.50', '7.00', '7.00', '2.00']
      },
      {
        label: 'Lease Liabilities',
        values: ['8.50', '9.00', '9.50', '10.00', '10.50']
      },
      {
        label: 'Other Borrowings',
        values: ['0.00', '0.00', '0.00', '0.00', '0.00']
      },
      {
        label: 'Other Liabilities',
        values: ['45.20', '38.60', '32.40', '28.50', '22.10']
      },
      {
        label: 'Non controlling int',
        values: ['0.00', '0.00', '0.00', '0.00', '0.00']
      },
      {
        label: 'Trade Payables',
        values: ['25.60', '22.10', '18.50', '15.20', '12.40']
      },
      {
        label: 'Advance from Customers',
        values: ['5.40', '4.80', '4.20', '3.80', '3.10']
      },
      {
        label: 'Other liability items',
        values: ['14.20', '11.70', '9.70', '9.50', '6.60']
      },
      {
        label: 'Total Liabilities',
        values: ['224.60', '196.80', '169.50', '125.80', '89.30']
      },
      {
        label: 'Fixed Assets',
        values: ['65.80', '60.20', '55.40', '45.20', '35.60']
      },
      {
        label: 'Building',
        values: ['25.00', '25.00', '25.00', '20.00', '20.00']
      },
      {
        label: 'Equipments',
        values: ['15.40', '12.80', '10.50', '8.40', '6.20']
      },
      {
        label: 'Computers',
        values: ['18.20', '15.60', '13.40', '11.20', '8.50']
      },
      {
        label: 'Furniture n fittings',
        values: ['4.50', '4.20', '3.80', '3.50', '3.10']
      },
      {
        label: 'Vehicles',
        values: ['2.70', '2.60', '2.70', '2.10', '1.80']
      },
      {
        label: 'Intangible Assets',
        values: ['12.40', '10.50', '8.60', '6.80', '5.20']
      },
      {
        label: 'Other fixed assets',
        values: ['0.00', '0.00', '0.00', '0.00', '0.00']
      },
      {
        label: 'Gross Block',
        values: ['78.20', '70.70', '64.00', '52.00', '40.80']
      },
      {
        label: 'Accumulated Depreciation',
        values: ['24.80', '21.00', '17.20', '13.60', '10.40']
      },
      { label: 'CWIP', values: ['2.50', '1.80', '1.20', '0.80', '0.50'] },
      {
        label: 'Investments',
        values: ['45.00', '35.00', '25.00', '15.00', '10.00']
      },
      {
        label: 'Other Assets',
        values: ['113.80', '101.60', '89.10', '65.60', '43.70']
      },
      {
        label: 'Trade receivables',
        values: ['58.40', '52.10', '45.60', '35.20', '25.40']
      },
      {
        label: 'Cash Equivalents',
        values: ['35.20', '30.50', '25.80', '18.40', '10.20']
      },
      {
        label: 'Loans n Advances',
        values: ['12.50', '11.20', '10.40', '8.50', '5.60']
      },
      {
        label: 'Other asset items',
        values: ['7.70', '7.80', '7.30', '3.50', '2.50']
      },
      {
        label: 'Total Assets',
        values: ['224.60', '196.80', '169.50', '125.80', '89.30']
      }],

      profitAndLoss: [
      {
        label: 'Sales',
        values: ['185.40', '156.20', '128.50', '95.40', '75.20']
      },
      {
        label: 'Sales Growth %',
        values: ['18.69', '21.56', '34.70', '26.86', '-']
      },
      {
        label: 'Expenses',
        values: ['135.20', '115.80', '98.40', '75.60', '60.50']
      },
      {
        label: 'Operating Profit',
        values: ['50.20', '40.40', '30.10', '19.80', '14.70']
      },
      {
        label: 'OPM %',
        values: ['27.08', '25.86', '23.42', '20.75', '19.55']
      },
      {
        label: 'Other Income',
        values: ['5.40', '4.20', '3.50', '2.80', '2.10']
      },
      {
        label: 'Exceptional items',
        values: ['0.00', '0.00', '0.00', '0.00', '0.00']
      },
      {
        label: 'Other income normal',
        values: ['5.40', '4.20', '3.50', '2.80', '2.10']
      },
      {
        label: 'Interest',
        values: ['2.50', '2.80', '3.20', '3.50', '1.80']
      },
      {
        label: 'Depreciation',
        values: ['6.50', '5.80', '5.20', '4.50', '3.80']
      },
      {
        label: 'Profit before tax',
        values: ['46.60', '36.00', '25.20', '14.60', '11.20']
      },
      {
        label: 'Tax %',
        values: ['25.50', '25.50', '25.50', '25.50', '25.50']
      },
      {
        label: 'Net Profit',
        values: ['34.72', '26.82', '18.77', '10.88', '8.34']
      },
      {
        label: 'Minority share',
        values: ['0.00', '0.00', '0.00', '0.00', '0.00']
      },
      {
        label: 'Exceptional items AT',
        values: ['0.00', '0.00', '0.00', '0.00', '0.00']
      },
      {
        label: 'Profit excl Excep',
        values: ['34.72', '26.82', '18.77', '10.88', '8.34']
      },
      {
        label: 'Profit for PE',
        values: ['34.72', '26.82', '18.77', '10.88', '8.34']
      },
      {
        label: 'Profit for EPS',
        values: ['34.72', '26.82', '18.77', '10.88', '8.34']
      },
      {
        label: 'Profit Growth %',
        values: ['29.46', '42.89', '72.52', '30.46', '-']
      },
      {
        label: 'EPS in Rs',
        values: ['9.78', '7.55', '5.29', '6.59', '5.05']
      },
      {
        label: 'Dividend Payout %',
        values: ['15.00', '12.00', '10.00', '0.00', '0.00']
      }],

      cashFlow: [
      {
        label: 'Cash from Operating Activity',
        values: ['42.50', '32.80', '24.50', '15.20', '12.40']
      },
      {
        label: 'Profit from operations',
        values: ['50.20', '40.40', '30.10', '19.80', '14.70']
      },
      {
        label: 'Receivables',
        values: ['-6.30', '-6.50', '-10.40', '-9.80', '-5.20']
      },
      {
        label: 'Payables',
        values: ['3.50', '3.60', '3.30', '2.80', '2.10']
      },
      {
        label: 'Loans Advances',
        values: ['-1.30', '-0.80', '-1.90', '-2.90', '-1.50']
      },
      {
        label: 'Other WC items',
        values: ['2.50', '2.00', '0.20', '2.90', '1.10']
      },
      {
        label: 'Working capital changes',
        values: ['-1.60', '-1.70', '-8.80', '-7.00', '-3.50']
      },
      {
        label: 'Direct taxes',
        values: ['-11.88', '-9.18', '-6.43', '-3.72', '-2.86']
      },
      {
        label: 'Advance tax',
        values: ['5.78', '3.28', '9.63', '6.12', '4.06']
      },
      {
        label: 'Cash from Investing Activity',
        values: ['-25.40', '-20.50', '-18.20', '-12.40', '-8.50']
      },
      {
        label: 'Fixed assets purchased',
        values: ['-12.50', '-10.80', '-9.50', '-8.20', '-6.40']
      },
      {
        label: 'Fixed assets sold',
        values: ['0.50', '0.20', '0.00', '0.00', '0.00']
      },
      {
        label: 'Investments purchased',
        values: ['-15.00', '-12.00', '-10.00', '-5.00', '-3.00']
      },
      {
        label: 'Investments sold',
        values: ['5.00', '2.00', '0.00', '0.00', '0.00']
      },
      {
        label: 'Interest received',
        values: ['1.20', '0.80', '0.50', '0.30', '0.20']
      },
      {
        label: 'Invest in subsidiaries',
        values: ['-4.60', '-0.70', '0.80', '0.50', '0.70']
      },
      {
        label: 'Acquisition of companies',
        values: ['0.00', '0.00', '0.00', '0.00', '0.00']
      },
      {
        label: 'Other investing items',
        values: ['0.00', '0.00', '0.00', '0.00', '0.00']
      },
      {
        label: 'Cash from Financing Activity',
        values: ['-12.40', '-7.60', '1.10', '5.40', '2.10']
      },
      {
        label: 'Proceeds from shares',
        values: ['0.00', '0.00', '19.00', '0.00', '0.00']
      },
      {
        label: 'Proceeds from borrowings',
        values: ['5.00', '8.00', '10.00', '18.00', '5.00']
      },
      {
        label: 'Repayment of borrowings',
        values: ['-8.50', '-11.50', '-13.00', '-3.00', '-2.00']
      },
      {
        label: 'Interest paid fin',
        values: ['-2.50', '-2.80', '-3.20', '-3.50', '-1.80']
      },
      {
        label: 'Dividends paid',
        values: ['-5.21', '-3.22', '-1.88', '0.00', '0.00']
      },
      {
        label: 'Financial liabilities',
        values: ['-1.19', '1.92', '-9.82', '-6.10', '0.90']
      },
      {
        label: 'Other financing items',
        values: ['0.00', '0.00', '0.00', '0.00', '0.00']
      },
      {
        label: 'Net Cash Flow',
        values: ['4.70', '4.70', '7.40', '8.20', '6.00']
      },
      {
        label: 'Free Cash Flow',
        values: ['30.00', '22.00', '15.00', '7.00', '6.00']
      },
      { label: 'CFO/OP', values: ['0.85', '0.81', '0.81', '0.77', '0.84'] }],

      ratios: [
      {
        label: 'Current Ratio',
        values: ['2.15', '2.05', '1.95', '1.85', '1.75']
      },
      {
        label: 'Quick Ratio',
        values: ['1.95', '1.85', '1.75', '1.65', '1.55']
      },
      {
        label: 'Debt to Equity',
        values: ['0.10', '0.14', '0.21', '0.40', '0.21']
      },
      {
        label: 'Return on Equity (ROE) %',
        values: ['22.27', '20.52', '17.77', '17.46', '17.86']
      },
      {
        label: 'Return on Assets (ROA) %',
        values: ['15.46', '13.63', '11.07', '8.65', '9.34']
      },
      {
        label: 'Net Profit Margin %',
        values: ['18.73', '17.17', '14.61', '11.40', '11.09']
      },
      {
        label: 'Gross Profit Margin %',
        values: ['45.20', '42.50', '38.40', '35.20', '32.10']
      }]

    },
    consolidated: {
      balanceSheet: [
      {
        label: 'Equity Capital',
        values: ['35.50', '35.50', '35.50', '16.50', '16.50']
      },
      {
        label: 'Reserves',
        values: ['125.40', '98.20', '72.10', '46.80', '31.20']
      },
      {
        label: 'Borrowings',
        values: ['16.00', '19.50', '23.00', '26.00', '11.00']
      },
      {
        label: 'Long term Borrowings',
        values: ['11.00', '13.00', '16.00', '19.00', '9.00']
      },
      {
        label: 'Short term Borrowings',
        values: ['5.00', '6.50', '7.00', '7.00', '2.00']
      },
      {
        label: 'Lease Liabilities',
        values: ['9.50', '10.00', '10.50', '11.00', '11.50']
      },
      {
        label: 'Other Borrowings',
        values: ['0.00', '0.00', '0.00', '0.00', '0.00']
      },
      {
        label: 'Other Liabilities',
        values: ['48.20', '40.60', '34.40', '30.50', '24.10']
      },
      {
        label: 'Non controlling int',
        values: ['2.50', '2.00', '1.50', '1.00', '0.50']
      },
      {
        label: 'Trade Payables',
        values: ['28.60', '24.10', '20.50', '17.20', '14.40']
      },
      {
        label: 'Advance from Customers',
        values: ['6.40', '5.80', '5.20', '4.80', '4.10']
      },
      {
        label: 'Other liability items',
        values: ['13.20', '10.70', '8.70', '8.50', '5.60']
      },
      {
        label: 'Total Liabilities',
        values: ['237.10', '205.80', '176.50', '131.80', '94.80']
      },
      {
        label: 'Fixed Assets',
        values: ['70.80', '64.20', '59.40', '48.20', '38.60']
      },
      {
        label: 'Building',
        values: ['28.00', '28.00', '28.00', '22.00', '22.00']
      },
      {
        label: 'Equipments',
        values: ['17.40', '14.80', '12.50', '10.40', '8.20']
      },
      {
        label: 'Computers',
        values: ['20.20', '17.60', '15.40', '13.20', '10.50']
      },
      {
        label: 'Furniture n fittings',
        values: ['5.50', '5.20', '4.80', '4.50', '4.10']
      },
      {
        label: 'Vehicles',
        values: ['3.70', '3.60', '3.70', '3.10', '2.80']
      },
      {
        label: 'Intangible Assets',
        values: ['14.40', '12.50', '10.60', '8.80', '7.20']
      },
      {
        label: 'Other fixed assets',
        values: ['0.00', '0.00', '0.00', '0.00', '0.00']
      },
      {
        label: 'Gross Block',
        values: ['89.20', '81.70', '75.00', '61.00', '49.80']
      },
      {
        label: 'Accumulated Depreciation',
        values: ['28.80', '25.00', '21.20', '17.60', '14.40']
      },
      { label: 'CWIP', values: ['3.50', '2.80', '2.20', '1.80', '1.50'] },
      {
        label: 'Investments',
        values: ['40.00', '30.00', '20.00', '10.00', '5.00']
      },
      {
        label: 'Other Assets',
        values: ['122.80', '108.80', '94.90', '71.80', '49.70']
      },
      {
        label: 'Trade receivables',
        values: ['62.40', '56.10', '49.60', '39.20', '29.40']
      },
      {
        label: 'Cash Equivalents',
        values: ['38.20', '33.50', '28.80', '21.40', '13.20']
      },
      {
        label: 'Loans n Advances',
        values: ['14.50', '13.20', '12.40', '10.50', '7.60']
      },
      {
        label: 'Other asset items',
        values: ['7.70', '6.00', '4.10', '0.70', '-0.50']
      },
      {
        label: 'Total Assets',
        values: ['237.10', '205.80', '176.50', '131.80', '94.80']
      }],

      profitAndLoss: [
      {
        label: 'Sales',
        values: ['195.40', '166.20', '138.50', '105.40', '85.20']
      },
      {
        label: 'Sales Growth %',
        values: ['17.57', '20.00', '31.40', '23.71', '-']
      },
      {
        label: 'Expenses',
        values: ['142.20', '122.80', '105.40', '82.60', '68.50']
      },
      {
        label: 'Operating Profit',
        values: ['53.20', '43.40', '33.10', '22.80', '16.70']
      },
      {
        label: 'OPM %',
        values: ['27.23', '26.11', '23.90', '21.63', '19.60']
      },
      {
        label: 'Other Income',
        values: ['6.40', '5.20', '4.50', '3.80', '3.10']
      },
      {
        label: 'Exceptional items',
        values: ['0.00', '0.00', '0.00', '0.00', '0.00']
      },
      {
        label: 'Other income normal',
        values: ['6.40', '5.20', '4.50', '3.80', '3.10']
      },
      {
        label: 'Interest',
        values: ['2.80', '3.10', '3.50', '3.80', '2.10']
      },
      {
        label: 'Depreciation',
        values: ['7.50', '6.80', '6.20', '5.50', '4.80']
      },
      {
        label: 'Profit before tax',
        values: ['49.30', '38.70', '27.90', '17.30', '12.90']
      },
      {
        label: 'Tax %',
        values: ['25.50', '25.50', '25.50', '25.50', '25.50']
      },
      {
        label: 'Net Profit',
        values: ['36.73', '28.83', '20.79', '12.89', '9.61']
      },
      {
        label: 'Minority share',
        values: ['0.50', '0.40', '0.30', '0.20', '0.10']
      },
      {
        label: 'Exceptional items AT',
        values: ['0.00', '0.00', '0.00', '0.00', '0.00']
      },
      {
        label: 'Profit excl Excep',
        values: ['36.23', '28.43', '20.49', '12.69', '9.51']
      },
      {
        label: 'Profit for PE',
        values: ['36.23', '28.43', '20.49', '12.69', '9.51']
      },
      {
        label: 'Profit for EPS',
        values: ['36.23', '28.43', '20.49', '12.69', '9.51']
      },
      {
        label: 'Profit Growth %',
        values: ['27.44', '38.75', '61.47', '33.44', '-']
      },
      {
        label: 'EPS in Rs',
        values: ['10.21', '8.01', '5.77', '7.69', '5.76']
      },
      {
        label: 'Dividend Payout %',
        values: ['15.00', '12.00', '10.00', '0.00', '0.00']
      }],

      cashFlow: [
      {
        label: 'Cash from Operating Activity',
        values: ['45.50', '35.80', '27.50', '18.20', '14.40']
      },
      {
        label: 'Profit from operations',
        values: ['53.20', '43.40', '33.10', '22.80', '16.70']
      },
      {
        label: 'Receivables',
        values: ['-7.30', '-7.50', '-11.40', '-10.80', '-6.20']
      },
      {
        label: 'Payables',
        values: ['4.50', '4.60', '4.30', '3.80', '3.10']
      },
      {
        label: 'Loans Advances',
        values: ['-2.30', '-1.80', '-2.90', '-3.90', '-2.50']
      },
      {
        label: 'Other WC items',
        values: ['3.50', '3.00', '1.20', '3.90', '2.10']
      },
      {
        label: 'Working capital changes',
        values: ['-1.60', '-1.70', '-8.80', '-7.00', '-3.50']
      },
      {
        label: 'Direct taxes',
        values: ['-12.57', '-9.87', '-7.11', '-4.41', '-3.29']
      },
      {
        label: 'Advance tax',
        values: ['6.47', '3.97', '10.31', '6.81', '4.49']
      },
      {
        label: 'Cash from Investing Activity',
        values: ['-28.40', '-23.50', '-21.20', '-15.40', '-11.50']
      },
      {
        label: 'Fixed assets purchased',
        values: ['-14.50', '-12.80', '-11.50', '-10.20', '-8.40']
      },
      {
        label: 'Fixed assets sold',
        values: ['0.50', '0.20', '0.00', '0.00', '0.00']
      },
      {
        label: 'Investments purchased',
        values: ['-16.00', '-13.00', '-11.00', '-6.00', '-4.00']
      },
      {
        label: 'Investments sold',
        values: ['5.00', '2.00', '0.00', '0.00', '0.00']
      },
      {
        label: 'Interest received',
        values: ['1.20', '0.80', '0.50', '0.30', '0.20']
      },
      {
        label: 'Invest in subsidiaries',
        values: ['-4.60', '-0.70', '0.80', '0.50', '0.70']
      },
      {
        label: 'Acquisition of companies',
        values: ['0.00', '0.00', '0.00', '0.00', '0.00']
      },
      {
        label: 'Other investing items',
        values: ['0.00', '0.00', '0.00', '0.00', '0.00']
      },
      {
        label: 'Cash from Financing Activity',
        values: ['-12.40', '-7.60', '1.10', '5.40', '2.10']
      },
      {
        label: 'Proceeds from shares',
        values: ['0.00', '0.00', '19.00', '0.00', '0.00']
      },
      {
        label: 'Proceeds from borrowings',
        values: ['6.00', '9.00', '11.00', '19.00', '6.00']
      },
      {
        label: 'Repayment of borrowings',
        values: ['-9.50', '-12.50', '-14.00', '-4.00', '-3.00']
      },
      {
        label: 'Interest paid fin',
        values: ['-2.80', '-3.10', '-3.50', '-3.80', '-2.10']
      },
      {
        label: 'Dividends paid',
        values: ['-5.43', '-3.41', '-2.05', '0.00', '0.00']
      },
      {
        label: 'Financial liabilities',
        values: ['-0.67', '2.41', '-9.35', '-5.80', '1.20']
      },
      {
        label: 'Other financing items',
        values: ['0.00', '0.00', '0.00', '0.00', '0.00']
      },
      {
        label: 'Net Cash Flow',
        values: ['4.70', '4.70', '7.40', '8.20', '5.00']
      },
      {
        label: 'Free Cash Flow',
        values: ['31.00', '23.00', '16.00', '8.00', '6.00']
      },
      { label: 'CFO/OP', values: ['0.86', '0.82', '0.83', '0.80', '0.86'] }],

      ratios: [
      {
        label: 'Current Ratio',
        values: ['2.25', '2.15', '2.05', '1.95', '1.85']
      },
      {
        label: 'Quick Ratio',
        values: ['2.05', '1.95', '1.85', '1.75', '1.65']
      },
      {
        label: 'Debt to Equity',
        values: ['0.10', '0.15', '0.21', '0.41', '0.23']
      },
      {
        label: 'Return on Equity (ROE) %',
        values: ['22.51', '21.26', '19.05', '20.05', '19.94']
      },
      {
        label: 'Return on Assets (ROA) %',
        values: ['15.28', '13.81', '11.61', '9.63', '10.03']
      },
      {
        label: 'Net Profit Margin %',
        values: ['18.54', '17.11', '14.79', '12.04', '11.16']
      },
      {
        label: 'Gross Profit Margin %',
        values: ['46.20', '43.50', '39.40', '36.20', '33.10']
      }]

    },
    auditors: [
    {
      year: 'FY24',
      auditorName: 'S R Batliboi & Associates LLP',
      auditorFirm: 'S R Batliboi & Associates LLP',
      names: 'Rajeev Kumar',
      pan: 'AAACS1234H',
      address:
      '12th Floor, The Ruby, Senapati Bapat Marg, Dadar West, Mumbai 400028'
    },
    {
      year: 'FY23',
      auditorName: 'S R Batliboi & Associates LLP',
      auditorFirm: 'S R Batliboi & Associates LLP',
      names: 'Rajeev Kumar',
      pan: 'AAACS1234H',
      address:
      '12th Floor, The Ruby, Senapati Bapat Marg, Dadar West, Mumbai 400028'
    }]

  },
  peerComparison: {
    years: ['FY24', 'FY23', 'FY22', 'FY21', 'FY20'],
    peerCount: 6,
    rankByMetric: 'Revenue',
    rankingMetrics: [
    'Revenue',
    'Revenue Growth (%)',
    'EBITDA Margin (%)',
    'Net Margin (%)',
    'Return on Equity (%)'],

    peers: [
    {
      name: 'Aurion Software Pvt Ltd',
      values: {
        Revenue: 212.5,
        'Revenue Growth (%)': 14.2,
        'EBITDA Margin (%)': 24.5,
        'Net Margin (%)': 16.1,
        'Return on Equity (%)': 19.8,
        'Debt/Equity': 0.22,
        'Inventory/Sales (Days)': 10,
        'Debtors / Sales (Days)': 102,
        'Payables / Sales (Days)': 60,
        'Cash Conversion Cycle (Days)': 52,
        'Sales / Net Fixed Assets': 2.45
      }
    },
    {
      name: 'Cygnet Digital Pvt Ltd',
      values: {
        Revenue: 148.3,
        'Revenue Growth (%)': 22.8,
        'EBITDA Margin (%)': 28.9,
        'Net Margin (%)': 19.4,
        'Return on Equity (%)': 24.1,
        'Debt/Equity': 0.08,
        'Inventory/Sales (Days)': 7,
        'Debtors / Sales (Days)': 128,
        'Payables / Sales (Days)': 72,
        'Cash Conversion Cycle (Days)': 63,
        'Sales / Net Fixed Assets': 3.1
      }
    },
    {
      name: 'Meridian Analytics Pvt Ltd',
      values: {
        Revenue: 96.7,
        'Revenue Growth (%)': 16.5,
        'EBITDA Margin (%)': 22.1,
        'Net Margin (%)': 13.8,
        'Return on Equity (%)': 17.2,
        'Debt/Equity': 0.31,
        'Inventory/Sales (Days)': 12,
        'Debtors / Sales (Days)': 134,
        'Payables / Sales (Days)': 58,
        'Cash Conversion Cycle (Days)': 88,
        'Sales / Net Fixed Assets': 2.05
      }
    },
    {
      name: 'Vertex IT Solutions Pvt Ltd',
      values: {
        Revenue: 264.9,
        'Revenue Growth (%)': 11.4,
        'EBITDA Margin (%)': 26.3,
        'Net Margin (%)': 17.6,
        'Return on Equity (%)': 21.5,
        'Debt/Equity': 0.15,
        'Inventory/Sales (Days)': 9,
        'Debtors / Sales (Days)': 110,
        'Payables / Sales (Days)': 66,
        'Cash Conversion Cycle (Days)': 53,
        'Sales / Net Fixed Assets': 2.68
      }
    },
    {
      name: 'Lumina Data Systems Pvt Ltd',
      values: {
        Revenue: 121.4,
        'Revenue Growth (%)': 25.6,
        'EBITDA Margin (%)': 21.8,
        'Net Margin (%)': 12.9,
        'Return on Equity (%)': 15.9,
        'Debt/Equity': 0.44,
        'Inventory/Sales (Days)': 14,
        'Debtors / Sales (Days)': 141,
        'Payables / Sales (Days)': 55,
        'Cash Conversion Cycle (Days)': 100,
        'Sales / Net Fixed Assets': 1.92
      }
    },
    {
      name: 'Strata Cloud Labs Pvt Ltd',
      values: {
        Revenue: 178.2,
        'Revenue Growth (%)': 19.9,
        'EBITDA Margin (%)': 25.4,
        'Net Margin (%)': 17.1,
        'Return on Equity (%)': 20.4,
        'Debt/Equity': 0.18,
        'Inventory/Sales (Days)': 8,
        'Debtors / Sales (Days)': 119,
        'Payables / Sales (Days)': 70,
        'Cash Conversion Cycle (Days)': 57,
        'Sales / Net Fixed Assets': 2.55
      }
    }],

    data: [
    { label: '# of Peers', values: ['6', '6', '6', '5', '5'] },
    {
      label: 'Revenue',
      values: ['185.40', '156.20', '128.50', '95.40', '75.20']
    },
    {
      label: 'Revenue Growth (%)',
      values: ['18.69', '21.56', '34.70', '26.86', '-']
    },
    {
      label: 'EBITDA Margin (%)',
      values: ['30.59', '29.57', '27.47', '25.47', '24.60']
    },
    {
      label: 'Net Margin (%)',
      values: ['18.73', '17.17', '14.61', '11.40', '11.09']
    },
    {
      label: 'Return on Equity (%)',
      values: ['22.27', '20.52', '17.77', '17.46', '17.86']
    },
    {
      label: 'Debt/Equity',
      values: ['0.10', '0.14', '0.21', '0.40', '0.21']
    },
    {
      label: 'Inventory/Sales (Days)',
      values: ['0.00', '0.00', '0.00', '0.00', '0.00']
    },
    {
      label: 'Debtors / Sales (Days)',
      values: ['115', '121', '129', '134', '123']
    },
    {
      label: 'Payables / Sales (Days)',
      values: ['50', '51', '52', '58', '60']
    },
    {
      label: 'Cash Conversion Cycle (Days)',
      values: ['65', '70', '77', '76', '63']
    },
    {
      label: 'Sales / Net Fixed Assets',
      values: ['2.81', '2.59', '2.31', '2.11', '2.11']
    }]

  },
  compliance: {
    auditorRemarks: {
      standalone: [
      { year: 'FY24', remarks: 'No' },
      { year: 'FY23', remarks: 'No' },
      { year: 'FY22', remarks: 'No' },
      { year: 'FY21', remarks: 'No' },
      { year: 'FY20', remarks: 'No' }],

      consolidated: [
      { year: 'FY24', remarks: 'No' },
      { year: 'FY23', remarks: 'No' },
      { year: 'FY22', remarks: 'No' },
      { year: 'FY21', remarks: 'No' },
      { year: 'FY20', remarks: 'No' }]

    },
    suitFiled: [],
    cdr: [],
    bifr: []
  },
  gst: {
    active: [
    {
      gstin: '29AABCN1234E1Z5',
      state: 'Karnataka',
      fy: '2023-24',
      type: 'GSTR-1',
      latestFilingDate: '11-Apr-2024',
      taxPeriod: 'Mar-2024',
      details: {
        registrationDate: '01-Jul-2018',
        centreJurisdiction: 'Bangalore South',
        status: 'Active',
        stateJurisdiction: 'LVO 050',
        state: 'Karnataka',
        taxpayerType: 'Regular',
        legalName: 'Network Tech Pvt Ltd',
        tradeName: 'Network Tech',
        natureOfBusiness: 'Service Provider',
        returnType: 'GSTR-1',
        fy: '2023-24',
        taxPeriod: 'Mar-2024',
        filingDueDate: '11-Apr-2024',
        dateOfFiling: '11-Apr-2024',
        filingStatus: 'Filed'
      }
    },
    {
      gstin: '27AABCN1234E1Z7',
      state: 'Maharashtra',
      fy: '2023-24',
      type: 'GSTR-3B',
      latestFilingDate: '20-Apr-2024',
      taxPeriod: 'Mar-2024',
      details: {
        registrationDate: '15-Sep-2019',
        centreJurisdiction: 'Mumbai Central',
        status: 'Active',
        stateJurisdiction: 'MUM-VAT-10',
        state: 'Maharashtra',
        taxpayerType: 'Regular',
        legalName: 'Network Tech Pvt Ltd',
        tradeName: 'Network Tech',
        natureOfBusiness: 'Service Provider',
        returnType: 'GSTR-3B',
        fy: '2023-24',
        taxPeriod: 'Mar-2024',
        filingDueDate: '20-Apr-2024',
        dateOfFiling: '19-Apr-2024',
        filingStatus: 'Filed'
      }
    }],

    inactive: [
    {
      gstin: '07AABCN1234E1Z9',
      state: 'Delhi',
      status: 'Cancelled',
      details: {
        registrationDate: '10-Jan-2020',
        centreJurisdiction: 'Delhi East',
        status: 'Cancelled',
        stateJurisdiction: 'Ward 50',
        state: 'Delhi',
        taxpayerType: 'Regular',
        legalName: 'Network Tech Pvt Ltd',
        tradeName: 'Network Tech',
        natureOfBusiness: 'Service Provider',
        returnType: 'GSTR-1',
        fy: '2021-22',
        taxPeriod: 'Mar-2022',
        filingDueDate: '11-Apr-2022',
        dateOfFiling: '10-Apr-2022',
        filingStatus: 'Filed'
      }
    }]

  },
  creditRatings: {
    crisil: [
    {
      instrument: 'Term Loan',
      amount: '20.00',
      currency: 'INR Crore',
      rating: 'A+',
      action: 'Reaffirmed',
      outlook: 'Stable'
    },
    {
      instrument: 'Working Capital',
      amount: '15.00',
      currency: 'INR Crore',
      rating: 'A1',
      action: 'Upgraded',
      outlook: '-'
    }],

    icra: [
    {
      instrument: 'Long Term Bank Facilities',
      amount: '35.00',
      currency: 'INR Crore',
      rating: 'A+',
      action: 'Assigned',
      outlook: 'Positive'
    }],

    unaccepted: []
  },
  legalHistory: {
    casesAgainst: [
    {
      category: 'Civil',
      court: 'High Court of Karnataka',
      petitioners: 'Tech Solutions Ltd',
      caseNo: 'WP/1234/2022',
      dateOfJudgement: 'Pending',
      url: '#'
    }],

    casesBy: [
    {
      category: 'Commercial',
      court: 'Commercial Court, Bangalore',
      petitioners: 'Network Tech Pvt Ltd',
      caseNo: 'COM.OS/567/2023',
      dateOfJudgement: '15-Feb-2024',
      url: '#'
    }]

  },
  epfo: [
  {
    id: 'BG/BNG/1234567/000',
    name: 'Network Tech Pvt Ltd',
    city: 'Bangalore',
    wageMonth: 'Mar-2024',
    dateOfCredit: '15-Apr-2024',
    employees: 450,
    amount: 1250000
  },
  {
    id: 'BG/BNG/1234567/000',
    name: 'Network Tech Pvt Ltd',
    city: 'Bangalore',
    wageMonth: 'Feb-2024',
    dateOfCredit: '14-Mar-2024',
    employees: 445,
    amount: 1235000
  },
  {
    id: 'BG/BNG/1234567/000',
    name: 'Network Tech Pvt Ltd',
    city: 'Bangalore',
    wageMonth: 'Jan-2024',
    dateOfCredit: '15-Feb-2024',
    employees: 440,
    amount: 1220000
  },
  {
    id: 'BG/BNG/1234567/000',
    name: 'Network Tech Pvt Ltd',
    city: 'Bangalore',
    wageMonth: 'Dec-2023',
    dateOfCredit: '15-Jan-2024',
    employees: 435,
    amount: 1205000
  },
  {
    id: 'BG/BNG/1234567/000',
    name: 'Network Tech Pvt Ltd',
    city: 'Bangalore',
    wageMonth: 'Nov-2023',
    dateOfCredit: '14-Dec-2023',
    employees: 430,
    amount: 1190000
  }]

},
{
  id: 'c2',
  name: 'Tata Consultancy Services Limited',
  status: 'Active',
  about: {
    registeredAddress:
    '9th Floor, Nirmal Building, Nariman Point, Mumbai, Maharashtra 400021',
    businessAddress:
    'TCS House, Raveline Street, Fort, Mumbai, Maharashtra 400001',
    website: 'www.tcs.com',
    email: 'investor.relations@tcs.com',
    phone: '+91-22-6778-9999',
    lei: '3358001234567890ABCD',
    authorisedCapital: '₹ 500,00,00,000',
    paidUpCapital: '₹ 365,00,00,000',
    sumOfCharges: '₹ 0',
    companyStatus: 'Active',
    activeCompliance: 'Compliant',
    aboutCorporate:
    "Tata Consultancy Services is an IT services, consulting and business solutions organization that has been partnering with many of the world's largest businesses in their transformation journeys for over 50 years.",
    cin: 'L22210MH1995PLC084781',
    pan: 'AAACT1234F',
    typeOfEntity: 'Public Limited Company',
    dateOfIncorporation: '19-Jan-1995',
    listingStatus: 'Listed',
    dateOfLastAgm: '29-Jun-2023',
    broadIndustryCategory: 'Information Technology',
    industry: 'IT Services',
    segments: 'Consulting, Software Development'
  },
  directors: [
  {
    name: 'Natarajan Chandrasekaran',
    din: '00121863',
    designation: 'Chairman',
    designationDate: '12-Jan-2017',
    originalDate: '12-Jan-2017',
    cessationDate: null
  }],

  charges: []
},
{
  id: 'c3',
  name: 'Reliance Industries Limited',
  status: 'Active',
  about: {
    registeredAddress:
    'Maker Chambers IV, 3rd Floor, 222, Nariman Point, Mumbai, Maharashtra 400021',
    businessAddress:
    'Reliance Corporate Park, Ghansoli, Navi Mumbai, Maharashtra 400701',
    website: 'www.ril.com',
    email: 'investor_relations@ril.com',
    phone: '+91-22-3555-5000',
    lei: '335800RIL12345678901',
    authorisedCapital: '₹ 15000,00,00,000',
    paidUpCapital: '₹ 6765,00,00,000',
    sumOfCharges: '₹ 45000,00,00,000',
    companyStatus: 'Active',
    activeCompliance: 'Compliant',
    aboutCorporate:
    'Reliance Industries Limited is an Indian multinational conglomerate, headquartered in Mumbai. It has diverse businesses including energy, petrochemicals, natural gas, retail, telecommunications, mass media, and textiles.',
    cin: 'L17110MH1973PLC019786',
    pan: 'AAACR1234G',
    typeOfEntity: 'Public Limited Company',
    dateOfIncorporation: '08-May-1973',
    listingStatus: 'Listed',
    dateOfLastAgm: '28-Aug-2023',
    broadIndustryCategory: 'Conglomerate',
    industry: 'Diversified',
    segments: 'Oil & Gas, Retail, Telecom'
  },
  directors: [
  {
    name: 'Mukesh Ambani',
    din: '00001695',
    designation: 'Managing Director',
    designationDate: '01-Apr-1977',
    originalDate: '01-Apr-1977',
    cessationDate: null
  }],

  charges: [
  {
    id: '20012345',
    date: '15-May-2020',
    holder: 'State Bank of India',
    amount: '₹ 15000,00,00,000',
    status: 'Open'
  }]

},
{
  id: 'c4',
  name: 'Infosys Limited',
  status: 'Active',
  about: {
    registeredAddress:
    'Electronics City, Hosur Road, Bangalore, Karnataka 560100',
    businessAddress:
    'Electronics City, Hosur Road, Bangalore, Karnataka 560100',
    website: 'www.infosys.com',
    email: 'investors@infosys.com',
    phone: '+91-80-2852-0261',
    lei: '335800INFO1234567890',
    authorisedCapital: '₹ 2400,00,00,000',
    paidUpCapital: '₹ 2069,00,00,000',
    sumOfCharges: '₹ 0',
    companyStatus: 'Active',
    activeCompliance: 'Compliant',
    aboutCorporate:
    'Infosys is a global leader in next-generation digital services and consulting.',
    cin: 'L85110KA1981PLC013115',
    pan: 'AAACI1234H',
    typeOfEntity: 'Public Limited Company',
    dateOfIncorporation: '02-Jul-1981',
    listingStatus: 'Listed',
    dateOfLastAgm: '28-Jun-2023',
    broadIndustryCategory: 'Information Technology',
    industry: 'IT Services',
    segments: 'Consulting, Software Development'
  },
  directors: [
  {
    name: 'Salil Parekh',
    din: '01876159',
    designation: 'Managing Director',
    designationDate: '02-Jan-2018',
    originalDate: '02-Jan-2018',
    cessationDate: null
  }],

  charges: []
},
{
  id: 'c5',
  name: 'HDFC Bank Limited',
  status: 'Active',
  about: {
    registeredAddress:
    'HDFC Bank House, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013',
    businessAddress:
    'HDFC Bank House, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013',
    website: 'www.hdfcbank.com',
    email: 'shareholder.grievances@hdfcbank.com',
    phone: '+91-22-6652-1000',
    lei: '335800HDFC1234567890',
    authorisedCapital: '₹ 650,00,00,000',
    paidUpCapital: '₹ 554,00,00,000',
    sumOfCharges: '₹ 120000,00,00,000',
    companyStatus: 'Active',
    activeCompliance: 'Compliant',
    aboutCorporate:
    "HDFC Bank is one of India's leading private banks and was among the first to receive approval from the Reserve Bank of India (RBI) to set up a private sector bank in 1994.",
    cin: 'L65920MH1994PLC080618',
    pan: 'AAACH1234J',
    typeOfEntity: 'Public Limited Company',
    dateOfIncorporation: '30-Aug-1994',
    listingStatus: 'Listed',
    dateOfLastAgm: '11-Aug-2023',
    broadIndustryCategory: 'Financial Services',
    industry: 'Banking',
    segments: 'Retail Banking, Wholesale Banking'
  },
  directors: [
  {
    name: 'Sashidhar Jagdishan',
    din: '08614396',
    designation: 'Managing Director',
    designationDate: '27-Oct-2020',
    originalDate: '27-Oct-2020',
    cessationDate: null
  }],

  charges: [
  {
    id: '30012345',
    date: '10-Oct-2021',
    holder: 'Reserve Bank of India',
    amount: '₹ 50000,00,00,000',
    status: 'Open'
  }]

}];