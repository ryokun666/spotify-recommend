// lib/spotify.js
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";

const scopes = [
  "user-read-playback-state",
  "user-read-recently-played",
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "user-library-modify",
  "streaming",
  "user-top-read",
  "user-read-playback-position",
  "user-read-currently-playing",
  "user-modify-playback-state",
  "playlist-modify-public",
  "playlist-modify-private",
].join(",");

const params = {
  scope: scopes,
};

const queryParamString = new URLSearchParams(params);

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

export default spotifyApi;
export { LOGIN_URL };

export async function getCurrentPlayback(accessToken) {
  try {
    const response = await axios.get("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Accept-Language": "ja",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching current playback state:", error);
    return null;
  }
}

export async function getMyRecentlyPlayedTracks() {
  try {
    const data = await spotifyApi.getMyRecentlyPlayedTracks({
      limit: 50,
      headers: {
        "Accept-Language": "ja",
      },
    });
    return data.body.items;
  } catch (error) {
    console.error("Error fetching recently played tracks:", error);
    return [];
  }
}

export async function getTracksByDateRange(startDate, endDate) {
  try {
    const afterTimestamp = new Date(startDate).getTime();
    const beforeTimestamp = new Date(endDate).getTime();

    let queryParams = {
      limit: 50,
    };

    if (startDate) {
      queryParams.after = afterTimestamp;
    }

    if (endDate) {
      queryParams.before = beforeTimestamp;
    }

    const data = await spotifyApi.getMyRecentlyPlayedTracks(queryParams);
    return data.body.items;
  } catch (error) {
    console.error("Error fetching tracks by date range:", error);
    return [];
  }
}

const getAccessToken = async () => {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "client_credentials",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    }
  );
  return response.data.access_token;
};

const getTrackDetails = async (trackId, token) => {
  const response = await axios.get(
    `https://api.spotify.com/v1/tracks/${trackId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

const getArtistDetails = async (artistId, token) => {
  const response = await axios.get(
    `https://api.spotify.com/v1/artists/${artistId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

/**
 * アーティストIDのリストに基づいて似た楽曲を取得し、その中から人気度が10以下の楽曲を30曲取得する。
 * @param {Array<string>} artistIds - SpotifyのアーティストIDのリスト。
 * @returns {Promise<Array>} - 条件に合うSpotifyのトラックオブジェクトのリストを返す。
 */
export async function searchTracks(artistIds) {
  let tracks = [];
  try {
    // APIのレートリミットや使用制限を考慮して一度に多めに取得
    const limit = 100;
    const response = await spotifyApi.getRecommendations({
      seed_artists: artistIds.slice(0, 5), // 最大5つのシード値
      limit: limit,
    });

    // 取得したトラックから人気度が10以下のものだけをフィルタリング
    tracks = response.body.tracks.filter((track) => track.popularity <= 10);

    // 30曲に達するまで追加のリクエストを繰り返す
    while (tracks.length < 30 && limit > tracks.length) {
      const moreTracks = await spotifyApi.getRecommendations({
        seed_artists: artistIds.slice(0, 5),
        limit: limit,
      });
      const filteredMoreTracks = moreTracks.body.tracks.filter(
        (track) => track.popularity <= 10
      );
      tracks = [...tracks, ...filteredMoreTracks].slice(0, 30); // 最初の30曲を保持
    }

    return tracks.slice(0, 30); // 最初の30曲のみを返す
  } catch (error) {
    console.error("Failed to fetch tracks:", error);
    throw error; // エラーを呼び出し元に伝播させる
  }
}

export const playTrack = async (deviceId, trackUri, token) => {
  try {
    await axios.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        uris: [trackUri],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error playing track:", error);
  }
};

export const createPlaylist = async (userId, trackUris, token) => {
  try {
    const now = new Date();
    const playlistName = `${now.getFullYear()}/${
      now.getMonth() + 1
    }/${now.getDate()} ${now.getHours()}:${now.getMinutes()}のおすすめたち`;

    const response = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: playlistName,
        description: "最近再生したトラックに基づくおすすめ楽曲",
        public: false,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const playlistId = response.data.id;

    // プレイリストにトラックを追加
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: trackUris,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return playlistId;
  } catch (error) {
    console.error("Error creating playlist:", error);
    throw error;
  }
};

export const getArtistImageUrl = async (artistId, token) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const artist = response.data;
    return artist.images.length > 0 ? artist.images[0].url : null;
  } catch (error) {
    console.error("Error fetching artist image URL:", error);
    return null;
  }
};
