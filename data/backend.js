const express = require('express');
const app = express();

// Simulate a database fetch with a delay using a callback
function fetchDataWithCallback(callback) {
    setTimeout(() => {
        const data = { id: 1, name: 'Item from Callback' };
        callback(null, data);
    }, 2000); // Simulate a 2-second delay
}

// Simulate a database fetch with a delay using async/await
function fetchDataWithPromise() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const data = { id: 2, name: 'Item from Promise' };
            resolve(data);
        }, 2000); // Simulate a 2-second delay
    });
}

// Route using a callback
app.get('/callback', (req, res) => {
    fetchDataWithCallback((error, data) => {
        if (error) {
            return res.status(500).send('An error occurred');
        }
        res.send(data);
    });
});

// Route using async/await
app.get('/async', async (req, res) => {
    try {
        const data = await fetchDataWithPromise();
        res.send(data);
    } catch (error) {
        res.status(500).send('An error occurred');
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
