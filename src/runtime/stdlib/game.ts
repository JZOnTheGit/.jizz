import { RuntimeValue, MK_NULL, MK_BOOL, MK_NUMBER, MK_NATIVE_FN, MK_STRING, NumberValue, StringValue, ObjectValue } from "../values";
import Environment from "../environment";

// We'll replace this with Raylib implementation later
let renderer: any = null;

// Map to store window IDs and objects
const windows: Map<string, any> = new Map();

// Current active window ID
let currentWindowId: string | null = null;

// Flag to track if window is ready for rendering
let isWindowReady = true;

// Get the current window ID (or a default)
function getCurrentWindowId(): string {
  if (currentWindowId === null) {
    console.warn("No window has been created or set as active. Using 'default'.");
    return "default";
  }
  return currentWindowId;
}

// Create an object wrapper for a game object
function createObject(): ObjectValue {
  return {
    type: "object",
    properties: new Map()
  } as ObjectValue;
}

// Create Window Function
export const createWindow = MK_NATIVE_FN((args, env) => {
  if (args.length < 3) {
    throw "createWindow requires at least 3 arguments: title, width, height";
  }
  
  // Extract arguments
  const title = args[0].type === "string" ? (args[0] as StringValue).value : "JIZZ Game";
  const width = args[1].type === "number" ? (args[1] as NumberValue).value : 800;
  const height = args[2].type === "number" ? (args[2] as NumberValue).value : 600;
  
  try {
    // Create a window ID 
    const windowId = "window-" + Date.now();
    console.log(`[MOCK GRAPHICS] Created window '${title}' (${width}x${height}) with ID: ${windowId}`);
    console.log(`[MOCK GRAPHICS] Future Raylib implementation will handle real rendering`);
    
    // Set the current window ID
    currentWindowId = windowId;
    
    // Store the window
    windows.set(windowId, { id: windowId, title, width, height });
    
    return MK_NUMBER(1); // Return a simple success value
  } catch (error) {
    console.error("Error creating window:", error);
    return MK_NUMBER(0); // Return failure
  }
});

// Close Window Function
export const closeWindow = MK_NATIVE_FN((args, env) => {
  const windowId = args.length > 0 && args[0].type === "number" 
    ? (args[0] as NumberValue).value.toString() 
    : getCurrentWindowId();
  
  console.log(`[MOCK GRAPHICS] Closing window: ${windowId}`);
  
  // Remove from windows map
  windows.delete(windowId);
  
  // Reset current window ID if it was the closed window
  if (currentWindowId === windowId) {
    currentWindowId = null;
  }
  
  return MK_NULL();
});

// Clear Function
export const clear = MK_NATIVE_FN((args, env) => {
  if (args.length < 1) {
    throw "clear requires at least 1 argument: color";
  }
  
  const color = args[0].type === "string" ? (args[0] as StringValue).value : "black";
  const windowId = args.length > 1 && args[1].type === "number" 
    ? (args[1] as NumberValue).value.toString() 
    : getCurrentWindowId();
  
  console.log(`[MOCK GRAPHICS] Clearing window with color: ${color}`);
  
  return MK_NULL();
});

// Draw Rectangle Function
export const drawRect = MK_NATIVE_FN((args, env) => {
  if (args.length < 5) {
    throw "drawRect requires at least 5 arguments: x, y, width, height, color";
  }
  
  // Extract arguments
  const x = args[0].type === "number" ? (args[0] as NumberValue).value : 0;
  const y = args[1].type === "number" ? (args[1] as NumberValue).value : 0;
  const width = args[2].type === "number" ? (args[2] as NumberValue).value : 10;
  const height = args[3].type === "number" ? (args[3] as NumberValue).value : 10;
  const color = args[4].type === "string" ? (args[4] as StringValue).value : "white";
  
  console.log(`[MOCK GRAPHICS] Drawing rect at (${x},${y}) size ${width}x${height} color ${color}`);
  
  return MK_NULL();
});

// Draw Circle Function
export const drawCircle = MK_NATIVE_FN((args, env) => {
  if (args.length < 4) {
    throw "drawCircle requires at least 4 arguments: x, y, radius, color";
  }
  
  // Extract arguments
  const x = args[0].type === "number" ? (args[0] as NumberValue).value : 0;
  const y = args[1].type === "number" ? (args[1] as NumberValue).value : 0;
  const radius = args[2].type === "number" ? (args[2] as NumberValue).value : 10;
  const color = args[3].type === "string" ? (args[3] as StringValue).value : "white";
  
  console.log(`[MOCK GRAPHICS] Drawing circle at (${x},${y}) radius ${radius} color ${color}`);
  
  return MK_NULL();
});

// Draw Text Function
export const drawText = MK_NATIVE_FN((args, env) => {
  if (args.length < 4) {
    throw "drawText requires at least 4 arguments: text, x, y, color";
  }
  
  // Extract arguments
  const text = args[0].type === "string" ? (args[0] as StringValue).value : "";
  const x = args[1].type === "number" ? (args[1] as NumberValue).value : 0;
  const y = args[2].type === "number" ? (args[2] as NumberValue).value : 0;
  const color = args[3].type === "string" ? (args[3] as StringValue).value : "white";
  const font = args.length > 4 && args[4].type === "string" ? (args[4] as StringValue).value : "16px Arial";
  
  console.log(`[MOCK GRAPHICS] Drawing text "${text}" at (${x},${y}) color ${color} font ${font}`);
  
  return MK_NULL();
});

// Check if Key is Pressed Function
export const isKeyPressed = MK_NATIVE_FN((args, env) => {
  if (args.length < 1) {
    throw "isKeyPressed requires at least 1 argument: key";
  }
  
  const key = args[0].type === "string" ? (args[0] as StringValue).value : "";
  
  console.log(`[MOCK GRAPHICS] Checking if key "${key}" is pressed: false`);
  
  return MK_BOOL(false);
});

