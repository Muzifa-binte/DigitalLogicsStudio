import React, { useState } from "react";
import NSLayout from "./components/NSLayout";
import ControlPanel from "../../components/ControlPanel";
import ControlGroup from "../../components/ControlGroup";
import ResultCard from "../../components/ResultCard";
import ExplanationBlock from "../../components/ExplanationBlock";

const parseSignedInput = (value) => {
  const match = value.match(/^([+-]?)([01]*)$/);
  if (!match) return null;
  return { prefix: match[1], digits: match[2] };
};

const extendBits = (value, targetBits, mode) => {
  const parsed = parseSignedInput(value);
  if (!parsed) {
    return { error: "Input may contain only 0, 1, and an optional leading + or -." };
  }
  if (!parsed.digits) {
    return { error: "Enter at least one binary digit after the sign." };
  }

  const n = parseInt(targetBits, 10);
  if (Number.isNaN(n) || n <= 0 || n > 32) {
    return { error: "Target bits should be between 1 and 32." };
  }

  if (mode === "unsigned") {
    if (parsed.prefix) {
      return { error: "Unsigned extension does not use + or -. Enter only the value bits, for example 1010." };
    }
    if (parsed.digits.length > n) {
      return { error: "Target width must be at least as large as the original bit width." };
    }

    return {
      error: null,
      original: parsed.digits,
      extended: parsed.digits.padStart(n, "0"),
      kind: "Unsigned zero extension",
      explanation: `For unsigned values we use zero‑extension: pad with 0s on the left until the bit‑width is ${n}.`,
    };
  }

  if (mode === "signedMagnitude") {
    const signBit = parsed.prefix
      ? parsed.prefix === "-" ? "1" : "0"
      : parsed.digits[0];
    const magnitudeBits = parsed.prefix ? parsed.digits : parsed.digits.slice(1);
    const original = `${signBit}${magnitudeBits || "0"}`;

    if (original.length > n) {
      return { error: "Target width must be at least as large as the signed-magnitude bit width." };
    }

    const extendedMagnitude = (magnitudeBits || "0").padStart(n - 1, "0");
    return {
      error: null,
      original,
      extended: `${signBit}${extendedMagnitude}`,
      kind: "Signed magnitude extension",
      explanation:
        `For signed magnitude, keep the sign bit (${signBit}) as the leftmost bit and add 0s after it, before the magnitude bits. ` +
        `This keeps +0 and -0 distinct: +0 extends to ${"0".repeat(n)}, while -0 extends to 1${"0".repeat(Math.max(n - 1, 0))}.`,
    };
  }

  if (parsed.prefix) {
    return { error: "Two's complement extension needs the stored bit pattern, not a written + or -. Example: use 1011, not -101." };
  }
  if (parsed.digits.length > n) {
    return { error: "Target width must be at least as large as the original bit width." };
  }

  const signBit = parsed.digits[0];
  return {
    error: null,
    original: parsed.digits,
    extended: parsed.digits.padStart(n, signBit),
    kind: "Two's complement sign extension",
    explanation:
      `For two's complement signed values, copy the sign bit (${signBit}) into every new higher-order bit. ` +
      `Copying 0 preserves a non-negative value; copying 1 preserves a negative value.`,
  };
};

export default function BitExtension() {
  const [binary, setBinary] = useState("");
  const [bits, setBits] = useState(8);
  const [mode, setMode] = useState("twosComplement");

  const hasInput = binary !== "";
  const result = hasInput
    ? extendBits(binary, bits, mode)
    : null;

  return (
    <NSLayout
      title="Bit Extension"
      subtitle="Compare unsigned, signed magnitude, and two's complement extension"
      intro="Extending a value to a wider bit-width is a common operation in hardware. The rule depends on the representation used to read the bits."
    >
      <ControlPanel>
        <ControlGroup label="Binary value">
          <input
            type="text"
            className="control-input"
            value={binary}
            onChange={(e) => {
              const val = e.target.value.replace(/\s+/g, "");
              if (val === "" || /^[+-]?[01]*$/.test(val)) setBinary(val);
            }}
            placeholder="e.g. 1010 or -101"
          />
        </ControlGroup>

        <ControlGroup label="Target bit‑width">
          <input
            type="number"
            className="control-input"
            value={bits}
            onChange={(e) => setBits(e.target.value)}
            min="1"
            max="32"
          />
        </ControlGroup>

        <ControlGroup label="Mode">
          <select
            className="control-select"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="unsigned">Unsigned (zero‑extension)</option>
            <option value="signedMagnitude">Signed magnitude (+0 / -0)</option>
            <option value="twosComplement">Two&apos;s complement</option>
          </select>
        </ControlGroup>
      </ControlPanel>

      {hasInput && (
        <ResultCard title="Extension Result">
          <ExplanationBlock title="How the bits change">
            {result && result.error && (
              <p className="explanation-intro">
                <span className="highlight">Error:</span> {result.error}
              </p>
            )}
            {result && !result.error && (
              <>
                <p className="explanation-intro">
                  <span className="highlight">Rule:</span> {result.kind}
                </p>
                <p className="explanation-intro">
                  <span className="highlight">Original:</span> {result.original}{" "}
                  ({result.original.length} bits)
                </p>
                <p className="explanation-intro">
                  <span className="highlight">Extended:</span> {result.extended}{" "}
                  ({bits} bits)
                </p>
                <p>{result.explanation}</p>
              </>
            )}
          </ExplanationBlock>

          <ExplanationBlock title="Signed vs unsigned intuition">
            <p className="explanation-intro">
              With <span className="highlight">unsigned</span> numbers, the
              leftmost bit is just another magnitude bit, so new bits must be{" "}
              <strong>0</strong> to avoid changing the value.
            </p>
            <p className="explanation-intro">
              With <span className="highlight">signed magnitude</span>, the
              leftmost bit is only the sign. Extension keeps that sign bit and
              pads the magnitude with 0s, so +0 and -0 stay different.
            </p>
            <p className="explanation-intro">
              With <span className="highlight">two&apos;s complement</span>,
              the leftmost bit has negative weight. Extension repeats that bit
              into the new higher-order positions, preserving the same integer.
            </p>
          </ExplanationBlock>

          <ExplanationBlock title="Examples">
            <p className="explanation-intro">
              <span className="highlight">Signed magnitude:</span> -101 means sign
              bit 1 and magnitude 101. Extending to 8 bits gives 10000101.
            </p>
            <p className="explanation-intro">
              <span className="highlight">+0 and -0:</span> +0 extends to
              00000000, while -0 extends to 10000000 in 8-bit signed magnitude.
            </p>
            <p className="explanation-intro">
              <span className="highlight">Two&apos;s complement:</span> 1011
              extends to 11111011 because the sign bit is 1.
            </p>
          </ExplanationBlock>
        </ResultCard>
      )}
    </NSLayout>
  );
}
