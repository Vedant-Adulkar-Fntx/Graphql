"""
data_loader.py — Load all 37 Excel sheets into pandas DataFrames
and expose clean query functions for every domain.

At startup call: init(path_to_xlsx)
All query functions are synchronous; swap internals for SQLAlchemy / DB later.
"""
from __future__ import annotations
import os
import logging
from typing import Any, Dict, List, Optional
import pandas as pd
from utils import row_dict, s

logger = logging.getLogger(__name__)

# Global store: sheet_name → DataFrame
_dfs: Dict[str, pd.DataFrame] = {}

# Canonical sheet → internal key (strips trailing spaces from Excel names)
_SHEETS = {
    "LEI": "LEI",
    "GST": "GST",
    "Asset Charge": "Asset Charge",
    "Company Details": "Company Details",
    "Director Details": "Director Details",
    "NSDL": "NSDL",
    "Share Price": "Share Price",
    "News": "News",
    "NCLT": "NCLT",
    "NCLAT": "NCLAT",         # Excel has trailing space — normalised below
    "DRT": "DRT",
    "DRAT": "DRAT",
    "IBBI": "IBBI",
    "Credit Ratings": "Credit Ratings",
    "BSE Shareholding": "BSE Shareholding",
    "MCA Def": "MCA Def",
    "Shell Comp": "Shell Comp",
    "Dir Debbared": "Dir Debbared",
    "NSE Shareholding": "NSE Shareholding",
    "Auditor Details": "Auditor Details",
    "ADT Details": "ADT Details",
    "willful def": "willful def",
    "Watchout Investors": "Watchout Investors",
    "BSE Announcements": "BSE Announcements",
    "NSE Announcements": "NSE Announcements",
    "EPFO": "EPFO",
    "BSE_Market_cap": "BSE_Market_cap",
    "NSE_Market_cap": "NSE_Market_cap",
    "Financials": "Financials",
    "Shareholding": "Shareholding",
    "AuditReport": "AuditReport",
    "UnbilledRevenue": "UnbilledRevenue",
    "ClaimsNotAcknowledged": "ClaimsNotAcknowledged",
    "Cashflow": "Cashflow",
    "NoncurrentInvestments": "NoncurrentInvestments",
    "OtherAssetsLiabilities": "OtherAssetsLiabilities",
    "CurrentInvestments": "CurrentInvestments",
    "BusinessActivities": "BusinessActivities",
}


# ── Bootstrap ──────────────────────────────────────────────────────────────────

class SafeDataFrame(pd.DataFrame):
    @property
    def _constructor(self):
        return SafeDataFrame

    def __getitem__(self, key):
        if isinstance(key, str):
            norm = key.strip().lower().replace(" ", "").replace("_", "")
            for c in self.columns:
                if str(c).strip().lower().replace(" ", "").replace("_", "") == norm:
                    return super().__getitem__(c)
            aliases = {"company": "companyname", "companyname": "company", "cin": "cinno", "cinno": "cin"}
            if norm in aliases:
                for c in self.columns:
                    if str(c).strip().lower().replace(" ", "").replace("_", "") == aliases[norm]:
                        return super().__getitem__(c)
            return pd.Series([None]*len(self), index=self.index)
        return super().__getitem__(key)

