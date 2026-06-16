"""
schema.py — Full Strawberry GraphQL Schema
• All 37 sheet types
• Company as the central hub with lazy sub-field resolvers
• Dual-entry: company(cin) → traverse everything  OR  query any domain directly
"""
from __future__ import annotations
import datetime
import strawberry
from typing import List, Optional

import data_loader as dl
from utils import s, f, i, b, to_date, to_datetime


# ══════════════════════════════════════════════════════════════════════════════
#  SHARED INPUT TYPES
# ══════════════════════════════════════════════════════════════════════════════

@strawberry.input
class PaginationInput:
    page: int = 0
    page_size: int = 20


# ══════════════════════════════════════════════════════════════════════════════
#  DOMAIN: IDENTITY & REGISTRATION
# ══════════════════════════════════════════════════════════════════════════════

@strawberry.type
class LEI:
    document_date: Optional[datetime.date]
    country: Optional[str]
    legal_name: Optional[str]
    lei_code: Optional[str]
    entity_status: Optional[str]
    registration_status: Optional[str]
    registered_at: Optional[str]
    registration_authority_entity_id: Optional[str]
    entity_category: Optional[str]
    entity_legal_form_code: Optional[str]
    entity_created_at: Optional[datetime.date]
    validated_at: Optional[datetime.date]
    validated_as: Optional[str]
    initial_registration: Optional[datetime.date]
    last_update: Optional[datetime.date]
    next_renewal_date: Optional[datetime.date]
    managing_lou: Optional[str]
    validation_sources: Optional[str]
    legal_address: Optional[str]
    legal_postal_code: Optional[str]
    legal_city: Optional[str]
    legal_region_code: Optional[str]
    legal_country: Optional[str]
    hq_address: Optional[str]
    hq_postal_code: Optional[str]
    hq_city: Optional[str]
    hq_region_code: Optional[str]
    hq_country: Optional[str]
    direct_parent: Optional[str]
    ultimate_parent: Optional[str]


def _make_lei(d: dict) -> LEI:
    return LEI(
        document_date=to_date(d.get("document_date")),
        country=s(d.get("country")),
        legal_name=s(d.get("legal_name")),
        lei_code=s(d.get("lei_code")),
        entity_status=s(d.get("entity_status")),
        registration_status=s(d.get("registration_status")),
        registered_at=s(d.get("detail_data.Company data.Registered at")),
        registration_authority_entity_id=s(d.get("detail_data.Company data.Registration authority entity ID")),
        entity_category=s(d.get("detail_data.Company data.Entity category")),
        entity_legal_form_code=s(d.get("detail_data.Company data.Entity legal form code")),
        entity_created_at=to_date(d.get("detail_data.Company data.Entity created at")),
        validated_at=to_date(d.get("detail_data.Company data.Validated At")),
        validated_as=s(d.get("detail_data.Company data.Validated As")),
        initial_registration=to_date(d.get("detail_data.LEI registration details.Initial registration")),
        last_update=to_date(d.get("detail_data.LEI registration details.Last update")),
        next_renewal_date=to_date(d.get("detail_data.LEI registration details.Next renewal date")),
        managing_lou=s(d.get("detail_data.LEI registration details.Managing LOU")),
        validation_sources=s(d.get("detail_data.LEI registration details.Validation sources")),
        legal_address=s(d.get("detail_data.Legal address.Legal address")),
        legal_postal_code=s(d.get("detail_data.Legal address.Postal code")),
        legal_city=s(d.get("detail_data.Legal address.City")),
        legal_region_code=s(d.get("detail_data.Legal address.Region code")),
        legal_country=s(d.get("detail_data.Legal address.Country")),
        hq_address=s(d.get("detail_data.Headquarters address.Headquarters address")),
        hq_postal_code=s(d.get("detail_data.Headquarters address.Postal code")),
        hq_city=s(d.get("detail_data.Headquarters address.City")),
        hq_region_code=s(d.get("detail_data.Headquarters address.Region code")),
        hq_country=s(d.get("detail_data.Headquarters address.Country")),
        direct_parent=s(d.get("detail_data.Related companies.Parents.Direct parent")),
        ultimate_parent=s(d.get("detail_data.Related companies.Parents.Ultimate parent")),
    )


@strawberry.type
class GSTHSNItem:
    hsn: Optional[str]
    description: Optional[str]


@strawberry.type
class GSTReturnFiling:
    fy: Optional[str]
    tax_period: Optional[str]
    mode_of_filing: Optional[str]
    date_of_filing: Optional[str]
    return_type: Optional[str]
    status: Optional[str]


@strawberry.type
class GSTReturnFrequency:
    fy: Optional[str]
    quarter: Optional[str]
    preference: Optional[str]


@strawberry.type
class GST:
    document_date: Optional[datetime.date]
    gstin: Optional[str]
    gstin_status: Optional[str]
    legal_name: Optional[str]
    trade_name: Optional[str]
    registration_date: Optional[datetime.date]
    company_type: Optional[str]
    taxpayer_type: Optional[str]
    jurisdiction_state: Optional[str]
    jurisdiction_center: Optional[str]
    business_address: Optional[str]
    aadhaar_auth: Optional[str]
    ekyc_verified: Optional[str]
    business_core_activity_code: Optional[str]
    business_nature_activities: Optional[List[str]]
    dealing_services: Optional[List[GSTHSNItem]]
    dealing_goods: Optional[List[GSTHSNItem]]
    return_filing_details: Optional[List[GSTReturnFiling]]
    return_frequency_details: Optional[List[GSTReturnFrequency]]


def _make_gst(d: dict) -> GST:
    def _hsn_list(prefix: str) -> List[GSTHSNItem]:
        items = []
        for idx in range(5):
            hsn = s(d.get(f"{prefix}[{idx}].hsn"))
            desc = s(d.get(f"{prefix}[{idx}].description"))
            if hsn or desc:
                items.append(GSTHSNItem(hsn=hsn, description=desc))
        return items

    def _activities() -> List[str]:
        items = []
        for idx in range(11):
            v = s(d.get(f"business_nature_activities[{idx}]"))
            if v:
                items.append(v)
        return items

    def _return_filings() -> List[GSTReturnFiling]:
        items = []
        for idx in range(4):
            fy = s(d.get(f"return_filing_details[{idx}].fy"))
            if fy:
                items.append(GSTReturnFiling(
                    fy=fy,
                    tax_period=s(d.get(f"return_filing_details[{idx}].taxp")),
                    mode_of_filing=s(d.get(f"return_filing_details[{idx}].mof")),
                    date_of_filing=s(d.get(f"return_filing_details[{idx}].dof")),
                    return_type=s(d.get(f"return_filing_details[{idx}].rtntype")),
                    status=s(d.get(f"return_filing_details[{idx}].status")),
                ))
        return items

    def _return_freq() -> List[GSTReturnFrequency]:
        items = []
        for idx in range(4):
            fy = s(d.get(f"return_frequency_details[{idx}].fy"))
            if fy:
                items.append(GSTReturnFrequency(
                    fy=fy,
                    quarter=s(d.get(f"return_frequency_details[{idx}].qtr")),
                    preference=s(d.get(f"return_frequency_details[{idx}].pref")),
                ))
        return items

    return GST(
        document_date=to_date(d.get("document_date")),
        gstin=s(d.get("gstin")),
        gstin_status=s(d.get("gstin_status")),
        legal_name=s(d.get("legal_name")),
        trade_name=s(d.get("trade_name")),
        registration_date=to_date(d.get("registration_date")),
        company_type=s(d.get("company_type")),
        taxpayer_type=s(d.get("taxpayer_type")),
        jurisdiction_state=s(d.get("jurisdiction_state")),
        jurisdiction_center=s(d.get("jurisdiction_center")),
        business_address=s(d.get("business_address")),
        aadhaar_auth=s(d.get("aadhaar_auth")),
        ekyc_verified=s(d.get("ekyc_verified")),
        business_core_activity_code=s(d.get("business_core_activity_code")),
        business_nature_activities=_activities(),
        dealing_services=_hsn_list("dealing_services"),
        dealing_goods=_hsn_list("dealing_goods"),
        return_filing_details=_return_filings(),
        return_frequency_details=_return_freq(),
    )


@strawberry.type
class BusinessActivity:
    cin: Optional[str]
    company: Optional[str]
    main_activity_group_code: Optional[str]
    description_of_main_activity_group: Optional[str]
    business_activity_code: Optional[str]
    description_of_business_activity: Optional[str]
    turnover_percentage: Optional[float]
    start_date: Optional[datetime.date]
    end_date: Optional[datetime.date]
    year: Optional[int]
    date_fetched: Optional[datetime.date]


def _make_business_activity(d: dict) -> BusinessActivity:
    return BusinessActivity(
        cin=s(d.get("CIN")),
        company=s(d.get("Company")),
        main_activity_group_code=s(d.get("MainActivityGroupCode")),
        description_of_main_activity_group=s(d.get("DescriptionOfMainActivityGroup")),
        business_activity_code=s(d.get("BusinessActivityCode")),
        description_of_business_activity=s(d.get("DescriptionOfBusinessActivity")),
        turnover_percentage=f(d.get("TurnoverPercentage")),
        start_date=to_date(d.get("StartDate")),
        end_date=to_date(d.get("EndDate")),
        year=i(d.get("Year")),
        date_fetched=to_date(d.get("DateFetched")),
    )


