export interface TvMazeResponse {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: number;
  averageRuntime: number;
  premiered: string;
  ended: string;
  officialSite: string;
  schedule: Schedule;
  rating: Rating;
  weight: number;
  network: Network;
  webChannel: null;
  dvdCountry: null;
  externals: Externals;
  image: Image;
  summary: string;
  updated: number;
  _links: Links;
  _embedded: Embedded;
}

interface Embedded {
  cast: Cast[];
}

interface Cast {
  person: Person;
  character: Character;
  self: boolean;
  voice: boolean;
}

interface Character {
  id: number;
  url: string;
  name: string;
  image: Image | null;
  _links: Links2;
}

interface Person {
  id: number;
  url: string;
  name: string;
  country: Country;
  birthday: null | string;
  deathday: null;
  gender: string;
  image: Image;
  updated: number;
  _links: Links2;
}

interface Links2 {
  self: Self;
}

interface Links {
  self: Self;
  previousepisode: Previousepisode;
}

interface Previousepisode {
  href: string;
  name: string;
}

interface Self {
  href: string;
}

interface Image {
  medium: string;
  original: string;
}

interface Externals {
  tvrage: number;
  thetvdb: number;
  imdb: string;
}

interface Network {
  id: number;
  name: string;
  country: Country;
  officialSite: string;
}

interface Country {
  name: string;
  code: string;
  timezone: string;
}

interface Rating {
  average: number;
}

interface Schedule {
  time: string;
  days: string[];
}
