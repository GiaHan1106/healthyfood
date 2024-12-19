import axios from "axios";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";

const Recipe = () => {
    const [food, setFood] = useState("");
    const [inforFood, setInforFood] = useState("");
    const [popup, setPopup] = useState(false);
    const [detailFood, setDetailFood] = useState([]);
    const getNutritionData = async () => {
        try {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${food}`);
            setInforFood(response.data);
        } catch (err) {
            alert("error", err);
        }
    };
    const handleFindRecipe = () => {
        getNutritionData();
    };
    const handleDetail = async (id) => {
        setPopup(!popup);
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        setDetailFood(response.data.meals[0]);
    };
    console.log(detailFood);
    const handleClose = () => {
        setPopup(false);
    };
    return (
        <div className="recipe">
            <div className="recipe-image">
                <img src="http://localhost:3000/static/media/imageMenu.04a68d7e9eb9761a6e32.png" alt="" />
                <div className="calories-textBanner">
                    <h2>Repice Cooking With Us</h2>
                    <h3>Let's start</h3>
                </div>
            </div>
            <div className="recipe-title">
                <div className="recipe-title_meal">
                    <h1 className="first">Find Meals For Your Ingredients</h1>
                    <p>
                        Real food doesn't have ingredients, real food is ingredients. <span>- Jamie Oliver</span>
                    </p>
                    <div className="recipe-title_input">
                        <input type="text" onChange={(e) => setFood(e.target.value)} />
                        <i className="fa-solid fa-magnifying-glass" onClick={handleFindRecipe}></i>
                    </div>
                    <h1 className="recipe-search">Your Search Results:</h1>
                </div>
            </div>
            <div className="recipe-list">
                <div className="recipe-list_detailFood">
                    <Row>
                        {inforFood.meals &&
                            inforFood.meals.map((item) => (
                                <Col md={2}>
                                    <div className="recipe-list-food">
                                        <img src={item.strMealThumb} alt="" />
                                        <div className="recipe-list-food_content">
                                            <h2>{item.strMeal}</h2>
                                            <button onClick={() => handleDetail(item.idMeal)}>Get Recipe</button>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                    </Row>
                </div>
            </div>
            <div className={`recipe-clickFood ${popup && "active"}`}>
                <div className={`recipe-clickFood_inner ${popup && "active"} `}>
                    <div className="recipe-clickFood_close" onClick={handleClose}>
                        <span></span>
                        <i className="fa-solid fa-xmark"></i>
                    </div>
                    <div className="recipe-clickFood_box">
                        <div className="recipe-clickFood_box">
                            <div className="recipe-clickFood_text">
                                <h1>{detailFood.strMeal}</h1>

                                <p>
                                    <span>Instructions :</span>
                                    {detailFood.strInstructions}
                                </p>

                                <img src={detailFood.strMealThumb} alt="" />
                                <a href={detailFood.strYoutube} target="_blank">
                                    Watch Video
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recipe;
