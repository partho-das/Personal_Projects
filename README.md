# DPDC Statement Analyzer

## Overview

This is a personal utility project designed to analyze DPDC (Dhaka Power Distribution Company) electricity bills.  The project extracts data from PDF statements, calculates monthly summaries, and aims to provide a cross-matching feature to help verify bill accuracy against DPDC records.

## Features

- **Data Extraction:** Extracts relevant data like dates, consumption, charges, and rebates from DPDC PDF statements using the `pdfplumber` Python library.
- **Monthly Summary:** Calculates and presents monthly totals for key figures such as consumption, rebates, VAT, and recharge amounts.
- **Data Validation:** Aims to allow cross-matching of extracted data with DPDC records with "My Current Balance" Field.

## Getting Started

### Prerequisites

- **`pdfplumber` Package:** Install using pip: `pip install pdfplumber`
- **DPDC PDF Statement:** Place your DPDC downloaded statement (e.g., "statement.pdf") in the same directory as the script. 

### Usage

1. Place your DPDC bill statement (PDF format) named "statement.pdf" in the project directory.
2. Run the script: `python extractor.py`
3. The script will generate two CSV files:
   - `bill_details.csv`: Contains the extracted data from your statement.
   - `monthly_bill_summary.csv`: Provides a monthly breakdown of consumption, charges, and other details.

## Contributing

Contributions are welcome! If you have ideas for improvement or would like to collaborate, please feel free to create issues or pull requests. 