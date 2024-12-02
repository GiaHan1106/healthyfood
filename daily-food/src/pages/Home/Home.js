import React from "react";
import Slide from "../Home/Slide/Slide";
import Work from "./Work/Work";
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
            <Work></Work>
            <Product></Product>
            <TabMenu></TabMenu>
            <Feature></Feature>
            <Enviroment></Enviroment>
            <Map></Map>
            <FeedBack></FeedBack>
        </>
    );
};

export default Home;
