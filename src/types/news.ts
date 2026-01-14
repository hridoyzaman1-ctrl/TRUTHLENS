export type Category = 
  | 'national' 
  | 'international' 
  | 'economy' 
  | 'environment' 
  | 'society' 
  | 'culture' 
  | 'technology' 
  | 'editorial' 
  | 'untold-stories';

export type UserRole = 'admin' | 'editor' | 'reporter';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: Category;
  author: Author;
  featuredImage: string;
  videoUrl?: string;
  tags: string[];
  isBreaking: boolean;
  isFeatured: boolean;
  status: 'draft' | 'published' | 'scheduled';
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  views: number;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  role: UserRole;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  type: 'full-time' | 'part-time' | 'internship' | 'freelance' | 'volunteer';
  description: string;
  requirements: string[];
  deadline: Date;
  isOpen: boolean;
  createdAt: Date;
}

export interface JobApplication {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  cvUrl: string;
  photoUrl?: string;
  portfolioUrl?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  submittedAt: Date;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: Date;
  isActive: boolean;
}
