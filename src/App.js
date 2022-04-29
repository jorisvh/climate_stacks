import React, {useState} from "react";
import './App.css';
import companies from './companies.json';
import companies_per_tech from './companies_per_tech.json';
import Company from './Company.js';
import TechnologyToggle from './TechnologyToggle';

function App() {
  const techs = {
    ruby: "Ruby",
    python: "Python",
    java: "Java",
    javascript: "Javascript",
    typescript: "Typescript",
    php: "PHP",
    c: "C",
    cs: "C#",
    cpp: "C++",
    objective_c: "Objective-C",
    swift: "Swift",    
    kotlin: "Kotlin",
    postgresql: "PostgreSQL",
    mysql: "MySQL",
    mongodb: "MongoDB",
    cassandra: "Cassandra",
    oracle: "Oracle",
    elasticsearch: "Elasticsearch",
    redis: "Redis",
    splunk: "Splunk",
    docker: "Docker",
    aws: "AWS",
    gcp: "GCP",
    azure: "Azure",
    cloudflare: "Cloudflare",
  };
  
  const languages = ["ruby", "python", "java", "javascript", "typescript", "php", "c", "cs", "cpp", "objective_c", "swift", "kotlin"];
  const databases = ["postgresql", "mysql", "mongodb", "cassandra", "oracle", "elasticsearch", "redis", "splunk"];
  const others = ["docker", "aws", "gcp", "azure", "cloudflare"];
  const [selectedTechs, setSelectedTech] = useState({});
  const toggleTech = (tech, v) => {
    setSelectedTech((previous) => ({...selectedTechs, [tech]: !previous[tech] }))
  };
  const excludedTechs = Object.entries(techs).filter(([symbol, name]) => !selectedTechs[symbol]).map(([symbol, name]) => name);
  const filteredCompanies = Object.entries(companies).filter(([companyId, company]) => {
    const entries = Object.entries(techs);
    for(let i = 0; i < entries.length; i++) {
      const [symbol, name] = entries[i];
      if(selectedTechs[symbol] && !companies_per_tech[name].includes(parseInt(companyId))) {
        return false;
      }
    }
    return true;
  });
  return (
    <div class="container">
      <div class="m-3">
        <h1>Climate stacks</h1>
        <p>Filter hiring Climate Tech companies by their tech stacks. Source: <a href="https://climatebase.org/" class="card-link">climatebase.org</a></p>
      </div>
      <div class="row">
        <div class="col-sm-3">
          <div class="card m-3">
            <div class="card-body">
              <h5 class="card-title">Languages</h5>  
              {languages.map(symbol => 
                <TechnologyToggle key={symbol} checked={selectedTechs[symbol]} onClick={() => toggleTech(symbol)} text={techs[symbol]} />
              )}
            </div>
          </div>
          <div class="card m-3">
            <div class="card-body">
              <h5 class="card-title">Databases</h5>  
              {databases.map(symbol => 
                <TechnologyToggle key={symbol} checked={selectedTechs[symbol]} onClick={() => toggleTech(symbol)} text={techs[symbol]} />
              )}
            </div>
          </div>
          <div class="card m-3">
            <div class="card-body">
              <h5 class="card-title">Others</h5>  
              {others.map(symbol => 
                <TechnologyToggle key={symbol} checked={selectedTechs[symbol]} onClick={() => toggleTech(symbol)} text={techs[symbol]} />
              )}
            </div>
          </div>
        </div>
        <div class="col-sm-9">
          {filteredCompanies.map(([companyId, company]) =>
            <Company companyId={companyId} company={company} excludedTechs={excludedTechs} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
