import React, { useState, useRef, useCallback } from "react";
import Boolforge from "../pages/Boolforge";

/* ─────────────────────────────────────────────────────────────────
   CircuitModal
   Props:
     open        – boolean
     onClose     – () => void
     problem     – full problem object from ProblemsData (optional)
     expression  – string (used when no problem)
     variables   – string[] (used when no problem)
   ─────────────────────────────────────────────────────────────────

   SMART VALIDATION — no gate naming required
   ──────────────────────────────────────────
   The validator works purely on BEHAVIOR, not gate labels:

   1. Try every permutation of (circuit INPUT gates → problem vars).
   2. For each permutation, compute the full truth-table column for
      every OUTPUT gate in the circuit.
   3. Try every bijective assignment of (output gate → expected output).
   4. If any assignment makes ALL columns match → circuit is CORRECT.

   This means a user can name their gates Y/Z, OUT1/OUT2, or anything
   else and still get correctly validated.
   ───────────────────────────────────────────────────────────────── */

// ── Generate all 2^n input bit-vectors ───────────────────────────
function allCombinations(n) {
  const rows = [];
  for (let i = 0; i < 1 << n; i++) {
    const bits = [];
    for (let j = n - 1; j >= 0; j--) bits.push((i >> j) & 1);
    rows.push(bits);
  }
  return rows;
}

// ── Evaluate one gate given an inputMap (gateId → boolean) ───────
function buildEvaluator(gates, wires, inputMap) {
  const byId = new Map(gates.map((g) => [g.id, g]));
  const memo = new Map();

  function evalId(id, depth = 0) {
    if (depth > 200) return false;
    if (memo.has(id)) return memo.get(id);
    const gate = byId.get(id);
    if (!gate) return false;

    if (gate.type === "INPUT") {
      const v = inputMap.get(id) ?? false;
      memo.set(id, v);
      return v;
    }

    // Collect all wires arriving at this gate, ordered by toIndex
    const inputs = [];
    for (const w of wires) {
      if (w.toId === id) inputs[w.toIndex] = evalId(w.fromId, depth + 1);
    }
    // Connected inputs only (filter out sparse-array holes)
    const ci = inputs.filter((v) => v !== undefined);

    let result = false;
    switch (gate.type) {
      case "AND":
        result = ci.length > 0 && ci.every(Boolean);
        break;
      case "OR":
        result = ci.some(Boolean);
        break;
      case "NOT":
        // BUG FIX: inputs[0] can be undefined when the NOT gate has no wire
        // connected yet. `!undefined` evaluates to `true`, producing a phantom
        // HIGH signal. Guard explicitly so an unconnected NOT outputs false.
        result = inputs[0] !== undefined ? !inputs[0] : false;
        break;
      case "NAND":
        result = !(ci.length > 0 && ci.every(Boolean));
        break;
      case "NOR":
        result = !ci.some(Boolean);
        break;
      case "XOR":
        // BUG FIX: original checked `inputs.length >= 2` which fails when
        // inputs is a sparse array (e.g. [undefined, true]). Use ci instead,
        // and reduce for robustness with future multi-input XOR support.
        result = ci.length >= 2 && ci.reduce((acc, v) => acc !== v, false);
        break;
      case "XNOR":
        // BUG FIX: same sparse-array issue as XOR above.
        result = ci.length >= 2 && !ci.reduce((acc, v) => acc !== v, false);
        break;
      case "BUFFER":
      case "OUTPUT":
        result = inputs[0] ?? false;
        break;
      default:
        result = false;
    }
    memo.set(id, result);
    return result;
  }
  return evalId;
}

// ── Compute truth-table column for one output gate ────────────────
// inputGateOrder: the INPUT gates in the order that maps to the bit-vector
function computeColumn(
  outputGateId,
  inputGateOrder,
  gates,
  wires,
  combinations,
) {
  return combinations.map((bits) => {
    const inputMap = new Map();
    inputGateOrder.forEach((ig, j) => inputMap.set(ig.id, Boolean(bits[j])));
    const eval_ = buildEvaluator(gates, wires, inputMap);
    return eval_(outputGateId) ? 1 : 0;
  });
}

