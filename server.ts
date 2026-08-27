import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// In-memory project storage
interface ProjectRecord {
  id: string;
  title: string;
  description?: string;
  prompt?: string;
  cursorType: string;
  layers: any[];
  hotspot: { x: number; y: number };
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author?: string;
  isFeatured?: boolean;
}

const savedProjects = new Map<string, ProjectRecord>();

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 2. Get saved projects
app.get("/api/projects", (req, res) => {
  const projects = Array.from(savedProjects.values()).sort(
    (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
  );
  res.json(projects);
});

// 3. Get single project
app.get("/api/projects/:id", (req, res) => {
  const project = savedProjects.get(req.params.id);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }
  res.json(project);
});

// 4. Save/Update project
app.post("/api/projects", (req, res) => {
  const body = req.body;
  if (!body || !body.title || !Array.isArray(body.layers)) {
    return res.status(400).json({ error: "Invalid project payload" });
  }

  const id = body.id || `proj-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const now = new Date().toISOString();

  const record: ProjectRecord = {
    id,
    title: String(body.title).trim() || "Untitled Cursor",
    description: body.description || "",
    prompt: body.prompt || "",
    cursorType: body.cursorType || "normal",
    layers: body.layers,
    hotspot: body.hotspot || { x: 2, y: 2 },
    tags: Array.isArray(body.tags) ? body.tags : ["custom"],
    createdAt: body.createdAt || now,
    updatedAt: now,
    author: body.author || "Guest Designer",
    isFeatured: false,
  };

  savedProjects.set(id, record);
  res.json({ success: true, project: record });
});

// 5. AI Cursor Generation via Gemini API
app.post("/api/ai/generate-cursor", async (req, res) => {
  const { prompt, cursorType = "normal" } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `You are an expert Windows Cursor Vector Designer for Cursed Cursors Studio.
Your task is to generate valid 32x32 vector layers for a custom Windows cursor based on the user's prompt and cursor type.

COORDINATE SYSTEM & CONSTRAINTS:
- The cursor canvas is exactly 32x32 units (x: 0 to 32, y: 0 to 32).
- The hotspot should be logical: for 'normal' arrow or 'pointer' hand, typically (2, 2) or (9, 2); for 'crosshair', 'wait', or 'text', typically (16, 16).
- Supported layer types: 'polygon', 'rect', 'circle', 'triangle', 'star', 'pixel', 'text', 'emoji', 'line'.
- Polygons use a list of { x, y } points within 0..32.
- Pixels use a list of { x, y, color } points within 0..32.
- Make the cursor look high quality with nice colors, glowing borders, and high contrast.
- Return 2 to 5 distinct, well-crafted layers (e.g. background aura/glow layer, main body polygon, core accent/highlight layer).`;

      const userPrompt = `Generate a cursor for prompt: "${prompt}", cursor type: "${cursorType}".`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              cursorType: { type: Type.STRING },
              hotspot: {
                type: Type.OBJECT,
                properties: {
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                },
                required: ["x", "y"],
              },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              layers: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    type: { type: Type.STRING },
                    visible: { type: Type.BOOLEAN },
                    locked: { type: Type.BOOLEAN },
                    opacity: { type: Type.NUMBER },
                    x: { type: Type.NUMBER },
                    y: { type: Type.NUMBER },
                    width: { type: Type.NUMBER },
                    height: { type: Type.NUMBER },
                    rotation: { type: Type.NUMBER },
                    borderRadius: { type: Type.NUMBER },
                    points: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          x: { type: Type.NUMBER },
                          y: { type: Type.NUMBER },
                        },
                      },
                    },
                    pixels: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          x: { type: Type.NUMBER },
                          y: { type: Type.NUMBER },
                          color: { type: Type.STRING },
                        },
                      },
                    },
                    fill: { type: Type.STRING },
                    stroke: { type: Type.STRING },
                    strokeWidth: { type: Type.NUMBER },
                    glow: {
                      type: Type.OBJECT,
                      properties: {
                        enabled: { type: Type.BOOLEAN },
                        color: { type: Type.STRING },
                        blur: { type: Type.NUMBER },
                        intensity: { type: Type.NUMBER },
                      },
                    },
                    shadow: {
                      type: Type.OBJECT,
                      properties: {
                        enabled: { type: Type.BOOLEAN },
                        color: { type: Type.STRING },
                        blur: { type: Type.NUMBER },
                        offsetX: { type: Type.NUMBER },
                        offsetY: { type: Type.NUMBER },
                      },
                    },
                  },
                  required: ["id", "name", "type", "visible", "locked", "opacity", "fill", "stroke", "strokeWidth"],
                },
              },
            },
            required: ["title", "description", "layers", "hotspot", "tags"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      if (parsed.layers && parsed.layers.length > 0) {
        return res.json({
          title: parsed.title || "AI Generated Cursor",
          description: parsed.description || prompt,
          cursorType: parsed.cursorType || cursorType,
          hotspot: parsed.hotspot || { x: 2, y: 2 },
          tags: parsed.tags || ["ai", "generated"],
          layers: parsed.layers,
        });
      }
    } catch (err: any) {
      console.warn("Gemini generation error, falling back to synthesis generator:", err.message);
    }
  }

  // Graceful synthesis fallback generator if API key not available or API error
  const fallback = generateProceduralCursor(prompt, cursorType);
  return res.json(fallback);
});

// Procedural fallback cursor synthesis
function generateProceduralCursor(prompt: string, cursorType: string) {
  const p = prompt.toLowerCase();
  const isNeon = p.includes("neon") || p.includes("cyber") || p.includes("glow");
  const isPink = p.includes("pink") || p.includes("magenta") || p.includes("rose") || p.includes("bloom");
  const isGreen = p.includes("green") || p.includes("emerald") || p.includes("matrix");
  const isPurple = p.includes("purple") || p.includes("void") || p.includes("violet");
  const isRed = p.includes("red") || p.includes("fire") || p.includes("ember");
  const isGold = p.includes("gold") || p.includes("yellow") || p.includes("sparkle");

  let accentColor = "#00f0ff";
  let glowColor = "#00f0ff";
  let bodyColor = "#0f172a";

  if (isPink) {
    accentColor = "#ec4899";
    glowColor = "#f43f5e";
    bodyColor = "#28192a";
  } else if (isGreen) {
    accentColor = "#10e784";
    glowColor = "#10b981";
    bodyColor = "#091a13";
  } else if (isPurple) {
    accentColor = "#c084fc";
    glowColor = "#a855f7";
    bodyColor = "#1e1035";
  } else if (isRed) {
    accentColor = "#f97316";
    glowColor = "#ef4444";
    bodyColor = "#26120d";
  } else if (isGold) {
    accentColor = "#fbbf24";
    glowColor = "#f59e0b";
    bodyColor = "#211a09";
  }

  const titleWords = prompt.split(" ").slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const title = titleWords ? `${titleWords} Pointer` : "AI Synthesized Pointer";

  if (cursorType === "crosshair" || p.includes("crosshair") || p.includes("target")) {
    return {
      title,
      description: `Synthesized precision crosshair tuned to: "${prompt}"`,
      cursorType: "crosshair",
      hotspot: { x: 16, y: 16 },
      tags: ["ai", "crosshair", "precision", "glow"],
      layers: [
        {
          id: `ai-ring-${Date.now()}`,
          name: "Target Reticle",
          type: "circle",
          visible: true,
          locked: false,
          opacity: 0.8,
          x: 6,
          y: 6,
          width: 20,
          height: 20,
          rotation: 0,
          fill: "transparent",
          stroke: accentColor,
          strokeWidth: 1.5,
          glow: { enabled: true, color: glowColor, blur: 6 },
        },
        {
          id: `ai-cross-${Date.now()}`,
          name: "Cross Lines",
          type: "star",
          visible: true,
          locked: false,
          opacity: 1,
          x: 10,
          y: 10,
          width: 12,
          height: 12,
          rotation: 45,
          fill: "#ffffff",
          stroke: accentColor,
          strokeWidth: 1,
        },
        {
          id: `ai-dot-${Date.now()}`,
          name: "Center Sight",
          type: "circle",
          visible: true,
          locked: false,
          opacity: 1,
          x: 14.5,
          y: 14.5,
          width: 3,
          height: 3,
          rotation: 0,
          fill: "#ffffff",
          stroke: glowColor,
          strokeWidth: 0.5,
        },
      ],
    };
  }

  // Standard Arrow Pointer Composition
  return {
    title,
    description: `Synthesized vector composition based on "${prompt}"`,
    cursorType: cursorType || "normal",
    hotspot: { x: 2, y: 2 },
    tags: ["ai", "vector", "custom", "glow"],
    layers: [
      {
        id: `ai-glow-${Date.now()}`,
        name: "Luminous Aura",
        type: "polygon",
        visible: true,
        locked: false,
        opacity: 0.75,
        x: 0,
        y: 0,
        width: 32,
        height: 32,
        rotation: 0,
        points: [
          { x: 2, y: 2 },
          { x: 2, y: 25 },
          { x: 8, y: 19 },
          { x: 14, y: 28 },
          { x: 18, y: 25 },
          { x: 12, y: 17 },
          { x: 21, y: 17 },
        ],
        fill: "rgba(255, 255, 255, 0.1)",
        stroke: accentColor,
        strokeWidth: 2,
        glow: { enabled: true, color: glowColor, blur: 7, intensity: 1 },
      },
      {
        id: `ai-body-${Date.now()}`,
        name: "Pointer Core",
        type: "polygon",
        visible: true,
        locked: false,
        opacity: 1,
        x: 0,
        y: 0,
        width: 32,
        height: 32,
        rotation: 0,
        points: [
          { x: 3, y: 3 },
          { x: 3, y: 23 },
          { x: 8, y: 18 },
          { x: 14, y: 26 },
          { x: 17, y: 24 },
          { x: 12, y: 16 },
          { x: 20, y: 16 },
        ],
        fill: bodyColor,
        stroke: accentColor,
        strokeWidth: 1.5,
      },
      {
        id: `ai-highlight-${Date.now()}`,
        name: "Energy Filament",
        type: "polygon",
        visible: true,
        locked: false,
        opacity: 0.9,
        x: 0,
        y: 0,
        width: 32,
        height: 32,
        rotation: 0,
        points: [
          { x: 5, y: 6 },
          { x: 5, y: 17 },
          { x: 8, y: 14 },
          { x: 12, y: 19 },
          { x: 13, y: 18 },
          { x: 9, y: 13 },
          { x: 14, y: 13 },
        ],
        fill: "#ffffff",
        stroke: "transparent",
        strokeWidth: 0,
      },
    ],
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cursed Cursors Studio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
