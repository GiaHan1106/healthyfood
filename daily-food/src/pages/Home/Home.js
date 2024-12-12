import React from "react";
import Slide from "../Home/Slide/Slide";
import ChooseUs from "./ChooseUs/ChooseUs";
import Product from "./Product/Product";
import TabMenu from "./TabMenu/TabMenu";
import Feature from "./Feature/Feature";
import Enviroment from "./Enviroment/Enviroment";
import Map from "./Map/Map";
import FeedBack from "./FeedBack/FeedBack";
const Home = () => {
    return (
        <>
            <Slide></Slide>
            <ChooseUs></ChooseUs>
            <Product></Product>
            <TabMenu></TabMenu>
            <Enviroment></Enviroment>
            <Feature></Feature>
            <Map></Map>
            <FeedBack></FeedBack>
        </>
    );
};

export default Home;
