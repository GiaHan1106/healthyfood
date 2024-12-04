import { useState, useEffect } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UseFetch from "~/feature/UseFetch";

const OrderManage = () => {
    const Navigate = useNavigate();
    const [showDetailOrder, setShowDetailOrder] = useState({});
    const [show, setShow] = useState(false);
    const [locationData, setLocationData] = useState({ provinces: [], districts: [], wards: [] });

    const listOrder = UseFetch("http://localhost:8081/orders");

    useEffect(() => {
        // Fetch location data only once when the component mounts
        const fetchLocationData = async () => {
            try {
                const provincesResponse = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
                const provinces = await provincesResponse.json();

                const districtsResponse = await fetch(`https://esgoo.net/api-tinhthanh/2/{districtId}.htm`);
                const districts = await districtsResponse.json();

                const wardsResponse = await fetch(`https://esgoo.net/api-tinhthanh/3/{districtId}.htm`);
                const wards = await wardsResponse.json();

                setLocationData({ provinces, districts, wards });
            } catch (error) {
                console.error("Error fetching location data:", error);
            }
        };

        fetchLocationData();
    }, []);

    const handleShowDetail = (order) => {
        let parsedInfo = {};

        if (typeof order.information === "string") {
            try {
                parsedInfo = JSON.parse(order.information);
            } catch (error) {
                console.error("Error parsing information:", error);
            }
        } else {
            parsedInfo = order.information;
        }

        setShowDetailOrder({ ...parsedInfo, ...order });
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        Navigate("/admin/ordermanage");
    };

    const handleStatusChange = async (event, orderId) => {
        const newStatus = event.target.value;
        try {
            const response = await fetch(`http://localhost:8081/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                console.log(`Order ID: ${orderId} status updated to ${newStatus}`);
            } else {
                console.error(`Failed to update status for Order ID: ${orderId}`);
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div className="orderManage">
            <div className="orderManage-table">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Code Discount</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Seen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listOrder &&
                            listOrder.map((item) => {
                                const userInfo = JSON.parse(item.information);
                                return (
                                    <tr key={item.id}>
                                        <td>{userInfo.fullname || "Unknown"}</td>
                                        <td>{userInfo.email || "N/A"}</td>
                                        <td>{userInfo.phone || "N/A"}</td>
                                        <td>
                                            {userInfo.address}, {userInfo.wards}, {locationData.district}, {locationData.province}
                                        </td>
                                        <td>{item.codeDiscount || "N/A"}</td>
                                        <td>{item.payment || "N/A"}</td>
                                        <td>
                                            <select value={item.status || "Progressing"} onChange={(e) => handleStatusChange(e, item.id)}>
                                                <option value="Progressing">Progressing</option>
                                                <option value="Done">Done</option>
                                                <option value="Cancel">Cancel</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button onClick={() => handleShowDetail(item)}>Show Detail</button>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </Table>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Detail For Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="notification">
                        <i className="fa-solid fa-angle-right"></i>
                        Information Of Customer is:
                        <div className="notification-child">
                            - Full Name: <span>{showDetailOrder.fullname || "Unknown"}</span>
                        </div>
                        <div className="notification-child">
                            - Email: <span>{showDetailOrder.email || "N/A"}</span>
                        </div>
                        <div className="notification-child">
                            - Phone: <span>{showDetailOrder.phone || "N/A"}</span>
                        </div>
                        <div className="notification-child">
                            - Address:
                            <span>
                                {showDetailOrder.address}, {showDetailOrder.wards}, {showDetailOrder.district}, {showDetailOrder.province}
                            </span>
                        </div>
                    </div>

                    <div className="notification">
                        <i className="fa-solid fa-angle-right"></i>
                        ID Order Of Customer is:
                        <div className="notification-child">
                            - ID Orders: <span>{showDetailOrder.idOrders || "N/A"}</span>
                        </div>
                        <div className="notification-child">
                            - Code Discount: <span>{showDetailOrder.codeDiscount || "N/A"}</span>
                        </div>
                    </div>

                    <div className="notification">
                        <i className="fa-solid fa-angle-right"></i>
                        Cart Detail:
                        <div className="notification-child">
                            - Day: <span>{showDetailOrder.cart?.day || "N/A"}</span>
                        </div>
                        <div className="notification-child">
                            - Title: <span>{showDetailOrder.cart?.title || "N/A"}</span>
                        </div>
                        <div className="notification-child">
                            - Price: <span>{showDetailOrder.cart?.price || "N/A"}</span>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrderManage;
