const express = require('express');
const cors = require('cors');
const app = express();

// Enables the CORS
app.use(cors());

// Sample colors data
const colors = [
    "#69d2e7", "#a7dbd8", "#e0e4cc", "#f38630", "#fa6900",
    "#fe4365", "#fc9d9a", "#f9cdad", "#c8c8a9", "#83af9b",
    "#ecd078", "#d95b43", "#c02942", "#542437", "#53777a",
    "#556270", "#4ecdc4", "#c7f464", "#ff6b6b", "#c44d58",
    "#774f38", "#e08e79", "#f1d4af", "#ece5ce", "#c5e0dc",
    "#e8ddcb", "#cdb380", "#036564", "#033649", "#031634",
    "#490a3d", "#bd1550", "#e97f02", "#f8ca00", "#8a9b0f",
    "#594f4f", "#547980", "#45ada8", "#9de0ad", "#e5fcc2",
    "#00a0b0", "#6a4a3c", "#cc333f", "#eb6841", "#edc951",
    "#e94e77", "#d68189", "#c6a49a", "#c6e5d9", "#f4ead5",
    "#3fb8af", "#7fc7af", "#dad8a7", "#ff9e9d", "#ff3d7f",
    "#d9ceb2", "#948c75", "#d5ded9", "#7a6a53", "#99b2b7",
    "#ffffff", "#cbe86b", "#f2e9e1", "#1c140d", "#cbe86b",
    "#efffcd", "#dce9be", "#555152", "#2e2633", "#99173c",
    "#343838", "#005f6b", "#008c9e", "#00b4cc", "#00dffc",
    "#413e4a", "#73626e", "#b38184", "#f0b49e", "#f7e4be",
    "#ff4e50", "#fc913a", "#f9d423", "#ede574", "#e1f5c4",
    "#99b898", "#fecea8", "#ff847c", "#e84a5f", "#2a363b",
    "#655643", "#80bca3", "#f6f7bd", "#e6ac27", "#bf4d28",
];

// Endpoint to get colors with pagination
app.get('/colors', (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    // Validate input parameters
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return res.status(400).json({ error: 'Invalid page or limit parameters' });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const colorsPage = colors.slice(startIndex, endIndex);

    res.json({
        page,
        limit,
        totalItems: colors.length,
        totalPages: Math.ceil(colors.length / limit),
        colors: colorsPage
    });
});

// Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: 'Something went wrong!' });
// });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
