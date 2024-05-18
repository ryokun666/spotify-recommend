"use client";

import { useEffect, useState } from "react";
import { playTrack, createPlaylist } from "@/lib/spotify";

const TrackList = ({
  tracks,
  currentPlayback,
  accessToken,
  userId,
  refreshTracks,
}) => {
  const [device, setDevice] = useState(null);

  useEffect(() => {
    if (currentPlayback && currentPlayback.device) {
      setDevice(currentPlayback.device.id);
    }
  }, [currentPlayback]);

  const handlePlayTrack = async (trackUri) => {
    if (device) {
      await playTrack(device, trackUri, accessToken);
    } else {
      console.error("No active device found");
    }
  };

  const handleCreatePlaylist = async () => {
    const trackUris = tracks.map((track) => track.uri);
    try {
      const playlistId = await createPlaylist(userId, trackUris, accessToken);
      if (playlistId) {
        alert(
          `プレイリストが作成されました: https://open.spotify.com/playlist/${playlistId}`
        );
      }
    } catch (error) {
      alert(
        "プレイリストの作成中にエラーが発生しました。詳細をコンソールで確認してください。"
      );
      console.error("Error creating playlist:", error);
    }
  };

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <div>
          <button
            onClick={handleCreatePlaylist}
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
            プレイリストを作成
          </button>
        </div>
        <div>
          <button
            onClick={refreshTracks}
            style={{
              marginBottom: "20px",
              marginLeft: "8px",
              padding: "10px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            更新
          </button>
        </div>
      </div>
      <ul>
        {tracks.map((track, index) => (
          <li key={index} style={{ display: "flex", marginBottom: "10px" }}>
            <div style={{ marginRight: "12px" }}>
              {track.album.images[0] && (
                <img
                  src={track.album.images[0].url}
                  width="60"
                  height="60"
                  alt={track.name}
                  onClick={() => handlePlayTrack(track.uri)}
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
            <div>
              <div
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                }}
              >
                <a
                  href={track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "black",
                    textDecoration: "none",
                  }}
                >
                  {track.name}
                </a>
              </div>
              <div>{track.artists.map((artist) => artist.name).join(", ")}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackList;
