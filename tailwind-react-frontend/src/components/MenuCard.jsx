export default function MenuCard({ item, quantity, onChange }) {
    return (
      <div className="w-[200px] bg-white border rounded-lg shadow p-3 flex flex-col items-center">
        <img
          src={item.image}
          alt={item.name}
          className="h-32 w-32 object-cover rounded-md mb-2"
        />
        <p className="font-semibold text-center">{item.name}</p>
        <p className="text-sm text-gray-600">LKR {item.price}</p>
  
        <div className="flex items-center mt-2 space-x-2">
          <button
            onClick={() => onChange(item, Math.max(0, quantity - 1))}
            className="px-2 py-1 text-white bg-gray-500 hover:bg-gray-600 rounded"
          >
            -
          </button>
          <span className="font-medium">{quantity}</span>
          <button
            onClick={() => onChange(item, quantity + 1)}
            className="px-2 py-1 text-white bg-green-600 hover:bg-green-700 rounded"
          >
            +
          </button>
        </div>
      </div>
    );
  } 