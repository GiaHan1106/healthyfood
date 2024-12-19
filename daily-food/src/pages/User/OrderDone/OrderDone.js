import { useState, useEffect } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUser } from "~/context/UserContext";
import UseFetch from "~/feature/UseFetch";
import CardMenu from "~/pages/Menu/CardMenu/CardMenu";

const OrderDone = () => {
    const Navigate = useNavigate();
    const { user } = useUser();
    const [orders, setOrders] = useState([]);
    const [showDetailOrder, setShowDetailOrder] = useState({});
    const [show, setShow] = useState(false);
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

    useEffect(() => {
        const filteredOrders = listOrder.filter((order) => {
            const userInfo = JSON.parse(order.information);
            return userInfo.email === user.email && order.status === "Delivered";
        });
        setOrders(filteredOrders);
    }, [listOrder, user.email]);

    useEffect(() => {
        if (dataProvince?.data) {
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
        Navigate("/user/orderDone");
    };

    const sortedOrders = orders.sort((a, b) => {
        const orderTimeA = new Date(a.orderTime).getTime();
        const orderTimeB = new Date(b.orderTime).getTime();
        const currentTime = new Date().getTime();

        const canCancelA = (currentTime - orderTimeA) / 1000 / 60 < 5;
        const canCancelB = (currentTime - orderTimeB) / 1000 / 60 < 5;

        if (canCancelA && !canCancelB) return -1;
        if (!canCancelA && canCancelB) return 1;
        return 0;
    });

    return (
        <div className="s-orderDone">
            <div className="c-content">
                <ul>
                    <li>Wishing you a delicious meal! 🍽️</li>
                    <li>
                        Thank you for placing your order. We hope you have a tasty meal full of joy!<i className="fa-solid fa-heart-circle-check"></i>
                    </li>
                </ul>
                <h4>Successfully Delivered</h4>
            </div>
            <div className="s-orderDone-table">
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
                        {sortedOrders.length > 0 ? (
                            sortedOrders.map((item) => {
                                const userInfo = JSON.parse(item.information);
                                return (
                                    <tr key={item.id}>
                                        <td>{userInfo.fullname || "Unknown"}</td>
                                        <td>{userInfo.email || "N/A"}</td>
                                        <td>{userInfo.phone || "N/A"}</td>

                                        <td>{item.codeDiscount || "N/A"}</td>
                                        <td>{item.payment || "N/A"}</td>
                                        <td>
                                            <p style={{ backgroundColor: "green", color: "white", borderRadius: "5px", padding: "5px" }}>{item.status}</p>
                                        </td>
                                        <td>
                                            <button style={{ backgroundColor: "blue", color: "white", borderRadius: "5px", padding: "5px" }} onClick={() => handleShowDetail(item)}>
                                                Show Detail
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="8">No orders available</td>
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
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrderDone;
