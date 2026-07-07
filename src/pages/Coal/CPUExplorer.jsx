import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Cpu,
  Zap,
  GitBranch,
  Database,
  ArrowRight,
  X,
  Play,
  RotateCcw,
  Layers,
  HardDrive,
  Radio,
} from "lucide-react";
import "./CPUExplorer.css";

/* ────────────────────────────────────────────────────────────────────────
   Static reference data
   ──────────────────────────────────────────────────────────────────────── */

const ALU_INFO = {
  title: "Arithmetic Logic Unit (ALU)",
  function:
    "The ALU is the computational core of the CPU. It performs every arithmetic and bitwise logic operation the processor is capable of, taking operands from registers and returning a result plus a set of status flags.",
  operations: {
    Arithmetic: ["ADD", "SUB", "INC", "DEC", "MUL", "DIV"],
    Logic: ["AND", "OR", "XOR", "NOT", "SHL", "SHR"],
  },
  instructions: [
    { mnemonic: "ADD AX, BX", note: "Adds BX into AX, updates CF/OF/ZF/SF" },
    { mnemonic: "CMP AX, 0", note: "Subtracts internally to set flags only" },
    { mnemonic: "AND AL, 0Fh", note: "Masks the low nibble of AL" },
  ],
};

const CU_INFO = {
  title: "Control Unit (CU)",
  function:
    "The Control Unit doesn't compute values — it orchestrates everything else. It reads the instruction in the Instruction Register, decodes what operation is being requested, and fires the exact sequence of control signals needed to carry it out.",
  decoding: [
    "Fetch raw opcode bytes from the Instruction Register (IR)",
    "Split opcode into operation, addressing mode, and operand fields",
    "Map the operation to a micro-operation sequence",
    "Drive control lines for ALU, registers, and memory in order",
  ],
  signals: ["MemRead", "MemWrite", "RegWrite", "ALUOp", "PCWrite", "IRLoad"],
};

const REGISTER_INFO = {
  AX: {
    name: "AX",
    full: "Accumulator Register",
    purpose: "Primary register for arithmetic, I/O, and accumulation results.",
    instructions: ["MOV AX, [1000]", "ADD AX, BX", "MUL BX"],
    example: "MOV AX, 1234h  ; loads AX with 0x1234",
    splits: ["AH", "AL"],
  },
  BX: {
    name: "BX",
    full: "Base Register",
    purpose: "Often used as a base pointer for indirect memory addressing.",
    instructions: ["MOV BX, OFFSET arr", "MOV AX, [BX]"],
    example: "MOV BX, 2000h  ; BX now holds a base address",
  },
  CX: {
    name: "CX",
    full: "Count Register",
    purpose: "Implicit loop and shift counter for LOOP, REP, SHL/SHR.",
    instructions: ["MOV CX, 10", "LOOP again", "SHL AX, CL"],
    example: "MOV CX, 5      ; loop will run 5 times",
  },
  DX: {
    name: "DX",
    full: "Data Register",
    purpose: "Extends AX for wide multiply/divide results and I/O port addressing.",
    instructions: ["MUL BX  ; result in DX:AX", "MOV DX, 3F8h"],
    example: "XOR DX, DX     ; clear DX before DIV",
  },
};

const FDE_STEPS = [
  {
    key: "fetch",
    label: "Fetch",
    detail: "PC points to the next instruction; it's read from memory into the IR.",
    accent: "cyan",
  },
  {
    key: "decode",
    label: "Decode",
    detail: "The Control Unit interprets the opcode and identifies operands.",
    accent: "purple",
  },
  {
    key: "execute",
    label: "Execute",
    detail: "The ALU (or a data-move path) carries out the operation.",
    accent: "green",
  },
  {
    key: "store",
    label: "Store Result",
    detail: "The result is written back to a register or memory location.",
    accent: "green",
  },
];

const BUS_STAGES = [
  { key: "cpu", label: "CPU", icon: Cpu },
  { key: "addr", label: "Address Bus", icon: Radio },
  { key: "memory", label: "Memory", icon: HardDrive },
  { key: "data", label: "Data Bus", icon: Radio },
  { key: "ax", label: "AX Register", icon: Database },
];

