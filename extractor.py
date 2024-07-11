import pdfplumber
import csv
import re

pdf_path = "statement.pdf"

def extract_data_from_pdf(pdf_path):
    """Extracts data from the PDF, skipping the last table on the last page."""
    with pdfplumber.open(pdf_path) as pdf:
        my_current_balance = 0
        detail_data = []
        for page in reversed(pdf.pages):
            tables = page.extract_tables()
            for table in reversed(tables):
                if page == pdf.pages[0] and table == tables[0]:
                    print(table)
                    continue  # Skip the last table
                for row in reversed(table):
                    if row[0] == 'Date(From - To)':  # Skip header row
                        continue
                    row[3] = float(row[3].replace("BDT", ""))
                    row[4] = float(row[4].replace("BDT", ""))
                    my_current_balance = (my_current_balance - row[3] 
                                          if row[1] in ["Charge", "VAT"] 
                                          else my_current_balance + row[3])
                    my_current_balance = round(my_current_balance, 2)
                    row.append(my_current_balance)
                    cost_per_unit = round(row[3] / float(row[2]), 2) if row[1] == "Charge" else "NA"
                    row.insert(3, cost_per_unit)
                    detail_data.append(row)

        detail_data.reverse()
        detail_data.insert(0, ["Date(From - To)", "Transaction", "Consumption Units(kWh)", "Cost Per/Unit", "Amount", "Current Balance", "My Current Balance"])
        return detail_data
    
def create_monthly_summary(detail_data):
    """Creates a monthly summary from the detailed data."""
    monthly_summary = {}
    for row in detail_data[1:]:
        date_range_str = row[0]
        transaction_type = row[1]
        amount = float(row[4])

        match = re.search(r"(\d{4}-\d{2})", date_range_str)
        if not match:
            continue
        month_year = match.group(1)

        if month_year not in monthly_summary:
            monthly_summary[month_year] = {
                "Total Consumption": 0,
                "Total Rebate": 0,
                "Total VAT": 0,
                "Total Recharge": 0,
            }

        if transaction_type == "Charge":
            monthly_summary[month_year]["Total Consumption"] += amount
            monthly_summary[month_year]["Total Consumption"] = round( monthly_summary[month_year]["Total Consumption"], 2)

        elif transaction_type == "Rebate Amount":
            monthly_summary[month_year]["Total Rebate"] += amount
        elif transaction_type == "VAT":
            monthly_summary[month_year]["Total VAT"] += amount
        elif transaction_type == "Recharge":
            monthly_summary[month_year]["Total Recharge"] += amount
    return monthly_summary

def write_data_to_csv(filename, data, fieldnames=None):
    """Writes data to a CSV file."""
    with open(f"csv/{filename}", "w", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames) if fieldnames else csv.writer(csvfile)
        if fieldnames:
            writer.writeheader()
        for row in data:
            writer.writerow(row)

detail_data = extract_data_from_pdf(pdf_path)

write_data_to_csv("bill_details.csv", detail_data)

monthly_summary = create_monthly_summary(detail_data)
monthly_summary_list = [{"Month": month, **data} for month, data in monthly_summary.items()]
write_data_to_csv("monthly_bill_summary.csv", monthly_summary_list, fieldnames=["Month", "Total Consumption", "Total Rebate", "Total VAT", "Total Recharge"])