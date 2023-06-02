import { ShipmentList } from '../components/ShipmentList';
import backgroundImage from '../images/fon.jpg';

export const Shipments = () => {
  return (
    <main style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div>
        <ShipmentList />
      </div>
    </main>
  );
};
