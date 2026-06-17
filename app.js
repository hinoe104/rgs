'use strict';

// ===== カードデータ（全25枚確定版）=====
// 各辺: [シンボルID, 矢印方向]
const CARD_DATA = [
  { top:[19,"↓"], right:[36,"←"], bottom:[12,"↓"], left:[2,"←"] },   // 01 IMG_4534
  { top:[37,"↑"], right:[26,"↓"], bottom:[7,"→"],  left:[40,"↓"] },   // 02 IMG_4530
  { top:[9,"↑"],  right:[3,"→"],  bottom:[46,"↑"], left:[40,"←"] },   // 03 IMG_4522
  { top:[24,"↓"], right:[48,"→"], bottom:[30,"↑"], left:[41,"→"] },   // 04 IMG_4525
  { top:[1,"↓"],  right:[44,"→"], bottom:[45,"↑"], left:[34,"→"] },   // 05 IMG_4527
  { top:[38,"→"], right:[49,"↑"], bottom:[50,"→"], left:[39,"↓"] },   // 06 IMG_4532
  { top:[35,"↑"], right:[33,"→"], bottom:[45,"↑"], left:[27,"←"] },   // 07 IMG_4544
  { top:[15,"↓"], right:[23,"←"], bottom:[29,"↓"], left:[44,"←"] },   // 08 IMG_4541
  { top:[16,"↓"], right:[8,"→"],  bottom:[2,"↓"],  left:[11,"→"] },   // 09 IMG_4542
  { top:[5,"↑"],  right:[47,"→"], bottom:[14,"↑"], left:[20,"→"] },   // 10 IMG_4535
  { top:[42,"↓"], right:[33,"←"], bottom:[4,"↓"],  left:[43,"←"] },   // 11 IMG_4537
  { top:[4,"↓"],  right:[25,"→"], bottom:[17,"↑"], left:[6,"←"] },    // 12 IMG_4529
  { top:[1,"↓"],  right:[41,"→"], bottom:[19,"↑"], left:[32,"→"] },   // 13 IMG_4526
  { top:[42,"↑"], right:[14,"→"], bottom:[24,"↓"], left:[34,"→"] },   // 14 IMG_4528
  { top:[18,"↑"], right:[17,"→"], bottom:[36,"↑"], left:[30,"←"] },   // 15 IMG_4538
  { top:[8,"↓"],  right:[38,"←"], bottom:[15,"↓"], left:[32,"←"] },   // 16 IMG_4545
  { top:[28,"↑"], right:[46,"→"], bottom:[20,"↓"], left:[43,"→"] },   // 17 IMG_4543
  { top:[47,"↓"], right:[50,"→"], bottom:[13,"↑"], left:[48,"→"] },   // 18 IMG_4531
  { top:[31,"↑"], right:[37,"←"], bottom:[28,"↑"], left:[6,"→"] },    // 19 IMG_4536
  { top:[5,"↓"],  right:[3,"←"],  bottom:[23,"↓"], left:[39,"←"] },   // 20 IMG_4539
  { top:[21,"↓"], right:[27,"←"], bottom:[29,"↑"], left:[9,"→"] },    // 21 IMG_4546
  { top:[22,"↑"], right:[31,"←"], bottom:[18,"↑"], left:[13,"←"] },   // 22 IMG_4540
  { top:[12,"↓"], right:[25,"←"], bottom:[35,"↑"], left:[10,"→"] },   // 23 IMG_4524
  { top:[11,"↑"], right:[10,"→"], bottom:[21,"↓"], left:[7,"←"] },    // 24 IMG_4533
  { top:[49,"↑"], right:[16,"→"], bottom:[26,"↑"], left:[22,"→"] },   // 25 IMG_4523
];

