export const Dropdown = (props) => {
  const dropdownChanged = (e) => {
    props.changed(e.target.value);
  };
  return (
    <div>
      <select value={props.selectedValue} onChange={dropdownChanged}>
        {props.lists.map((data, idx) => {
          return (
            <option key={idx} value={data.id}>
              {data.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};
