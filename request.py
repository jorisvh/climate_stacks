import requests
import pdfkit
import re
from bs4 import BeautifulSoup

body = ""

company_ids = set()
sectors = ["Carbon Removal Tech", "Buildings", "Advocacy or Policy", "Capital", "Climate Adaptation", "Coastal & Ocean Sinks", "Energy", "Food, Agriculture, & Land Use", "Materials & Manufacturing", "Media & Journalism", "Research & Education", "Transportation"]
for sector in sectors:
    payload = '{"query":"","page":"0","hitsPerPage":1000,"clickAnalytics":true,"filters":"sectors:\\"'+sector+'\\" AND active_jobs_count != 0","facets":["*","active","categories","job_types","sectors","drawdown_solutions","org_types","org_sizes"],"facetFilters":[["active:true"]]}'
    headers = {"x-algolia-api-key": "d2ebe27d3cc3d35fea04da7b1b0718a8", "x-algolia-application-id": "8PSNFFQTXQ"}
    r = requests.post('https://8psnffqtxq-dsn.algolia.net/1/indexes/Employer_production/query', data=payload, headers=headers)
    hits = r.json()["hits"]
    for hit in hits:
        company_id = hit["smart_job_board_id"]
        if company_id != "None":
            company_ids.add(int(company_id))

techs = {
    "Ruby": ["ruby", "rails", "ror"],
    "Python": ["python", "django"],
    "Java": ["java"],
    "Javascript": ["javascript"],
    "PHP": ["php"],
    "C": [],
    "C#": ["c#"],
    "C++": ["c\+\+"],
    "Swift": ["swift"],
    "Typescript": ["typescript"],
    "Swift": ["swift"],
    "Kotlin": ["kotlin"],
}

companies_per_tech = {}
company_names = {}
for tech in techs:
    companies_per_tech[tech] = set()

for company_id in company_ids:
    r = requests.get("https://climatebase.org/company/"+str(company_id))
    soup = BeautifulSoup(r.text, features="html.parser")
    blocklist = ['style', 'script']
    company_names[company_id] = soup.find("h1").get_text()
    text_elements = [t for t in soup.find_all(text=True) if t.parent.name not in blocklist]
    text = "\n".join(text_elements).lower()
    for tech in techs:
        synonyms = techs[tech]
        for synonym in synonyms:
            if(bool(re.search(r"(?<![a-z])"+synonym+r"(?![a-z])", text))):
                companies_per_tech[tech].add(company_id)
    if(bool(re.search(r"(?<![a-z0-9\-.°&])c(?![a-z0-9&\-\+\)#])", text))): # Avoid Objective-C, C#, C-level, C&I, D.C., C++, c)
        companies_per_tech["C"].add(company_id)


for tech, companies in companies_per_tech.items():
    body += "<h1>" + str(tech) + "</h1><br />"
    for company_id in companies:
        body += "<a href=\"https://climatebase.org/company/"+str(company_id)+"\">"+company_names[company_id]+"</a>, "



pdfkit.from_string(body, 'report.pdf')