const SYMBOL_NAMES = {
  1:'騎手', 2:'クローバー', 3:'船', 4:'家', 5:'薪', 6:'りんご', 7:'蛇', 8:'棺',
  9:'花束', 10:'鎌', 11:'枝', 12:'鳥', 13:'坊や', 14:'キツネ', 15:'熊', 16:'星',
  17:'コウノトリ', 18:'犬', 19:'お城', 20:'森', 21:'山', 22:'道', 23:'ネズミ',
  24:'ハート', 25:'指輪', 26:'本', 27:'手紙', 28:'蹄鉄', 29:'お金', 30:'百合',
  31:'太陽', 32:'月', 33:'魚', 34:'フクロウ', 35:'錨', 36:'握手', 37:'天使',
  38:'淑女', 39:'馬', 40:'結び目', 41:'猫', 42:'天秤', 43:'ザリガニ', 44:'焚き火',
  45:'豚', 46:'橋', 47:'悪魔', 48:'ニワトリ', 49:'ダガー', 50:'パン'
};

const DIR_LABELS = { '↓': '正位置', '→': '右向き', '↑': '逆位置', '←': '左向き' };

// シンボルID → 矢印 → 意味文（Garden/Grimoire/ロシアンジプシーフォーチュンテリングカード 意味一覧.md より）
const MEANINGS = {
  1:  { '↓':'心待ちにしていた、あるいは喜ばしい知らせが届く。', '→':'思いがけない吉報や、予期せぬ訪問者が幸運をもたらす。', '←':'期待外れの知らせ、あるいは失望を伴うメッセージ。', '↑':'不快な知らせ、あるいは望まない情報の到来。' },
  2:  { '↓':'幸福が訪れ、長年の願いが叶う。', '→':'些細な誤解が、幸福にわずかな影を落とす。', '←':'短期間の悲しみや困難が、最終的には良い結果へと繋がる。', '↑':'大きな悲しみや失望が訪れる可能性。' },
  3:  { '↓':'相続や投資の成功など、予期せぬ形で財産を得る。', '→':'ビジネスや労働を通じて、着実に富を築き上げる。', '←':'物理的な旅、あるいは精神的な探求の始まり。', '↑':'物質的な損失や、計画の頓挫。努力が報われない可能性。' },
  4:  { '↓':'家庭生活やビジネスにおいて、あらゆる面で成功を収める。', '→':'堅実な行動や正しい判断が、確実な成功へと導く。', '←':'身近な人間関係や環境に注意が必要。裏切りや不和の可能性。', '↑':'新しい計画や事業が失敗に終わる、あるいは困難に直面する。' },
  5:  { '↓':'健全な心身の状態。活力に満ちている。', '→':'病からの回復、あるいは失われた活力の再生。', '←':'軽微な体調不良や、一時的な活力の低下。', '↑':'身体的な損傷、あるいは深刻な病の兆候。' },
  6:  { '↓':'喜びをもたらす出来事や、実りある出会い。', '→':'予期せぬ幸運な出来事や、嬉しい贈り物が訪れる。', '←':'不快な人物との遭遇、あるいは望まない状況に直面する。', '↑':'近い将来、不愉快な出来事や困難が待ち受けている。' },
  7:  { '↓':'悪意ある人物からの、言葉による中傷や攻撃。', '→':'パートナーや信頼する人物からの裏切り。', '←':'欺瞞による、物質的または精神的な損失。', '↑':'他者からの激しい嫉妬、あるいは自分自身の嫉妬心が問題となる。' },
  8:  { '↓':'身体的な病、あるいは精神的な不調。', '→':'一時的な地位や財産の喪失、あるいは活力の低下。', '←':'避けられない不快な状況や、他者の支配下に置かれること。', '↑':'危機や危険を間一髪で回避する。' },
  9:  { '↓':'あらゆる面での大きな成功や達成。', '→':'予期せぬ報酬や金銭的な利益。', '←':'長年の希望や願いが叶う。', '↑':'新たな収入源や、金銭を得る方法を発見する。' },
  10: { '↓':'避けられない困難や、不運な運命に直面する。', '→':'重要な結果を伴う脅威や警告を受け取る。', '←':'危機的状況や大惨事を間一髪で回避する。', '↑':'争い、口論、あるいは人間関係の衝突。' },
  11: { '↓':'争いの後の和解、あるいは関係性の修復。', '→':'家族間での意見の対立や不和。', '←':'親しい人物との離別や関係性の終焉。', '↑':'悲しみや涙、あるいは他者からの攻撃。' },
  12: { '↓':'純粋な喜び、心躍る出来事の訪れ。', '→':'予期せぬ幸運、思いがけない吉報が舞い込む。', '←':'果たされない約束。他者への期待が裏切られる暗示。', '↑':'乗り越えるべき障害。自由を得るための試練。' },
  13: { '↓':'近い将来、新たな旅立ちや冒険が訪れる。', '→':'楽しい仲間との出会いや、充実した時間を過ごす機会。', '←':'新たな友情が芽生える可能性。', '↑':'予期せぬ出会いや、重要な約束が訪れる。' },
  14: { '↓':'巧妙な策略や欺瞞によって、騙されている状況。', '→':'隠されていた嘘や偽りが露見する。', '←':'新しい人間関係や友情には、慎重な姿勢が必要。', '↑':'特定の人物に対する過度な信頼は避けるべき。' },
  15: { '↓':'慎重に行動すれば、幸福は確実にもたらされる。', '→':'これまでの努力が報われ、良い結果に繋がる。', '←':'望むものはすぐに手に入らないが、最終的には達成される。', '↑':'他者からの助言を鵜呑みにせず、自身の判断を優先すべき。' },
  16: { '↓':'導きの星が目標達成へと導き、希望に満ちた未来を示す。', '→':'交渉や取引が成功し、良い結果をもたらす。', '←':'一時的に状況が見えなくなり、誤った判断を招く可能性。', '↑':'不運な出来事が続き、困難な状況に陥る。' },
  17: { '↓':'住居の変更や、新たな環境への移行。', '→':'予期せぬ状況により、新たな道や選択を迫られる。', '←':'友人関係における変化や、新たな展開。', '↑':'家族構成の変化、あるいは新しい家族の誕生。' },
  18: { '↓':'忠実で変わらぬ友情に恵まれる。', '→':'友人からの支援や助けが得られる。', '←':'友人と信じる人物が、実は不誠実である可能性。', '↑':'友人関係の変化や、新たな友情の始まり。' },
  19: { '↓':'人生の終わりに近づいても、希望が成就し、安らぎを得る。', '→':'老後の安定した生活や、安息の場所。', '←':'長く健康な人生を送る。', '↑':'長期にわたる問題や、慢性的な困難。' },
  20: { '↓':'多くの価値ある人々との、長く続く友情や関係。', '→':'多くの人々との交流や、心地よい目的を持った社会活動。', '←':'疑わしい人物との接触や、不穏な人間関係。', '↑':'陰謀や罠に注意が必要。' },
  21: { '↓':'危険な敵が迫っており、警戒が必要。', '→':'大きな困難や不快な状況が迫っているが、回避可能。', '←':'熟慮の末、困難な状況に対する正しい決断を下す。', '↑':'困難な状況において、力強い支援者が現れる。' },
  22: { '↓':'幸福に満ちた人生の道、あるいは順調な進路。', '→':'喜びや発見に満ちた旅、あるいは人生の楽しい局面。', '←':'孤独感や退屈を伴う道、あるいは単調な仕事。', '↑':'人生の進路における障害や困難。' },
  23: { '↓':'失われたものが見つかる、あるいは失われた価値が回復する。', '→':'予期せぬ形で何かを発見する、あるいは新たな価値を見出す。', '←':'盗難に遭う、あるいは何かが奪われる。', '↑':'失われたものが二度と戻らない、あるいは回復不能な損失。' },
  24: { '↓':'あなたの幸福は、愛する人との関係性の中にある。', '→':'新たな愛が芽生え、心に情熱の炎を灯す。', '←':'陽気さや喜びが常にあなたと共にあり、心を明るく保つ。', '↑':'親しい人々との間に、意見の一致や調和がある。' },
  25: { '↓':'結婚や重要な合意の成立。', '→':'裕福な相手との婚約や、有利な契約。', '←':'恋人や友人との関係が一時的に途切れる。', '↑':'愛し合う二人の関係が完全に終わる。' },
  26: { '↓':'秘密裏に行われる情報交換や、隠されたコミュニケーション。', '→':'あなたにとって重要な情報が、まだ隠されている状態。', '←':'あなたが預かっていた秘密が、公になる。', '↑':'軽率な発言や秘密の漏洩が、あなた自身に不利益をもたらす。' },
  27: { '↓':'遠方からの吉報や、幸福をもたらす知らせが届く。', '→':'興味を引く、あるいは予期せぬ情報がもたらされる。', '←':'長らく待ち望んでいた連絡や言葉を受け取る。', '↑':'悲しい知らせや、落胆する情報が届く。' },
  28: { '↓':'幸運が訪れ、良い機会に恵まれる。', '→':'近い将来、手がけるすべてのことが成功に導かれる。', '←':'長年の願いや希望が実現する。', '↑':'幸福を掴み損ねる、あるいは幸運を見過ごす。' },
  29: { '↓':'かなりの金額を受け取る、あるいは大きな経済的利益を得る。', '→':'事業において成功を収め、利益を得る。', '←':'予期せぬ形で、楽しい出来事や経済的な恩恵が訪れる。', '↑':'努力して稼いだお金を受け取るまでに、長い時間を要する。' },
  30: { '↓':'意義深く、幸福に満ちた人生を送る。', '→':'生涯を通じて、忠実さや誠実さを貫く。', '←':'現実離れした、あるいは精神的な高次の幸福を経験する。', '↑':'忠誠心に対する不必要な疑念や、嫉妬心に苛まれる。' },
  31: { '↓':'繁栄と幸福に満ちた人生。あらゆる面で恵まれる。', '→':'内なる光と温かさが、あなた自身の力となる。自己肯定感の向上。', '←':'勇気の欠如が、願いの実現を阻害する。', '↑':'冷たい心や無関心が、あなた自身を孤立させる。' },
  32: { '↓':'平穏な人生の中に、確かな幸福を見出す。', '→':'忍耐強く努力すれば、望むものを手に入れることができる。', '←':'一時的な困難や挫折に直面しても、希望を失わないこと。', '↑':'行動の遅れが、あなたにとって不利な状況を招く。' },
  33: { '↓':'特に水に関連する事柄で幸運に恵まれる。', '→':'成功を望むなら、状況に応じて柔軟なアプローチが必要。', '←':'商業活動や交流が利益を生む。', '↑':'困難な状況に陥っても、最終的には乗り越え浮上する。' },
  34: { '↓':'現状では賢明な行動を避けるべき時。', '→':'隠された計画や策略が露見する。', '←':'進行中の計画やプロジェクトが失敗に終わる。', '↑':'立てた計画が実現しない、あるいは頓挫する。' },
  35: { '↓':'愛情関係における成功。あなたは愛されている。', '→':'希望が実現し、特に海に関連する事柄で成功を収める。', '←':'理想に対する幻滅や、疑念が生じる。', '↑':'自身の過ちを正すことが困難な状況。' },
  36: { '↓':'生涯にわたる強い友情が、あなたを支える。', '→':'愛する人との間に、深く強固な絆が生まれる。', '←':'関係性を維持するには、努力と積極的な関わりが必要。', '↑':'関係性や協力関係が破綻する危険性。' },
  37: { '↓':'明るい未来と、望んでいた幸福があなたを待っている。', '→':'争いの和解が、あなたに喜びと安らぎをもたらす。', '←':'愛と優しさが、あなたの心を癒し、慰めとなる。', '↑':'天からの導きや力が、誤った選択からあなたを救う。' },
  38: { '↓':'優しい女性からの、タイムリーな支援や助け。', '→':'友人ではない人物からの助け。その裏には隠された愛情がある。', '←':'表面的な礼儀正さに騙されず、その裏にある真意を見抜くべき。', '↑':'利用された後、見捨てられる可能性。' },
  39: { '↓':'感情的な高揚、あるいはトラウマとなるような出来事を経験する。', '→':'魅力的な外見や美しさに心を奪われる。', '←':'感情や状況をしっかりと制御しないと、失敗する可能性。', '↑':'あなたの感情や尊厳が傷つけられる。' },
  40: { '↓':'生涯を通じて、強固な知識や経験を積み重ねてきた。', '→':'あなたを縛るものが、実は心地よい束縛である。', '←':'絡みつくような絆を断ち切り、自由になる。', '↑':'複雑に絡み合った問題は、大胆な決断によってのみ解決できる。' },
  41: { '↓':'誰かの甘い誘惑や魅力に屈してしまう。', '→':'友好的な態度の裏に隠された悪意や危険に警戒すべき。', '←':'傷つきながらも、尊厳を保ち感情を隠す。', '↑':'予期せぬ形で、深く傷つけられる。' },
  42: { '↓':'あなたの運命において、善が最終的に悪に打ち勝つ。', '→':'あなたの幸福は、あなた自身の決断に左右される。', '←':'バランスを保つことで、困難な状況から完全に抜け出すことができる。', '↑':'あなたの不正な行動が、悪い結果を招く。' },
  43: { '↓':'無謀な行動は後退を招く。慎重な姿勢が必要。', '→':'プライドが傷つくような出来事に直面する。', '←':'遅延や停滞は、運命によって定められたものである。', '↑':'過度な焦りや行動は、かえって物事を失敗させる。' },
  44: { '↓':'情熱に心を包まれる、燃え上がる感情の高まり。', '→':'夢中になりすぎて自分が傷つくことへの警告。', '←':'状況がすでに制御を失いかけている。今すぐ手放す・撤退する判断が必要。恋愛なら終わらせるべき、事業なら縮小すべき時。', '↑':'辛く寒い時期を越えた先に、愛による温かさが訪れる。' },
  45: { '↓':'確実な繁栄と幸福に満ちた一年となる。', '→':'現実的で純粋な、地上の幸福を享受する。', '←':'過度な欲望や貪欲さが、罰や不利益を招く。', '↑':'過剰な快楽や贅沢が、心身の不調を引き起こす。' },
  46: { '↓':'根本的なライフスタイルの変化が訪れる。', '→':'愛する人との関係を深めるための架け橋を築く。', '←':'過去の出来事や影響から逃れることができない。', '↑':'自由を得るためには、困難を乗り越えるための手段を講じる必要がある。' },
  47: { '↓':'誘惑的な囁きや、あなたを傷つけようとする悪意に耳を傾けてはならない。', '→':'復讐の誘惑に屈すれば、さらなる不快感や問題を引き起こす。', '←':'抑制されていない行動が問題を引き起こす前に、悔い改めるべき。', '↑':'あなたの情熱や熱意が、良い結果に繋がらない。' },
  48: { '↓':'近いうちに良い知らせが届く。', '→':'心温まるニュースを共有する機会。', '←':'楽しい出来事や娯楽が、悲しみを忘れさせてくれる。', '↑':'惰性的な生活から目覚め、新たな活動を始める。' },
  49: { '↓':'危機が迫る中、間一髪で保護される。', '→':'友人の心配や助言によって、危険を回避できる。', '←':'プライドが傷つくような出来事に直面する。', '↑':'誰かの行動によって、心に深い傷を負う。' },
  50: { '↓':'贈り物によって幸福がもたらされる。', '→':'家庭の繁栄と幸福、ビジネスにおける成功。', '←':'長年の願いや希望が成就する。', '↑':'成功や恩恵を得た際、周囲の人々への感謝を忘れてはならない。' },
};

