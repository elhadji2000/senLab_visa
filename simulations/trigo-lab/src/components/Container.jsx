import React from "react";

function Container({ children }) {
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "24px auto",
        padding: 20,
      }}
    >
      {children}
    </div>
  );
}

export default Container;
