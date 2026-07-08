"""
main.py — FastAPI + Strawberry GraphQL application
Start: uvicorn main:app --reload --port 8000
Playground: http://localhost:8000/graphql
"""
import os
import logging
import sys
from contextlib import asynccontextmanager

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter

# Ensure local packages are importable
sys.path.insert(0, os.path.dirname(__file__))

import data_loader
from schema import schema

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
logger = logging.getLogger("main")

EXCEL_PATH = os.getenv(
    "EXCEL_PATH",
    # Default: look for the file in the same directory as main.py
    os.path.join(os.path.dirname(__file__), "Data Subscription Data points Sample data.xlsx"),
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load Excel data once at startup; nothing to tear down."""
    logger.info("Loading data from: %s", EXCEL_PATH)
    data_loader.init(EXCEL_PATH)
    logger.info("Data loaded. API ready.")
    yield


app = FastAPI(
    title="Corporate Intelligence GraphQL API",
    description=(
        "GraphQL API over a 37-sheet corporate data platform covering "
        "company registration, financials, legal, capital markets, "
        "compliance, audit, and operational signals."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ───────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── GraphQL router ─────────────────────────────────────────────────────────────
graphql_router = GraphQLRouter(
    schema,
    graphql_ide="graphiql",       # built-in browser playground at /graphql
)
app.include_router(graphql_router, prefix="/graphql")


# ── REST health-check ──────────────────────────────────────────────────────────
@app.get("/health", tags=["meta"])
def health():
    loaded = list(data_loader._dfs.keys())
    return {
        "status": "ok",
        "sheets_loaded": len(loaded),
        "sheets": loaded,
    }


@app.get("/generate_report")
def generate_report():
    import pandas as pd
    from data_loader import _dfs
    
    if "Company Details" not in _dfs:
        return {"error": "Company Details not loaded"}

    company_df = _dfs["Company Details"].df
    report_data = []

    for _, row in company_df.iterrows():
        cin = str(row.get("CIN", "")).strip().upper()
        company_name = str(row.get("company", row.get("Company", ""))).strip().upper()
        
        if not cin or cin == "NAN":
            continue
            
        record = {"CIN": cin, "Company Name": company_name}
        
        for sheet, safe_df in _dfs.items():
            df = safe_df.df
            if df.empty:
                record[sheet] = "Missing"
                continue
                
            has_data = False
            cin_cols = [c for c in df.columns if c.upper() in ["CIN", "CINNO", "COMPANYCIN", "COMPANY_CIN"]]
            if cin_cols:
                matches = df[df[cin_cols[0]].astype(str).str.strip().str.upper() == cin]
                if not matches.empty:
                    has_data = True
            
            if not has_data and company_name and company_name != "NAN":
                name_cols = [c for c in df.columns if c.upper() in ["COMPANY", "COMPANY NAME", "LEGAL_NAME", "TRADE_NAME", "ENTITY_NAME", "NAME"]]
                if name_cols:
                    for nc in name_cols:
                        matches = df[df[nc].astype(str).str.strip().str.upper().str.contains(company_name, regex=False, na=False)]
                        if not matches.empty:
                            has_data = True
                            break
            
            record[sheet] = "Present" if has_data else "Missing"
            
        report_data.append(record)

    report_df = pd.DataFrame(report_data)
    output_filename = "Company_Data_Availability_Report.xlsx"
    report_df.to_excel(output_filename, index=False)
    
    return {"status": "success", "file": output_filename, "companies_analyzed": len(report_data)}

@app.get("/", tags=["meta"])
def root():
    return {
        "message": "Corporate Intelligence GraphQL API",
        "graphql_playground": "/graphql",
        "health": "/health",
        "docs": "/docs",
    }
