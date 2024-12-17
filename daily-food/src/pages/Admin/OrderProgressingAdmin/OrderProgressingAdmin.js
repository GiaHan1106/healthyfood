import { useState, useEffect } from "react";
import { Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UseFetch from "~/feature/UseFetch";
import CardMenu from "~/pages/Menu/CardMenu/CardMenu";

const OrderProgressing = () => {
    const Navigate = useNavigate();

    const [showDetailOrder, setShowDetailOrder] = useState({});
    const [show, setShow] = useState(false);
    const [orders, setOrders] = useState([]);
    const [locationData, setLocationData] = useState({ districts: [], province: [] });
    const listOrder = UseFetch("http://localhost:8081/orders");
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
            const response = await fetch(`http://localhost:8081/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus }),
            });

            if (response.ok) {
                // Cập nhật lại danh sách đơn hàng sau khi trạng thái thay đổi
                const updatedResponse = await fetch("http://localhost:8081/orders");
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
                const updatedResponse = await fetch("http://localhost:8081/orders");
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
                                            <button onClick={() => handleShowDetail(item)}>Show Detail</button>
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
                        {showDetailOrder.cart &&
                            JSON.parse(showDetailOrder.cart).map((item, index) => (
                                <div key={index}>
                                    {item.listfood &&
                                        item.listfood.length > 0 &&
                                        item.listfood.map((food, foodIndex) => (
                                            <div key={foodIndex}>
                                                <CardMenu
                                                    image={food.foodmenu_image}
                                                    name={food.foodmenu_name}
                                                    des={food.foodmenu_des}
                                                    calories={food.foodmenu_calories}
                                                    protein={food.foodmenu_protein}
                                                    carbohydrates={food.foodmenu_carbohydrates}
                                                />
                                            </div>
                                        ))}
                                </div>
                            ))}
                        {/* Calculate and display total price */}
                        {showDetailOrder.cart && (
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
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default OrderProgressing;
