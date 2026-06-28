import React from "react";

function gradeColor(score) {
  if (score >= 80) return "var(--green)";
  if (score >= 60) return "var(--amber)";
  return "var(--red)";
}

export default function ResultsPanel({ data }) {
  const {
    matchScore,
    scoreLabel,
    summary,
    matchedKeywords = [],
    missingKeywords = [],
    keywordSuggestions = [],
    sectionFeedback = {},
    topImprovements = [],
  } = data;

  const color = gradeColor(matchScore);

  return (
    <section className="results">
      <div className="score-stamp-row">
        <div className="score-stamp" style={{ color }}>
          <span className="score-stamp-num">{matchScore}</span>
          <span className="score-stamp-pct">OUT OF 100</span>
        </div>
        <div>
          <div className="score-meta-label">Match verdict</div>
          <div className="score-meta-grade" style={{ color }}>
            {scoreLabel}
          </div>
          <p className="score-meta-summary">{summary}</p>
        </div>
      </div>

      {matchedKeywords.length > 0 && (
        <div className="section-block">
          <div className="section-heading">Matched keywords</div>
          <div className="tag-list">
            {matchedKeywords.map((kw) => (
              <span className="tag matched" key={kw}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {missingKeywords.length > 0 && (
        <div className="section-block">
          <div className="section-heading">Missing keywords</div>
          <div className="tag-list">
            {missingKeywords.map((kw) => (
              <span className="tag missing" key={kw}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {keywordSuggestions.length > 0 && (
        <div className="section-block">
          <div className="section-heading">How to add them</div>
          {keywordSuggestions.map((s) => (
            <div className="suggestion-card" key={s.keyword}>
              <div className="suggestion-keyword">{s.keyword}</div>
              <div className="suggestion-where">Add to: {s.whereToAdd}</div>
              <div className="suggestion-bullet">{s.exampleBulletPoint}</div>
            </div>
          ))}
        </div>
      )}

      {(sectionFeedback.skills || sectionFeedback.experience || sectionFeedback.formatting) && (
        <div className="section-block">
          <div className="section-heading">Section-by-section feedback</div>
          <div className="feedback-grid">
            <div className="feedback-card">
              <h4>Skills</h4>
              <p>{sectionFeedback.skills}</p>
            </div>
            <div className="feedback-card">
              <h4>Experience</h4>
              <p>{sectionFeedback.experience}</p>
            </div>
            <div className="feedback-card">
              <h4>ATS formatting</h4>
              <p>{sectionFeedback.formatting}</p>
            </div>
          </div>
        </div>
      )}

      {topImprovements.length > 0 && (
        <div className="section-block">
          <div className="section-heading">Top 3 improvements</div>
          <ol className="improvements-list">
            {topImprovements.map((imp, i) => (
              <li key={i}>{imp}</li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
