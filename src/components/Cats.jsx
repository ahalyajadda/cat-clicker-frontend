import React from 'react';

function Cats(props) {
  return (
    <div className="cat-card">
      <div className="content">
        <h3>{props.item.name}</h3>
        <p>No of times clicked:{props.item.visits}</p>
      </div>
      <img src={props.item.catImage} alt="image" />
      <div>
        {props.middle === 'yes' ? (
          <div className="content">
            <p>{props.item.nickNames}</p>
            <p>{props.item.catAge}</p>
          </div>
        ) : (
          ''
        )}
        <a href="">Card Link</a>
      </div>
    </div>
  );
}

export default Cats;
