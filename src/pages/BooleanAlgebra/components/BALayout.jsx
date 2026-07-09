import React from "react";
import PremiumLearningShell from "../../../components/topics/PremiumLearningShell";
import "./BALayout.css";
import { baPages } from "./baConfig";

const PATH_TO_SUBTOPIC_ID = {
  "/boolean/overview": "overview",
  "/boolean/identities": "identities",
  "/boolean/laws": "laws",
  "/boolean/duality": "duality",
  "/boolean/consensus": "consensus",
  "/boolean/complement": "complement",
  "/boolean/minterms": "minterms",
  "/boolean/maxterms": "maxterms",
  "/boolean/minterms-maxterms": "relation",
  "/boolean/significant-digits": "significant-digits",
};

const BA_TOPIC = {
  id: "boolean-algebra",
  title: "BOOLEAN ALGEBRA",
  links: Object.values(PATH_TO_SUBTOPIC_ID).map((id) => ({ id })),
};

const BALayout = ({ title, subtitle, intro, highlights = [], children }) => (
  <PremiumLearningShell
    title={title}
    subtitle={subtitle}
    intro={intro}
    highlights={highlights}
    pages={baPages}
    overviewPath="/boolean/overview"
    topicLabel="Boolean Algebra"
    sidebarTitle="Boolean Algebra"
    sidebarCopy="Master the mathematical foundation of every digital circuit with one polished lesson flow."
    heroKicker="Boolean Algebra"
    progressVerb="read"
    rootClassName="ba-layout"
    tracking={{
      topic: BA_TOPIC,
      pathToSubtopicId: PATH_TO_SUBTOPIC_ID,
    }}
  >
    {children}
  </PremiumLearningShell>
);

export default BALayout;