# ══════════════════════════════════════════════════════════════════════════════
#  DOMAIN: PEOPLE
# ══════════════════════════════════════════════════════════════════════════════

@strawberry.type
class Director:
    din: Optional[str]
    pan: Optional[str]
    name: Optional[str]
    designation: Optional[str]
    current_designation_date: Optional[datetime.date]
    cin: Optional[str]
    company_name: Optional[str]
    person_type: Optional[str]
    signatory_association_status: Optional[str]
    cessation_date: Optional[datetime.date]


def _make_director(d: dict) -> Director:
    return Director(
        din=s(d.get("DIN")),
        pan=s(d.get("PAN")),
        name=s(d.get("Name")),
        designation=s(d.get("Designation")),
        current_designation_date=to_date(d.get("currentDesignationDate")),
        cin=s(d.get("CIN")),
        company_name=s(d.get("CompanyName")),
        person_type=s(d.get("PersonType")),
        signatory_association_status=s(d.get("SignatoryAssociationStatus")),
        cessation_date=to_date(d.get("CessationDate")),
    )


@strawberry.type
class DisqualifiedDirector:
    cin: Optional[str]
    pan: Optional[str]
    company_name: Optional[str]
    deb_date: Optional[datetime.date]
    din: Optional[str]
    from_date: Optional[datetime.date]
    to_date: Optional[datetime.date]


def _make_disq_director(d: dict) -> DisqualifiedDirector:
    return DisqualifiedDirector(
        cin=s(d.get("CINNO")),
        pan=s(d.get("PANNo")),
        company_name=s(d.get("Company_Name")),
        deb_date=to_date(d.get("DebDate")),
        din=s(d.get("DIN")),
        from_date=to_date(d.get("FromDate")),
        to_date=to_date(d.get("ToDate")),
    )


@strawberry.type
class WilfulDefaulter:
    reporting_cycle: Optional[str]
    member_name: Optional[str]
    member_branch: Optional[str]
    state: Optional[str]
    borrower_name: Optional[str]
    borrower_pan: Optional[str]
    borrower_address: Optional[str]
    outstanding_amount_in_lakhs: Optional[float]
    director_promoter_name: Optional[str]
    director_promoter_din: Optional[str]
    director_promoter_pan: Optional[str]
    guarantor_name: Optional[str]
    guarantor_cin: Optional[str]
    guarantor_pan: Optional[str]
    search_type: Optional[str]
    date_fetched: Optional[datetime.date]


def _make_wilful_defaulter(d: dict) -> WilfulDefaulter:
    return WilfulDefaulter(
        reporting_cycle=s(d.get("Reporting_Cycle")),
        member_name=s(d.get("Member_Name")),
        member_branch=s(d.get("Member_Branch")),
        state=s(d.get("State")),
        borrower_name=s(d.get("Borrower_Name")),
        borrower_pan=s(d.get("Borrower_PAN")),
        borrower_address=s(d.get("Borrower_Address")),
        outstanding_amount_in_lakhs=f(d.get("Outstanding_Amount_in_Lakhs")),
        director_promoter_name=s(d.get("Director_Promoter_Name")),
        director_promoter_din=s(d.get("Director_Promoter_DIN")),
        director_promoter_pan=s(d.get("Director_Promoter_PAN")),
        guarantor_name=s(d.get("Guarantor_Name")),
        guarantor_cin=s(d.get("Guarantor_CIN")),
        guarantor_pan=s(d.get("Guarantor_PAN")),
        search_type=s(d.get("Search_Type")),
        date_fetched=to_date(d.get("DateFetched")),
    )


# ══════════════════════════════════════════════════════════════════════════════
#  DOMAIN: FINANCIALS
# ══════════════════════════════════════════════════════════════════════════════

@strawberry.type
class Financial:
    title: Optional[str]
    amount: Optional[float]
    reference: Optional[str]
    year: Optional[int]
    start_date: Optional[datetime.date]
    end_date: Optional[datetime.date]
    company: Optional[str]
    cin: Optional[str]
    date_fetched: Optional[datetime.date]
    file_name: Optional[str]
    date_of_file: Optional[datetime.date]
    company_alt_key: Optional[int]
    format: Optional[str]
    unit: Optional[str]


def _make_financial(d: dict) -> Financial:
    return Financial(
        title=s(d.get("Title")),
        amount=f(d.get("Amount")),
        reference=s(d.get("Reference")),
        year=i(d.get("Year")),
        start_date=to_date(d.get("StartDate")),
        end_date=to_date(d.get("EndDate")),
        company=s(d.get("Company")),
        cin=s(d.get("CIN")),
        date_fetched=to_date(d.get("DateFetched")),
        file_name=s(d.get("FileName")),
        date_of_file=to_date(d.get("DateOfFile")),
        company_alt_key=i(d.get("CompanyAltKey")),
        format=s(d.get("Format")),
        unit=s(d.get("Unit")),
    )


@strawberry.type
class CashflowItem:
    title: Optional[str]
    amount: Optional[float]
    reference: Optional[str]
    unit: Optional[str]
    format: Optional[str]
    start_date: Optional[datetime.date]
    end_date: Optional[datetime.date]
    year: Optional[int]
    cin: Optional[str]
    company: Optional[str]
    company_alt_key: Optional[int]
    file_name: Optional[str]
    date_of_file: Optional[datetime.date]
    date_fetched: Optional[datetime.date]
    nature_of_report: Optional[str]


def _make_cashflow(d: dict) -> CashflowItem:
    return CashflowItem(
        title=s(d.get("Title")),
        amount=f(d.get("Amount")),
        reference=s(d.get("Reference")),
        unit=s(d.get("Unit")),
        format=s(d.get("Format")),
        start_date=to_date(d.get("StartDate")),
        end_date=to_date(d.get("EndDate")),
        year=i(d.get("Year")),
        cin=s(d.get("CIN")),
        company=s(d.get("Company")),
        company_alt_key=i(d.get("CompanyAltKey")),
        file_name=s(d.get("FileName")),
        date_of_file=to_date(d.get("DateOfFile")),
        date_fetched=to_date(d.get("DateFetched")),
        nature_of_report=s(d.get("NatureOfReport")),
    )


@strawberry.type
class UnbilledRevenue:
    amount: Optional[float]
    reference: Optional[str]
    decimals: Optional[int]
    unit: Optional[str]
    title: Optional[str]
    year: Optional[int]
    company: Optional[str]
    cin: Optional[str]
    date_fetched: Optional[datetime.date]
    file_name: Optional[str]
    company_alt_key: Optional[int]
    start_date: Optional[datetime.date]
    end_date: Optional[datetime.date]


def _make_unbilled_revenue(d: dict) -> UnbilledRevenue:
    return UnbilledRevenue(
        amount=f(d.get("Amount")), reference=s(d.get("Reference")),
        decimals=i(d.get("Decimals")), unit=s(d.get("Unit")),
        title=s(d.get("Title")), year=i(d.get("Year")),
        company=s(d.get("Company")), cin=s(d.get("CIN")),
        date_fetched=to_date(d.get("DateFetched")), file_name=s(d.get("FileName")),
        company_alt_key=i(d.get("CompanyAltKey")),
        start_date=to_date(d.get("StartDate")), end_date=to_date(d.get("EndDate")),
    )


@strawberry.type
class ClaimNotAcknowledged:
    amount: Optional[float]
    reference: Optional[str]
    decimals: Optional[int]
    unit: Optional[str]
    title: Optional[str]
    year: Optional[int]
    company: Optional[str]
    cin: Optional[str]
    date_fetched: Optional[datetime.date]
    file_name: Optional[str]
    company_alt_key: Optional[int]
    start_date: Optional[datetime.date]
    end_date: Optional[datetime.date]


def _make_claim(d: dict) -> ClaimNotAcknowledged:
    return ClaimNotAcknowledged(
        amount=f(d.get("Amount")), reference=s(d.get("Reference")),
        decimals=i(d.get("Decimals")), unit=s(d.get("Unit")),
        title=s(d.get("Title")), year=i(d.get("Year")),
        company=s(d.get("Company")), cin=s(d.get("CIN")),
        date_fetched=to_date(d.get("DateFetched")), file_name=s(d.get("FileName")),
        company_alt_key=i(d.get("CompanyAltKey")),
        start_date=to_date(d.get("StartDate")), end_date=to_date(d.get("EndDate")),
    )


@strawberry.type
class ShareholdingRecord:
    cin: Optional[str]
    category: Optional[str]
    company: Optional[str]
    date_fetched: Optional[datetime.date]
    equity_no_of_shares: Optional[float]
    equity_percentage: Optional[float]
    file_name: Optional[str]
    preference_no_of_shares: Optional[float]
    preference_percentage: Optional[float]
    type: Optional[str]
    year: Optional[int]
    start_date: Optional[datetime.date]
    end_date: Optional[datetime.date]


def _make_shareholding_record(d: dict) -> ShareholdingRecord:
    return ShareholdingRecord(
        cin=s(d.get("CIN")), category=s(d.get("Category")),
        company=s(d.get("Company")), date_fetched=to_date(d.get("DateFetched")),
        equity_no_of_shares=f(d.get("Equity-No of Shares")),
        equity_percentage=f(d.get("Equity-Percentage")),
        file_name=s(d.get("FileName")),
        preference_no_of_shares=f(d.get("Preference-No of Shares")),
        preference_percentage=f(d.get("Preference-Percentage")),
        type=s(d.get("Type")), year=i(d.get("Year")),
        start_date=to_date(d.get("StartDate")), end_date=to_date(d.get("EndDate")),
    )


