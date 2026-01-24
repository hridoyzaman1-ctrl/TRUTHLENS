import { supabase } from './supabaseClient';
import { TeamMember } from '@/types/team';

export const getTeamMembers = async (): Promise<TeamMember[]> => {
    const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching team members:', error);
        return [];
    }

    return data.map((m: any) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        bio: m.bio,
        image: m.avatar_url,
        // Assuming TeamMember type expects separate fields or social object
        // Based on types/team.ts viewer content:
        // id, name, role, image, bio, email, twitter, linkedin, order
        email: m.email,
        twitter: m.twitter_url,
        linkedin: m.linkedin_url,
        order: m.display_order
    }));
};

export const saveTeamMembers = async (members: TeamMember[]) => {
    console.warn('saveTeamMembers bulk not fully optimized, saving individually');
    for (const m of members) {
        await upsertTeamMember(m);
    }
};

export const upsertTeamMember = async (member: Partial<TeamMember>) => {
    const payload = {
        name: member.name,
        role: member.role,
        bio: member.bio,
        avatar_url: member.image,
        twitter_url: member.twitter,
        linkedin_url: member.linkedin,
        email: member.email,
        display_order: member.order || 0
    };

    if (member.id && !member.id.startsWith('temp')) {
        await supabase.from('team_members').update(payload).eq('id', member.id);
    } else {
        await supabase.from('team_members').insert(payload);
    }
    window.dispatchEvent(new Event('teamMembersUpdated'));
};

export const deleteTeamMember = async (id: string) => {
    await supabase.from('team_members').delete().eq('id', id);
    window.dispatchEvent(new Event('teamMembersUpdated'));
};
