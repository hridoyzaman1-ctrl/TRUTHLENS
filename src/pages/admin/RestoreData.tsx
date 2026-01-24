import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';
import { articles, authors, jobs, socialMediaLinks } from '@/data/mockData'; // Assuming siteSettings isn't directly needed or handled separately
import { toast } from 'sonner';
import { Loader2, Database, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const RestoreData = () => {
    const [isRestoring, setIsRestoring] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

    const handleRestore = async () => {
        setIsRestoring(true);
        setLogs([]);
        addLog('Starting restoration process...');

        try {
            // 1. Restore/Upsert Team Members (Authors)
            addLog('Restoring authors to team_members...');
            const authorMap = new Map<string, string>(); // MockID -> RealID

            for (const author of authors) {
                // Check if exists by name to avoid duplicates
                const { data: existing } = await supabase
                    .from('team_members')
                    .select('id')
                    .eq('name', author.name)
                    .single();

                let authorId = existing?.id;

                if (!authorId) {
                    const { data, error } = await supabase
                        .from('team_members')
                        .insert({
                            name: author.name,
                            role: author.role,
                            avatar_url: author.avatar,
                            bio: author.bio,
                            email: author.email
                        })
                        .select()
                        .single();

                    if (error) throw error;
                    authorId = data.id;
                    addLog(`Created author: ${author.name}`);
                } else {
                    addLog(`Found existing author: ${author.name}`);
                }
                authorMap.set(author.id, authorId);
            }

            // 2. Restore Articles
            addLog('Restoring articles...');
            for (const article of articles) {
                // Map mock author ID to real team_member ID
                const realAuthorId = authorMap.get(article.author.id);

                const { error } = await supabase
                    .from('articles')
                    .upsert({
                        title: article.title,
                        slug: article.slug,
                        excerpt: article.excerpt,
                        content: article.content,
                        category: article.category,
                        image_url: article.featuredImage,
                        video_url: article.videoUrl || null,
                        has_video: article.hasVideo || false,
                        author_id: realAuthorId, // Links to team_members now
                        published_at: article.publishedAt.toISOString(),
                        created_at: article.createdAt.toISOString(),
                        is_breaking: article.isBreaking,
                        is_featured: article.isFeatured,
                        views: article.views
                    }, { onConflict: 'slug' });

                if (error) {
                    addLog(`Error restoring article ${article.title}: ${error.message}`);
                    // Don't throw, continue
                } else {
                    addLog(`Restored article: ${article.title}`);
                }
            }

            // 3. Restore Jobs
            addLog('Restoring jobs...');
            for (const job of jobs) {
                const { error } = await supabase
                    .from('jobs')
                    .upsert({
                        title: job.title,
                        department: job.department,
                        type: job.type,
                        description: job.description,
                        requirements: job.requirements,
                        deadline: job.deadline.toISOString(),
                        is_open: job.isOpen,
                        created_at: job.createdAt.toISOString()
                    }); // No unique key besides ID, so upsert might duplicate if run multiple times without IDs. 
                // Ideally we'd match on title, but for now we just insert.
                // Actually, let's just insert if not exists or let it duplicate (safe for restoration on empty DB)
                if (error) addLog(`Error restoring job ${job.title}: ${error.message}`);
                else addLog(`Restored job: ${job.title}`);
            }

            // 4. Update Site Settings
            addLog('Updating site settings...');
            const { error: settingsError } = await supabase
                .from('site_settings')
                .upsert({
                    key: 'site',
                    value: {
                        siteName: 'TruthLens',
                        tagline: 'Authentic Stories. Unbiased Voices.',
                        contactEmail: 'contact@truthlens.com',
                        socialLinks: socialMediaLinks
                    }
                });
            if (settingsError) addLog(`Error updating settings: ${settingsError.message}`);
            else addLog('Site settings updated.');

            toast.success('Restoration complete!');
            addLog('DONE.');

        } catch (error: any) {
            console.error(error);
            addLog(`CRITICAL ERROR: ${error.message}`);
            toast.error('Restoration failed');
        } finally {
            setIsRestoring(false);
        }
    };

    return (
        <div className="container mx-auto py-10 max-w-3xl">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-6 w-6 text-primary" />
                        Restore Database Content
                    </CardTitle>
                    <CardDescription>
                        Use this tool to restore the original articles, authors, and jobs to the Supabase database.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                            Before running this, you MUST run the SQL migration script to add video columns and update the author relationship.
                            <br />
                            <strong>File:</strong> <code>supabase/migrations/restore_content.sql</code>
                        </AlertDescription>
                    </Alert>

                    <div className="bg-slate-950 p-4 rounded-md h-64 overflow-y-auto font-mono text-xs text-slate-50">
                        {logs.length === 0 ? (
                            <span className="text-slate-500">// Logs will appear here...</span>
                        ) : (
                            logs.map((log, i) => <div key={i}>{log}</div>)
                        )}
                    </div>

                    <Button
                        onClick={handleRestore}
                        disabled={isRestoring}
                        className="w-full"
                        size="lg"
                    >
                        {isRestoring ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Restoring...
                            </>
                        ) : (
                            'Start Restoration'
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default RestoreData;
