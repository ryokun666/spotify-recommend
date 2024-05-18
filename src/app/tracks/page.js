"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LogoutButton from "@/components/LogoutButton";
import spotifyApi from "@/lib/spotify";
import { getTracksByDateRange } from "@/lib/spotify";
import SessionWrapper from "@/client/SessionWrapper";

function TracksPage() {
  const { data: session } = useSession();
  const [tracks, setTracks] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (session) {
      spotifyApi.setAccessToken(session.user.accessToken);
    }
  }, [session]);

  const handleFetchTracks = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    try {
      const fetchedTracks = await getTracksByDateRange(startDate, endDate);
      setTracks(fetchedTracks);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Tracks by Date Range</h1>
        <LogoutButton />
      </div>

      <div className="mb-4">
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-black ml-2 p-1"
          />
        </label>
        <label className="ml-4">
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="text-black ml-2 p-1"
          />
        </label>
        <button
          onClick={handleFetchTracks}
          className="bg-blue-500 ml-4 px-4 py-2 rounded"
        >
          Fetch Tracks
        </button>
      </div>

      <h2 className="text-xl mb-2">Tracks</h2>
      <div>
        <ul>
          {tracks.map((track, index) => (
            <li key={index} className="mb-2">
              <p>
                {track.track.name} -{" "}
                {track.track.artists.map((artist) => artist.name).join(", ")}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function TracksPageWrapper() {
  return (
    <SessionWrapper>
      <TracksPage />
    </SessionWrapper>
  );
}
