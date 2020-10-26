import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="header">
      <div className="navigation">
        <Link to="/races">Upcoming F1 Races</Link>
        <Link to="/race/create">Add New F1 Race</Link>
      </div>
    </div>
  );
}

export default Header;