@strawberry.type
class NoncurrentInvestment:
    affiliate_name: Optional[str]
    noncurrent_investments: Optional[float]
    type_of_noncurrent_investments: Optional[str]
    class_of_noncurrent_investments: Optional[str]
    nature_of_noncurrent_investments: Optional[str]
    number_of_shares: Optional[float]
    type: Optional[str]
    start_date: Optional[datetime.date]
    end_date: Optional[datetime.date]
    year: Optional[int]
    cin: Optional[str]
    company: Optional[str]
    nature_of_report: Optional[str]
    affiliate_cin: Optional[str]
    affiliate_incorporation_date: Optional[datetime.date]
    cleaned_affiliate_name: Optional[str]
    date_fetched: Optional[datetime.date]


def _make_noncurrent_investment(d: dict) -> NoncurrentInvestment:
    return NoncurrentInvestment(
        affiliate_name=s(d.get("AffiliateName")),
        noncurrent_investments=f(d.get("NoncurrentInvestments")),
        type_of_noncurrent_investments=s(d.get("TypeOfNoncurrentInvestments")),
        class_of_noncurrent_investments=s(d.get("ClassOfNoncurrentInvestments")),
        nature_of_noncurrent_investments=s(d.get("NatureOfNoncurrentInvestments")),
        number_of_shares=f(d.get("NumberOfShares")),
        type=s(d.get("Type")),
        start_date=to_date(d.get("StartDate")), end_date=to_date(d.get("EndDate")),
        year=i(d.get("Year")), cin=s(d.get("CIN")), company=s(d.get("Company")),
        nature_of_report=s(d.get("NatureOfReport")),
        affiliate_cin=s(d.get("AffiliateCIN")),
        affiliate_incorporation_date=to_date(d.get("AffiliateIncorporationDate")),
        cleaned_affiliate_name=s(d.get("CleanedAffiliateName")),
        date_fetched=to_date(d.get("DateFetched")),
    )


@strawberry.type
class CurrentInvestment:
    affiliate_name: Optional[str]
    current_investments: Optional[float]
    type_of_current_investments: Optional[str]
    class_of_current_investments: Optional[str]
    nature_of_current_investments: Optional[str]
    number_of_shares: Optional[float]
    start_date: Optional[datetime.date]
    end_date: Optional[datetime.date]
    year: Optional[int]
    cin: Optional[str]
    company: Optional[str]
    nature_of_report: Optional[str]
    date_fetched: Optional[datetime.date]


def _make_current_investment(d: dict) -> CurrentInvestment:
    return CurrentInvestment(
        affiliate_name=s(d.get("AffiliateName")),
        current_investments=f(d.get("CurrentInvestments")),
        type_of_current_investments=s(d.get("TypeOfCurrentInvestments")),
        class_of_current_investments=s(d.get("ClassOfCurrentInvestments")),
        nature_of_current_investments=s(d.get("NatureOfCurrentInvestments")),
        number_of_shares=f(d.get("NumberOfShares")),
        start_date=to_date(d.get("StartDate")), end_date=to_date(d.get("EndDate")),
        year=i(d.get("Year")), cin=s(d.get("CIN")), company=s(d.get("Company")),
        nature_of_report=s(d.get("NatureOfReport")),
        date_fetched=to_date(d.get("DateFetched")),
    )


@strawberry.type
class OtherAssetLiability:
    title: Optional[str]
    description: Optional[str]
    amount: Optional[float]
    reference: Optional[str]
    start_date: Optional[datetime.date]
    end_date: Optional[datetime.date]
    year: Optional[int]
    cin: Optional[str]
    company: Optional[str]
    nature_of_report: Optional[str]
    date_fetched: Optional[datetime.date]


def _make_other_al(d: dict) -> OtherAssetLiability:
    return OtherAssetLiability(
        title=s(d.get("Title")), description=s(d.get("Description")),
        amount=f(d.get("Amount")), reference=s(d.get("Reference")),
        start_date=to_date(d.get("StartDate")), end_date=to_date(d.get("EndDate")),
        year=i(d.get("Year")), cin=s(d.get("CIN")), company=s(d.get("Company")),
        nature_of_report=s(d.get("NatureOfReport")),
        date_fetched=to_date(d.get("DateFetched")),
    )


# ══════════════════════════════════════════════════════════════════════════════
#  DOMAIN: AUDIT
# ══════════════════════════════════════════════════════════════════════════════

@strawberry.type
class AuditReport:
    auditors_report: Optional[str]
    year: Optional[int]
    company: Optional[str]
    cin: Optional[str]
    reference: Optional[str]
    date_fetched: Optional[datetime.date]
    file_name: Optional[str]
    company_alt_key: Optional[int]
    start_date: Optional[datetime.date]
    end_date: Optional[datetime.date]


def _make_audit_report(d: dict) -> AuditReport:
    return AuditReport(
        auditors_report=s(d.get("AuditorsReport")), year=i(d.get("Year")),
        company=s(d.get("Company")), cin=s(d.get("CIN")),
        reference=s(d.get("Reference")), date_fetched=to_date(d.get("DateFetched")),
        file_name=s(d.get("FileName")), company_alt_key=i(d.get("CompanyAltKey")),
        start_date=to_date(d.get("StartDate")), end_date=to_date(d.get("EndDate")),
    )


@strawberry.type
class AuditorDetail:
    member_name: Optional[str]
    form_name: Optional[str]
    category: Optional[str]
    membership_number: Optional[str]
    auditor_name: Optional[str]
    firm_no: Optional[str]
    address: Optional[str]
    year: Optional[int]
    start_date: Optional[datetime.date]
    end_date: Optional[datetime.date]
    cin: Optional[str]
    company: Optional[str]


def _make_auditor_detail(d: dict) -> AuditorDetail:
    return AuditorDetail(
        member_name=s(d.get("member_name")), form_name=s(d.get("form_name")),
        category=s(d.get("category")), membership_number=s(d.get("membership_number")),
        auditor_name=s(d.get("auditor_name")), firm_no=s(d.get("firm_no")),
        address=s(d.get("address")), year=i(d.get("year")),
        start_date=to_date(d.get("start_date_key")), end_date=to_date(d.get("end_date_key")),
        cin=s(d.get("cin")), company=s(d.get("company")),
    )


@strawberry.type
class ADTDetail:
    name_of_auditor: Optional[str]
    firm_no: Optional[str]
    auditor_pan: Optional[str]
    appointment_date: Optional[datetime.date]
    resignation_date: Optional[datetime.date]
    reason: Optional[str]
    address: Optional[str]
    cin: Optional[str]
    company: Optional[str]


def _make_adt_detail(d: dict) -> ADTDetail:
    return ADTDetail(
        name_of_auditor=s(d.get("name_of_auditor")), firm_no=s(d.get("firm_no")),
        auditor_pan=s(d.get("auditor_pan")),
        appointment_date=to_date(d.get("appointment_date_key")),
        resignation_date=to_date(d.get("resignation_date_key")),
        reason=s(d.get("reason")), address=s(d.get("address")),
        cin=s(d.get("cin")), company=s(d.get("company")),
    )


# ══════════════════════════════════════════════════════════════════════════════
#  DOMAIN: CAPITAL MARKETS
# ══════════════════════════════════════════════════════════════════════════════

@strawberry.type
class SharePrice:
    date: Optional[datetime.date]
    open: Optional[float]
    high: Optional[float]
    low: Optional[float]
    close: Optional[float]
    adj_close: Optional[float]
    volume: Optional[float]
    symbol: Optional[str]
    company_name: Optional[str]
    exchange: Optional[str]


def _make_share_price(d: dict) -> SharePrice:
    return SharePrice(
        date=to_date(d.get("date")), open=f(d.get("open")),
        high=f(d.get("high")), low=f(d.get("low")), close=f(d.get("close")),
        adj_close=f(d.get("adj_close")), volume=f(d.get("volume")),
        symbol=s(d.get("symbol")), company_name=s(d.get("Company_Name")),
        exchange=s(d.get("Exchange")),
    )


@strawberry.type
class BSEMarketCap:
    scrip_code: Optional[str]
    scrip_id: Optional[str]
    document_date: Optional[datetime.date]
    open: Optional[float]
    high: Optional[float]
    low: Optional[float]
    previous_close: Optional[float]
    last_traded_price: Optional[float]
    vwap: Optional[float]
    free_float_market_cap: Optional[float]
    total_market_cap: Optional[float]
    turnover: Optional[float]
    unit: Optional[str]
    eps: Optional[float]
    cash_eps: Optional[float]
    pe_ratio: Optional[float]
    pb_ratio: Optional[float]
    return_on_equity: Optional[float]
    fifty_two_week_high: Optional[float]
    fifty_two_week_low: Optional[float]


def _make_bse_mktcap(d: dict) -> BSEMarketCap:
    return BSEMarketCap(
        scrip_code=s(d.get("scrip_code")), scrip_id=s(d.get("scrip_id")),
        document_date=to_date(d.get("document_date")),
        open=f(d.get("open")), high=f(d.get("high")), low=f(d.get("low")),
        previous_close=f(d.get("previous_close")),
        last_traded_price=f(d.get("last_traded_price")),
        vwap=f(d.get("volume_weighted_average_price")),
        free_float_market_cap=f(d.get("free_float_market_cap")),
        total_market_cap=f(d.get("total_market_cap")),
        turnover=f(d.get("turnover")), unit=s(d.get("unit")),
        eps=f(d.get("earnings_per_share")), cash_eps=f(d.get("cash_earnings_per_share")),
        pe_ratio=f(d.get("price_to_earnings_ratio")),
        pb_ratio=f(d.get("price_to_book_ratio")),
        return_on_equity=f(d.get("return_on_equity")),
        fifty_two_week_high=f(d.get("fifty_two_week_highest_price")),
        fifty_two_week_low=f(d.get("fifty_two_week_lowest_price")),
    )


