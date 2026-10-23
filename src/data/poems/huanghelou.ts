import type { Poem } from '../types'

// 李白〈黃鶴樓送孟浩然之廣陵〉 — 黃鶴樓는 원문에 나오는 건축물이므로 기본 풍경에 둔다.
export const huanghelou: Poem = {
  id: 'huanghelou',
  title: '黃鶴樓送孟浩然之廣陵',
  poetId: 'libai',
  era: '唐',
  form: '七言絶句',
  lines: ['故人西辭黃鶴樓', '煙花三月下揚州', '孤帆遠影碧空盡', '唯見長江天際流'],
  translation: [
    '오랜 벗이 서쪽 황학루를 작별하고',
    '꽃 안개 자욱한 삼월에 양주로 내려간다.',
    '외로운 돛의 먼 그림자가 푸른 하늘 끝으로 사라지고',
    '오직 장강만이 하늘 끝으로 흘러가는 것이 보인다.',
  ],
  commentary:
    '이백이 무창(武昌)의 황학루에서 광릉, 곧 양주로 떠나는 맹호연(孟浩然)을 배웅하며 지은 칠언절구이다. 앞의 두 구는 이별의 장소와 때를, 뒤의 두 구는 멀어지는 돛을 끝까지 바라보는 시선을 그려, 이별의 정을 직접 말하지 않고 풍경으로 드러낸다. 3구는 판본에 따라 ‘碧山盡’으로 된 것도 있다.',
  scenes: [{ id: 'huanghelou-main', background: 'huanghelou', from: 0, to: 3 }],
  questions: [
    {
      line: '故人西辭黃鶴樓',
      prompt: '누가 황학루를 떠나고 있을까?',
      choices: [
        { label: '창을 든 군사들', sprite: 'hh_soldiers' },
        { label: '수레를 끄는 장사꾼', sprite: 'hh_merchant' },
        { label: '오랜 벗', sprite: 'hh_friend', correct: true },
      ],
      explanation: '‘故人’은 오랜 벗으로, 여기서는 맹호연이 황학루를 작별하고 배에 오르려 한다.',
      hint: '‘故人’의 뜻을 생각해 보세요.',
      acquire: '떠나는 벗',
    },
    {
      line: '煙花三月下揚州',
      prompt: '벗이 떠나는 때는 어떤 계절일까?',
      choices: [
        { label: '꽃 안개 자욱한 봄', sprite: 'hh_spring', correct: true },
        { label: '낙엽 지는 가을', sprite: 'hh_autumn' },
        { label: '눈 내리는 겨울', sprite: 'hh_winter' },
      ],
      explanation: '‘煙花’는 안개처럼 자욱하게 핀 꽃, ‘三月’은 늦봄으로, 꽃이 한창인 봄날에 양주로 내려간다.',
      hint: '‘花’와 ‘三月’을 함께 보세요.',
      acquire: '꽃 안개 낀 봄',
    },
    {
      line: '孤帆遠影碧空盡',
      prompt: '벗이 탄 배는 어떻게 멀어질까?',
      choices: [
        { label: '외로운 돛이 하늘 끝으로 사라짐', sprite: 'hh_sail_vanish', correct: true },
        { label: '여러 배가 함께 떠남', sprite: 'hh_convoy' },
        { label: '배가 다시 돌아옴', sprite: 'hh_sail_return' },
      ],
      explanation: '‘孤帆’은 외로운 돛, ‘碧空盡’은 푸른 하늘 끝에서 다한다는 뜻으로, 돛 그림자가 작아지다가 하늘가로 사라진다.',
      hint: '‘孤’와 ‘盡’을 함께 보세요.',
      acquire: '사라지는 외로운 돛',
    },
    {
      line: '唯見長江天際流',
      prompt: '배가 사라진 뒤 무엇만 보일까?',
      choices: [
        { label: '강을 가득 메운 배들', sprite: 'hh_boats_many' },
        { label: '모든 것을 가린 짙은 안개', sprite: 'hh_fog' },
        { label: '하늘 끝까지 흐르는 장강', sprite: 'hh_river_flow', correct: true },
      ],
      explanation: '‘唯見’은 오직 ~만 보인다는 뜻으로, 벗의 배가 사라진 자리에 하늘 끝까지 흐르는 장강만 남는다.',
      hint: '‘唯見’ 다음에 오는 말을 보세요.',
      acquire: '하늘 끝으로 흐르는 장강',
    },
  ],
}
