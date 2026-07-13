import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

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

server.setRequestHandler(
  ListToolsRequestSchema,
  async () => ({
    tools: [
      {
        name: "generate_ppt",
        description: "Generate PowerPoint"
      }
    ]
  })
);

server.setRequestHandler(
  CallToolRequestSchema,
  async (request) => {

    if (request.params.name === "generate_ppt") {

      return {
        content: [
          {
            type: "text",
            text: "PowerPoint generated"
          }
        ]
      };
    }
  }
);
