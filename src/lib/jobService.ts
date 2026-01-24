import { supabase } from './supabaseClient';
import { Job } from '@/types/news';

export const getJobs = async (): Promise<Job[]> => {
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }

    return data.map((job: any) => ({
        id: job.id,
        title: job.title,
        department: job.department,
        type: job.type,
        description: job.description,
        requirements: job.requirements || [],
        deadline: new Date(job.deadline),
        createdAt: new Date(job.created_at),
        isOpen: job.is_open
    }));
};

export const saveJob = async (job: Partial<Job>) => {
    const jobData = {
        title: job.title,
        department: job.department,
        type: job.type,
        description: job.description,
        requirements: job.requirements,
        deadline: job.deadline ? new Date(job.deadline).toISOString() : null,
        is_open: job.isOpen
    };

    if (job.id) {
        return await supabase
            .from('jobs')
            .update(jobData)
            .eq('id', job.id);
    } else {
        return await supabase
            .from('jobs')
            .insert(jobData);
    }
};

export const deleteJob = async (id: string) => {
    return await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
};