@strawberry.type
class NSEMarketCap:
    symbol: Optional[str]
    traded_date: Optional[datetime.date]
    traded_volume: Optional[float]
    traded_value: Optional[float]
    total_market_cap: Optional[float]
    free_float_market_cap: Optional[float]
    unit: Optional[str]
    impact_cost: Optional[float]
    deliverable_quantity: Optional[float]
    delivery_to_traded_pct: Optional[float]
    var_margin: Optional[float]
    applicable_margin_rate: Optional[float]


def _make_nse_mktcap(d: dict) -> NSEMarketCap:
    return NSEMarketCap(
        symbol=s(d.get("symbol")), traded_date=to_date(d.get("traded_date")),
        traded_volume=f(d.get("traded_volume")), traded_value=f(d.get("traded_value")),
        total_market_cap=f(d.get("total_market_cap")),
        free_float_market_cap=f(d.get("free_float_market_cap")),
        unit=s(d.get("unit")), impact_cost=f(d.get("impact_cost")),
        deliverable_quantity=f(d.get("deliverable_quantity")),
        delivery_to_traded_pct=f(d.get("delivery_to_traded_percentage")),
        var_margin=f(d.get("var_margin")),
        applicable_margin_rate=f(d.get("applicable_margin_rate")),
    )


@strawberry.type
class BSEShareholding:
    scrip_code: Optional[str]
    scrip_id: Optional[str]
    company: Optional[str]
    financial_year: Optional[str]
    quarter: Optional[str]
    quarter_name: Optional[str]
    filing_date: Optional[datetime.date]
    share_holder_category: Optional[str]
    share_holder_no: Optional[int]
    full_paid_shares_equity_no: Optional[float]
    total_shares: Optional[float]
    share_holding_pct: Optional[float]
    no_of_voting_rights: Optional[float]
    voting_rights_pct: Optional[float]
    dematerialized_shares_held: Optional[float]


def _make_bse_sh(d: dict) -> BSEShareholding:
    return BSEShareholding(
        scrip_code=s(d.get("scrip_code")), scrip_id=s(d.get("scrip_id")),
        company=s(d.get("company")), financial_year=s(d.get("financial_year")),
        quarter=s(d.get("quarter")), quarter_name=s(d.get("quarter_name")),
        filing_date=to_date(d.get("filing_date_key")),
        share_holder_category=s(d.get("share_holder_category")),
        share_holder_no=i(d.get("share_holder_no")),
        full_paid_shares_equity_no=f(d.get("full_paid_shares_equity_no")),
        total_shares=f(d.get("total_shares")),
        share_holding_pct=f(d.get("share_holding_percent")),
        no_of_voting_rights=f(d.get("no_of_voting_rights")),
        voting_rights_pct=f(d.get("voting_rights_percent")),
        dematerialized_shares_held=f(d.get("dematerialized_shares_held")),
    )


@strawberry.type
class NSEShareholding:
    symbol: Optional[str]
    company: Optional[str]
    shareholding_date: Optional[datetime.date]
    promoter_group_pct: Optional[float]
    public_pct: Optional[float]
    shareholder_category: Optional[str]
    num_shareholders: Optional[int]
    total_num_shares_held: Optional[float]
    total_num_shares_held_pct: Optional[float]
    num_shares_pledged: Optional[float]
    num_shares_pledged_pct: Optional[float]
    num_shares_dematerialized: Optional[float]


def _make_nse_sh(d: dict) -> NSEShareholding:
    return NSEShareholding(
        symbol=s(d.get("symbol")), company=s(d.get("company")),
        shareholding_date=to_date(d.get("nse_shareholding_date_key")),
        promoter_group_pct=f(d.get("promoter_group_pct")),
        public_pct=f(d.get("public_pct")),
        shareholder_category=s(d.get("shareholder_category")),
        num_shareholders=i(d.get("num_shareholders")),
        total_num_shares_held=f(d.get("num_fully_paid_up_eq_shares_held")),
        total_num_shares_held_pct=f(d.get("total_num_shares_held_pct")),
        num_shares_pledged=f(d.get("num_shares_pledged")),
        num_shares_pledged_pct=f(d.get("num_shares_pledged_pct")),
        num_shares_dematerialized=f(d.get("num_shares_held_in_dematerialized_form")),
    )


@strawberry.type
class NSDLInstrument:
    issuer_name: Optional[str]
    issuer_isin: Optional[str]
    allotment_date: Optional[datetime.date]
    instrument_type: Optional[str]
    face_value: Optional[float]
    issue_size_cr: Optional[float]
    maturity_date: Optional[datetime.date]
    coupon_rate_pct: Optional[float]
    coupon_type: Optional[str]
    interest_payment_frequency: Optional[str]
    credit_rating: Optional[str]
    status: Optional[str]
    credit_rating_agency_name: Optional[str]


def _make_nsdl(d: dict) -> NSDLInstrument:
    return NSDLInstrument(
        issuer_name=s(d.get("issuer_name")), issuer_isin=s(d.get("issuer_isin")),
        allotment_date=to_date(d.get("allotment_date_key")),
        instrument_type=s(d.get("instrument_type")),
        face_value=f(d.get("face_value_in_rs")),
        issue_size_cr=f(d.get("issue_size_in_cr")),
        maturity_date=to_date(d.get("maturity_date_key")),
        coupon_rate_pct=f(d.get("coupon_rate_pct")),
        coupon_type=s(d.get("coupon_type")),
        interest_payment_frequency=s(d.get("interest_payment_frequency")),
        credit_rating=s(d.get("credit_rating")), status=s(d.get("status")),
        credit_rating_agency_name=s(d.get("credit_rating_agency_name")),
    )


@strawberry.type
class CreditRating:
    issuer: Optional[str]
    rating: Optional[str]
    rationale_date: Optional[datetime.date]
    rating_term: Optional[str]
    rating_action: Optional[str]
    instrument: Optional[str]
    cra_name: Optional[str]
    amount: Optional[float]
    link: Optional[str]
    outlook: Optional[str]
    previous_rating: Optional[str]
    previous_rationale_date: Optional[datetime.date]


def _make_credit_rating(d: dict) -> CreditRating:
    return CreditRating(
        issuer=s(d.get("issuer")), rating=s(d.get("rating")),
        rationale_date=to_date(d.get("rationale_date_key")),
        rating_term=s(d.get("rating_term")), rating_action=s(d.get("rating_action")),
        instrument=s(d.get("instrument")), cra_name=s(d.get("cra_name")),
        amount=f(d.get("amount")), link=s(d.get("link")),
        outlook=s(d.get("outlook")), previous_rating=s(d.get("previous_rating")),
        previous_rationale_date=to_date(d.get("previous_rationale_date_key")),
    )


@strawberry.type
class BSEAnnouncement:
    scrip_code: Optional[str]
    subject: Optional[str]
    details: Optional[str]
    subcategory_name: Optional[str]
    category_name: Optional[str]
    announcement_date: Optional[datetime.date]
    published_at: Optional[datetime.datetime]
    critical_news: Optional[bool]
    announcement_type: Optional[str]
    attachment_file_url: Optional[str]
    company_name: Optional[str]


def _make_bse_ann(d: dict) -> BSEAnnouncement:
    return BSEAnnouncement(
        scrip_code=s(d.get("scrip_code")), subject=s(d.get("subject")),
        details=s(d.get("details")), subcategory_name=s(d.get("subcategory_name")),
        category_name=s(d.get("category_name")),
        announcement_date=to_date(d.get("announcement_date")),
        published_at=to_datetime(d.get("published_at")),
        critical_news=b(d.get("critical_news")),
        announcement_type=s(d.get("announcement_type")),
        attachment_file_url=s(d.get("attachment_file_url")),
        company_name=s(d.get("company_name")),
    )


@strawberry.type
class NSEAnnouncement:
    company: Optional[str]
    announcement_category: Optional[str]
    symbol: Optional[str]
    subject: Optional[str]
    details: Optional[str]
    published_at: Optional[datetime.datetime]
    company_isin: Optional[str]
    attachment_file_url: Optional[str]


def _make_nse_ann(d: dict) -> NSEAnnouncement:
    return NSEAnnouncement(
        company=s(d.get("company")), announcement_category=s(d.get("announcement_category")),
        symbol=s(d.get("symbol")), subject=s(d.get("subject")),
        details=s(d.get("details")), published_at=to_datetime(d.get("published_at")),
        company_isin=s(d.get("company_isin")),
        attachment_file_url=s(d.get("attachment_file_url")),
    )


# ══════════════════════════════════════════════════════════════════════════════
#  DOMAIN: LEGAL
# ══════════════════════════════════════════════════════════════════════════════

