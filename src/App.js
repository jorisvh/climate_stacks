import React, {useState} from "react";
import logo from './logo.svg';
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
    php: "PHP",
    c: "C",
    cs: "C#",
    cpp: "C++",
    swift: "Swift",
    typescript: "Typescript",
    kotlin: "Kotlin"
  };
  
  const languages = ["ruby", "python", "java", "javascript", "php", "c", "cs", "cpp", "swift", "kotlin", "typescript"];
  const databases = [];
  const [techToggles, setTechToggles] = useState({});
  const toggleTech = (tech, v) => {
    setTechToggles((previous) => ({...techToggles, [tech]: !previous[tech] }))
  };
  const filteredCompanies = Object.entries(companies).filter(([companyId, companyName]) => {
    const entries = Object.entries(techs);
    for(let i = 0; i < entries.length; i++) {
      const [symbol, name] = entries[i];
      if(techToggles[symbol] && !companies_per_tech[name].includes(parseInt(companyId))) {
        return false;
      }
    }
    return true;
  });
  return (
    <div class="container">
      <div class="row">
        <div class="col-sm-3">
          <div class="card m-3">
            <div class="card-body">
              <h5 class="card-title">Languages</h5>  
              {languages.map(symbol => 
                <TechnologyToggle key={symbol} checked={techToggles[symbol]} onClick={() => toggleTech(symbol)} text={techs[symbol]} />
              )}
            </div>
          </div>
          <div class="card m-3">
            <div class="card-body">
              <h5 class="card-title">Databases</h5>  
              {databases.map(symbol => 
                <TechnologyToggle key={symbol} checked={techToggles[symbol]} onClick={() => toggleTech(symbol)} text={techs[symbol]} />
              )}
            </div>
          </div>
        </div>
        <div class="col-sm-9">
          {filteredCompanies.map(([companyId, company]) =>
            <Company companyId={companyId} company={company} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
