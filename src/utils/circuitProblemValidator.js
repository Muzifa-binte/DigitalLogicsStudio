function evalGate(
  gate,
  gatesArray,
  wiresArray,
  depth = 0,
  visited = new Set(),
) {
  if (depth > 100 || !gate || visited.has(gate.id)) return false;
  if (gate.type === "INPUT") return gate.inputValues[0] || false;

  const newVisited = new Set(visited);
  newVisited.add(gate.id);
  const inputs = [];

  wiresArray.forEach((wire) => {
    if (wire.toId === gate.id) {
      const fromGate = gatesArray.find((candidate) => candidate.id === wire.fromId);
      if (fromGate) {
        inputs[wire.toIndex] = evalGate(
          fromGate,
          gatesArray,
          wiresArray,
          depth + 1,
          newVisited,
        );
      }
    }
  });

  const connectedInputs = inputs.filter((value) => value !== undefined);

  switch (gate.type) {
    case "AND":
      return connectedInputs.length > 0 && connectedInputs.every(Boolean);
    case "OR":
      return connectedInputs.some(Boolean);
    case "NOT":
      return inputs[0] !== undefined ? !inputs[0] : false;
    case "NAND":
      return !(connectedInputs.length > 0 && connectedInputs.every(Boolean));
    case "NOR":
      return !connectedInputs.some(Boolean);
    case "XOR":
      return (
        connectedInputs.length >= 2 &&
        connectedInputs.reduce((accumulator, value) => accumulator !== value, false)
      );
    case "XNOR":
      return (
        connectedInputs.length >= 2 &&
        !connectedInputs.reduce((accumulator, value) => accumulator !== value, false)
      );
    case "BUFFER":
    case "OUTPUT":
      return inputs[0] ?? false;
    default:
      return false;
  }
}

function validateCircuit(gates, wires, problem, assignment = null) {
  const inputGates = gates.filter((gate) => gate.type === "INPUT");
  const outputGates = gates.filter((gate) => gate.type === "OUTPUT");

  const problemInputs = problem.inputs;
  const problemOutputs = problem.outputs;

  if (inputGates.length !== problemInputs.length) {
    return {
      pass: false,
      rows: [],
      error: `Circuit has ${inputGates.length} INPUT gate(s) but problem needs ${problemInputs.length}.`,
    };
  }

  if (outputGates.length !== problemOutputs.length) {
    return {
      pass: false,
      rows: [],
      error: `Circuit has ${outputGates.length} OUTPUT gate(s) but problem needs ${problemOutputs.length}.`,
    };
  }

  const tryLabelMatch = (portNames, gateList) => {
    const matched = portNames.map((name) =>
      gateList.find((gate) => gate.label === name),
    );

    return matched.every(Boolean) ? matched : null;
  };

  let orderedInputs;
  let orderedOutputs;

  if (
    assignment &&
    (Object.keys(assignment.inputMap).length > 0 ||
      Object.keys(assignment.outputMap).length > 0)
  ) {
    orderedInputs = problemInputs.map((name) =>
      gates.find((gate) => gate.id === assignment.inputMap[name]),
    );
    orderedOutputs = problemOutputs.map((name) =>
      gates.find((gate) => gate.id === assignment.outputMap[name]),
    );
  } else {
    orderedInputs = tryLabelMatch(problemInputs, inputGates) ?? inputGates;
    orderedOutputs = tryLabelMatch(problemOutputs, outputGates) ?? outputGates;
  }

  if (orderedInputs.some((gate) => !gate) || orderedOutputs.some((gate) => !gate)) {
    return {
      pass: false,
      rows: [],
      error: "Assignment is incomplete. Please map all inputs and outputs.",
    };
  }

  const rows = [];
  let allPass = true;

  for (const truthRow of problem.truthTable) {
    const tempGates = gates.map((gate) => {
      const inputIndex = orderedInputs.findIndex(
        (inputGate) => inputGate && inputGate.id === gate.id,
      );

      if (inputIndex !== -1) {
        return {
          ...gate,
          inputValues: [!!truthRow[problemInputs[inputIndex]]],
        };
      }

      return gate;
    });

    const gotValues = {};
    let rowPass = true;

    for (let outputIndex = 0; outputIndex < orderedOutputs.length; outputIndex += 1) {
      const outGate = tempGates.find(
        (gate) => gate.id === orderedOutputs[outputIndex].id,
      );
      const got = evalGate(outGate, tempGates, wires) ? 1 : 0;
      const expected = truthRow[problemOutputs[outputIndex]];

      gotValues[problemOutputs[outputIndex]] = got;

      if (got !== expected) {
        rowPass = false;
      }
    }

    if (!rowPass) {
      allPass = false;
    }

    rows.push({
      inputs: truthRow,
      expected: truthRow,
      got: gotValues,
      pass: rowPass,
    });
  }

  return {
    pass: allPass,
    rows,
    error: null,
  };
}

export { evalGate, validateCircuit };
