import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/settings/profile-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground mt-1">
                    Manage your profile and account preferences.
                </p>
            </div>
            <Separator />
            
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>
                            Public information shown on your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ProfileForm defaultValues={{ fullName: user.user_metadata.full_name }} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>
                            Login and security details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 max-w-md">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={user.email} disabled readOnly />
                            <p className="text-[0.8rem] text-muted-foreground">
                                Email cannot be changed at this time.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
