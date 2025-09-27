import { useState } from "react";
import { useSnackbar } from "../../context/SnackbarContext";
import useAuth from "../../context/useAuth";
import { searchArtist, switchArtist } from "../../services/services";
import "./searchpage.scss";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { showAlert } = useSnackbar();
  const { handleAuthSuccess } = useAuth();

  const handleSearch = async () => {
    if (!query?.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setResults([]);
    setHasSearched(true);
    try {
      const data = await searchArtist(query);
      setResults(data?.artists || []);
    } catch (error) {
      console.error("Failed to search:", error);
      showAlert("error", "Failed to search artists. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event?.key === "Enter") {
      handleSearch();
    }
  };

  const confirmBooking = async () => {
    if (!selectedArtist) return;

    setActionLoading(true);
    try {
      const res = await switchArtist(selectedArtist?.userId);
      setShowDialog(false);
      showAlert(
        "success",
        `You are now booking with ${selectedArtist?.businessName || "artist"}.`
      );
      localStorage?.setItem("artistId", selectedArtist?.userId || "");
      localStorage?.setItem("userId", res?.customer?.id || "");
      localStorage?.setItem("accessToken", res?.access_token || "");
      localStorage?.setItem("businessUri", selectedArtist?.businessUri || "");
      localStorage?.setItem("businessName", selectedArtist?.businessName || "");

      handleAuthSuccess(res?.customer, res?.access_token);
    } catch (error) {
      console.error("Failed to switch artist:", error);
      showAlert("error", "Failed to switch artist. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="search-page">
      <h1 className="title">Search Artists</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Type artist name..."
          value={query}
          onChange={(e) => {
            setQuery(e?.target?.value || "");
            setHasSearched(false);
          }}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Searching...
            </>
          ) : (
            "Search"
          )}
        </button>
      </div>

      <div className="results">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Searching for artists...</p>
          </div>
        ) : null}

        {!loading && (results?.length || 0) === 0 && hasSearched ? (
          <div className="no-results">
            <p>No artists found for "{query}". Try a different search term.</p>
          </div>
        ) : null}

        {!loading
          ? results?.map((artist, idx) =>
              artist ? (
                <div
                  key={idx}
                  className="artist-item"
                  onClick={() => {
                    setSelectedArtist(artist);
                    setShowDialog(true);
                  }}
                >
                  {artist?.businessName || "Artist"}
                </div>
              ) : null
            )
          : null}
      </div>

      {showDialog && selectedArtist ? (
        <div className="dialog-overlay">
          <div className="dialog">
            <p>
              Are you booking with{" "}
              <strong>{selectedArtist?.businessName || "this artist"}</strong>?
            </p>
            <div className="dialog-actions">
              <button
                onClick={() => setShowDialog(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button onClick={confirmBooking} disabled={actionLoading}>
                {actionLoading ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  "Yes"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SearchPage;
