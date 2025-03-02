import { useState } from "react";
import instagram from "./assets/icons8-instagram.svg";
import reddit from "./assets/icons8-reddit.svg";
import facebook from "./assets/icons8-facebook.svg";
import twitter from "./assets/icons8-twitter.svg";
import youtube from "./assets/icons8-youtube.svg";

const Home = () => {
  const [url, setUrl] = useState("");
  const [videoQuality, setVideoQuality] = useState("max");
  const [audioFormat, setAudioFormat] = useState("mp3");
  const [downloadMode, setDownloadMode] = useState("auto");
  const [youtubeVideoCodec, setYoutubeVideoCodec] = useState("h264");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:9000";

  function handleLinkChange(e) {
    setUrl(e.target.value);
  }

  const handleDownload = async () => {
    if (!url) {
      alert("Please enter a video URL.");
      return;
    }

    const requestData = {
      url,
      videoQuality,
      audioFormat,
      downloadMode,
      youtubeVideoCodec,
    };

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (
        data.status === "tunnel" ||
        (data.status === "redirect" && data.url)
      ) {
        let fixedUrl = data.url
          .replace("https://", "http://") // Ensure HTTP
          .replace("api.url.example", "localhost:9000"); // Fix incorrect API domain

        const fileName = data.filename || "downloaded-file"; // Use filename from API or default

        const link = document.createElement("a");
        link.href = fixedUrl;
        link.download = fileName; // Dynamically set the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // setUrl("");

        setError("");
      } else if (data.status === "error") {
        setError("Error: " + (data.error?.code || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to connect to the API.");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <div class="background-image">
      <div class="video-downloader">
        <div className="text-container">
          <h3 id="heading">Download Videos for free...</h3>
          <p id="description">
            Supports -
            <img src={instagram} alt="insta logo" />
            <img src={youtube} alt="youtube logo" />
            <img src={twitter} alt="twitter logo" />
            <img src={reddit} alt="reddit logo" />
            <img src={facebook} alt="facebook logo" />+ 16 others
          </p>
        </div>

        <div className="interact">
          <input
            type="text"
            name=""
            id="link"
            placeholder="paste your link here ..."
            value={url}
            onChange={handleLinkChange}
          />

          {loading ? (
            <button disabled>Wait your download will start shortly...</button> // Show loading text
          ) : (
            <button onClick={handleDownload}>Download</button> // Show download button
          )}

          <select
            class="dropdown"
            name=""
            id=""
            value={videoQuality}
            onChange={(e) => setVideoQuality(e.target.value)}
          >
            <option value="max">Best Available video resolution</option>
            <option value="4320">8K (4320p)</option>
            <option value="2160">4K (2160p)</option>
            <option value="1080">Full HD (1080p)</option>
            <option value="720">HD (720p)</option>
            <option value="480">SD (480p)</option>
            <option value="360">Low (360p)</option>
            <option value="144">Lowest (144p)</option>
          </select>

          <select
            class="dropdown"
            name=""
            id=""
            value={audioFormat}
            onChange={(e) => setAudioFormat(e.target.value)}
          >
            <option value="best">Best</option>
            <option value="mp3">MP3</option>
            <option value="ogg">OGG</option>
            <option value="wav">WAV</option>
            <option value="opus">Opus</option>
          </select>

          <select
            class="dropdown"
            name=""
            id=""
            value={downloadMode}
            onChange={(e) => setDownloadMode(e.target.value)}
          >
            <option value="auto">Auto (Video + Audio)</option>
            <option value="audio">Audio Only</option>
            <option value="mute">Mute (No Audio)</option>
          </select>

          <select
            class="dropdown"
            name=""
            id=""
            value={youtubeVideoCodec}
            onChange={(e) => setYoutubeVideoCodec(e.target.value)}
          >
            <option value="h264">H.264 (Recommended)</option>
            <option value="av1">AV1</option>
            <option value="vp9">VP9</option>
          </select>
        </div>

        {error && <p>{error}</p>}
      </div>
    </div>
  );
};
export default Home;
