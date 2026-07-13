import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  {
    name: "ppt-generator",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

server.tool(
  "generate_ppt",
  "Generate PowerPoint presentation",
  async () => {
    return {
      content: [
        {
          type: "text",
          text: "PPT generated"
        }
      ]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