def init(path: str = "") -> None:
    """Load every sheet. Call once at application startup."""
    global _dfs
    path = path or os.getenv("EXCEL_PATH", "Data_Subscription_Data_points_Sample_data.xlsx")
    logger.info("Loading Excel workbook: %s", path)
    xl = pd.ExcelFile(path)
    for raw_name in xl.sheet_names:
        key = raw_name.strip()          # "NCLAT " → "NCLAT"
        try:
            _dfs[key] = SafeDataFrame(xl.parse(raw_name))
            logger.info("  ✓ %-30s  %d rows", key, len(_dfs[key]))
        except Exception as exc:
            logger.warning("  ✗ %-30s  %s", key, exc)

    # Inject financials-rich companies into "Company Details" so they can be searched and explored
    if "Company Details" in _dfs and not _dfs["Company Details"].empty:
        df_comp = _dfs["Company Details"]
        tcs_row = df_comp.iloc[0].copy()
        tcs_row["CIN"] = "L22210MH1995PLC084781"
        tcs_row["company"] = "TATA CONSULTANCY SERVICES LIMITED"
        tcs_row["whetherListedOrNot"] = "listed"
        tcs_row["authorisedCapital"] = 10000000000
        tcs_row["paidUpCapital"] = 3620000000
        tcs_row["reg_city"] = "Mumbai"
        tcs_row["reg_state"] = "Maharashtra"

        sprng_row = df_comp.iloc[0].copy()
        sprng_row["CIN"] = "U74999TN2016PTC162587"
        sprng_row["company"] = "SPRNG ENERGY PRIVATE LIMITED"
        sprng_row["whetherListedOrNot"] = "unlisted"
        sprng_row["authorisedCapital"] = 50000000
        sprng_row["paidUpCapital"] = 10000000
        sprng_row["reg_city"] = "Chennai"
        sprng_row["reg_state"] = "Tamil Nadu"

        neev_row = df_comp.iloc[0].copy()
        neev_row["CIN"] = "AAA-1769"
        neev_row["company"] = "NEEV ENERGY LLP"
        neev_row["whetherListedOrNot"] = "unlisted"
        neev_row["authorisedCapital"] = 100000
        neev_row["paidUpCapital"] = 50000
        neev_row["reg_city"] = "Mumbai"
        neev_row["reg_state"] = "Maharashtra"

        new_rows = pd.DataFrame([tcs_row, sprng_row, neev_row])
        _dfs["Company Details"] = SafeDataFrame(pd.concat([new_rows, df_comp], ignore_index=True))


def _df(sheet: str) -> SafeDataFrame:
    return _dfs.get(sheet, SafeDataFrame())


def _icontains(series: pd.Series, val: str) -> pd.Series:
    return series.astype(str).str.contains(val, case=False, na=False)


def _normalize_name(name: str) -> str:
    import re
    if not name:
        return ""
    name = str(name).upper().strip()
    name = re.sub(r"\b(LIMITED|LTD|PVT|PRIVATE|CO|CORP|CORPORATION|INC|INCORPORATED)\b", "", name)
    name = re.sub(r"[^\w\s]", "", name)
    return " ".join(name.split())


def _icontains_name(series: pd.Series, val: str) -> pd.Series:
    n_val = _normalize_name(val)
    if not n_val:
        return series.astype(str) == ""
    def match(x):
        n_x = _normalize_name(x)
        return n_val in n_x or n_x in n_val if n_x and n_val else False
    return series.apply(match)


def _eq(series: pd.Series, val: Any) -> pd.Series:
    return series.astype(str).str.strip().str.upper() == str(val).strip().upper()


# ── Company Details ────────────────────────────────────────────────────────────

def query_companies(
    cin: Optional[str] = None,
    name: Optional[str] = None,
    state: Optional[str] = None,
    company_type: Optional[str] = None,
    listed: Optional[bool] = None,
    roc_name: Optional[str] = None,
    incorporated_after=None,
    incorporated_before=None,
    page: int = 0,
    page_size: int = 20,
) -> List[dict]:
    df = _df("Company Details").copy()
    if df.empty:
        return []
    if cin:
        df = df[_eq(df["CIN"], cin)]
    if name:
        df = df[_icontains_name(df["company"], name)]
    if state:
        df = df[_icontains(df["reg_state"], state)]
    if company_type:
        df = df[_icontains(df["companyType"], company_type)]
    if listed is not None:
        val = "listed" if listed else "unlisted"
        df = df[_icontains(df["whetherListedOrNot"], val)]
    if roc_name:
        df = df[_icontains(df["rocName"], roc_name)]
    start = page * page_size
    return [row_dict(r) for _, r in df.iloc[start: start + page_size].iterrows()]


def get_company_by_cin(cin: str) -> Optional[dict]:
    rows = query_companies(cin=cin, page_size=1)
    return rows[0] if rows else None


# ── LEI ───────────────────────────────────────────────────────────────────────

def query_lei(lei_code: Optional[str] = None, legal_name: Optional[str] = None) -> List[dict]:
    df = _df("LEI").copy()
    if df.empty:
        return []
    if lei_code:
        df = df[_icontains(df["lei_code"], lei_code)]
    if legal_name:
        df = df[_icontains(df["legal_name"], legal_name)]
    return [row_dict(r) for _, r in df.iterrows()]


# ── GST ───────────────────────────────────────────────────────────────────────

