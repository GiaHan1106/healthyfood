import React from "react";
import { Col, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
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
                .min(8, "Password must be at least 8 characters long")
                .required("Password is required"),
            repassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Required"),
        }),
        onSubmit: async (values) => {
            // Kiểm tra xem email có tồn tại không
            const getUser = async () => {
                try {
                    const res = await axios.get("https://healthy-food.techtheworld.id.vn/user");
                    if (!res.data) {
                        throw new Error("No data returned from API");
                    }
                    return res.data;
                } catch (error) {
                    console.error("Error fetching users:", error);
                    return [];
                }
            };

            const arrayUser = await getUser();
            const checkEmailExist = arrayUser.find((item) => item.user_email === values.email);
            if (checkEmailExist) {
                toast.error("Email already exists!", { position: "top-center" });
                return;
            }

            // Gửi request POST với mật khẩu gốc chưa mã hóa
            try {
                const response = await fetch("https://healthy-food.techtheworld.id.vn/user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_user: values.user,
                        user_email: values.email,
                        user_password: values.password, // Mật khẩu chưa mã hóa
                        user_repassword: values.repassword,
                        user_permissions: "0",
                    }),
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                toast.success("Register successful!", { position: "top-center" });
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } catch (error) {
                console.error("Error posting data:", error);
                toast.error("An error occurred while registering", { position: "top-center" });
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
                            <h3>Let's go register your account!</h3>
                            <div className="register-input">
                                <h5>User name</h5>
                                <input onChange={formik.handleChange} type="text" name="user" value={formik.values.user} />
                                {formik.touched.user && formik.errors.user ? <div className="error">{formik.errors.user}</div> : null}
                            </div>
                            <div className="register-input">
                                <h5>Email</h5>
                                <input onChange={formik.handleChange} type="text" name="email" value={formik.values.email} />
                                {formik.touched.email && formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}
                            </div>
                            <div className="register-input">
                                <h5>Password</h5>
                                <input onChange={formik.handleChange} type="password" name="password" value={formik.values.password} />
                                {formik.touched.password && formik.errors.password ? <div className="error">{formik.errors.password}</div> : null}
                            </div>
                            <div className="register-input">
                                <h5>Repassword</h5>
                                <input onChange={formik.handleChange} type="password" name="repassword" value={formik.values.repassword} />
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
