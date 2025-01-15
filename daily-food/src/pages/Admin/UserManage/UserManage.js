import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

const UserManage = () => {
    const [user, setUser] = useState([]);

    // Fetch dữ liệu từ API
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("https://healthy-food.techtheworld.id.vn/user");
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        // Fetch ngay lần đầu và sau đó lặp lại mỗi 3 giây
        fetchUser();
        const interval = setInterval(fetchUser, 3000);

        // Dọn dẹp interval khi component unmount
        return () => clearInterval(interval);
    }, []);
    console.log(user);

    return (
        <div className="orderManage">
            <div className="orderManage-table">
                <h4>User Management</h4>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Permission</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user &&
                            user
                                .filter((item) => item.user_permissions === 0)
                                .map((item) => (
                                    <tr key={item.user_id}>
                                        <td>{item.user_id || "N/A"}</td>
                                        <td>{item.user_user || "N/A"}</td>
                                        <td>{item.user_email || "Unknown"}</td>
                                        <td>{"Customer"}</td>
                                    </tr>
                                ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default UserManage;
