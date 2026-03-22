'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const schema = z.object({
  revenue_this_wk: z.number().min(0).default(0),
  revenue_last_wk: z.number().min(0).default(0),
  active_users: z.number().min(0).default(0),
  top_achievement: z.string().min(1).max(500),
  biggest_blocker: z.string().min(1).max(500),
  ask_for_help: z.string().max(500).optional(),
  morale: z.number().min(1).max(5),
});

interface WeeklyUpdateFormProps {
  cohortId: string;
  teamId: string;
  weekNumber: number;
  userId: string;
}

export function WeeklyUpdateForm({ cohortId, teamId, weekNumber, userId }: WeeklyUpdateFormProps) {
  const { toast } = useToast();
  const qc = useQueryClient();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      revenue_this_wk: 0,
      revenue_last_wk: 0,
      active_users: 0,
      top_achievement: '',
      biggest_blocker: '',
      ask_for_help: '',
      morale: 3,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      const response = await fetch(`/api/accelerator/cohorts/${cohortId}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          teamId,
          weekNumber,
          cohortId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit update');
      }

      return response.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cohort-updates', cohortId, teamId] });
      toast({
        title: 'Weekly update submitted',
        description: `Week ${weekNumber} update has been successfully submitted.`,
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: 'Submission failed',
        description: error.message || 'There was an error submitting your update. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Update - Week {weekNumber}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'revenue_this_wk', label: 'Revenue this week ($)', type: 'number' },
              { name: 'revenue_last_wk', label: 'Revenue last week ($)', type: 'number' },
              { name: 'active_users', label: 'Active users', type: 'number' },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <Label htmlFor={name}>{label}</Label>
                <Input
                  id={name}
                  type={type}
                  {...register(name as any, { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors[name as keyof typeof errors] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[name as keyof typeof errors]?.message as string}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {[
              { name: 'top_achievement', label: 'Top achievement this week', rows: 2 },
              { name: 'biggest_blocker', label: 'Biggest blocker right now', rows: 2 },
              { name: 'ask_for_help', label: 'What do you need help with? (optional)', rows: 2 },
            ].map(({ name, label, rows }) => (
              <div key={name}>
                <Label htmlFor={name}>{label}</Label>
                <Textarea
                  id={name}
                  rows={rows}
                  {...register(name as any)}
                  className="mt-1"
                />
                {errors[name as keyof typeof errors] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[name as keyof typeof errors]?.message as string}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div>
            <Label className="block mb-2">Team morale (1–5)</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <label key={n} className="cursor-pointer">
                  <input
                    type="radio"
                    {...register('morale', { valueAsNumber: true })}
                    value={n}
                    className="sr-only"
                  />
                  <span className="text-2xl hover:scale-110 transition-transform block">
                    {['😞', '😐', '🙂', '😊', '🚀'][n - 1]}
                  </span>
                </label>
              ))}
            </div>
            {errors.morale && (
              <p className="text-red-500 text-sm mt-1">
                {errors.morale.message as string}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full md:w-auto"
          >
            {mutation.isPending ? 'Submitting...' : 'Submit weekly update'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}