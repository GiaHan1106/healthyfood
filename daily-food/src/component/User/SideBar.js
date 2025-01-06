import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SideBar = () => {
    const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State để theo dõi trạng thái của menu

    // Hàm để toggle menu khi màn hình nhỏ
    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const handleMenuClose = () => {
        setIsMenuOpen(false);
    };
    return (
        <div className="c-dashboardUser">
            <div className="c-dashboardUser_submenu" onClick={handleMenuToggle}>
                <i className="fa-solid fa-bars"></i>
            </div>
            {/* Menu cho desktop */}
            <ul className="c_menu c_menu_desktop">
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
            {/* Menu cho mobile */}
            <ul className={`c_menu c_menu_mobile ${isMenuOpen ? "open" : ""}`}>
                <li onClick={handleMenuClose} className={location.pathname === "/user/dashboard" ? "active" : ""}>
                    <Link to="/user/dashboard">DASHBOARD</Link>
                </li>
                <li onClick={handleMenuClose} className={location.pathname === "/user/orderProgressing" ? "active" : ""}>
                    <Link to="/user/orderProgressing">Progressing</Link>
                </li>
                <li onClick={handleMenuClose} className={location.pathname === "/user/orderDone" ? "active" : ""}>
                    <Link to="/user/orderDone">Delivered</Link>
                </li>
                <li onClick={handleMenuClose} className={location.pathname === "/user/orderCancel" ? "active" : ""}>
                    <Link to="/user/orderCancel">Cancel</Link>
                </li>
            </ul>
        </div>
    );
};

export default SideBar;
