import React from "react";

export function VonNeumannDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Von Neumann architecture diagram">
      <svg viewBox="0 0 520 220" role="img" className="coal-diagram__svg">
        <rect x="200" y="20" width="120" height="56" rx="8" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="260" y="52" textAnchor="middle" className="coal-diagram__label">CPU</text>
        <text x="260" y="68" textAnchor="middle" className="coal-diagram__sublabel">Control + ALU</text>

        <rect x="200" y="140" width="120" height="56" rx="8" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="260" y="172" textAnchor="middle" className="coal-diagram__label">Memory</text>
        <text x="260" y="188" textAnchor="middle" className="coal-diagram__sublabel">Program + Data</text>

        <rect x="20" y="80" width="100" height="48" rx="8" className="coal-diagram__box coal-diagram__box--io" />
        <text x="70" y="110" textAnchor="middle" className="coal-diagram__label">Input</text>

        <rect x="400" y="80" width="100" height="48" rx="8" className="coal-diagram__box coal-diagram__box--io" />
        <text x="450" y="110" textAnchor="middle" className="coal-diagram__label">Output</text>

        <line x1="260" y1="76" x2="260" y2="140" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <line x1="200" y1="48" x2="120" y2="104" className="coal-diagram__line" />
        <line x1="320" y1="48" x2="400" y2="104" className="coal-diagram__line" />
        <line x1="120" y1="104" x2="200" y2="168" className="coal-diagram__line" />
        <line x1="400" y1="104" x2="320" y2="168" className="coal-diagram__line" />

        <text x="260" y="128" textAnchor="middle" className="coal-diagram__bus-label">Address / Data / Control Bus</text>

        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="coal-diagram__arrowhead" />
          </marker>
        </defs>
      </svg>
      <figcaption>Stored-program model: CPU and memory exchange instructions and data over a shared bus.</figcaption>
    </figure>
  );
}

export function SystemBusDiagram() {
  return (
    <figure className="coal-diagram" aria-label="System bus diagram">
      <svg viewBox="0 0 480 160" role="img" className="coal-diagram__svg">
        <rect x="180" y="56" width="120" height="48" rx="8" className="coal-diagram__box coal-diagram__box--bus" />
        <text x="240" y="86" textAnchor="middle" className="coal-diagram__label">System Bus</text>

        <rect x="20" y="20" width="90" height="40" rx="6" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="65" y="46" textAnchor="middle" className="coal-diagram__label">CPU</text>

        <rect x="20" y="100" width="90" height="40" rx="6" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="65" y="126" textAnchor="middle" className="coal-diagram__label">RAM</text>

        <rect x="370" y="20" width="90" height="40" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="415" y="46" textAnchor="middle" className="coal-diagram__label">Disk</text>

        <rect x="370" y="100" width="90" height="40" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="415" y="126" textAnchor="middle" className="coal-diagram__label">I/O</text>

        <line x1="110" y1="40" x2="180" y2="72" className="coal-diagram__line" />
        <line x1="110" y1="120" x2="180" y2="88" className="coal-diagram__line" />
        <line x1="300" y1="72" x2="370" y2="40" className="coal-diagram__line" />
        <line x1="300" y1="88" x2="370" y2="120" className="coal-diagram__line" />
      </svg>
      <figcaption>One bus connects all major components — like a shared highway for bits.</figcaption>
    </figure>
  );
}

export function BinaryByteDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Byte as 8 bits">
      <div className="coal-bit-row">
        {["1", "0", "1", "0", "1", "1", "0", "1"].map((bit, i) => (
          <div key={i} className={`coal-bit ${bit === "1" ? "coal-bit--on" : "coal-bit--off"}`}>
            <span className="coal-bit__value">{bit}</span>
            <span className="coal-bit__weight">{`2^${7 - i}`}</span>
          </div>
        ))}
      </div>
      <figcaption>One byte = 8 bits. Value shown: 10101101₂ = 173₁₀ = AD₁₆</figcaption>
    </figure>
  );
}

