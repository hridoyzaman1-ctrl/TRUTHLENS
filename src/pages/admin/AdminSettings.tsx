import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, Globe, Bell, Shield, Palette } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'TruthLens',
    tagline: 'Authentic Stories. Unbiased Voices.',
    siteDescription: 'Your trusted source for fact-based journalism.',
    contactEmail: 'contact@truthlens.com',
    socialFacebook: '',
    socialTwitter: '',
    socialInstagram: '',
    socialYoutube: '',
    enableComments: true,
    moderateComments: true,
    enableNewsletter: true,
    articlesPerPage: '10',
    defaultCategory: 'national',
    timezone: 'UTC',
    dateFormat: 'MMM d, yyyy',
    maintenanceMode: false
  });

  const handleSave = () => {
    // Simulate saving
    toast.success('Settings saved successfully!');
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Basic site configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => updateSetting('siteName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={settings.tagline}
                  onChange={(e) => updateSetting('tagline', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => updateSetting('siteDescription', e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => updateSetting('contactEmail', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Social Media
            </CardTitle>
            <CardDescription>Social media links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input
                  id="facebook"
                  value={settings.socialFacebook}
                  onChange={(e) => updateSetting('socialFacebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter URL</Label>
                <Input
                  id="twitter"
                  value={settings.socialTwitter}
                  onChange={(e) => updateSetting('socialTwitter', e.target.value)}
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram URL</Label>
                <Input
                  id="instagram"
                  value={settings.socialInstagram}
                  onChange={(e) => updateSetting('socialInstagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube URL</Label>
                <Input
                  id="youtube"
                  value={settings.socialYoutube}
                  onChange={(e) => updateSetting('socialYoutube', e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments & Newsletter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Engagement Settings
            </CardTitle>
            <CardDescription>Comments and newsletter configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Enable Comments</p>
                <p className="text-sm text-muted-foreground">Allow users to comment on articles</p>
              </div>
              <Switch
                checked={settings.enableComments}
                onCheckedChange={(checked) => updateSetting('enableComments', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Moderate Comments</p>
                <p className="text-sm text-muted-foreground">Require approval before publishing comments</p>
              </div>
              <Switch
                checked={settings.moderateComments}
                onCheckedChange={(checked) => updateSetting('moderateComments', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Enable Newsletter</p>
                <p className="text-sm text-muted-foreground">Show newsletter signup forms</p>
              </div>
              <Switch
                checked={settings.enableNewsletter}
                onCheckedChange={(checked) => updateSetting('enableNewsletter', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Display Settings
            </CardTitle>
            <CardDescription>Customize how content is displayed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="articlesPerPage">Articles Per Page</Label>
                <Select value={settings.articlesPerPage} onValueChange={(val) => updateSetting('articlesPerPage', val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select value={settings.dateFormat} onValueChange={(val) => updateSetting('dateFormat', val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MMM d, yyyy">Jan 14, 2026</SelectItem>
                    <SelectItem value="dd/MM/yyyy">14/01/2026</SelectItem>
                    <SelectItem value="MM/dd/yyyy">01/14/2026</SelectItem>
                    <SelectItem value="yyyy-MM-dd">2026-01-14</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={settings.timezone} onValueChange={(val) => updateSetting('timezone', val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                    <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                    <SelectItem value="GMT">GMT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">Take the site offline for maintenance</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
