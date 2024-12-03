const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "daiLy-food",
});

///CATEMENU
app.get("/catemenu", (req, res) => {
    const sql = "SELECT * FROM catemenu";
    db.query(sql, (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
});
app.get("/catemenu/:id", (req, res) => {
    let foodId = req.params.id;

    let sql = `SELECT * FROM catemenu WHERE catemenu_id = ${db.escape(foodId)}`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.post("/catemenu", (req, res) => {
    const { catemenu_title, catemenu_image, catemenu_calo, catemenu_describe } = req.body;

    const sql = `
        INSERT INTO catemenu (catemenu_title, catemenu_image, catemenu_calo, catemenu_describe)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [catemenu_title, catemenu_image, catemenu_calo, catemenu_describe], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error inserting catemenu" });
        }
        // Trả về catemenu_id tự động sinh từ cơ sở dữ liệu
        return res.status(200).json({
            message: "CateMenu created successfully",
            catemenu_id: result.insertId, // Trả về ID tự động sinh
        });
    });
});

app.put("/catemenu/:catemenu_id", (req, res) => {
    const catemenu_id = req.params.catemenu_id;
    const { catemenu_title, catemenu_image, catemenu_calo, catemenu_describe } = req.body;
    if (!catemenu_title || !catemenu_image || !catemenu_calo || !catemenu_describe) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const sql = `
        UPDATE catemenu
        SET catemenu_title = ?, catemenu_image = ?, catemenu_calo = ?, catemenu_describe = ?
        WHERE catemenu_id = ?
    `;
    db.query(sql, [catemenu_title, catemenu_image, catemenu_calo, catemenu_describe, catemenu_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error updating catemenu" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "CateMenu not found" });
        }

        return res.status(200).json({
            message: "CateMenu updated successfully",
            catemenu_id,
        });
    });
});
app.delete("/catemenu/:catemenu_id", (req, res) => {
    const catemenu_id = req.params.catemenu_id;

    const sql = `
        DELETE FROM catemenu
        WHERE catemenu_id = ?
    `;

    db.query(sql, [catemenu_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error deleting catemenu" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "CateMenu not found" });
        }

        return res.status(200).json({
            message: "CateMenu deleted successfully",
            catemenu_id,
        });
    });
});

///DAYMENU
app.get("/daymenu", (req, res) => {
    let foodId = req.query.idCate;
    let sql = "SELECT * FROM daymenu";
    if (foodId) {
        if (isNaN(foodId)) {
            return res.status(400).json({ error: "Invalid idCate format" });
        }
        sql += ` WHERE daymenu_idCate = ${db.escape(foodId)}`;
    }

    db.query(sql, (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
});
app.get("/daymenu/:id", (req, res) => {
    let foodId = req.params.id;

    let sql = `SELECT * FROM daymenu WHERE daymenu_id = ${db.escape(foodId)}`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});
app.post("/daymenu", (req, res) => {
    const { daymenu_idCate, daymenu_day } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!daymenu_idCate || !daymenu_day) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Kiểm tra kiểu dữ liệu
    if (typeof daymenu_idCate !== "number" || typeof daymenu_day !== "string") {
        return res.status(400).json({ error: "Invalid data type" });
    }

    // Trim giá trị `daymenu_day`
    const trimmedDay = daymenu_day.trim();

    // Kiểm tra ID danh mục có tồn tại không
    const checkCategorySQL = "SELECT * FROM catemenu WHERE catemenu_id = ?";
    db.query(checkCategorySQL, [daymenu_idCate], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.length === 0) {
            return res.status(400).json({ error: "Invalid category ID" });
        }

        // Thêm mới vào bảng `daymenu`
        const insertSQL = "INSERT INTO daymenu (daymenu_idCate, daymenu_day) VALUES (?, ?)";
        db.query(insertSQL, [daymenu_idCate, trimmedDay], (err, insertResult) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res.status(500).json({ error: "Error inserting data into database" });
            }

            // Trả về daymenu_id tự động sinh và các giá trị liên quan
            return res.status(201).json({
                message: "DayMenu created successfully",
                daymenu_id: insertResult.insertId, // ID tự động sinh từ SQL
                daymenu_idCate,
                daymenu_day: trimmedDay,
            });
        });
    });
});
app.put("/daymenu/:id", (req, res) => {
    const { daymenu_idCate, daymenu_day } = req.body;
    const { id } = req.params; // Lấy `id` từ tham số URL

    // Kiểm tra các trường bắt buộc
    if (!daymenu_idCate || !daymenu_day) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Kiểm tra kiểu dữ liệu
    if (typeof daymenu_idCate !== "number" || typeof daymenu_day !== "string") {
        return res.status(400).json({ error: "Invalid data type" });
    }

    // Trim giá trị `daymenu_day`
    const trimmedDay = daymenu_day.trim();

    // Kiểm tra ID danh mục có tồn tại không
    const checkCategorySQL = "SELECT * FROM catemenu WHERE catemenu_id = ?";
    db.query(checkCategorySQL, [daymenu_idCate], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.length === 0) {
            return res.status(400).json({ error: "Invalid category ID" });
        }

        // Cập nhật thông tin trong bảng `daymenu`
        const updateSQL = "UPDATE daymenu SET daymenu_idCate = ?, daymenu_day = ? WHERE daymenu_id = ?";
        db.query(updateSQL, [daymenu_idCate, trimmedDay, id], (err, updateResult) => {
            if (err) {
                console.error("Error updating data:", err);
                return res.status(500).json({ error: "Error updating data in database" });
            }

            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ error: "DayMenu not found" });
            }

            // Trả về thông tin đã cập nhật
            return res.status(200).json({
                message: "DayMenu updated successfully",
                daymenu_id: id,
                daymenu_idCate,
                daymenu_day: trimmedDay,
            });
        });
    });
});
app.delete("/daymenu/:id", (req, res) => {
    const { id } = req.params; // Lấy `id` từ tham số URL

    // Xóa bản ghi trong bảng `daymenu`
    const deleteSQL = "DELETE FROM daymenu WHERE daymenu_id = ?";
    db.query(deleteSQL, [id], (err, deleteResult) => {
        if (err) {
            console.error("Error deleting data:", err);
            return res.status(500).json({ error: "Error deleting data from database" });
        }

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ error: "DayMenu not found" });
        }

        // Trả về thông báo thành công
        return res.status(200).json({
            message: "DayMenu deleted successfully",
            daymenu_id: id,
        });
    });
});

///FOODMENU
app.get("/foodmenu/:foodmenu_id", (req, res) => {
    let foodId = req.params.foodmenu_id; // Sửa từ 'id' thành 'foodmenu_id'
    let sql = `SELECT * FROM foodmenu WHERE foodmenu_id = ${db.escape(foodId)}`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.get("/foodmenu", (req, res) => {
    let foodId = req.query.idCate;
    let sql = "SELECT * FROM foodmenu";
    if (foodId) {
        if (isNaN(foodId)) {
            return res.status(400).json({ error: "Invalid idCate format" });
        }
        sql += ` WHERE foodmenu_idCate = ${db.escape(foodId)}`;
    }
    db.query(sql, (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
});
app.post("/foodmenu", async (req, res) => {
    const {
        foodmenu_idCate,
        foodmenu_idDay,
        foodmenu_name,
        foodmenu_time,
        foodmenu_image,
        foodmenu_des,
        foodmenu_calories,
        foodmenu_carbohydrates,
        foodmenu_protein,
        foodmenu_fat,
        allday,
        price,
        diseases, // Thêm trường này
    } = req.body;

    try {
        const sql = `
            INSERT INTO foodmenu (foodmenu_idCate, foodmenu_idDay, foodmenu_name, foodmenu_time ,foodmenu_image, foodmenu_des, foodmenu_calories,foodmenu_carbohydrates, foodmenu_protein, foodmenu_fat, allday, price, diseases) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.query(sql, [
            foodmenu_idCate,
            foodmenu_idDay,
            foodmenu_name,
            foodmenu_time,
            foodmenu_image,
            foodmenu_des,
            foodmenu_calories,
            foodmenu_carbohydrates,
            foodmenu_protein,
            foodmenu_fat,
            allday,
            price,
            diseases, // Truyền giá trị diseases
        ]);
        res.status(201).json({ message: "Food added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add food" });
    }
});

app.put("/foodmenu/:foodmenu_id", (req, res) => {
    const foodmenu_id = req.params.foodmenu_id;
    const {
        foodmenu_idCate,
        foodmenu_idDay,
        foodmenu_name,
        foodmenu_time,
        foodmenu_image,
        foodmenu_des,
        foodmenu_calories,
        foodmenu_carbohydrates,
        foodmenu_protein,
        foodmenu_fat,
        allday,
        price,
        diseases,
    } = req.body;
    if (
        !foodmenu_idCate ||
        !foodmenu_idDay ||
        !foodmenu_name ||
        !foodmenu_time ||
        !foodmenu_image ||
        !foodmenu_des ||
        !foodmenu_calories ||
        !foodmenu_carbohydrates ||
        !foodmenu_protein ||
        !foodmenu_fat ||
        !diseases ||
        !allday ||
        !price
    ) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const sql = `
        UPDATE foodmenu
        SET  foodmenu_idCate = ?, 
            foodmenu_idDay = ?, 
            foodmenu_name = ?, 
            foodmenu_time = ?, 
            foodmenu_image = ?, 
            foodmenu_des = ?, 
            foodmenu_calories = ?, 
            foodmenu_carbohydrates = ?, 
            foodmenu_protein = ?, 
            foodmenu_fat = ?, 
            allday = ?, 
            price = ?, 
            diseases = ?
        WHERE foodmenu_id = ? `;
    db.query(
        sql,
        [
            foodmenu_idCate,
            foodmenu_idDay,
            foodmenu_name,
            foodmenu_time,
            foodmenu_image,
            foodmenu_des,
            foodmenu_calories,
            foodmenu_carbohydrates,
            foodmenu_protein,
            foodmenu_fat,
            allday,
            price,
            diseases,
            foodmenu_id,
        ],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error updating Foodmenu" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Foodmenu not found" });
            }

            return res.status(200).json({
                message: "Foodmenu updated successfully",
                foodmenu_id,
            });
        }
    );
});

