import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Dùng useNavigate từ React Router v6
import { Container, Row, Col } from "react-bootstrap";
import UseFetch from "~/feature/UseFetch";
import CardMenu from "../Menu/CardMenu/CardMenu";
import { useCart } from "~/context/CartContext";

const Order = () => {
    const navigate = useNavigate();
    const { addCartRetail } = useCart();
    const cateMenu = UseFetch(`http://localhost:8081/catemenu`);
    const listFood = UseFetch(`http://localhost:8081/foodmenu`);

    const [allFood, setAllFood] = useState([]);
    const [food, setFood] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [visibleCount, setVisibleCount] = useState(4);
    const [selectedCategory, setSelectedCategory] = useState(""); // state for category filter

    const arrayFood = cateMenu.map((item) => ({
        ...item,
        food: listFood.filter((itemfood) => itemfood.foodmenu_idCate === item.catemenu_id),
    }));

    useEffect(() => {
        setAllFood(listFood);
        setFood(listFood);
    }, [listFood]);

    // Xử lý tìm kiếm
    const handleSearch = (event) => {
        const keyword = event.target.value.toLowerCase();
        setSearchTerm(keyword);

        // Filter lại các món ăn theo cả category đã chọn và từ khóa tìm kiếm
        const filterResults = allFood.filter((item) => {
            // Lọc theo category nếu có
            const categoryMatch = selectedCategory ? item.catemenu_title === selectedCategory : true;

            // Lọc theo từ khóa tìm kiếm trong tên, mô tả, bệnh lý, thời gian, calo, protein, carbohydrate
            const nameMatch = item.foodmenu_name.toLowerCase().includes(keyword);
            const descriptionMatch = item.foodmenu_des && item.foodmenu_des.toLowerCase().includes(keyword);

            let diseaseMatch = false;

            // Kiểm tra nếu có trường diseases và từ khóa có nằm trong diseases
            if (item.diseases) {
                try {
                    // Nếu diseases là chuỗi JSON, parse thành mảng
                    const diseases = JSON.parse(item.diseases);
                    diseaseMatch = diseases.some((disease) => disease.toLowerCase().includes(keyword));
                } catch (error) {
                    // Nếu không thể parse thành JSON, coi như nó là chuỗi văn bản
                    console.warn("Invalid JSON in diseases field:", item.diseases);
                    diseaseMatch = item.diseases.toLowerCase().includes(keyword); // Tìm kiếm trong chuỗi nếu không phải JSON
                }
            }

            const timeMatch = item.foodmenu_time && item.foodmenu_time.toLowerCase().includes(keyword);
            const caloriesMatch = item.foodmenu_calories && item.foodmenu_calories.toString().includes(keyword);
            const proteinMatch = item.foodmenu_protein && item.foodmenu_protein.toString().includes(keyword);
            const carbohydratesMatch = item.foodmenu_carbohydrates && item.foodmenu_carbohydrates.toString().includes(keyword);

            // Điều kiện lọc: kết quả tìm kiếm từ bệnh lý hoặc các thuộc tính khác, kèm theo lọc category
            return categoryMatch && (nameMatch || descriptionMatch || diseaseMatch || timeMatch || caloriesMatch || proteinMatch || carbohydratesMatch);
        });

        setFood(filterResults);
    };

    const handleShowAll = (categoryId) => {
        console.log("Navigating to category: ", categoryId);
        navigate(`/categorydetail/${categoryId}`);
    };

    return (
        <Container>
            <div className="s-order">
                {/* Thanh tìm kiếm */}
                <div className="s-order-search_bar">
                    <input type="text" placeholder="Search by name or diseases..." value={searchTerm} onChange={handleSearch} className="search-input" />
                </div>
                {/* Hiển thị món ăn theo category đã chọn và tìm kiếm */}
                {cateMenu &&
                    arrayFood.map((item) => (
                        <div key={item.catemenu_id}>
                            <h2>{item.catemenu_title}</h2>
                            <Row>
                                {food
                                    .filter((foodItem) => foodItem.foodmenu_idCate === item.catemenu_id)
                                    .slice(0, visibleCount)
                                    .map((food) => (
                                        <Col xs={6} lg={3} key={food.foodmenu_id}>
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
                                                    order={true}
                                                    deseases={item.catemenu_title === "HEALTHY" ? food.diseases : undefined}
                                                    catemenuTitle={item.catemenu_title}
                                                />
                                                <button className="s-order-button" onClick={() => addCartRetail(food)}>
                                                    Order
                                                </button>
                                            </div>
                                        </Col>
                                    ))}
                            </Row>
                            {food.filter((foodItem) => foodItem.foodmenu_idCate === item.catemenu_id).length > visibleCount && (
                                <button className="s-order-buttonShowAll" onClick={() => handleShowAll(item.catemenu_id)}>
                                    Xem thêm
                                </button>
                            )}
                        </div>
                    ))}
            </div>
        </Container>
    );
};

export default Order;
