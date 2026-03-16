import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = ({ redirectPath = "/" }) => {
  const navigate = useNavigate();
  const [counter, setCounter] = useState(10);

  useEffect(() => {
    if (counter <= 0) {
      navigate(redirectPath, { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      setCounter(counter - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [counter, navigate, redirectPath]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <h1 className="text-2xl font-bold mb-2">Unauthorized Access</h1>
      <p className="text-gray-600 mb-4">
        You do not have permission to view this page.
      </p>
      <p className="text-gray-500">
        Redirecting back in <span className="font-semibold">{counter}</span> seconds...
      </p>
    </div>
  );
};

export default Unauthorized;