import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner';

type NewNoteCardProps = {
  onSaveNote: (content: string) => void;
};

let recognition: SpeechRecognition | null = null;

export const NewNoteCard = ({ onSaveNote }: NewNoteCardProps) => {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleStartEditor = () => {
    setShouldShowOnboarding(false);
  };

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setContent(event.target.value);
    if (event.target.value === '') setShouldShowOnboarding(true);
  };

  const handleSaveNote = (event: FormEvent) => {
    event.preventDefault();
    if (content === '') return;
    onSaveNote(content);
    setContent('');
    setShouldShowOnboarding(true);
    toast.success('Nota criada com sucesso!');
  };

  const handleStartRecording = () => {
    const isSpeechRecognitionSupported =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

    if (!isSpeechRecognitionSupported) {
      toast.error('Seu navegador não suporta gravação de áudio.');
      setIsRecording(false);
      return;
    }
    setIsRecording(true);
    setShouldShowOnboarding(false);
    toast.info('Gravando nota...');

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    recognition = new SpeechRecognition();

    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.maxAlternatives = 1;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).reduce((text, acc) => {
        return text.concat(acc[0].transcript);
      }, '');
      setContent(transcript);
    };

    recognition.onerror = (event) => {
      console.error(event);
    };
    recognition.start();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    recognition?.stop();
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md bg-slate-700 p-5 outline-none text-left flex flex-col gap-3 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>

        <p className="text-sm leading-6 text-slate-400">
          {' '}
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed flex flex-col inset-0 md:inset-auto overflow-hidden md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] w-full bg-slate-600 md:rounded-md  outline-none ">
          <Dialog.Close className="absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>
          <form className="flex flex-col flex-1">
            <div className="flex flex-1 flex-col gap-3 p-5 ">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>
              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{' '}
                  <button
                    className="text-lime-400 font-medium hover:underline"
                    onClick={handleStartRecording}
                    type="button"
                  >
                    gravando uma nota
                  </button>{' '}
                  em áudio ou se preferir{' '}
                  <button
                    onClick={handleStartEditor}
                    className="text-lime-400 font-medium hover:underline"
                    type="button"
                  >
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="bg-transparent outline-none resize-none flex-1 text-sm leading-6 text-slate-400"
                  onChange={handleContentChange}
                  value={content}
                />
              )}
            </div>
            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="flex gap-2 items-center justify-center hover:text-slate-100 w-full disabled:cursor-not-allowed bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium "
              >
                <div className="size-3 bg-red-500 rounded-full animate-pulse" />
                Gravando (clique para interromper)
              </button>
            ) : (
              <button
                disabled={content === ''}
                onClick={handleSaveNote}
                type="button"
                className="hover:bg-lime-500 w-full disabled:cursor-not-allowed bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium "
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
