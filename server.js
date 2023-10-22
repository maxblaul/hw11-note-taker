const fs = require('fs');
const express = require("express");
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;
let db = require('./db/db.json');

const { v4: uuidv4 } = require('uuid');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    db = JSON.parse(data);
});

app.get('/api/notes', (req, res) => {
    res.json(db);
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;

    newNote.id = uuidv4();

    db.push(newNote);

    fs.writeFileSync('./db/db.json', JSON.stringify(db));

    res.json(db);
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    db = db.filter((note) => note.id !== noteId);

    fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
        if (err) throw err;
        res.json(db);
    });
});
//  => {
//     const newDb = db.filter((note) =>
//     note.id !== req.params.id);

//     fs.writeFile('./db/db.json', JSON.stringify(db). (err) => {
//         if (err) throw err;
//     });

//     res.json(dbb);
// });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.listen(PORT, () => console.log(`Listening on PORT: http://localhost:${PORT}`))