app.delete("/foodmenu/:id", (req, res) => {
    const { id } = req.params; // Lấy `id` từ tham số URL

    // Xóa bản ghi trong bảng `foodmenu`
    const deleteSQL = "DELETE FROM foodmenu WHERE foodmenu_id = ?";
    db.query(deleteSQL, [id], (err, deleteResult) => {
        if (err) {
            console.error("Error deleting data:", err);
            return res.status(500).json({ error: "Error deleting data from database" });
        }

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ error: "foodmenu not found" });
        }

        // Trả về thông báo thành công
        return res.status(200).json({
            message: "foodmenu deleted successfully",
            foodmenu_id: id,
        });
    });
});

///ORDERS
app.get("/orders", (req, res) => {
    const sql = "SELECT * FROM `orders`";
    db.query(sql, (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
});
app.post("/orders", (req, res) => {
    const { id, idOrders, codeDiscount, information, cart, payment, cartRetail } = req.body;
    console.log("=====Received data:=======", req.body);
    const sql = `
        INSERT INTO orders (id, idOrders, codeDiscount, information, cart, payment, cartRetail)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [id, idOrders, codeDiscount, JSON.stringify(information), JSON.stringify(cart), payment, JSON.stringify(cartRetail)], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error inserting order" });
        }
        return res.status(200).json({ message: "Order created successfully" });
    });
});

///USER
app.get("/user", (req, res) => {
    const sql = "SELECT * FROM user";
    db.query(sql, (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
});

app.listen(8081, () => {
    console.log("listening");
});
