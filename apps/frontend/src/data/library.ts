export interface CuratedActivity {
  id: string;
  title: string;
  description: string;
  ageGroup: string;
  theme: string;
  duration: string;
  materials: string[];
  instructions: string[];
  tone: 'fern' | 'clay' | 'sun';
}

export const curatedActivities: CuratedActivity[] = [
  {
    id: 'light-and-shadow',
    title: 'Shadow shape stories',
    description: 'Turn familiar classroom objects into an open-ended group story using a torch and a blank wall.',
    ageGroup: '3-5 years',
    theme: 'Light & wonder',
    duration: '20 min',
    materials: ['Torch', 'Blocks', 'White sheet'],
    instructions: ['Dim one corner of the room.', 'Invite tamariki to choose an object.', 'Build a shared story from each shadow.'],
    tone: 'fern',
  },
  {
    id: 'harakeke-patterns',
    title: 'Nature pattern press',
    description: 'Notice line, texture and repetition by pressing found leaves into reusable clay.',
    ageGroup: '2-5 years',
    theme: 'Nature',
    duration: '25 min',
    materials: ['Air-dry clay', 'Leaves', 'Rolling pins'],
    instructions: ['Collect fallen leaves together.', 'Roll a small clay tile.', 'Press, lift and compare the marks.'],
    tone: 'clay',
  },
  {
    id: 'sound-map',
    title: 'Listening walk map',
    description: 'Slow down, listen closely, and make a simple visual map of sounds around your centre.',
    ageGroup: '4-6 years',
    theme: 'Belonging',
    duration: '30 min',
    materials: ['Clipboards', 'Paper', 'Crayons'],
    instructions: ['Walk slowly around the centre.', 'Pause at three listening spots.', 'Draw a mark for every sound.'],
    tone: 'sun',
  },
  {
    id: 'ribbon-rhythm',
    title: 'Ribbon rhythm circle',
    description: 'Pair simple waiata with large and small movements for an energetic mat-time reset.',
    ageGroup: '1-4 years',
    theme: 'Music & movement',
    duration: '15 min',
    materials: ['Ribbon rings', 'Music player'],
    instructions: ['Offer one ribbon to each child.', 'Model high, low, fast and slow.', 'Let a child choose the final movement.'],
    tone: 'fern',
  },
];

export const sampleDocuments = [
  { id: 'd1', title: 'Licensing Criteria for ECE Services', source: 'Ministry of Education', type: 'PDF', updated: 'Updated 18 Jul 2026', category: 'MoE guidance' },
  { id: 'd2', title: 'Positive Guidance Policy', source: 'Koru Early Learning', type: 'DOCX', updated: 'Added 04 Aug 2026', category: 'Centre policy' },
  { id: 'd3', title: 'Te Whāriki: Early Childhood Curriculum', source: 'Ministry of Education', type: 'PDF', updated: 'Updated 12 Jun 2026', category: 'Curriculum' },
];

export const upcomingMoments = [
  { day: '14', month: 'AUG', title: 'Conservation Week', note: 'Prepare nature-print materials', tone: 'fern' },
  { day: '04', month: 'SEP', title: 'Father’s Day', note: 'Whānau portrait invitation', tone: 'clay' },
  { day: '14', month: 'SEP', title: 'Te Wiki o te Reo Māori', note: 'Plan daily kupu and waiata', tone: 'sun' },
];
