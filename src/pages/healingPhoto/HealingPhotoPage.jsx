import { CircularProgress } from "@mui/material";
import imageCompression from "browser-image-compression";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getHealingPhotoSession,
  uploadHealingPhoto,
} from "../../services/healingPhotoServices";
import "../formLink/formLinkPage.scss";
import "./healingPhotoPage.scss";

/**
 * Public page from the "Share a Healing Photo" button in an artist's healing
 * check-in. No login; the link only lets the client send photos to that
 * artist for that appointment.
 */
const HealingPhotoPage = () => {
  const { token } = useParams();
  const inputRef = useRef(null);
  const [session, setSession] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [sentPhotos, setSentPhotos] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getHealingPhotoSession(token)
      .then((data) => !cancelled && setSession(data))
      .catch((error) => !cancelled && setLoadError(error));
    return () => {
      cancelled = true;
    };
  }, [token]);

  const uploaded = (session?.photosUploaded ?? 0) + sentPhotos.length;
  const canSendMore = session && uploaded < session.maxPhotos;

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      // big enough for the artist to judge the healing
      const compressed = await imageCompression(file, {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 2000,
        useWebWorker: true,
      });
      const { url } = await uploadHealingPhoto(token, compressed);
      setSentPhotos((prev) => [...prev, url]);
    } catch (error) {
      setUploadError(error?.message || "Could not send the photo.");
    } finally {
      setUploading(false);
    }
  };

  const businessName = session?.business?.name || "your artist";

  const header = (
    <header className="form-link-page__brand">
      {session?.business?.logoUrl ? (
        <img
          src={session.business.logoUrl}
          alt=""
          className="form-link-page__logo"
        />
      ) : null}
      <span>{session?.business?.name || "PMU Forms"}</span>
    </header>
  );

  if (loadError) {
    return (
      <main className="form-link-page">
        {header}
        <section className="form-link-page__message">
          <h1>
            {loadError.status === 410
              ? "This link has expired"
              : "This link can't be opened"}
          </h1>
          <p>{loadError.message}</p>
        </section>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="form-link-page form-link-page--loading">
        <CircularProgress color="secondary" />
      </main>
    );
  }

  return (
    <main className="form-link-page">
      {header}
      <section className="form-link-page__message healing-photo">
        {sentPhotos.length > 0 ? (
          <>
            <div className="form-link-page__check" aria-hidden="true">
              ✓
            </div>
            <h1>Thank you, {session.clientFirstName}!</h1>
            <p>
              {sentPhotos.length === 1
                ? "Your photo was sent"
                : `${sentPhotos.length} photos were sent`}{" "}
              to {businessName}.
            </p>
            <div className="healing-photo__thumbs">
              {sentPhotos.map((url) => (
                <img key={url} src={url} alt="Healing photo you sent" />
              ))}
            </div>
          </>
        ) : (
          <>
            <h1>How is it healing, {session.clientFirstName}?</h1>
            <p>
              Send {businessName} a clear photo of your{" "}
              {session.services?.join(" & ") || "treatment"} in good, natural
              light.
            </p>
          </>
        )}

        {uploadError && (
          <p className="healing-photo__error" role="alert">
            {uploadError}
          </p>
        )}

        {canSendMore ? (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              data-testid="healing-photo-input"
              onChange={handleFile}
            />
            <button
              type="button"
              className="healing-photo__button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading
                ? "Sending..."
                : sentPhotos.length > 0
                ? "Send another photo"
                : "📷 Take or choose a photo"}
            </button>
          </>
        ) : (
          <p className="healing-photo__note">
            You've sent the maximum of {session.maxPhotos} photos. Thank you!
          </p>
        )}
      </section>
    </main>
  );
};

export default HealingPhotoPage;