const DIRS = ['top', 'right', 'bottom', 'left'];
const LABEL_POS = { top: 't', right: 'r', bottom: 'b', left: 'l' };

// カード90°CW回転時の矢印変換（カード固定の矢印がグリッド基準でCCW回転）
const ARROW_CW = { '↓': '←', '←': '↑', '↑': '→', '→': '↓' };

let grid = []; // grid[r][c] = { cardIndex, rotation (0-3) }
let brokenHistory = [];
let shufflePhase = 'idle'; // 'idle' | 'shuffling' // 壊れた記録: [{ broken: [{symId,arrow}], created: [{symId,arrow}] }]

// ===== ユーティリティ =====

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function rotateArrow(arrow, times) {
  let a = arrow;
  for (let i = 0; i < times; i++) a = ARROW_CW[a];
  return a;
}

// rotation後に effectiveSide にある辺の [symId, 回転済み矢印] を返す
function getEffectiveSide(r, c, effectiveSide) {
  const { cardIndex, rotation } = grid[r][c];
  const sideIdx = DIRS.indexOf(effectiveSide);
  const origIdx = (sideIdx - rotation + 400) % 4;
  const [symId, arrow] = CARD_DATA[cardIndex][DIRS[origIdx]];
  return [symId, rotateArrow(arrow, rotation)];
}

