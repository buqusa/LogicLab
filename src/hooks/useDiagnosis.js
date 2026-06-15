export function useDiagnosis(stats, wrongNotes) {
  const acc = stats?.gateAccuracy ?? {};

  const rates = Object.fromEntries(
    Object.entries(acc).map(([g, s]) => [
      g,
      s.attempts > 0 ? s.correct / s.attempts : null,
    ])
  );

  const weak = Object.entries(rates)
    .filter(([, r]) => r !== null && r < 0.5)
    .sort(([, a], [, b]) => a - b)
    .map(([g]) => g);

  const misusedFreq = (wrongNotes ?? [])
    .slice(0, 10)
    .reduce((map, n) => {
      const g = n.userAnswer?.gate;
      if (g) map[g] = (map[g] ?? 0) + 1;
      return map;
    }, {});

  const topMisused = Object.entries(misusedFreq)
    .sort(([, a], [, b]) => b - a)
    .map(([g]) => g);

  const diagnoses = [];

  const negWeak = weak.filter(g => g === 'NAND' || g === 'NOR');
  if (negWeak.length >= 2) {
    diagnoses.push({
      level: 'warn',
      title: '부정 논리(NAND/NOR) 집중 복습 필요',
      text: '현재 NAND와 NOR 게이트에서 오답률이 높습니다. 드모르간 법칙 — ¬(A·B)=¬A∨¬B, ¬(A+B)=¬A∧¬B — 을 진리표와 함께 다시 확인해보세요.',
    });
  } else if (negWeak.length === 1) {
    const g = negWeak[0];
    const base = g === 'NAND' ? 'AND' : 'OR';
    diagnoses.push({
      level: 'warn',
      title: `${g} 게이트 복습 필요`,
      text: `${g}는 ${base} 게이트 출력의 완전한 반전입니다. ${base}의 진리표를 먼저 떠올린 뒤 0과 1을 모두 뒤집어 보세요.`,
    });
  }

  if (weak.includes('XOR')) {
    diagnoses.push({
      level: 'warn',
      title: 'XOR 게이트 이해 보완 필요',
      text: 'XOR는 두 입력이 서로 다를 때만 1을 출력합니다. 반가산기의 SUM 비트 계산과 패리티 검사에 핵심적으로 사용됩니다.',
    });
  }

  if (topMisused[0] === 'OR' && weak.includes('AND')) {
    diagnoses.push({
      level: 'info',
      title: 'AND ↔ OR 혼동 패턴 감지',
      text: '시나리오에서 "모든 조건이 동시에 충족"이면 AND, "하나만 충족해도 됨"이면 OR입니다. 한국어로는 "그리고"→AND, "또는"→OR로 매핑해보세요.',
    });
  }

  if (topMisused[0] === 'AND' && weak.includes('OR')) {
    diagnoses.push({
      level: 'info',
      title: 'OR ↔ AND 혼동 패턴 감지',
      text: '조건들이 "동시에" 충족되어야 하는지, "하나라도" 충족되면 되는지를 문장에서 먼저 파악하세요.',
    });
  }

  const totalAttempts = Object.values(acc).reduce((s, v) => s + v.attempts, 0);
  if (diagnoses.length === 0 && totalAttempts > 0) {
    diagnoses.push({
      level: 'good',
      title: '학습 상태 양호',
      text: '전반적인 게이트 이해도가 양호합니다. 반가산기와 드모르간 법칙이 적용된 고급 미션(M11~M15)에 도전해보세요!',
    });
  }

  const totalCorrect = Object.values(acc).reduce((s, v) => s + v.correct, 0);
  const overallRate = totalAttempts > 0
    ? Math.round((totalCorrect / totalAttempts) * 100)
    : null;

  return { weak, topMisused, diagnoses, overallRate, totalAttempts };
}
