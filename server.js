const express = require("express");
const PptxGenJS = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());

// Create files directory if it doesn't exist
const filesDir = path.join(__dirname, "files");

if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
}

// Serve generated files
app.use("/files", express.static(filesDir));

/*
 * Health Check
 */
app.get("/", (req, res) => {
    res.send("Salesforce PPT MCP Server Running");
});

/*
 * MCP Tool Discovery
 */
app.get("/mcp", (req, res) => {
    res.json({
        tools: [
            {
                name: "generate_ppt",
                description: "Generate a PowerPoint presentation from a prompt"
            }
        ]
    });
});

/*
 * PPT Generation Endpoint
 */
app.post("/generate_ppt", async (req, res) => {

    try {

        const prompt =
            req.body.prompt ||
            "Salesforce Presentation";

        const pptx = new PptxGenJS();

        pptx.layout = "LAYOUT_WIDE";
        pptx.author = "Salesforce MCP PPT Generator";
        pptx.company = "Salesforce";
        pptx.subject = "Generated Presentation";
        pptx.title = "Generated PPT";

        /*
         * Slide 1
         */
        let slide1 = pptx.addSlide();

        slide1.addText(
            "AI Generated Presentation",
            {
                x: 0.5,
                y: 0.5,
                w: 8,
                h: 0.5,
                bold: true,
                fontSize: 24,
                color: "003366"
            }
        );

        slide1.addText(
            prompt,
            {
                x: 0.5,
                y: 1.5,
                w: 8,
                h: 1
            }
        );

        /*
         * Slide 2
         */
        let slide2 = pptx.addSlide();

        slide2.addText(
            "Overview",
            {
                x: 0.5,
                y: 0.5,
                w: 5,
                bold: true,
                fontSize: 20
            }
        );

        slide2.addText(
            [
                { text: "Introduction" },
                { text: "Objectives" },
                { text: "Business Benefits" },
                { text: "Next Steps" }
            ],
            {
                x: 1,
                y: 1.5,
                w: 5,
                h: 2,
                bullet: { indent: 18 }
            }
        );

        const timestamp = Date.now();

        const fileName =
            `presentation_${timestamp}.pptx`;

        const filePath =
            path.join(filesDir, fileName);

        await pptx.writeFile({
            fileName: filePath
        });

        
        const baseUrl =
        `https://${req.get("host")}`;


        const downloadUrl =
            `${baseUrl}/files/${fileName}`;

        res.json({
            success: true,
            fileName: fileName,
            downloadUrl: downloadUrl
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});
