import { useEffect, useRef, useState } from 'preact/hooks';
import { submitReport, uploadScreenshot } from './api';
import { Annotator, type Tool } from './annotator';
import { captureScreenshot } from './capture';
import { collectMetadata } from './metadata';
import { buildIngestPayload, type FeedbackType } from './payload';

type Step = 'idle' | 'capturing' | 'editing' | 'sending' | 'done' | 'error';

export function WidgetApp({ origin, projectKey }: { origin: string; projectKey: string }) {
  const [step, setStep] = useState<Step>('idle');
  const [tool, setTool] = useState<Tool>('pen');
  const [type, setType] = useState<FeedbackType>('bug');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const annotatorRef = useRef<Annotator | null>(null);

  const open = async () => {
    setStep('capturing');
    try {
      const blob = await captureScreenshot();
      setStep('editing');
      requestAnimationFrame(async () => {
        if (!canvasRef.current) return;
        const annotator = new Annotator(canvasRef.current);
        annotatorRef.current = annotator;
        await annotator.loadImage(blob);
      });
    } catch {
      setErrorMsg('Could not capture this page. Please try again.');
      setStep('error');
    }
  };

  useEffect(() => {
    if (annotatorRef.current) annotatorRef.current.tool = tool;
  }, [tool]);

  const close = () => {
    annotatorRef.current?.destroy();
    annotatorRef.current = null;
    setStep('idle');
    setDescription('');
  };

  const send = async () => {
    setStep('sending');
    try {
      const payload = buildIngestPayload({
        projectKey,
        type,
        description,
        reporterName: name,
        reporterEmail: email,
        metadata: collectMetadata(),
      });
      const { uploadUrl } = await submitReport(origin, payload);
      const flattened = await annotatorRef.current!.toBlob();
      await uploadScreenshot(uploadUrl, flattened);
      setStep('done');
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Submission failed');
      setStep('error');
    }
  };

  if (step === 'idle') {
    return (
      <button class="launcher" onClick={open}>
        Feedback
      </button>
    );
  }

  return (
    <div class="overlay">
      <div class="panel">
        {step === 'capturing' && <div class="msg">Capturing screenshot…</div>}
        {step === 'sending' && <div class="msg">Sending…</div>}
        {step === 'done' && (
          <div class="msg">
            Thanks for your feedback!
            <div class="actions">
              <button class="primary" onClick={close}>
                Close
              </button>
            </div>
          </div>
        )}
        {step === 'error' && (
          <div class="msg error">
            {errorMsg}
            <div class="actions">
              <button onClick={close}>Close</button>
            </div>
          </div>
        )}
        {step === 'editing' && (
          <div>
            <div class="toolbar">
              {(['pen', 'rect', 'arrow', 'blackout'] as Tool[]).map((t) => (
                <button class={tool === t ? 'active' : ''} onClick={() => setTool(t)}>
                  {t}
                </button>
              ))}
              <button onClick={() => annotatorRef.current?.undo()}>undo</button>
            </div>
            <div class="canvas-wrap">
              <canvas ref={canvasRef} />
            </div>
            <div class="row">
              <div class="field">
                <label>Type</label>
                <select value={type} onChange={(e) => setType((e.target as HTMLSelectElement).value as FeedbackType)}>
                  <option value="bug">Bug</option>
                  <option value="idea">Idea</option>
                  <option value="question">Question</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label>Description</label>
              <textarea
                rows={3}
                value={description}
                onInput={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
              />
            </div>
            <div class="row">
              <div class="field">
                <label>Your name (optional)</label>
                <input value={name} onInput={(e) => setName((e.target as HTMLInputElement).value)} />
              </div>
              <div class="field">
                <label>Your email (optional)</label>
                <input value={email} onInput={(e) => setEmail((e.target as HTMLInputElement).value)} />
              </div>
            </div>
            <div class="actions">
              <button onClick={close}>Cancel</button>
              <button class="primary" disabled={description.trim().length === 0} onClick={send}>
                Send feedback
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
