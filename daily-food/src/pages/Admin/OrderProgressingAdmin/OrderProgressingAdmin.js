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
            const filteredOrders = listOrder.filter((order) => {
                const status = order.status?.trim();
                return status === "progressing";
            });

            // Lọc thêm những đơn hàng có thời gian đã qua 5 phút
            const updatedOrders = filteredOrders.map((order) => {
                const orderTime = new Date(order.orderTime);
                const currentTime = new Date();
                const diffInMinutes = (currentTime - orderTime) / (1000 * 60);

                // Cập nhật trạng thái nếu thời gian đã qua 5 phút
                return {
                    ...order,
                    isReadyToPrepare: diffInMinutes >= 5 ? true : order.isReadyToPrepare, // Cập nhật cờ nếu đã qua 5 phút
                };
            });

            setOrders(updatedOrders);
        }
    }, [listOrder]);

    // Fetch province and district info for orders
    useEffect(() => {
        if (dataProvince?.data && orders.length > 0) {
            const fetchData = async () => {
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
            };
            fetchData();
        }
    }, [orders, dataProvince]);

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
        Navigate("/admin/ordermanage");
    };

    const handleStatusChange = async (event, orderId) => {
        const newStatus = event.target.value; // Lấy giá trị trạng thái mới

        try {
            // Gửi PUT request tới backend để thay đổi trạng thái
            const response = await fetch(`http://localhost:8081/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                // Cập nhật trạng thái trong state ngay lập tức và lọc lại các đơn hàng có status là "Progressing"
                setOrders((prevOrders) => {
                    const updatedOrders = prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order));
                    return updatedOrders.filter((order) => order.status === "progressing");
                });
                alert("Status updated successfully");
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // Set up polling to fetch data every 5 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            // Fetch the order data again to check for any changes
            const fetchOrders = async () => {
                const response = await fetch("http://localhost:8081/orders");
                const updatedOrders = await response.json();
                setOrders(updatedOrders.filter((order) => order.status === "progressing"));
            };
            fetchOrders();
        }, 5000); // Fetch every 5 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

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
                            <th>Time Order</th>
                            <th>Condition</th>
                            <th>Status</th>
                            <th>Seen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders && orders.length > 0 ? (
                            orders.map((item) => {
                                const userInfo = JSON.parse(item.information);
                                const orderTime = new Date(item.orderTime);
                                const hours = orderTime.getHours();
                                const minutes = orderTime.getMinutes();
                                const formattedTime = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`; // Hiển thị giờ:phút
                                return (
                                    <tr key={item.id}>
                                        <td>{userInfo.fullname || "Unknown"}</td>
                                        <td>{userInfo.email || "N/A"}</td>
                                        <td>{userInfo.phone || "N/A"}</td>
                                        <td>{item.codeDiscount || "N/A"}</td>
                                        <td>{item.payment || "N/A"}</td>
                                        <td>{formattedTime}</td>
                                        <td>{item.isReadyToPrepare ? <span>Prepare</span> : <span>Not yet</span>}</td>
                                        <td>
                                            <select value={item.status} onChange={(e) => handleStatusChange(e, item.id)}>
                                                <option value="Progressing">Progressing</option>
                                                <option value="Done">Done</option>
                                            </select>
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
