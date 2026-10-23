import type { Poem } from '../types'

// 王維〈山居秋暝〉 — 비 갠 가을 저녁의 산 마을. 7~8구는 의미를 상태 변화로 옮긴 시범 문제.
export const shanju: Poem = {
  id: 'shanjuqiuming',
  title: '山居秋暝',
  poetId: 'wangwei',
  era: '唐',
  form: '五言律詩',
  lines: ['空山新雨後', '天氣晚來秋', '明月松間照', '清泉石上流', '竹喧歸浣女', '蓮動下漁舟', '隨意春芳歇', '王孫自可留'],
  translation: [
    '빈 산에 비가 막 그친 뒤,',
    '날씨는 저물녘 들어 가을 기운이 완연하다.',
    '밝은 달은 소나무 사이로 비치고',
    '맑은 샘물은 바위 위로 흐른다.',
    '대숲이 떠들썩하니 빨래하던 여인들이 돌아가고',
    '연잎이 흔들리니 고깃배가 내려간다.',
    '봄꽃이야 제멋대로 다 져도 좋으니',
    '왕손은 스스로 이곳에 머물 만하다.',
  ],
  commentary:
    '왕유가 망천 일대에 은거하던 시기의 작품으로 알려진 오언율시이다. 비 갠 가을 저녁 산속의 맑은 경물과 그 속에서 살아가는 사람들의 모습을 그린 뒤, 마지막 두 구에서 이곳에 머물겠다는 뜻을 밝힌다. 끝 구는 『楚辭』 「招隱士」의 ‘王孫兮歸來, 山中兮不可以久留’를 뒤집어 쓴 것으로 풀이된다.',
  scenes: [{ id: 'shanju-main', background: 'shanju', from: 0, to: 7 }],
  questions: [
    {
      line: '空山新雨後',
      prompt: '빈 산은 지금 어떤 상태일까?',
      choices: [
        { label: '장대비가 한창 쏟아짐', sprite: 'sj_heavy_rain' },
        { label: '가뭄으로 메마름', sprite: 'sj_drought' },
        { label: '비가 막 그쳐 촉촉함', sprite: 'sj_after_rain', correct: true },
      ],
      explanation: '‘新雨後’는 비가 막 그친 뒤라는 뜻으로, 잎끝마다 빗방울이 맺힌 맑고 촉촉한 산이다.',
      hint: '‘後’라는 글자를 다시 보세요.',
      acquire: '비 갠 뒤의 물기',
    },
    {
      line: '天氣晚來秋',
      prompt: '저물녘 날씨는 어떤 계절을 느끼게 할까?',
      choices: [
        { label: '서늘한 가을', sprite: 'sj_autumn', correct: true },
        { label: '무더운 여름', sprite: 'sj_summer' },
        { label: '매서운 겨울', sprite: 'sj_winter' },
      ],
      explanation: '‘晚來秋’는 저물녘이 되자 가을 기운이 짙어졌다는 뜻으로, 나뭇잎이 물들고 서늘한 안개가 깔린다.',
      hint: '‘秋’라는 글자를 찾아보세요.',
      acquire: '저물녘의 가을 기운',
    },
    {
      line: '明月松間照',
      prompt: '소나무 사이로 무엇이 비칠까?',
      choices: [
        { label: '한낮의 햇빛', sprite: 'sj_sun' },
        { label: '밝은 달빛', sprite: 'sj_moon', correct: true },
        { label: '사람들의 횃불', sprite: 'sj_torches' },
      ],
      explanation: '‘明月’은 밝은 달로, 비 갠 하늘에 뜬 달이 소나무 가지 사이로 맑게 비친다.',
      hint: '‘明月’의 뜻을 생각해 보세요.',
      acquire: '소나무 사이의 달',
    },
    {
      line: '清泉石上流',
      prompt: '맑은 샘물은 어떻게 흐를까?',
      choices: [
        { label: '바위 위로 흘러감', sprite: 'sj_stream', correct: true },
        { label: '얼어붙어 멈춤', sprite: 'sj_stream_frozen' },
        { label: '말라서 물이 없음', sprite: 'sj_stream_dry' },
      ],
      explanation: '‘石上流’는 바위 위로 흐른다는 뜻으로, 비 온 뒤 불어난 맑은 샘물이 바위를 타고 흘러간다.',
      hint: '‘流’의 뜻을 생각해 보세요.',
      acquire: '바위 위로 흐르는 샘물',
    },
    {
      line: '竹喧歸浣女',
      prompt: '대숲이 떠들썩한 까닭은 무엇일까?',
      choices: [
        { label: '장터로 가는 상인들', sprite: 'sj_merchants' },
        { label: '빨래하고 돌아가는 여인들', sprite: 'sj_washers', correct: true },
        { label: '사냥 나온 사냥꾼들', sprite: 'sj_hunters' },
      ],
      explanation: '‘浣女’는 빨래하는 여인들로, 빨래를 마치고 돌아가는 이들의 말소리에 대숲이 떠들썩하다.',
      hint: '‘浣’은 빨래한다는 뜻입니다.',
      acquire: '돌아가는 빨래하던 여인들',
    },
    {
      line: '蓮動下漁舟',
      prompt: '연잎이 흔들리는 까닭은 무엇일까?',
      choices: [
        { label: '오리 떼가 헤엄쳐서', sprite: 'sj_ducks' },
        { label: '다시 비가 내려서', sprite: 'sj_rain_lotus' },
        { label: '고깃배가 내려가서', sprite: 'sj_fishing_boat', correct: true },
      ],
      explanation: '‘下漁舟’는 고깃배가 물길을 따라 내려간다는 뜻으로, 그 배가 지나가며 연잎을 흔든다.',
      hint: '‘漁舟’를 찾아보세요.',
      acquire: '내려가는 고깃배',
    },
    {
      line: '隨意春芳歇',
      prompt: '봄꽃은 어떻게 되었을까?',
      choices: [
        { label: '봄꽃이 만발함', sprite: 'sj_blossom' },
        { label: '꽃을 꺾어 병에 꽂음', sprite: 'sj_vase' },
        { label: '제멋대로 다 져 버림', sprite: 'sj_petals_gone', correct: true },
      ],
      explanation: '‘歇’은 다한다는 뜻이고 ‘隨意’는 제멋대로 하라는 말로, 봄꽃이야 다 져도 상관없다는 뜻이다.',
      hint: '‘歇’의 뜻을 생각해 보세요.',
      acquire: '다 져 버린 봄꽃',
    },
    {
      line: '王孫自可留',
      prompt: '王孫은 어떻게 할 수 있을까?',
      choices: [
        { label: '스스로 이곳에 머묾', sprite: 'sj_stay', correct: true },
        { label: '서둘러 산을 떠남', sprite: 'sj_leave' },
        { label: '말을 타고 조정으로 감', sprite: 'sj_court' },
      ],
      explanation: '‘自可留’는 스스로 머물 만하다는 뜻으로, 가을 산의 경치가 좋으니 이곳에 남겠다는 뜻을 밝힌다.',
      hint: '‘留’의 뜻을 생각해 보세요.',
      acquire: '산에 머무는 사람',
      note: '‘王孫’은 『楚辭』 「招隱士」에서 산속에 오래 머물지 말고 돌아오라고 부르던 대상입니다. 이 구는 그 말을 뒤집어, 머물러도 좋다고 말합니다.',
    },
  ],
}