const MEMORY_SEGMENTS = [
  {
    key: "CS",
    name: "Code Segment",
    color: "cyan",
    handles: "Instruction bytes fetched by IP/EIP",
    examples: ["CALL proc", "JMP label", "every fetched opcode"],
  },
  {
    key: "DS",
    name: "Data Segment",
    color: "purple",
    handles: "Global and static variables",
    examples: ["MOV AX, [value]", "MOV [count], BX"],
  },
  {
    key: "SS",
    name: "Stack Segment",
    color: "green",
    handles: "Return addresses, saved registers, locals",
    examples: ["PUSH AX", "CALL / RET", "local variables"],
  },
  {
    key: "ES",
    name: "Extra Segment",
    color: "cyan",
    handles: "Destination for string instructions",
    examples: ["MOVS", "STOS", "CMPS (dest operand)"],
  },
];

/* ────────────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────────────── */

function toHex16(value) {
  return `0x${(value & 0xffff).toString(16).toUpperCase().padStart(4, "0")}`;
}

function toHex8(value) {
  return `0x${(value & 0xff).toString(16).toUpperCase().padStart(2, "0")}`;
}

/* ────────────────────────────────────────────────────────────────────────
   Sub-components
   ──────────────────────────────────────────────────────────────────────── */

function DetailPanel({ open, onClose, children, accentClass }) {
  if (!open) return null;
  return (
    <div className="cpux-panel-overlay" onClick={onClose}>
      <div
        className={`cpux-panel ${accentClass || ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="cpux-panel-close"
          onClick={onClose}
          aria-label="Close panel"
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}

function AluPanel({ onClose }) {
  return (
    <DetailPanel open onClose={onClose} accentClass="cpux-accent-green">
      <div className="cpux-panel-header">
        <Zap size={20} />
        <h3>{ALU_INFO.title}</h3>
      </div>
      <p className="cpux-panel-copy">{ALU_INFO.function}</p>

      <div className="cpux-panel-subgrid">
        {Object.entries(ALU_INFO.operations).map(([group, ops]) => (
          <div key={group} className="cpux-chip-block">
            <span className="cpux-chip-block-title">{group}</span>
            <div className="cpux-chip-row">
              {ops.map((op) => (
                <span key={op} className="cpux-chip cpux-chip-green">
                  {op}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="cpux-instruction-list">
        <span className="cpux-chip-block-title">Instructions using the ALU</span>
        {ALU_INFO.instructions.map((ins) => (
          <div key={ins.mnemonic} className="cpux-instruction-row">
            <code>{ins.mnemonic}</code>
            <span>{ins.note}</span>
          </div>
        ))}
      </div>
    </DetailPanel>
  );
}

function CuPanel({ onClose }) {
  return (
    <DetailPanel open onClose={onClose} accentClass="cpux-accent-purple">
      <div className="cpux-panel-header">
        <GitBranch size={20} />
        <h3>{CU_INFO.title}</h3>
      </div>
      <p className="cpux-panel-copy">{CU_INFO.function}</p>

      <div className="cpux-chip-block">
        <span className="cpux-chip-block-title">Decoding steps</span>
        <ol className="cpux-ordered-list">
          {CU_INFO.decoding.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="cpux-chip-block">
        <span className="cpux-chip-block-title">Active control signals</span>
        <div className="cpux-chip-row">
          {CU_INFO.signals.map((sig) => (
            <span key={sig} className="cpux-chip cpux-chip-purple">
              {sig}
            </span>
          ))}
        </div>
      </div>
    </DetailPanel>
  );
}

function RegisterPanel({ regKey, registers, onUpdateAx, onClose }) {
  const info = REGISTER_INFO[regKey];
  const value = registers[regKey];

  return (
    <DetailPanel open onClose={onClose} accentClass="cpux-accent-cyan">
      <div className="cpux-panel-header">
        <Database size={20} />
        <h3>
          {info.name} <span className="cpux-panel-subtitle">— {info.full}</span>
        </h3>
      </div>
      <p className="cpux-panel-copy">{info.purpose}</p>

      <div className="cpux-register-value-row">
        <div className="cpux-register-value-card">
          <span className="cpux-chip-block-title">Current value</span>
          <span className="cpux-mono cpux-register-hex">{toHex16(value)}</span>
        </div>

        {info.splits && (
          <>
            <div className="cpux-register-value-card">
              <span className="cpux-chip-block-title">AH (high byte)</span>
              <span className="cpux-mono cpux-register-hex cpux-hex-sub">
                {toHex8(value >> 8)}
              </span>
            </div>
            <div className="cpux-register-value-card">
              <span className="cpux-chip-block-title">AL (low byte)</span>
              <span className="cpux-mono cpux-register-hex cpux-hex-sub">
                {toHex8(value)}
              </span>
            </div>
          </>
        )}
      </div>

      {regKey === "AX" && (
        <div className="cpux-chip-block">
          <span className="cpux-chip-block-title">
            Update AX — AH / AL split automatically
          </span>
          <input
            type="range"
            min="0"
            max="65535"
            value={value}
            onChange={(e) => onUpdateAx(Number(e.target.value))}
            className="cpux-slider"
          />
        </div>
      )}

      <div className="cpux-instruction-list">
        <span className="cpux-chip-block-title">Common instructions</span>
        {info.instructions.map((ins) => (
          <div key={ins} className="cpux-instruction-row">
            <code>{ins}</code>
          </div>
        ))}
      </div>

      <div className="cpux-chip-block">
        <span className="cpux-chip-block-title">Example</span>
        <code className="cpux-example-line">{info.example}</code>
      </div>
    </DetailPanel>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Main component
   ──────────────────────────────────────────────────────────────────────── */

function CPUExplorer() {
  const [activePanel, setActivePanel] = useState(null); // 'alu' | 'cu' | 'AX' | 'BX' | 'CX' | 'DX'
  const [registers, setRegisters] = useState({ AX: 0x1234, BX: 0x2000, CX: 0x0005, DX: 0x0000 });
  const [fdeIndex, setFdeIndex] = useState(-1); // -1 = idle
  const [busStage, setBusStage] = useState(-1); // -1 = idle
  const [busRunning, setBusRunning] = useState(false);
  const [activeSegment, setActiveSegment] = useState(null);
  const busTimers = useRef([]);

  const handleAxUpdate = useCallback((next) => {
    setRegisters((prev) => ({ ...prev, AX: next }));
  }, []);

  const handleNextStep = () => {
    setFdeIndex((prev) => (prev + 1 >= FDE_STEPS.length ? 0 : prev + 1));
  };

  const handleResetCycle = () => setFdeIndex(-1);

  const runBusSimulation = () => {
    busTimers.current.forEach((t) => window.clearTimeout(t));
    busTimers.current = [];
    setBusRunning(true);
    setBusStage(0);

    BUS_STAGES.forEach((_, idx) => {
      if (idx === 0) return;
      const timer = window.setTimeout(() => {
        setBusStage(idx);
        if (idx === BUS_STAGES.length - 1) {
          setRegisters((prev) => ({ ...prev, AX: 0x1000 }));
          window.setTimeout(() => {
            setBusRunning(false);
            setBusStage(-1);
          }, 900);
        }
      }, idx * 700);
      busTimers.current.push(timer);
    });
  };

  const fdeActiveComponent = useMemo(() => {
    if (fdeIndex < 0) return null;
    if (fdeIndex === 0) return "cu"; // fetch reads via control unit / PC
    if (fdeIndex === 1) return "cu"; // decode
    return "alu"; // execute / store
  }, [fdeIndex]);

  return (
    <div className="cpux-wrapper">
      <div className="cpux-title-block">
        <span className="cpux-eyebrow">Interactive Module</span>
        <h2 className="cpux-heading">Instruction Trace Lab</h2>
        <p className="cpux-subheading">
          Click any component to inspect it, step through the fetch–decode–execute
          cycle, and watch data travel across the buses in real time.
        </p>
      </div>

      {/* ── Fetch-Decode-Execute controls ─────────────────────────────── */}
      <section className="cpux-section">
        <div className="cpux-section-header">
          <h3>Fetch–Decode–Execute Cycle</h3>
          <div className="cpux-section-actions">
            <button type="button" className="cpux-btn cpux-btn-ghost" onClick={handleResetCycle}>
              <RotateCcw size={14} />
              Reset
            </button>
            <button type="button" className="cpux-btn cpux-btn-primary" onClick={handleNextStep}>
              <ArrowRight size={14} />
              Next Step
            </button>
          </div>
        </div>

        <div className="cpux-fde-track">
          {FDE_STEPS.map((step, idx) => (
            <React.Fragment key={step.key}>
              <div
                className={`cpux-fde-node cpux-accent-${step.accent} ${
                  idx === fdeIndex ? "is-active" : ""
                } ${idx < fdeIndex ? "is-done" : ""}`}
              >
                <span className="cpux-fde-node-index">{idx + 1}</span>
                <span className="cpux-fde-node-label">{step.label}</span>
              </div>
              {idx < FDE_STEPS.length - 1 && (
                <div className={`cpux-fde-connector ${idx < fdeIndex ? "is-active" : ""}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <p className="cpux-fde-detail">
          {fdeIndex >= 0 ? FDE_STEPS[fdeIndex].detail : "Press \u201cNext Step\u201d to begin the cycle."}
        </p>
      </section>

      {/* ── CPU architecture grid ─────────────────────────────────────── */}
      <section className="cpux-section">
        <div className="cpux-section-header">
          <h3>CPU Architecture</h3>
        </div>

        <div className="cpux-arch-grid">
          <button
            type="button"
            className={`cpux-node cpux-node-cu cpux-accent-purple ${
              fdeActiveComponent === "cu" ? "is-pulsing" : ""
            }`}
            onClick={() => setActivePanel("cu")}
          >
            <GitBranch size={22} />
            <span>Control Unit</span>
          </button>

          <button
            type="button"
            className={`cpux-node cpux-node-alu cpux-accent-green ${
              fdeActiveComponent === "alu" ? "is-pulsing" : ""
            }`}
            onClick={() => setActivePanel("alu")}
          >
            <Zap size={22} />
            <span>ALU</span>
          </button>

          <div className="cpux-node-registers">
            {Object.keys(REGISTER_INFO).map((key) => (
              <button
                key={key}
                type="button"
                className={`cpux-node cpux-node-register cpux-accent-cyan ${
                  busStage === BUS_STAGES.length - 1 && key === "AX" ? "is-pulsing" : ""
                }`}
                onClick={() => setActivePanel(key)}
              >
                <Database size={16} />
                <span>{key}</span>
                <span className="cpux-mono cpux-node-register-hex">
                  {toHex16(registers[key])}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bus communication simulator ───────────────────────────────── */}
      <section className="cpux-section">
        <div className="cpux-section-header">
          <h3>Bus Communication Simulator</h3>
          <button
            type="button"
            className="cpux-btn cpux-btn-primary"
            onClick={runBusSimulation}
            disabled={busRunning}
          >
            <Play size={14} />
            {busRunning ? "Running…" : "Run MOV AX, [1000]"}
          </button>
        </div>

        <div className="cpux-bus-track">
          {BUS_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = idx === busStage;
            const isDone = busStage > idx;
            return (
              <React.Fragment key={stage.key}>
                <div
                  className={`cpux-bus-node ${isActive ? "is-active" : ""} ${
                    isDone ? "is-done" : ""
                  }`}
                >
                  <Icon size={18} />
                  <span>{stage.label}</span>
                </div>
                {idx < BUS_STAGES.length - 1 && (
                  <div
                    className={`cpux-bus-connector ${
                      busStage > idx ? "is-active" : ""
                    } ${isActive ? "is-flowing" : ""}`}
                  >
                    <ArrowRight size={14} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <p className="cpux-fde-detail cpux-mono">
          MOV AX, [1000]<span className="cpux-muted"> ; loads AX from memory address 0x1000</span>
        </p>
      </section>

      {/* ── Memory segmentation ───────────────────────────────────────── */}
      <section className="cpux-section">
        <div className="cpux-section-header">
          <h3>Memory Segmentation</h3>
        </div>

        <div className="cpux-segments-grid">
          {MEMORY_SEGMENTS.map((seg) => (
            <button
              key={seg.key}
              type="button"
              className={`cpux-segment-card cpux-accent-${seg.color} ${
                activeSegment === seg.key ? "is-active" : ""
              }`}
              onClick={() =>
                setActiveSegment((prev) => (prev === seg.key ? null : seg.key))
              }
            >
              <div className="cpux-segment-head">
                <Layers size={16} />
                <span className="cpux-mono">{seg.key}</span>
              </div>
              <span className="cpux-segment-name">{seg.name}</span>
              {activeSegment === seg.key && (
                <div className="cpux-segment-detail">
                  <p>{seg.handles}</p>
                  <div className="cpux-chip-row">
                    {seg.examples.map((ex) => (
                      <span key={ex} className="cpux-chip cpux-chip-mini">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {activePanel === "alu" && <AluPanel onClose={() => setActivePanel(null)} />}
      {activePanel === "cu" && <CuPanel onClose={() => setActivePanel(null)} />}
      {["AX", "BX", "CX", "DX"].includes(activePanel) && (
        <RegisterPanel
          regKey={activePanel}
          registers={registers}
          onUpdateAx={handleAxUpdate}
          onClose={() => setActivePanel(null)}
        />
      )}
    </div>
  );
}

export default CPUExplorer;