// ── Expected column for a problem output given var ordering ───────
//
// BUG FIX (original): used Array.find() which returns the FIRST row whose
// input columns all match (treating "X"/undefined as wildcards). This had
// two failure modes:
//
//   1. INCOMPLETE TABLE — When a truth table only contained a subset of input
//      combinations (e.g. the 2-to-1 MUX had 4 rows instead of 8), the missing
//      combinations fell through and returned 0, giving wrong expected values.
//
//   2. WILDCARD SHADOWING — A wildcard row (e.g. { E:0, A1:"X", A0:"X" }) was
//      found first by find() even when a more-specific exact row existed later
//      in the array, returning the wildcard row's output instead of the correct
//      specific one.
//
//   3. SYMBOLIC OUTPUTS — Some rows used string values like "Q_prev" or "?" for
//      outputs. Number("Q_prev") = NaN which compared as 0, making those rows
//      always appear wrong. This is now guarded: NaN/symbolic outputs are treated
//      as "skip this row" (return -1 so the validator can exclude the row).
//
// Fix: iterate all rows and pick the MOST SPECIFIC match (highest count of
// exact-match columns vs wildcard columns). Exact beats wildcard. Ties broken
// by first occurrence. Symbolic/NaN output rows return -1 (skipped in scoring).
//
function expectedColumn(outputName, inputNames, combinations, truthTable) {
  return combinations.map((bits) => {
    const lookup = {};
    inputNames.forEach((name, j) => {
      lookup[name] = bits[j];
    });

    let bestRow = null;
    let bestSpecificity = -1;

    for (const r of truthTable) {
      let matches = true;
      let specificity = 0;

      for (const name of inputNames) {
        const v = r[name];
        if (v === "X" || v === undefined) {
          // Wildcard — counts as a match but lowers specificity
          specificity += 0;
        } else if (Number(v) === lookup[name]) {
          // Exact match — higher specificity
          specificity += 1;
        } else {
          // Mismatch — this row does not apply
          matches = false;
          break;
        }
      }

      if (matches && specificity > bestSpecificity) {
        bestSpecificity = specificity;
        bestRow = r;
      }
    }

    if (!bestRow) return -1; // No matching row → skip this combination in scoring

    const out = bestRow[outputName];

    // Guard against symbolic outputs like "Q_prev", "?", "I0", etc.
    // These cannot be numerically compared, so skip the row.
    if (out === undefined || out === null) return -1;
    const numeric = Number(out);
    if (isNaN(numeric)) return -1;

    return numeric;
  });
}

const colEqual = (a, b) =>
  a.length === b.length &&
  a.every((v, i) => {
    // BUG FIX: skip rows where expected = -1 (indeterminate/symbolic).
    // Original code compared every row strictly, so symbolic expected values
    // (NaN→0) always failed to match the circuit's actual 0 or 1 output.
    if (v === -1 || b[i] === -1) return true;
    return v === b[i];
  });

// ── All permutations ──────────────────────────────────────────────
function permutations(arr) {
  if (arr.length <= 1) return [[...arr]];
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const p of permutations(rest)) out.push([arr[i], ...p]);
  }
  return out;
}

