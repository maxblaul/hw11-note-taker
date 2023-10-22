// Import needed modules
const fs = require('fs');
const express = require("express");
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Initialize db variable with data from 'db.json' 
let db = require('./db/db.json');

// Import the 'uuid' module, this creates unique identifiers
const { v4: uuidv4 } = require('uuid');

// Middleware for parsing JSON, url encoded data, and serving static files
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

// Reads 'db.json' file and parses the data
fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    db = JSON.parse(data);
});

// Handle GET request retrieving notes
app.get('/api/notes', (req, res) => {
    res.json(db);
});

// POST request to add new notes
app.post('/api/notes', (req, res) => {
    const newNote = req.body;

    // Generating unique id for new notes
    newNote.id = uuidv4();

    // Push new note to 'db' array
    db.push(newNote);

    // Writes changes to 'db' array to 'db.json'
    fs.writeFileSync('./db/db.json', JSON.stringify(db));

    // Sends a response with new note updates
    res.json(db);
});

// DELETE request
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    // Filters the selected note to be deleted from 'db' array
    db = db.filter((note) => note.id !== noteId);

    // Writes updates that reflect deletion
    fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
        if (err) throw err;
        res.json(db);
    });
});

// Defining routes to serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Catch-all route to serve the index.html file or any unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the Express server and listen on Local Host port (3001)
app.listen(PORT, () => console.log(`Listening on PORT: http://localhost:${PORT}`))