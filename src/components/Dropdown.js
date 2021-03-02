export const Dropdown = (props) => {
  const dropdownChanged = (e) => {
    props.changed(e.target.value);
  };
  return (
    <div className="col-sm-6 form-group row px-0">
      <label className="form-label col-sm-2">{props.label}</label>
      <select
        value={props.selectedValue}
        onChange={dropdownChanged}
        className="form-control form-control-sm col-sm-10"
      >
        <option key={0}>Select...</option>
        {props.lists.map((data, idx) => {
          return (
            <option key={idx + 1} value={data.id}>
              {data.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};