def query_gst(
    gstin: Optional[str] = None,
    legal_name: Optional[str] = None,
    taxpayer_type: Optional[str] = None,
    gstin_status: Optional[str] = None,
    jurisdiction_state: Optional[str] = None,
    page: int = 0,
    page_size: int = 20,
) -> List[dict]:
    df = _df("GST").copy()
    if df.empty:
        return []
    if gstin:
        df = df[_icontains(df["gstin"], gstin)]
    if legal_name:
        df = df[_icontains_name(df["legal_name"], legal_name)]
    if taxpayer_type:
        df = df[_icontains(df["taxpayer_type"], taxpayer_type)]
    if gstin_status:
        df = df[_icontains(df["gstin_status"], gstin_status)]
    if jurisdiction_state:
        df = df[_icontains(df["jurisdiction_state"], jurisdiction_state)]
    start = page * page_size
    return [row_dict(r) for _, r in df.iloc[start: start + page_size].iterrows()]


# ── Director Details ──────────────────────────────────────────────────────────

def query_directors(
    din: Optional[str] = None,
    pan: Optional[str] = None,
    name: Optional[str] = None,
    cin: Optional[str] = None,
    designation: Optional[str] = None,
    page: int = 0,
    page_size: int = 20,
) -> List[dict]:
    df = _df("Director Details").copy()
    if df.empty:
        return []
    if din:
        df = df[_icontains(df["DIN"], din)]
    if pan:
        df = df[_icontains(df["PAN"], pan)]
    if name:
        df = df[_icontains(df["Name"], name)]
    if cin:
        df = df[_eq(df["CIN"], cin)]
    if designation:
        df = df[_icontains(df["Designation"], designation)]
    start = page * page_size
    return [row_dict(r) for _, r in df.iloc[start: start + page_size].iterrows()]


# ── Disqualified Directors ────────────────────────────────────────────────────

def query_disqualified_directors(din: Optional[str] = None, cin: Optional[str] = None) -> List[dict]:
    df = _df("Dir Debbared").copy()
    if df.empty:
        return []
    if din:
        df = df[_icontains(df["DIN"], din)]
    if cin:
        df = df[_eq(df["CINNO"], cin)]
    return [row_dict(r) for _, r in df.iterrows()]


# ── Wilful Defaulters ─────────────────────────────────────────────────────────

def query_wilful_defaulters(
    borrower_name: Optional[str] = None,
    borrower_pan: Optional[str] = None,
    member_name: Optional[str] = None,
    state: Optional[str] = None,
    reporting_cycle: Optional[str] = None,
    page: int = 0,
    page_size: int = 20,
) -> List[dict]:
    df = _df("willful def").copy()
    if df.empty:
        return []
    if borrower_name:
        df = df[_icontains_name(df["Borrower_Name"], borrower_name)]
    if borrower_pan:
        df = df[_icontains(df["Borrower_PAN"], borrower_pan)]
    if member_name:
        df = df[_icontains(df["Member_Name"], member_name)]
    if state:
        df = df[_icontains(df["State"], state)]
    if reporting_cycle:
        df = df[_icontains(df["Reporting_Cycle"], reporting_cycle)]
    start = page * page_size
    return [row_dict(r) for _, r in df.iloc[start: start + page_size].iterrows()]


# ── Financials ────────────────────────────────────────────────────────────────

def query_financials(
    cin: Optional[str] = None,
    year: Optional[int] = None,
    title: Optional[str] = None,
    fmt: Optional[str] = None,
    nature_of_report: Optional[str] = None,
    page: int = 0,
    page_size: int = 50,
) -> List[dict]:
    df = _df("Financials").copy()
    if df.empty:
        return []
    if cin:
        df = df[_eq(df["CIN"], cin)]
    if year:
        df = df[df["Year"] == year]
    if title:
        df = df[_icontains(df["Title"], title)]
    if fmt:
        df = df[_icontains(df["Format"], fmt)]
    start = page * page_size
    return [row_dict(r) for _, r in df.iloc[start: start + page_size].iterrows()]


# ── Cashflow ──────────────────────────────────────────────────────────────────

def query_cashflow(
    cin: Optional[str] = None,
    year: Optional[int] = None,
    title: Optional[str] = None,
    nature_of_report: Optional[str] = None,
    page: int = 0,
    page_size: int = 50,
) -> List[dict]:
    df = _df("Cashflow").copy()
    if df.empty:
        return []
    if cin:
        df = df[_eq(df["CIN"], cin)]
    if year:
        df = df[df["Year"] == year]
    if title:
        df = df[_icontains(df["Title"], title)]
    if nature_of_report:
        df = df[_icontains(df["NatureOfReport"], nature_of_report)]
    start = page * page_size
    return [row_dict(r) for _, r in df.iloc[start: start + page_size].iterrows()]


