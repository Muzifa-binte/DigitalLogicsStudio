import React, { useState } from "react";
import problemsData from "./ProblemsData";
import ProblemCard from "./ProblemCard";
import ProblemModal from "./ProblemModal";
import "./Problems.css";

const FILTERS = ["All", "Easy", "Medium", "Hard"];
const TAG_FILTERS = [
  "All",
  "Combinational",
  "Sequential",
  "Arithmetic",
  "MUX",
  "Decoder",
  "Parity",
  "Latch",
];

const ProblemsSection = () => {
  const [activeProblem, setActiveProblem] = useState(null);
  const [diffFilter, setDiffFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");

  const filtered = problemsData.filter((p) => {
    const diffMatch = diffFilter === "All" || p.difficulty === diffFilter;
    const tagMatch = tagFilter === "All" || p.tags.includes(tagFilter);
    return diffMatch && tagMatch;
  });

  return (
    <section className="prob-section-wrapper">
      {/* Section Header */}
      <div className="prob-section-head">
        <div className="prob-section-title-row">
          <span className="prob-section-badge">⚙️ Practice</span>
          <h2 className="prob-section-title">Circuit Design Problems</h2>
          <p className="prob-section-subtitle">
            LeetCode-style digital logic challenges. Read the spec, build the
            circuit in CircuitForge, and submit your solution.
          </p>
        </div>

        {/* Filters */}
        <div className="prob-filters">
          <div className="prob-filter-group">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`prob-filter-btn ${diffFilter === f ? "active" : ""}`}
                onClick={() => setDiffFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="prob-filter-group">
            {TAG_FILTERS.map((t) => (
              <button
                key={t}
                className={`prob-filter-btn tag-btn ${tagFilter === t ? "active" : ""}`}
                onClick={() => setTagFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Problem Cards Grid */}
      {filtered.length > 0 ? (
        <div className="prob-grid">
          {filtered.map((p) => (
            <ProblemCard key={p.id} problem={p} onClick={setActiveProblem} />
          ))}
        </div>
      ) : (
        <div className="prob-empty">
          No problems match the selected filters.
        </div>
      )}

      {/* Modal */}
      {activeProblem && (
        <ProblemModal
          problem={activeProblem}
          onClose={() => setActiveProblem(null)}
        />
      )}
    </section>
  );
};

export default ProblemsSection;
