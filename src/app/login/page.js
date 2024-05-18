"use client";

import { useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import Header from "@/components/Header";

function Login() {
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getProviders();
      setProviders(res);
    };

    fetchData();
  }, []);

  if (!providers) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <Header isLogout={true} />
      <div style={{ margin: "20px 0" }}>
        {/* <img
          className="w-52 mb-5"
          width="200"
          src="/spotify-logo.png"
          alt="Spotify Logo"
        /> */}
        <h1>ディスカバ</h1>
        <p></p>
      </div>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            style={{
              marginBottom: "20px",
              padding: "10px",
              backgroundColor: "#1DB954",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Login;
