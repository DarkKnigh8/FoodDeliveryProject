import { useParams } from 'react-router-dom';
import DeliveryMap from '../components/DeliveryMap'; // Real-time map
import DeliveryStatusUpdater from '../components/DeliveryStatusUpdater'; // Status update form for customer

const DeliveryTracker = () => {
  const { id } = useParams(); // Delivery ID from URL

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Delivery Tracker</h1>
        <DeliveryMap deliveryId={id} /> {/* Real-time map for customer */}
        <DeliveryStatusUpdater deliveryId={id} /> {/* Customer can track and see status */}
      </div>
    </div>
  );
};

export default DeliveryTracker;
