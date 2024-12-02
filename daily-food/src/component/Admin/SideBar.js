import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
    return (
        <div className="c-dashboard">
            <h2>Dashboard</h2>
            <ul className="c_menu">
                <li>
                    <Link to="">
                        <i className="fa-solid fa-house"></i>Menu Manage
                    </Link>
                    <ul className="c_subMenu">
                        <li>
                            <Link to="/admin/catemenu">
                                <i className="fa-regular fa-calendar-days"></i>Cate Menu
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/daymenu">
                                <i className="fa-regular fa-calendar-days"></i>Day Menu
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/foodmenu">
                                <i className="fa-solid fa-bowl-food"></i>Food Menu
                            </Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link to="/admin/ordermanage">
                        <i className="fa-solid fa-image"></i>Orders Manage
                    </Link>
                </li>
                <li>
                    <Link to="/admin/usermanage">
                        <i className="fa-solid fa-pen-to-square"></i>User Manage
                    </Link>
                </li>
                <li>
                    <Link to="/admin/contactmanage">
                        <i className="fa-sharp fa-solid fa-address-book"></i>Contact Manage
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default SideBar;
