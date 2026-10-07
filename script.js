const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const errorMessage = document.querySelector("#error-message");

const searchInput = document.querySelector("#search-input");
const noteCount = document.querySelector("#note-count");
const notesList = document.querySelector("#notes-list");
const clearAllBtn = document.querySelector("#clear-all-btn");

const STORAGE_KEY = "quicknotes_app_data";

let notes = loadNotes();

function loadNotes() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error loading notes from localStorage:", e);
      return [];
    }
  }
  return [];
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function updateCount(count) {
  if (count === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (count === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${count} notes.`;
  }
}

function render() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  notesList.innerHTML = "";

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchTerm)
  );

  updateCount(notes.length);

  if (filteredNotes.length === 0 && searchTerm !== "") {
    const emptyLi = document.createElement("li");
    emptyLi.className = "no-notes-msg";
    emptyLi.textContent = "No notes match your search.";
    notesList.appendChild(emptyLi);
    return;
  }

  filteredNotes.forEach((note) => {
    const li = document.createElement("li");
    li.className = `note-card category-${note.category}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "note-content";

    const textP = document.createElement("p");
    textP.className = "note-text";
    textP.textContent = note.text;

    const metaDiv = document.createElement("div");
    metaDiv.className = "note-meta";

    const badgeSpan = document.createElement("span");
    badgeSpan.className = "category-badge";
    badgeSpan.textContent = note.category;

    const dateSpan = document.createElement("span");
    dateSpan.textContent = `• ${note.createdAt}`;

    metaDiv.appendChild(badgeSpan);
    metaDiv.appendChild(dateSpan);

    contentDiv.appendChild(textP);
    contentDiv.appendChild(metaDiv);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteNote(note.id));

    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);

    notesList.appendChild(li);
  });
}

function addNote(text, category) {
  const cleanedText = text.trim();

  if (cleanedText === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (cleanedText.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  errorMessage.textContent = "";

  const newNote = {
    id: Date.now(),
    text: cleanedText,
    category: category,
    createdAt: new Date().toLocaleString()
  };

  notes.unshift(newNote);
  saveNotes();
  render();

  noteInput.value = "";
  noteInput.focus();
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  render();
}

function clearAllNotes() {
  if (notes.length === 0) return;
  
  if (confirm("Delete all notes?")) {
    notes = [];
    saveNotes();
    render();
  }
}

noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addNote(noteInput.value, noteCategory.value);
});

searchInput.addEventListener("input", () => {
  render();
});

if (clearAllBtn) {
  clearAllBtn.addEventListener("click", clearAllNotes);
}

render();