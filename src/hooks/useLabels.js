import { useStorage } from './useStorage';

const initLabels = {
  inputA: { name: 'A',   icon: '●' },
  inputB: { name: 'B',   icon: '●' },
  output: { name: '출력', icon: '💡' },
};

export function useLabels() {
  const [labels, setLabels] = useStorage('logiclab_customLabels', initLabels);

  function updateLabel(key, field, val) {
    setLabels(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: val },
    }));
  }

  function resetLabels() {
    setLabels(initLabels);
  }

  return { labels, updateLabel, resetLabels };
}