# ── UnbilledRevenue / Claims ──────────────────────────────────────────────────

def query_unbilled_revenue(cin: Optional[str] = None, year: Optional[int] = None) -> List[dict]:
    df = _df("UnbilledRevenue").copy()
    if df.empty:
        return []
    if cin:
        df = df[_eq(df["CIN"], cin)]
    if year:
        df = df[df["Year"] == year]
    return [row_dict(r) for _, r in df.iterrows()]


def query_claims(cin: Optional[str] = None, year: Optional[int] = None) -> List[dict]:
    df = _df("ClaimsNotAcknowledged").copy()
    if df.empty:
        return []
    if cin:
        df = df[_eq(df["CIN"], cin)]
    if year:
        df = df[df["Year"] == year]
    return [row_dict(r) for _, r in df.iterrows()]


# ── Shareholding (XBRL filing) ────────────────────────────────────────────────

def query_shareholding_records(cin: Optional[str] = None, year: Optional[int] = None, category: Optional[str] = None, page: int = 0, page_size: int = 50) -> List[dict]:
    df = _df("Shareholding").copy()
    if df.empty:
        return []
    if cin:
        df = df[_eq(df["CIN"], cin)]
    if year:
        df = df[df["Year"] == year]
    if category:
        df = df[_icontains(df["Category"], category)]
    start = page * page_size
    return [row_dict(r) for _, r in df.iloc[start: start + page_size].iterrows()]


# ── Investments ───────────────────────────────────────────────────────────────

def query_noncurrent_investments(cin: Optional[str] = None, year: Optional[int] = None,
                                  nature_of_report: Optional[str] = None, affiliate_name: Optional[str] = None) -> List[dict]:
    df = _df("NoncurrentInvestments").copy()
    if df.empty:
        return []
    if cin:
        df = df[_eq(df["CIN"], cin)]
    if year:
        df = df[df["Year"] == year]
    if nature_of_report:
        df = df[_icontains(df["NatureOfReport"], nature_of_report)]
    if affiliate_name:
        df = df[_icontains(df["AffiliateName"], affiliate_name)]
    return [row_dict(r) for _, r in df.iterrows()]


def query_current_investments(cin: Optional[str] = None, year: Optional[int] = None,
                               nature_of_report: Optional[str] = None) -> List[dict]:
    df = _df("CurrentInvestments").copy()
    if df.empty:
        return []
    if cin:
        df = df[_eq(df["CIN"], cin)]
    if year:
        df = df[df["Year"] == year]
    if nature_of_report:
        df = df[_icontains(df["NatureOfReport"], nature_of_report)]
    return [row_dict(r) for _, r in df.iterrows()]


def query_other_assets_liabilities(cin: Optional[str] = None, year: Optional[int] = None,
                                    title: Optional[str] = None, nature_of_report: Optional[str] = None) -> List[dict]:
    df = _df("OtherAssetsLiabilities").copy()
    if df.empty:
        return []
    if cin:
        df = df[_eq(df["CIN"], cin)]
    if year:
        df = df[df["Year"] == year]
    if title:
        df = df[_icontains(df["Title"], title)]
    if nature_of_report:
        df = df[_icontains(df["NatureOfReport"], nature_of_report)]
    return [row_dict(r) for _, r in df.iterrows()]


# ── Audit ─────────────────────────────────────────────────────────────────────

def query_audit_reports(cin: Optional[str] = None, year: Optional[int] = None) -> List[dict]:
    df = _df("AuditReport").copy()
    if df.empty:
        return []
    if cin:
        df = df[_eq(df["CIN"], cin)]
    if year:
        df = df[df["Year"] == year]
    return [row_dict(r) for _, r in df.iterrows()]


def query_auditor_details(cin: Optional[str] = None, firm_no: Optional[str] = None, membership_number: Optional[str] = None) -> List[dict]:
    df = _df("Auditor Details").copy()
    if df.empty:
        return []
    if cin:
        df = df[_eq(df["cin"], cin)]
    if firm_no:
        df = df[_icontains(df["firm_no"], firm_no)]
    if membership_number:
        df = df[_icontains(df["membership_number"], membership_number)]
    return [row_dict(r) for _, r in df.iterrows()]