export function DecToBinDiagram() {
  return (
    <figure className="coal-diagram coal-diagram--steps" aria-label="Decimal to binary conversion">
      <ol className="coal-steps">
        <li>Start with decimal <strong>13</strong></li>
        <li>13 ÷ 2 = 6 remainder <strong>1</strong></li>
        <li>6 ÷ 2 = 3 remainder <strong>0</strong></li>
        <li>3 ÷ 2 = 1 remainder <strong>1</strong></li>
        <li>1 ÷ 2 = 0 remainder <strong>1</strong></li>
        <li>Read remainders upward → <strong>1101</strong>₂</li>
      </ol>
    </figure>
  );
}

export function IsaOverviewDiagram() {
  return (
    <figure className="coal-diagram coal-diagram--cards" aria-label="Instruction set categories">
      <div className="coal-isa-grid">
        {[
          { title: "Data Transfer", text: "Moves values between registers, memory, and I/O", accent: "transfer" },
          { title: "Arithmetic", text: "Adds, subtracts, multiplies, and divides operands", accent: "arithmetic" },
          { title: "Logic", text: "Applies bitwise operations such as AND and OR", accent: "logic" },
          { title: "Control", text: "Changes program flow with jumps and branches", accent: "control" },
        ].map((card) => (
          <div key={card.title} className={`coal-isa-card coal-isa-card--${card.accent}`}>
            <strong>{card.title}</strong>
            <span>{card.text}</span>
          </div>
        ))}
      </div>
      <figcaption>ISA instructions are grouped by purpose so the CPU has a clear vocabulary for each job.</figcaption>
    </figure>
  );
}

export function AddressingModesDiagram() {
  return (
    <figure className="coal-diagram coal-diagram--cards" aria-label="Addressing modes overview">
      <div className="coal-address-grid">
        {[
          { title: "Immediate", text: "Uses the literal value inside the instruction", code: "MOV AX, 5" },
          { title: "Register", text: "Uses an internal register as the source or target", code: "MOV AX, BX" },
          { title: "Direct", text: "Uses the exact memory address written in the instruction", code: "MOV AX, [1000]" },
          { title: "Indirect", text: "Uses a register that holds the memory address", code: "MOV AX, [BX]" },
        ].map((card) => (
          <div key={card.title} className="coal-address-card">
            <strong>{card.title}</strong>
            <span>{card.text}</span>
            <span style={{ marginTop: "0.35rem", color: "#c4b5fd" }}>{card.code}</span>
          </div>
        ))}
      </div>
      <figcaption>Each mode answers a different question: where is the operand, and how does the CPU find it?</figcaption>
    </figure>
  );
}

export function FlagsRegisterDiagram() {
  return (
    <figure className="coal-diagram coal-diagram--cards" aria-label="Flags register diagram">
      <div className="coal-flag-grid">
        {[
          { label: "ZF", text: "Zero Flag" },
          { label: "CF", text: "Carry Flag" },
          { label: "SF", text: "Sign Flag" },
          { label: "OF", text: "Overflow Flag" },
        ].map((flag, index) => (
          <div key={flag.label} className={`coal-flag-card ${index === 0 ? "coal-flag-card--active" : ""}`}>
            <strong>{flag.label}</strong>
            <span>{flag.text}</span>
          </div>
        ))}
      </div>
      <figcaption>Flags are status bits that report what happened after arithmetic or logic instructions run.</figcaption>
    </figure>
  );
}

export function TranslationPipelineDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Translation pipeline">
      <svg viewBox="0 0 600 200" role="img" className="coal-diagram__svg">
        <rect x="20" y="40" width="100" height="40" rx="6" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="70" y="65" textAnchor="middle" className="coal-diagram__label">C Source</text>

        <rect x="160" y="40" width="100" height="40" rx="6" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="210" y="65" textAnchor="middle" className="coal-diagram__label">Compiler</text>

        <rect x="300" y="40" width="100" height="40" rx="6" className="coal-diagram__box coal-diagram__box--bus" />
        <text x="350" y="65" textAnchor="middle" className="coal-diagram__label">Assembler</text>

        <rect x="440" y="40" width="100" height="40" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="490" y="65" textAnchor="middle" className="coal-diagram__label">Linker/Loader</text>

        {/* Arrows connecting them */}
        <line x1="120" y1="60" x2="155" y2="60" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <line x1="260" y1="60" x2="295" y2="60" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <line x1="400" y1="60" x2="435" y2="60" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
      </svg>
      <figcaption>C → Compiler → Assembler → Linker → Loader: the full translation chain.</figcaption>
    </figure>
  );
}

