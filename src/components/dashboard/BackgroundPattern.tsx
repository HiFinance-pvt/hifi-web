import React from "react";

const BackgroundPattern = () => (
  <div className="absolute inset-0 opacity-30">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
        backgroundSize: "100px 100px",
      }}
    />
  </div>
);

export default BackgroundPattern;