def query_adt_details(cin: Optional[str] = None, firm_no: Optional[str] = None) -> List[dict]:
    df = _df("ADT Details").copy()
    if df.empty:
        return []
    if cin:
        df = df[_eq(df["cin"], cin)]
    if firm_no:
        df = df[_icontains(df["firm_no"], firm_no)]
    return [row_dict(r) for _, r in df.iterrows()]


# ── Capital Markets ───────────────────────────────────────────────────────────

def query_share_prices(
    symbol: Optional[str] = None,
    exchange: Optional[str] = None,
    from_date=None,
    to_date=None,
    page: int = 0,
    page_size: int = 50,
) -> List[dict]:
    df = _df("Share Price").copy()
    if df.empty:
        return []
    if symbol:
        df = df[_icontains(df["symbol"], symbol)]
    if exchange:
        df = df[_icontains(df["Exchange"], exchange)]
    if from_date:
        df = df[pd.to_datetime(df["date"], errors="coerce") >= pd.to_datetime(str(from_date))]
    if to_date:
        df = df[pd.to_datetime(df["date"], errors="coerce") <= pd.to_datetime(str(to_date))]
    start = page * page_size
    return [row_dict(r) for _, r in df.sort_values("date", ascending=False).iloc[start: start + page_size].iterrows()]


def query_bse_market_cap(scrip_code: Optional[str] = None, from_date=None, to_date=None,
                          page: int = 0, page_size: int = 30) -> List[dict]:
    df = _df("BSE_Market_cap").copy()
    if df.empty:
        return []
    if scrip_code:
        df = df[_eq(df["scrip_code"], scrip_code)]
    if from_date:
        df = df[pd.to_datetime(df["document_date"], errors="coerce") >= pd.to_datetime(str(from_date))]
    if to_date:
        df = df[pd.to_datetime(df["document_date"], errors="coerce") <= pd.to_datetime(str(to_date))]
    start = page * page_size
    return [row_dict(r) for _, r in df.iloc[start: start + page_size].iterrows()]


def query_nse_market_cap(symbol: Optional[str] = None, from_date=None, to_date=None,
                          page: int = 0, page_size: int = 30) -> List[dict]:
    df = _df("NSE_Market_cap").copy()
    if df.empty:
        return []
    if symbol:
        df = df[_icontains(df["symbol"], symbol)]
    start = page * page_size
    return [row_dict(r) for _, r in df.iloc[start: start + page_size].iterrows()]


def query_bse_shareholding(scrip_code: Optional[str] = None, financial_year: Optional[str] = None,
                            quarter: Optional[str] = None, category: Optional[str] = None) -> List[dict]:
    df = _df("BSE Shareholding").copy()
    if df.empty:
        return []
    if scrip_code:
        df = df[_eq(df["scrip_code"], scrip_code)]
    if financial_year:
        df = df[_icontains(df["financial_year"], financial_year)]
    if quarter:
        df = df[_icontains(df["quarter"], quarter)]
    if category:
        df = df[_icontains(df["share_holder_category"], category)]
    return [row_dict(r) for _, r in df.iterrows()]


def query_nse_shareholding(symbol: Optional[str] = None, category: Optional[str] = None) -> List[dict]:
    df = _df("NSE Shareholding").copy()
    if df.empty:
        return []
    if symbol:
        df = df[_icontains(df["symbol"], symbol)]
    if category:
        df = df[_icontains(df["shareholder_category"], category)]
    return [row_dict(r) for _, r in df.iterrows()]


def query_nsdl(issuer_name: Optional[str] = None, isin: Optional[str] = None,
               instrument_type: Optional[str] = None, status: Optional[str] = None,
               page: int = 0, page_size: int = 20) -> List[dict]:
    df = _df("NSDL").copy()
    if df.empty:
        return []
    if issuer_name:
        df = df[_icontains(df["issuer_name"], issuer_name)]
    if isin:
        df = df[_eq(df["issuer_isin"], isin)]
    if instrument_type:
        df = df[_icontains(df["instrument_type"], instrument_type)]
    if status:
        df = df[_icontains(df["status"], status)]
    start = page * page_size
    return [row_dict(r) for _, r in df.iloc[start: start + page_size].iterrows()]


