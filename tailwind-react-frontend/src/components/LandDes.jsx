import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);

  // Array of images for background transition
  const images = [
    '/images/res4.jpg',  // Local images (in public/images folder)
    '/images/res5.jpg',
    '/images/res6.jpg',
    // Alternatively, you can use external URLs:
    // 'https://your-image-url.com/image1.jpg',
    // 'https://your-image-url.com/image2.jpg',
  ];

  // Automatically change the background image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval); // Clean up the interval when component is unmounted
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center transition-all duration-1000 ease-in-out"
      style={{
        backgroundImage: `url(${images[currentImage]})`, // Dynamically set the background image
        // filter: 'blur(8px)',  // Apply blur to background image
      }}
    >
      {/* Overlay to darken background */}
      <div className="bg-opacity-50 bg-black absolute top-0 left-0 w-full h-full"></div> {/* Updated this to use h-full and w-full */}

      {/* Main content container */}
      <div className="relative z-10 text-center text-white p-6 bg-opacity-50 bg-black rounded-lg mx-4 md:mx-0">
        <h1 className="text-4xl font-bold mb-8">Welcome to Our App</h1>
        <p className="text-lg mb-8">Explore amazing features, discover new things!</p>

        <div className="flex gap-6 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