export function IA32GPRLayoutDiagram() {
  return (
    <figure className="coal-diagram" aria-label="EAX register split into AX, AH, AL">
      <svg viewBox="0 0 360 200" role="img" className="coal-diagram__svg">
        {/* EAX (32‑bit) */}
        <rect x="60" y="10" width="240" height="36" rx="6" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="180" y="32" textAnchor="middle" className="coal-diagram__label">EAX (32‑bit)</text>

        {/* AX (16‑bit) */}
        <rect x="100" y="70" width="160" height="36" rx="6" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="180" y="92" textAnchor="middle" className="coal-diagram__label">AX (16‑bit)</text>

        {/* AH / AL */}
        <rect x="100" y="130" width="76" height="36" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="138" y="152" textAnchor="middle" className="coal-diagram__label">AH</text>

        <rect x="184" y="130" width="76" height="36" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="222" y="152" textAnchor="middle" className="coal-diagram__label">AL</text>

        {/* Connecting lines */}
        <line x1="180" y1="46" x2="180" y2="68" className="coal-diagram__line" />
        <line x1="138" y1="106" x2="138" y2="128" className="coal-diagram__line" />
        <line x1="222" y1="106" x2="222" y2="128" className="coal-diagram__line" />
      </svg>
      <figcaption>General‑Purpose Register EAX can be accessed as AX, AH, or AL.</figcaption>
    </figure>
  );
}

export function IA32StackFrameDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Stack frame layout">
      <svg viewBox="0 0 400 300" role="img" className="coal-diagram__svg">
        {/* High memory label */}
        <text x="200" y="20" textAnchor="middle" className="coal-diagram__sublabel">High Memory</text>

        {/* Parameter 2 */}
        <rect x="120" y="30" width="160" height="28" rx="4" className="coal-diagram__box coal-diagram__box--io" />
        <text x="200" y="49" textAnchor="middle" className="coal-diagram__label">Parameter 2 [EBP+12]</text>

        {/* Parameter 1 */}
        <rect x="120" y="64" width="160" height="28" rx="4" className="coal-diagram__box coal-diagram__box--io" />
        <text x="200" y="83" textAnchor="middle" className="coal-diagram__label">Parameter 1 [EBP+8]</text>

        {/* Return address */}
        <rect x="120" y="98" width="160" height="28" rx="4" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="200" y="117" textAnchor="middle" className="coal-diagram__label">Return Address [EBP+4]</text>

        {/* Saved EBP */}
        <rect x="120" y="132" width="160" height="28" rx="4" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="200" y="151" textAnchor="middle" className="coal-diagram__label">Saved EBP [EBP]</text>

        {/* EBP label */}
        <line x1="280" y1="146" x2="320" y2="146" className="coal-diagram__line" />
        <text x="330" y="152" className="coal-diagram__sublabel">← EBP</text>

        {/* Local variable 1 */}
        <rect x="120" y="186" width="160" height="28" rx="4" className="coal-diagram__box coal-diagram__box--bus" />
        <text x="200" y="205" textAnchor="middle" className="coal-diagram__label">Local Var 1 [EBP-4]</text>

        {/* Local variable 2 */}
        <rect x="120" y="220" width="160" height="28" rx="4" className="coal-diagram__box coal-diagram__box--bus" />
        <text x="200" y="239" textAnchor="middle" className="coal-diagram__label">Local Var 2 [EBP-8]</text>

        {/* ESP label */}
        <line x1="280" y1="234" x2="320" y2="234" className="coal-diagram__line" />
        <text x="330" y="240" className="coal-diagram__sublabel">← ESP</text>

        {/* Low memory label */}
        <text x="200" y="280" textAnchor="middle" className="coal-diagram__sublabel">Low Memory</text>
      </svg>
      <figcaption>Stack frame: parameters at positive offsets, locals at negative offsets from EBP.</figcaption>
    </figure>
  );
}

