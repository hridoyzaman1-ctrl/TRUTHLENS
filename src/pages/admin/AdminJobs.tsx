import { useState } from 'react';
import { jobs as initialJobs } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Save, Briefcase, Calendar, Users, Eye, EyeOff } from 'lucide-react';
import { Job } from '@/types/news';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const AdminJobs = () => {
  const [jobsList, setJobsList] = useState<Job[]>(initialJobs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    type: 'full-time' as Job['type'],
    description: '',
    requirements: '',
    deadline: '',
    isOpen: true
  });

  const openCreateDialog = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      department: '',
      type: 'full-time',
      description: '',
      requirements: '',
      deadline: '',
      isOpen: true
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      type: job.type,
      description: job.description,
      requirements: job.requirements.join('\n'),
      deadline: format(job.deadline, 'yyyy-MM-dd'),
      isOpen: job.isOpen
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requirements = formData.requirements.split('\n').filter(r => r.trim());

    if (editingJob) {
      setJobsList(prev => prev.map(job => 
        job.id === editingJob.id 
          ? {
              ...job,
              title: formData.title,
              department: formData.department,
              type: formData.type,
              description: formData.description,
              requirements,
              deadline: new Date(formData.deadline),
              isOpen: formData.isOpen
            }
          : job
      ));
      toast.success('Job updated successfully!');
    } else {
      const newJob: Job = {
        id: Date.now().toString(),
        title: formData.title,
        department: formData.department,
        type: formData.type,
        description: formData.description,
        requirements,
        deadline: new Date(formData.deadline),
        isOpen: formData.isOpen,
        createdAt: new Date()
      };
      setJobsList(prev => [newJob, ...prev]);
      toast.success('Job created successfully!');
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      setJobsList(prev => prev.filter(job => job.id !== id));
      toast.success('Job deleted successfully!');
    }
  };

  const toggleJobStatus = (id: string) => {
    setJobsList(prev => prev.map(job => 
      job.id === id ? { ...job, isOpen: !job.isOpen } : job
    ));
    toast.success('Job status updated!');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Job Listings</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          New Job
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-xl bg-card p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{jobsList.filter(j => j.isOpen).length}</p>
              <p className="text-sm text-muted-foreground">Open Positions</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-card p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{jobsList.filter(j => j.type === 'internship').length}</p>
              <p className="text-sm text-muted-foreground">Internships</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-card p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{jobsList.length}</p>
              <p className="text-sm text-muted-foreground">Total Jobs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobsList.map((job) => (
          <div key={job.id} className="rounded-xl bg-card p-6 border border-border hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-display text-lg font-semibold text-foreground">{job.title}</h3>
                  <Badge variant={job.isOpen ? 'default' : 'secondary'}>
                    {job.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                  <Badge variant="outline" className="capitalize">{job.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{job.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span>Department: {job.department}</span>
                  <span>Deadline: {format(job.deadline, 'MMM d, yyyy')}</span>
                  <span>Requirements: {job.requirements.length}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleJobStatus(job.id)}
                  title={job.isOpen ? 'Close job' : 'Open job'}
                >
                  {job.isOpen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(job)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(job.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {jobsList.length === 0 && (
          <div className="rounded-xl bg-muted p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No jobs posted yet</p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingJob ? 'Edit Job' : 'Create New Job'}</DialogTitle>
            <DialogDescription>
              {editingJob ? 'Update job listing details.' : 'Create a new job listing.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Senior Reporter"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g., Editorial"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Job Type *</Label>
                <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val as Job['type'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the role"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements (one per line) *</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="3+ years of experience&#10;Excellent writing skills&#10;Team player"
                rows={5}
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="isOpen"
                checked={formData.isOpen}
                onCheckedChange={(checked) => setFormData({ ...formData, isOpen: checked })}
              />
              <Label htmlFor="isOpen">Job is open for applications</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {editingJob ? 'Update Job' : 'Create Job'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminJobs;