def query_credit_ratings(issuer: Optional[str] = None, cra_name: Optional[str] = None,
                          rating_action: Optional[str] = None, rating_term: Optional[str] = None,
                          outlook: Optional[str] = None) -> List[dict]:
    df = _df("Credit Ratings").copy()
    if df.empty:
        return []
    if issuer:
        df = df[_icontains_name(df["issuer"], issuer)]
    if cra_name:
        df = df[_icontains(df["cra_name"], cra_name)]
    if rating_action:
        df = df[_icontains(df["rating_action"], rating_action)]
    if rating_term:
        df = df[_icontains(df["rating_term"], rating_term)]
    if outlook:
        df = df[_icontains(df["outlook"], outlook)]
    return [row_dict(r) for _, r in df.iterrows()]


def query_bse_announcements(scrip_code: Optional[str] = None, category: Optional[str] = None,
                             from_date=None, to_date=None, critical_only: Optional[bool] = None,
                             page: int = 0, page_size: int = 20) -> List[dict]:
    df = _df("BSE Announcements").copy()
    if df.empty:
        return []
    if scrip_code:
        df = df[_eq(df["scrip_code"], scrip_code)]
    if category:
        df = df[_icontains(df["category_name"], category)]
    if critical_only:
        df = df[df["critical_news"] == True]
    start = page * page_size
    return [row_dict(r) for _, r in df.iloc[start: start + page_size].iterrows()]


def query_nse_announcements(symbol: Optional[str] = None, category: Optional[str] = None,
                             page: int = 0, page_size: int = 20) -> List[dict]:
    df = _df("NSE Announcements").copy()
    if df.empty:
        return []
    if symbol:
        df = df[_icontains(df["symbol"], symbol)]
    if category:
        df = df[_icontains(df["announcement_category"], category)]
    start = page * page_size
    return [row_dict(r) for _, r in df.iloc[start: start + page_size].iterrows()]


# ── Legal ─────────────────────────────────────────────────────────────────────

def _query_legal(sheet: str, cin_col: str, cin: Optional[str] = None,
                 petitioner: Optional[str] = None, respondent: Optional[str] = None,
                 case_status: Optional[str] = None, bench_code: Optional[str] = None,
                 page: int = 0, page_size: int = 20) -> List[dict]:
    df = _df(sheet).copy()
    if df.empty:
        return []
    if cin and cin_col in df.columns:
        df = df[_eq(df[cin_col], cin)]
    if petitioner and "Petitioner" in df.columns:
        df = df[_icontains(df["Petitioner"], petitioner)]
    if respondent and "Respondent" in df.columns:
        df = df[_icontains(df["Respondent"], respondent)]
    if case_status and "CaseStatus" in df.columns:
        df = df[_icontains(df["CaseStatus"], case_status)]
    if bench_code and "BenchCode" in df.columns:
        df = df[_icontains(df["BenchCode"], bench_code)]
    start = page * page_size
    return [row_dict(r) for _, r in df.iloc[start: start + page_size].iterrows()]


def query_nclt(cin=None, petitioner=None, respondent=None, case_status=None, bench_code=None, page=0, page_size=20):
    return _query_legal("NCLT", "CIN", cin, petitioner, respondent, case_status, bench_code, page, page_size)

def query_nclat(cin=None, company_name=None, petitioner=None, respondent=None, case_status=None, bench_code=None, page=0, page_size=20):
    # NCLAT uses company_name to link, no direct CIN column
    df = _df("NCLAT").copy()
    if df.empty:
        return []
    if company_name:
        df = df[_icontains_name(df["company_name"], company_name)]
    elif cin:
        pass  # NCLAT doesn't have CIN — filter by company_name if needed
    if "status" in df.columns and case_status:
        df = df[_icontains(df["status"], case_status)]
    if "bench_code" in df.columns and bench_code:
        df = df[_icontains(df["bench_code"], bench_code)]
    if "petitioner" in df.columns and petitioner:
        df = df[_icontains(df["petitioner"], petitioner)]
    if "respondent" in df.columns and respondent:
        df = df[_icontains(df["respondent"], respondent)]
    start = page * page_size
    return [row_dict(r) for _, r in df.iloc[start: start + page_size].iterrows()]

def query_drt(cin=None, petitioner=None, respondent=None, case_status=None, bench_code=None, page=0, page_size=20):
    return _query_legal("DRT", "CIN", cin, petitioner, respondent, case_status, bench_code, page, page_size)

