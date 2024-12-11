import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
    return (
        <div className="c-dashboardUser">
            <ul className="c_menu">
                <li>
                    <Link to="/user/dashboard">DASHBOARD</Link>
                </li>
                <li>
                    <Link to="/user/userorder">ORDER</Link>
                </li>
            </ul>
        </div>
    );
};

export default SideBar;
