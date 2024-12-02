import React from "react";
import { Col, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import bcrypt from "bcryptjs";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Register = () => {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            user: "",
            email: "",
            password: "",
            repassword: "",
        },
        validationSchema: Yup.object({
            user: Yup.string().required("Required"),
            email: Yup.string().email("Invalid email address").required("Required"),
            password: Yup.string()
                .matches(/[A-Z]/, "Password must contain at least one uppercase character")
                .matches(/[0-9]/, "Password must contain at least one digit")
                .matches(/[@$!%*?&#]/, "Password must contain at least one special character")
                .min(8, "password less than 8 character")
                .required("password is required"),
            repassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "repassword not correct with password")
                .required("Required"),
        }),
        onSubmit: async (values) => {
            const hashedPassword = await bcrypt.hash(values.password, 10);
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
            console.log(arrayUser);
            const checkEmailExist = arrayUser.find((item) => item.email === values.email);
            if (checkEmailExist) {
                toast.error("Email exists !", {
                    position: "top-center",
                });
            } else {
                try {
                    const response = await fetch("http://localhost:8081/user", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            ...values,
                            password: hashedPassword,
                            permissions: "0",
                        }),
                    });
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    toast.success("Register Successful !", {
                        position: "top-center",
                    });
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                } catch (error) {
                    console.error("Error posting data:", error);
                }
            }
        },
    });
    return (
        <div className="register">
            <Row>
                <Col md={5}>
                    <div className="register-left">
                        <img src="https://i.pinimg.com/564x/6f/e8/33/6fe833ec34bbfd5b71bd01e1178ae1ea.jpg" alt="" />
                    </div>
                </Col>
                <Col>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="register-right">
                            <h2>Welcome to Register!</h2>
                            <h3>Let go register your account !</h3>
                            <div class="register-input">
                                <h5>User name</h5>
                                <input onChange={formik.handleChange} type="text" name="user" />
                                {formik.touched.user && formik.errors.user ? <div className="error">{formik.errors.user}</div> : null}
                            </div>
                            <div class="register-input">
                                <h5>Email</h5>
                                <input onChange={formik.handleChange} type="text" name="email" />
                                {formik.touched.email && formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}
                            </div>
                            <div class="register-input">
                                <h5>Password</h5>
                                <input onChange={formik.handleChange} type="password" name="password" />
                                {formik.touched.password && formik.errors.password ? <div className="error">{formik.errors.password}</div> : null}
                            </div>
                            <div class="register-input">
                                <h5>Repassword</h5>
                                <input onChange={formik.handleChange} type="password" name="repassword" />
                                {formik.touched.repassword && formik.errors.repassword ? <div className="error">{formik.errors.repassword}</div> : null}
                            </div>
                            <button className="register-button" type="submit">
                                Register
                            </button>
                        </div>
                    </form>
                </Col>
            </Row>
        </div>
    );
};

export default Register;
