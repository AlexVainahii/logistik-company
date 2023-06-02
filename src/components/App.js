import { Route, Routes } from "react-router-dom";
import { About } from "../pages/About";
import { Home } from "../pages/Home";
import { Team } from "./Team";
import { Reviews } from "./Reviews";
import SharedLayout from "./SharedLayout";
import { Order } from "../pages/Order";
import "react-toastify/dist/ReactToastify.css";
import { AboutUs } from "./AboutUs";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        <Route index element={<Home />} />
        <Route path="/about/" element={<About />}>
          <Route path="/about/" element={<AboutUs />} />
          <Route path="team" element={<Team />} />
          <Route path="reviews" element={<Reviews />} />
        </Route>

        <Route path="/order" element={<Order />}></Route>
        <Route path="/order/:id" element={<Order />}></Route>
      </Route>
    </Routes>
  );
};

export default App;
