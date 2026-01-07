const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const frontendPath = app.isPackaged
    ? path.join(process.resourcesPath, "app.asar", "frontend", "dist", "index.html")
    : path.join(__dirname, "frontend", "dist", "index.html");

  console.log("Loading frontend from:", frontendPath);
  console.log("Frontend exists:", fs.existsSync(frontendPath));

  win.loadFile(frontendPath);

  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
