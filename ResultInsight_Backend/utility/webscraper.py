# from selenium import webdriver
import requests
from selenium import webdriver
import time
from bs4 import BeautifulSoup
import csv
import os

# Define the result_parser function to process the BeautifulSoup object
reg_no = 18502003054
exam_code = 5617
letters_code = "nEAs"
exam_year = 2022


result_dict = {
    "A+": 4.00,
    "A" : 3.75,
    "A-": 3.50,
    "B+": 3.25,
    "B" : 3.00,
    "B-": 2.75,
    "C+": 2.50,
    "C" : 2.25,
    "D" : 2.00,
    "F" : 0.00,
    'NA' : -1.00,
}
std_info = {}


def save_dict_to_csv(filename:str, data:dict):
    headers = data.keys()
    filepath = 'utility/csv_files/2021-2022.csv'
    file_exists = os.path.isfile(filepath)
    print(file_exists)
    with open(filepath, mode='a' if file_exists else 'w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=headers)
        if not file_exists:
            writer.writeheader()
        writer.writerow(data)




def best_gread(sub_code, sub_gread):
    # print(sub_gread)
    weight = result_dict[sub_gread]
    if sub_code not in std_info:
        return weight
    else:
        return max(std_info[sub_code], weight)
    
def result_parser(soup):
    tables = soup.find_all('table')
    if len(tables) < 4:
        return 404
    flag = 200
    for i in range(2, 4):
        if(i == 2):
            basicinfos = tables[2].find_all('tr')
            for i in range(0, 5):
                line_info = basicinfos[i].find_all('td')
                field = line_info[0].text.strip()
                data = line_info[1].text.strip()
                std_info[field] = data
        else:    
            subjects = tables[3].find_all('tr')
            for i in range(2, len(subjects)):
                sub_data = subjects[i].find_all('td')
                # print(sub_data)
                sub_code = sub_data[0].text.strip()
                sub_name = sub_data[1].text.strip()
                sub_credit = sub_data[2].text.strip()

                sub_gread = sub_data[3].text.strip()
                print("code: ", sub_code, sub_name, sub_gread, sub_credit) 
                std_info[sub_code] = best_gread(sub_code, sub_gread)
                if std_info[sub_code] == 0:
                    flag = 0
    return flag
        # break
# Initialize WebDriver Firefox
# driver = webdriver.Firefox()

# Define your cookie parameters

#Inject the cookie into the browser session
# driver.get('http://results.nu.ac.bd/result.php')  # Navigate to the main page first
# driver.add_cookie({
#             'name' : 'PHPSESSID',
#             'value': '1gs6pt7e4mmkct76gattrfmnu3',
#         })

# Iterate over registration numbers

def parse_nu_page(reg_no, exam_code, exam_year, letters_code, iteration = 1):
    url = f'http://results.nu.ac.bd/cse/cse_result.php?roll_number=&reg_no={reg_no}&exm_code={exam_code}&exam_year={exam_year}&letters_code={letters_code}'
    # Visit the URL
    # print(url)
    # driver.get(url)
    response = requests.get(
    url, 
    headers={ 'User-Agent': 'Mozilla/5.0'}, 
    timeout=10,
    cookies = {
            'PHPSESSID': 'bf3r0i0msh0vh1jcn029c6e590',
        })

    soup = BeautifulSoup(response.text, 'html.parser')

    # Call the result_parser function
    time.sleep(.5)  # Add a short delay between requests (adjust as needed)
    status = web_status = result_parser(soup)
    
    if web_status == 0:
        status = parse_nu_page(reg_no, exam_code, exam_year + 1, letters_code, iteration + 1)
    if iteration == 1 and web_status == 200:
        status = parse_nu_page(reg_no, exam_code, exam_year + 1, letters_code, iteration + 1)
    return min(status, web_status)

start_reg = 21502003073
no_of_sample = 200

exam_codes = list(range(5610, 5619))
exam_years = [2023, 2022, 2022, 2023, 2023, 2024]
for i in range(start_reg, start_reg + no_of_sample):
    std_info.clear()
    reg_no = i
    for i in range(1, 3):
        exam_code = exam_codes[i]
        exam_year = exam_years[i]
        status = parse_nu_page(reg_no, exam_code, exam_year, letters_code)
        print(status)


    
    print(std_info)
    save_dict_to_csv("2018-2019.csv", std_info)

# driver.close()