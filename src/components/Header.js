"use client";

import LogoutButton from "@/components/LogoutButton";

const Header = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100vw",
        backgroundColor: "#1DB954",
      }}
    >
      <div style={{ width: "50px" }}>
        <img
          src="/kaba_icon.svg"
          alt="Kaba icon"
          style={{
            width: "100%",
            margin: "10px",
            display: "grid",
            placeItems: "center",
          }}
        />
      </div>
      <div
        style={{
          display: "grid",
          placeItems: "center",
        }}
      >
        <h1 className="text-2xl" style={{ color: "white" }}>
          ディスカバ
        </h1>
      </div>
      <LogoutButton />
    </div>
  );
};

export default Header;
