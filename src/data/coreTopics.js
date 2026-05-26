const coreTopics = [
  {
    id: "boolean-algebra",
    title: "BOOLEAN ALGEBRA",
    eyebrow: "Foundation Track",
    icon: "Sigma",
    accent: "violet",
    description:
      "Build fluency in identities, duality, minterms, maxterms, and simplification workflows used throughout digital logic design.",
    progressLabel: "Theory + symbolic simplification",
    stats: {
      modules: 11,
      practice: 14,
      level: "Core",
    },
    links: [
      { id: "overview", text: "Overview", to: "/boolean/overview" },
      { id: "identities", text: "Identities", to: "/boolean/identities" },
      { id: "laws", text: "Laws", to: "/boolean/laws" },
      { id: "duality", text: "Duality", to: "/boolean/duality" },
      { id: "consensus", text: "Consensus", to: "/boolean/consensus" },
      { id: "complement", text: "Complement", to: "/boolean/complement" },
      { id: "minterms", text: "Minterms", to: "/boolean/minterms" },
      { id: "maxterms", text: "Maxterms", to: "/boolean/maxterms" },
      {
        id: "standard-forms",
        text: "SOP & POS",
        to: "/boolean/minterms-maxterms",
      },
      {
        id: "significant-digits",
        text: "Significant Digits",
        to: "/boolean/significant-digits",
      },
    ],
  },
  {
    id: "number-systems",
    title: "NUMBER SYSTEMS",
    eyebrow: "Conversion Track",
    icon: "Binary",
    accent: "cyan",
    description:
      "Work across positional systems, binary notation, BCD, ASCII, extension rules, and guided conversion strategies with step-by-step outputs.",
    progressLabel: "Conversion fluency + representation",
    stats: {
      modules: 7,
      practice: 9,
      level: "Core",
    },
    links: [
      {
        id: "calculator",
        text: "System Calculator",
        to: "/number-systems/calculator",
      },
      {
        id: "base-converter",
        text: "Base Converter",
        to: "/number-systems/number-conversion",
      },
      {
        id: "binary-visualizer",
        text: "Binary Visualizer",
        to: "/number-systems/binary-representation",
      },
      { id: "bcd", text: "BCD Notation", to: "/number-systems/bcd-notation" },
      { id: "ascii", text: "ASCII Codes", to: "/number-systems/ascii-notation" },
      { id: "bit-converter", text: "Bit Converter", to: "/number-systems/bit-converter" },
      { id: "bit-extension", text: "Bit Extension", to: "/number-systems/bit-extension" },
    ],
  },
  {
    id: "arithmetic-functions-and-hdls",
    title: "ARITHMETIC FUNCTIONS AND HDLs",
    eyebrow: "Premium Logic Lab",
    icon: "Calculator",
    accent: "amber",
    description:
      "Dedicated interactive modules for arithmetic logic design, code conversion, parity, comparators, complements, and signed arithmetic.",
    progressLabel: "Arithmetic pipelines + HDL thinking",
    stats: {
      modules: 10,
      practice: 16,
      level: "Premium",
    },
    links: [
      {
        id: "binary-adders",
        text: "Binary Adders",
        to: "/arithmetic/binary-adders",
      },
      {
        id: "binary-subtractor",
        text: "Binary Subtractor",
        to: "/arithmetic/binary-subtractor",
      },
      {
        id: "adder-subtractor",
        text: "Adder/Subtractor",
        to: "/arithmetic/binary-add-subtractor",
      },
      {
        id: "binary-multipliers",
        text: "Binary Multipliers",
        to: "/arithmetic/binary-multipliers",
      },
      {
        id: "code-conversion",
        text: "Code Conversion",
        to: "/arithmetic/code-conversion",
      },
      {
        id: "magnitude-comparator",
        text: "Magnitude Comparator",
        to: "/arithmetic/magnitude-comparator",
      },
      {
        id: "parity-generators",
        text: "Parity Generators",
        to: "/arithmetic/parity-generators",
      },
      {
        id: "design-applications",
        text: "Design Applications",
        to: "/arithmetic/design-applications",
      },
      {
        id: "complements",
        text: "1's and 2's Complements",
        to: "/arithmetic/complements",
      },
      {
        id: "signed-unsigned",
        text: "Signed/Unsigned Arithmetic",
        to: "/arithmetic/signed-unsigned",
      },
    ],
  },
  {
    id: "combinational-circuits",
    title: "COMBINATIONAL CIRCUITS",
    eyebrow: "Design Systems",
    icon: "GitBranch",
    accent: "blue",
    description:
      "Study how encoders, decoders, multiplexers, and demultiplexers route signals and implement real combinational control logic.",
    progressLabel: "Signal routing + truth-table design",
    stats: {
      modules: 4,
      practice: 12,
      level: "Core",
    },
    links: [
      { id: "encoder", text: "Encoder", to: "/encoder" },
      { id: "decoder", text: "Decoder", to: "/decoder" },
      { id: "mux", text: "Multiplexer", to: "/mux" },
      { id: "demux", text: "Demultiplexer", to: "/demux" },
    ],
  },
  {
    id: "sequential-circuits",
    title: "SEQUENTIAL CIRCUITS",
    eyebrow: "State Logic Track",
    icon: "Workflow",
    accent: "emerald",
    description:
      "Move from latches and flip-flops to state diagrams, analysis techniques, and structured sequential-circuit design procedures.",
    progressLabel: "Timing behavior + state transitions",
    stats: {
      modules: 8,
      practice: 13,
      level: "Core",
    },
    links: [
      { id: "intro", text: "Introduction", to: "/sequential/intro" },
      { id: "latches", text: "Latches", to: "/sequential/latches" },
      { id: "flip-flops", text: "Flip-Flops", to: "/sequential/flip-flops" },
      {
        id: "types",
        text: "Flip-Flop Types",
        to: "/sequential/flip-flop-types",
      },
      { id: "analysis", text: "Analysis", to: "/sequential/analysis" },
      {
        id: "design-procedures",
        text: "Design Procedures",
        to: "/sequential/design-procedures",
      },
      {
        id: "state-diagram",
        text: "State Diagrams",
        to: "/sequential/state-diagram",
      },
      {
        id: "state-reduction",
        text: "State Reduction",
        to: "/sequential/state-reduction",
      },
    ],
  },
  {
    id: "registers-and-register-transfers",
    title: "REGISTERS & REGISTER TRANSFERS",
    eyebrow: "Data Movement Track",
    icon: "ArrowLeftRight",
    accent: "rose",
    description:
      "Learn how digital systems store, shift, count, and transfer data through registers, counters, and synchronous control patterns.",
    progressLabel: "Storage structures + transfer control",
    stats: {
      modules: 9,
      practice: 10,
      level: "Core",
    },
    links: [
      { id: "registers", text: "Registers", to: "/registers/intro" },
      { id: "counters", text: "Counters", to: "/registers/counters" },
      { id: "sync-async", text: "Sync / Async", to: "/registers/sync-async" },
      {
        id: "shift-registers",
        text: "Shift Registers",
        to: "/registers/shift-registers",
      },
      {
        id: "serial-shift",
        text: "Serial Shift",
        to: "/registers/serial-shift",
      },
      { id: "loading", text: "Loading Registers", to: "/registers/loading" },
      { id: "parallel", text: "Parallel Registers", to: "/registers/parallel" },
      {
        id: "ripple-counters",
        text: "Ripple Counters",
        to: "/registers/ripple-counters",
      },
      {
        id: "sync-binary-counters",
        text: "Sync Binary Counters",
        to: "/registers/sync-binary-counters",
      },
    ],
  },
  {
    id: "memory-systems",
    title: "MEMORY SYSTEMS",
    eyebrow: "Storage Architecture",
    icon: "Database",
    accent: "indigo",
    description:
      "Explore ROM, RAM, PLA, and memory-construction techniques that explain how digital systems persist instructions and data.",
    progressLabel: "Memory organization + device behavior",
    stats: {
      modules: 7,
      practice: 8,
      level: "Core",
    },
    links: [
      { id: "memory-basics", text: "Memory Basics", to: "/memory/basics" },
      {
        id: "rom",
        text: "Read-Only Memories",
        to: "/memory/read-only-memories",
      },
      {
        id: "pla",
        text: "Programmable Logic Array",
        to: "/memory/programmable-logic-array",
      },
      {
        id: "ram",
        text: "Random Access Memory",
        to: "/memory/random-access-memory",
      },
      {
        id: "static-dynamic",
        text: "Static & Dynamic RAM",
        to: "/memory/static-dynamic-ram",
      },
      {
        id: "array-ics",
        text: "Array of RAM ICs",
        to: "/memory/array-of-ram-ics",
      },
      {
        id: "construction",
        text: "Memory Construction",
        to: "/memory/memory-construction-ram",
      },
    ],
  },
  {
    id: "advanced-logic",
    title: "ADVANCED LOGIC",
    eyebrow: "Optimization Track",
    icon: "Sparkles",
    accent: "slate",
    description:
      "Push into universal gates, circuit cost, timing-sensitive reasoning, and special digital-logic patterns used in design optimization.",
    progressLabel: "Optimization + design reasoning",
    stats: {
      modules: 4,
      practice: 6,
      level: "Advanced",
    },
    links: [
      { id: "circuit-cost", text: "Circuit Cost", to: "/circuit-cost" },
      {
        id: "universal-gates",
        text: "Universal Gates",
        to: "/universal-gates",
      },
      { id: "odd-function", text: "Odd Function", to: "/odd-function" },
      { id: "gates", text: "Gate Explanations", to: "/gates" },
    ],
  },
];

export default coreTopics;
