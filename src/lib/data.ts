import type { Player, NewsArticle, Product, NextMatch, LastResult } from '@/types';

// ── SIT Football Club — Logo placeholder (ใช้โลโก้ SIT จริงได้ภายหลัง)
const SIT_LOGO = '/sit-football.jpg';
const IT_KMITL_LOGO = '/it-kmitl-football.jpg';

export const NEXT_MATCH: NextMatch = {  
  date: 'SAT 15 MAR',
  time: '15:00',
  venue: 'SIT Stadium',
  home: {
    name: 'SIT Football Club',
    shortName: 'SIT FC',
    logo: SIT_LOGO,
  },
  away: {
    name: 'Chulalongkorn FC',
    shortName: 'CHULA FC',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Chulalongkorn_university_seal_th.svg/800px-Chulalongkorn_university_seal_th.svg.png',
  },
};

export const LAST_RESULT: LastResult = {
  date: 'SAT 08 MAR',
  competition: 'UNI CUP',
  homeTeam: 'IT KMITL',
  awayTeam: 'SIT FC',
  homeLogo: IT_KMITL_LOGO,
  awayLogo: SIT_LOGO,
  homeScore: 1,
  awayScore: 1,
  scorers: 'AKARAWIN (11)',
  winner: 'away',
};

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 1,
    title: 'SIT FC Women Team Beat Engineering FC 3-0',
    category: 'Ladies',
    date: '10 MAR 2025',
    image: 'https://htfc.co.uk/wp-content/uploads/2025/12/IMG_6660.jpg',
  },
  {
    id: 2,
    title: 'SIT FC 3-1 Kasetsart University',
    category: 'Match Reports',
    date: '08 MAR 2025',
    image: 'https://htfc.co.uk/wp-content/uploads/2025/12/1A0A5076-scaled.jpg',
  },
  {
    id: 3,
    title: 'New Season Kit Now Available',
    category: 'Club News',
    date: '01 MAR 2025',
    image: 'https://htfc.co.uk/wp-content/uploads/2025/12/half-season-1_crop.png',
  },
  {
    id: 4,
    title: 'Match Preview: SIT FC vs Chulalongkorn FC',
    category: 'Match Previews',
    date: '28 FEB 2025',
    image: 'https://htfc.co.uk/wp-content/uploads/2025/12/CR6Ashton-United-A-291129_764.jpg',
  },
];

