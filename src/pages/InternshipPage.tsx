import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Users, 
  Award, 
  Briefcase, 
  Globe, 
  Heart,
  CheckCircle,
  BookOpen,
  Mic,
  Camera,
  Edit3,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

const benefits = [
  {
    icon: BookOpen,
    title: 'Hands-on Experience',
    description: 'Work on real stories that get published and make an impact in the world.'
  },
  {
    icon: Users,
    title: 'Mentorship Program',
    description: 'Learn directly from experienced journalists and editors in the field.'
  },
  {
    icon: Globe,
    title: 'Global Exposure',
    description: 'Cover international stories and understand global media dynamics.'
  },
  {
    icon: Award,
    title: 'Certificate & Reference',
    description: 'Receive a certificate of completion and strong professional references.'
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    description: 'Top performers get opportunities for full-time positions.'
  },
  {
    icon: Heart,
    title: 'Meaningful Work',
    description: 'Be part of authentic journalism that uncovers untold stories.'
  }
];

const departments = [
  { icon: Edit3, name: 'Editorial', description: 'News writing, fact-checking, and content editing' },
  { icon: Camera, name: 'Multimedia', description: 'Photography, videography, and visual storytelling' },
  { icon: Mic, name: 'Podcasting', description: 'Audio production and podcast creation' },
  { icon: Globe, name: 'Digital Media', description: 'Social media, SEO, and online engagement' }
];

const InternshipPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    university: '',
    department: '',
    portfolio: '',
    coverLetter: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Application submitted successfully! We will contact you soon.');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      university: '',
      department: '',
      portfolio: '',
      coverLetter: ''
    });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/80 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-accent text-accent-foreground">Now Accepting Applications</Badge>
          <h1 className="font-display text-3xl font-bold text-primary-foreground md:text-5xl">
            Launch Your Journalism Career
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
            Join TruthLens as an intern and gain real-world experience in authentic, 
            fact-based journalism. Shape stories that matter.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
              <span className="text-sm font-medium">3-6 Month Programs</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-primary-foreground">
              <Briefcase className="h-5 w-5" />
              <span className="text-sm font-medium">Remote & On-site Options</span>
            </div>
          </div>
        </div>
      </div>

      {/* Why Join Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-display text-2xl font-bold text-foreground md:text-3xl mb-4">
            Why Intern at TruthLens?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            We believe in nurturing the next generation of journalists with meaningful experiences 
            and genuine career opportunities.
          </p>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-display text-2xl font-bold text-foreground md:text-3xl mb-12">
            Internship Departments
          </h2>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((dept) => (
              <div key={dept.name} className="text-center p-6 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <dept.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{dept.name}</h3>
                <p className="text-sm text-muted-foreground">{dept.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-muted/30" id="apply">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-center font-display text-2xl font-bold text-foreground md:text-3xl mb-4">
              Apply for Internship
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Fill out the form below to start your journey with TruthLens.
            </p>
            
            <Card className="bg-card border-border">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Your phone number"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="university">University/Institution *</Label>
                      <Input
                        id="university"
                        name="university"
                        value={formData.university}
                        onChange={handleInputChange}
                        placeholder="Your university name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Preferred Department *</Label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="">Select a department</option>
                      <option value="editorial">Editorial</option>
                      <option value="multimedia">Multimedia</option>
                      <option value="podcasting">Podcasting</option>
                      <option value="digital">Digital Media</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio/LinkedIn URL (Optional)</Label>
                    <Input
                      id="portfolio"
                      name="portfolio"
                      type="url"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      placeholder="https://your-portfolio.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverLetter">Why do you want to intern at TruthLens? *</Label>
                    <Textarea
                      id="coverLetter"
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself and why you're interested in journalism..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    <CheckCircle className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-display text-2xl font-bold text-foreground md:text-3xl mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: 'What is the duration of the internship?', a: 'Our internships typically last 3-6 months, with flexibility based on your academic schedule.' },
              { q: 'Is this a paid internship?', a: 'We offer stipends for our interns along with valuable experience and mentorship.' },
              { q: 'Can I intern remotely?', a: 'Yes, we offer both remote and on-site internship options depending on your location and preferences.' },
              { q: 'What qualifications do I need?', a: 'We welcome students and recent graduates with a passion for journalism. No prior professional experience required.' },
            ].map((faq, idx) => (
              <div key={idx} className="rounded-xl bg-card border border-border p-6">
                <h3 className="font-display font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default InternshipPage;
