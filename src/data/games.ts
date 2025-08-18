// 보드게임 데이터

export const boardGames = [
  '스플렌더',
  '킹 오브 토쿄',
  '사이드 리얼',
  '아줄',
  '카탄',
  '도미니온',
  '윙스팬',
  '티켓 투 라이드',
  '판데믹',
  '코드네임',
  '루트',
  '테라포밍 마스',
  '글룸헤이븐',
  '스카이테일즈',
  '7 원더스'
];

export const gamesByPlayerCount = {
  1: ['패치워크', '하이브', '7 원더스 듀얼', '제니티아', '로스트 시티'],
  2: ['패치워크', '하이브', '7 원더스 듀얼', '제니티아', '로스트 시티'],
  3: ['스플렌더', '킹 오브 토쿄', '사이드 리얼', '아줄', '카탄'],
  4: ['스플렌더', '킹 오브 토쿄', '사이드 리얼', '아줄', '카탄'],
  5: ['시타델', '카르카손', '킹 오브 뉴욕', '스몰 월드', '뱅!'],
  6: ['시타델', '카르카손', '킹 오브 뉴욕', '스몰 월드', '뱅!'],
  many: ['코드네임', '원 나이트 웨어울프', '레지스탕스 아발론', '카멜롯을 향하여']
};

export function getGamesByPlayerCount(playerCount: number): string[] {
  if (playerCount <= 2) {
    return gamesByPlayerCount[2];
  } else if (playerCount <= 4) {
    return gamesByPlayerCount[4];
  } else if (playerCount <= 6) {
    return gamesByPlayerCount[6];
  } else {
    return gamesByPlayerCount.many;
  }
}

export function getRandomGame(games: string[]): string {
  return games[Math.floor(Math.random() * games.length)];
}
