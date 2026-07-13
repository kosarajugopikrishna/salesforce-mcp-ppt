import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import PptxGenJS from "pptxgenjs";

// 1. Initialize the official MCP Server
const server = new Server(
  {
    name: "salesforce-ppt-generator",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {}, // Tells the client this server supports tool calls
    },
  }
);

// 2. Register your tools using the official MCP schema wrapper
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "generate_ppt",
        description: "Generate a PowerPoint presentation with specified slides, text, and titles.",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string", description: "The main title of the presentation deck" },
            slides: {
              type: "array",
              description: "List of individual slides to add",
              items: {
                type: "object",
                properties: {
                  slideTitle: { type: "string", description: "The title of the slide" },
                  content: { type: "string", description: "Body text or bullet points for the slide" }
                },
                required: ["slideTitle", "content"]
              }
            }
          },
          required: ["title", "slides"]
        }
      }
    ]
  };
});

// 3. Handle the tool execution requests
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "generate_ppt") {
    throw new Error(`Unknown tool requested: ${request.params.name}`);
  }

  try {
    const { title, slides } = request.params.arguments;
    
    // Create the PowerPoint deck
    const pptx = new PptxGenJS();
    
    // Add Title Slide
    const titleSlide = pptx.addSlide();
    titleSlide.addText(title, { x: 1, y: 3, w: 8, h: 1, fontSize: 32, bold: true, align: "center" });

    // Add Content Slides dynamically
    slides.forEach((slideData) => {
      const slide = pptx.addSlide();
      slide.addText(slideData.slideTitle, { x: 0.5, y: 0.5, w: 9, h: 0.5, fontSize: 24, bold: true });
      slide.addText(slideData.content, { x: 0.5, y: 1.5, w: 9, h: 5, fontSize: 16 });
    });

    // Save presentation to a unique file path
    const fileName = `presentation_${Date.now()}.pptx`;
    await pptx.writeFile({ fileName });

    return {
      content: [
        {
          type: "text",
          text: `Success! Generated presentation successfully and saved it as locally as: ${fileName}`
        }
      ]
    };
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: `Failed to generate PowerPoint: ${error.message}` }]
    };
  }
});

// 4. Start the server using Standard Input/Output transport layer
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Salesforce MCP PPT Server running on stdio transport");
}

runServer().catch(console.error);
