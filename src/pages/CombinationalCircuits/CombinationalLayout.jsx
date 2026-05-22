import React from "react";
import PremiumLearningShell from "../../components/topics/PremiumLearningShell";

const combinationalPages = [
  {
    path: "/encoder",
    label: "Encoder",
    description: "Compress active input lines into compact binary output codes.",
  },
  {
    path: "/decoder",
    label: "Decoder",
    description: "Expand binary inputs into one-hot outputs and minterm logic.",
  },
  {
    path: "/mux",
    label: "Multiplexer",
    description: "Route one of many inputs onto a single controlled output line.",
  },
  {
    path: "/demux",
    label: "Demultiplexer",
    description: "Distribute one input signal across a selected output channel.",
  },
];

const PATH_TO_SUBTOPIC_ID = {
  "/encoder": "encoder",
  "/decoder": "decoder",
  "/mux": "mux",
  "/demux": "demux",
};

const COMBINATIONAL_TOPIC = {
  id: "combinational-circuits",
  title: "COMBINATIONAL CIRCUITS",
  links: Object.values(PATH_TO_SUBTOPIC_ID).map((id) => ({ id })),
};

const CombinationalLayout = ({
  title,
  subtitle,
  intro,
  highlights = [],
  children,
}) => (
  <PremiumLearningShell
    title={title}
    subtitle={subtitle}
    intro={intro}
    highlights={highlights}
    pages={combinationalPages}
    topicLabel="Combinational Circuits"
    sidebarTitle="Combinational Circuits"
    sidebarCopy="Move through signal routing, encoding, decoding, and selection with one premium lesson framework."
    heroKicker="Combinational Circuits"
    progressVerb="complete"
    tracking={{
      topic: COMBINATIONAL_TOPIC,
      pathToSubtopicId: PATH_TO_SUBTOPIC_ID,
    }}
  >
    {children}
  </PremiumLearningShell>
);

export default CombinationalLayout;
