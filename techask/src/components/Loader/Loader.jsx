import React from 'react';
import './Loader.css'; // Import your CSS file for loader styling

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="content">
        {[...Array(16)].map((_, b) => (
          <div key={b} className="cuboid">
            {[...Array(6)].map((_, s) => (
              <div key={s} className="side"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loader;