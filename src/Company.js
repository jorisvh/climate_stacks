

function Company(props) {
  const otherTechs = props.excludedTechs.filter(tech => props.company.techs.includes(tech));
  return (
    <div class="card m-3">
      <div class="card-body">
        <h5 class="card-title">{props.company.name}</h5>
        {/* I'm looping on excludedTechs and not on company.techs because I want to keep the order of excludedTech */}
        {otherTechs.length > 0 && 
          <p class="card-text">{props.company.name}'s other techs : {otherTechs.join(", ")}</p>
        }
        <a href={"https://climatebase.org/company/"+props.companyId} class="card-link">{props.company.name}'s page on Climate Base</a>
      </div>
    </div>
  );
}

export default Company;