@strawberry.type
class NCLTCase:
    company: Optional[str]
    cin: Optional[str]
    petitioner: Optional[str]
    respondent: Optional[str]
    filing_date: Optional[datetime.date]
    case_number: Optional[str]
    case_status: Optional[str]
    registered_on: Optional[datetime.date]
    next_listing_date: Optional[datetime.date]
    last_listed: Optional[datetime.date]
    petitioner_bank: Optional[str]
    bench_code: Optional[str]
    bench: Optional[str]
    pdf_link: Optional[str]
    source: Optional[str]


def _make_nclt(d: dict) -> NCLTCase:
    return NCLTCase(
        company=s(d.get("Company")), cin=s(d.get("CIN")),
        petitioner=s(d.get("Petitioner")), respondent=s(d.get("Respondent")),
        filing_date=to_date(d.get("FilingDate")), case_number=s(d.get("CaseNumber")),
        case_status=s(d.get("CaseStatus")), registered_on=to_date(d.get("RegisteredOn")),
        next_listing_date=to_date(d.get("NextListingDate")),
        last_listed=to_date(d.get("LastListed")),
        petitioner_bank=s(d.get("PetitionerBank")),
        bench_code=s(d.get("BenchCode")), bench=s(d.get("Bench")),
        pdf_link=s(d.get("pdf_link")), source=s(d.get("source")),
    )


@strawberry.type
class NCLATCase:
    bench_name: Optional[str]
    bench_code: Optional[str]
    filing_number: Optional[str]
    case_number: Optional[str]
    case_title: Optional[str]
    registration_date: Optional[datetime.date]
    status: Optional[str]
    filing_date: Optional[datetime.date]
    petitioner: Optional[str]
    respondent: Optional[str]
    first_hearing_date: Optional[datetime.date]
    last_hearing_date: Optional[datetime.date]
    next_hearing_date: Optional[datetime.date]
    case_history: Optional[str]
    order_history: Optional[str]
    company_name: Optional[str]


def _make_nclat(d: dict) -> NCLATCase:
    return NCLATCase(
        bench_name=s(d.get("bench_name")), bench_code=s(d.get("bench_code")),
        filing_number=s(d.get("filing_number")), case_number=s(d.get("case_number")),
        case_title=s(d.get("case_title")),
        registration_date=to_date(d.get("registration_date_key")),
        status=s(d.get("status")), filing_date=to_date(d.get("filing_date_key")),
        petitioner=s(d.get("petitioner")), respondent=s(d.get("respondent")),
        first_hearing_date=to_date(d.get("first_hearing_date_key")),
        last_hearing_date=to_date(d.get("last_hearing_date_key")),
        next_hearing_date=to_date(d.get("next_hearing_date_key")),
        case_history=s(d.get("case_history")), order_history=s(d.get("order_history")),
        company_name=s(d.get("company_name")),
    )


@strawberry.type
class DRTCase:
    court_name: Optional[str]
    suit_ref_no: Optional[str]
    petitioners: Optional[str]
    respondent: Optional[str]
    suit_date: Optional[datetime.date]
    suit_type: Optional[str]
    case_status: Optional[str]
    cin: Optional[str]
    next_hearing_date: Optional[datetime.date]
    judgement_date: Optional[datetime.date]
    bench_code: Optional[str]
    bench: Optional[str]
    din: Optional[str]
    link: Optional[str]
    source: Optional[str]


def _make_drt(d: dict) -> DRTCase:
    return DRTCase(
        court_name=s(d.get("CourtName")), suit_ref_no=s(d.get("SuitRefNo")),
        petitioners=s(d.get("Petitioners")), respondent=s(d.get("Respondent")),
        suit_date=to_date(d.get("SuitDate")), suit_type=s(d.get("SuitType")),
        case_status=s(d.get("CaseStatus")), cin=s(d.get("CIN")),
        next_hearing_date=to_date(d.get("NexthearingDate")),
        judgement_date=to_date(d.get("JudgementDate")),
        bench_code=s(d.get("BenchCode")), bench=s(d.get("Bench")),
        din=s(d.get("DIN")), link=s(d.get("Link")), source=s(d.get("Source")),
    )


@strawberry.type
class DRATCase:
    court_name: Optional[str]
    suit_ref_no: Optional[str]
    petitioners: Optional[str]
    respondent: Optional[str]
    suit_date: Optional[datetime.date]
    suit_type: Optional[str]
    case_status: Optional[str]
    cin: Optional[str]
    next_hearing_date: Optional[datetime.date]
    bench_code: Optional[str]
    bench: Optional[str]


def _make_drat(d: dict) -> DRATCase:
    return DRATCase(
        court_name=s(d.get("CourtName")), suit_ref_no=s(d.get("SuitRefNo")),
        petitioners=s(d.get("Petitioners")), respondent=s(d.get("Respondent")),
        suit_date=to_date(d.get("SuitDate")), suit_type=s(d.get("SuitType")),
        case_status=s(d.get("CaseStatus")), cin=s(d.get("CIN")),
        next_hearing_date=to_date(d.get("NexthearingDate")),
        bench_code=s(d.get("BenchCode")), bench=s(d.get("Bench")),
    )


@strawberry.type
class IBBICase:
    court_name: Optional[str]
    suit_ref_no: Optional[str]
    petitioners: Optional[str]
    respondent: Optional[str]
    suit_date: Optional[datetime.date]
    suit_type: Optional[str]
    case_status: Optional[str]
    cin: Optional[str]
    next_hearing_date: Optional[datetime.date]
    bench_code: Optional[str]
    bench: Optional[str]


def _make_ibbi(d: dict) -> IBBICase:
    return IBBICase(
        court_name=s(d.get("CourtName")), suit_ref_no=s(d.get("SuitRefNo")),
        petitioners=s(d.get("Petitioners")), respondent=s(d.get("Respondent")),
        suit_date=to_date(d.get("SuitDate")), suit_type=s(d.get("SuitType")),
        case_status=s(d.get("CaseStatus")), cin=s(d.get("CIN")),
        next_hearing_date=to_date(d.get("NexthearingDate")),
        bench_code=s(d.get("BenchCode")), bench=s(d.get("Bench")),
    )


# ══════════════════════════════════════════════════════════════════════════════
#  DOMAIN: COMPLIANCE / RISK
# ══════════════════════════════════════════════════════════════════════════════

@strawberry.type
class AssetCharge:
    charge_holder_name: Optional[str]
    charge_id: Optional[str]
    charge_date: Optional[datetime.date]
    charge_amount: Optional[float]
    authorisation_status: Optional[str]
    closure_date: Optional[datetime.date]
    assets_under_charge: Optional[str]
    company_name: Optional[str]
    cin: Optional[str]
    satisfaction_date: Optional[datetime.date]
    address: Optional[str]


def _make_asset_charge(d: dict) -> AssetCharge:
    return AssetCharge(
        charge_holder_name=s(d.get("ChargeHolderName")), charge_id=s(d.get("ChargeId")),
        charge_date=to_date(d.get("ChargeDt")), charge_amount=f(d.get("ChargeAmt")),
        authorisation_status=s(d.get("AuthorisationStatus")),
        closure_date=to_date(d.get("ClosureDate")),
        assets_under_charge=s(d.get("AssetsUnderCharge")),
        company_name=s(d.get("CompanyName")), cin=s(d.get("CIN")),
        satisfaction_date=to_date(d.get("SatisfactionDt")), address=s(d.get("Address")),
    )


@strawberry.type
class MCADefault:
    cin: Optional[str]
    pan: Optional[str]
    company_name: Optional[str]
    mca_default_date: Optional[datetime.date]


def _make_mca_default(d: dict) -> MCADefault:
    return MCADefault(
        cin=s(d.get("CINNO")), pan=s(d.get("PANNo")),
        company_name=s(d.get("Company_Name")),
        mca_default_date=to_date(d.get("MCA_DefaultDate")),
    )


@strawberry.type
class ShellCompany:
    cin: Optional[str]
    pan: Optional[str]
    company_name: Optional[str]
    mca_date: Optional[datetime.date]
    sebi_date: Optional[datetime.date]
    source: Optional[str]
    remove_reason: Optional[str]


def _make_shell(d: dict) -> ShellCompany:
    return ShellCompany(
        cin=s(d.get("CINNO")), pan=s(d.get("PANNo")),
        company_name=s(d.get("Company_Name")),
        mca_date=to_date(d.get("MCA_date")), sebi_date=to_date(d.get("SebiDate")),
        source=s(d.get("source")), remove_reason=s(d.get("RemoveReason")),
    )


@strawberry.type
class WatchoutInvestorOrder:
    order_details: Optional[str]


# ══════════════════════════════════════════════════════════════════════════════
#  DOMAIN: OPERATIONAL
# ══════════════════════════════════════════════════════════════════════════════

@strawberry.type
class EPFORecord:
    transaction_no: Optional[str]
    date_of_credit: Optional[datetime.date]
    amount: Optional[float]
    wage_month: Optional[str]
    no_of_employees: Optional[int]
    electronic_challan_no: Optional[str]
    establishment_name: Optional[str]
    address: Optional[str]
    office_name: Optional[str]
    establishment_code: Optional[str]


def _make_epfo(d: dict) -> EPFORecord:
    return EPFORecord(
        transaction_no=s(d.get("transaction_no")),
        date_of_credit=to_date(d.get("date_of_credit")),
        amount=f(d.get("amount")), wage_month=s(d.get("wage_month")),
        no_of_employees=i(d.get("no_of_employee")),
        electronic_challan_no=s(d.get("electronic_challan_no")),
        establishment_name=s(d.get("establishment_name")),
        address=s(d.get("address")), office_name=s(d.get("office_name")),
        establishment_code=s(d.get("establishment_code")),
    )


