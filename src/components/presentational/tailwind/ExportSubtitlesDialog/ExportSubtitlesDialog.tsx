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
import { UnwrapPromise } from '@/types';
import { download } from '@/utils/download';
import { generatedParsedSubtitlesWithId } from '@/utils/generateParsedSubtitlesWithId';
import {
  normalizeS3FileName,
  removeExtensionFromFileName,
} from '@/utils/helpers';
import {
  convertSubtitleArrayToSRT,
  convertSubtitleArrayToVTT,
} from '@/utils/subtitle';
import { getSubtitles } from '@/utils/supabase-queries';
import { useState } from 'react';
import { useArrayState } from 'rooks';
import { z } from 'zod';

type Props = {
  runUUID: string;
  runTitle: string;
  data: UnwrapPromise<ReturnType<typeof getSubtitles>>;
};

export const ExportSubtitlesDialog = ({ runUUID, runTitle, data }: Props) => {
  const [open, setOpen] = useState(false);
  const fileNameWithoutExtension = removeExtensionFromFileName(runTitle);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="subtle" size="sm">
          Export Subtitles
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Subtitles</DialogTitle>
          <DialogDescription>Download your subtitles</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            onClick={() => {
              const originalJSONFilename = `${fileNameWithoutExtension}-original.json`;
              download(
                originalJSONFilename,
                JSON.stringify(data.original, null, 2)
              );
            }}
          >
            Export Original JSON
          </Button>
          <Button
            type="button"
            onClick={() => {
              const modifiedJSONFilename = `${fileNameWithoutExtension}-modified.json`;
              download(
                modifiedJSONFilename,
                JSON.stringify(data.modified, null, 2)
              );
            }}
          >
            Export Modified JSON
          </Button>
          <Button
            onClick={() => {
              const originalVTTFilename = `${fileNameWithoutExtension}-original.vtt`;
              download(
                originalVTTFilename,
                convertSubtitleArrayToVTT(
                  generatedParsedSubtitlesWithId(data.original)
                )
              );
            }}
            type="button"
          >
            Export Original VTT
          </Button>
          <Button
            onClick={() => {
              const modifiedVTTFilename = `${fileNameWithoutExtension}-modified.vtt`;
              download(
                modifiedVTTFilename,
                convertSubtitleArrayToVTT(
                  generatedParsedSubtitlesWithId(data.modified ?? data.original)
                )
              );
            }}
            type="button"
          >
            Export Modified VTT
          </Button>
          <Button
            onClick={() => {
              const originalSRTFilename = `${fileNameWithoutExtension}-original.srt`;
              download(
                originalSRTFilename,
                convertSubtitleArrayToSRT(
                  generatedParsedSubtitlesWithId(data.original)
                )
              );
            }}
            type="button"
          >
            Export Original SRT
          </Button>
          <Button
            onClick={() => {
              const modifiedSRTFilename = `${fileNameWithoutExtension}-modified.srt`;
              download(
                modifiedSRTFilename,
                convertSubtitleArrayToSRT(
                  generatedParsedSubtitlesWithId(data.modified ?? data.original)
                )
              );
            }}
            type="button"
          >
            Export Modified SRT
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
