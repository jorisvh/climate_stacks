

function Company(props) {
  return (
    <div class="card m-3">
      <div class="card-body">
        <h5 class="card-title">{props.company.name}</h5>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <a href={"https://climatebase.org/company/"+props.companyId} class="card-link">{props.company.name}'s page on Climate Base</a>
      </div>
    </div>
  );
}

export default Company;
