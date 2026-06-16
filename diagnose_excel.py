import pandas as pd
import os

excel_path = "Data Subscription Data points Sample data.xlsx"
cin_to_check = "L22210MH1995PLC084781"  # Replace with the CIN you are testing if different

if not os.path.exists(excel_path):
    print(f"Error: Excel file '{excel_path}' not found!")
    exit(1)

print(f"Loading Excel file: {excel_path}...")
xl = pd.ExcelFile(excel_path)

print(f"\nScanning sheets for CIN: {cin_to_check}\n" + "-"*50)
for sheet_name in xl.sheet_names:
    df = xl.parse(sheet_name)
    # Strip column names
    df.columns = [str(c).strip() for c in df.columns]
    
    # Try to find a CIN-like column
    cin_col = None
    for col in df.columns:
        if col.upper() in ["CIN", "CINNO", "CIN NO", "COMPANY CIN"]:
            cin_col = col
            break
            
    if cin_col:
        # Filter matching rows
        df[cin_col] = df[cin_col].astype(str).str.strip().str.upper()
        matches = df[df[cin_col] == cin_to_check.upper()]
        print(f"Sheet: {sheet_name:<25} | Column matched: {cin_col:<8} | Rows found: {len(matches)}")
    else:
        # Check if we can match by company name if the sheet has "company" column
        comp_col = None
        for col in df.columns:
            if col.upper() in ["COMPANY", "COMPANYNAME", "COMPANY_NAME", "ISSUER", "ESTABLISHMENT_NAME", "ESTABLISHMENT NAME"]:
                comp_col = col
                break
        if comp_col:
            print(f"Sheet: {sheet_name:<25} | Column matched: {comp_col:<8} | (No CIN column, name-match only)")
        else:
            print(f"Sheet: {sheet_name:<25} | No CIN or Company column found")