// ハイライト用: effectiveSide に対応する元のカード上の辺名
function origSideName(rotation, effectiveSide) {
  const sideIdx = DIRS.indexOf(effectiveSide);
  return DIRS[(sideIdx - rotation + 400) % 4];
}

// ===== ヒント判定 =====

const OPPOSITE = { right: 'left', left: 'right', top: 'bottom', bottom: 'top' };
const DELTA    = { right: [0,1],  left: [0,-1],  top: [-1,0],   bottom: [1,0]  };

// effSide が隣のカードの反対辺と現在一致しているか
function isCurrentlyMatched(r, c, effSide) {
  const [dr, dc] = DELTA[effSide];
  const r2 = r + dr, c2 = c + dc;
  if (r2 < 0 || r2 >= 5 || c2 < 0 || c2 >= 5) return false;
  const [symA, arrA] = getEffectiveSide(r, c, effSide);
  const [symB, arrB] = getEffectiveSide(r2, c2, OPPOSITE[effSide]);
  return symA === symB && arrA === arrB;
}

// 隣のカードを何らかの回転にしたとき、OPPOSITE辺で (symId, symArrow) と一致できるか
function isPotentialMatch(r, c, effSide, symId, symArrow) {
  const [dr, dc] = DELTA[effSide];
  const r2 = r + dr, c2 = c + dc;
  if (r2 < 0 || r2 >= 5 || c2 < 0 || c2 >= 5) return false;
  const oppSideIdx = DIRS.indexOf(OPPOSITE[effSide]);
  const { cardIndex } = grid[r2][c2];
  for (let rot = 0; rot < 4; rot++) {
    const origIdx = (oppSideIdx - rot + 400) % 4;
    const [oId, oArr] = CARD_DATA[cardIndex][DIRS[origIdx]];
    if (oId === symId && rotateArrow(oArr, rot) === symArrow) return true;
  }
  return false;
}

