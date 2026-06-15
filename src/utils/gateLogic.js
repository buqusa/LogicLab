export const GATES = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR'];

export function compute(gate, a, b) {
  switch (gate) {
    case 'AND':  return a & b;
    case 'OR':   return a | b;
    case 'NOT':  return a ? 0 : 1;
    case 'NAND': return (a & b) ? 0 : 1;
    case 'NOR':  return (a | b) ? 0 : 1;
    case 'XOR':  return a ^ b;
    default:     return 0;
  }
}

export function applyGate(gate, inputs) {
  if (gate === 'NOT') return compute('NOT', inputs[0], 0);
  return inputs.reduce((acc, x) => compute(gate, acc, x));
}

export function buildTruthTable(gate, inputCount = 2) {
  const rows = [];
  for (let i = 0; i < 2 ** inputCount; i++) {
    const inputs = Array.from({ length: inputCount }, (_, k) =>
      (i >> (inputCount - 1 - k)) & 1
    );
    rows.push({ inputs, out: applyGate(gate, inputs) });
  }
  return rows;
}
