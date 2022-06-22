const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3001

const app = express();

app.use(express.json()); // Needed for access req.body

app.use(express.static('public')); // Needed for sending css and js files back

// HTML Routes setup
// Landing page
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// API routes setup
app.get('/api/notes', (req, res) => {
  // Read file db.json
  // fs.readFile('db/db.json', (err, data) => {
  //     if (err) throw err;
  //     let jsonResponse = JSON.parse(data);
  //     console.log(jsonResponse);

  //     // Return response
  //     res.status(200).json(jsonResponse)
  // });

  const data = fs.readFileSync('db/db.json')
  let jsonResponse = JSON.parse(data);
  console.log(jsonResponse);

  // Return response
  res.status(200).json(jsonResponse)
  // 
})

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  // Load all notes currently saved in db.json
  fs.readFile('db/db.json', (err, data) => {
    if (err) throw err;
    let currentNotes = JSON.parse(data);
    console.log(currentNotes);

    let newNoteId;
    // Create Id for the new note
    if (currentNotes.length === 0) {
      newNoteId = 0;
    } else {
      newNoteId = currentNotes[currentNotes.length - 1].id + 1
    }


    // Create new note object
    const newNote = {
      id: newNoteId,
      title: title,
      text: text,
    }
    // Store new note in the current array of notes
    currentNotes.push(newNote)
    // Write new array of notes into db.json
    fs.writeFileSync('db/db.json', JSON.stringify(currentNotes))
    // Returns the new note
    res.status(200).json(newNote)
  });
})

app.delete('/api/notes/:noteId', (req, res) => {
  const toDeleteNoteId = req.params.noteId;

  const data = fs.readFileSync('db/db.json')
  const currentNotes = JSON.parse(data)

  const newNotes = currentNotes.filter(note => note.id.toString() !== toDeleteNoteId.toString())


  fs.writeFileSync('db/db.json', JSON.stringify(newNotes))

  res.status(200).json({ status: "Deleted" })

})

// Run server
app.listen(process.env.PORT || PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);