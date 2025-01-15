import { useState, useEffect } from "react";
import { Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UseFetch from "~/feature/UseFetch";

const OrderProgressing = () => {
    const Navigate = useNavigate();
    const [showDetailOrder, setShowDetailOrder] = useState({});
    const [show, setShow] = useState(false);
    const [orders, setOrders] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [locationData, setLocationData] = useState({ districts: [], province: [] });
    const listOrder = UseFetch("https://healthy-food.techtheworld.id.vn/orders");
    const dataProvince = UseFetch("https://esgoo.net/api-tinhthanh/1/0.htm");

    // Function to fetch district data
    const fetchDistricts = async (provinceId, districtId) => {
        const districtsResponse = await fetch(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
        const districtsdata = await districtsResponse.json();
        const findIdDistrict = districtsdata.data.find((district) => district.id === districtId);
        return findIdDistrict ? findIdDistrict.full_name_en : "Unknown";
    };

    // Lọc chỉ những đơn hàng có trạng thái "progressing"
    useEffect(() => {
        if (listOrder && listOrder.length > 0) {
            const statusChain = ["Waiting Confirmation", "Preparing", "In transit", "Delivered"];
            const filteredOrders = listOrder.filter((order) => {
                const status = order.status?.trim();
                return statusChain.includes(status) && status !== "Delivered";
            });

            setOrders(filteredOrders);
        }
    }, [listOrder]);

    // Fetch province and district info for orders
    const fetchLocationData = async (orders, dataProvince) => {
        try {
            const updatedDistricts = await Promise.all(
                orders.map(async (item) => {
                    const userInfo = JSON.parse(item.information);
                    if (userInfo?.province && userInfo?.district) {
                        const provinceId = userInfo.province;
                        const districtId = userInfo.district;
                        const findIdProvince = dataProvince.data.find((province) => province.id === provinceId);
                        if (findIdProvince) {
                            const districtName = await fetchDistricts(provinceId, districtId);
                            return { province: findIdProvince.name, district: districtName };
                        }
                    }
                    return { province: "Unknown", district: "Unknown" };
                })
            );
            setLocationData(updatedDistricts);
        } catch (error) {
            console.error("Error fetching location data:", error);
        }
    };

    // Handle showing details of the order
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
        Navigate("/admin/orderProgressingAdmin");
    };

    const handleStatusTransition = async (orderId, currentStatus) => {
        const statusChain = ["Waiting Confirmation", "Preparing", "In transit", "Delivered"];
        const currentIndex = statusChain.indexOf(currentStatus);
        const nextStatus = currentIndex >= 0 && currentIndex < statusChain.length - 1 ? statusChain[currentIndex + 1] : null;

        // Nếu trạng thái là Cancelled, hiển thị cảnh báo
        if (currentStatus === "Cancelled") {
            alert("This order has been cancelled.");
            return;
        }

        if (!nextStatus) {
            alert("Order is already delivered.");
            return;
        }

        try {
            // Gửi yêu cầu cập nhật trạng thái
            const response = await fetch(`https://healthy-food.techtheworld.id.vn/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus }),
            });

            if (response.ok) {
                // Cập nhật lại danh sách đơn hàng sau khi trạng thái thay đổi
                const updatedResponse = await fetch("https://healthy-food.techtheworld.id.vn/orders");
                const updatedOrders = await updatedResponse.json();

                // Lọc lại đơn hàng để loại bỏ trạng thái "Delivered"
                const statusChain = ["Waiting Confirmation", "Preparing", "In transit", "Delivered"];
                const filteredOrders = updatedOrders.filter((order) => {
                    const status = order.status?.trim();
                    return statusChain.includes(status) && status !== "Delivered";
                });

                setOrders(filteredOrders);

                alert(`Order status updated to "${nextStatus}".`);
            } else {
                alert("Failed to update order status.");
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    // Fetch the data every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const fetchOrders = async () => {
                const updatedResponse = await fetch("https://healthy-food.techtheworld.id.vn/orders");
                const updatedOrders = await updatedResponse.json();

                const statusChain = ["Waiting Confirmation", "Preparing", "In transit", "Delivered"];
                const filteredOrders = updatedOrders.filter((order) => {
                    const status = order.status?.trim();
                    return statusChain.includes(status) && status !== "Delivered";
                });

                setOrders(filteredOrders);
            };

            fetchOrders();
        }, 3000); // 3 seconds interval

        // Clean up interval when the component is unmounted
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (dataProvince?.data && orders.length > 0) {
            fetchLocationData(orders, dataProvince);
        }
    }, [orders, dataProvince]);

    const handleCancel = async (order) => {
        if (order.status !== "Waiting Confirmation") {
            return;
        }

        try {
            const response = await fetch(`https://healthy-food.techtheworld.id.vn/orders/${order.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...order,
                    status: "Cancelled",
                }),
            });

            if (response.ok) {
                const updatedOrder = await response.json();
                setOrders((prevOrders) => prevOrders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
                alert("Order has been canceled successfully!");
            } else {
                alert("Failed to cancel order. Please try again.");
            }
        } catch (error) {
            console.error("Error canceling order:", error);
            alert("An error occurred while canceling the order.");
        }
    };

    return (
        <div className="orderManage">
            <div className="orderManage-table">
                <h4>Order Progressing</h4>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Code Discount</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Seen</th>
                            <th>Cancel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders && orders.length > 0 ? (
                            orders.map((item) => {
                                const userInfo = JSON.parse(item.information);
                                return (
                                    <tr key={item.id}>
                                        <td>{userInfo.fullname || "Unknown"}</td>
                                        <td>{userInfo.email || "N/A"}</td>
                                        <td>{userInfo.phone || "N/A"}</td>
                                        <td>{item.codeDiscount || "N/A"}</td>
                                        <td>{item.payment || "N/A"}</td>
                                        <td>
                                            <button
                                                onClick={() => handleStatusTransition(item.id, item.status)}
                                                className={`btn btn-primary  ${item.status === "Awaiting Confirmation" ? "yes" : ""} ${item.status === "Preparing" ? "yellow" : ""} ${
                                                    item.status === "In transit" ? "green" : ""
                                                } ${item.status === "Cancelled" ? "red" : ""}`}
                                            >
                                                {item.status || "Awaiting Confirmation"}
                                            </button>
                                        </td>
                                        <td>
                                            <button style={{ backgroundColor: "blue", color: "white", borderRadius: "5px", padding: "5px" }} onClick={() => handleShowDetail(item)}>
                                                Show Detail
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleCancel(item)}
                                                disabled={item.status !== "Waiting Confirmation"}
                                                style={{
                                                    backgroundColor: item.status === "Waiting Confirmation" ? "#f44336" : "#9e9e9e", // Red for cancel, gray if disabled
                                                    cursor: item.status === "Waiting Confirmation" ? "pointer" : "not-allowed", // Change cursor to show disabled state
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7">No orders available</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            <Modal show={show} onHide={handleClose} className="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Detail For Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="notification">
                        <div className="notification_des">
                            <i className="fa-solid fa-angle-right"></i>
                            <h5>Information Of Customer is:</h5>
                        </div>
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
                                {showDetailOrder.address}, {showDetailOrder.wards} wards,
                                {locationData.length > 0 ? locationData[0]?.district : "Unknown"},{locationData.length > 0 ? ` ${locationData[0]?.province} Province` : " Unknown"}
                            </span>
                        </div>
                    </div>

                    <div className="notification">
                        <div className="notification_des">
                            <i className="fa-solid fa-angle-right"></i>
                            <h5>ID Order Of Customer is:</h5>
                        </div>
                        <div className="notification-child">
                            - ID Orders: <span>{showDetailOrder.idOrders || "N/A"}</span>
                        </div>
                        <div className="notification-child">
                            - Code Discount: <span>{showDetailOrder.codeDiscount || "N/A"}</span>
                        </div>
                    </div>

                    <div className="notification">
                        <div className="notification_des">
                            <i className="fa-solid fa-angle-right"></i>
                            <h5>Combo:</h5>
                        </div>
                        {showDetailOrder.cart && JSON.parse(showDetailOrder.cart).length > 0 ? (
                            <>
                                {JSON.parse(showDetailOrder.cart).map((item, index) => (
                                    <div key={index}>
                                        {item.listfood &&
                                            item.listfood.length > 0 &&
                                            item.listfood.map((food, foodIndex) => (
                                                <div key={foodIndex}>
                                                    <div className="s-left" key={food.foodmenu_id}>
                                                        <div className="s-item" key={food.foodmenu_id}>
                                                            <div className="s-item_top">
                                                                <div className="s-item_bot">
                                                                    <div className="s_left" key={food.foodmenu_id}>
                                                                        <img src={food.foodmenu_image} alt="" />
                                                                        <div className="s_left_child">
                                                                            <h4>{food.foodmenu_name}</h4>
                                                                            <h4>Calories: {food.foodmenu_calories}</h4>
                                                                            <h4>Protein: {food.foodmenu_protein}</h4>
                                                                            <h4>Carbohydrates: {food.foodmenu_carbohydrates}</h4>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ))}
                                <p className="s-left_totalprice">
                                    Total Price for Combo:
                                    <span>
                                        $
                                        {Math.round(
                                            JSON.parse(showDetailOrder.cart).reduce((total, current) => {
                                                return total + Number(current.price);
                                            }, 0)
                                        )}
                                    </span>
                                </p>
                            </>
                        ) : (
                            <p>No items in the cart.</p>
                        )}
                    </div>

                    <div className="notification">
                        <div className="notification_des">
                            <i className="fa-solid fa-angle-right"></i>
                            <h5>Retail:</h5>
                        </div>
                        {showDetailOrder.cartRetail && JSON.parse(showDetailOrder.cartRetail).length > 0 ? (
                            <>
                                {JSON.parse(showDetailOrder.cartRetail).map((item, index) => (
                                    <div key={index}>
                                        <div className="s-left" key={item.foodmenu_id}>
                                            <div className="s-item" key={item.foodmenu_id}>
                                                <div className="s-item_top">
                                                    <div className="s-item_bot">
                                                        <div className="s_left" key={item.foodmenu_id}>
                                                            <img src={item.foodmenu_image} alt="" />
                                                            <div className="s_left_child">
                                                                <h4>{item.foodmenu_name}</h4>
                                                                <h4>Calories: {item.foodmenu_calories}</h4>
                                                                <h4>Protein: {item.foodmenu_protein}</h4>
                                                                <h4>Carbohydrates: {item.foodmenu_carbohydrates}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <p className="s-left_totalprice">
                                    Total Price for Combo:
                                    <span>
                                        $
                                        {Math.round(
                                            JSON.parse(showDetailOrder.cartRetail).reduce((total, current) => {
                                                return total + Number(current.price * current.quantity);
                                            }, 0)
                                        )}
                                    </span>
                                </p>
                            </>
                        ) : (
                            <p>No items in retail cart.</p>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default OrderProgressing;
