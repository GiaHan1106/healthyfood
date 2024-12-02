import React from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import bcrypt from "bcryptjs";
import * as Yup from "yup";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUser } from "~/context/UserContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const navigate = useNavigate();
    const { getUserLogin } = useUser();
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Email is Required"),
            password: Yup.string().required("Password is Required"),
        }),
        onSubmit: async (values) => {
            const getUser = async () => {
                try {
                    const res = await axios.get("http://localhost:8081/user");
                    if (!res.data) {
                        throw new Error("No data returned from API");
                    }
                    return res.data;
                } catch (error) {
                    console.error("Error posting data:", error);
                }
            };

            const arrayUser = await getUser();
            const checkUser = arrayUser.find((item) => item.user_email === values.email);

            if (checkUser) {
                const match = await bcrypt.compare(values.password, checkUser.user_password);
                if (match) {
                    toast.success("Register Successful !", {
                        position: "top-center",
                    });
                    if (checkUser.user_permissions === 1) {
                        setTimeout(() => {
                            navigate("/admin");
                        }, 2000);
                    } else {
                        setTimeout(() => {
                            navigate("/");
                        }, 2000);
                    }
                    getUserLogin({ email: checkUser.user_email, username: checkUser.user_user, permissions: checkUser.user_permissions });
                } else {
                    toast.error("Password is not correct !", {
                        position: "top-center",
                    });
                }
            } else {
                alert("User not exists");
            }
        },
    });
    const handleGoogleSuccess = (credentialResponse) => {
        console.log(credentialResponse);
        const { credential } = credentialResponse;
        const user = jwtDecode(credential);
        if (user) {
            toast.success("Register Successful !", {
                position: "top-center",
            });
            setTimeout(() => {
                navigate("/");
            }, 2000);
            getUserLogin({ email: user.user_email, username: user.user_user });
        }
    };
    return (
        <div className="login">
            <Row>
                <Col lg={5}>
                    <div className="login-left">
                        <img src="https://i.pinimg.com/564x/98/81/a0/9881a072041b0e34d57f8678eabe569c.jpg" alt="" />
                    </div>
                </Col>
                <Col md={12} lg={7}>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="login-right">
                            <div className="login-right_text">
                                <h2>
                                    Welcome Back!
                                    <span>
                                        <i className="fa-solid fa-utensils"></i>
                                    </span>
                                </h2>
                                <h3>Sign In Continue using Order</h3>
                            </div>

                            <div className="login-input">
                                <h5>Email</h5>
                                <input onChange={formik.handleChange} type="text" name="email" />
                                {formik.touched.email && formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}
                            </div>
                            <div className="login-input">
                                <h5>Password</h5>
                                <input onChange={formik.handleChange} type="password" name="password" />
                                {formik.touched.password && formik.errors.password ? <div className="error">{formik.errors.password}</div> : null}
                            </div>
                            <div className="login-button">
                                <button className="login-button_login" type="submit">
                                    LOGIN
                                </button>
                                <h4>OR</h4>
                                <div className="login-button_google">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => {
                                            console.log("Login Failed");
                                        }}
                                    />
                                </div>

                                <p>
                                    Don't have account? <Link to="/register">Register Here</Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </Col>
            </Row>
        </div>
    );
};

export default Login;
