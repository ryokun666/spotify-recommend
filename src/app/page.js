"use client";
import { useEffect, useState } from "react";
import { useSession, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import spotifyApi, {
  searchTracks,
  getArtistImageUrl,
  getMyRecentlyPlayedTracks,
  getCurrentPlayback,
} from "@/lib/spotify";
import LogoutButton from "@/components/LogoutButton";
import TrackList from "@/components/TrackList";
import Header from "@/components/Header";
import "normalize.css";

function Home() {
  const { data: session } = useSession();
  const [recentTracks, setRecentTracks] = useState([]);
  const [currentPlayback, setCurrentPlayback] = useState(null);
  const [lastPlayedTime, setLastPlayedTime] = useState(null);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [artistData, setArtistData] = useState([]);
  const [userId, setUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!session) {
        router.push("/login");
        return;
      }

      try {
        spotifyApi.setAccessToken(session.user.accessToken);

        // ユーザー情報を取得
        const userProfile = await spotifyApi.getMe();
        setUserId(userProfile.body.id);

        // 最近再生したトラックを取得
        const recentTracksData = await getMyRecentlyPlayedTracks();
        setRecentTracks(recentTracksData);

        // 現在再生中の楽曲情報を取得
        const currentPlaybackData = await getCurrentPlayback(
          session.user.accessToken
        );
        setCurrentPlayback(currentPlaybackData);

        // 最近聞いた3アーティストのIDと名前を取得
        const uniqueArtists = new Map();
        for (const track of recentTracksData) {
          for (const artist of track.track.artists) {
            if (uniqueArtists.size < 5 && !uniqueArtists.has(artist.id)) {
              const imageUrl = await getArtistImageUrl(
                artist.id,
                session.user.accessToken
              );
              uniqueArtists.set(artist.id, { name: artist.name, imageUrl });
            }
          }
          if (uniqueArtists.size >= 5) break;
        }

        const artistIds = Array.from(uniqueArtists.keys());
        setArtistData(Array.from(uniqueArtists.values()));

        // 条件に合う楽曲を検索
        const filteredTracksData = await searchTracks(artistIds);
        setFilteredTracks(filteredTracksData);

        if (!currentPlaybackData.is_playing) {
          const lastPlayedDate = new Date(recentTracksData[0].played_at);
          const now = new Date();
          const diffInMinutes = Math.floor((now - lastPlayedDate) / 60000);
          setLastPlayedTime(diffInMinutes);
        }
      } catch (error) {
        console.error(
          "Error fetching data from Spotify API:",
          error.response?.data || error.message
        );
      }
    };

    if (session) {
      fetchData();
    }
  }, [session, router]);

  const refreshTracks = async () => {
    // アーティスト情報を再取得し、楽曲の再取得を行う
    try {
      const artistIds = Array.from(
        new Map(
          (await getMyRecentlyPlayedTracks()).map((track) => [
            track.track.artists[0].id,
            null,
          ])
        ).keys()
      );
      const newTracks = await searchTracks(artistIds);
      setFilteredTracks(newTracks);
    } catch (error) {
      console.error("Error fetching new tracks:", error);
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center", margin: "24px 0" }}>
        最近聴いたアーティスト
      </h2>
      <div className="mb-4">
        {artistData.length > 0 ? (
          <ul>
            {artistData.map((artist, index) => (
              <li
                key={index}
                style={{
                  fontSize: "1.2rem",
                  marginBottom: "5px",
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                {artist.imageUrl && (
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    width="50"
                    height="50"
                    style={{ marginRight: "10px", borderRadius: "50%" }}
                  />
                )}
                {artist.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No artists found.</p>
        )}
      </div>

      <hr />

      <h2 style={{ textAlign: "center", margin: "24px 0" }}>
        おすすめ楽曲一覧
      </h2>
      <TrackList
        tracks={filteredTracks}
        currentPlayback={currentPlayback}
        accessToken={session?.user.accessToken}
        userId={userId}
        refreshTracks={refreshTracks}
      />

      <hr />

      <h2>視聴履歴</h2>
      <div>
        <ul>
          {recentTracks.map((track, index) => (
            <li key={index} style={{ display: "flex" }}>
              <div style={{ marginRight: "12px" }}>
                {track.track.album.images[0] && (
                  <img
                    src={track.track.album.images[0].url}
                    width="60"
                    height="60"
                    alt={track.track.name}
                  />
                )}
              </div>
              <div>
                <div style={{ fontSize: "1.4rem", fontStyle: "bold" }}>
                  {track.track.name}
                </div>
                <div>
                  {track.track.artists.map((artist) => artist.name).join(", ")}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <Header />
      <Home />
      <style jsx>{`
        .container {
          max-width: 768px;
          width: 100vw;
          padding: 0 8px;
          box-sizing: border-box;
        }
      `}</style>
    </SessionProvider>
  );
}
