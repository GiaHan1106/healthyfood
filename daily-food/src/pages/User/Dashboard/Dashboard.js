import React, { useEffect, useState } from "react";
import { useUser } from "~/context/UserContext";

const Dashboard = () => {
    const { user } = useUser();
    const [userData, setUserData] = useState({});

    useEffect(() => {
        setUserData(user);
    }, [user]);

    return (
        <div className="s-dashboard">
            <div className="s-dashboard_infor">
                <span>Email:</span>
                {userData.email}
            </div>
            <div className="s-dashboard_infor">
                <span>Username:</span>
                {userData.username}
            </div>
        </div>
    );
};

export default Dashboard;