// ===== ペア判定 =====

function getMatchingPairs() {
  const pairs = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (c < 4) {
        const [idA, arrA] = getEffectiveSide(r, c, 'right');
        const [idB, arrB] = getEffectiveSide(r, c + 1, 'left');
        if (idA === idB && arrA === arrB) pairs.push({ r1: r, c1: c, s1: 'right', r2: r, c2: c + 1, s2: 'left', symId: idA, arrow: arrA });
      }
      if (r < 4) {
        const [idA, arrA] = getEffectiveSide(r, c, 'bottom');
        const [idB, arrB] = getEffectiveSide(r + 1, c, 'top');
        if (idA === idB && arrA === arrB) pairs.push({ r1: r, c1: c, s1: 'bottom', r2: r + 1, c2: c, s2: 'top', symId: idA, arrow: arrA });
      }
    }
  }
  return pairs;
}

// ===== 描画 =====

function buildMatchedSet(pairs) {
  const triSet = new Set();
  const cardSet = new Set();
  pairs.forEach(p => {
    const oSide1 = origSideName(grid[p.r1][p.c1].rotation, p.s1);
    const oSide2 = origSideName(grid[p.r2][p.c2].rotation, p.s2);
    triSet.add(`${p.r1},${p.c1},${oSide1}`);
    triSet.add(`${p.r2},${p.c2},${oSide2}`);
    cardSet.add(`${p.r1},${p.c1}`);
    cardSet.add(`${p.r2},${p.c2}`);
  });
  return { triSet, cardSet };
}

