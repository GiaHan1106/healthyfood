import { useContext, createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartRetail, setCartRetail] = useState([]);
  useEffect(() => {
    const cartPro = JSON.parse(localStorage.getItem("CART"));
    if (cartPro) {
      setCart(cartPro);
    }
  }, []);

  ///add combo theo ngày
  const addCart = (item, slug, title) => {
    const checkCart = cart.find(
      (product) => product.id === item.daymenu_id && product.slug === slug
    );
    if (!checkCart) {
      const newCartItem = { ...item, slug, title, price: item.price }; // Giá đã giảm
      const newCart = [...cart, newCartItem];
      setCart(newCart);
      localStorage.setItem("CART", JSON.stringify(newCart));
      toast.success("Success Add to cart !", {
        position: "top-center",
      });
    } else {
      toast.error("Day already exists!", {
        position: "top-center",
      });
    }
  };

  ///add combo lẻ theo buổi
  const addCartRetail = (food) => {
    const checkCartRetail = cartRetail.findIndex(
      (item) => item.foodmenu_id === food.foodmenu_id
    );
    console.log(checkCartRetail);
    const newCart = [...cartRetail];
    if (checkCartRetail >= 0) {
      newCart[checkCartRetail].quantity += 1;
    } else {
      food.quantity = 1;
      newCart.push(food);
    }
    toast.success("Success Add to cart !", {
      position: "top-center",
    });
    setCartRetail(newCart);
    localStorage.setItem("CARTRETAIL", JSON.stringify(newCart));
  };

  const deleteCart = (id) => {
    const indexProduct = cart.findIndex((item) => id === item.daymenu_id);
    const arrayNew = [...cart];
    arrayNew.splice(indexProduct, 1);
    setCart(arrayNew);
    localStorage.setItem("CART", JSON.stringify(arrayNew));
  };
  const deleteCartRetail = (id) => {
    const indexProduct = cartRetail.findIndex(
      (item) => id === item.foodmenu_id
    );
    const newCart = [...cartRetail];
    newCart.splice(indexProduct, 1);
    setCartRetail(newCart);
    localStorage.setItem("CARTRETAIL", JSON.stringify(newCart));
  };
  const deleteAll = () => {
    setCart([]);
    localStorage.removeItem("CART");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartRetail,
        addCart,
        addCartRetail,
        deleteCart,
        deleteCartRetail,
        deleteAll,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
const useCart = () => {
  return useContext(CartContext);
};
export { CartProvider, useCart };
