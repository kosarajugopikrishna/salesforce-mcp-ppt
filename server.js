const express = require("express");
const PptxGenJS = require("pptxgenjs");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Salesforce MCP Server Running");
});

app.get("/mcp", (req, res) => {
    res.json({
        tools: [
            {
                name: "generate_ppt",
                description: "Generate a PowerPoint presentation"
            }
        ]
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
