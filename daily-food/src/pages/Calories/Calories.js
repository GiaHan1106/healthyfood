import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import UseFetch from "~/feature/UseFetch";
import CardMenu from "../Menu/CardMenu/CardMenu";
import { useCart } from "~/context/CartContext";

const Calories = () => {
    const appId = "186c3fe1";
    const apiKey = "6057c94cb806a3946f6a66b28b91d25f";
    const { addCartRetail } = useCart();
    const [menuItems, setMenuItems] = useState([]);
    const [foodItem, setFoodItem] = useState("");
    const [primaryResult, setPrimaryResult] = useState("");
    const [secondaryResult, setSecondaryResult] = useState("");
    const [weight, setWeight] = useState("");
    const [BMI, setBmi] = useState("");
    const [arrCalo, setArrCalo] = useState([]);
    const [error, setError] = useState("");
    const [totalDaily, setTotalDaily] = useState("");
    const [inforTdee, setInforTdee] = useState({
        weightBmi: "",
        heightBmi: "",
        age: "",
        gender: "",
        activity: "",
    });
    const listMenu = UseFetch(`http://localhost:8081/foodmenu`);
    const getNutritionData = async (food) => {
        try {
            const response = await axios.get(`https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${apiKey}&nutrition-type=logging&ingr=${food}`);
            if (response.data.calories === 0) {
                alert("no find food");
            } else {
                const caloriesPer100 = (100 * response.data.calories) / response.data.totalWeight;
                const caloriesFood = (caloriesPer100 * weight) / 100;
                console.log(response);
                const infoCalo = {
                    name: response.data.ingredients[0].text,
                    weight: weight,
                    calo: caloriesFood,
                };
                const newArrayCalo = [...arrCalo];
                newArrayCalo.push(infoCalo);
                setArrCalo(newArrayCalo);
            }
        } catch (err) {
            setError("Failed to fetch data:", { error });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (foodItem && weight) {
            getNutritionData(foodItem);
        }
    };
    const handleSetInforTdee = (e) => {
        setInforTdee({
            ...inforTdee,
            [e.target.name]: e.target.value,
        });
    };
    const handleCheckBmi = (e) => {
        e.preventDefault();

        // Tính TDEE
        let TDEE = "";
        if (inforTdee.gender === "male") {
            const bmrMale = 88.362 + 13.397 * inforTdee.weightBmi + (4.799 * inforTdee.heightBmi - 5.677 * inforTdee.age);
            TDEE = bmrMale * inforTdee.activity;
        } else {
            const bmrFemale = 447.593 + 9.247 * inforTdee.weightBmi + (3.098 * inforTdee.heightBmi - 4.33 * inforTdee.age);
            TDEE = bmrFemale * inforTdee.activity;
        }

        // Tính BMI
        const convertHeight = inforTdee.heightBmi / 100;
        const checkHeight = convertHeight * convertHeight;
        const checkNumberBmi = Math.round(inforTdee.weightBmi / checkHeight);
        setBmi(checkNumberBmi);
        setTotalDaily(TDEE);

        // Phân loại BMI và xử lý kết quả
        let primaryResult = "";
        let secondaryResult = "";
        let foodCategoryId = 0;
        let categoryName = "";

        if (checkNumberBmi < 18.5) {
            const weightIdealGain = (18.5 * checkHeight).toFixed(2);
            primaryResult = `You are underweight. Your ideal weight should be around ${weightIdealGain} kg. Consider a high-calorie diet with strength training.`;
            secondaryResult = "For underweight, consider eating from the 'Gymer' category for high-calorie and protein-rich meals.";
            foodCategoryId = 3; // Gymer
            categoryName = "GYMER"; // Thêm tên danh mục
        } else if (checkNumberBmi >= 18.5 && checkNumberBmi <= 24.9) {
            primaryResult = "Your weight is perfect! Keep maintaining your current lifestyle. Focus on balanced nutrition and regular exercise.";
            secondaryResult = "For maintaining weight, stick to the 'Healthy' category for balanced and nutritious meals.";
            foodCategoryId = 4; // Healthy
            categoryName = "HEALTHY"; // Thêm tên danh mục
        } else if (checkNumberBmi >= 25 && checkNumberBmi <= 29.9) {
            const weightIdeal = (22 * checkHeight).toFixed(2);
            primaryResult = `You are overweight. Your ideal weight should be around ${weightIdeal} kg. Try reducing calorie intake and increasing physical activity.`;
            secondaryResult = "For overweight, follow the 'Slimming' category for calorie-controlled meals.";
            foodCategoryId = 1; // Slimming
            categoryName = "SLIMMING"; // Thêm tên danh mục
        } else if (checkNumberBmi >= 30 && checkNumberBmi <= 34.9) {
            const weightIdeal = (22 * checkHeight).toFixed(2);
            primaryResult = `You are in Obesity Level 1. Your ideal weight should be around ${weightIdeal} kg. With level 1 obesity, which may pose health risks if it persists. Please adopt a healthier diet and a regular exercise routine.`;
            secondaryResult = "With your current weight you are suitable for the 'Slimming' category for calorie-controlled meals and focus on exercise.";
            foodCategoryId = 1; // Slimming
            categoryName = "SLIMMING"; // Thêm tên danh mục
        } else if (checkNumberBmi >= 35 && checkNumberBmi <= 39.9) {
            const weightIdeal = (22 * checkHeight).toFixed(2);
            primaryResult = `You are in Obesity Level 2. Your ideal weight should be around ${weightIdeal} kg. With level 2 obesity, which can lead to significant health concerns. Consider seeking professional guidance to reduce weight effectively.`;
            secondaryResult = "With your current weight you are suitable for the 'Slimming' category and consider seeking professional health guidance.";
            foodCategoryId = 1; // Slimming
            categoryName = "SLIMMING"; // Thêm tên danh mục
        } else {
            const weightIdeal = (22 * checkHeight).toFixed(2);
            primaryResult = `You are in Obesity Level 3. Your ideal weight should be around ${weightIdeal} kg. With level 3 obesity, which is considered severe. Immediate medical consultation and intervention are highly recommended.`;
            secondaryResult = "With your current weight, it's crucial to follow the 'Slimming' category and consult a healthcare provider.";
            foodCategoryId = 1; // Slimming
            categoryName = "SLIMMING"; // Thêm tên danh mục
        }

        // Cập nhật kết quả
        setPrimaryResult(primaryResult);
        setSecondaryResult(secondaryResult);

        // Lọc menuItems theo foodCategoryId
        const filteredMenuItems = listMenu
            .filter((item) => item.foodmenu_idCate === foodCategoryId)
            .map((item) => ({
                ...item,
                categoryName,
            }));
        setMenuItems(filteredMenuItems);
        console.log(filteredMenuItems);
    };

    useEffect(() => {
        if (listMenu && listMenu.length > 0) {
            setMenuItems(listMenu);
        }
    }, [listMenu]);
    return (
        <div className="calories">
            <div className="calories-image">
                <img src="https://www.springcreekmedical.com/wp-content/uploads/2022/05/healthy-diet-providence-ut-scaled.jpg" alt="" />
                <div className="calories-textBanner">
                    <h2>Caculate With Us</h2>
                    <h3>Calories & Bmi</h3>
                </div>
            </div>
            <Container>
                <Row>
                    <Col md={12} lg={6}>
                        <div className="calories-caculate">
                            <div className="calories-calo">
                                <h4>
                                    <span>
                                        <i className="fa-solid fa-carrot"></i>
                                    </span>
                                    Calories Checker
                                </h4>
                                <div className="calories-input">
                                    <input type="text" placeholder="Search name food" onChange={(e) => setFoodItem(e.target.value)} />
                                    <input type="number" placeholder="Quality Food" onChange={(e) => setWeight(e.target.value)} />
                                    <div className="calories-button">
                                        <button onClick={handleSubmit}>Search</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="calories-showResultCalo">
                            {arrCalo.map((item) => (
                                <div className="calories_showCalo">
                                    <p className="calories_leftCalo">{item.name}</p>
                                    <div className="calories_rightCalo">
                                        <p className="calories_rightCalo_text">
                                            <i className="fa-solid fa-fire"></i>
                                            <span>{item.calo.toFixed(2)} </span> Kcal /
                                        </p>
                                        <p className="calories_rightCalo_text">
                                            <i className="fa-solid fa-weight-scale"></i>
                                            <span>{item.weight}</span> g
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="calories-totalCalo">
                            Total Calories: <span>{arrCalo.reduce((total, current) => total + current.calo, 0).toFixed(2)} </span>Kcal
                        </p>
                    </Col>
                    <Col md={12} lg={6}>
                        <div className="calories-caculate">
                            <div className="calories-bmi">
                                <h4>
                                    <span>
                                        <i className="fa-solid fa-dumbbell"></i>
                                    </span>
                                    BMI Checker
                                </h4>
                                <div className="calories-input">
                                    <Row>
                                        <Col md={4}>
                                            <input type="text" placeholder="Your Height" name="heightBmi" onChange={handleSetInforTdee} />
                                            <input type="text" placeholder="Your Weight" name="weightBmi" onChange={handleSetInforTdee} />
                                        </Col>
                                        <Col md={4}>
                                            <input type="text" placeholder="Your Age" name="age" onChange={handleSetInforTdee} />
                                            <select name="gender" onChange={handleSetInforTdee}>
                                                <option value="">Gender</option>
                                                <option value="male">Men</option>
                                                <option value="female">Lady</option>
                                            </select>
                                        </Col>
                                        <Col md={4}>
                                            <select name="activity" onChange={handleSetInforTdee}>
                                                <option value="">Activity</option>
                                                <option value="1.2">Little or no activity</option>
                                                <option value="1.375">Moderate activity (moderate exercise 3-5 days/week)</option>
                                                <option value="1.725">Vigorous activity (heavy exercise 6-7 days/week)</option>
                                                <option value="1.9">Very vigorous activity (heavy labor or very strenuous exercise)</option>
                                            </select>
                                            <div className="calories-button">
                                                <button onClick={handleCheckBmi}>Check</button>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                        <div className="calories-showResultBmi">
                            <div className="calories_showbmi">
                                <p className="calories_leftbmi">Calo / day: {Number(totalDaily).toFixed(2)}</p>
                                <div className="calories_rightbmi">
                                    <p className="calories_rightbmi_text">
                                        <i className="fa-solid fa-weight-hanging"></i> <span>{inforTdee.weightBmi}</span> kg /
                                    </p>
                                    <p className="calories_rightbmi_text">
                                        <i className="fa-solid fa-scale-balanced"></i> <span>{inforTdee.heightBmi}</span> cm
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                {totalDaily && (
                    <div className="calories-result">
                        <h3>
                            YOUR CURRENT BMI <span>{BMI}</span>
                        </h3>
                        <div className="calories-result_bottom">
                            <ul>
                                <h5>Advice for you :</h5>
                                <li>{primaryResult}</li>
                                <li>{secondaryResult}</li>
                            </ul>
                            <p>You can learn more basic knowledge about nutrition to choose healthy foods or you can also message us for more specific personal advice.</p>
                        </div>
                        <h4>WE HAVE HEALTHY FOODS SUITABLE FOR YOUR WEIGHT IN OUR STORE</h4>
                        <Row>
                            {menuItems.map((food) => (
                                <Col xs={6} lg={3} key={food.foodmenu_id}>
                                    <div className="calories-detailMenu">
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
                                            deseases={food.categoryName === "HEALTHY" ? food.diseases : undefined}
                                            catemenuTitle={food.categoryName}
                                        />
                                        <button className="s-order-button" onClick={() => addCartRetail(food)}>
                                            Order
                                        </button>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default Calories;
