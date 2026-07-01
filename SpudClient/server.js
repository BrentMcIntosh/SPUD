// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Tell Express to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '')));

// Default route to serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
