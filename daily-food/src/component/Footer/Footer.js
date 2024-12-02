import React, { useEffect, useState } from "react";
import foodFooter from "../../assets/footer/foodFooter.png";
import { Col, Container, Row } from "react-bootstrap";
import logo from "../../assets/Logo-name.png";
import { Link } from "react-router-dom";

const Footer = (props) => {
    const [scroll, setScroll] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setScroll(true);
            } else {
                setScroll(false);
            }
        };
        document.addEventListener("scroll", handleScroll);
    }, []);
    const handleOnTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    return (
        <div className={`footer ${props.hideFooter === true ? "hide" : ""}`}>
            <div className="footer-top">
                <img src={foodFooter} alt="" />
                <div className="footer-top_form">
                    <h3>If you need some advice, contact us !!</h3>
                    <h2>Hotline: 0974200611</h2>
                </div>
            </div>
            <div className="footer-center">
                <Container>
                    <div className="footer-center_cols">
                        <Row>
                            <Col md={4}>
                                <img className="footer-center_social_logo" src={logo} alt="" />
                                <p className="footer-center_social_text">We work with a passion of taking challenges and creating new ones in advertising sector.</p>
                                <ul className="footer-center_social">
                                    <li>
                                        <a href="">
                                            <i className="fa-brands fa-facebook-f"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="">
                                            <i className="fa-brands fa-youtube"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="">
                                            <i className="fa-brands fa-tiktok"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="">
                                            <i className="fa-brands fa-instagram"></i>
                                        </a>
                                    </li>
                                </ul>
                            </Col>
                            <Col md={2}>
                                <h4>Links</h4>
                                <ul className="footer-center_listInfor">
                                    <li>
                                        <i className="fa-solid fa-chevron-right"></i>
                                        <Link to="/">Home</Link>
                                    </li>
                                    <li>
                                        <i className="fa-solid fa-chevron-right"></i>
                                        <Link to="/about">About</Link>
                                    </li>
                                    <li>
                                        <i className="fa-solid fa-chevron-right"></i>
                                        <Link to="/menu">Combo</Link>
                                    </li>
                                    <li>
                                        <i className="fa-solid fa-chevron-right"></i>
                                        <Link to="/order">Order</Link>
                                    </li>
                                    <li>
                                        <i className="fa-solid fa-chevron-right"></i>
                                        <Link to="/calories">Calories</Link>
                                    </li>
                                    <li>
                                        <i className="fa-solid fa-chevron-right"></i>
                                        <Link to="/recipe">Recipe</Link>
                                    </li>
                                    <li>
                                        <i className="fa-solid fa-chevron-right"></i>
                                        <Link to="/deseases">Deseases</Link>
                                    </li>
                                </ul>
                            </Col>
                            <Col md={3}>
                                <h4>Offical Info:</h4>
                                <ul className="footer-center_listInfor">
                                    <li>
                                        <a href="https://maps.app.goo.gl/Ct75rDkdCYbSajxLA" target="_blank">
                                            <i className="fa-solid fa-location-dot"></i> 50/2 Dương Quảng Hàm, Phường 10 ,Quận Gò vấp, Thành phố Hồ Chí Minh
                                        </a>
                                    </li>
                                    <li>
                                        <a href="tel:0974200611">
                                            <i className="fa-solid fa-phone"></i> 0974-200-611
                                        </a>
                                    </li>
                                </ul>
                                <div className="footer-center_listInfor_timing">
                                    <h5>Open Hours</h5>
                                    <p>
                                        Mon - Sat: <span>8am - 7pm</span>
                                    </p>
                                    <p>
                                        Sunday: <span>CLOSE</span>
                                    </p>
                                </div>
                            </Col>
                            <Col md={3}>
                                <h4>Instargram</h4>
                                <div className="footer-center_image">
                                    <div className="footer-center_image_instar">
                                        <img src="https://demo.casethemes.net/organio/wp-content/uploads/sb-instagram-feed-images/160592051_437679624012421_2157246266541466556_nthumb.jpg" alt="" />
                                    </div>
                                    <div className="footer-center_image_instar">
                                        <img src="https://demo.casethemes.net/organio/wp-content/uploads/sb-instagram-feed-images/160790142_520098882312680_7190864355709334403_nthumb.jpg" alt="" />
                                    </div>
                                    <div className="footer-center_image_instar">
                                        <img src="https://demo.casethemes.net/organio/wp-content/uploads/sb-instagram-feed-images/161271827_191172625791711_1225591762254058110_nthumb.jpg" alt="" />
                                    </div>
                                    <div className="footer-center_image_instar">
                                        <img src="https://demo.casethemes.net/organio/wp-content/uploads/sb-instagram-feed-images/160300357_262853852155134_4639421379710860544_nthumb.jpg" alt="" />
                                    </div>
                                    <div className="footer-center_image_instar">
                                        <img src="https://demo.casethemes.net/organio/wp-content/uploads/sb-instagram-feed-images/160824220_272293631058951_25353289917148256_nthumb.jpg" alt="" />
                                    </div>
                                    <div className="footer-center_image_instar">
                                        <img src="https://demo.casethemes.net/organio/wp-content/uploads/sb-instagram-feed-images/161432828_1556196047918593_925226802758570664_nthumb.jpg" alt="" />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>
            <div className="footer-bot">
                <h5> © 2024 coding by Luong Gia Han from UIT</h5>
            </div>
            <button className={`footer-scrolltop ${scroll && "active"}`} onClick={handleOnTop}>
                <i className="fa-solid fa-chevron-up"></i>
            </button>
            <div className={`footer-navigation ${scroll && "active"}`}>
                <a href="#khoa-hoc">
                    <i className="fa-solid fa-phone-volume"></i>
                    <span>Phone</span>
                </a>
                <a href="#do-an">
                    <i className="fa-brands fa-facebook-f"></i>
                    <span>Facebook</span>
                </a>
                <a href="#danh-gia">
                    <i className="fa-brands fa-tiktok"></i>
                    <span>Tiktok</span>
                </a>
                <a href="#giang-vien">
                    <i className="fa-regular fa-address-card"></i>
                    <span>Contact</span>
                </a>
            </div>
        </div>
    );
};

export default Footer;
