import { useState, useEffect } from 'react';
import { applyGate } from '../utils/gateLogic';

export function useCircuit(initInputs = [0, 0], initGate = 'AND') {
  const [inputs, setInputs] = useState(initInputs);
  const [gate, setGate] = useState(initGate);
  const [output, setOutput] = useState(0);

  useEffect(() => {
    setOutput(applyGate(gate, inputs));
  }, [gate, inputs]);

  function toggle(idx) {
    setInputs(prev => prev.map((v, i) => (i === idx ? (v ? 0 : 1) : v)));
  }

  function reset(newInputs, newGate) {
    setInputs(newInputs ?? initInputs);
    setGate(newGate ?? initGate);
  }

  return { inputs, gate, output, setGate, toggle, reset };
}
