"use client";

import { useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";

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
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <img
        className="w-52 mb-5"
        width="200"
        src="/spotify-logo.png"
        alt="Spotify Logo"
      />
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-[#18D860] text-white p-5 rounded-full"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Login;
