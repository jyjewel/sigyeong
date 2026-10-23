import type { Poem } from '../types'

// 杜甫〈春望〉 — 1~4구는 경물, 5~8구는 소품과 인물의 상태 변화로 옮겼다.
export const chunwang: Poem = {
  id: 'chunwang',
  title: '春望',
  poetId: 'dufu',
  era: '唐',
  form: '五言律詩',
  lines: ['國破山河在', '城春草木深', '感時花濺淚', '恨別鳥驚心', '烽火連三月', '家書抵萬金', '白頭搔更短', '渾欲不勝簪'],
  translation: [
    '나라는 무너졌어도 산과 강은 그대로이고',
    '성에 봄이 오니 풀과 나무만 우거졌다.',
    '시절을 슬퍼하니 꽃을 보아도 눈물이 흩뿌려지고',
    '이별이 한스러우니 새소리에도 마음이 놀란다.',
    '봉화는 석 달 동안 이어지고',
    '집에서 온 편지는 만금만큼 귀하다.',
    '흰머리는 긁을수록 더 짧아져',
    '이제는 비녀조차 이기지 못할 지경이다.',
  ],
  commentary:
    '안녹산의 난으로 함락된 장안에 머물던 시기, 지덕(至德) 2년(757) 봄에 지은 것으로 알려진 오언율시이다. 앞의 네 구는 무너진 나라와 변함없는 자연을 맞세우고, 뒤의 네 구는 그치지 않는 전란과 가족 소식에 대한 갈망, 늙어 가는 몸을 차례로 그린다. 게임에서는 장안의 무너진 성벽을 기본 풍경으로 두었다.',
  scenes: [{ id: 'chunwang-main', background: 'chunwang', from: 0, to: 7 }],
  questions: [
    {
      line: '國破山河在',
      prompt: '나라가 무너진 뒤, 산과 강은 어떻게 되었을까?',
      choices: [
        { label: '산과 강도 무너져 사라짐', sprite: 'cw_land_ruined' },
        { label: '산과 강은 그대로 남아 있음', sprite: 'cw_land_intact', correct: true },
        { label: '산과 강이 불길에 휩싸임', sprite: 'cw_land_burning' },
      ],
      explanation: '‘國破’와 ‘山河在’가 맞서는 구로, 나라는 무너졌어도 산과 강만은 변함없이 남아 있다.',
      hint: '‘在’가 무엇을 뜻하는지 생각해 보세요.',
      acquire: '변함없는 산과 강',
    },
    {
      line: '城春草木深',
      prompt: '봄이 온 성은 어떤 모습일까?',
      choices: [
        { label: '풀과 나무만 무성하게 우거짐', sprite: 'cw_overgrown', correct: true },
        { label: '사람들로 북적이는 거리', sprite: 'cw_crowd' },
        { label: '눈 덮인 겨울 성', sprite: 'cw_snow' },
      ],
      explanation: '‘草木深’은 사람이 떠난 성에 풀과 나무만 깊이 우거졌다는 뜻으로, 봄이 왔어도 황폐한 장안을 보여 준다.',
      hint: '‘深’이 무엇을 꾸미는지 보세요.',
      acquire: '우거진 풀과 나무',
    },
    {
      line: '感時花濺淚',
      prompt: '시절을 슬퍼하는 마음에 꽃은 어떻게 보일까?',
      choices: [
        { label: '활짝 웃는 듯 피어 있음', sprite: 'cw_flowers_bright' },
        { label: '모두 시들어 떨어짐', sprite: 'cw_flowers_withered' },
        { label: '꽃 위로 눈물이 흩뿌려짐', sprite: 'cw_flowers_tears', correct: true },
      ],
      explanation: '‘濺淚’는 눈물을 흩뿌린다는 뜻으로, 시절을 슬퍼하는 마음에 아름다운 꽃을 보아도 눈물이 흐른다.',
      hint: '‘淚’라는 글자를 다시 보세요.',
      acquire: '눈물 젖은 꽃',
      note: '눈물을 흘리는 주체를 시인으로 보는 해석과 꽃으로 보는 해석이 모두 있습니다. 게임에서는 꽃 위에 눈물방울을 그렸습니다.',
    },
    {
      line: '恨別鳥驚心',
      prompt: '이별이 한스러운 마음에 새는 어떻게 느껴질까?',
      choices: [
        { label: '새소리에도 마음이 놀람', sprite: 'cw_bird_startle', correct: true },
        { label: '새가 평화롭게 노래함', sprite: 'cw_bird_sing' },
        { label: '새가 둥지에서 잠듦', sprite: 'cw_bird_sleep' },
      ],
      explanation: '‘驚心’은 마음을 놀라게 한다는 뜻으로, 가족과 헤어진 한 때문에 새가 날아오르는 소리에도 가슴이 철렁한다.',
      hint: '‘驚’의 뜻을 생각해 보세요.',
      acquire: '놀라 날아오르는 새',
    },
    {
      line: '烽火連三月',
      prompt: '봉화는 어떻게 타오르고 있을까?',
      choices: [
        { label: '축제의 불꽃놀이', sprite: 'cw_fireworks' },
        { label: '봉화가 끊이지 않고 이어짐', sprite: 'cw_beacons', correct: true },
        { label: '한 번 피었다가 꺼짐', sprite: 'cw_beacon_out' },
      ],
      explanation: '‘烽火’는 전쟁을 알리는 봉화이고 ‘連三月’은 석 달 동안 이어졌다는 뜻으로, 전란이 그치지 않음을 말한다.',
      hint: '‘連’이 어떤 상태를 말하는지 보세요.',
      acquire: '이어지는 봉화',
      note: '‘三月’을 ‘석 달’로 보는 해석과 ‘삼월까지’로 보는 해석이 있습니다.',
    },
    {
      line: '家書抵萬金',
      prompt: '집에서 온 편지는 얼마나 귀할까?',
      choices: [
        { label: '읽지 않고 버려짐', sprite: 'cw_letter_tossed' },
        { label: '편지가 산더미처럼 쌓임', sprite: 'cw_letter_pile' },
        { label: '만금만큼 귀함', sprite: 'cw_letter_gold', correct: true },
      ],
      explanation: '‘抵萬金’은 만금에 맞먹는다는 뜻으로, 전란 중에 좀처럼 오지 않는 집 편지가 그만큼 귀하다는 말이다.',
      hint: '‘萬金’이 무엇을 비유하는지 생각해 보세요.',
      acquire: '만금 같은 집 편지',
    },
    {
      line: '白頭搔更短',
      prompt: '시인의 흰머리는 어떻게 되었을까?',
      choices: [
        { label: '긁을수록 더 짧고 성글어짐', sprite: 'cw_poet_scratch', correct: true },
        { label: '검은 머리가 길게 자람', sprite: 'cw_poet_longhair' },
        { label: '머리를 곱게 빗어 올림', sprite: 'cw_poet_combed' },
      ],
      explanation: '‘搔’는 긁는다는 뜻으로, 근심에 흰머리를 긁을수록 머리카락이 더 짧고 성글어진다.',
      hint: '‘白頭’와 ‘短’을 함께 보세요.',
      acquire: '흰머리를 긁는 시인',
    },
    {
      line: '渾欲不勝簪',
      prompt: '성글어진 머리에 비녀는 어떻게 될까?',
      choices: [
        { label: '화려한 관을 씀', sprite: 'cw_crown' },
        { label: '비녀를 꽂지 못할 지경', sprite: 'cw_pin_falling', correct: true },
        { label: '비녀가 단단히 꽂혀 있음', sprite: 'cw_pin_firm' },
      ],
      explanation: '‘不勝簪’은 비녀를 이기지 못한다는 뜻으로, 머리숱이 줄어 이제는 비녀조차 꽂기 어려울 지경이다.',
      hint: '‘不勝’의 뜻을 생각해 보세요.',
      acquire: '빠져나가는 비녀',
    },
  ],
}
