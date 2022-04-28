import requests
import re
from bs4 import BeautifulSoup
import json

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
    "Java": ["java", "spring boot"],
    "Javascript": ["javascript", "node", "nodejs", "node\.js", "react"],
    "Typescript": ["typescript"],
    "PHP": ["php"],
    "C": [],
    "C#": ["c#"],
    "C++": ["c\+\+"],
    "Objective-C": ["objective\-c"],
    "Swift": ["swift"],
    "Kotlin": ["kotlin"],
    "PostgreSQL": ["postgresql", "postgres", "pgsql"],
    "MySQL": ["mysql", "mariadb"],
    "MongoDB": ["mongo", "mongodb"],
    "Cassandra": ["cassandra"],
    "Oracle": ["oracle"],
    "Elasticsearch": ["elasticsearch"],
    "Redis": ["redis"],
    "Splunk": ["splunk"],    
    "Docker": ["docker", "k8s", "kubernetes"],
    "AWS": ["aws", "amazon web"],
    "GCP": ["gcp", "google cloud"],
    "Azure": ["azure"],
    "Cloudflare": ["cloudflare"]
}

companies_per_tech = {}
companies = {}
for tech in techs:
    companies_per_tech[tech] = set()

for company_id in company_ids:
    r = requests.get("https://climatebase.org/company/"+str(company_id))
    soup = BeautifulSoup(r.text, features="html.parser")
    blocklist = ['style', 'script']
    companies[company_id] = {}
    companies[company_id]["name"] = soup.find("h1").get_text()
    companies[company_id]["techs"] = set()
    text_elements = [t for t in soup.find_all(text=True) if t.parent.name not in blocklist]
    text = "\n".join(text_elements).lower()
    for tech in techs:
        synonyms = techs[tech]
        for synonym in synonyms:
            if(bool(re.search(r"(?<![a-z])"+synonym+r"(?![a-z])", text))):
                companies_per_tech[tech].add(company_id)
                companies[company_id]["techs"].add(tech)
    if(bool(re.search(r"(?<![a-z0-9\-.°&])c(?![a-z0-9&\-\+\)#])", text))): # Avoid Objective-C, C#, C-level, C&I, D.C., C++, c)
        companies_per_tech["C"].add(company_id)
        companies[company_id]["techs"].add("C")

# Allows to serialize sets to JSON
def set_default(obj):
    if isinstance(obj, set):
        return list(obj)
    raise TypeError

with open('src/companies_per_tech.json', 'w') as outfile:
    json.dump(companies_per_tech, outfile, default=set_default)

with open('src/companies.json', 'w') as outfile:
    json.dump(companies, outfile, default=set_default)
    