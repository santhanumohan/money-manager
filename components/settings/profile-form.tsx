'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateProfile } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState } from 'react';
import { toast } from 'sonner';

const profileSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
});

interface ProfileFormProps {
    defaultValues?: {
        fullName: string;
    };
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: defaultValues?.fullName || '',
        },
    });

    async function onSubmit(values: z.infer<typeof profileSchema>) {
        setLoading(true);
        const formData = new FormData();
        formData.append('fullName', values.fullName);

        const result = await updateProfile(formData);

        setLoading(false);

        if (result?.success) {
            toast.success("Profile updated successfully");
        } else {
            toast.error(result?.error as string || "Failed to update profile");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save changes'}
                </Button>
            </form>
        </Form>
    );
}
