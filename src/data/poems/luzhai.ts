import type { Poem } from '../types'

// 王維〈鹿柴〉 — 『輞川集』 연작 가운데 한 수. 해·사람을 직접 그리지 않고 빛과 소리로만 표현한다.
export const luzhai: Poem = {
  id: 'luzhai',
  title: '鹿柴',
  poetId: 'wangwei',
  era: '唐',
  form: '五言絶句',
  lines: ['空山不見人', '但聞人語響', '返景入深林', '復照青苔上'],
  translation: [
    '빈 산에 사람은 보이지 않고',
    '다만 사람 말소리만 울려 온다.',
    '저녁 햇빛이 깊은 숲에 들어와',
    '다시 푸른 이끼 위를 비춘다.',
  ],
  commentary:
    '왕유가 망천(輞川) 별장 일대의 명소를 읊은 『輞川集』 스무 수 가운데 한 수이다. 녹시(鹿柴)는 별장 안의 지명이다. 보이지 않는 사람과 들리는 말소리, 깊은 숲에 잠깐 비쳐 드는 저녁 빛을 맞세워 산의 고요함을 오히려 더 깊게 느끼게 한다.',
  scenes: [{ id: 'luzhai-main', background: 'luzhai', from: 0, to: 3 }],
  questions: [
    {
      line: '空山不見人',
      prompt: '산에는 사람이 보일까?',
      choices: [
        { label: '나무하는 나무꾼', sprite: 'lz_woodcutter' },
        { label: '텅 빈 산, 사람이 보이지 않음', sprite: 'lz_empty', correct: true },
        { label: '산을 오르는 여러 사람', sprite: 'lz_hikers' },
      ],
      explanation: '‘空山’은 텅 빈 산, ‘不見人’은 사람이 보이지 않는다는 뜻으로, 안개만 고요히 흐르는 깊은 산이다.',
      hint: '‘不見’의 뜻을 생각해 보세요.',
      acquire: '고요한 빈 산',
    },
    {
      line: '但聞人語響',
      prompt: '그런데 무엇이 들려올까?',
      choices: [
        { label: '어디선가 사람 말소리', sprite: 'lz_voices', correct: true },
        { label: '우렁찬 폭포 소리', sprite: 'lz_waterfall' },
        { label: '사슴 울음소리', sprite: 'lz_deer' },
      ],
      explanation: '‘但聞’은 다만 들린다는 뜻으로, 사람은 보이지 않고 숲 어딘가에서 말소리만 울려 온다.',
      hint: '‘人語’가 무엇인지 보세요.',
      acquire: '어디선가 들리는 말소리',
    },
    {
      line: '返景入深林',
      prompt: '저녁 햇빛은 어디로 들어올까?',
      choices: [
        { label: '구름 뒤로 숨어 버림', sprite: 'lz_clouded' },
        { label: '넓은 호수 위를 비춤', sprite: 'lz_lake_light' },
        { label: '깊은 숲속으로 비껴 듦', sprite: 'lz_rays', correct: true },
      ],
      explanation: '‘返景’은 저녁 무렵 되비치는 햇빛으로, 그 빛이 비스듬히 깊은 숲속까지 들어온다.',
      hint: '‘入深林’을 다시 보세요.',
      acquire: '숲에 비껴 드는 저녁 빛',
    },
    {
      line: '復照青苔上',
      prompt: '그 빛은 다시 무엇을 비출까?',
      choices: [
        { label: '푸른 이끼', sprite: 'lz_moss', correct: true },
        { label: '붉은 단풍잎', sprite: 'lz_maple' },
        { label: '하얀 눈', sprite: 'lz_snow' },
      ],
      explanation: '‘復照’는 다시 비춘다는 뜻으로, 숲에 든 저녁 빛이 바닥의 푸른 이끼 위에 잠시 머문다.',
      hint: '‘青苔’의 뜻을 생각해 보세요.',
      acquire: '빛을 받은 푸른 이끼',
    },
  ],
}