// Play Sound Function
export const playSound = MK_NATIVE_FN((args, env) => {
  if (args.length < 1) {
    throw "playSound requires at least 1 argument: soundPath";
  }
  
  const soundPath = args[0].type === "string" ? (args[0] as StringValue).value : "";
  const volume = args.length > 1 && args[1].type === "number" ? (args[1] as NumberValue).value : 1.0;
  
  console.log(`[MOCK GRAPHICS] Playing sound: ${soundPath} at volume ${volume}`);
  
  return MK_NULL();
});

// Stop Sound Function
export const stopSound = MK_NATIVE_FN((args, env) => {
  if (args.length < 1) {
    throw "stopSound requires at least 1 argument: soundPath";
  }
  
  const soundPath = args[0].type === "string" ? (args[0] as StringValue).value : "";
  
  console.log(`[MOCK GRAPHICS] Stopping sound: ${soundPath}`);
  
  return MK_NULL();
});

// Check Rectangle Collision Function
export const checkRectCollision = MK_NATIVE_FN((args, env) => {
  if (args.length < 8) {
    throw "checkRectCollision requires 8 arguments: x1, y1, w1, h1, x2, y2, w2, h2";
  }
  
  // Extract rect 1 coordinates
  const x1 = args[0].type === "number" ? (args[0] as NumberValue).value : 0;
  const y1 = args[1].type === "number" ? (args[1] as NumberValue).value : 0;
  const w1 = args[2].type === "number" ? (args[2] as NumberValue).value : 0;
  const h1 = args[3].type === "number" ? (args[3] as NumberValue).value : 0;
  
  // Extract rect 2 coordinates
  const x2 = args[4].type === "number" ? (args[4] as NumberValue).value : 0;
  const y2 = args[5].type === "number" ? (args[5] as NumberValue).value : 0;
  const w2 = args[6].type === "number" ? (args[6] as NumberValue).value : 0;
  const h2 = args[7].type === "number" ? (args[7] as NumberValue).value : 0;
  
  // Check if rectangles overlap
  const collides = (
    x1 < x2 + w2 &&
    x1 + w1 > x2 &&
    y1 < y2 + h2 &&
    y1 + h1 > y2
  );
  
  return MK_BOOL(collides);
});

// Check Circle Collision Function
export const checkCircleCollision = MK_NATIVE_FN((args, env) => {
  if (args.length < 6) {
    throw "checkCircleCollision requires 6 arguments: x1, y1, r1, x2, y2, r2";
  }
  
  // Extract circle 1
  const x1 = args[0].type === "number" ? (args[0] as NumberValue).value : 0;
  const y1 = args[1].type === "number" ? (args[1] as NumberValue).value : 0;
  const r1 = args[2].type === "number" ? (args[2] as NumberValue).value : 0;
  
  // Extract circle 2
  const x2 = args[3].type === "number" ? (args[3] as NumberValue).value : 0;
  const y2 = args[4].type === "number" ? (args[4] as NumberValue).value : 0;
  const r2 = args[5].type === "number" ? (args[5] as NumberValue).value : 0;
  
  // Calculate distance between circles
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Check if circles overlap
  const collides = distance < (r1 + r2);
  
  return MK_BOOL(collides);
});

// Game loop function
export const startGameLoop = MK_NATIVE_FN((args, env) => {
  if (args.length < 1) {
    throw "startGameLoop requires at least 1 argument: function";
  }

  if (args.length < 2) {
    throw "startGameLoop requires 2 arguments: function, fps";
  }
  
  const callbackFn = args[0];
  const fps = args[1].type === "number" ? (args[1] as NumberValue).value : 60;
  const intervalMs = 1000 / fps;
  
  console.log(`[MOCK GRAPHICS] Starting game loop at ${fps} FPS (${intervalMs}ms interval)`);
  console.log(`[MOCK GRAPHICS] This will be replaced with Raylib main loop`);
  
  // Check if function is callable
  if (callbackFn.type !== "function" && callbackFn.type !== "native-fn") {
    throw `startGameLoop expected a function, got ${callbackFn.type}`;
  }
  
  // Ensure we have a valid window ID
  if (currentWindowId === null) {
    console.warn("No window has been created. Creating a default window.");
    // Call createWindow with default parameters
    const window = createWindow.call([
      MK_STRING("JIZZ Game"),
      MK_NUMBER(800),
      MK_NUMBER(600)
    ], env);
  }
  
  let intervalId: NodeJS.Timeout | null = null;
  
  try {
    // Start the interval for the game loop
    intervalId = setInterval(() => {
      try {
        console.log(`[MOCK GRAPHICS] Running game loop iteration`);
        
        if (callbackFn.type === "native-fn") {
          (callbackFn as any).call([], env);
        } else if (callbackFn.type === "function") {
          const fn = callbackFn as any;
          const { body, parameters, declarationEnv } = fn;
          const scope = new Environment(declarationEnv);
          const evaluate = require('../interpreter').evaluate;
          evaluate({ kind: "Program", body: body }, scope);
        }
      } catch (error) {
        console.error(`Error in game loop: ${error}`);
      }
    }, intervalMs);
    
    console.log(`[MOCK GRAPHICS] Game loop started with interval ID: ${intervalId}`);
    
    return MK_NUMBER(parseInt(String(intervalId)));
  } catch (error) {
    console.error(`Error starting game loop: ${error}`);
    if (intervalId) {
      clearInterval(intervalId);
    }
    return MK_NUMBER(-1);
  }
}); 