import { Article, Author, Job, Category } from '@/types/news';

export const authors: Author[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    email: 'sarah@truthlens.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    bio: 'Senior investigative journalist with 15 years of experience.',
    role: 'editor'
  },
  {
    id: '2',
    name: 'James Chen',
    email: 'james@truthlens.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'International affairs correspondent.',
    role: 'reporter'
  },
  {
    id: '3',
    name: 'Amira Hassan',
    email: 'amira@truthlens.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    bio: 'Environment and climate specialist.',
    role: 'reporter'
  }
];

export const articles: Article[] = [
  {
    id: '1',
    title: 'Breaking: Global Climate Summit Reaches Historic Agreement on Carbon Emissions',
    slug: 'global-climate-summit-historic-agreement',
    excerpt: 'World leaders unite in unprecedented commitment to reduce carbon emissions by 60% before 2035, marking a pivotal moment in climate action.',
    content: 'Full article content here...',
    category: 'environment',
    author: authors[2],
    featuredImage: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f31?w=1200',
    tags: ['climate', 'environment', 'global summit'],
    isBreaking: true,
    isFeatured: true,
    status: 'published',
    publishedAt: new Date('2026-01-14T08:00:00'),
    createdAt: new Date('2026-01-14T06:00:00'),
    updatedAt: new Date('2026-01-14T08:00:00'),
    views: 15420
  },
  {
    id: '2',
    title: 'Economic Outlook: Central Banks Signal New Monetary Policy Direction',
    slug: 'economic-outlook-central-banks-policy',
    excerpt: 'Major central banks worldwide are reconsidering their approach to interest rates amid changing economic conditions.',
    content: 'Full article content here...',
    category: 'economy',
    author: authors[0],
    featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200',
    tags: ['economy', 'finance', 'central banks'],
    isBreaking: true,
    isFeatured: false,
    status: 'published',
    publishedAt: new Date('2026-01-14T07:30:00'),
    createdAt: new Date('2026-01-14T05:00:00'),
    updatedAt: new Date('2026-01-14T07:30:00'),
    views: 8930
  },
  {
    id: '3',
    title: 'The Untold Story: Inside the Lives of Migrant Workers Building Tomorrow\'s Cities',
    slug: 'untold-story-migrant-workers',
    excerpt: 'An in-depth investigation reveals the human cost behind rapid urbanization and the dreams that keep hope alive.',
    content: 'Full article content here...',
    category: 'untold-stories',
    author: authors[0],
    featuredImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200',
    tags: ['investigation', 'human rights', 'urbanization'],
    isBreaking: false,
    isFeatured: true,
    status: 'published',
    publishedAt: new Date('2026-01-13T12:00:00'),
    createdAt: new Date('2026-01-12T10:00:00'),
    updatedAt: new Date('2026-01-13T12:00:00'),
    views: 23560
  },
  {
    id: '4',
    title: 'Tech Giants Face New Regulations: What It Means for Digital Privacy',
    slug: 'tech-giants-new-regulations-privacy',
    excerpt: 'Comprehensive legislation aims to reshape how technology companies handle user data and privacy.',
    content: 'Full article content here...',
    category: 'technology',
    author: authors[1],
    featuredImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200',
    tags: ['technology', 'privacy', 'regulation'],
    isBreaking: false,
    isFeatured: true,
    status: 'published',
    publishedAt: new Date('2026-01-13T15:00:00'),
    createdAt: new Date('2026-01-13T10:00:00'),
    updatedAt: new Date('2026-01-13T15:00:00'),
    views: 12340
  },
  {
    id: '5',
    title: 'International Summit: Nations Pledge Cooperation on Security Challenges',
    slug: 'international-summit-security-cooperation',
    excerpt: 'Leaders from over 50 countries convene to address growing security concerns and strengthen diplomatic ties.',
    content: 'Full article content here...',
    category: 'international',
    author: authors[1],
    featuredImage: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200',
    tags: ['international', 'diplomacy', 'security'],
    isBreaking: true,
    isFeatured: false,
    status: 'published',
    publishedAt: new Date('2026-01-14T06:00:00'),
    createdAt: new Date('2026-01-14T04:00:00'),
    updatedAt: new Date('2026-01-14T06:00:00'),
    views: 6780
  },
  {
    id: '6',
    title: 'Cultural Renaissance: Traditional Arts Find New Life in Digital Age',
    slug: 'cultural-renaissance-traditional-arts-digital',
    excerpt: 'How ancient crafts and traditions are being preserved and celebrated through modern technology.',
    content: 'Full article content here...',
    category: 'culture',
    author: authors[2],
    featuredImage: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200',
    tags: ['culture', 'tradition', 'digital'],
    isBreaking: false,
    isFeatured: false,
    status: 'published',
    publishedAt: new Date('2026-01-12T14:00:00'),
    createdAt: new Date('2026-01-12T10:00:00'),
    updatedAt: new Date('2026-01-12T14:00:00'),
    views: 4560
  },
  {
    id: '7',
    title: 'National Healthcare Reform: New Policies to Improve Access and Affordability',
    slug: 'national-healthcare-reform-policies',
    excerpt: 'Sweeping changes to the healthcare system aim to make quality medical care accessible to all citizens.',
    content: 'Full article content here...',
    category: 'national',
    author: authors[0],
    featuredImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200',
    tags: ['healthcare', 'national', 'reform'],
    isBreaking: false,
    isFeatured: true,
    status: 'published',
    publishedAt: new Date('2026-01-13T09:00:00'),
    createdAt: new Date('2026-01-13T06:00:00'),
    updatedAt: new Date('2026-01-13T09:00:00'),
    views: 18920
  },
  {
    id: '8',
    title: 'Editorial: The Importance of Press Freedom in Modern Democracy',
    slug: 'editorial-press-freedom-democracy',
    excerpt: 'A reflection on the vital role journalism plays in maintaining democratic values and accountability.',
    content: 'Full article content here...',
    category: 'editorial',
    author: authors[0],
    featuredImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200',
    tags: ['editorial', 'press freedom', 'democracy'],
    isBreaking: false,
    isFeatured: false,
    status: 'published',
    publishedAt: new Date('2026-01-11T10:00:00'),
    createdAt: new Date('2026-01-11T08:00:00'),
    updatedAt: new Date('2026-01-11T10:00:00'),
    views: 7890
  },
  {
    id: '9',
    title: 'Society in Focus: Youth Movements Reshaping Political Discourse',
    slug: 'youth-movements-political-discourse',
    excerpt: 'Young activists across the globe are challenging traditional politics and demanding change.',
    content: 'Full article content here...',
    category: 'society',
    author: authors[1],
    featuredImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200',
    tags: ['society', 'youth', 'politics'],
    isBreaking: false,
    isFeatured: false,
    status: 'published',
    publishedAt: new Date('2026-01-12T16:00:00'),
    createdAt: new Date('2026-01-12T12:00:00'),
    updatedAt: new Date('2026-01-12T16:00:00'),
    views: 9450
  }
];

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Senior Investigative Reporter',
    department: 'Editorial',
    type: 'full-time',
    description: 'Join our award-winning investigative team to uncover stories that matter.',
    requirements: [
      '5+ years of investigative journalism experience',
      'Strong research and analytical skills',
      'Published portfolio of investigative pieces',
      'Excellent written and verbal communication'
    ],
    deadline: new Date('2026-02-28'),
    isOpen: true,
    createdAt: new Date('2026-01-10')
  },
  {
    id: '2',
    title: 'Digital Content Editor',
    department: 'Digital',
    type: 'full-time',
    description: 'Lead our digital content strategy and manage online publishing.',
    requirements: [
      '3+ years of digital editing experience',
      'SEO and analytics expertise',
      'CMS proficiency',
      'Team leadership skills'
    ],
    deadline: new Date('2026-02-15'),
    isOpen: true,
    createdAt: new Date('2026-01-08')
  },
  {
    id: '3',
    title: 'Editorial Intern',
    department: 'Editorial',
    type: 'internship',
    description: 'Learn from experienced journalists while contributing to our newsroom.',
    requirements: [
      'Currently enrolled in journalism or related field',
      'Strong writing skills',
      'Eagerness to learn',
      'Ability to meet deadlines'
    ],
    deadline: new Date('2026-03-01'),
    isOpen: true,
    createdAt: new Date('2026-01-12')
  }
];

export const categories: { id: Category; name: string; description: string }[] = [
  { id: 'national', name: 'National', description: 'News from across the nation' },
  { id: 'international', name: 'International', description: 'Global news and events' },
  { id: 'economy', name: 'Economy', description: 'Business and financial news' },
  { id: 'environment', name: 'Environment', description: 'Climate and environmental stories' },
  { id: 'society', name: 'Society', description: 'Social issues and community' },
  { id: 'culture', name: 'Culture', description: 'Arts, entertainment, and heritage' },
  { id: 'technology', name: 'Technology', description: 'Tech news and innovations' },
  { id: 'editorial', name: 'Editorial', description: 'Opinion and analysis' },
  { id: 'untold-stories', name: 'Untold Stories', description: 'Investigative journalism' }
];