export const PLAYERS: Player[] = [
  { id: 1,  number: '10', firstName: 'Player', lastName: '10',  position: 'FORWARD',    image: '/SIT FOOTBALL CLUB/10.png',  stats: [{ label: 'Pace', value: 88 }, { label: 'Shoot', value: 92 }, { label: 'Pass', value: 85 }, { label: 'Drib', value: 89 }, { label: 'Def', value: 81 }, { label: 'Phys', value: 90 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2025/08/westwood-decorators.jpg', animationDelay: undefined },
  { id: 2,  number: '11', firstName: 'Player', lastName: '11',  position: 'FORWARD',    image: '/SIT FOOTBALL CLUB/11.png',  stats: [{ label: 'Pace', value: 96 }, { label: 'Shoot', value: 88 }, { label: 'Pass', value: 82 }, { label: 'Drib', value: 89 }, { label: 'Def', value: 80 }, { label: 'Phys', value: 87 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2024/10/prg.jpg',              animationDelay: 'delay-100' },
  { id: 3,  number: '12', firstName: 'Player', lastName: '12',  position: 'WINGER',     image: '/SIT FOOTBALL CLUB/12.png',  stats: [{ label: 'Pace', value: 95 }, { label: 'Shoot', value: 84 }, { label: 'Pass', value: 86 }, { label: 'Drib', value: 93 }, { label: 'Def', value: 80 }, { label: 'Phys', value: 85 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2024/10/nuffield-health.jpg',  animationDelay: 'delay-200' },
  { id: 4,  number: '13', firstName: 'Player', lastName: '13',  position: 'GOALKEEPER', image: '/SIT FOOTBALL CLUB/13.png',  stats: [{ label: 'Div',  value: 88 }, { label: 'Han',   value: 86 }, { label: 'Kick', value: 82 }, { label: 'Ref',  value: 91 }, { label: 'Spd',  value: 84 }, { label: 'Pos',  value: 87 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2025/08/lee-goodwin.jpg',      animationDelay: 'delay-300' },
  { id: 5,  number: '14', firstName: 'Player', lastName: '14',  position: 'STRIKER',    image: '/SIT FOOTBALL CLUB/14.png',  stats: [{ label: 'Pace', value: 86 }, { label: 'Shoot', value: 94 }, { label: 'Pass', value: 82 }, { label: 'Drib', value: 85 }, { label: 'Def', value: 81 }, { label: 'Phys', value: 93 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2025/07/red-rose.jpg',          animationDelay: undefined },
  { id: 6,  number: '15', firstName: 'Player', lastName: '15',  position: 'MIDFIELDER', image: '/SIT FOOTBALL CLUB/15.png',  stats: [{ label: 'Pace', value: 82 }, { label: 'Shoot', value: 86 }, { label: 'Pass', value: 88 }, { label: 'Drib', value: 84 }, { label: 'Def', value: 91 }, { label: 'Phys', value: 96 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2025/08/rjw-plumbing-1.jpg',   animationDelay: 'delay-100' },
  { id: 7,  number: '16', firstName: 'Player', lastName: '16',  position: 'DEFENDER',   image: '/SIT FOOTBALL CLUB/16.png',  stats: [{ label: 'Pace', value: 80 }, { label: 'Shoot', value: 72 }, { label: 'Pass', value: 78 }, { label: 'Drib', value: 75 }, { label: 'Def', value: 88 }, { label: 'Phys', value: 86 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2025/08/westwood-decorators.jpg', animationDelay: 'delay-200' },
  { id: 8,  number: '17', firstName: 'Player', lastName: '17',  position: 'DEFENDER',   image: '/SIT FOOTBALL CLUB/17.png',  stats: [{ label: 'Pace', value: 82 }, { label: 'Shoot', value: 70 }, { label: 'Pass', value: 76 }, { label: 'Drib', value: 74 }, { label: 'Def', value: 90 }, { label: 'Phys', value: 89 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2024/10/prg.jpg',              animationDelay: 'delay-300' },
  { id: 9,  number: '18', firstName: 'Player', lastName: '18',  position: 'DEFENDER',   image: '/SIT FOOTBALL CLUB/18.png',  stats: [{ label: 'Pace', value: 79 }, { label: 'Shoot', value: 73 }, { label: 'Pass', value: 80 }, { label: 'Drib', value: 77 }, { label: 'Def', value: 92 }, { label: 'Phys', value: 88 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2024/10/nuffield-health.jpg',  animationDelay: undefined },
  { id: 10, number: '19', firstName: 'Player', lastName: '19',  position: 'MIDFIELDER', image: '/SIT FOOTBALL CLUB/19.png',  stats: [{ label: 'Pace', value: 83 }, { label: 'Shoot', value: 81 }, { label: 'Pass', value: 90 }, { label: 'Drib', value: 85 }, { label: 'Def', value: 78 }, { label: 'Phys', value: 84 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2025/07/red-rose.jpg',          animationDelay: 'delay-100' },
  { id: 11, number: '20', firstName: 'Player', lastName: '20',  position: 'MIDFIELDER', image: '/SIT FOOTBALL CLUB/20.png',  stats: [{ label: 'Pace', value: 81 }, { label: 'Shoot', value: 83 }, { label: 'Pass', value: 87 }, { label: 'Drib', value: 86 }, { label: 'Def', value: 80 }, { label: 'Phys', value: 82 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2025/08/rjw-plumbing-1.jpg',   animationDelay: 'delay-200' },
  { id: 12, number: '21', firstName: 'Player', lastName: '21',  position: 'WINGER',     image: '/SIT FOOTBALL CLUB/21.png',  stats: [{ label: 'Pace', value: 92 }, { label: 'Shoot', value: 80 }, { label: 'Pass', value: 83 }, { label: 'Drib', value: 91 }, { label: 'Def', value: 71 }, { label: 'Phys', value: 79 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2025/08/lee-goodwin.jpg',      animationDelay: 'delay-300' },
  { id: 13, number: '22', firstName: 'Player', lastName: '22',  position: 'MIDFIELDER', image: '/SIT FOOTBALL CLUB/22.png',  stats: [{ label: 'Pace', value: 80 }, { label: 'Shoot', value: 79 }, { label: 'Pass', value: 86 }, { label: 'Drib', value: 82 }, { label: 'Def', value: 84 }, { label: 'Phys', value: 85 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2025/08/westwood-decorators.jpg', animationDelay: undefined },
  { id: 14, number: '23', firstName: 'Player', lastName: '23',  position: 'GOALKEEPER', image: '/SIT FOOTBALL CLUB/23.png',  stats: [{ label: 'Div',  value: 85 }, { label: 'Han',   value: 83 }, { label: 'Kick', value: 79 }, { label: 'Ref',  value: 88 }, { label: 'Spd',  value: 81 }, { label: 'Pos',  value: 84 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2024/10/prg.jpg',              animationDelay: 'delay-100' },
  { id: 15, number: '24', firstName: 'Player', lastName: '24',  position: 'DEFENDER',   image: '/SIT FOOTBALL CLUB/24.png',  stats: [{ label: 'Pace', value: 77 }, { label: 'Shoot', value: 68 }, { label: 'Pass', value: 75 }, { label: 'Drib', value: 72 }, { label: 'Def', value: 89 }, { label: 'Phys', value: 91 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2024/10/nuffield-health.jpg',  animationDelay: 'delay-200' },
  { id: 16, number: '25', firstName: 'Player', lastName: '25',  position: 'MIDFIELDER', image: '/SIT FOOTBALL CLUB/25.png',  stats: [{ label: 'Pace', value: 84 }, { label: 'Shoot', value: 82 }, { label: 'Pass', value: 89 }, { label: 'Drib', value: 83 }, { label: 'Def', value: 77 }, { label: 'Phys', value: 80 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2025/07/red-rose.jpg',          animationDelay: 'delay-300' },
  { id: 17, number: '26', firstName: 'Player', lastName: '26',  position: 'FORWARD',    image: '/SIT FOOTBALL CLUB/26.png',  stats: [{ label: 'Pace', value: 90 }, { label: 'Shoot', value: 87 }, { label: 'Pass', value: 79 }, { label: 'Drib', value: 88 }, { label: 'Def', value: 72 }, { label: 'Phys', value: 83 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2025/08/rjw-plumbing-1.jpg',   animationDelay: undefined },
  { id: 18, number: '27', firstName: 'Player', lastName: '27',  position: 'STRIKER',    image: '/SIT FOOTBALL CLUB/27.png',  stats: [{ label: 'Pace', value: 87 }, { label: 'Shoot', value: 91 }, { label: 'Pass', value: 78 }, { label: 'Drib', value: 84 }, { label: 'Def', value: 70 }, { label: 'Phys', value: 88 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2025/08/lee-goodwin.jpg',      animationDelay: 'delay-100' },
  { id: 19, number: '28', firstName: 'Player', lastName: '28',  position: 'WINGER',     image: '/SIT FOOTBALL CLUB/28.png',  stats: [{ label: 'Pace', value: 93 }, { label: 'Shoot', value: 81 }, { label: 'Pass', value: 84 }, { label: 'Drib', value: 90 }, { label: 'Def', value: 73 }, { label: 'Phys', value: 78 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2025/08/westwood-decorators.jpg', animationDelay: 'delay-200' },
  { id: 20, number: '29', firstName: 'Player', lastName: '29',  position: 'MIDFIELDER', image: '/SIT FOOTBALL CLUB/29.png',  stats: [{ label: 'Pace', value: 79 }, { label: 'Shoot', value: 77 }, { label: 'Pass', value: 91 }, { label: 'Drib', value: 80 }, { label: 'Def', value: 83 }, { label: 'Phys', value: 81 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2024/10/prg.jpg',              animationDelay: 'delay-300' },
  { id: 21, number: '30', firstName: 'Player', lastName: '30',  position: 'DEFENDER',   image: '/SIT FOOTBALL CLUB/30.png',  stats: [{ label: 'Pace', value: 78 }, { label: 'Shoot', value: 65 }, { label: 'Pass', value: 74 }, { label: 'Drib', value: 70 }, { label: 'Def', value: 91 }, { label: 'Phys', value: 90 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2024/10/nuffield-health.jpg',  animationDelay: undefined },
  { id: 22, number: '31', firstName: 'Player', lastName: '31',  position: 'DEFENDER',   image: '/SIT FOOTBALL CLUB/31.png',  stats: [{ label: 'Pace', value: 83 }, { label: 'Shoot', value: 69 }, { label: 'Pass', value: 77 }, { label: 'Drib', value: 75 }, { label: 'Def', value: 87 }, { label: 'Phys', value: 86 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2025/07/red-rose.jpg',          animationDelay: 'delay-100' },
  { id: 23, number: '32', firstName: 'Player', lastName: '32',  position: 'MIDFIELDER', image: '/SIT FOOTBALL CLUB/32.png',  stats: [{ label: 'Pace', value: 82 }, { label: 'Shoot', value: 80 }, { label: 'Pass', value: 88 }, { label: 'Drib', value: 82 }, { label: 'Def', value: 79 }, { label: 'Phys', value: 83 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2025/08/rjw-plumbing-1.jpg',   animationDelay: 'delay-200' },
  { id: 24, number: '33', firstName: 'Player', lastName: '33',  position: 'FORWARD',    image: '/SIT FOOTBALL CLUB/33.png',  stats: [{ label: 'Pace', value: 89 }, { label: 'Shoot', value: 86 }, { label: 'Pass', value: 80 }, { label: 'Drib', value: 87 }, { label: 'Def', value: 74 }, { label: 'Phys', value: 85 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2025/08/lee-goodwin.jpg',      animationDelay: 'delay-300' },
  { id: 25, number: '34', firstName: 'Player', lastName: '34',  position: 'STRIKER',    image: '/SIT FOOTBALL CLUB/34.png',  stats: [{ label: 'Pace', value: 85 }, { label: 'Shoot', value: 90 }, { label: 'Pass', value: 76 }, { label: 'Drib', value: 83 }, { label: 'Def', value: 71 }, { label: 'Phys', value: 87 }], sponsorImage: 'https://htfc.co.uk/wp-content/uploads/2025/08/westwood-decorators.jpg', animationDelay: undefined },
];


export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'SIT FC Home Kit 2025',
    price: '฿850',
    image: 'https://htfc.co.uk/wp-content/uploads/2025/02/Body-Warmer.png',
    isNew: true,
  },
  {
    id: 2,
    name: 'SIT FC Black Pen',
    price: '฿50',
    image: 'https://htfc.co.uk/wp-content/uploads/2025/02/Pen.jpg',
  },
  {
    id: 3,
    name: 'Club Pin Badge',
    price: '฿120',
    image: 'https://htfc.co.uk/wp-content/uploads/2025/02/Wooden-Circle-Keyring.jpg',
  },
  {
    id: 4,
    name: "'We Are SIT' Hoodie",
    price: '฿950',
    image: 'https://htfc.co.uk/wp-content/uploads/2025/10/thepitmen-jumper.webp',
  },
];
