import React from "react";
import Footer from "~/component/Footer/Footer";
import Header from "~/component/Header/Header";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
    const location = useLocation();
    const hideFooter = location.pathname.startsWith("/Cart");
    return (
        <>
            <Header></Header>
            {children}
            <Footer hideFooter={hideFooter}></Footer>
        </>
    );
};

export default Layout;
