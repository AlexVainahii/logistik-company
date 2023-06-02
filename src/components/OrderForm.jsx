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
import ShipmentBlock from "./ShipmentBlock";
import { IconButton } from "@mui/material";
import { Back } from "./ShipmentBlock.styled";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Title } from "./OrderForm.styled";
import { ToastContainer, toast } from "react-toastify";
import { nanoid } from "nanoid";
import {
  ButtonsContainer,
  Form,
  FormRow,
  TextButton,
  Input,
  Label,
  LinkButton,
  SubmitButton,
  SuggestionsList,
} from "./OrderForm.styled";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
const OrderForm = () => {
  const { id } = useParams();
  const location = useLocation();
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
    // setOriginCity("");
    // setDestinationCity("");
    // setOriginCountry("");
    // setDestinationCountry("");
    // setWeight(50);
    // setOriginDate(currentDate);
    // setDestinationDate(currentDate);
    // setOriginRoute([]);
    // setdDestinationRoute([]);
    // setCost([]);
    // setDistance(0);
    // setOriginFlag(false);
    // setoDestinationFlag(false);

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
        <Title>Замовлення перевезення</Title>
      ) : (
        <Title>Оформлення замовлення</Title>
      )}

      <div style={{ display: "flex" }}>
        {!createElement && (
          <Form onSubmit={handleFormSubmit}>
            <FormRow>
              <Label htmlFor="originCity">Початковий пункт:</Label>
              <Input
                type="text"
                id="originCity"
                value={originCity}
                onChange={handleOriginCityChange}
                disabled={id}
              />
              <SuggestionsList>
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
              </SuggestionsList>
            </FormRow>

            <FormRow>
              <Label htmlFor="originCountry">Країна походження:</Label>
              <Input
                type="text"
                id="originCountry"
                value={originCountry}
                disabled
              />
            </FormRow>

            <FormRow>
              <Label htmlFor="destinationCity">Кінцевий пункт:</Label>
              <Input
                type="text"
                id="destinationCity"
                value={destinationCity}
                onChange={handleDestinationCityChange}
                disabled={id}
              />
              <SuggestionsList>
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
              </SuggestionsList>
            </FormRow>

            <FormRow>
              <Label htmlFor="destinationCountry">Країна призначення:</Label>
              <Input
                type="text"
                id="destinationCountry"
                value={destinationCountry}
                disabled
              />
            </FormRow>

            <FormRow>
              <Label htmlFor="originDate">Дата погрузки:</Label>
              <Input
                type="date"
                id="originDate"
                disabled={id}
                value={originDate}
                onChange={handleOriginDateChange}
                min={currentDate}
              />
            </FormRow>

            <FormRow>
              <Label htmlFor="client">Замовник:</Label>
              <Input
                type="string"
                id="client"
                value={client}
                onChange={handleClientChange}
              />
            </FormRow>

            <FormRow>
              <Label htmlFor="weight">Вага, кг:</Label>
              <Input
                type="number"
                id="weight"
                value={weight}
                onChange={handleWeightChange}
                min={50}
              />
            </FormRow>

            <FormRow>
              <Label htmlFor="distance">Відстань:</Label>
              <Input type="text" id="distance" value={distance} disabled />
            </FormRow>

            <FormRow>
              <Label htmlFor="cost">Вартість доставки:</Label>
              <Input type="text" id="cost" value={cost} disabled />
            </FormRow>

            <SubmitButton type="submit">
              <TextButton>Оформити замовлення </TextButton>
              <LocalShippingIcon />
            </SubmitButton>
          </Form>
        )}

        {createElement && (
          <div style={{ width: "750px" }}>
            <ButtonsContainer>
              <LinkButton to="/shipments">
                <IconButton color="primary">
                  <ArrowBackIcon />
                </IconButton>
                <Back>Перейти до списку перевезень</Back>
              </LinkButton>
              <ButtonsContainer onClick={handleNewShipment}>
                Створити замовлення
              </ButtonsContainer>
            </ButtonsContainer>
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
