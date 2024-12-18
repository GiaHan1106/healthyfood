import React from "react";
import { Link, useLocation } from "react-router-dom";

const SideBar = () => {
    const location = useLocation(); // Lấy thông tin đường dẫn hiện tại

    return (
        <div className="c-dashboard">
            <h2>Dashboard</h2>
            <ul className="c_menu">
                <li>
                    <Link to="" className={location.pathname === "/" ? "active" : ""}>
                        <i className="fa-solid fa-house"></i>Menu Manage
                    </Link>
                    <ul className="c_subMenu">
                        <li>
                            <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
                                <i className="fa-solid fa-landmark"></i>Revenue
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/catemenu" className={location.pathname === "/admin/catemenu" ? "active" : ""}>
                                <i className="fa-solid fa-folder-plus"></i>Cate Menu
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/daymenu" className={location.pathname === "/admin/daymenu" ? "active" : ""}>
                                <i className="fa-regular fa-calendar-days"></i>Day Menu
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/foodmenu" className={location.pathname === "/admin/foodmenu" ? "active" : ""}>
                                <i className="fa-solid fa-bowl-food"></i>Food Menu
                            </Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link to="" className={location.pathname === "/admin/orders" ? "active" : ""}>
                        <i className="fa-solid fa-chart-bar"></i>Orders Manage
                    </Link>
                    <ul className="c_subMenu">
                        <li>
                            <Link to="/admin/orderProgressingAdmin" className={location.pathname === "/admin/orderProgressingAdmin" ? "active" : ""}>
                                <i className="fa-solid fa-hourglass-half"></i>Progressing
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/orderDoneAdmin" className={location.pathname === "/admin/orderDoneAdmin" ? "active" : ""}>
                                <i className="fa-solid fa-circle-check"></i>Delivered
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/orderCancelAdmin" className={location.pathname === "/admin/orderCancelAdmin" ? "active" : ""}>
                                <i className="fa-solid fa-circle-xmark"></i>Cancel
                            </Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link to="/admin/usermanage" className={location.pathname === "/admin/usermanage" ? "active" : ""}>
                        <i className="fa-sharp fa-solid fa-address-book"></i>User Manage
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default SideBar;
