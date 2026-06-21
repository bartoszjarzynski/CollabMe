import type { ActivityCategory } from '@/types';

// ─── Member ───────────────────────────────────────────────────────────────────

export interface Member {
  id: string;
  name: string;
  initials: string;
  /** Category colour of the activity — used for avatar background tint */
  avatarColor: string;
  /** How many activities they've completed on the platform */
  activitiesCount: number;
  /** 1–5 star rating */
  rating: number;
  role: 'host' | 'member';
}

// ─── Activity ─────────────────────────────────────────────────────────────────

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  when: string;           // human-readable display string
  isoDate: string;        // ISO-8601 for notification scheduling
  location: string;       // short display label
  locationDetail: string; // full address / link
  spotsLeft: number;
  totalSpots: number;
  isOnline: boolean;
  members: Member[];      // first member is always the host
  tags: string[];
  requirements: string;
}

// ─── Category colours (mirrors theme, duplicated here to avoid circular deps) ─

export const CATEGORY_COLOR: Record<ActivityCategory, string> = {
  gaming:   '#A78BFA',
  sports:   '#34D399',
  fitness:  '#FB923C',
  outdoors: '#38BDF8',
  social:   '#F472B6',
};

export const CATEGORY_ICON_NAME: Record<ActivityCategory, string> = {
  gaming:   'game-controller',
  sports:   'football',
  fitness:  'barbell',
  outdoors: 'trail-sign',
  social:   'people',
};

// ─── Sample data ──────────────────────────────────────────────────────────────

