import React from "react";
import { Link, useLocation } from "react-router-dom";

const SideBar = () => {
    const location = useLocation(); // Lấy thông tin đường dẫn hiện tại

    return (
        <div className="c-dashboardUser">
            <ul className="c_menu">
                <li>
                    <Link to="/user/dashboard" className={location.pathname === "/user/dashboard" ? "active" : ""}>
                        DASHBOARD
                    </Link>
                </li>
                <li>
                    ORDER
                    <ul className="c_subMenu">
                        <li className={location.pathname === "/user/orderProgressing" ? "active" : ""}>
                            <Link to="/user/orderProgressing">
                                <i className="fa-solid fa-hourglass-half"></i>Progressing
                            </Link>
                        </li>
                        <li className={location.pathname === "/user/orderDone" ? "active" : ""}>
                            <Link to="/user/orderDone">
                                <i className="fa-solid fa-circle-check"></i>Delivered
                            </Link>
                        </li>
                        <li className={location.pathname === "/user/orderCancel" ? "active" : ""}>
                            <Link to="/user/orderCancel">
                                <i className="fa-solid fa-circle-xmark"></i>Cancel
                            </Link>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
};

export default SideBar;