export function IA32ModeTransitionsDiagram() {
  return (
    <figure className="coal-diagram" aria-label="IA-32 operating modes">
      <svg viewBox="0 0 480 280" role="img" className="coal-diagram__svg">
        {/* Power‑On */}
        <rect x="180" y="20" width="120" height="36" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="240" y="43" textAnchor="middle" className="coal-diagram__label">Power‑On / Reset</text>

        {/* Arrow down to Real Mode */}
        <line x1="240" y1="56" x2="240" y2="80" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        {/* Real Mode */}
        <rect x="30" y="100" width="120" height="36" rx="6" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="90" y="123" textAnchor="middle" className="coal-diagram__label">Real Mode</text>

        {/* Arrow from Real to Protected (Set CR0.PE) */}
        <line x1="150" y1="118" x2="240" y2="118" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <text x="195" y="112" textAnchor="middle" className="coal-diagram__sublabel">Set CR0.PE</text>

        {/* Protected Mode */}
        <rect x="240" y="100" width="120" height="36" rx="6" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="300" y="123" textAnchor="middle" className="coal-diagram__label">Protected Mode</text>

        {/* Arrow back from Protected to Real (Clear CR0.PE) */}
        <line x1="240" y1="136" x2="150" y2="136" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <text x="195" y="152" textAnchor="middle" className="coal-diagram__sublabel">Clear CR0.PE</text>

        {/* Arrow down from Protected to Virtual‑8086 (Set EFLAGS.VM) */}
        <line x1="300" y1="136" x2="300" y2="170" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <text x="320" y="156" className="coal-diagram__sublabel">Set EFLAGS.VM</text>

        {/* Virtual‑8086 */}
        <rect x="330" y="195" width="120" height="36" rx="6" className="coal-diagram__box coal-diagram__box--bus" />
        <text x="390" y="218" textAnchor="middle" className="coal-diagram__label">Virtual‑8086</text>

        {/* Arrow back from Virtual‑8086 to Protected (Clear EFLAGS.VM) */}
        <line x1="390" y1="195" x2="390" y2="140" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <text x="410" y="170" className="coal-diagram__sublabel">Clear EFLAGS.VM</text>

        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="coal-diagram__arrowhead" />
          </marker>
        </defs>
      </svg>
      <figcaption>IA‑32 modes: Real → Protected, and Virtual‑8086 as a submode of Protected Mode.</figcaption>
    </figure>
  );
}
export function IA32SegmentSelectorDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Segment selector layout">
      <svg viewBox="0 0 480 120" role="img" className="coal-diagram__svg">
        {/* Selector bar */}
        <rect x="20" y="40" width="440" height="36" rx="4" fill="#e0e0e0" stroke="#333" strokeWidth="1.5" />

        {/* Index (13 bits) */}
        <rect x="20" y="40" width="340" height="36" fill="#90caf9" />
        <text x="190" y="63" textAnchor="middle" className="coal-diagram__label">Index (13 bits)</text>

        {/* TI (1 bit) */}
        <rect x="360" y="40" width="40" height="36" fill="#ffcc80" />
        <text x="380" y="63" textAnchor="middle" className="coal-diagram__sublabel">TI</text>

        {/* RPL (2 bits) */}
        <rect x="400" y="40" width="60" height="36" fill="#a5d6a7" />
        <text x="430" y="63" textAnchor="middle" className="coal-diagram__sublabel">RPL</text>

        {/* Bit numbers */}
        <text x="360" y="30" textAnchor="middle" className="coal-diagram__sublabel">Bit 2</text>
        <text x="430" y="30" textAnchor="middle" className="coal-diagram__sublabel">Bits 1‑0</text>
        <text x="190" y="30" textAnchor="middle" className="coal-diagram__sublabel">Bits 15‑3</text>
      </svg>
      <figcaption>A segment selector is 16 bits: Index (13), TI (1), RPL (2).</figcaption>
    </figure>
  );
}

