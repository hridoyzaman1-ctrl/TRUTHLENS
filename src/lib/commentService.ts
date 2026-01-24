import { supabase } from './supabaseClient';
import { Comment } from '@/components/news/CommentSection';

// Map DB comment to UI Comment type
const mapComment = (c: any): Comment => ({
    id: c.id,
    author: c.author_name || 'Anonymous', // Fallback
    avatar: '', // We might need to fetch profile avatar if linked
    content: c.content,
    createdAt: new Date(c.created_at),
    likes: c.likes || 0,
    replies: [], // Populated separately or via recursive fetch if needed (but we usually fetch flat and reconstruct)
    status: c.status || 'approved',
    userVote: 'none'
});

export const getComments = async (articleId: string): Promise<Comment[]> => {
    const { data, error } = await supabase
        .from('comments')
        .select(`
            *,
            user:user_id (
                full_name,
                avatar_url
            )
        `)
        .eq('article_id', articleId)
        .order('created_at', { ascending: true }); // Oldest first for threads usually, or Newest.

    if (error) {
        console.error('Error fetching comments:', error);
        return [];
    }

    // Transform and nest replies
    const commentsMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create objects
    data.forEach((c: any) => {
        const comment: Comment = {
            id: c.id,
            author: c.user?.full_name || c.author_name || 'Anonymous',
            avatar: c.user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + c.id,
            content: c.content,
            createdAt: new Date(c.created_at),
            likes: c.likes || 0,
            replies: [],
            status: c.status,
            userVote: 'none'
        };
        commentsMap.set(c.id, comment);

        if (!c.parent_id) {
            rootComments.push(comment);
        }
    });

    // Second pass: nest replies
    data.forEach((c: any) => {
        if (c.parent_id) {
            const parent = commentsMap.get(c.parent_id);
            const reply = commentsMap.get(c.id);
            if (parent && reply) {
                if (!parent.replies) parent.replies = [];
                parent.replies.push(reply);
            }
        }
    });

    return rootComments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const saveComment = async (articleId: string, comment: Partial<Comment> & { parentId?: string, userId?: string }) => {
    // Determine author name/id from session usually, but here we accept what's passed or mock
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    const payload = {
        article_id: articleId,
        content: comment.content,
        parent_id: comment.parentId,
        user_id: user?.id, // If logged in
        author_name: user ? user.email : comment.author, // Fallback
        status: 'approved' // Default to approved for now
        // likes default 0
    };

    const { data, error } = await supabase
        .from('comments')
        .insert(payload)
        .select()
        .single();

    if (error) throw error;
    return mapComment(data);
};

export const deleteComment = async (commentId: string) => {
    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);
    if (error) throw error;
};

// Admin: Get all comments (flat list)
export const getAllComments = async () => {
    const { data, error } = await supabase
        .from('comments')
        .select(`
            *,
            article:article_id (
                title,
                slug
            )
        `)
        .order('created_at', { ascending: false });

    if (error) return [];

    return data.map((c: any) => ({
        ...mapComment(c),
        articleTitle: c.article?.title,
        articleSlug: c.article?.slug
    }));
};

export const updateCommentStatus = async (commentId: string, status: string) => {
    await supabase.from('comments').update({ status }).eq('id', commentId);
};