@strawberry.type
class NewsArticle:
    title: Optional[str]
    description: Optional[str]
    published_at: Optional[datetime.datetime]
    source: Optional[str]
    link: Optional[str]
    sentiment: Optional[str]
    sentiment_score: Optional[float]
    category: Optional[str]
    subcategory: Optional[str]
    company_names_found: Optional[str]
    sentiment_by_company: Optional[str]


def _make_news(d: dict) -> NewsArticle:
    return NewsArticle(
        title=s(d.get("title")), description=s(d.get("description")),
        published_at=to_datetime(d.get("published_at")), source=s(d.get("source")),
        link=s(d.get("link")), sentiment=s(d.get("sentiment")),
        sentiment_score=f(d.get("sentiment_score")),
        category=s(d.get("category")), subcategory=s(d.get("subcategory")),
        company_names_found=s(d.get("company_names_found")),
        sentiment_by_company=s(d.get("sentiment_by_company")),
    )


# ══════════════════════════════════════════════════════════════════════════════
#  CENTRAL HUB: COMPANY
# ══════════════════════════════════════════════════════════════════════════════

@strawberry.type
class Company:
    """
    All basic fields are set from Company Details sheet.
    Sub-entity fields are @strawberry.field methods — resolved lazily via CIN.
    """
    cin: strawberry.ID
    company: Optional[str]
    company_id: Optional[int]
    reg_street_address: Optional[str]
    reg_locality: Optional[str]
    reg_district: Optional[str]
    reg_city: Optional[str]
    reg_state: Optional[str]
    reg_postal_code: Optional[str]
    reg_country: Optional[str]
    reg_active_status: Optional[str]
    company_type: Optional[str]
    company_origin: Optional[str]
    registration_number: Optional[str]
    date_of_incorporation: Optional[datetime.date]
    email_address: Optional[str]
    whether_listed_or_not: Optional[str]
    company_category: Optional[str]
    company_subcategory: Optional[str]
    class_of_company: Optional[str]
    authorised_capital: Optional[float]
    paid_up_capital: Optional[float]
    subscribed_capital: Optional[float]
    date_of_last_agm: Optional[datetime.date]
    strike_off_date: Optional[datetime.date]
    roc_name: Optional[str]
    rd_name: Optional[str]
    rd_region: Optional[str]
    balance_sheet_date: Optional[datetime.date]

    # ── Lazy sub-field resolvers (all keyed by self.cin) ──────────────────────

    @strawberry.field
    def lei(self) -> Optional[LEI]:
        rows = dl.query_lei()
        return _make_lei(rows[0]) if rows else None

    @strawberry.field
    def directors(self) -> List[Director]:
        return [_make_director(d) for d in dl.query_directors(cin=str(self.cin))]

    @strawberry.field
    def disqualified_directors(self) -> List[DisqualifiedDirector]:
        return [_make_disq_director(d) for d in dl.query_disqualified_directors(cin=str(self.cin))]

    @strawberry.field
    def wilful_defaulters(self) -> List[WilfulDefaulter]:
        return [_make_wilful_defaulter(d) for d in dl.query_wilful_defaulters()]

    @strawberry.field
    def business_activities(self) -> List[BusinessActivity]:
        return [_make_business_activity(d) for d in dl.query_business_activities(cin=str(self.cin))]

    @strawberry.field
    def financials(self, year: Optional[int] = None, title: Optional[str] = None,
                   format: Optional[str] = None, nature_of_report: Optional[str] = None) -> List[Financial]:
        return [_make_financial(d) for d in dl.query_financials(cin=str(self.cin), year=year, title=title, fmt=format)]

    @strawberry.field
    def cashflow(self, year: Optional[int] = None, nature_of_report: Optional[str] = None) -> List[CashflowItem]:
        return [_make_cashflow(d) for d in dl.query_cashflow(cin=str(self.cin), year=year, nature_of_report=nature_of_report)]

    @strawberry.field
    def unbilled_revenue(self, year: Optional[int] = None) -> List[UnbilledRevenue]:
        return [_make_unbilled_revenue(d) for d in dl.query_unbilled_revenue(cin=str(self.cin), year=year)]

    @strawberry.field
    def claims_not_acknowledged(self, year: Optional[int] = None) -> List[ClaimNotAcknowledged]:
        return [_make_claim(d) for d in dl.query_claims(cin=str(self.cin), year=year)]

    @strawberry.field
    def shareholding_records(self, year: Optional[int] = None) -> List[ShareholdingRecord]:
        return [_make_shareholding_record(d) for d in dl.query_shareholding_records(cin=str(self.cin), year=year)]

    @strawberry.field
    def noncurrent_investments(self, year: Optional[int] = None) -> List[NoncurrentInvestment]:
        return [_make_noncurrent_investment(d) for d in dl.query_noncurrent_investments(cin=str(self.cin), year=year)]

    @strawberry.field
    def current_investments(self, year: Optional[int] = None) -> List[CurrentInvestment]:
        return [_make_current_investment(d) for d in dl.query_current_investments(cin=str(self.cin), year=year)]

    @strawberry.field
    def other_assets_liabilities(self, year: Optional[int] = None) -> List[OtherAssetLiability]:
        return [_make_other_al(d) for d in dl.query_other_assets_liabilities(cin=str(self.cin), year=year)]

    @strawberry.field
    def audit_reports(self, year: Optional[int] = None) -> List[AuditReport]:
        return [_make_audit_report(d) for d in dl.query_audit_reports(cin=str(self.cin), year=year)]

    @strawberry.field
    def auditor_details(self) -> List[AuditorDetail]:
        return [_make_auditor_detail(d) for d in dl.query_auditor_details(cin=str(self.cin))]

    @strawberry.field
    def adt_details(self) -> List[ADTDetail]:
        return [_make_adt_detail(d) for d in dl.query_adt_details(cin=str(self.cin))]

    @strawberry.field
    def asset_charges(self) -> List[AssetCharge]:
        return [_make_asset_charge(d) for d in dl.query_asset_charges(cin=str(self.cin))]

    @strawberry.field
    def mca_default(self) -> Optional[MCADefault]:
        rows = dl.query_mca_defaults(cin=str(self.cin))
        return _make_mca_default(rows[0]) if rows else None

    @strawberry.field
    def shell_company(self) -> Optional[ShellCompany]:
        rows = dl.query_shell_companies(cin=str(self.cin))
        return _make_shell(rows[0]) if rows else None

    @strawberry.field
    def nclt_cases(self) -> List[NCLTCase]:
        return [_make_nclt(d) for d in dl.query_nclt(cin=str(self.cin))]

    @strawberry.field
    def nclat_cases(self) -> List[NCLATCase]:
        return [_make_nclat(d) for d in dl.query_nclat(cin=str(self.cin))]

    @strawberry.field
    def drt_cases(self) -> List[DRTCase]:
        return [_make_drt(d) for d in dl.query_drt(cin=str(self.cin))]

    @strawberry.field
    def drat_cases(self) -> List[DRATCase]:
        return [_make_drat(d) for d in dl.query_drat(cin=str(self.cin))]

    @strawberry.field
    def ibbi_cases(self) -> List[IBBICase]:
        return [_make_ibbi(d) for d in dl.query_ibbi(cin=str(self.cin))]

    @strawberry.field
    def credit_ratings(self) -> List[CreditRating]:
        return [_make_credit_rating(d) for d in dl.query_credit_ratings(issuer=str(self.company or ""))]

    @strawberry.field
    def epfo_records(self) -> List[EPFORecord]:
        return [_make_epfo(d) for d in dl.query_epfo()]

    @strawberry.field
    def news(self) -> List[NewsArticle]:
        return [_make_news(d) for d in dl.query_news(company_name=str(self.company or ""))]


def _make_company(d: dict) -> Company:
    return Company(
        cin=s(d.get("CIN")) or "",
        company=s(d.get("company")),
        company_id=i(d.get("company_id")),
        reg_street_address=s(d.get("reg_streetAddress")),
        reg_locality=s(d.get("reg_locality")),
        reg_district=s(d.get("reg_district")),
        reg_city=s(d.get("reg_city")),
        reg_state=s(d.get("reg_state")),
        reg_postal_code=s(d.get("reg_postalCode")),
        reg_country=s(d.get("reg_country")),
        reg_active_status=s(d.get("reg_activeStatus")),
        company_type=s(d.get("companyType")),
        company_origin=s(d.get("companyOrigin")),
        registration_number=s(d.get("registrationNumber")),
        date_of_incorporation=to_date(d.get("dateOfIncorporation")),
        email_address=s(d.get("emailAddress")),
        whether_listed_or_not=s(d.get("whetherListedOrNot")),
        company_category=s(d.get("companyCategory")),
        company_subcategory=s(d.get("companySubcategory")),
        class_of_company=s(d.get("classOfCompany")),
        authorised_capital=f(d.get("authorisedCapital")),
        paid_up_capital=f(d.get("paidUpCapital")),
        subscribed_capital=f(d.get("subscribedCapital")),
        date_of_last_agm=to_date(d.get("dateOfLastAGM")),
        strike_off_date=to_date(d.get("strikeOff_amalgamated_transferredDate")),
        roc_name=s(d.get("rocName")),
        rd_name=s(d.get("rdName")),
        rd_region=s(d.get("rdRegion")),
        balance_sheet_date=to_date(d.get("balanceSheetDate")),
    )