function buildCardEl(r, c, triSet, cardSet) {
  const { rotation } = grid[r][c];

  // 潜在一致が1辺でもあるか判定（フェード制御用）
  const anyMatch = DIRS.some(side => {
    const [sId, sArr] = getEffectiveSide(r, c, side);
    return isCurrentlyMatched(r, c, side) || isPotentialMatch(r, c, side, sId, sArr);
  });

  const card = document.createElement('div');
  card.className = 'card' + (anyMatch ? ' has-match' : ' no-potential');
  card.dataset.row = r;
  card.dataset.col = c;
  card.dataset.rotation = rotation;
  card.style.setProperty('--card-idx', r * 5 + c);

  // 背景（回転する）
  const bg = document.createElement('div');
  bg.className = 'card-bg';
  DIRS.forEach(origSide => {
    const tri = document.createElement('div');
    const isMatched = triSet.has(`${r},${c},${origSide}`);
    tri.className = 'tri-bg ' + origSide + (isMatched ? ' matched' : '');
    bg.appendChild(tri);
  });
  card.appendChild(bg);

  // ラベル（確定/潜在どちらもゴールドに統合）
  DIRS.forEach(effSide => {
    const [symId, arrow] = getEffectiveSide(r, c, effSide);
    const matched = isCurrentlyMatched(r, c, effSide) || isPotentialMatch(r, c, effSide, symId, arrow);
    const lbl = document.createElement('div');
    lbl.className = 'tri-label ' + LABEL_POS[effSide] + (matched ? ' matched-label' : '');
    lbl.textContent = symId + arrow;
    card.appendChild(lbl);
  });

  card.addEventListener('click', () => {
    const before = getMatchingPairs();
    grid[r][c].rotation = (rotation + 1) % 4;
    const after = getMatchingPairs();

    const key = p => `${p.symId}:${p.arrow}`;
    const countMap = arr => arr.reduce((m, p) => {
      const k = key(p); m.set(k, (m.get(k) || 0) + 1); return m;
    }, new Map());
    const beforeMap = countMap(before);
    const afterMap  = countMap(after);

    const broken = [];
    beforeMap.forEach((cnt, k) => {
      if (cnt > (afterMap.get(k) || 0)) broken.push(before.find(p => key(p) === k));
    });
    const created = [];
    afterMap.forEach((cnt, k) => {
      if (cnt > (beforeMap.get(k) || 0)) created.push(after.find(p => key(p) === k));
    });

    if (broken.length > 0) {
      brokenHistory.push({ broken, created });
    }

    renderGrid();
  });
  return card;
}

