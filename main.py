"""
main.py — FastAPI + Strawberry GraphQL application
Start: uvicorn main:app --reload --port 8000
Playground: http://localhost:8000/graphql
"""
import os
import logging
import sys
from contextlib import asynccontextmanager

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


@app.get("/", tags=["meta"])
def root():
    return {
        "message": "Corporate Intelligence GraphQL API",
        "graphql_playground": "/graphql",
        "health": "/health",
        "docs": "/docs",
    }
