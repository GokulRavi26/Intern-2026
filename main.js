const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // ✅ CORRECTED PATHS for your structure
  const frontendPath = app.isPackaged
    ? path.join(process.resourcesPath, "app.asar", "frontend", "dist", "index.html")
    : path.join(__dirname, "frontend", "dist", "index.html");

  console.log("Loading frontend from:", frontendPath);
  console.log("Frontend exists:", require('fs').existsSync(frontendPath));
  
  win.loadFile(frontendPath);

  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
}

function startBackend() {
  const backendPath = app.isPackaged
    ? path.join(process.resourcesPath, "backend.exe")
    : path.join(__dirname, "backend", "backend.exe");

  console.log("Starting backend from:", backendPath);
  console.log("Backend exists:", require('fs').existsSync(backendPath));

  backendProcess = spawn(backendPath, [], {
    cwd: path.dirname(backendPath),
    windowsHide: true,
  });

  backendProcess.stdout.on("data", (data) => {
    console.log(`[BACKEND]: ${data.toString()}`);
  });

  backendProcess.stderr.on("data", (data) => {
    console.error(`[BACKEND ERROR]: ${data.toString()}`);
  });

  backendProcess.on("error", (err) => {
    console.error(`[BACKEND SPAWN ERROR]: ${err}`);
  });
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on("window-all-closed", () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== "darwin") app.quit();
});