export function IA32LinearAddressBreakdownDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Linear address breakdown">
      <svg viewBox="0 0 500 120" role="img" className="coal-diagram__svg">
        {/* Address bar */}
        <rect x="20" y="40" width="460" height="36" rx="4" fill="#e0e0e0" stroke="#333" strokeWidth="1.5" />

        {/* Directory (10 bits) */}
        <rect x="20" y="40" width="150" height="36" fill="#90caf9" />
        <text x="95" y="63" textAnchor="middle" className="coal-diagram__label">Directory (10b)</text>

        {/* Table (10 bits) */}
        <rect x="170" y="40" width="150" height="36" fill="#ffcc80" />
        <text x="245" y="63" textAnchor="middle" className="coal-diagram__label">Table (10b)</text>

        {/* Offset (12 bits) */}
        <rect x="320" y="40" width="160" height="36" fill="#a5d6a7" />
        <text x="400" y="63" textAnchor="middle" className="coal-diagram__label">Offset (12b)</text>

        {/* Bit range labels */}
        <text x="95" y="30" textAnchor="middle" className="coal-diagram__sublabel">31‑22</text>
        <text x="245" y="30" textAnchor="middle" className="coal-diagram__sublabel">21‑12</text>
        <text x="400" y="30" textAnchor="middle" className="coal-diagram__sublabel">11‑0</text>
      </svg>
      <figcaption>A 32‑bit linear address split for two‑level paging.</figcaption>
    </figure>
  );
}

export function IA32AddressLifecycleDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Address lifecycle">
      <svg viewBox="0 0 600 250" role="img" className="coal-diagram__svg">
        {/* Instruction */}
        <rect x="220" y="10" width="160" height="30" rx="4" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="300" y="30" textAnchor="middle" className="coal-diagram__label">MOV EAX, [EBX]</text>

        {/* Arrow to Logical */}
        <line x1="300" y1="40" x2="300" y2="60" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        {/* Logical Address */}
        <rect x="200" y="65" width="200" height="30" rx="4" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="300" y="85" textAnchor="middle" className="coal-diagram__label">Logical Address (DS:Offset)</text>

        {/* Arrow to Segmentation */}
        <line x1="300" y1="95" x2="300" y2="115" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <text x="340" y="108" className="coal-diagram__sublabel">Segmentation (GDT)</text>

        {/* Linear Address */}
        <rect x="200" y="120" width="200" height="30" rx="4" className="coal-diagram__box coal-diagram__box--bus" />
        <text x="300" y="140" textAnchor="middle" className="coal-diagram__label">Linear Address (32‑bit)</text>

        {/* Arrow to Paging */}
        <line x1="300" y1="150" x2="300" y2="170" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />
        <text x="340" y="163" className="coal-diagram__sublabel">Paging (CR3 → Page Tables)</text>

        {/* Physical Address */}
        <rect x="180" y="175" width="240" height="30" rx="4" className="coal-diagram__box coal-diagram__box--io" />
        <text x="300" y="195" textAnchor="middle" className="coal-diagram__label">Physical Address (RAM Bus)</text>

        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="coal-diagram__arrowhead" />
          </marker>
        </defs>
      </svg>
      <figcaption>From instruction to physical memory: segmentation, then paging.</figcaption>
    </figure>
  );
}

export function SegmentLayoutDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Standard segment layout">
      <svg viewBox="0 0 300 200" role="img" className="coal-diagram__svg">
        <rect x="60" y="10" width="180" height="36" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="150" y="33" textAnchor="middle" className="coal-diagram__label">.STACK</text>

        <rect x="60" y="60" width="180" height="36" rx="6" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="150" y="83" textAnchor="middle" className="coal-diagram__label">.DATA</text>

        <rect x="60" y="110" width="180" height="36" rx="6" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="150" y="133" textAnchor="middle" className="coal-diagram__label">.CODE</text>

        <text x="150" y="170" textAnchor="middle" className="coal-diagram__sublabel">Classic three‑segment program layout</text>
      </svg>
      <figcaption>Memory segments: stack for temporaries, data for variables, code for instructions.</figcaption>
    </figure>
  );
}