# ══════════════════════════════════════════════════════════════════════════════
#  FILTER INPUTS
# ══════════════════════════════════════════════════════════════════════════════

@strawberry.input
class CompanyFilter:
    cin: Optional[str] = None
    name: Optional[str] = None
    state: Optional[str] = None
    company_type: Optional[str] = None
    listed: Optional[bool] = None
    roc_name: Optional[str] = None
    incorporated_after: Optional[datetime.date] = None
    incorporated_before: Optional[datetime.date] = None

@strawberry.input
class DirectorFilter:
    din: Optional[str] = None
    pan: Optional[str] = None
    name: Optional[str] = None
    cin: Optional[str] = None
    designation: Optional[str] = None

@strawberry.input
class WilfulDefaulterFilter:
    borrower_name: Optional[str] = None
    borrower_pan: Optional[str] = None
    member_name: Optional[str] = None
    state: Optional[str] = None
    reporting_cycle: Optional[str] = None

@strawberry.input
class FinancialFilter:
    cin: Optional[str] = None
    year: Optional[int] = None
    title: Optional[str] = None
    format: Optional[str] = None
    nature_of_report: Optional[str] = None

@strawberry.input
class CashflowFilter:
    cin: Optional[str] = None
    year: Optional[int] = None
    title: Optional[str] = None
    nature_of_report: Optional[str] = None

@strawberry.input
class LegalCaseFilter:
    cin: Optional[str] = None
    petitioner: Optional[str] = None
    respondent: Optional[str] = None
    case_status: Optional[str] = None
    bench_code: Optional[str] = None

@strawberry.input
class SharePriceFilter:
    symbol: Optional[str] = None
    exchange: Optional[str] = None
    from_date: Optional[datetime.date] = None
    to_date: Optional[datetime.date] = None

@strawberry.input
class AnnouncementFilter:
    scrip_code: Optional[str] = None
    symbol: Optional[str] = None
    category: Optional[str] = None
    critical_only: Optional[bool] = None

@strawberry.input
class CreditRatingFilter:
    issuer: Optional[str] = None
    cra_name: Optional[str] = None
    rating_action: Optional[str] = None
    outlook: Optional[str] = None

@strawberry.input
class GSTFilter:
    gstin: Optional[str] = None
    legal_name: Optional[str] = None
    taxpayer_type: Optional[str] = None
    gstin_status: Optional[str] = None
    jurisdiction_state: Optional[str] = None

@strawberry.input
class NewsFilter:
    company_name: Optional[str] = None
    sentiment: Optional[str] = None
    category: Optional[str] = None
    source: Optional[str] = None

@strawberry.input
class EPFOFilter:
    establishment_name: Optional[str] = None
    establishment_code: Optional[str] = None
    wage_month: Optional[str] = None


# ══════════════════════════════════════════════════════════════════════════════
#  QUERY ROOT
# ══════════════════════════════════════════════════════════════════════════════

