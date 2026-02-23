export interface PlayerStat {
  label: string;
  value: number;
}

export interface Player {
  id: number;
  number: string;
  firstName: string;
  lastName: string;
  position: string;
  image: string;
  stats: PlayerStat[];
  sponsorImage: string;
  animationDelay?: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  isNew?: boolean;
}

export interface MatchTeam {
  name: string;
  logo?: string;
  shortName: string;
}

export interface NextMatch {
  date: string;
  time: string;
  venue: string;
  home: MatchTeam;
  away: MatchTeam;
}

export interface LastResult {
  date: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
  homeScore: number;
  awayScore: number;
  scorers: string;
  winner: 'home' | 'away' | 'draw';
}
