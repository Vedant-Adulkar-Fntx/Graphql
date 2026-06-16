# Corporate Intelligence GraphQL API

A FastAPI + Strawberry GraphQL prototype that serves a 37-sheet corporate intelligence database directly from an Excel workbook (`Data Subscription Data points Sample data.xlsx`). 

The application exposes endpoints to query diverse corporate domains including company profiles, financials, legal/litigation cases (NCLT, DRT, IBBI), credit ratings, market data, and operational signals (EPFO, GST, News).

---

## 🛠️ Setup & Installation

### 1. Prerequisites
Make sure you have **Python 3.8+** installed on your system.

### 2. Configure the Excel Data File
By default, the application looks for an Excel file named **`Data Subscription Data points Sample data.xlsx`** inside this project directory.
* If your file is named differently or located elsewhere, you can configure it via the `EXCEL_PATH` environment variable.

### 3. Install Dependencies
Activate your virtual environment and install the required libraries:

**Using Command Prompt (`cmd`):**
```cmd
.\venv\Scripts\pip install -r requirements.txt
```

**Using PowerShell:**
```powershell
.\venv\Scripts\pip install -r requirements.txt
```

*Note: If local execution is blocked by group policy, you can install them using the system Python:*
```cmd
python -m pip install -r requirements.txt
```

---

## 🚀 Running the Application

Start the development server with `uvicorn`:

**Using virtual environment's uvicorn:**
```cmd
.\venv\Scripts\uvicorn main:app --reload --port 8000
```

**Using global python:**
```cmd
python -m uvicorn main:app --reload --port 8000
```

---

## 🌐 Endpoints

Once the server starts, the following URLs will be available:

* **Interactive GraphQL Playground (GraphiQL)**: [http://localhost:8000/graphql](http://localhost:8000/graphql)  
  *Use this in your browser to write queries, explore the full schema, and run requests.*
* **Swagger UI (REST documentation)**: [http://localhost:8000/docs](http://localhost:8000/docs)  
  *Exposes metadata endpoints and health checks.*
* **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)  
  *Returns the list of Excel sheets loaded successfully by pandas.*

---

## 🔍 Sample Queries

Here are a few quick GraphQL queries you can copy-paste into the Playground at `/graphql`.

### Discover Registered Companies
Gets the first 5 companies loaded in the database (helpful to find a valid `cin` for profiling):
```graphql
query ListCompanies {
  companies(pagination: { page: 0, pageSize: 5 }) {
    cin
    company
    regState
    regCity
  }
}
```

### Get Company Profile
Retrieve a unified profile containing general details, directors, and credit ratings for a company:
```graphql
query GetProfile($cin: String!) {
  company(cin: $cin) {
    cin
    company
    dateOfIncorporation
    authorisedCapital
    paidUpCapital
    directors {
      name
      designation
    }
    creditRatings {
      rating
      outlook
      craName
    }
  }
}
```
*Pass a valid CIN in the variables pane, or test directly:*
```json
{
  "cin": "YOUR_DISCOVERED_CIN"
}
```

---

## 📑 Test Suite & Query Library
For a complete list of structured GraphQL queries (covering **Financial statements, NCLT cases, GST registration details, EPFO payroll filings, Share prices, and Audit reports**), refer to the [example_queries.http](example_queries.http) file.
