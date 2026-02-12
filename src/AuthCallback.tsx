import { supabase } from "../lib/supabase";
import { User, UserRole } from "../App";

export async function getUserWithRole(): Promise<User | null> {
    // get auth user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // check role from public.users table
    let { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user.id)
        .single();

    // if no record (likely Google login first time)
    if (error && error.code === 'PGRST116') {
        const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert({
                user_id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                role: "patient", // default role
            })
            .select()
            .single();

        if (insertError) {
            console.error("Error creating user profile:", insertError);
            return null;
        }
        data = newUser;
    } else if (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }

    return {
        id: user.id,
        name: data.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        role: data.role as UserRole,
        avatar: data.avatar_url || user.user_metadata?.avatar_url,
    };
}
