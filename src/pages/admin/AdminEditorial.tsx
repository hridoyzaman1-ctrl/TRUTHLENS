import { useState } from 'react';
import { Save, Pen, MessageCircle, GraduationCap, Eye, EyeOff, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { articles } from '@/data/mockData';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Mock data for editorial settings
const initialEditorialSettings = {
  showEditorialSection: true,
  maxEditorials: 4,
  editorialIds: ['8', '16'],
  showCommentsSection: true,
  maxComments: 4,
  moderateComments: true
};

// Mock internship applications
const mockApplications = [
  {
    id: '1',
    fullName: 'Alex Johnson',
    email: 'alex.j@university.edu',
    phone: '+1 555-0123',
    university: 'Columbia University',
    department: 'editorial',
    portfolio: 'https://alexjohnson.com',
    coverLetter: 'I am passionate about investigative journalism and want to make a difference...',
    status: 'pending',
    submittedAt: new Date('2026-01-12T10:00:00')
  },
  {
    id: '2',
    fullName: 'Maria Santos',
    email: 'maria.s@college.edu',
    phone: '+1 555-0456',
    university: 'NYU',
    department: 'multimedia',
    portfolio: 'https://mariasantos.portfolio.com',
    coverLetter: 'As a visual storyteller, I believe in the power of multimedia journalism...',
    status: 'reviewed',
    submittedAt: new Date('2026-01-10T14:30:00')
  },
  {
    id: '3',
    fullName: 'David Kim',
    email: 'david.kim@school.edu',
    phone: '+1 555-0789',
    university: 'Boston University',
    department: 'digital',
    portfolio: '',
    coverLetter: 'I want to learn about digital media and social engagement strategies...',
    status: 'shortlisted',
    submittedAt: new Date('2026-01-08T09:15:00')
  }
];

// Mock internship settings
const initialInternshipSettings = {
  acceptingApplications: true,
  showBannerOnHomepage: true,
  departments: ['editorial', 'multimedia', 'podcasting', 'digital'],
  requirePortfolio: false,
  autoReplyEnabled: true
};

const AdminEditorial = () => {
  const [editorialSettings, setEditorialSettings] = useState(initialEditorialSettings);
  const [internshipSettings, setInternshipSettings] = useState(initialInternshipSettings);
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<typeof mockApplications[0] | null>(null);

  const editorialArticles = articles.filter(a => a.category === 'editorial');

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-500',
      reviewed: 'bg-blue-500',
      shortlisted: 'bg-green-500',
      rejected: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const handleSaveEditorialSettings = () => {
    toast.success('Editorial settings saved successfully');
  };

  const handleSaveInternshipSettings = () => {
    toast.success('Internship settings saved successfully');
  };

  const updateApplicationStatus = (id: string, status: string) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status } : app
    ));
    toast.success(`Application status updated to ${status}`);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Editorial & Internship Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage editorial content, comments, and internship applications
          </p>
        </div>
      </div>

      <Tabs defaultValue="editorial" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
          <TabsTrigger value="editorial" className="gap-2">
            <Pen className="h-4 w-4" />
            <span className="hidden sm:inline">Editorial</span>
          </TabsTrigger>
          <TabsTrigger value="comments" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Comments</span>
          </TabsTrigger>
          <TabsTrigger value="internship" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Internship</span>
          </TabsTrigger>
        </TabsList>

        {/* Editorial Settings Tab */}
        <TabsContent value="editorial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pen className="h-5 w-5" />
                Editorial Section Settings
              </CardTitle>
              <CardDescription>
                Configure how editorials appear on the homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Editorial Section</Label>
                  <p className="text-sm text-muted-foreground">Display editorial section on homepage</p>
                </div>
                <Switch
                  checked={editorialSettings.showEditorialSection}
                  onCheckedChange={(checked) => 
                    setEditorialSettings({ ...editorialSettings, showEditorialSection: checked })
                  }
                />
              </div>

              <div>
                <Label>Maximum Editorials to Display</Label>
                <Input
                  type="number"
                  value={editorialSettings.maxEditorials}
                  onChange={(e) => 
                    setEditorialSettings({ ...editorialSettings, maxEditorials: parseInt(e.target.value) || 4 })
                  }
                  min={1}
                  max={10}
                  className="w-24 mt-2"
                />
              </div>

              <div>
                <Label className="mb-2 block">Featured Editorial Articles</Label>
                <div className="space-y-2">
                  {editorialArticles.map((article) => (
                    <div key={article.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <input
                        type="checkbox"
                        checked={editorialSettings.editorialIds.includes(article.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditorialSettings({
                              ...editorialSettings,
                              editorialIds: [...editorialSettings.editorialIds, article.id]
                            });
                          } else {
                            setEditorialSettings({
                              ...editorialSettings,
                              editorialIds: editorialSettings.editorialIds.filter(id => id !== article.id)
                            });
                          }
                        }}
                        className="h-4 w-4"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{article.title}</p>
                        <p className="text-xs text-muted-foreground">By {article.author.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleSaveEditorialSettings}>
                <Save className="mr-2 h-4 w-4" /> Save Editorial Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comments Settings Tab */}
        <TabsContent value="comments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Comments Section Settings
              </CardTitle>
              <CardDescription>
                Configure how reader comments appear on the homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Comments Section</Label>
                  <p className="text-sm text-muted-foreground">Display reader comments on homepage</p>
                </div>
                <Switch
                  checked={editorialSettings.showCommentsSection}
                  onCheckedChange={(checked) => 
                    setEditorialSettings({ ...editorialSettings, showCommentsSection: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Moderate Comments</Label>
                  <p className="text-sm text-muted-foreground">Require approval before publishing comments</p>
                </div>
                <Switch
                  checked={editorialSettings.moderateComments}
                  onCheckedChange={(checked) => 
                    setEditorialSettings({ ...editorialSettings, moderateComments: checked })
                  }
                />
              </div>

              <div>
                <Label>Maximum Comments to Display</Label>
                <Input
                  type="number"
                  value={editorialSettings.maxComments}
                  onChange={(e) => 
                    setEditorialSettings({ ...editorialSettings, maxComments: parseInt(e.target.value) || 4 })
                  }
                  min={1}
                  max={12}
                  className="w-24 mt-2"
                />
              </div>

              <Button onClick={handleSaveEditorialSettings}>
                <Save className="mr-2 h-4 w-4" /> Save Comments Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Internship Tab */}
        <TabsContent value="internship" className="space-y-6">
          {/* Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Internship Program Settings
              </CardTitle>
              <CardDescription>
                Configure internship program and application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div>
                    <Label>Accepting Applications</Label>
                    <p className="text-sm text-muted-foreground">Allow new internship applications</p>
                  </div>
                  <Switch
                    checked={internshipSettings.acceptingApplications}
                    onCheckedChange={(checked) => 
                      setInternshipSettings({ ...internshipSettings, acceptingApplications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div>
                    <Label>Show Banner on Homepage</Label>
                    <p className="text-sm text-muted-foreground">Display internship CTA banner</p>
                  </div>
                  <Switch
                    checked={internshipSettings.showBannerOnHomepage}
                    onCheckedChange={(checked) => 
                      setInternshipSettings({ ...internshipSettings, showBannerOnHomepage: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div>
                    <Label>Require Portfolio</Label>
                    <p className="text-sm text-muted-foreground">Make portfolio URL mandatory</p>
                  </div>
                  <Switch
                    checked={internshipSettings.requirePortfolio}
                    onCheckedChange={(checked) => 
                      setInternshipSettings({ ...internshipSettings, requirePortfolio: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div>
                    <Label>Auto-Reply Enabled</Label>
                    <p className="text-sm text-muted-foreground">Send confirmation emails</p>
                  </div>
                  <Switch
                    checked={internshipSettings.autoReplyEnabled}
                    onCheckedChange={(checked) => 
                      setInternshipSettings({ ...internshipSettings, autoReplyEnabled: checked })
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveInternshipSettings}>
                <Save className="mr-2 h-4 w-4" /> Save Internship Settings
              </Button>
            </CardContent>
          </Card>

          {/* Applications Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Internship Applications</CardTitle>
                  <CardDescription>Review and manage internship applications</CardDescription>
                </div>
                <Badge variant="outline">{applications.length} Applications</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg bg-muted">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-foreground">{app.fullName}</h4>
                        <Badge className={`${getStatusBadge(app.status)} text-white border-0 text-xs`}>
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{app.email}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>{app.university}</span>
                        <span className="capitalize">{app.department}</span>
                        <span>{format(app.submittedAt, 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedApplication(app)}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Application Details</DialogTitle>
                          </DialogHeader>
                          {selectedApplication && (
                            <div className="space-y-4 mt-4">
                              <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                  <Label className="text-xs text-muted-foreground">Full Name</Label>
                                  <p className="font-medium">{selectedApplication.fullName}</p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">Email</Label>
                                  <p className="font-medium">{selectedApplication.email}</p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">Phone</Label>
                                  <p className="font-medium">{selectedApplication.phone}</p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">University</Label>
                                  <p className="font-medium">{selectedApplication.university}</p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">Department</Label>
                                  <p className="font-medium capitalize">{selectedApplication.department}</p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">Portfolio</Label>
                                  <p className="font-medium">{selectedApplication.portfolio || 'Not provided'}</p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Cover Letter</Label>
                                <p className="mt-1 text-sm p-3 bg-muted rounded-lg">{selectedApplication.coverLetter}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  className="bg-green-500 hover:bg-green-600"
                                  onClick={() => updateApplicationStatus(selectedApplication.id, 'shortlisted')}
                                >
                                  Shortlist
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateApplicationStatus(selectedApplication.id, 'reviewed')}
                                >
                                  Mark Reviewed
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}
                                >
                                  Reject
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminEditorial;
