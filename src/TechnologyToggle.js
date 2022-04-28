function TechnologyToggle(props) {
    const labelClick = (e) => {
        e.preventDefault();
        props.onClick();
    };
    return (
        <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id={"checkbox-"+props.text} checked={props.checked} onClick={props.onClick} />
            <label class="form-check-label" for={"checkbox-"+props.text} onClick={labelClick}>
                {props.text}
            </label>
        </div>
    );
  }
  
  export default TechnologyToggle;