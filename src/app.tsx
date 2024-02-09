import { ChangeEvent, useState } from 'react';
import { Logo } from './components/logo';
import { NewNoteCard } from './components/new-note-card';
import { NoteCard } from './components/note-card';

type Note = {
  id: string;
  content: string;
  date: Date;
};

export const App = () => {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<Note[]>(() =>
    JSON.parse(localStorage.getItem('notes') || '[]'),
  );

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredNotes =
    search !== ''
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
        )
      : notes;

  const handleSaveNote = (content: string) => {
    const newNote = {
      id: crypto.randomUUID(),
      content,
      date: new Date(),
    };

    const notesArray = [newNote, ...notes];

    setNotes(notesArray);
    localStorage.setItem('notes', JSON.stringify(notesArray));
  };

  const handleDeleteNote = (id: string) => {
    const newNotes = notes.filter((note) => note.id !== id);

    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  };

  return (
    <div className="mx-auto max-w-6xl my-12 px-5 space-y-6">
      <Logo />
      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none"
          onChange={handleSearch}
          value={search}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 auto-rows-[250px] gap-6 md:grid-cols-2 lg:grid-cols-3">
        <NewNoteCard onSaveNote={handleSaveNote} />
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.content}
            note={note}
            onDeleteNote={handleDeleteNote}
          />
        ))}
      </div>
    </div>
  );
};
