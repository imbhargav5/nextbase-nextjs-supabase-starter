// a tailwind component that renders a list of speakers
// with an input which shows the speaker's name and can be edited
// to rename the speaker

import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useState } from 'react';
import { useArrayState } from 'rooks';
import { z } from 'zod';

type Props = {
  speakers: Array<string>;
  updateSpeakers: (newSpeakers: Array<string>) => void;
};

const speakersSchema = z.array(
  z
    .string()
    .min(1, { message: 'Speaker name must be at least 1 character' })
    .max(64, { message: 'Speaker name must be at most 64 characters' })
);

export const ManageSpeakers = ({ speakers, updateSpeakers }: Props) => {
  const [values, controls] = useArrayState(speakers);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="subtle" size="sm">
          Manage Speakers
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Speakers</DialogTitle>
          <DialogDescription>
            Make changes to your speaker list here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {values.map((speaker, index) => {
            return (
              <Label key={index} className="space-y-2">
                <span>Speaker {index + 1}</span>
                <Input
                  value={speaker}
                  onChange={(e) => {
                    controls.replaceItemAtIndex(index, e.target.value);
                  }}
                />
              </Label>
            );
          })}
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              try {
                const newSpeakers = speakersSchema.parse(values);
                updateSpeakers(newSpeakers);
                setOpen(false);
              } catch (error) {
                alert(error.message);
              }
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
