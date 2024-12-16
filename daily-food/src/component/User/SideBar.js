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
                    ORDER
                    <ul className="c_subMenu">
                        <li>
                            <Link to="/user/orderProgressing">
                                <i className="fa-regular fa-calendar-days"></i>Progressing
                            </Link>
                        </li>
                        <li>
                            <Link to="/user/orderDone">
                                <i className="fa-regular fa-calendar-days"></i>Done
                            </Link>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
};

export default SideBar;
