import React, { useState } from "react";
import axios from "axios";
import {
  addOrders,
  calculateShippingCost,
  getDistance,
  getInternational,
  getOrderById,
  getdestinationDate,
} from "../fakeApi";
import { useEffect } from "react";
import MapWithRoute from "./MapWithRoute";
import { Container } from "./SharedLayout.styled";
import { ShipmentBlock } from "./ShipmentBlock";
import { IconButton } from "@mui/material";
import { Back } from "./ShipmentBlock.styled";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Title } from "./ShipmentList.styled";
import { ToastContainer, toast } from "react-toastify";
import { nanoid } from "nanoid";

const OrderForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const backLinkHref = location.state?.from ?? "/shipments";
  const navigate = useNavigate();
  const currentDate = new Date().toISOString().split("T")[0];
  const [originCity, setOriginCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [weight, setWeight] = useState(50);
  const [originDate, setOriginDate] = useState(currentDate);
  const [destinationDate, setDestinationDate] = useState(currentDate);
  const [originRoute, setOriginRoute] = useState(null);
  const [destinationRoute, setdDestinationRoute] = useState(null);
  const [suggestedOrigins, setSuggestedOrigins] = useState([]);
  const [suggestedDestinations, setSuggestedDestinations] = useState([]);
  const [cost, setCost] = useState(0);
  const [distance, setDistance] = useState(0);
  const [createElement, setCreateElement] = useState(null);
  const [shipment, setShipment] = useState(null);
  const [client, setClient] = useState("");
  const [originFlag, setOriginFlag] = useState(false);
  const [destinationFlag, setoDestinationFlag] = useState(false);
  const handleOriginCityChange = async (event) => {
    const value = event.target.value;
    setOriginCity(value);

    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          value
        )}&key=4b6e7d31f0654074aa698fd64a45063c`
      );
      const suggestions = response.data.results;

      setSuggestedOrigins(suggestions);
      setOriginFlag(false);
    } catch (error) {
      console.log("Помилка запиту геокодування:", error.message);
      setSuggestedOrigins([]);
    }
  };

  const handleDestinationCityChange = async (event) => {
    const value = event.target.value;
    setDestinationCity(value);

    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          value
        )}&key=4b6e7d31f0654074aa698fd64a45063c`
      );
      const suggestions = response.data.results;
      setSuggestedDestinations(suggestions);
      setoDestinationFlag(false);
    } catch (error) {
      console.log("Помилка запиту геокодування:", error.message);
      setSuggestedDestinations([]);
    }
  };

  const handleSuggestionOriginSelected = (suggestion) => {
    if (suggestion.components) {
      const { city, country } = suggestion.components;
      setOriginCity(city);
      setOriginCountry(country);
      setOriginRoute(suggestion.geometry);
      setOriginFlag(true);
    }
    setSuggestedOrigins([]);
  };
  const handleSuggestionDestinationSelected = (suggestion) => {
    if (suggestion.components) {
      const { city, country } = suggestion.components;

      setDestinationCity(city);
      setDestinationCountry(country);
      setoDestinationFlag(true);
      setdDestinationRoute(suggestion.geometry);
    }
    setSuggestedDestinations([]);
  };

  const handleOriginDateChange = (event) => {
    const value = event.target.value;
    setOriginDate(value);
  };
  const handleClientChange = (event) => {
    const value = event.target.value;
    setClient(value);
  };
  const handleWeightChange = (event) => {
    const value = event.target.value;
    setWeight(value);
  };

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const fetchedShipment = await getOrderById(id);
          setShipment(fetchedShipment);
          setOriginCity(fetchedShipment.originCity);
          setOriginCountry(fetchedShipment.originCountry);
          setDestinationCity(fetchedShipment.destinationCity);
          setDestinationCountry(fetchedShipment.destinationCountry);
          setOriginDate(fetchedShipment.originDate);
          setDestinationDate(fetchedShipment.destinationDate);
          setOriginRoute(fetchedShipment.originRoute);
          setdDestinationRoute(fetchedShipment.destinationRoute);
          setWeight(50);
          setOriginFlag(true);
          setoDestinationFlag(true);
        } catch (error) {
          console.error("Помилка при отриманні перевезень:", error);
        }
      };

      fetchData();
    }
  }, [id]);
  useEffect(() => {
    //Отримуємо відстань у кілометрах
    if (originFlag && destinationFlag && weight !== 0) {
      const newDistance = getDistance(originRoute, destinationRoute);
      const newDestinationDate = getdestinationDate(newDistance, originDate);
      const shippingCost = calculateShippingCost(
        newDistance,
        weight,
        10,
        getInternational(originCity, destinationCity)
      );
      // Викликаємо функцію calculateShippingCost
      setDistance(newDistance);
      setCost(shippingCost);
      setDestinationDate(newDestinationDate);
    }
  }, [
    originDate,
    originCity,
    destinationCity,
    originRoute,
    destinationRoute,
    originFlag,
    destinationFlag,
    weight,
  ]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (id) {
      const newOrder = {
        ...shipment,
        cost: [...shipment.cost, cost],
        client: [...shipment.client, client],
        weight: [...shipment.weight, Number(weight)],
      };
      addOrders(newOrder);
    } else {
      // Створення нового об'єкта з введеними даними
      const newOrder = {
        id: nanoid(),
        shipmentNum: originCity[0] + destinationCity[0] + distance + client,
        originCity: originCity.toString(),
        originCountry: originCountry.toString(),

        destinationCity: destinationCity.toString(),
        destinationCountry: destinationCountry.toString(),
        weight: [Number(weight)],
        statusShip: "В очікуванні",
        originDate: new Date(originDate).toISOString(),
        destinationDate: new Date(destinationDate).toISOString(),
        originRoute: originRoute,
        destinationRoute: destinationRoute,
        isInternational: getInternational(originCountry, destinationCountry),
        distance: distance,
        cost: [cost],
        client: [client],
      };

      addOrders(newOrder);

      setShipment(newOrder);
      setCreateElement(true);
    }
    // Очищення форми після збереження
    setOriginCity("");
    setDestinationCity("");
    setOriginCountry("");
    setDestinationCountry("");
    setWeight(50);
    setOriginDate(currentDate);
    setDestinationDate(currentDate);
    setOriginRoute([]);
    setdDestinationRoute([]);
    setCost([]);
    setDistance(0);
    setOriginFlag(false);
    setoDestinationFlag(false);

    // Ваш код обробки форми

    // Показати Toast повідомлення
    if (id) {
      toast.success("Ваше дані успішно додані до Замовлення!", {
        position: toast.POSITION.TOP_RIGHT, // Встановлення позиції Toast
        autoClose: 3000, // Автоматичне закриття через 3 секунди
        hideProgressBar: true, // Відображення прогрес-бару
        closeOnClick: true, // Закриття Toast при кліку
        pauseOnHover: true, // Пауза при наведенні курсору
        draggable: true, // Можливість перетягування Toast
      });
      navigate(backLinkHref, { replace: true });
    } else {
      toast.success("Замовлення успішно збережено!", {
        position: toast.POSITION.TOP_RIGHT, // Встановлення позиції Toast
        autoClose: 3000, // Автоматичне закриття через 3 секунди
        hideProgressBar: true, // Відображення прогрес-бару
        closeOnClick: true, // Закриття Toast при кліку
        pauseOnHover: true, // Пауза при наведенні курсору
        draggable: true, // Можливість перетягування Toast
      });
    }
    // Виведення підтвердження успішного збереження
  };
  const handleNewShipment = () => {
    setCreateElement(false);
  };
  return (
    <Container>
      {!createElement ? (
        <Title style={{ marginTop: "0px", paddingTop: "20px" }}>
          Створити нове замовлення
        </Title>
      ) : (
        <Title style={{ marginTop: "0px", paddingTop: "20px" }}>
          Ваше замовлення
        </Title>
      )}
      {id && (
        <Link
          to={backLinkHref}
          style={{
            textDecoration: "none",
            marginLeft: "170px",
            display: "flex",
            alignItems: "center",
            color: "inherit",
            width: "50px",
          }}
        >
          <IconButton color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Back>Повернутись </Back>
        </Link>
      )}
      <div style={{ display: "flex" }}>
        {!createElement && (
          <form
            style={{
              width: "750px",
              margin: "0 auto", // Розміщення по центру
              padding: "20px", // Відступи від країв форми
              border: "1px solid #ccc", // Рамка форми
              borderRadius: "5px", // Закруглені кути форми
              boxSizing: "border-box", // Загальна ширина враховує відступи та рамку
            }}
            onSubmit={handleFormSubmit}
          >
            <div>
              <label htmlFor="originCity">Початковий пункт:</label>
              <input
                type="text"
                id="originCity"
                value={originCity}
                onChange={handleOriginCityChange}
                disabled={id}
                style={{
                  width: "100%",
                  padding: "5px",
                  borderRadius: "3px",
                  border: "1px solid #ccc",
                  backgroundColor: "#f5f5f5",
                }}
              />
              <ul style={{ listStyle: "none", padding: "0" }}>
                {suggestedOrigins
                  .filter(
                    (suggestion) => suggestion.components.city !== undefined
                  )
                  .map((suggestion) => (
                    <li
                      key={suggestion.geometry.lat + suggestion.geometry.lng}
                      onClick={() => handleSuggestionOriginSelected(suggestion)}
                    >
                      {suggestion.formatted}
                    </li>
                  ))}
              </ul>
              <label htmlFor="originCountry">Країна походження:</label>
              <input
                type="text"
                id="originCountry"
                value={originCountry}
                disabled
                style={{
                  width: "100%",
                  padding: "5px",
                  borderRadius: "3px",
                  border: "1px solid #ccc",
                  backgroundColor: "#f5f5f5",
                }}
              />
            </div>

            <div>
              <label htmlFor="destinationCity">Кінцевий пункт:</label>
              <input
                type="text"
                id="destinationCity"
                value={destinationCity}
                onChange={handleDestinationCityChange}
                disabled={id}
                style={{
                  width: "100%",
                  padding: "5px",
                  borderRadius: "3px",
                  border: "1px solid #ccc",
                  backgroundColor: "#f5f5f5",
                }}
              />
              <ul style={{ listStyle: "none", padding: "0" }}>
                {suggestedDestinations
                  .filter(
                    (suggestion) => suggestion.components.city !== undefined
                  )
                  .map((suggestion) => (
                    <li
                      key={suggestion.geometry.lat + suggestion.geometry.lng}
                      onClick={() =>
                        handleSuggestionDestinationSelected(suggestion)
                      }
                    >
                      {suggestion.formatted}
                    </li>
                  ))}
              </ul>
              <label htmlFor="destinationCountry">Країна призначення:</label>
              <input
                type="text"
                id="destinationCountry"
                value={destinationCountry}
                disabled
                style={{
                  width: "100%",
                  padding: "5px",
                  borderRadius: "3px",
                  border: "1px solid #ccc",
                  backgroundColor: "#f5f5f5",
                }}
              />
            </div>
            <div style={{ display: "flex", padding: "10px" }}>
              <div style={{ padding: "0px" }}>
                <div>
                  <label htmlFor="originDate" style={{ paddingRight: "20px" }}>
                    Дата погрузки:
                  </label>
                  <input
                    type="date"
                    id="originDate"
                    disabled={id}
                    value={originDate}
                    onChange={handleOriginDateChange}
                    min={currentDate}
                  />
                </div>
                <div>
                  <label
                    htmlFor="destinationDate"
                    style={{ paddingRight: "26px" }}
                  >
                    Дата приїзду:
                  </label>
                  <input
                    type="date"
                    id="destinationDate"
                    value={destinationDate}
                    min={currentDate}
                    disabled
                  />
                </div>
                <div>
                  <label htmlFor="client" style={{ marginRight: "20px" }}>
                    Замовник
                  </label>
                  <input
                    type="string"
                    id="client"
                    value={client}
                    onChange={handleClientChange}
                  />
                </div>
              </div>
              <div style={{ padding: "0" }}>
                <div>
                  <label htmlFor="weight" style={{ marginRight: "20px" }}>
                    Вага, кг:
                  </label>
                  <input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={handleWeightChange}
                    min={50}
                  />
                </div>
                <div>
                  <label htmlFor="distance" style={{ marginRight: "10px" }}>
                    Відстань:
                  </label>
                  <input
                    type="text"
                    id="distance"
                    value={distance}
                    disabled
                    style={{ fontWidth: 700 }}
                  />
                </div>

                <div>
                  <label htmlFor="cost" style={{ marginRight: "10px" }}>
                    Вартість доставки:
                  </label>
                  <input
                    type="text"
                    id="cost"
                    value={cost}
                    disabled
                    style={{ fontWidth: 700 }}
                  />
                </div>
              </div>
            </div>
            <button
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "3px",
                border: "none",
                backgroundColor: "#007bff",
                color: "#fff",
                cursor: "pointer",
              }}
              type="submit"
            >
              Відправити
            </button>
          </form>
        )}

        {createElement && (
          <div style={{ width: "750px" }}>
            <div
              style={{
                display: "flex",
              }}
            >
              <Link
                to={"/shipments"}
                style={{
                  width: "500px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  color: "inherit",
                }}
              >
                <IconButton color="primary">
                  <ArrowBackIcon />
                </IconButton>
                <Back style={{ marginRight: "150px" }}>
                  Перейти до списку перевезень
                </Back>
              </Link>
              <button
                style={{
                  padding: "10px",
                  borderRadius: "3px",
                  border: "none",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleNewShipment();
                }}
                type="button"
              >
                Зробити нове замовлення
              </button>
            </div>
            <ShipmentBlock shipment={shipment} condition={false} />
            <MapWithRoute shipment={shipment} />
          </div>
        )}
      </div>
      <ToastContainer />
    </Container>
  );
};

export default OrderForm;
