import type { Poem } from '../types'

// 杜甫〈登高〉 — 첫 번째 레벨
// 1~4구: 경물 묘사 중심 / 5~8구: 의미 표현과 인물 상태 변화 (시범 문제)
// 5구의 행낭(traveler_bag)은 원문에 직접 나오는 사물이 아니라 게임용 상징 소품이다.
// 원문에 아침·낮·저녁의 순차적 변화가 없으므로 단일 장면으로 구성한다.

export const denggao: Poem = {
  id: 'denggao',
  title: '登高',
  poetId: 'dufu',
  era: '唐',
  form: '七言律詩',
  lines: [
    '風急天高猿嘯哀',
    '渚清沙白鳥飛回',
    '無邊落木蕭蕭下',
    '不盡長江滾滾來',
    '萬里悲秋常作客',
    '百年多病獨登臺',
    '艱難苦恨繁霜鬢',
    '潦倒新停濁酒杯',
  ],
  translation: [
    '바람은 세차고 하늘은 높은데 원숭이 울음소리 애달프고',
    '물가는 맑고 모래는 흰데 새는 날며 맴돈다.',
    '끝없이 잎 지는 나무에서는 우수수 낙엽이 떨어지고',
    '다함없는 장강은 세차게 굽이치며 밀려온다.',
    '만 리 타향에서 슬픈 가을을 맞으며 늘 나그네 신세이고',
    '한평생 병 많은 몸으로 홀로 누대에 오른다.',
    '온갖 고난과 쓰라린 한에 귀밑머리는 서리처럼 세었고',
    '쇠락하고 초라해진 몸이라 요즈음 탁주잔마저 내려놓았다.',
  ],
  commentary:
    '두보가 만년에 기주(夔州)에 머물던 시기의 가을에 지은 칠언율시로 알려져 있다. 앞의 네 구는 높은 곳에 올라 바라본 가을 강가의 경물을 그리고, 뒤의 네 구는 오래 떠도는 처지와 병들고 늙은 몸에 대한 감회를 담았다. 게임에서는 앞의 네 구를 경물로, 뒤의 네 구를 인물과 소품의 상태 변화로 옮겼다.',
  scenes: [{ id: 'denggao-main', background: 'denggao', from: 0, to: 7 }],
  questions: [
    {
      line: '風急天高猿嘯哀',
      prompt: '바람은 어떤 상태일까?',
      choices: [
        { label: '잔잔한 미풍', sprite: 'wind_gentle' },
        { label: '거센 바람', sprite: 'wind_strong', correct: true },
        { label: '바람 없는 하늘', sprite: 'wind_none' },
      ],
      explanation: '‘風急’은 바람이 세차게 몰아친다는 뜻이어서, 높은 가을 하늘 아래 나뭇가지가 크게 휘어진다.',
      hint: '‘急’이 바람의 어떤 성질을 말하는지 다시 보세요.',
      acquire: '강풍',
    },
    {
      line: '渚清沙白鳥飛回',
      prompt: '새는 어떻게 날고 있을까?',
      choices: [
        { label: '모래톱에 앉아 있음', sprite: 'bird_resting' },
        { label: '곧장 멀리 날아감', sprite: 'bird_flying' },
        { label: '물가 위를 선회함', sprite: 'bird_circling', correct: true },
      ],
      explanation: '‘飛回’는 새가 날며 맴도는 모습으로, 맑은 물가와 흰 모래톱 위를 빙빙 돌고 있다.',
      hint: '‘回’라는 글자에 주목해 보세요.',
      acquire: '선회하는 새',
    },
    {
      line: '無邊落木蕭蕭下',
      prompt: '나무에서 어떤 일이 일어날까?',
      choices: [
        { label: '꽃이 피어남', sprite: 'leaves_bloom' },
        { label: '낙엽이 끝없이 떨어짐', sprite: 'leaves_falling', correct: true },
        { label: '새싹이 돋아남', sprite: 'leaves_sprouting' },
      ],
      explanation: '‘落木’은 잎 지는 나무, ‘蕭蕭’는 잎이 떨어지는 쓸쓸한 소리로, 끝없는 숲에서 낙엽이 우수수 진다.',
      hint: '‘落’과 ‘下’가 무엇을 가리키는지 생각해 보세요.',
      acquire: '낙엽',
    },
    {
      line: '不盡長江滾滾來',
      prompt: '강물은 어떻게 흐르고 있을까?',
      choices: [
        { label: '끝없이 밀려오는 물결', sprite: 'river_rolling', correct: true },
        { label: '얼어붙은 강물', sprite: 'river_frozen' },
        { label: '고요하게 멈춘 수면', sprite: 'river_calm' },
      ],
      explanation: '‘滾滾’은 물이 세차게 굽이치며 흐르는 모양으로, 다함없는 장강이 이쪽으로 끝없이 밀려온다.',
      hint: '‘滾滾’과 ‘來’가 그리는 물의 움직임을 떠올려 보세요.',
      acquire: '밀려오는 강물',
    },
    {
      line: '萬里悲秋常作客',
      prompt: '시인은 어떤 처지에 있을까?',
      choices: [
        { label: '고향에서 평온하게 지냄', sprite: 'home_house' },
        { label: '먼 타향을 떠도는 나그네', sprite: 'traveler_bag', correct: true },
        { label: '손님을 맞이하는 집주인', sprite: 'host_house' },
      ],
      explanation: '‘作客’은 타향에서 나그네 노릇을 한다는 말로, 시인은 고향에서 만 리 떨어진 곳에서 가을을 맞고 있다.',
      hint: '‘作客’의 ‘客’이 누구를 가리키는지 생각해 보세요.',
      acquire: '여행 행낭',
      note: '행낭은 원문에 직접 나오는 사물이 아니라, 나그네의 처지를 나타내기 위한 게임 속 상징 소품입니다.',
    },
    {
      line: '百年多病獨登臺',
      prompt: '높은 누대에는 누가 올라와 있을까?',
      choices: [
        { label: '홀로 올라온 시인', sprite: 'poet_alone', correct: true },
        { label: '함께 놀러 온 친구들', sprite: 'friends_two' },
        { label: '술잔을 나누는 여러 문인', sprite: 'literati_group' },
      ],
      explanation: '‘百年’은 한평생, ‘多病’은 잦은 병을 뜻하며, 시인은 병든 몸으로 ‘獨’, 곧 홀로 누대에 올랐다.',
      hint: '‘獨’이라는 글자를 다시 보세요.',
      acquire: '홀로 선 시인',
    },
    {
      line: '艱難苦恨繁霜鬢',
      prompt: '시인의 귀밑머리는 어떤 모습일까?',
      choices: [
        { label: '눈이 내려 쌓여 있음', sprite: 'hair_snow' },
        { label: '검고 윤기가 흐름', sprite: 'hair_black' },
        { label: '서리처럼 희어져 있음', sprite: 'poet_white_hair', correct: true },
      ],
      explanation: '‘繁霜鬢’은 서리가 짙게 내린 듯 하얗게 센 귀밑머리로, 고난과 한이 쌓인 세월을 보여 준다.',
      hint: '‘霜’이 무엇을 비유하는지 생각해 보세요.',
      acquire: '흰 귀밑머리',
    },
    {
      line: '潦倒新停濁酒杯',
      prompt: '시인은 술을 어떻게 하고 있을까?',
      choices: [
        { label: '술을 따라 마심', sprite: 'drinking' },
        { label: '술잔을 내려놓고 마시지 않음', sprite: 'wine_cup_stopped', correct: true },
        { label: '다른 사람과 건배함', sprite: 'toasting' },
      ],
      explanation: '‘新停’은 요즈음 막 그만두었다는 뜻으로, 쇠락하고 초라해진 시인은 탁주잔마저 내려놓았다.',
      hint: '‘停’의 뜻을 다시 생각해 보세요.',
      acquire: '내려놓은 탁주잔',
    },
  ],
}
