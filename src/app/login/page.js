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
    <div>
      <Header isLogout={true} />
      <div className="container">
        {/* <img
          className="w-52 mb-5"
          width="200"
          src="/spotify-logo.png"
          alt="Spotify Logo"
        /> */}
        <h2>アプリについて</h2>
        <p>
          ようこそ！このアプリは、Spotifyアカウントでログインするだけで、まだあまり聴かれていないあなたにぴったりの楽曲を提供します！
        </p>
        <h2>どうやって使うの？</h2>
        <p>
          ①ログイン:
          <div>まずはSpotifyアカウントでログインしてください。</div>
        </p>
        <p>
          ②アーティスト情報取得:
          <div>最近聴いた5組のアーティスト情報を取得します。</div>
        </p>
        <p>
          ③プレイリスト生成:
          <div>
            取得したアーティストに似た、あまり有名でない30曲を選び出し、新しいプレイリストを作成します。
          </div>
        </p>
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

      <style jsx>{`
        .container {
          max-width: 768px;
          width: 100vw;
          padding: 0 8px;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

export default Login;
