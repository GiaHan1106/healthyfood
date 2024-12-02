import { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UseFetch from "~/feature/UseFetch";

const OrderManage = () => {
    const Navigate = useNavigate();
    const [showDetailOrder, setShowDetailOrder] = useState({});
    const [show, setShow] = useState(false);
    const listOrder = UseFetch("http://localhost:8081/orders");

    // Function to safely parse the 'information' field
    const parseInformation = (information) => {
        try {
            const data = JSON.parse(information); // Parse chuỗi JSON thành đối tượng
            console.log("Parsed data:", data); // Log dữ liệu sau khi parse
            return data;
        } catch (error) {
            console.error("Error parsing data:", error);
            return {}; // Trả về đối tượng rỗng nếu có lỗi
        }
    };

    const handleShowDetail = (cart) => {
        setShow(true);
        setShowDetailOrder(cart);
        console.log(cart);
    };

    const handleClose = () => {
        setShow(false);
        Navigate("/admin/ordermanage");
    };

    // Handle status change
    const handleStatusChange = (event, orderId) => {
        const newStatus = event.target.value;
        console.log(`Order ID: ${orderId}, New Status: ${newStatus}`);

        // Call API or update status locally here
        // You can send an update request to your backend to save the new status
        // Example API call:
        // fetch(`http://localhost:8081/orders/${orderId}`, {
        //   method: 'PUT',
        //   body: JSON.stringify({ status: newStatus }),
        //   headers: { 'Content-Type': 'application/json' }
        // }).then(response => response.json());
    };

    return (
        <div className="orderManage">
            <div className="orderManage-table">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Gmail</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Seen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listOrder &&
                            listOrder.map((item) => {
                                const userInfo = parseInformation(item.information);
                                return (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{userInfo?.fullname || "Unknown"}</td>
                                        <td>{userInfo?.email || "N/A"}</td>
                                        <td>{userInfo?.phone || "N/A"}</td>
                                        <td>
                                            {userInfo?.address},{userInfo?.wards},{userInfo?.district},{userInfo?.province}
                                        </td>
                                        <td>
                                            {/* Dropdown for status */}
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
                            - Full Name: <span>{showDetailOrder.values?.fullname || "Unknown"}</span>
                        </div>
                        <div className="notification-child">
                            - Email: <span>{showDetailOrder.values?.email || "N/A"}</span>
                        </div>
                        <div className="notification-child">
                            - Phone: <span>{showDetailOrder.values?.phone || "N/A"}</span>
                        </div>
                        <div className="notification-child">
                            - Address:
                            <span>
                                {showDetailOrder.values?.address},{showDetailOrder.values?.wards},{showDetailOrder.values?.district},{showDetailOrder.values?.province}
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
                            - Price: <span>${showDetailOrder.cart?.price || "0.00"}</span>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Back to Homepage
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrderManage;