export function ProcCallFlowDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Procedure call flow">
      <svg viewBox="0 0 440 200" role="img" className="coal-diagram__svg">
        {/* CALL side */}
        <rect x="20" y="40" width="160" height="40" rx="6" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="100" y="60" textAnchor="middle" className="coal-diagram__label">CALL Proc</text>
        <text x="100" y="75" textAnchor="middle" className="coal-diagram__sublabel">PUSH EIP → Stack</text>

        {/* Arrow */}
        <line x1="180" y1="60" x2="240" y2="60" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        {/* Procedure box */}
        <rect x="240" y="40" width="160" height="40" rx="6" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="320" y="60" textAnchor="middle" className="coal-diagram__label">Procedure Code</text>
        <text x="320" y="75" textAnchor="middle" className="coal-diagram__sublabel">… executes …</text>

        {/* RET arrow */}
        <line x1="320" y1="80" x2="320" y2="110" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        {/* Return box */}
        <rect x="240" y="115" width="160" height="40" rx="6" className="coal-diagram__box coal-diagram__box--bus" />
        <text x="320" y="135" textAnchor="middle" className="coal-diagram__label">RET</text>
        <text x="320" y="150" textAnchor="middle" className="coal-diagram__sublabel">POP → EIP</text>

        {/* Back to caller */}
        <line x1="240" y1="135" x2="180" y2="135" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        <rect x="20" y="115" width="160" height="40" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="100" y="135" textAnchor="middle" className="coal-diagram__label">Next Instruction</text>

        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="coal-diagram__arrowhead" />
          </marker>
        </defs>
      </svg>
      <figcaption>CALL pushes the return address, RET pops it back to EIP.</figcaption>
    </figure>
  );
}

export function BuildPipelineDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Build pipeline">
      <svg viewBox="0 0 620 120" role="img" className="coal-diagram__svg">
        <rect x="10" y="40" width="100" height="36" rx="6" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="60" y="63" textAnchor="middle" className="coal-diagram__label">.ASM file</text>

        <line x1="110" y1="58" x2="140" y2="58" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        <rect x="145" y="40" width="100" height="36" rx="6" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="195" y="63" textAnchor="middle" className="coal-diagram__label">Assembler</text>

        <line x1="245" y1="58" x2="275" y2="58" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        <rect x="280" y="40" width="100" height="36" rx="6" className="coal-diagram__box coal-diagram__box--bus" />
        <text x="330" y="63" textAnchor="middle" className="coal-diagram__label">.OBJ file</text>

        <line x1="380" y1="58" x2="410" y2="58" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        <rect x="415" y="40" width="100" height="36" rx="6" className="coal-diagram__box coal-diagram__box--io" />
        <text x="465" y="63" textAnchor="middle" className="coal-diagram__label">Linker</text>

        <line x1="515" y1="58" x2="545" y2="58" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        <rect x="550" y="40" width="60" height="36" rx="6" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="580" y="63" textAnchor="middle" className="coal-diagram__label">.EXE</text>

        <text x="310" y="25" textAnchor="middle" className="coal-diagram__sublabel">Assembly Stage</text>
        <text x="465" y="25" textAnchor="middle" className="coal-diagram__sublabel">Link Stage</text>

        <line x1="580" y1="76" x2="580" y2="90" className="coal-diagram__arrow" markerEnd="url(#arrowhead)" />

        <rect x="540" y="95" width="80" height="20" rx="4" className="coal-diagram__box coal-diagram__box--io" />
        <text x="580" y="109" textAnchor="middle" className="coal-diagram__sublabel">RAM</text>

        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="coal-diagram__arrowhead" />
          </marker>
        </defs>
      </svg>
      <figcaption>The build chain: .ASM → Assembler → .OBJ → Linker → .EXE → Loader → RAM.</figcaption>
    </figure>
  );
}

