import { supabase } from './supabaseClient';
import { Article } from '@/types/news';

export const getArticles = async (): Promise<Article[]> => {
    const { data, error } = await supabase
        .from('articles')
        .select(`
            *,
            author:author_id (
                id,
                name,
                avatar_url,
                role
            )
        `)
        .order('published_at', { ascending: false });

    if (error) {
        console.error('Error fetching articles:', error);
        return [];
    }

    return data.map((a: any) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        content: a.content,
        category: a.category,
        image: a.image_url,
        featuredImage: a.image_url,
        videoUrl: a.video_url,
        hasVideo: a.has_video,
        author: {
            id: a.author?.id,
            name: a.author?.name || 'Unknown',
            email: '',
            avatar: a.author?.avatar_url,
            bio: '',
            role: a.author?.role
        },
        publishedAt: a.published_at ? new Date(a.published_at) : new Date(a.created_at),
        createdAt: new Date(a.created_at),
        updatedAt: a.updated_at ? new Date(a.updated_at) : new Date(a.created_at),
        views: a.views || 0,
        isBreaking: a.is_breaking,
        isFeatured: a.is_featured,
        tags: [],
        status: a.published_at ? 'published' : 'draft'
    }));
};

export const getArticleBySlug = async (slug: string): Promise<Article | undefined> => {
    const { data, error } = await supabase
        .from('articles')
        .select(`
            *,
            author:author_id (
                id,
                name,
                avatar_url,
                role
            )
        `)
        .eq('slug', slug)
        .single();

    if (error || !data) return undefined;

    return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        featuredImage: data.image_url,
        videoUrl: data.video_url,
        hasVideo: data.has_video,
        author: {
            id: data.author?.id,
            name: data.author?.name || 'Unknown',
            email: '',
            avatar: data.author?.avatar_url,
            bio: '',
            role: data.author?.role
        },
        publishedAt: data.published_at ? new Date(data.published_at) : new Date(data.created_at),
        createdAt: new Date(data.created_at),
        updatedAt: data.updated_at ? new Date(data.updated_at) : new Date(data.created_at),
        views: data.views || 0,
        isBreaking: data.is_breaking,
        isFeatured: data.is_featured,
        tags: [],
        status: data.published_at ? 'published' : 'draft'
    } as Article;
};

export const incrementArticleViews = async (id: string) => {
    const { error } = await supabase.rpc('increment_views', { article_id: id });
    if (error) console.error('Error incrementing views:', error);
};

export const saveArticle = async (article: Partial<Article>) => {
    // This function needs to handle insert or update
    // Get current user if author not specified
    const { data: { user } } = await supabase.auth.getUser();

    const articleData = {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        image_url: article.featuredImage,
        video_url: article.videoUrl,
        has_video: article.hasVideo,
        is_featured: article.isFeatured,
        is_breaking: article.isBreaking,
        published_at: article.status === 'published' ? new Date().toISOString() : null,
        author_id: article.author?.id || user?.id,
    };

    let result;
    if (article.id) {
        result = await supabase
            .from('articles')
            .update(articleData)
            .eq('id', article.id);
    } else {
        result = await supabase
            .from('articles')
            .insert(articleData);
    }

    // Dispatch event for UI updates
    window.dispatchEvent(new Event('articlesUpdated'));
    return result;
};

export const deleteArticle = async (id: string) => {
    const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting article:', error);
        throw error;
    }
    window.dispatchEvent(new Event('articlesUpdated'));
};
