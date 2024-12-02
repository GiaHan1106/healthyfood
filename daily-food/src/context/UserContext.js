import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();
const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(localStorage.getItem("USERINFO") ? JSON.parse(localStorage.getItem("USERINFO")) : {});
    const getUserLogin = (userInfo) => {
        setUser(userInfo);
        localStorage.setItem("USERINFO", JSON.stringify(userInfo));
    };
    const handleLogOut = () => {
        try {
            localStorage.removeItem("USERINFO");
            setUser({});
            navigate("/login");
        } catch (error) {
            console.error("Error during logout: ", error);
        }
    };
    return <UserContext.Provider value={{ getUserLogin, handleLogOut, user }}>{children}</UserContext.Provider>;
};
const useUser = () => {
    return useContext(UserContext);
};
export { UserProvider, useUser };
