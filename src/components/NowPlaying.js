const NowPlaying = () => {
  return (
    <div className="mb-4">
      <h2>Now Playing</h2>
      {currentPlayback && currentPlayback.is_playing ? (
        <div className="flex" style={{ display: "flex" }}>
          <div style={{ margin: "20px" }}>
            {currentPlayback.item.album.images[0] && (
              <img
                src={currentPlayback.item.album.images[0].url}
                width="200"
                height="200"
                alt={currentPlayback.item.name}
                className="w-16 h-16 mr-4"
              />
            )}
          </div>
          <div>
            <p className="font-bold">
              <a
                href={currentPlayback.item.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                {currentPlayback.item.name}
              </a>
            </p>
            <p>
              {currentPlayback.item.artists
                .map((artist) => artist.name)
                .join(", ")}
            </p>
            <p className="text-sm">
              <a
                href={currentPlayback.item.album.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                {currentPlayback.item.album.name}
              </a>
            </p>
            <p className="text-sm">
              {(currentPlayback.item.duration_ms / 60000).toFixed(2)}min
            </p>
            <p className="text-sm">{currentPlayback.item.album.release_date}</p>
          </div>
        </div>
      ) : (
        <div>
          <p>{lastPlayedTime}分前に再生</p>

          <div className="flex" style={{ display: "flex" }}>
            <div style={{ margin: "20px" }}>
              {recentTracks[0].track.album.images[0] && (
                <img
                  src={recentTracks[0].track.album.images[0].url}
                  width="200"
                  height="200"
                  alt={recentTracks[0].track.name}
                  className="w-16 h-16 mr-4"
                />
              )}
            </div>
            <div>
              <p className="font-bold">
                <a
                  href={recentTracks[0].track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {recentTracks[0].track.name}
                </a>
              </p>
              <p>
                {recentTracks[0].track.artists
                  .map((artist) => artist.name)
                  .join(", ")}
              </p>
              <p className="text-sm">
                <a
                  href={recentTracks[0].track.album.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {recentTracks[0].track.album.name}
                </a>
              </p>
              <p className="text-sm">
                {(recentTracks[0].track.duration_ms / 60000).toFixed(2)}min
              </p>
              <p className="text-sm">
                {recentTracks[0].track.album.release_date}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NowPlaying;
