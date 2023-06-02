import React, { useEffect } from "react";
import { Title } from "./ShipmentList.styled";
import { useState } from "react";
import { FiltersBlock } from "./FiltersBlock";
import { ShipmentBlock } from "./ShipmentBlock";
import { Container } from "./SharedLayout.styled";
import { getOrders, updateStatusBasedOnDate } from "../fakeApi";

export const ShipmentList = () => {
  const [shipments, setShipments] = useState(null);
  const [filteredShipments, setFilteredShipments] = useState(null);
  const [filters, setFilters] = useState({
    shipmentNum: "",
    status: "",
    originCity: "",
    destinationCity: "",
  });
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      shipmentNum: "",
      status: "",
      originCity: "",
      destinationCity: "",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedShipments = await getOrders();
        setShipments(fetchedShipments);
        const updatedShipments = await updateStatusBasedOnDate(
          fetchedShipments
        );

        // Оновити стан замовлень після оновлення статусів
        setShipments(updatedShipments);
      } catch (error) {
        console.error("Помилка при отриманні перевезень:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (shipments) {
      const applyFilters = (shipment) => {
        const { shipmentNum, status, originCity, destinationCity } = filters;
        return (
          shipment.shipmentNum
            .toString()
            .toLowerCase()
            .includes(shipmentNum.toLowerCase()) &&
          shipment.statusShip
            .toString()
            .toLowerCase()
            .includes(status.toLowerCase()) &&
          shipment.originCity
            .toLowerCase()
            .includes(originCity.toLowerCase()) &&
          shipment.destinationCity
            .toString()
            .toLowerCase()
            .includes(destinationCity.toLowerCase())
        );
      };

      const filteredShipments = shipments.filter(applyFilters);
      setFilteredShipments(filteredShipments);
    }
  }, [shipments, filters]);

  return (
    <Container>
      <Title>Вантажні перевезення</Title>

      {filteredShipments && (
        <>
          <FiltersBlock
            filters={filters}
            handleFilterChange={handleFilterChange}
            handleResetFilters={handleResetFilters}
          />
          {filteredShipments.map((shipment) => (
            <ShipmentBlock key={shipment.id} shipment={shipment} />
          ))}
        </>
      )}
    </Container>
  );
};
