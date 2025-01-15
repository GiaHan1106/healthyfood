import React, { useState, useRef, useEffect } from "react";
import { Container } from "react-bootstrap";
import logo from "~/assets/Logo-name.png";
import { Link, useNavigate } from "react-router-dom";
import UseFetch from "~/feature/UseFetch";
import { useCart } from "~/context/CartContext";
import { useUser } from "~/context/UserContext";
const Header = () => {
    const [isSubmenuVisible, setIsSubmenuVisible] = useState(false);
    const Navigate = useNavigate();
    const menuRef = useRef(null);
    const divRef = useRef();
    const iconRef = useRef();
    const [menu, setMenu] = useState(false);
    const { cart, cartRetail } = useCart();
    const { handleLogOut } = useUser();

    const handleShowMenu = () => {
        setMenu(!menu);
    };
    const dataMenu = UseFetch("https://healthy-food.techtheworld.id.vn/catemenu");
    const userinfor = JSON.parse(localStorage.getItem("USERINFO"));

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (e.target === iconRef.current) {
                setMenu(true);
            } else if (!divRef.current.contains(e.target)) {
                setMenu(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className={`header ${menu && "active"}`}>
            <Container>
                <div className="header-inner">
                    <a href="/" className="header-logo">
                        <img src={logo} alt="" />
                    </a>
                    <ul className={`header-menu ${menu && "active"}`} ref={divRef}>
                        <div className="header-menu_close" onClick={() => setMenu(!menu)}>
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                        <li onClick={() => setMenu(false)}>
                            <Link to="/">HOME</Link>
                        </li>
                        <li onClick={() => setMenu(false)}>
                            <Link to="/about">ABOUT</Link>
                        </li>
                        <li className={`header-menu_showmenu ${menu && "active"}`} ref={menuRef}>
                            <Link onClick={() => setIsSubmenuVisible((prev) => !prev)}>COMBO</Link>
                            <ul className={`header-menu_showmenu_child ${isSubmenuVisible ? "active" : ""}`}>
                                {dataMenu.map((menu) => (
                                    <li key={menu.id} onClick={() => setMenu(false)}>
                                        <Link to={`/menu/${menu.catemenu_title.toLowerCase()}-${menu.catemenu_id}`} onClick={() => setIsSubmenuVisible(false)}>
                                            <img src={menu.catemenu_image} alt="" />
                                            {menu.catemenu_title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>

                        <li onClick={() => setMenu(false)}>
                            <Link to="/order"> ORDERS</Link>
                        </li>
                        <li onClick={() => setMenu(false)}>
                            <Link to="/calories">CALORIES</Link>
                        </li>
                        <li onClick={() => setMenu(false)}>
                            <Link to="/recipe">RECIPES</Link>
                        </li>
                    </ul>

                    <div className="header-box">
                        <div className="header-search">
                            <input type="text" placeholder="Search" />
                            <div className="header-search_icon">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </div>
                        </div>
                        <div className="header-icon">
                            {userinfor ? (
                                <div className="header-icon_user">
                                    <h4>
                                        Hello <span>{userinfor.username}</span>
                                    </h4>
                                    <div className="header-icon_user_infor">
                                        <i className="fa-solid fa-square-caret-down"></i>
                                        <ul>
                                            <li onClick={() => Navigate("/user/Dashboard")}>Account</li>
                                            <li onClick={handleLogOut}>Log Out</li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="header-icon">
                                    <i className="fa-solid fa-circle-user"></i>
                                </Link>
                            )}
                            <Link to="/Cart" className="header-icon_child">
                                <i className="fa-solid fa-cart-shopping"></i> <span>{cart.length + cartRetail.length}</span>
                            </Link>
                        </div>
                        <div className="header-iconmenu" onClick={handleShowMenu}>
                            <i className="fa-solid fa-bars-staggered" ref={iconRef}></i>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Header;