// ── SMART VALIDATOR ───────────────────────────────────────────────
function validateCircuit(gates, wires, problem) {
  if (!problem) return null;

  const inputGates = gates.filter((g) => g.type === "INPUT");
  const outputGates = gates.filter((g) => g.type === "OUTPUT");
  const nExpIn = problem.inputs.length;
  const nExpOut = problem.outputs.length;

  // Not enough gate types present
  if (inputGates.length < nExpIn || outputGates.length < nExpOut) {
    return {
      passed: false,
      reason: "not_enough_ports",
      circuitInputCount: inputGates.length,
      circuitOutputCount: outputGates.length,
      expectedInputCount: nExpIn,
      expectedOutputCount: nExpOut,
      rows: [],
      outputMapping: null,
      inputMapping: null,
    };
  }

  const combinations = allCombinations(nExpIn);

  // Pre-compute expected columns (may contain -1 for indeterminate rows)
  const expCols = {};
  for (const outName of problem.outputs) {
    expCols[outName] = expectedColumn(
      outName,
      problem.inputs,
      combinations,
      problem.truthTable,
    );
  }

  // Try every permutation of input gates → problem variables
  const inputPerms = permutations(inputGates.slice(0, nExpIn));
  const outIndices = outputGates.slice(0, nExpOut).map((_, i) => i);
  const outPermsAll = permutations(outIndices);

  let bestResult = null;
  let bestScore = -1;

  for (const inputPerm of inputPerms) {
    // Compute columns for all output gates under this input ordering
    const outGateCols = outputGates.map((og) => ({
      gate: og,
      col: computeColumn(og.id, inputPerm, gates, wires, combinations),
    }));

    for (const outPerm of outPermsAll) {
      // outPerm[j] = index into outGateCols assigned to problem.outputs[j]
      let allMatch = true;
      let score = 0;
      const outMapping = {};

      for (let j = 0; j < nExpOut; j++) {
        const { col, gate } = outGateCols[outPerm[j]];
        const expCol = expCols[problem.outputs[j]];
        const match = colEqual(col, expCol);
        if (match) {
          // Count only determinate rows for the score
          score += expCol.filter((v) => v !== -1).length;
          outMapping[problem.outputs[j]] =
            gate.label || gate.name || `OUT${outPerm[j]}`;
        } else {
          allMatch = false;
          // Partial score: count matching determinate rows
          score += col.filter(
            (v, i) => expCol[i] !== -1 && v === expCol[i],
          ).length;
        }
      }

      if (score > bestScore) {
        bestScore = score;

        const rows = combinations.map((bits, ri) => {
          const inputs = {};
          problem.inputs.forEach((name, j) => {
            inputs[name] = bits[j];
          });
          const rowResults = {};
          let rowPassed = true;
          for (let j = 0; j < nExpOut; j++) {
            const got = outGateCols[outPerm[j]].col[ri];
            const exp = expCols[problem.outputs[j]][ri];
            // -1 means indeterminate → treat as passing (skip)
            const match = exp === -1 || got === exp;
            if (!match) rowPassed = false;
            rowResults[problem.outputs[j]] = {
              expected: exp === -1 ? "?" : exp,
              got,
              match,
              indeterminate: exp === -1,
            };
          }
          return { inputs, outputs: rowResults, rowPassed };
        });

        const inMapping = {};
        problem.inputs.forEach((name, j) => {
          inMapping[name] = inputPerm[j].label || inputPerm[j].name || `IN${j}`;
        });

        bestResult = {
          passed: allMatch,
          reason: allMatch ? "correct" : "wrong_output",
          rows,
          outputMapping: outMapping,
          inputMapping: inMapping,
        };
      }

      if (bestResult?.passed) break;
    }
    if (bestResult?.passed) break;
  }

  return (
    bestResult || {
      passed: false,
      reason: "wrong_output",
      rows: [],
      outputMapping: null,
      inputMapping: null,
    }
  );
}

// ── Status config ─────────────────────────────────────────────────
const STATUS = {
  idle: null,
  checking: {
    bg: "rgba(99,102,241,0.15)",
    border: "#6366f1",
    text: "#a5b4fc",
    icon: "⚙️",
    title: "Evaluating circuit…",
  },
  passed: {
    bg: "rgba(0,255,136,0.08)",
    border: "#00ff88",
    text: "#00ff88",
    icon: "🎉",
    title: "Circuit Correct!",
  },
  failed: {
    bg: "rgba(255,51,102,0.1)",
    border: "#ff3366",
    text: "#ff6688",
    icon: "✗",
    title: "Circuit Incorrect",
  },
  missing: {
    bg: "rgba(255,165,0,0.1)",
    border: "#ffa500",
    text: "#ffc870",
    icon: "⚠️",
    title: "Not Enough Gates",
  },
};

