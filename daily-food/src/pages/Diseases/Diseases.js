import React, { useEffect, useState } from "react";
import CardMenu from "../Menu/CardMenu/CardMenu";
import { Col, Row, Container } from "react-bootstrap";
import UseFetch from "~/feature/UseFetch";

const Deseases = () => {
    const [allFood, setAllFood] = useState([]); // Dữ liệu đầy đủ
    const [food, setFood] = useState([]); // Dữ liệu hiển thị
    const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
    const foodmenu = UseFetch(`http://localhost:8081/foodmenu`); // Lấy dữ liệu từ API

    useEffect(() => {
        setAllFood(foodmenu); // Lưu danh sách đầy đủ ban đầu
        setFood(foodmenu); // Hiển thị toàn bộ món ăn
    }, [foodmenu]);

    // Xử lý tìm kiếm dựa trên từ khóa
    const handleSearch = (event) => {
        const keyword = event.target.value.toLowerCase();
        setSearchTerm(keyword);
        if (!keyword) {
            setFood(allFood); // Nếu không nhập gì, hiển thị toàn bộ món ăn
        } else {
            const filterResults = allFood.filter((item) => {
                return (
                    item.foodmenu_name.toLowerCase().includes(keyword) || // Tìm theo tên món
                    (item.diseases && JSON.parse(item.diseases).some((disease) => disease.toLowerCase().includes(keyword))) // Tìm theo bệnh
                );
            });
            setFood(filterResults); // Cập nhật danh sách món ăn sau khi lọc
        }
    };

    return (
        <div className="deseases">
            <div className="deseases-image">
                <img src="http://localhost:3000/static/media/imageMenu.04a68d7e9eb9761a6e32.png" alt="" />
                <div className="calories-textBanner">
                    <h2>Repice Cooking With Us</h2>
                    <h3>Let's start</h3>
                </div>
            </div>
            <div>
                {/* Input tìm kiếm */}
                <div className="deseases-search_bar">
                    <input type="text" placeholder="Search by name or diseases..." value={searchTerm} onChange={handleSearch} className="search-input" />
                </div>
                <Container>
                    <Row>
                        {food.map((food) => (
                            <Col lg={3} key={food.foodmenu_id}>
                                <div className="menu-detailMenu">
                                    <CardMenu
                                        image={food.foodmenu_image}
                                        name={food.foodmenu_name}
                                        time={food.foodmenu_time}
                                        des={food.foodmenu_des}
                                        calories={food.foodmenu_calories}
                                        protein={food.foodmenu_protein}
                                        carbohydrates={food.allday}
                                        price={food.price}
                                        deseases={food.diseases}
                                        order={true}
                                    />
                                    <button className="s-order-button">Order</button>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Deseases;
