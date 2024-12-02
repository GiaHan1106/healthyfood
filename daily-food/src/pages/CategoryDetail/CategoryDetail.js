import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import CardMenu from "../Menu/CardMenu/CardMenu";
import { useCart } from "~/context/CartContext";

const CategoryDetail = () => {
    const { slug } = useParams();
    const { addCartRetail } = useCart();
    const { state } = useLocation(); // Get searchTerm from location state
    const searchTermFromState = state?.searchTerm || ""; // Default to empty string if not present

    const [categoryFood, setCategoryFood] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchTermFromState);

    const categoryNames = {
        1: "Slimming",
        2: "Vegetable",
        3: "Gymer",
        4: "Balance",
    };

    useEffect(() => {
        const fetchFoodByCategory = async () => {
            try {
                const response = await fetch(`http://localhost:8081/foodmenu?categoryId=${slug}`);
                const data = await response.json();
                setCategoryFood(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setLoading(false);
            }
        };

        fetchFoodByCategory();
    }, [slug]);

    // Handling search input change
    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    // Filtered food based on search term
    const filteredFood = categoryFood.filter(
        (food) => food.foodmenu_name.toLowerCase().includes(searchTerm) || (food.diseases && JSON.parse(food.diseases).some((disease) => disease.toLowerCase().includes(searchTerm)))
    );

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="s-order-search_bar">
                <input type="text" placeholder="Search by name or diseases..." value={searchTerm} onChange={handleSearch} className="search-input" />
            </div>
            <h2>{categoryNames[slug] || "Không xác định"}</h2>
            <Row>
                {filteredFood.length > 0 ? (
                    filteredFood.map((food) => (
                        <Col lg={3} key={food.foodmenu_id} className="mb-4">
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
                                    deseases={food.diseases}
                                />
                                <button className="s-order-button" onClick={() => addCartRetail(food)}>
                                    Order
                                </button>
                            </div>
                        </Col>
                    ))
                ) : (
                    <p>Không có món ăn nào trong danh mục này.</p>
                )}
            </Row>
        </div>
    );
};

export default CategoryDetail;
