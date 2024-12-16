import { useState, useEffect } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UseFetch from "~/feature/UseFetch";
import CardMenu from "~/pages/Menu/CardMenu/CardMenu";

const OrderDone = () => {
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

    // UseEffect to filter orders based on status 'Done'
    useEffect(() => {
        if (listOrder && listOrder.length > 0) {
            const filteredOrders = listOrder.filter((order) => order.status === "Done");
            setOrders(filteredOrders);
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
    return (
        <div className="orderManage">
            <div className="orderManage-table">
                <h4>Order Done</h4>
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
                                            <p style={{ backgroundColor: "green", color: "white", borderRadius: "4px", textAlign: "center" }}> {item.status}</p>
                                        </td>
                                        <td>
                                            <button onClick={() => handleShowDetail(item)}>Show Detail</button>
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

                    <div className="notification">
                        <div className="notification_des">
                            <i className="fa-solid fa-angle-right"></i>
                            <h5>Retail:</h5>
                        </div>
                        {showDetailOrder.cartRetail &&
                            JSON.parse(showDetailOrder.cartRetail).map((item, index) => (
                                <div key={index}>
                                    <CardMenu
                                        image={item.foodmenu_image}
                                        name={item.foodmenu_name}
                                        time={item.foodmenu_time}
                                        des={item.foodmenu_des}
                                        calories={item.foodmenu_calories}
                                        protein={item.foodmenu_protein}
                                        carbohydrates={item.foodmenu_carbohydrates}
                                    />
                                </div>
                            ))}
                        {/* Calculate and display total price */}
                        {showDetailOrder.cartRetail && (
                            <p className="s-left_totalprice">
                                Total Price for Retail:
                                <span>
                                    $
                                    {Math.round(
                                        JSON.parse(showDetailOrder.cartRetail).reduce((total, current) => {
                                            return total + Number(current.price * current.quantity);
                                        }, 0)
                                    )}
                                </span>
                            </p>
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