function renderGrid() {
  const pairs = getMatchingPairs();
  const { triSet, cardSet } = buildMatchedSet(pairs);
  const gridEl = document.getElementById('grid');
  gridEl.innerHTML = '';
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      gridEl.appendChild(buildCardEl(r, c, triSet, cardSet));
    }
  }
}

// ===== ゲーム初期化 =====

function initGame() {
  const indices = shuffle(Array.from({ length: 25 }, (_, i) => i));
  grid = [];
  brokenHistory = [];
  for (let r = 0; r < 5; r++) {
    grid[r] = [];
    for (let c = 0; c < 5; c++) {
      grid[r][c] = { cardIndex: indices[r * 5 + c], rotation: 0 };
    }
  }
  document.getElementById('result').hidden = true;
  renderGrid();
}

// ===== 結果表示 =====

function showResults() {
  const pairs = getMatchingPairs();
  const content = document.getElementById('result-content');

  let html = '';

  if (pairs.length === 0) {
    html += '<p style="text-align:center;color:#6a5060;padding:12px">一致するシンボルがない</p>';
  } else {
    html += pairs.map(p => {
      const name = SYMBOL_NAMES[p.symId] || `#${p.symId}`;
      const dir = DIR_LABELS[p.arrow] || p.arrow;
      const meaning = (MEANINGS[p.symId] && MEANINGS[p.symId][p.arrow]) || '';
      return `<div class="result-item">
        <div class="sym-id">#${p.symId}</div>
        <div class="sym-name">${name}<span class="sym-dir">${p.arrow} ${dir}</span></div>
        <div class="sym-meaning">${meaning}</div>
      </div>`;
    }).join('');
  }

  // 壊れた記録
  if (brokenHistory.length > 0) {
    html += '<h3 style="grid-column:1/-1;margin:16px 0 8px;color:#a06040;font-size:0.9em;letter-spacing:.1em;border-top:1px solid #6a5080;padding-top:12px;">壊れた記録</h3>';
    brokenHistory.forEach(event => {
      const brokenHtml = event.broken.map(b => {
        const name = SYMBOL_NAMES[b.symId] || `#${b.symId}`;
        const dir  = DIR_LABELS[b.arrow] || b.arrow;
        return `<span style="color:#a06040">#${b.symId} ${name} ${b.arrow} ${dir}</span>`;
      }).join('、');
      const createdHtml = event.created.map(c => {
        const name    = SYMBOL_NAMES[c.symId] || `#${c.symId}`;
        const dir     = DIR_LABELS[c.arrow] || c.arrow;
        const meaning = (MEANINGS[c.symId] && MEANINGS[c.symId][c.arrow]) || '';
        return `<span style="color:#5a7a40">#${c.symId} ${name} ${c.arrow} ${dir}</span>${meaning ? `<span style="display:block;font-size:0.85em;color:#6a6a6a;margin-left:1em">${meaning}</span>` : ''}`;
      }).join('');
      html += `<div style="margin-bottom:10px;padding:8px;background:#faf6f0;border-radius:6px;border-left:3px solid #a06040">
        <div style="font-size:0.85em">壊: ${brokenHtml}</div>
        ${event.created.length > 0 ? `<div style="font-size:0.85em;margin-top:4px">→ 完: ${createdHtml}</div>` : ''}
      </div>`;
    });
  }

  // 最後のカード（右下・25枚目）の4辺
  html += '<h3 style="grid-column:1/-1;margin:16px 0 8px;color:#c8a020;font-size:0.9em;letter-spacing:.1em;border-top:1px solid #6a5080;padding-top:12px;">最後のカード</h3>';
  DIRS.forEach(side => {
    const [symId, arrow] = getEffectiveSide(4, 4, side);
    const name = SYMBOL_NAMES[symId] || `#${symId}`;
    const dir = DIR_LABELS[arrow] || arrow;
    const meaning = (MEANINGS[symId] && MEANINGS[symId][arrow]) || '';
    html += `<div class="result-item">
      <div class="sym-id">#${symId}</div>
      <div class="sym-name">${name}<span class="sym-dir">${arrow} ${dir}</span></div>
      <div class="sym-meaning">${meaning}</div>
    </div>`;
  });

  content.innerHTML = html;

  const resultEl = document.getElementById('result');
  resultEl.hidden = false;
  resultEl.scrollIntoView({ behavior: 'smooth' });
}

// ===== イベント =====

document.addEventListener('DOMContentLoaded', () => {
  initGame();

  document.getElementById('btn-reset').addEventListener('click', () => {
    const btn = document.getElementById('btn-reset');
    const gridEl = document.getElementById('grid');
    if (shufflePhase === 'idle') {
      shufflePhase = 'shuffling';
      gridEl.classList.add('shuffling');
      btn.textContent = 'タップして配置';
    } else {
      shufflePhase = 'idle';
      gridEl.classList.remove('shuffling');
      btn.textContent = 'シャッフル';
      initGame();
    }
  });

  document.getElementById('btn-finish').addEventListener('click', showResults);
  document.getElementById('btn-close-result').addEventListener('click', () => {
    document.getElementById('result').hidden = true;
  });
});
