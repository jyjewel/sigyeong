import type { Poem } from '../types'

// 杜甫〈旅夜書懷〉 — 1~4구는 밤 강의 경물, 5~8구는 소품과 배의 상태 변화로 옮겼다.
export const lvye: Poem = {
  id: 'lvyeshuhuai',
  title: '旅夜書懷',
  poetId: 'dufu',
  era: '唐',
  form: '五言律詩',
  lines: ['細草微風岸', '危檣獨夜舟', '星垂平野闊', '月湧大江流', '名豈文章著', '官應老病休', '飄飄何所似', '天地一沙鷗'],
  translation: [
    '가는 풀 위로 산들바람 부는 강 언덕,',
    '높은 돛대 세운 배 한 척이 밤에 홀로 떠 있다.',
    '별은 드리워 들판이 드넓고',
    '달은 솟구치며 큰 강이 흘러간다.',
    '이름이 어찌 문장으로 드러나겠는가,',
    '벼슬은 늙고 병들었으니 그만둠이 마땅하리라.',
    '정처 없이 떠도는 이 몸은 무엇과 같은가,',
    '하늘과 땅 사이 한 마리 갈매기로다.',
  ],
  commentary:
    '두보가 만년에 촉(蜀)을 떠나 장강을 따라 내려가던 무렵의 작품으로 보는 견해가 많은 오언율시이다. 앞의 네 구는 배 위에서 본 밤 강의 넓고 고요한 풍경을, 뒤의 네 구는 이루지 못한 이름과 벼슬, 떠도는 신세에 대한 탄식을 담았다. 마지막 구의 갈매기는 넓은 천지 속 시인의 외로운 모습을 비유한다.',
  scenes: [{ id: 'lvye-main', background: 'lvye', from: 0, to: 7 }],
  questions: [
    {
      line: '細草微風岸',
      prompt: '강 언덕의 풀은 어떤 모습일까?',
      choices: [
        { label: '억센 갈대가 폭풍에 꺾임', sprite: 'ly_reeds_storm' },
        { label: '가는 풀이 산들바람에 흔들림', sprite: 'ly_grass_gentle', correct: true },
        { label: '풀 한 포기 없는 자갈밭', sprite: 'ly_bank_bare' },
      ],
      explanation: '‘細草’는 가는 풀, ‘微風’은 산들바람으로, 고요한 밤 강 언덕의 풀이 가볍게 흔들린다.',
      hint: '‘細’와 ‘微’가 무엇을 꾸미는지 보세요.',
      acquire: '산들바람 부는 풀',
    },
    {
      line: '危檣獨夜舟',
      prompt: '밤의 강에는 무엇이 떠 있을까?',
      choices: [
        { label: '등불 밝힌 배 여러 척', sprite: 'ly_fleet' },
        { label: '노 젓는 작은 나룻배', sprite: 'ly_ferry' },
        { label: '높은 돛대의 배 한 척', sprite: 'ly_boat_mast', correct: true },
      ],
      explanation: '‘危檣’은 높이 솟은 돛대, ‘獨夜舟’는 밤에 홀로 떠 있는 배로, 시인이 탄 배를 가리킨다.',
      hint: '‘危’와 ‘獨’을 함께 보세요.',
      acquire: '높은 돛대의 외로운 배',
    },
    {
      line: '星垂平野闊',
      prompt: '별은 어떻게 보일까?',
      choices: [
        { label: '넓은 들판 끝까지 낮게 드리움', sprite: 'ly_stars_low', correct: true },
        { label: '구름에 가려 보이지 않음', sprite: 'ly_clouds' },
        { label: '별똥별이 쏟아짐', sprite: 'ly_meteors' },
      ],
      explanation: '‘星垂’는 별이 드리운다는 뜻으로, 지평선 가까이까지 별이 내려와 보일 만큼 들판이 드넓다.',
      hint: '‘垂’와 ‘闊’의 관계를 생각해 보세요.',
      acquire: '들판에 드리운 별',
    },
    {
      line: '月湧大江流',
      prompt: '달은 강물 위에서 어떻게 보일까?',
      choices: [
        { label: '달이 지고 강이 캄캄함', sprite: 'ly_moon_none' },
        { label: '달빛이 물결과 함께 솟구침', sprite: 'ly_moon_surge', correct: true },
        { label: '얼어붙은 강에 달이 고요함', sprite: 'ly_moon_ice' },
      ],
      explanation: '‘月湧’은 달이 솟구친다는 뜻으로, 흘러가는 큰 강의 물결 위에서 달빛이 출렁이며 솟아오르는 듯하다.',
      hint: '‘湧’과 ‘流’가 그리는 움직임을 떠올려 보세요.',
      acquire: '물결에 솟구치는 달',
    },
    {
      line: '名豈文章著',
      prompt: '시인은 문장과 이름을 어떻게 여길까?',
      choices: [
        { label: '문장으로 이름났다고 자랑함', sprite: 'ly_scroll_proud' },
        { label: '과거에 장원 급제함', sprite: 'ly_exam' },
        { label: '문장으로 어찌 이름나겠냐며 낮춤', sprite: 'ly_scroll_humble', correct: true },
      ],
      explanation: '‘豈’는 ‘어찌 ~하겠는가’라는 반어로, 이름이 어찌 문장으로 드러나겠느냐며 스스로를 낮추는 말이다.',
      hint: '‘豈’가 어떤 어조를 만드는지 보세요.',
      acquire: '말아 둔 두루마리',
      note: '5~8구는 의미를 소품과 상태 변화로 옮긴 시범 문제입니다. 두루마리는 원문에 직접 나오는 사물이 아니라 ‘文章’을 나타내는 상징 소품입니다.',
    },
    {
      line: '官應老病休',
      prompt: '시인의 벼슬은 어떻게 되었을까?',
      choices: [
        { label: '늙고 병들어 벼슬을 내려놓음', sprite: 'ly_hat_down', correct: true },
        { label: '붉은 관복을 입고 승진함', sprite: 'ly_promoted' },
        { label: '새 관인(官印)을 받음', sprite: 'ly_seal' },
      ],
      explanation: '‘應’은 ‘마땅히 ~하리라’는 뜻으로, 벼슬은 늙고 병들었으니 그만둠이 마땅하다고 짐짓 체념하듯 말한다.',
      hint: '‘老病’과 ‘休’를 함께 보세요.',
      acquire: '내려놓은 관모',
      note: '관모는 원문에 직접 나오는 사물이 아니라 ‘官’을 나타내는 상징 소품입니다.',
    },
    {
      line: '飄飄何所似',
      prompt: '시인의 배는 어떻게 움직이고 있을까?',
      choices: [
        { label: '닻을 내리고 굳게 멈춤', sprite: 'ly_anchored' },
        { label: '정처 없이 이리저리 떠다님', sprite: 'ly_drifting', correct: true },
        { label: '노를 저어 곧장 나아감', sprite: 'ly_rowing' },
      ],
      explanation: '‘飄飄’는 바람에 날리듯 정처 없이 떠도는 모양으로, 이리저리 흘러 다니는 시인의 신세를 말한다.',
      hint: '‘飄飄’가 그리는 모양을 떠올려 보세요.',
      acquire: '정처 없이 떠도는 배',
    },
    {
      line: '天地一沙鷗',
      prompt: '천지 사이의 시인은 무엇과 같을까?',
      choices: [
        { label: '모래톱 위 갈매기 한 마리', sprite: 'ly_gull_one', correct: true },
        { label: '떼 지어 나는 기러기', sprite: 'ly_geese' },
        { label: '짝지어 나는 제비 한 쌍', sprite: 'ly_swallows' },
      ],
      explanation: '‘一沙鷗’는 모래톱의 갈매기 한 마리로, 넓은 하늘과 땅 사이를 홀로 떠도는 시인 자신을 비유한다.',
      hint: '‘一’이라는 글자에 주목해 보세요.',
      acquire: '한 마리 갈매기',
    },
  ],
}