@strawberry.type
class Query:

    # ── Company hub ───────────────────────────────────────────────────────────

    @strawberry.field
    def company(self, cin: Optional[str] = None, name: Optional[str] = None) -> Optional[Company]:
        rows = dl.query_companies(cin=cin, name=name, page_size=1)
        return _make_company(rows[0]) if rows else None

    @strawberry.field
    def companies(self, filter: Optional[CompanyFilter] = None,
                  pagination: Optional[PaginationInput] = None) -> List[Company]:
        f_ = filter or CompanyFilter()
        p = pagination or PaginationInput()
        rows = dl.query_companies(
            cin=f_.cin, name=f_.name, state=f_.state,
            company_type=f_.company_type, listed=f_.listed,
            roc_name=f_.roc_name, page=p.page, page_size=p.page_size,
        )
        return [_make_company(r) for r in rows]

    # ── Identity ──────────────────────────────────────────────────────────────

    @strawberry.field
    def lei(self, lei_code: Optional[str] = None, legal_name: Optional[str] = None) -> Optional[LEI]:
        rows = dl.query_lei(lei_code=lei_code, legal_name=legal_name)
        return _make_lei(rows[0]) if rows else None

    @strawberry.field
    def gst(self, filter: Optional[GSTFilter] = None,
            pagination: Optional[PaginationInput] = None) -> List[GST]:
        f_ = filter or GSTFilter()
        p = pagination or PaginationInput()
        rows = dl.query_gst(gstin=f_.gstin, legal_name=f_.legal_name,
                             taxpayer_type=f_.taxpayer_type, gstin_status=f_.gstin_status,
                             jurisdiction_state=f_.jurisdiction_state,
                             page=p.page, page_size=p.page_size)
        return [_make_gst(r) for r in rows]

    @strawberry.field
    def business_activities(self, cin: Optional[str] = None,
                            activity_code: Optional[str] = None,
                            year: Optional[int] = None) -> List[BusinessActivity]:
        return [_make_business_activity(d)
                for d in dl.query_business_activities(cin=cin, activity_code=activity_code, year=year)]

    # ── People ────────────────────────────────────────────────────────────────

    @strawberry.field
    def directors(self, filter: Optional[DirectorFilter] = None,
                  pagination: Optional[PaginationInput] = None) -> List[Director]:
        f_ = filter or DirectorFilter()
        p = pagination or PaginationInput()
        return [_make_director(d) for d in dl.query_directors(
            din=f_.din, pan=f_.pan, name=f_.name, cin=f_.cin,
            designation=f_.designation, page=p.page, page_size=p.page_size)]

    @strawberry.field
    def disqualified_directors(self, din: Optional[str] = None,
                               cin: Optional[str] = None) -> List[DisqualifiedDirector]:
        return [_make_disq_director(d) for d in dl.query_disqualified_directors(din=din, cin=cin)]

    @strawberry.field
    def wilful_defaulters(self, filter: Optional[WilfulDefaulterFilter] = None,
                          pagination: Optional[PaginationInput] = None) -> List[WilfulDefaulter]:
        f_ = filter or WilfulDefaulterFilter()
        p = pagination or PaginationInput()
        return [_make_wilful_defaulter(d) for d in dl.query_wilful_defaulters(
            borrower_name=f_.borrower_name, borrower_pan=f_.borrower_pan,
            member_name=f_.member_name, state=f_.state,
            reporting_cycle=f_.reporting_cycle, page=p.page, page_size=p.page_size)]

    # ── Financials ────────────────────────────────────────────────────────────

    @strawberry.field
    def financials(self, filter: Optional[FinancialFilter] = None,
                   pagination: Optional[PaginationInput] = None) -> List[Financial]:
        f_ = filter or FinancialFilter()
        p = pagination or PaginationInput()
        return [_make_financial(d) for d in dl.query_financials(
            cin=f_.cin, year=f_.year, title=f_.title, fmt=f_.format,
            page=p.page, page_size=p.page_size)]

    @strawberry.field
    def cashflow(self, filter: Optional[CashflowFilter] = None,
                 pagination: Optional[PaginationInput] = None) -> List[CashflowItem]:
        f_ = filter or CashflowFilter()
        p = pagination or PaginationInput()
        return [_make_cashflow(d) for d in dl.query_cashflow(
            cin=f_.cin, year=f_.year, title=f_.title,
            nature_of_report=f_.nature_of_report,
            page=p.page, page_size=p.page_size)]

    @strawberry.field
    def unbilled_revenue(self, cin: Optional[str] = None, year: Optional[int] = None) -> List[UnbilledRevenue]:
        return [_make_unbilled_revenue(d) for d in dl.query_unbilled_revenue(cin=cin, year=year)]

    @strawberry.field
    def claims_not_acknowledged(self, cin: Optional[str] = None, year: Optional[int] = None) -> List[ClaimNotAcknowledged]:
        return [_make_claim(d) for d in dl.query_claims(cin=cin, year=year)]

    @strawberry.field
    def noncurrent_investments(self, cin: Optional[str] = None, year: Optional[int] = None,
                               nature_of_report: Optional[str] = None) -> List[NoncurrentInvestment]:
        return [_make_noncurrent_investment(d)
                for d in dl.query_noncurrent_investments(cin=cin, year=year, nature_of_report=nature_of_report)]

    @strawberry.field
    def current_investments(self, cin: Optional[str] = None, year: Optional[int] = None) -> List[CurrentInvestment]:
        return [_make_current_investment(d) for d in dl.query_current_investments(cin=cin, year=year)]

    @strawberry.field
    def other_assets_liabilities(self, cin: Optional[str] = None, year: Optional[int] = None,
                                 title: Optional[str] = None) -> List[OtherAssetLiability]:
        return [_make_other_al(d) for d in dl.query_other_assets_liabilities(cin=cin, year=year, title=title)]

    @strawberry.field
    def shareholding_records(self, cin: Optional[str] = None, year: Optional[int] = None,
                             category: Optional[str] = None) -> List[ShareholdingRecord]:
        return [_make_shareholding_record(d)
                for d in dl.query_shareholding_records(cin=cin, year=year, category=category)]

    # ── Audit ─────────────────────────────────────────────────────────────────

    @strawberry.field
    def audit_reports(self, cin: Optional[str] = None, year: Optional[int] = None) -> List[AuditReport]:
        return [_make_audit_report(d) for d in dl.query_audit_reports(cin=cin, year=year)]

    @strawberry.field
    def auditor_details(self, cin: Optional[str] = None, firm_no: Optional[str] = None,
                        membership_number: Optional[str] = None) -> List[AuditorDetail]:
        return [_make_auditor_detail(d)
                for d in dl.query_auditor_details(cin=cin, firm_no=firm_no, membership_number=membership_number)]

    @strawberry.field
    def adt_details(self, cin: Optional[str] = None, firm_no: Optional[str] = None) -> List[ADTDetail]:
        return [_make_adt_detail(d) for d in dl.query_adt_details(cin=cin, firm_no=firm_no)]

    # ── Capital Markets ───────────────────────────────────────────────────────

    @strawberry.field
    def share_prices(self, filter: Optional[SharePriceFilter] = None,
                     pagination: Optional[PaginationInput] = None) -> List[SharePrice]:
        f_ = filter or SharePriceFilter()
        p = pagination or PaginationInput()
        return [_make_share_price(d) for d in dl.query_share_prices(
            symbol=f_.symbol, exchange=f_.exchange,
            from_date=f_.from_date, to_date=f_.to_date,
            page=p.page, page_size=p.page_size)]

    @strawberry.field
    def bse_market_cap(self, scrip_code: Optional[str] = None,
                       from_date: Optional[datetime.date] = None,
                       to_date: Optional[datetime.date] = None,
                       pagination: Optional[PaginationInput] = None) -> List[BSEMarketCap]:
        p = pagination or PaginationInput()
        return [_make_bse_mktcap(d)
                for d in dl.query_bse_market_cap(scrip_code=scrip_code, from_date=from_date,
                                                  to_date=to_date, page=p.page, page_size=p.page_size)]

    @strawberry.field
    def nse_market_cap(self, symbol: Optional[str] = None,
                       pagination: Optional[PaginationInput] = None) -> List[NSEMarketCap]:
        p = pagination or PaginationInput()
        return [_make_nse_mktcap(d) for d in dl.query_nse_market_cap(symbol=symbol, page=p.page, page_size=p.page_size)]

    @strawberry.field
    def bse_shareholding(self, scrip_code: Optional[str] = None, financial_year: Optional[str] = None,
                         quarter: Optional[str] = None, category: Optional[str] = None) -> List[BSEShareholding]:
        return [_make_bse_sh(d) for d in dl.query_bse_shareholding(
            scrip_code=scrip_code, financial_year=financial_year, quarter=quarter, category=category)]

    @strawberry.field
    def nse_shareholding(self, symbol: Optional[str] = None, category: Optional[str] = None) -> List[NSEShareholding]:
        return [_make_nse_sh(d) for d in dl.query_nse_shareholding(symbol=symbol, category=category)]

    @strawberry.field
    def nsdl_instruments(self, issuer_name: Optional[str] = None, isin: Optional[str] = None,
                         instrument_type: Optional[str] = None, status: Optional[str] = None,
                         pagination: Optional[PaginationInput] = None) -> List[NSDLInstrument]:
        p = pagination or PaginationInput()
        return [_make_nsdl(d) for d in dl.query_nsdl(issuer_name=issuer_name, isin=isin,
                                                       instrument_type=instrument_type, status=status,
                                                       page=p.page, page_size=p.page_size)]

    @strawberry.field
    def credit_ratings(self, filter: Optional[CreditRatingFilter] = None) -> List[CreditRating]:
        f_ = filter or CreditRatingFilter()
        return [_make_credit_rating(d) for d in dl.query_credit_ratings(
            issuer=f_.issuer, cra_name=f_.cra_name,
            rating_action=f_.rating_action, outlook=f_.outlook)]

    @strawberry.field
    def bse_announcements(self, filter: Optional[AnnouncementFilter] = None,
                          pagination: Optional[PaginationInput] = None) -> List[BSEAnnouncement]:
        f_ = filter or AnnouncementFilter()
        p = pagination or PaginationInput()
        return [_make_bse_ann(d) for d in dl.query_bse_announcements(
            scrip_code=f_.scrip_code, category=f_.category,
            critical_only=f_.critical_only, page=p.page, page_size=p.page_size)]

    @strawberry.field
    def nse_announcements(self, filter: Optional[AnnouncementFilter] = None,
                          pagination: Optional[PaginationInput] = None) -> List[NSEAnnouncement]:
        f_ = filter or AnnouncementFilter()
        p = pagination or PaginationInput()
        return [_make_nse_ann(d) for d in dl.query_nse_announcements(
            symbol=f_.symbol, category=f_.category, page=p.page, page_size=p.page_size)]

    # ── Legal ─────────────────────────────────────────────────────────────────

    @strawberry.field
    def nclt_cases(self, filter: Optional[LegalCaseFilter] = None,
                   pagination: Optional[PaginationInput] = None) -> List[NCLTCase]:
        f_ = filter or LegalCaseFilter()
        p = pagination or PaginationInput()
        return [_make_nclt(d) for d in dl.query_nclt(
            cin=f_.cin, petitioner=f_.petitioner, respondent=f_.respondent,
            case_status=f_.case_status, bench_code=f_.bench_code, page=p.page, page_size=p.page_size)]

    @strawberry.field
    def nclat_cases(self, filter: Optional[LegalCaseFilter] = None,
                    pagination: Optional[PaginationInput] = None) -> List[NCLATCase]:
        f_ = filter or LegalCaseFilter()
        p = pagination or PaginationInput()
        return [_make_nclat(d) for d in dl.query_nclat(
            cin=f_.cin, petitioner=f_.petitioner, respondent=f_.respondent,
            case_status=f_.case_status, bench_code=f_.bench_code, page=p.page, page_size=p.page_size)]

    @strawberry.field
    def drt_cases(self, filter: Optional[LegalCaseFilter] = None,
                  pagination: Optional[PaginationInput] = None) -> List[DRTCase]:
        f_ = filter or LegalCaseFilter()
        p = pagination or PaginationInput()
        return [_make_drt(d) for d in dl.query_drt(
            cin=f_.cin, petitioner=f_.petitioner, respondent=f_.respondent,
            case_status=f_.case_status, bench_code=f_.bench_code, page=p.page, page_size=p.page_size)]

    @strawberry.field
    def drat_cases(self, filter: Optional[LegalCaseFilter] = None,
                   pagination: Optional[PaginationInput] = None) -> List[DRATCase]:
        f_ = filter or LegalCaseFilter()
        p = pagination or PaginationInput()
        return [_make_drat(d) for d in dl.query_drat(
            cin=f_.cin, petitioner=f_.petitioner, respondent=f_.respondent,
            case_status=f_.case_status, bench_code=f_.bench_code, page=p.page, page_size=p.page_size)]

    @strawberry.field
    def ibbi_cases(self, filter: Optional[LegalCaseFilter] = None,
                   pagination: Optional[PaginationInput] = None) -> List[IBBICase]:
        f_ = filter or LegalCaseFilter()
        p = pagination or PaginationInput()
        return [_make_ibbi(d) for d in dl.query_ibbi(
            cin=f_.cin, petitioner=f_.petitioner, respondent=f_.respondent,
            case_status=f_.case_status, bench_code=f_.bench_code, page=p.page, page_size=p.page_size)]

    # ── Compliance / Risk ─────────────────────────────────────────────────────

    @strawberry.field
    def asset_charges(self, cin: Optional[str] = None, charge_holder_name: Optional[str] = None,
                      authorisation_status: Optional[str] = None,
                      pagination: Optional[PaginationInput] = None) -> List[AssetCharge]:
        p = pagination or PaginationInput()
        return [_make_asset_charge(d) for d in dl.query_asset_charges(
            cin=cin, charge_holder_name=charge_holder_name,
            authorisation_status=authorisation_status, page=p.page, page_size=p.page_size)]

    @strawberry.field
    def mca_defaults(self, cin: Optional[str] = None, pan: Optional[str] = None) -> List[MCADefault]:
        return [_make_mca_default(d) for d in dl.query_mca_defaults(cin=cin, pan=pan)]

    @strawberry.field
    def shell_companies(self, cin: Optional[str] = None, source: Optional[str] = None) -> List[ShellCompany]:
        return [_make_shell(d) for d in dl.query_shell_companies(cin=cin, source=source)]

    @strawberry.field
    def watchout_investor_orders(self, pagination: Optional[PaginationInput] = None) -> List[WatchoutInvestorOrder]:
        p = pagination or PaginationInput()
        rows = dl.query_watchout(page=p.page, page_size=p.page_size)
        return [WatchoutInvestorOrder(order_details=r.get("order_details")) for r in rows]

    # ── Operational ───────────────────────────────────────────────────────────

    @strawberry.field
    def epfo_records(self, filter: Optional[EPFOFilter] = None,
                     pagination: Optional[PaginationInput] = None) -> List[EPFORecord]:
        f_ = filter or EPFOFilter()
        p = pagination or PaginationInput()
        return [_make_epfo(d) for d in dl.query_epfo(
            establishment_name=f_.establishment_name,
            establishment_code=f_.establishment_code,
            wage_month=f_.wage_month, page=p.page, page_size=p.page_size)]

    @strawberry.field
    def news(self, filter: Optional[NewsFilter] = None,
             pagination: Optional[PaginationInput] = None) -> List[NewsArticle]:
        f_ = filter or NewsFilter()
        p = pagination or PaginationInput()
        return [_make_news(d) for d in dl.query_news(
            company_name=f_.company_name, sentiment=f_.sentiment,
            category=f_.category, source=f_.source,
            page=p.page, page_size=p.page_size)]


# ── Schema registration ────────────────────────────────────────────────────────
schema = strawberry.Schema(query=Query)
