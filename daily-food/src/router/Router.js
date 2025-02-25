import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Menu from "../pages/Menu/Menu";
import Calories from "~/pages/Calories/Calories";
import Recipe from "~/pages/Recipe/Recipe";
import Cart from "~/pages/Cart/Cart";
import Payment from "~/pages/Payment/Payment";
import Register from "~/pages/Register/Register";
import Login from "~/pages/Login/Login";
import Order from "~/pages/Order/Order";
import CategoryDetail from "~/pages/CategoryDetail/CategoryDetail";
import Dashboard from "~/pages/User/Dashboard/Dashboard";
import OrderProgressing from "~/pages/User/OrderProgressing/OrderProgressing";
import OrderDone from "~/pages/User/OrderDone/OrderDone";
import DayMenu from "~/pages/Admin/DayMenu/DayMenu";
import FoodMenu from "~/pages/Admin/FoodMenu/FoodMenu";
import OrderProgressingAdmin from "~/pages/Admin/OrderProgressingAdmin/OrderProgressingAdmin";
import CateMenu from "~/pages/Admin/CateMenu/CateMenu";
import Revenue from "~/pages/Admin/Revenue/Revenue";
import OrderDoneAdmin from "~/pages/Admin/OrderDoneAdmin/OrderDoneAdmin";
import OrderCancelAdmin from "~/pages/Admin/OrderCancelAdmin/OrderCancelAdmin";
import OrderCancel from "~/pages/User/OrderCancel/OrderCancel";
import UserManage from "~/pages/Admin/UserManage/UserManage";

const RouterUser = [
    { path: "/", component: Home },
    { path: "/about", component: About },
    { path: "/menu", component: Menu },
    { path: "/order", component: Order },
    { path: "/menu/:slug", component: Menu },
    { path: "/calories", component: Calories },
    { path: "/recipe", component: Recipe },
    { path: "/cart", component: Cart },
    { path: "/payment", component: Payment },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/categorydetail/:slug", component: CategoryDetail },
];
const RouterUserLogin = [
    { path: "/user/dashboard", component: Dashboard },
    { path: "/user/orderProgressing", component: OrderProgressing },
    { path: "/user/orderDone", component: OrderDone },
    { path: "/user/orderCancel", component: OrderCancel },
];
const RouterAdmin = [
    { path: "/admin", component: Revenue },
    { path: "/admin/catemenu", component: CateMenu },
    { path: "/admin/daymenu", component: DayMenu },
    { path: "/admin/foodmenu", component: FoodMenu },
    { path: "/admin/usermanage", component: UserManage },
    { path: "/admin/orderDoneAdmin", component: OrderDoneAdmin },
    { path: "/admin/orderProgressingAdmin", component: OrderProgressingAdmin },
    { path: "/admin/orderProgressingAdmin", component: OrderProgressingAdmin },
    { path: "/admin/orderCancelAdmin", component: OrderCancelAdmin },
];

export { RouterUser, RouterAdmin, RouterUserLogin };
