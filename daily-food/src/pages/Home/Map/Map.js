import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

const Map = () => {
    const arrayLocation = [
        {
            id: 1,
            name: "Binh Thanh",
            address: "380 Bùi Hữu Nghĩa, Phường 2, Bình Thạnh (đối diện chợ Bà Chiểu)",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAt7Mkf_0UsT4DvoeT3QT_o2ywZUqU_RfMNQ&s",
            link: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8077.125254493454!2d106.69701959462422!3d10.823635768176585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528f1f95cf5cb%3A0xf9e7b4f2adbd6adb!2sEmart%20Supermarket!5e0!3m2!1sen!2s!4v1718161597110!5m2!1sen!2s",
        },
        {
            id: 2,
            name: "Go Vap",
            address: "50 Dương Quảng Hàm, Phường 2, Gò Vấp",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAt7Mkf_0UsT4DvoeT3QT_o2ywZUqU_RfMNQ&s",
            link: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52184.15720579712!2d106.6732108918185!3d10.799988094807926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752949eb3e795f%3A0xa435dd1685ea2fbc!2sHoang%20Van%20Thu%20Park!5e0!3m2!1sen!2s!4v1718165247572!5m2!1sen!2s",
        },
        {
            id: 3,
            name: "Tan Binh",
            address: "230 Út Tịch , Phường 3, Tân Bình ",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAt7Mkf_0UsT4DvoeT3QT_o2ywZUqU_RfMNQ&s",
            link: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60151.17044555723!2d106.67223288544582!3d10.803941573607032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317525d4fb4d7abb%3A0xed06665f8a047451!2sLe%20Van%20Thinh%20Hospital!5e0!3m2!1sen!2s!4v1718165310657!5m2!1sen!2s",
        },
    ];
    const [location, setLocation] = useState(arrayLocation[0].link);

    return (
        <div className="map">
            <Container>
                <Row>
                    <Col md={7}>
                        <div className="map-location">
                            <iframe src={location} width="100%" height="450" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </Col>
                    <Col md={5}>
                        <div className="map-system">
                            <h2>Branch System</h2>
                            <div className="map-system-scroll">
                                <div className="map-system-box">
                                    {arrayLocation.map((item) => (
                                        <div className="map-card" onClick={() => setLocation(item.link)} key={item.id}>
                                            <div className="map-card-branch">
                                                <img src={item.img} alt="" />
                                                <div className="map-card-branch_text">
                                                    <h3>
                                                        <i className="fa-solid fa-map-pin"></i>
                                                        {item.name}
                                                    </h3>
                                                    <h4>{item.address}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Map;
