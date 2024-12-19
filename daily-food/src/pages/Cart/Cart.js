import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useCart } from "~/context/CartContext";
import UseFetch from "~/feature/UseFetch";
import { useFormik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import Modal from "react-bootstrap/Modal";
import emptyCart from "~/assets/emptyCart.png";
import axios from "axios";
import { useUser } from "~/context/UserContext";
const Cart = () => {
    const { cart, deleteCartRetail, cartRetail, deleteCart, deleteAll } = useCart();
    const { user } = useUser();
    const [sortCart, setSortCart] = useState([]);
    const [selectProvince, setSelectProvince] = useState();
    const [selectDistrict, setSelectDistrict] = useState();
    const [selectWards, setSelectWards] = useState();
    const [choosePayment, setChoosePayment] = useState(1);
    const [informationOrder, setInformationOrder] = useState({});
    const [show, setShow] = useState(false);
    function generateRandomString() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        const charactersLength = characters.length;
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    const formik = useFormik({
        initialValues: {
            fullname: "",
            email: user ? user.email : "", // Pre-fill the email if the user is logged in
            phone: "",
            address: "",
            province: "",
            district: "",
            wards: "",
        },
        validationSchema: Yup.object({
            fullname: Yup.string().required("Required"),
            email: Yup.string().email("Invalid email address").required("Required"),
            phone: Yup.string()
                .matches(/^[0-9]+$/, "Phone number must be a number")
                .max(10, "Must be than 10 characters ")
                .min(8, "Must be less 8  characters ")
                .required("Phone number is required"),
            address: Yup.string().required("Required"),
            province: Yup.string().required("Province is required"),
            district: Yup.string().required("district is required"),
            wards: Yup.string().required("wards is required"),
        }),
        onSubmit: async (information) => {
            const dataOrders = {
                id: uuidv4(),
                idOrders: uuidv4(),
                codeDiscount: generateRandomString(),
                information: information,
                cart: cart,
                cartRetail: cartRetail,
                payment: choosePayment === 1 ? "cash" : "online-payment",
            };

            try {
                const response = await axios.post("http://localhost:8081/orders", dataOrders);
                if (response.status === 200) {
                    setInformationOrder(dataOrders);
                    setShow(true);
                    setTimeout(() => {
                        deleteAll();
                    }, 2000);
                }
            } catch (error) {
                console.error("Error posting data:", error);
            }
        },
    });

    const handleClose = () => {
        setTimeout(() => {
            setShow(false);
        }, 2000);
    };
    const arrayIcon = {
        balanced: "fa-scale-balanced",
        vegetarian: "fa-seedling",
        gymer: "fa-dumbbell",
        slimming: "fa-person-walking",
    };
    const handlePayment = (index) => {
        setChoosePayment(index);
    };
    const dataProvince = UseFetch(`https://esgoo.net/api-tinhthanh/1/0.htm`);
    const dataDistrict = UseFetch(`https://esgoo.net/api-tinhthanh/2/${selectProvince}.htm`);
    const dataWards = UseFetch(`https://esgoo.net/api-tinhthanh/3/${selectDistrict}.htm`);

    const handleSelectProvince = (e) => {
        setSelectProvince(e.target.value);
        formik.setFieldValue("province", e.target.value);
    };
    const handleSelectDistrict = (e) => {
        setSelectDistrict(e.target.value);
        formik.setFieldValue("district", e.target.value);
    };
    const handleSelectWards = (e) => {
        setSelectWards(e.target.value);
        formik.setFieldValue("wards", e.target.value);
    };

    //Sap xep Cart theo danh muc va thu tu
    useEffect(() => {
        const arraySort = cart.sort((a, b) => {
            if (a.title < b.title) {
                return -1;
            }
            if (a.title > b.title) {
                return 1;
            }
            return 0;
        });

        const grouped = arraySort.reduce((acc, obj) => {
            const key = obj.title.toLowerCase();
            if (!acc[key]) {
                acc[key] = {
                    title: key,

                    list: [],
                };
            }
            acc[key].list.push(obj);
            return acc;
        }, {});

        const arrayKey = Object.values(grouped);
        setSortCart(arrayKey);
    }, [cart, cartRetail]);

    return (
        <div>
            {cart.length === 0 && cartRetail.length === 0 ? (
                <div className="emptyCart">
                    <img src={emptyCart} alt="" />
                </div>
            ) : (
                <form onSubmit={formik.handleSubmit}>
                    <Container>
                        <div className="s-cart">
                            <Row>
                                <Col lg={7}>
                                    <h2>Order Information</h2>
                                    <div className="s-cart-form">
                                        <input type="hidden" name="idorder" />
                                        <div className="s-cart-form_child">
                                            <div class="s_input">
                                                <h5>Fullname*</h5>
                                                <input onChange={formik.handleChange} type="text" name="fullname" />
                                                {formik.touched.fullname && formik.errors.fullname ? <div className="error">{formik.errors.fullname}</div> : null}
                                            </div>
                                            <div className="s_input">
                                                <h5>Email*</h5>
                                                <input onChange={formik.handleChange} type="email" name="email" value={formik.values.email} disabled={!user} />
                                                {formik.touched.email && formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}
                                            </div>

                                            <div class="s_input">
                                                <h5>
                                                    Phone <span>*</span>
                                                </h5>
                                                <input onChange={formik.handleChange} type="text" name="phone" />
                                                {formik.touched.phone && formik.errors.phone ? <div className="error">{formik.errors.phone}</div> : null}
                                            </div>
                                            <div class="s_input">
                                                <h5>
                                                    Address <span>*</span>
                                                </h5>
                                                <input onChange={formik.handleChange} type="text" name="address" />
                                                {formik.touched.address && formik.errors.address ? <div className="error">{formik.errors.address}</div> : null}
                                            </div>
                                            <div class="s_input">
                                                <h5>
                                                    Country <span>*</span>
                                                </h5>
                                                <Row>
                                                    <Col xs={4}>
                                                        <select onChange={handleSelectProvince} name="province">
                                                            <option>Province</option>
                                                            {dataProvince.data &&
                                                                dataProvince.data.map((item) => (
                                                                    <option value={item.id} data-name={item.name}>
                                                                        {item.name}
                                                                    </option>
                                                                ))}
                                                        </select>

                                                        {formik.touched.province && formik.errors.province ? <div className="error">{formik.errors.province}</div> : null}
                                                    </Col>
                                                    <Col xs={4}>
                                                        <select onChange={handleSelectDistrict} name="district">
                                                            <option>District</option>
                                                            {dataDistrict.data &&
                                                                dataDistrict.data.map((item) => (
                                                                    <option value={item.id} data-name={item.full_name}>
                                                                        {item.full_name}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                        {formik.touched.district && formik.errors.district ? <div className="error">{formik.errors.district}</div> : null}
                                                    </Col>
                                                    <Col xs={4}>
                                                        <select onChange={handleSelectWards} name="wards">
                                                            <option>Wards</option>
                                                            {dataWards.data && dataWards.data.map((item) => <option data-name={item.name}>{item.name}</option>)}
                                                        </select>
                                                        {formik.touched.wards && formik.errors.wards ? <div className="error">{formik.errors.wards}</div> : null}
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div class="s_input">
                                                <h5>Order notes (optional)</h5>
                                                <textarea name="note" cols="30" rows="10" onChange={formik.handleChange}></textarea>
                                            </div>
                                        </div>
                                        <h2>Payments</h2>
                                        <div className={`${choosePayment === 1 ? "s_radioActive" : "s_radio"}`} onClick={() => handlePayment(1)}>
                                            <input type="radio" name="payment" value="cash" checked={choosePayment === 1} />
                                            <img src="https://static.vecteezy.com/system/resources/thumbnails/002/206/240/small_2x/fast-delivery-icon-free-vector.jpg" alt="" />{" "}
                                            <div className="s_radio_text">
                                                <h4> COD</h4>
                                                <label> Payment on delivery</label>
                                            </div>
                                        </div>
                                        <div className={`${choosePayment === 2 ? "s_radioActive" : "s_radio"}`} onClick={() => handlePayment(2)}>
                                            <div className="s_radio_left">
                                                <input type="radio" name="payment" value="online-payment" checked={choosePayment === 2} />
                                                <img src="https://play-lh.googleusercontent.com/dQbjuW6Jrwzavx7UCwvGzA_sleZe3-Km1KISpMLGVf1Be5N6hN6-tdKxE5RDQvOiGRg" alt="" />{" "}
                                                <label> Payment on transfer</label>
                                            </div>
                                            <div className={`s_radio_right ${choosePayment === 2 && "active"}`}>
                                                <img src="https://homepage.momocdn.net/blogscontents/momo-upload-api-220630163212-637922035327290078.jpg" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={5}>
                                    <h2>Cart Combo</h2>
                                    {sortCart.map((item) => (
                                        <div className="s-left" key={item.title}>
                                            <div className="s-left_title">
                                                <div className="s-left_title_left">
                                                    <h2>
                                                        {<i className={`fa-solid ${arrayIcon[item.title]}`}></i>}
                                                        {item.title}
                                                    </h2>
                                                </div>
                                            </div>
                                            {item.list.map((itemDetail) => (
                                                <div className="s-item" key={itemDetail.daymenu_id}>
                                                    <div className="s-item_top">
                                                        <div className="s-item_top_left">
                                                            <h2>
                                                                Menu for <span>{itemDetail.daymenu_day}</span>
                                                            </h2>
                                                            <h3>
                                                                , <i className="fa-solid fa-money-bill"></i>:<span>${Math.floor(itemDetail.price)}</span>
                                                            </h3>
                                                        </div>
                                                        <i className="fa-regular fa-trash-can" onClick={() => deleteCart(itemDetail.daymenu_id)}></i>
                                                    </div>
                                                    <div className="s-item_bot">
                                                        {itemDetail.listfood.map((itemDetail2) => (
                                                            <div className="s_left" key={itemDetail2.foodmenu_id}>
                                                                <img src={itemDetail2.foodmenu_image} alt="" />
                                                                <div className="s_left_child">
                                                                    <h4>{itemDetail2.foodmenu_name}</h4>
                                                                    <h5>{itemDetail2.foodmenu_time}</h5>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                            <p className="s-left_totalprice">
                                                Total Price:
                                                <span>
                                                    $
                                                    {item.list.reduce((total, current) => {
                                                        return total + Number(current.price);
                                                    }, 0)}
                                                </span>
                                            </p>
                                        </div>
                                    ))}
                                    <h2>Cart Retail</h2>
                                    {cartRetail.map((item) => (
                                        <div className="s-left" key={item.foodmenu_id}>
                                            <div className="s-item" key={item.foodmenu_id}>
                                                <div className="s-item_top">
                                                    <div className="s-item_bot">
                                                        <div className="s_left" key={item.foodmenu_id}>
                                                            <img src={item.foodmenu_image} alt="" />
                                                            <div className="s_left_child">
                                                                <h4>{item.foodmenu_name}</h4>
                                                                <h4>Calories: {item.foodmenu_calories}</h4>
                                                                <h4>Quantity: {item.quantity}</h4>
                                                                <h4>Price: {item.price} $</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="s-item_top_left">
                                                        <h3>
                                                            , <i className="fa-solid fa-money-bill"></i>:<span>${item.price * item.quantity}</span>
                                                        </h3>
                                                    </div>
                                                    <i className="fa-regular fa-trash-can" onClick={() => deleteCartRetail(item.foodmenu_id)}></i>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <p className="s-left_totalprice">
                                        Total Price:
                                        <span>
                                            $
                                            {cartRetail.reduce((total, current) => {
                                                return total + Number(current.price * current.quantity);
                                            }, 0)}
                                        </span>
                                    </p>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                    <div className="s-totalFixed">
                        <Row>
                            <Col lg={6}>
                                <p className="s-totalFixed_text">
                                    If you don't want to order Website , you can call hotline <span>0974200611</span>
                                </p>
                            </Col>
                            <Col lg={6}>
                                <div className="s-totalFixed_price">
                                    <Row></Row>
                                    <Col lg={7}>
                                        <div className="s_totalPrice">
                                            <div className="s_textTotal">
                                                <h4>Fee Shipping:</h4>
                                                <h5>Free shipping</h5>
                                            </div>
                                            <div className="s_textTotal">
                                                <h4>Total:</h4>
                                                <h5>
                                                    $
                                                    <span>
                                                        {cart.reduce((total, current) => {
                                                            return total + Number(current.price);
                                                        }, 0) +
                                                            cartRetail.reduce((total, current) => {
                                                                return total + Number(current.price * current.quantity);
                                                            }, 0)}
                                                    </span>
                                                </h5>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={5}>
                                        <div className="s_button" type="submit">
                                            <button className="s_button_1">PROCEED TO CHECKOUT</button>
                                        </div>
                                    </Col>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Modal show={show}>
                        <Modal.Header closeButton>
                            <Modal.Title>Thanks your for Orders</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="notification">
                                Bill of your lading code: <span>" {informationOrder.idOrders} "</span>
                            </div>
                            <div className="notification">
                                Woohoo, Promotion code for next order:
                                <span> {informationOrder.codeDiscount}</span>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={handleClose}>
                                Back to Homepage
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </form>
            )}
        </div>
    );
};

export default Cart;