def query_drat(cin=None, petitioner=None, respondent=None, case_status=None, bench_code=None, page=0, page_size=20):
    return _query_legal("DRAT", "CIN", cin, petitioner, respondent, case_status, bench_code, page, page_size)

def query_ibbi(cin=None, petitioner=None, respondent=None, case_status=None, bench_code=None, page=0, page_size=20):
    return _query_legal("IBBI", "CIN", cin, petitioner, respondent, case_status, bench_code, page, page_size)


# ── Compliance / Risk ─────────────────────────────────────────────────────────

def query_asset_charges(cin: Optional[str] = None, charge_holder_name: Optional[str] = None,
                         authorisation_status: Optional[str] = None,
                         page: int = 0, page_size: int = 20) -> List[dict]:
    df = _df("Asset Charge").copy()
    if df.empty:
        return []
    if cin:
        df = df[_eq(df["CIN"], cin)]
    if charge_holder_name:
        df = df[_icontains(df["ChargeHolderName"], charge_holder_name)]
    if authorisation_status:
        df = df[_icontains(df["AuthorisationStatus"], authorisation_status)]
    start = page * page_size
    return [row_dict(r) for _, r in df.iloc[start: start + page_size].iterrows()]


def query_mca_defaults(cin: Optional[str] = None, pan: Optional[str] = None) -> List[dict]:
    df = _df("MCA Def").copy()
    if df.empty:
        return []
    if cin:
        df = df[_eq(df["CINNO"], cin)]
    if pan:
        df = df[_icontains(df["PANNo"], pan)]
    return [row_dict(r) for _, r in df.iterrows()]


def query_shell_companies(cin: Optional[str] = None, source: Optional[str] = None) -> List[dict]:
    df = _df("Shell Comp").copy()
    if df.empty:
        return []
    if cin:
        df = df[_eq(df["CINNO"], cin)]
    if source:
        df = df[_icontains(df["source"], source)]
    return [row_dict(r) for _, r in df.iterrows()]


# ── Operational ───────────────────────────────────────────────────────────────

def query_epfo(establishment_name: Optional[str] = None, establishment_code: Optional[str] = None,
               wage_month: Optional[str] = None, page: int = 0, page_size: int = 20) -> List[dict]:
    df = _df("EPFO").copy()
    if df.empty:
        return []
    if establishment_name:
        df = df[_icontains_name(df["establishment_name"], establishment_name)]
    if establishment_code:
        df = df[_eq(df["establishment_code"], establishment_code)]
    if wage_month:
        df = df[_icontains(df["wage_month"], wage_month)]
    start = page * page_size
    return [row_dict(r) for _, r in df.iloc[start: start + page_size].iterrows()]


def query_news(company_name: Optional[str] = None, sentiment: Optional[str] = None,
               category: Optional[str] = None, source: Optional[str] = None,
               page: int = 0, page_size: int = 20) -> List[dict]:
    df = _df("News").copy()
    if df.empty:
        return []
    if company_name:
        df = df[_icontains_name(df["company_names_found"], company_name)]
    if sentiment:
        df = df[_icontains(df["sentiment"], sentiment)]
    if category:
        df = df[_icontains(df["category"], category)]
    if source:
        df = df[_icontains(df["source"], source)]
    start = page * page_size
    return [row_dict(r) for _, r in df.iloc[start: start + page_size].iterrows()]


def query_business_activities(cin: Optional[str] = None, activity_code: Optional[str] = None,
                               year: Optional[int] = None) -> List[dict]:
    df = _df("BusinessActivities").copy()
    if df.empty:
        return []
    if cin:
        df = df[_eq(df["CIN"], cin)]
    if activity_code:
        df = df[_icontains(df["BusinessActivityCode"], activity_code)]
    if year:
        df = df[df["Year"] == year]
    return [row_dict(r) for _, r in df.iterrows()]


def query_watchout(page: int = 0, page_size: int = 20) -> List[dict]:
    df = _df("Watchout Investors").copy()
    if df.empty:
        return []
    first_col = df.columns[0] if not df.columns.empty else None
    if first_col is None:
        return []
    start = page * page_size
    rows = []
    for _, r in df.iloc[start: start + page_size].iterrows():
        rows.append({"order_details": s(r.get(first_col))})
    return rows
