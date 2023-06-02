import MapWithRoute from "../components/MapWithRoute";
import { getOrderById } from "../fakeApi";
import { Link, useLocation, useParams } from "react-router-dom";
import { Container } from "../components/SharedLayout.styled";
import { ShipmentBlock } from "../components/ShipmentBlock";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Back } from "../components/ShipmentBlock.styled";
import { useEffect, useState } from "react";
export const ShipmentDetails = () => {
  const { id } = useParams();
  const [shipment, setShipment] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedShipment = await getOrderById(id);
        setShipment(fetchedShipment);
      } catch (error) {
        console.error("Помилка при отриманні перевезень:", error);
      }
    };

    fetchData();
  }, [id]);

  const location = useLocation();
  const backLinkHref = location.state?.from ?? "/shipments";

  return (
    <main>
      {shipment && (
        <div>
          <Container>
            <Link
              to={backLinkHref}
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                color: "inherit",
              }}
            >
              <IconButton color="primary">
                <ArrowBackIcon />
              </IconButton>
              <Back>Повернутись до списку перевезень</Back>
            </Link>

            <ShipmentBlock shipment={shipment} />

            <MapWithRoute shipment={shipment} />
          </Container>
        </div>
      )}
    </main>
  );
};
