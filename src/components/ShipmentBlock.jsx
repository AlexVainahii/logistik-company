import React from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import {
  CardWrapper,
  ProductName,
  Wrapper,
  Status,
  Wrap,
  WrapArrow,
  Dates,
  Pag,
  Weight,
  ButtonWrapper,
} from "./ShipmentBlock.styled";
import { StyledIconAdd } from "./ShipmentBlockIcon.styled";
import { generateString, generateSumString } from "../fakeApi";

const getStatusColor = (status) => {
  let className = "default";

  switch (status) {
    case "В процесі":
      className = "in-progress";
      break;
    case "Виконано":
      className = "completed";
      break;
    default:
      className = "default";
      break;
  }

  return className;
};

const ShipmentBlock = ({ shipment }) => {
  const location = useLocation();

  return (
    <CardWrapper className={getStatusColor(shipment.statusShip)}>
      <Link
        to={`${shipment.id}`}
        state={{ from: location }}
        key={shipment.id}
        shipment={shipment}
      >
        <div>
          <ProductName>
            {shipment.isInternational
              ? "Міжнародне перевезення"
              : "Внутрішнє перевезення"}{" "}
            №: {shipment.shipmentNum}
          </ProductName>
          <Status>Статус: {shipment.statusShip}</Status>
          <Status>{generateString(shipment.client)}</Status>
          <Wrapper>
            <Wrap>
              <Pag>Початковий пункт:</Pag>
              <Pag>{shipment.originCity}</Pag>
              <Pag>{shipment.originCountry}</Pag>
              <Dates>
                Дата: {new Date(shipment.originDate).toLocaleDateString()}
              </Dates>
              <Weight>Вага: {generateSumString(shipment.weight, "кг")}</Weight>
            </Wrap>
            <WrapArrow>
              <Pag> {shipment.distance} км</Pag>
              <Icon component={ArrowForwardIcon} />
            </WrapArrow>
            <Wrap>
              <Pag>Кінцевий пункт:</Pag>
              <Pag>{shipment.destinationCity}</Pag>
              <Pag> {shipment.destinationCountry}</Pag>
              <Dates>
                Дата: {new Date(shipment.destinationDate).toLocaleDateString()}
              </Dates>
              <Weight>Ціна: {generateSumString(shipment.cost, "грн")}</Weight>
            </Wrap>
          </Wrapper>
        </div>
      </Link>
      {shipment.statusShip === "В очікуванні" && (
        <ButtonWrapper>
          <Link
            to={`/order/${shipment.id}`}
            state={{ from: location }}
            key={shipment.id}
            shipment={shipment}
          ></Link>
        </ButtonWrapper>
      )}
    </CardWrapper>
  );
};

export default ShipmentBlock;
