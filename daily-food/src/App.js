import React, { useEffect } from "react";
import Layout from "./pages/Layout";
import { RouterUser, RouterAdmin, RouterUserLogin } from "~/router/Router";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./scss/index.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Admin from "./pages/Admin";
import Page404 from "./pages/Page404/Page404";
import User from "./pages/User";
import socket from "~/socket/socket";

function App() {
    useEffect(() => {
        // Lắng nghe sự kiện từ server
        socket.on("connect", () => {
            console.log("Connected to Socket.IO server");
        });

        socket.on("message", (data) => {
            console.log("Message from server:", data);
        });

        // Dọn dẹp kết nối khi component bị unmount
        return () => {
            socket.off("connect");
            socket.off("message");
        };
    }, []);

    return (
        <>
            <Routes>
                {RouterUser.map((route, index) => {
                    const Page = route.component;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        ></Route>
                    );
                })}
                {RouterAdmin.map((route, index) => {
                    const Page = route.component;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Admin>
                                    <Page />
                                </Admin>
                            }
                        ></Route>
                    );
                })}
                {RouterUserLogin.map((route, index) => {
                    const Page = route.component;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <User>
                                    <Page />
                                </User>
                            }
                        ></Route>
                    );
                })}
                <Route path="*" element={<Page404></Page404>}></Route>
            </Routes>
            <ToastContainer autoClose={1000} />
        </>
    );
}

export default App;
