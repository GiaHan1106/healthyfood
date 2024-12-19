import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import CardMenu from "../Menu/CardMenu/CardMenu";
import { useCart } from "~/context/CartContext";

const CategoryDetail = () => {
    const { slug } = useParams();
    const { addCartRetail } = useCart();
    const { state } = useLocation(); // Get searchTerm from location state
    const searchTermFromState = state?.searchTerm || ""; // Default to empty string if not present
    const [categoryFood, setCategoryFood] = useState([]);
    const [titleCate, settitleCate] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchTermFromState);

    useEffect(() => {
        const fetchFoodByCategory = async () => {
            try {
                const response = await fetch(`http://localhost:8081/foodmenu`);
                const data = await response.json();

                data.forEach((food) => console.log(food.foodmenu_idCate));
                const filteredData = data.filter((food) => Number(food.foodmenu_idCate) === Number(slug));

                setCategoryFood(filteredData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setLoading(false);
            }
        };

        const fetchTitleCategory = async () => {
            try {
                const response = await fetch(`http://localhost:8081/catemenu`);
                const data = await response.json();
                settitleCate(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setLoading(false);
            }
        };

        fetchTitleCategory();
        fetchFoodByCategory();
    }, [slug]);

    // Log slug and categoryTitle
    console.log("slug:", slug);
    const categoryTitle = titleCate.find((title) => String(title.catemenu_id) === slug)?.catemenu_title || "Không xác định";
    console.log("categoryTitle:", categoryTitle);

    // Check if the category is "healthy"
    const isHealthyCategory = categoryTitle.toLowerCase().includes("healthy");
    console.log("isHealthyCategory:", isHealthyCategory);

    // Handling search input change
    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    // Filtered food based on search term
    const filteredFood = categoryFood.filter(
        (food) => food.foodmenu_name.toLowerCase().includes(searchTerm) || (food.diseases && typeof food.diseases === "string" && food.diseases.toLowerCase().includes(searchTerm))
    );

    // Log diseases for each food
    filteredFood.forEach((food) => console.log("Diseases:", food.diseases));

    if (loading) return <div>Loading...</div>;
    console.log(filteredFood.foodmenu_);

    return (
        <div className="s-categoryDetail">
            <Container>
                <div className="s-order-search_bar">
                    <input type="text" placeholder="Search by name or diseases..." value={searchTerm} onChange={handleSearch} className="search-input" />
                </div>
                <h2>{categoryTitle}</h2>
                <Row>
                    {filteredFood.length > 0 ? (
                        filteredFood.map((food) => (
                            <Col xs={6} lg={3} key={food.foodmenu_id} className="mb-4">
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
                                        deseases={categoryTitle === "HEALTHY" ? food.diseases : undefined}
                                        catemenuTitle={categoryTitle}
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
            </Container>
        </div>
    );
};

export default CategoryDetail;