// ── Component ─────────────────────────────────────────────────────
const CircuitModal = ({ open, onClose, problem, expression, variables }) => {
  const [status, setStatus] = useState("idle");
  const [validationResult, setValidationResult] = useState(null);
  const [showValidation, setShowValidation] = useState(false);
  const circuitStateRef = useRef(null);

  const handleCircuitChange = useCallback((newGates, newWires) => {
    circuitStateRef.current = { gates: newGates, wires: newWires };
  }, []);

  const handleSubmit = useCallback(() => {
    if (!problem) return;
    const { gates = [], wires = [] } = circuitStateRef.current || {};
    setStatus("checking");
    setShowValidation(false);
    setTimeout(() => {
      const result = validateCircuit(gates, wires, problem);
      setValidationResult(result);
      if (!result) {
        setStatus("idle");
        return;
      }
      if (result.reason === "not_enough_ports") setStatus("missing");
      else if (result.passed) setStatus("passed");
      else setStatus("failed");
      setShowValidation(true);
    }, 600);
  }, [problem]);

  const handleReset = () => {
    setStatus("idle");
    setValidationResult(null);
    setShowValidation(false);
  };

  if (!open) return null;

  const st = STATUS[status];
  const diffColor =
    { Easy: "#00ff88", Medium: "#00d4ff", Hard: "#ff3366" }[
      problem?.difficulty
    ] || "#8899aa";

  return (
    <div
      className="cm-overlay"
      onClick={(e) => {
        if (e.target.classList.contains("cm-overlay")) onClose();
      }}
    >
      <div className="cm-container">
        {/* ── Top bar ── */}
        <div className="cm-topbar">
          <div className="cm-topbar-left">
            <span className="cm-logo">⚡ CircuitForge</span>
            {problem && (
              <>
                <span className="cm-sep">›</span>
                <span className="cm-problem-title">{problem.title}</span>
                <span className="cm-difficulty" style={{ color: diffColor }}>
                  {problem.difficulty}
                </span>
              </>
            )}
          </div>
          <div className="cm-topbar-right">
            {problem &&
              (status === "checking" ? (
                <button className="cm-btn cm-btn-submit" disabled>
                  <span className="cm-spin">⚙️</span> Checking…
                </button>
              ) : status === "passed" ? (
                <button className="cm-btn cm-btn-reset" onClick={handleReset}>
                  🔄 Try Again
                </button>
              ) : (
                <button className="cm-btn cm-btn-submit" onClick={handleSubmit}>
                  ✅ Submit Circuit
                </button>
              ))}
            <button className="cm-close" onClick={onClose} title="Close">
              ✕
            </button>
          </div>
        </div>

        {/* ── Status banner ── */}
        {showValidation && st && (
          <div
            className="cm-status-banner"
            style={{
              background: st.bg,
              borderBottom: `1px solid ${st.border}`,
              color: st.text,
            }}
          >
            <div className="cm-status-header">
              <span className="cm-status-icon">{st.icon}</span>
              <strong>{st.title}</strong>

              {/* Show auto-detected gate → expected output mapping on pass */}
              {status === "passed" && validationResult?.outputMapping && (
                <span className="cm-mapping-note">
                  {Object.entries(validationResult.outputMapping).map(
                    ([exp, got]) => (
                      <span key={exp} className="cm-mapping-chip">
                        <span className="cm-mapping-got">{got}</span>
                        <span className="cm-mapping-arrow">→</span>
                        <span className="cm-mapping-exp">{exp}</span>
                      </span>
                    ),
                  )}
                </span>
              )}
            </div>

            {/* Not enough gates */}
            {status === "missing" && validationResult && (
              <div className="cm-status-detail">
                <span>
                  Your circuit has <b>{validationResult.circuitInputCount}</b>{" "}
                  INPUT gate(s) and <b>{validationResult.circuitOutputCount}</b>{" "}
                  OUTPUT gate(s).
                </span>
                <span>
                  This problem requires at least{" "}
                  <b>{validationResult.expectedInputCount}</b> INPUT(s) and{" "}
                  <b>{validationResult.expectedOutputCount}</b> OUTPUT(s).
                </span>
                <span className="cm-status-hint">
                  Names don't matter — just add the missing gate types.
                </span>
              </div>
            )}

            {/* Indeterminate rows note (e.g. SR Latch) */}
            {problem?.hasIndeterminateRows && (
              <div className="cm-status-hint cm-indet-note">
                ℹ️ {problem.indeterminateNote}
              </div>
            )}

            {/* Truth-table diff */}
            {(status === "passed" || status === "failed") &&
              validationResult?.rows?.length > 0 && (
                <div className="cm-val-table-wrap">
                  <table className="cm-val-table">
                    <thead>
                      <tr>
                        {problem.inputs.map((inp) => (
                          <th key={inp}>{inp}</th>
                        ))}
                        {problem.outputs.map((out) => (
                          <React.Fragment key={out}>
                            <th className="cm-th-exp">{out} ✓</th>
                            <th className="cm-th-got">Got</th>
                            <th></th>
                          </React.Fragment>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {validationResult.rows.map((row, i) => (
                        <tr
                          key={i}
                          className={row.rowPassed ? "" : "cm-row-fail"}
                        >
                          {problem.inputs.map((inp) => (
                            <td key={inp}>{row.inputs[inp]}</td>
                          ))}
                          {problem.outputs.map((out) => {
                            const r = row.outputs[out];
                            return (
                              <React.Fragment key={out}>
                                <td className="cm-td-exp">
                                  {r?.indeterminate
                                    ? "?"
                                    : (r?.expected ?? "?")}
                                </td>
                                <td
                                  className={
                                    r?.indeterminate
                                      ? "cm-td-indet"
                                      : r?.match
                                        ? "cm-td-ok"
                                        : "cm-td-err"
                                  }
                                >
                                  {r?.got ?? "?"}
                                </td>
                                <td>
                                  {r?.indeterminate
                                    ? "~"
                                    : r?.match
                                      ? "✓"
                                      : "✗"}
                                </td>
                              </React.Fragment>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            {status === "passed" && (
              <p className="cm-congrats">
                All {validationResult.rows.filter((r) => r.rowPassed).length}{" "}
                test cases passed — your logic is correct! 🏆
              </p>
            )}
          </div>
        )}

        {/* ── Port strip ── */}
        {problem && (
          <div className="cm-port-strip">
            <span className="cm-port-label">Need:</span>
            <span className="cm-port-pill cm-port-in">
              {problem.inputs.length} INPUT
              {problem.inputs.length !== 1 ? "S" : ""}
              <span className="cm-port-vars">
                ({problem.inputs.join(", ")})
              </span>
            </span>
            <span className="cm-port-sep" />
            <span className="cm-port-pill cm-port-out">
              {problem.outputs.length} OUTPUT
              {problem.outputs.length !== 1 ? "S" : ""}
              <span className="cm-port-vars">
                ({problem.outputs.join(", ")})
              </span>
            </span>
            <span className="cm-port-hint">
              ✨ Gate names don't matter — validated by behavior
            </span>
          </div>
        )}

        {/* ── Canvas ── */}
        <div className="cm-canvas-wrap">
          <Boolforge
            simplifiedExpression={expression || null}
            variables={variables || (problem?.inputs ?? [])}
            onCircuitChange={handleCircuitChange}
          />
        </div>
      </div>

      <style>{`
                .cm-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.88);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 9999; padding: 16px; backdrop-filter: blur(6px);
                }
                .cm-container {
                    position: relative; width: 98vw; height: 95vh; max-width: 1600px;
                    background: var(--bg-primary, #0f172a); border-radius: 16px;
                    box-shadow: 0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.2);
                    overflow: hidden; display: flex; flex-direction: column;
                }
                .cm-topbar {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0 1.25rem; height: 52px; min-height: 52px;
                    background: var(--bg-secondary, #141b2d);
                    border-bottom: 1px solid rgba(99,102,241,0.2); gap: 1rem; z-index: 10;
                }
                .cm-topbar-left  { display: flex; align-items: center; gap: 0.6rem; overflow: hidden; }
                .cm-topbar-right { display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0; }
                .cm-logo { font-size: 0.95rem; font-weight: 800; color: #a5b4fc; letter-spacing: 0.04em; white-space: nowrap; }
                .cm-sep  { color: #4b5563; font-size: 1.1rem; }
                .cm-problem-title {
                    font-size: 0.9rem; font-weight: 600; color: var(--text-color, #e8f0ff);
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 260px;
                }
                .cm-difficulty {
                    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em;
                    text-transform: uppercase; padding: 0.15rem 0.5rem; border-radius: 4px;
                    background: rgba(255,255,255,0.06); white-space: nowrap;
                }
                .cm-btn {
                    display: flex; align-items: center; gap: 0.4rem; padding: 0.4rem 1rem;
                    border-radius: 8px; font-size: 0.82rem; font-weight: 700;
                    cursor: pointer; transition: all 0.2s; border: none; white-space: nowrap;
                }
                .cm-btn-submit {
                    background: linear-gradient(135deg, #4f46e5, #6366f1);
                    color: white; box-shadow: 0 4px 12px rgba(99,102,241,0.4);
                }
                .cm-btn-submit:hover:not(:disabled) {
                    background: linear-gradient(135deg, #4338ca, #4f46e5);
                    box-shadow: 0 6px 16px rgba(99,102,241,0.5); transform: translateY(-1px);
                }
                .cm-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
                .cm-btn-reset {
                    background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); color: #00d4ff;
                }
                .cm-btn-reset:hover { background: rgba(0,212,255,0.2); }
                .cm-close {
                    width: 36px; height: 36px; border-radius: 50%;
                    background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3);
                    color: #f87171; font-size: 1rem; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s; flex-shrink: 0;
                }
                .cm-close:hover { background: rgba(239,68,68,0.35); color: white; transform: rotate(90deg); }

                .cm-status-banner {
                    padding: 0.75rem 1.25rem; display: flex; flex-direction: column; gap: 0.5rem;
                    flex-shrink: 0; max-height: 280px; overflow-y: auto;
                }
                .cm-status-header {
                    display: flex; align-items: center; gap: 0.6rem;
                    font-size: 0.9rem; font-weight: 700; flex-wrap: wrap;
                }
                .cm-status-icon { font-size: 1.1rem; }
                .cm-mapping-note { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-left: 0.5rem; }
                .cm-mapping-chip {
                    display: inline-flex; align-items: center; gap: 0.2rem;
                    font-size: 0.75rem; font-weight: 600; font-family: monospace;
                    background: rgba(0,255,136,0.08); border: 1px solid rgba(0,255,136,0.2);
                    border-radius: 4px; padding: 0.1rem 0.45rem;
                }
                .cm-mapping-got   { color: #00d4ff; }
                .cm-mapping-arrow { color: #4b5563; }
                .cm-mapping-exp   { color: #00ff88; }
                .cm-status-detail { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.82rem; opacity: 0.9; }
                .cm-status-hint   { font-style: italic; opacity: 0.7; }
                .cm-indet-note    { font-size: 0.78rem; color: #fbbf24; opacity: 0.9; font-style: normal; }
                .cm-congrats      { margin: 0; font-size: 0.82rem; opacity: 0.85; }

                .cm-val-table-wrap { overflow-x: auto; }
                .cm-val-table {
                    border-collapse: collapse; font-size: 0.76rem;
                    font-family: monospace; white-space: nowrap;
                }
                .cm-val-table th, .cm-val-table td {
                    padding: 0.2rem 0.6rem; border: 1px solid rgba(255,255,255,0.1); text-align: center;
                }
                .cm-val-table th { opacity: 0.7; font-weight: 700; }
                .cm-th-exp { opacity: 0.75; }
                .cm-th-got { opacity: 0.9; }
                .cm-td-ok    { color: #00ff88; }
                .cm-td-err   { color: #ff3366; font-weight: 700; }
                .cm-td-exp   { opacity: 0.55; }
                .cm-td-indet { color: #6b7280; font-style: italic; }
                .cm-row-fail { background: rgba(255,51,102,0.06); }

                .cm-port-strip {
                    display: flex; align-items: center; flex-wrap: wrap; gap: 0.4rem;
                    padding: 0.45rem 1.25rem; background: rgba(0,0,0,0.18);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    flex-shrink: 0; font-size: 0.75rem;
                }
                .cm-port-label {
                    font-weight: 700; color: var(--secondary-text, #8899aa);
                    text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.68rem;
                }
                .cm-port-pill {
                    display: inline-flex; align-items: center; gap: 0.35rem;
                    padding: 0.15rem 0.6rem; border-radius: 4px;
                    font-family: monospace; font-weight: 700; font-size: 0.78rem;
                }
                .cm-port-in  { background: rgba(0,212,255,0.1);  border: 1px solid rgba(0,212,255,0.25); color: #00d4ff; }
                .cm-port-out { background: rgba(0,255,136,0.08); border: 1px solid rgba(0,255,136,0.25); color: #00ff88; }
                .cm-port-vars { font-weight: 400; opacity: 0.7; font-size: 0.72rem; }
                .cm-port-sep  { width: 1px; height: 14px; background: rgba(255,255,255,0.1); margin: 0 0.15rem; }
                .cm-port-hint { color: var(--secondary-text, #8899aa); font-style: italic; margin-left: auto; }

                .cm-canvas-wrap { flex: 1; overflow: hidden; position: relative; }
                .cm-canvas-wrap > * { width: 100% !important; height: 100% !important; }

                @keyframes cm-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .cm-spin { display: inline-block; animation: cm-spin 1s linear infinite; }

                @media (max-width: 640px) {
                    .cm-container { width: 100vw; height: 100vh; border-radius: 0; }
                    .cm-overlay   { padding: 0; }
                    .cm-port-hint { display: none; }
                }
            `}</style>
    </div>
  );
};

export default CircuitModal;
