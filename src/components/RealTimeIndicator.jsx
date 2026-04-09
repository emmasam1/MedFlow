import React, { useEffect, useState } from "react";

const RealTimeIndicator = ({ lastUpdated }) => {
  const [timeAgo, setTimeAgo] = useState("");

  // Function to calculate "time ago"
  const getTimeAgo = () => {
    const now = new Date();
    const diff = Math.floor((now - new Date(lastUpdated)) / 1000);

    if (diff < 10) return "Live";
    if (diff < 60) return `${diff}s ago`;

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    return `${hours} hr ago`;
  };

  useEffect(() => {
    setTimeAgo(getTimeAgo());

    const interval = setInterval(() => {
      setTimeAgo(getTimeAgo());
    }, 5000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  const isLive = timeAgo === "Live";

  return (
    <div className="flex items-center space-x-2 text-xs">
      {/* Dot */}
      <span
        className={`w-2.5 h-2.5 rounded-full ${
          isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"
        }`}
      ></span>

      {/* Text */}
      <span className={isLive ? "text-green-500" : "text-gray-400"}>
        {isLive ? "Live" : `Last updated: ${timeAgo}`}
      </span>
    </div>
  );
};

export default RealTimeIndicator;