export function DemoProgramTemplateDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Demo assembly program template">
      <svg viewBox="0 0 600 220" role="img" className="coal-diagram__svg">
        <foreignObject x="10" y="10" width="580" height="200">
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.5' }}>
            <pre style={{ margin: 0 }}>
{`.386
.MODEL FLAT, STDCALL
.STACK 4096

.DATA
value    DB  10
myArray  DW  5 DUP(0)

.CODE
main PROC
    MOV EAX, 0
    MOV EBX, OFFSET value
    MOV BYTE PTR [EBX], 20
    CALL ResetAccumulator
    INVOKE ExitProcess, 0
main ENDP

ResetAccumulator PROC
    XOR EAX, EAX
    RET
ResetAccumulator ENDP
END main`}
            </pre>
          </div>
        </foreignObject>
      </svg>
      <figcaption>A minimal but complete IA‑32 program with all the essential segments.</figcaption>
    </figure>
  );
}

export function StackFrameLayoutDiagram() {
  return (
    <figure className="coal-diagram" aria-label="Stack frame layout">
      <svg viewBox="0 0 400 300" role="img" className="coal-diagram__svg">
        <text x="200" y="20" textAnchor="middle" className="coal-diagram__sublabel">High Addresses</text>

        <rect x="100" y="30" width="200" height="28" rx="4" className="coal-diagram__box coal-diagram__box--io" />
        <text x="200" y="49" textAnchor="middle" className="coal-diagram__label">Parameters [EBP+8, +12…]</text>

        <rect x="100" y="64" width="200" height="28" rx="4" className="coal-diagram__box coal-diagram__box--mem" />
        <text x="200" y="83" textAnchor="middle" className="coal-diagram__label">Return Address [EBP+4]</text>

        <rect x="100" y="98" width="200" height="28" rx="4" className="coal-diagram__box coal-diagram__box--cpu" />
        <text x="200" y="117" textAnchor="middle" className="coal-diagram__label">Old EBP [EBP]</text>

        <rect x="100" y="152" width="200" height="28" rx="4" className="coal-diagram__box coal-diagram__box--bus" />
        <text x="200" y="171" textAnchor="middle" className="coal-diagram__label">Local Variables [EBP‑4, ‑8…]</text>

        <text x="200" y="210" textAnchor="middle" className="coal-diagram__sublabel">Low Addresses (ESP)</text>
      </svg>
      <figcaption>Stack frame: parameters above EBP, locals below.</figcaption>
    </figure>
  );
}


const DIAGRAM_MAP = {
  "von-neumann": VonNeumannDiagram,
  "system-bus": SystemBusDiagram,
  "binary-byte": BinaryByteDiagram,
  "dec-to-bin": DecToBinDiagram,
  "isa-overview": IsaOverviewDiagram,
  "addressing-modes": AddressingModesDiagram,
  "flags-register": FlagsRegisterDiagram,
  "translation-pipeline": TranslationPipelineDiagram,
  "ia32-gpr-layout": IA32GPRLayoutDiagram,
  "ia32-stack-frame": IA32StackFrameDiagram,
  "ia32-mode-transitions": IA32ModeTransitionsDiagram,
  "ia32-segment-selector": IA32SegmentSelectorDiagram,
  "ia32-linear-address-breakdown": IA32LinearAddressBreakdownDiagram,
  "ia32-address-lifecycle": IA32AddressLifecycleDiagram,
  "segment-layout": SegmentLayoutDiagram,
  "proc-call-flow": ProcCallFlowDiagram,
  "build-pipeline": BuildPipelineDiagram,
  "demo-program-template": DemoProgramTemplateDiagram,
  "stack-frame-layout": StackFrameLayoutDiagram,
};

export function CoalDiagram({ type }) {
  const Component = DIAGRAM_MAP[type];
  if (!Component) return null;
  return <Component />;
}
