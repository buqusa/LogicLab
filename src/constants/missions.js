import { applyGate } from '../utils/gateLogic';

// answer: 정답 게이트명 / validate: 전체 진리표 검증 함수(고급 미션용)
export const MISSIONS = [
  // ── 자동문 ────────────────────────────────────────────────────────
  {
    id: 1,
    category: '자동문',
    difficulty: 'easy',
    title: '자동문 기본 제어',
    description:
      '방문객 감지 센서와 접근 허가 신호가 모두 활성화될 때만 자동문이 열리도록 회로를 설계하시오.',
    inputs: [
      { key: 'A', label: '방문객 감지', icon: '👤', value: 1 },
      { key: 'B', label: '접근 허가',   icon: '🔑', value: 0 },
    ],
    output: { label: '자동문 개방', icon: '🚪' },
    targetOutput: 0,
    answer: 'AND',
    hint: '두 조건이 모두 충족될 때만 문이 열려야 합니다.',
    score: 100,
  },
  {
    id: 2,
    category: '자동문',
    difficulty: 'medium',
    title: '비상 자동문 개방',
    description:
      '방문객 감지 또는 비상 개방 버튼 중 하나만 활성화되어도 자동문이 열리도록 설계하시오.',
    inputs: [
      { key: 'A', label: '방문객 감지',   icon: '👤', value: 1 },
      { key: 'B', label: '비상 개방 버튼', icon: '🆘', value: 0 },
    ],
    output: { label: '자동문 개방', icon: '🚪' },
    targetOutput: 1,
    answer: 'OR',
    hint: '하나라도 조건이 충족되면 문이 열려야 합니다.',
    score: 150,
  },
  {
    id: 3,
    category: '자동문',
    difficulty: 'hard',
    title: '보안 구역 이중 잠금',
    description:
      '두 개의 보안 적외선 센서 중 어느 하나라도 이상을 감지하지 않을 때만 통로가 개방되도록 설계하시오.',
    inputs: [
      { key: 'A', label: '적외선 센서 1', icon: '📡', value: 0 },
      { key: 'B', label: '적외선 센서 2', icon: '📡', value: 0 },
    ],
    output: { label: '통로 개방', icon: '🚪' },
    targetOutput: 1,
    answer: 'NOR',
    hint: '두 센서 모두 이상이 없을 때(둘 다 0)만 통로가 열립니다.',
    score: 200,
  },

  // ── 화재 경보 ─────────────────────────────────────────────────────
  {
    id: 4,
    category: '화재 경보',
    difficulty: 'easy',
    title: '화재 1차 경보',
    description:
      '오작동 방지를 위해 온도 센서와 연기 센서가 동시에 이상을 감지할 때만 경보가 울리도록 설계하시오.',
    inputs: [
      { key: 'A', label: '온도 센서', icon: '🌡️', value: 1 },
      { key: 'B', label: '연기 센서', icon: '💨', value: 0 },
    ],
    output: { label: '경보 사이렌', icon: '🚨' },
    targetOutput: 0,
    answer: 'AND',
    hint: '두 센서 모두 이상을 감지했을 때만 실제 화재로 판정합니다.',
    score: 100,
  },
  {
    id: 5,
    category: '화재 경보',
    difficulty: 'medium',
    title: '화재 즉시 경보',
    description:
      '온도 센서 또는 연기 센서 중 하나만 이상을 감지해도 즉시 경보가 울리도록 설계하시오.',
    inputs: [
      { key: 'A', label: '온도 센서', icon: '🌡️', value: 1 },
      { key: 'B', label: '연기 센서', icon: '💨', value: 0 },
    ],
    output: { label: '경보 사이렌', icon: '🚨' },
    targetOutput: 1,
    answer: 'OR',
    hint: '두 센서 중 하나라도 이상을 감지하면 경보가 울려야 합니다.',
    score: 150,
  },
  {
    id: 6,
    category: '화재 경보',
    difficulty: 'hard',
    title: '비정상 패턴 점검',
    description:
      '온도 또는 연기 중 정확히 하나만 이상 신호를 보낼 때 점검 알람을 발생시키도록 설계하시오. (둘 다 이상이거나 둘 다 정상이면 알람 없음)',
    inputs: [
      { key: 'A', label: '온도 센서', icon: '🌡️', value: 1 },
      { key: 'B', label: '연기 센서', icon: '💨', value: 0 },
    ],
    output: { label: '점검 알람', icon: '⚠️' },
    targetOutput: 1,
    answer: 'XOR',
    hint: '두 입력 값이 서로 다를 때만 출력이 켜지는 게이트를 찾아보세요.',
    score: 200,
  },

  // ── 에어컨 제어 ───────────────────────────────────────────────────
  {
    id: 7,
    category: '에어컨 제어',
    difficulty: 'easy',
    title: '에어컨 기본 가동',
    description:
      '사람이 있고 실내 온도가 높을 때만 에어컨이 켜지도록 설계하시오.',
    inputs: [
      { key: 'A', label: 'PIR 센서',  icon: '👤', value: 1 },
      { key: 'B', label: '온도 센서', icon: '🌡️', value: 0 },
    ],
    output: { label: '에어컨', icon: '❄️' },
    targetOutput: 0,
    answer: 'AND',
    hint: '사람이 없거나 온도가 낮으면 에어컨을 틀 필요가 없습니다.',
    score: 100,
  },
  {
    id: 8,
    category: '에어컨 제어',
    difficulty: 'medium',
    title: '자동 에어컨 시스템',
    description:
      '사람이 있고(PIR=1), 실내 온도가 높고(Temp=1), 창문이 닫혔을 때(Window=1) 에어컨이 켜지도록 복합 회로를 설계하시오.',
    inputs: [
      { key: 'A', label: 'PIR 센서',  icon: '👤', value: 1 },
      { key: 'B', label: '온도 센서', icon: '🌡️', value: 1 },
      { key: 'C', label: '창문 닫힘', icon: '🪟', value: 0 },
    ],
    output: { label: '에어컨', icon: '❄️' },
    targetOutput: 0,
    answer: 'AND',
    hint: '세 조건이 모두 만족되어야 합니다.',
    score: 150,
  },
  {
    id: 9,
    category: '에어컨 제어',
    difficulty: 'hard',
    title: '에너지 절약 제어',
    description:
      '냉방 요청과 에너지 절약 모드가 동시에 활성화되면 에어컨이 꺼지도록 설계하시오. (둘 중 하나라도 꺼져 있으면 에어컨 가동)',
    inputs: [
      { key: 'A', label: '냉방 요청',       icon: '❄️', value: 1 },
      { key: 'B', label: '에너지 절약 모드', icon: '🔋', value: 1 },
    ],
    output: { label: '에어컨', icon: '❄️' },
    targetOutput: 0,
    answer: 'NAND',
    hint: 'NAND 게이트는 두 입력이 모두 1일 때만 출력이 0이 됩니다.',
    score: 200,
  },

  // ── 컨베이어 벨트 안전장치 ────────────────────────────────────────
  {
    id: 10,
    category: '컨베이어 안전',
    difficulty: 'easy',
    title: '컨베이어 정상 가동',
    description:
      '안전 가드가 설치되고(A=1) 시작 신호가 입력됐을 때(B=1)만 컨베이어 벨트가 가동되도록 설계하시오.',
    inputs: [
      { key: 'A', label: '안전 가드', icon: '🛡️', value: 1 },
      { key: 'B', label: '시작 신호', icon: '▶️', value: 0 },
    ],
    output: { label: '컨베이어 가동', icon: '⚙️' },
    targetOutput: 0,
    answer: 'AND',
    hint: '두 조건이 모두 충족될 때만 안전하게 가동됩니다.',
    score: 100,
  },
  // ── CPU 연산 회로 ─────────────────────────────────────────────────
  {
    id: 11,
    category: 'CPU 연산 회로',
    difficulty: 'hard',
    title: '반가산기 합산 비트 (SUM)',
    description:
      '1비트 반가산기(Half Adder)에서 두 입력 비트를 더한 합산 비트(SUM)를 출력하는 회로를 설계하시오.\n' +
      '이진 덧셈표: 0+0=0, 0+1=1, 1+0=1, 1+1=10₂(SUM=0, CARRY=1)\n' +
      '※ 단순히 제시된 입력값만 맞추는 게 아니라, 모든 입력 조합에서 올바른 SUM을 출력해야 합니다.',
    inputs: [
      { key: 'A', label: '비트 A', icon: '🔢', value: 1 },
      { key: 'B', label: '비트 B', icon: '🔢', value: 1 },
    ],
    output: { label: 'SUM (합산 비트)', icon: '∑' },
    targetOutput: 0,
    answer: 'XOR',
    validate(gate) {
      return [[0,0,0],[0,1,1],[1,0,1],[1,1,0]]
        .every(([a,b,out]) => applyGate(gate,[a,b]) === out);
    },
    hint: '이진 덧셈에서 1+1=10₂. 합산 비트(SUM)는 두 비트가 서로 다를 때만 1이 됩니다. 모든 4가지 입력 조합의 진리표를 만족하는 게이트를 찾으세요.',
    score: 250,
  },
  {
    id: 12,
    category: 'CPU 연산 회로',
    difficulty: 'hard',
    title: '반가산기 올림 비트 (CARRY)',
    description:
      '반가산기(Half Adder)에서 올림 비트(CARRY)를 출력하는 회로를 설계하시오.\n' +
      'CARRY는 두 비트가 모두 1일 때(1+1=10₂)만 발생합니다. 실제 ALU는 SUM과 CARRY 두 회로를 병렬로 사용합니다.\n' +
      '※ 전체 진리표 검증 모드: 모든 입력 조합에서 올바른 CARRY를 출력해야 합니다.',
    inputs: [
      { key: 'A', label: '비트 A', icon: '🔢', value: 1 },
      { key: 'B', label: '비트 B', icon: '🔢', value: 0 },
    ],
    output: { label: 'CARRY (올림 비트)', icon: '↑' },
    targetOutput: 0,
    answer: 'AND',
    validate(gate) {
      return [[0,0,0],[0,1,0],[1,0,0],[1,1,1]]
        .every(([a,b,out]) => applyGate(gate,[a,b]) === out);
    },
    hint: '올림(CARRY)은 두 입력이 모두 1일 때만 발생합니다. 어떤 게이트가 (1,1)→1, 나머지→0의 진리표를 갖는지 확인하세요.',
    score: 250,
  },

  // ── 데이터 무결성 ─────────────────────────────────────────────────
  {
    id: 13,
    category: '데이터 무결성',
    difficulty: 'hard',
    title: '3비트 홀수 패리티 생성기',
    description:
      '데이터 전송 오류 검출을 위해 3개 비트의 홀수 패리티 비트를 생성하는 회로를 설계하시오.\n' +
      '홀수 패리티: 데이터 비트 중 1의 개수가 홀수이면 패리티=1, 짝수이면 패리티=0.\n' +
      '※ 3개 입력 × 전체 8가지 조합을 모두 통과해야 합니다.',
    inputs: [
      { key: 'A', label: '데이터 비트 D0', icon: '💾', value: 1 },
      { key: 'B', label: '데이터 비트 D1', icon: '💾', value: 0 },
      { key: 'C', label: '데이터 비트 D2', icon: '💾', value: 1 },
    ],
    output: { label: '패리티 비트 P', icon: 'P' },
    targetOutput: 0,
    answer: 'XOR',
    validate(gate) {
      return [
        [0,0,0,0],[0,0,1,1],[0,1,0,1],[0,1,1,0],
        [1,0,0,1],[1,0,1,0],[1,1,0,0],[1,1,1,1],
      ].every(([a,b,c,out]) => applyGate(gate,[a,b,c]) === out);
    },
    hint: 'XOR 게이트를 3개 입력에 연쇄 적용하면 1의 개수가 홀수인지 짝수인지를 판별합니다. XOR(XOR(D0,D1),D2) 순서로 계산해보세요.',
    score: 300,
  },

  // ── 드모르간 법칙 응용 ────────────────────────────────────────────
  {
    id: 14,
    category: '드모르간 법칙',
    difficulty: 'hard',
    title: '드모르간 등가 — NAND 변환',
    description:
      '품질 검사 라인에서 두 센서(A, B) 중 하나라도 불량품 미감지 상태(0)이면 경보를 발령하시오.\n' +
      '논리식: ¬A ∨ ¬B = ¬(A∧B) [드모르간 법칙]\n' +
      '"둘 다 감지(1)해야만 이상 없음" → 둘 다 1일 때만 출력 0, 나머지는 1.\n' +
      '※ 전체 진리표 검증 모드.',
    inputs: [
      { key: 'A', label: '품질 센서 A', icon: '🔍', value: 1 },
      { key: 'B', label: '품질 센서 B', icon: '🔍', value: 0 },
    ],
    output: { label: '불량 경보', icon: '⚠️' },
    targetOutput: 1,
    answer: 'NAND',
    validate(gate) {
      return [[0,0,1],[0,1,1],[1,0,1],[1,1,0]]
        .every(([a,b,out]) => applyGate(gate,[a,b]) === out);
    },
    hint: '드모르간: ¬A ∨ ¬B = ¬(A∧B). "하나라도 0이면 경보"는 AND의 출력을 반전한 것과 동일합니다. 진리표 출력 열이 [1,1,1,0]인 게이트를 찾으세요.',
    score: 300,
  },
  {
    id: 15,
    category: '드모르간 법칙',
    difficulty: 'hard',
    title: '드모르간 등가 — NOR 변환',
    description:
      '이중화 서버 시스템에서 두 서버(A, B)가 모두 가동 중단(0)일 때만 비상 전원을 투입하시오.\n' +
      '논리식: ¬A ∧ ¬B = ¬(A∨B) [드모르간 법칙]\n' +
      '"하나라도 살아있으면(1) 비상 전원 불필요" → A∨B=0일 때만 출력 1.\n' +
      '※ 전체 진리표 검증 모드.',
    inputs: [
      { key: 'A', label: '서버 A 상태', icon: '🖥️', value: 0 },
      { key: 'B', label: '서버 B 상태', icon: '🖥️', value: 0 },
    ],
    output: { label: '비상 전원 투입', icon: '⚡' },
    targetOutput: 1,
    answer: 'NOR',
    validate(gate) {
      return [[0,0,1],[0,1,0],[1,0,0],[1,1,0]]
        .every(([a,b,out]) => applyGate(gate,[a,b]) === out);
    },
    hint: '드모르간: ¬A ∧ ¬B = ¬(A∨B). "둘 다 0일 때만 1" — OR 게이트 출력을 뒤집으면 됩니다. 진리표 출력 열이 [1,0,0,0]인 게이트를 찾으세요.',
    score: 300,
  },
];

export const DIFFICULTY_LABEL = { easy: '초급', medium: '중급', hard: '고급' };
export const CATEGORY_ICONS = {
  '자동문':      '🚪',
  '화재 경보':   '🚨',
  '에어컨 제어': '❄️',
  '컨베이어 안전': '⚙️',
  '자동 환기':   '🌀',
};
