import { supabase } from './supabaseClient';

export interface InternshipApplication {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    university: string;
    department: string;
    portfolio: string;
    coverLetter: string;
    cvFileName: string;
    submittedAt: Date;
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

export const getApplications = async (): Promise<InternshipApplication[]> => {
    const { data, error } = await supabase
        .from('internship_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

    if (error) return [];

    return data.map((a: any) => ({
        id: a.id,
        fullName: a.full_name,
        email: a.email,
        phone: a.phone,
        university: a.university,
        department: a.department,
        portfolio: a.portfolio_url,
        coverLetter: a.cover_letter,
        cvFileName: a.cv_url, // URL now
        submittedAt: new Date(a.submitted_at),
        status: a.status
    }));
};

export const saveApplication = async (application: Omit<InternshipApplication, 'id' | 'submittedAt' | 'status'>) => {
    const { data, error } = await supabase
        .from('internship_applications')
        .insert({
            full_name: application.fullName,
            email: application.email,
            phone: application.phone,
            university: application.university,
            department: application.department,
            portfolio_url: application.portfolio,
            cover_letter: application.coverLetter,
            cv_url: application.cvFileName,
            status: 'pending'
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateApplicationStatus = async (id: string, status: string) => {
    await supabase
        .from('internship_applications')
        .update({ status })
        .eq('id', id);
};

export const deleteApplication = async (id: string) => {
    await supabase
        .from('internship_applications')
        .delete()
        .eq('id', id);
};
