import React, { useState } from "react";
import "./searchpage.scss";
import { searchArtist, switchArtist } from "../../services/services";
import { useSnackbar } from "../../context/SnackbarContext";
import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import { CircularProgress } from "@mui/material";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // Track if search has been performed
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { showAlert } = useSnackbar();
  const { handleAuthSuccess } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setHasSearched(true);
    console.log("Loading started:", true); // Debug log
    try {
      const data = await searchArtist(query);
      // Add minimum loading time to ensure spinner is visible
      await new Promise((resolve) => setTimeout(resolve, 800));
      setResults(data.artists || []);
    } catch (error) {
      console.error("Failed to search:", error);
    } finally {
      setLoading(false);
      console.log("Loading finished:", false); // Debug log
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const confirmBooking = async () => {
    if (!selectedArtist) return;
    console.log("Selected artist:", selectedArtist);
    setActionLoading(true);
    try {
      const res = await switchArtist(selectedArtist.userId);
      console.log("Switched context:", res);
      setShowDialog(false);
      showAlert(
        "success",
        `You are now booking with ${selectedArtist.businessName}.`
      );
      localStorage.setItem("artistId", selectedArtist.userId);
      localStorage.setItem("userId", res.customer?.id);
      localStorage.setItem("accessToken", res.access_token);
      handleAuthSuccess(res?.customer, res.access_token);
      navigate(`/customer/dashboard/${selectedArtist.businessUri}`);
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
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="results">
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "3rem",
              minHeight: "200px",
            }}
          >
            <CircularProgress
              size={60}
              style={{
                color: "#8e2d8e",
                marginBottom: "1rem",
              }}
            />
            <div style={{ color: "#8e2d8e", fontSize: "1rem" }}>
              Searching for artists...
            </div>
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "2rem",
              color: "#666",
              fontSize: "1.1rem",
            }}
          >
            No artists found for "{query}". Try searching with a different name.
          </div>
        ) : (
          results.map((artist, idx) => (
            <div
              key={idx}
              className="artist-item"
              onClick={() => {
                setSelectedArtist(artist);
                setShowDialog(true);
              }}
            >
              {artist.businessName}
            </div>
          ))
        )}
      </div>

      {showDialog && selectedArtist && (
        <div className="dialog-overlay">
          <div className="dialog">
            <p>
              Are you booking with{" "}
              <strong>{selectedArtist.businessName}</strong>?
            </p>
            <div className="dialog-actions">
              <button
                onClick={() => setShowDialog(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button onClick={confirmBooking} disabled={actionLoading}>
                {actionLoading ? "Processing..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
