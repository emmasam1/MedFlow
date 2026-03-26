import { useState } from "react";

const PatientNotes = ({ patientId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  const addNote = () => {
    if (!newNote) return;
    const noteObj = { id: Date.now(), text: newNote };
    setNotes([noteObj, ...notes]);
    setNewNote("");
  };

  return (
    <div className="rounded-2xl p-4 bg-white dark:bg-[#1E2F3F] shadow">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Patient Notes</h3>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add note..."
          className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded"
        />
        <button
          onClick={addNote}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2 max-h-[200px] overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-gray-400 text-sm">No notes yet</p>
        ) : (
          notes.map((note) => (
            <li key={note.id} className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2A435C] text-gray-800 dark:text-white">
              {note.text}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default PatientNotes;