export const ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Ranked Valorant — need a fifth',
    description:
      'Looking for a calm, communicative 5th for ranked grind tonight. We\'re all Diamond/Ascendant, mostly playing Duelists and Initiators. No tilting please — we\'re here to improve and have fun. Discord required (mic mandatory). We usually queue for 2–3 hours starting at 8.',
    category: 'gaming',
    when: 'Tonight, 8:00 PM',
    isoDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    location: 'Online',
    locationDetail: 'Discord — link sent after join request accepted',
    spotsLeft: 1,
    totalSpots: 5,
    isOnline: true,
    tags: ['Valorant', 'Ranked', 'Diamond+', 'Mic required'],
    requirements: 'Diamond rank or above · Microphone · Positive attitude',
    members: [
      { id: 'm1', name: 'Marta K.',  initials: 'MK', avatarColor: '#A78BFA', activitiesCount: 47, rating: 4.9, role: 'host' },
      { id: 'm2', name: 'Bartek W.', initials: 'BW', avatarColor: '#A78BFA', activitiesCount: 22, rating: 4.7, role: 'member' },
      { id: 'm3', name: 'Kasia N.',  initials: 'KN', avatarColor: '#A78BFA', activitiesCount: 15, rating: 4.8, role: 'member' },
      { id: 'm4', name: 'Piotr M.',  initials: 'PM', avatarColor: '#A78BFA', activitiesCount: 31, rating: 4.6, role: 'member' },
    ],
  },
  {
    id: '2',
    title: 'Saturday morning 5-a-side football',
    description:
      'Friendly pickup game every Saturday morning in Park Śląski. All skill levels welcome — we just want people who enjoy the game and show up on time. Bring your own boots and shin pads. We split into two teams on the day. Afterwards we usually grab coffee nearby.',
    category: 'sports',
    when: 'Sat, 10:00 AM',
    isoDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Park Śląski, Katowice',
    locationDetail: 'Park Śląski — grass pitch near the main entrance, Chorzów',
    spotsLeft: 3,
    totalSpots: 10,
    isOnline: false,
    tags: ['Football', '5-a-side', 'All levels', 'Outdoor'],
    requirements: 'Boots · Shin pads · Water bottle',
    members: [
      { id: 'm5', name: 'Kuba N.',   initials: 'KN', avatarColor: '#34D399', activitiesCount: 63, rating: 5.0, role: 'host' },
      { id: 'm6', name: 'Dawid R.',  initials: 'DR', avatarColor: '#34D399', activitiesCount: 12, rating: 4.5, role: 'member' },
      { id: 'm7', name: 'Ania S.',   initials: 'AS', avatarColor: '#34D399', activitiesCount: 8,  rating: 4.8, role: 'member' },
      { id: 'm8', name: 'Marek T.',  initials: 'MT', avatarColor: '#34D399', activitiesCount: 29, rating: 4.6, role: 'member' },
      { id: 'm9', name: 'Zosia Ł.',  initials: 'ZŁ', avatarColor: '#34D399', activitiesCount: 5,  rating: 4.9, role: 'member' },
      { id: 'm10', name: 'Filip C.', initials: 'FC', avatarColor: '#34D399', activitiesCount: 17, rating: 4.7, role: 'member' },
      { id: 'm11', name: 'Gosia B.', initials: 'GB', avatarColor: '#34D399', activitiesCount: 9,  rating: 4.8, role: 'member' },
    ],
  },
  {
    id: '3',
    title: 'Beginner bouldering session',
    description:
      'New to climbing? Come join us! I run these beginner sessions every other Sunday. I\'ll teach you the basics — footwork, grip, reading routes — and we\'ll work through V0–V2 problems together. The gym has routes clearly graded and the staff are super helpful. Shoes can be rented at the gym reception.',
    category: 'fitness',
    when: 'Sun, 5:00 PM',
    isoDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Boulder Gym Center',
    locationDetail: 'Boulder Gym Center, ul. Górnicza 14, Katowice',
    spotsLeft: 4,
    totalSpots: 8,
    isOnline: false,
    tags: ['Bouldering', 'Beginner', 'Indoor', 'Shoes rentable'],
    requirements: 'No experience needed · Comfortable clothes · €8 gym entry fee',
    members: [
      { id: 'm12', name: 'Ola W.',    initials: 'OW', avatarColor: '#FB923C', activitiesCount: 38, rating: 5.0, role: 'host' },
      { id: 'm13', name: 'Michał P.', initials: 'MP', avatarColor: '#FB923C', activitiesCount: 4,  rating: 4.9, role: 'member' },
      { id: 'm14', name: 'Basia K.',  initials: 'BK', avatarColor: '#FB923C', activitiesCount: 2,  rating: 5.0, role: 'member' },
      { id: 'm15', name: 'Radek J.',  initials: 'RJ', avatarColor: '#FB923C', activitiesCount: 7,  rating: 4.7, role: 'member' },
    ],
  },
  {
    id: '4',
    title: 'Sunset trail run ~8km easy pace',
    description:
      'A relaxed evening run along the Dolina Trzech Stawów trail — flat, paved, and beautiful at dusk. Target pace is around 6:30/km so everyone can chat. We finish at the lakeside café for a well-earned beer or juice. Route: parking lot → north lake → forest loop → south lake → back. About 55 minutes total.',
    category: 'outdoors',
    when: 'Fri, 7:30 PM',
    isoDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Dolina Trzech Stawów',
    locationDetail: 'Meet at the main car park, Dolina Trzech Stawów, Katowice',
    spotsLeft: 6,
    totalSpots: 12,
    isOnline: false,
    tags: ['Running', 'Trail', '8km', 'Easy pace', 'Evening'],
    requirements: 'Running shoes · Headlamp or phone torch after dark · Water',
    members: [
      { id: 'm16', name: 'Tomek R.',  initials: 'TR', avatarColor: '#38BDF8', activitiesCount: 54, rating: 4.8, role: 'host' },
      { id: 'm17', name: 'Agata M.',  initials: 'AM', avatarColor: '#38BDF8', activitiesCount: 21, rating: 4.9, role: 'member' },
      { id: 'm18', name: 'Łukasz S.', initials: 'ŁS', avatarColor: '#38BDF8', activitiesCount: 33, rating: 4.7, role: 'member' },
      { id: 'm19', name: 'Patrycja W.', initials: 'PW', avatarColor: '#38BDF8', activitiesCount: 16, rating: 5.0, role: 'member' },
      { id: 'm20', name: 'Krzysztof B.', initials: 'KB', avatarColor: '#38BDF8', activitiesCount: 9, rating: 4.6, role: 'member' },
      { id: 'm21', name: 'Natalia D.', initials: 'ND', avatarColor: '#38BDF8', activitiesCount: 27, rating: 4.8, role: 'member' },
    ],
  },
  {
    id: '5',
    title: 'Board game night — Catan & more',
    description:
      'Monthly board game evening at GameHouse Café. We\'ll start with Catan (always a crowd-pleaser), then move to whatever the group fancies — Ticket to Ride, 7 Wonders, or Codenames are on the table. The café charges a small table fee (split between us) and serves great coffee. Games end around 10 PM.',
    category: 'social',
    when: 'Thu, 7:00 PM',
    isoDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'GameHouse Café',
    locationDetail: 'GameHouse Café, ul. Mariacka 4, Katowice (first floor)',
    spotsLeft: 2,
    totalSpots: 6,
    isOnline: false,
    tags: ['Board games', 'Catan', 'Café', 'Evening', 'Social'],
    requirements: 'No experience needed · Small table fee (~5 PLN/person)',
    members: [
      { id: 'm22', name: 'Julia S.',  initials: 'JS', avatarColor: '#F472B6', activitiesCount: 41, rating: 5.0, role: 'host' },
      { id: 'm23', name: 'Radek P.',  initials: 'RP', avatarColor: '#F472B6', activitiesCount: 18, rating: 4.8, role: 'member' },
      { id: 'm24', name: 'Monika C.', initials: 'MC', avatarColor: '#F472B6', activitiesCount: 25, rating: 4.9, role: 'member' },
      { id: 'm25', name: 'Arek T.',   initials: 'AT', avatarColor: '#F472B6', activitiesCount: 11, rating: 4.7, role: 'member' },
    ],
  },
];

export function getActivityById(id: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}
