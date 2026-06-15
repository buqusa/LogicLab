export const GATE_META = {
  AND:  { symbol: 'A · B',   rule: '모든 입력이 1일 때만 1 출력',       pattern: '[ 0, 0, 0, 1 ] — 마지막 행만 1' },
  OR:   { symbol: 'A + B',   rule: '하나 이상 1이면 1 출력',            pattern: '[ 0, 1, 1, 1 ] — 첫 행만 0' },
  NOT:  { symbol: '¬A',      rule: '입력을 완전히 반전 (0↔1)',           pattern: '[ 1, 0 ]' },
  NAND: { symbol: '¬(A·B)',  rule: 'AND 출력의 반전 — 둘 다 1일 때만 0', pattern: '[ 1, 1, 1, 0 ] — 마지막 행만 0 (AND 반전)' },
  NOR:  { symbol: '¬(A+B)',  rule: 'OR 출력의 반전 — 둘 다 0일 때만 1',  pattern: '[ 1, 0, 0, 0 ] — 첫 행만 1 (OR 반전)' },
  XOR:  { symbol: 'A ⊕ B',  rule: '두 입력이 서로 다를 때만 1 출력',    pattern: '[ 0, 1, 1, 0 ] — 대각 대칭' },
};

export function getRowInsight(gate, inputs) {
  const [a, b] = inputs;

  switch (gate) {
    case 'AND':
      return a === 1 && b === 1
        ? '✦ AND의 유일한 출력=1 조건입니다. 두 입력이 모두 HIGH 상태 — 실제 회로에서 안전 인터록 구현에 사용됩니다.'
        : `입력 중 0이 있어 차단됩니다. AND는 ${a === 0 && b === 0 ? '두 신호 모두' : '한 신호가'} 열려있지 않으면 출력을 차단합니다.`;

    case 'OR':
      return a === 0 && b === 0
        ? '✦ OR의 유일한 출력=0 조건입니다. 두 입력이 모두 LOW — 어떤 신호도 없는 상태입니다.'
        : '하나 이상 1이므로 OR 게이트가 통과시킵니다. 비상 버튼처럼 하나만 눌려도 동작합니다.';

    case 'NOT':
      return `NOT은 단일 입력을 완전히 반전합니다. ${a} → ${a ? 0 : 1}. 가장 단순하지만 NAND/NOR 구현의 기초입니다.`;

    case 'NAND':
      return a === 1 && b === 1
        ? '✦ NAND의 유일한 출력=0 조건입니다. ¬(1·1)=0 — 드모르간 법칙으로 ¬A∨¬B와 동치입니다.'
        : '하나라도 0이면 NAND 출력은 1입니다. AND의 반전 구조를 기억하세요.';

    case 'NOR':
      return a === 0 && b === 0
        ? '✦ NOR의 유일한 출력=1 조건입니다. ¬(0+0)=1 — 드모르간 법칙으로 ¬A∧¬B와 동치입니다.'
        : '하나라도 1이면 NOR 출력은 0입니다. OR의 반전 구조를 기억하세요.';

    case 'XOR':
      return a === b
        ? `두 입력이 같으면(${a}=${b}) XOR = 0. 짝수 패리티 상태이며, 반가산기에서 SUM=0을 의미합니다.`
        : `두 입력이 다르면(${a}≠${b}) XOR = 1. 홀수 패리티 상태이며, 반가산기에서 SUM=1을 의미합니다.`;

    default:
      return '';
  }
}

export const SANDBOX_GUIDE_STEPS = [
  { condition: (tries) => tries === 0, text: '💡 스위치를 하나씩 토글하며 출력 LED의 변화를 관찰하세요.' },
  { condition: (tries) => tries === 2, text: '📖 진리표에서 지금 강조된 행이 현재 입력 조합에 해당합니다.' },
  { condition: (tries) => tries === 4, text: '🔁 게이트를 바꿔보고 같은 입력에서 출력이 어떻게 달라지는지 비교해보세요.' },
];
