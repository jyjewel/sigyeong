import type { Poem } from '../types'

// 李白〈靜夜思〉 — 『唐詩三百首』 통행본(床前明月光 / 舉頭望明月)을 따른다.
export const jingyesi: Poem = {
  id: 'jingyesi',
  title: '靜夜思',
  poetId: 'libai',
  era: '唐',
  form: '五言絶句',
  lines: ['床前明月光', '疑是地上霜', '舉頭望明月', '低頭思故鄉'],
  translation: [
    '침상 앞에 밝은 달빛이 비치니',
    '땅에 내린 서리인가 싶다.',
    '고개 들어 밝은 달을 바라보다가',
    '고개 숙여 고향을 생각한다.',
  ],
  commentary:
    '고요한 밤 달빛을 보며 고향을 그리는 마음을 담은 오언절구이다. 『唐詩三百首』를 비롯한 통행본은 ‘床前明月光’, ‘舉頭望明月’로 쓰지만, 송대 판본 계통의 이백 문집에는 ‘床前看月光’, ‘舉頭望山月’로 되어 있어 글자에 차이가 있다. 게임은 통행본을 따랐다.',
  scenes: [{ id: 'jingyesi-main', background: 'jingyesi', from: 0, to: 3 }],
  questions: [
    {
      line: '床前明月光',
      prompt: '침상 앞에는 무엇이 비치고 있을까?',
      choices: [
        { label: '아침 햇살', sprite: 'jy_sunlight' },
        { label: '밝은 달빛', sprite: 'jy_moonlight', correct: true },
        { label: '흔들리는 촛불 빛', sprite: 'jy_candle' },
      ],
      explanation: '‘明月光’은 밝은 달빛으로, 고요한 밤 침상 앞 바닥에 달빛이 하얗게 비쳐 든다.',
      hint: '‘月’이라는 글자를 다시 보세요.',
      acquire: '침상 앞의 달빛',
      note: '‘床’을 침상이 아니라 우물 난간(井欄)으로 보는 해석도 있습니다. 게임에서는 침상으로 그렸습니다.',
    },
    {
      line: '疑是地上霜',
      prompt: '시인은 그 빛을 무엇으로 착각했을까?',
      choices: [
        { label: '땅에 내린 서리', sprite: 'jy_frost', correct: true },
        { label: '바닥에 쏟아진 물', sprite: 'jy_puddle' },
        { label: '흩어진 흰 꽃잎', sprite: 'jy_petals' },
      ],
      explanation: '‘疑是’는 ‘~인가 의심하다’는 뜻으로, 바닥에 깔린 하얀 달빛을 땅에 내린 서리로 착각한 것이다.',
      hint: '‘霜’이라는 글자를 찾아보세요.',
      acquire: '서리 같은 달빛',
    },
    {
      line: '舉頭望明月',
      prompt: '시인은 어떤 자세로 있을까?',
      choices: [
        { label: '고개 숙여 책을 읽음', sprite: 'jy_reading' },
        { label: '누워서 잠이 듦', sprite: 'jy_sleeping' },
        { label: '고개를 들어 달을 바라봄', sprite: 'jy_look_up', correct: true },
      ],
      explanation: '‘舉頭’는 고개를 든다는 뜻으로, 서리 같은 빛에 이끌려 고개를 들어 창밖의 밝은 달을 바라본다.',
      hint: '‘舉頭’와 ‘望’을 함께 보세요.',
      acquire: '달을 바라보는 시인',
    },
    {
      line: '低頭思故鄉',
      prompt: '고개를 숙인 시인은 무엇을 떠올릴까?',
      choices: [
        { label: '두고 온 고향', sprite: 'jy_think_home', correct: true },
        { label: '내일 열릴 잔치', sprite: 'jy_think_feast' },
        { label: '높은 벼슬자리', sprite: 'jy_think_office' },
      ],
      explanation: '‘低頭’는 고개를 숙인다는 뜻으로, 같은 달이 비출 고향을 생각하며 시인은 고개를 떨군다.',
      hint: '‘故鄉’의 뜻을 생각해 보세요.',
      acquire: '고향 생각',
    },
  ],
}
