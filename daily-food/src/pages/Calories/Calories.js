import axios from "axios";
import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

const Calories = () => {
    const appId = "186c3fe1";
    const apiKey = "6057c94cb806a3946f6a66b28b91d25f";
    const [foodItem, setFoodItem] = useState("");
    const [weight, setWeight] = useState("");
    const [BMI, setBmi] = useState("");
    const [arrCalo, setArrCalo] = useState([]);
    const [error, setError] = useState("");
    const [totalDaily, setTotalDaily] = useState("");
    const [totalResult, setTotalResult] = useState("");
    const [inforTdee, setInforTdee] = useState({
        weightBmi: "",
        heightBmi: "",
        age: "",
        gender: "",
        activity: "",
    });
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
        let TDEE = "";
        if (inforTdee.gender === "male") {
            const bmrMale = 88.362 + 13.397 * inforTdee.weightBmi + (4.799 * inforTdee.heightBmi - 5.677 * inforTdee.age);
            TDEE = bmrMale * inforTdee.activity;
        } else {
            const bmrFemale = 447.593 + 9.247 * inforTdee.weightBmi + (3.098 * inforTdee.heightBmi - 4.33 * inforTdee.age);
            TDEE = bmrFemale * inforTdee.activity;
        }
        const convertHeight = inforTdee.heightBmi / 100;
        const checkHeight = convertHeight * convertHeight;
        const checkNumberBmi = Math.round(inforTdee.weightBmi / checkHeight);
        console.log(checkNumberBmi);
        setBmi(checkNumberBmi);
        setTotalDaily(TDEE);
        let result = "";
        if (BMI < 18.5) {
            result = "you should gain weight";
        } else if (BMI >= 18.5 && BMI <= 24.9) {
            result = "your weight is perfect, you should maintain it.";
        } else {
            result = "you are too fat, you should lose weight";
        }
        setTotalResult(result);
    };
    // const handleResult = (type) => {
    //     let total = 0;
    //     let result = "";
    //     let totalCalo = arrCalo.reduce((total, current) => total + current.calo, 0);
    //     if (type === "lose") {
    //         total = totalDaily - 500;
    //         if (totalCalo <= total) {
    //             result = "you ok";
    //         } else {
    //             result = "you not ok";
    //         }
    //     } else if (type === "keep") {
    //         total = totalDaily - 200;
    //         if (total > totalCalo - 200 && total < totalCalo - 200) {
    //             result = "you ok";
    //         } else {
    //             result = "you not ok";
    //         }
    //     } else {
    //         total = totalDaily + 500;
    //         if (totalCalo > total) {
    //             result = "you ok";
    //         } else {
    //             result = "you not ok";
    //         }
    //     }
    //     setResult({
    //         total,
    //         result,
    //     });
    // };
    return (
        <div className="calories">
            <div className="calories-image">
                <img src="https://i.pinimg.com/564x/bd/51/fd/bd51fdf1aaed650b239a4043cbad06b5.jpg" alt="" />
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
                        {/* {totalDaily && (
                            <div className="calories-buttonType">
                                <h2>What do you want</h2>
                                <div className="calories-buttonType-type">
                                    <button className="calories-buttonType-type_child" onClick={() => handleResult("lose")}>
                                        <i className="fa-solid fa-arrow-up"></i>Losing Weight
                                    </button>
                                    <button className="calories-buttonType-type_child" onClick={() => handleResult("keep")}>
                                        <i className="fa-solid fa-equals"></i> Keep Weight
                                    </button>
                                    <button className="calories-buttonType-type_child" onClick={() => handleResult("gain")}>
                                        <i className="fa-solid fa-arrow-down"></i>Weight Gain
                                    </button>
                                </div>
                            </div>
                        )} */}
                    </Col>
                </Row>
                {totalDaily && (
                    <div className="calories-result">
                        <h3>
                            With your BMI is {BMI} and {totalResult}
                        </h3>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default Calories;
