import { useParams } from 'react-router-dom';
import DeliveryMap from '../components/DeliveryMap';

const DeliveryTracker = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          📦 Track Your Delivery
        </h1>
        <div className="rounded-lg overflow-hidden border border-gray-300">
          <DeliveryMap deliveryId={id} />
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracker;
