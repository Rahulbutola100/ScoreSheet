import React, { useState, useCallback } from "react";
import ResultsPanel from "./components/ResultsPanel.jsx";

const ACCEPTED_TYPES = [".pdf", ".docx", ".txt"];

export default function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleFile = (f) => {
    if (!f) return;
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      setError(`Unsupported file type ${ext}. Use PDF, DOCX, or TXT.`);
      return;
    }
    setError("");
    setFile(f);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!file) {
      setError("Please upload your resume first.");
      return;
    }
    if (jobDescription.trim().length < 30) {
      setError("Please paste the full job description (a few sentences minimum).");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    setLoading(true);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="masthead">
        <h1 className="masthead-title">
          Score<span>Sheet</span>
        </h1>
        <span className="masthead-tag">Resume × JD Matcher</span>
      </header>
      <p className="masthead-sub">
        Upload your resume and paste a job description. Get an honest match score,
        the keywords you're missing, and exactly where to add them — before you
        spend time applying.
      </p>

      <form onSubmit={onSubmit}>
        <div className="form-grid">
          <div>
            <label className="field-label" htmlFor="resume-upload">
              <b>01</b> &nbsp;Your resume
            </label>
            <div
              className={`dropzone ${dragActive ? "drag-active" : ""} ${
                file ? "has-file" : ""
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
            >
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              {file ? (
                <span className="dropzone-filename">{file.name}</span>
              ) : (
                <>
                  <span className="dropzone-icon">PDF · DOCX · TXT</span>
                  <span className="dropzone-hint">
                    Drop your resume here, or click to browse
                  </span>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="jd-input">
              <b>02</b> &nbsp;Job description
            </label>
            <textarea
              id="jd-input"
              className="jd-input"
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <div className="char-count">{jobDescription.length} characters</div>
          </div>
        </div>

        <div className="submit-row">
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Analyzing…" : "Score my resume"}
          </button>
          {loading && (
            <span className="loading-block">
              <span className="loading-dot" />
              Reading resume, comparing against the JD, building suggestions…
            </span>
          )}
        </div>

        {error && <div className="error-banner">{error}</div>}
      </form>

      {result && <ResultsPanel data={result} />}

      <p className="footer-note">
        Runs locally · your resume and the JD are sent only to your own Groq
        key for analysis · nothing is stored
      </p>
    </div>
  );
}
