# Corporate Intelligence Dashboard & GraphQL API

A full-stack application featuring a React-based interactive dashboard and a FastAPI + Strawberry GraphQL backend. It serves a 37-sheet corporate intelligence database directly from an Excel workbook (`Data Subscription Data points Sample data.xlsx`).

The application exposes endpoints and visualizes diverse corporate domains including company profiles, financials, legal/litigation cases (NCLT, DRT, IBBI), credit ratings, market data, and operational signals (EPFO, GST, News).

---

## 🛠️ Setup & Installation

### 1. Prerequisites
Make sure you have **Python 3.8+** and **Node.js 18+** installed on your system.

### 2. Configure Environment Variables
Copy the provided `.env.example` file to create a `.env` file in the root directory:
*   **`EXCEL_PATH`**: Path to your Excel database file (defaults to `Data Subscription Data points Sample data.xlsx`).
*   **`VITE_GRAPHQL_ENDPOINT`**: The URL where your frontend will look for the backend API.

### 3. Install Backend Dependencies
Activate your virtual environment and install the required Python libraries:

**Using Command Prompt (`cmd`):**
```cmd
.\venv\Scripts\pip install -r requirements.txt
```

### 4. Install Frontend Dependencies
Navigate to the `ui` directory and install the Node.js packages:
```cmd
cd ui
npm install
```

---

## 🚀 Running the Application

You will need two terminal windows to run both the backend API and the frontend UI concurrently.

### 1. Start the Backend API (Terminal 1)
From the root directory, start the FastAPI server:
```cmd
.\venv\Scripts\uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend UI (Terminal 2)
From the `ui` directory, start the Vite development server:
```cmd
cd ui
npm run dev
```

---

## 🌐 Application URLs

Once the servers start, you can access the following:

* **Interactive Dashboard (React UI)**: [http://localhost:5173](http://localhost:5173) (or the port specified by Vite)
  *Use this to search for companies and browse their data profiles visually.*
* **Interactive GraphQL Playground (GraphiQL)**: [http://localhost:8000/graphql](http://localhost:8000/graphql)  
  *Use this to write raw queries and explore the full backend schema.*
* **Swagger UI (REST documentation)**: [http://localhost:8000/docs](http://localhost:8000/docs)  

---

## 🔍 Recommended Sample Companies

The backend automatically configures three data-rich sample companies to make testing easy. You can search for these directly in the UI Dashboard or query them in the GraphQL playground:

1. **Tata Consultancy Services Limited** (`L22210MH1995PLC084781`)
2. **Sprng Energy Private Limited** (`U74999TN2016PTC162587`)
3. **Neev Energy LLP** (`AAA-1769`)

### Get Company Profile (GraphQL Example)
```graphql
query GetProfile {
  company(cin: "L22210MH1995PLC084781") {
    cin
    company
    dateOfIncorporation
    authorisedCapital
    paidUpCapital
    financials {
      year
      title
      amount
    }
  }
}
```

---

## 📑 Test Suite & Query Library
For a complete list of structured GraphQL queries covering **Financial statements, NCLT cases, GST registration details, EPFO payroll filings, Share prices, and Audit reports**, refer to the [example_queries.http](example_queries.http) file.
