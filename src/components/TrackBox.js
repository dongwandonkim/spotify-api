export const TrackBox = (props) => {
  const clicked = (e) => {
    e.preventDefault();
    props.clicked(e.target.id);
  };
  return (
    <div className="col-sm-6 px-0">
      <div className="list-group">
        {props.lists.map((list, idx) => {
          return (
            <button
              key={idx}
              id={list.track.id}
              onClick={clicked}
              className="list-group-item list-group-item-action list-group-item-light"
            >
              {list.track.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
