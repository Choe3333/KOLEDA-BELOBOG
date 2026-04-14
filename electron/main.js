const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

let mainWindow;
let serverProcess;

const PORT = 3000;
const DEV_MODE = process.env.NODE_ENV === 'development';

function waitForServer(url, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    function check() {
      http
        .get(url, (res) => {
          if (res.statusCode === 200 || res.statusCode === 304) {
            resolve();
          } else {
            retry();
          }
        })
        .on('error', () => {
          retry();
        });
    }

    function retry() {
      if (Date.now() - start > timeout) {
        reject(new Error('Server startup timeout'));
        return;
      }
      setTimeout(check, 500);
    }

    check();
  });
}

function startServer() {
  if (DEV_MODE) {
    return null;
  }

  const serverPath = path.join(process.resourcesPath, 'standalone', 'server.js');

  const child = spawn('node', [serverPath], {
    env: {
      ...process.env,
      PORT: String(PORT),
      HOSTNAME: 'localhost',
    },
    cwd: path.join(process.resourcesPath, 'standalone'),
    stdio: 'pipe',
  });

  child.stdout.on('data', (data) => {
    console.log(`[server] ${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`[server] ${data}`);
  });

  child.on('error', (err) => {
    console.error('Failed to start server:', err);
  });

  return child;
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'NovelCraft - AI Writing Studio',
    backgroundColor: '#030712',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
  });

  const url = `http://localhost:${PORT}`;

  if (!DEV_MODE) {
    serverProcess = startServer();
  }

  try {
    await waitForServer(url);
    mainWindow.loadURL(url);
  } catch {
    mainWindow.loadURL(`data:text/html,
      <html>
        <body style="background:#030712;color:white;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
          <div style="text-align:center;">
            <h1>Failed to start server</h1>
            <p>Please ensure the application is properly installed.</p>
            <p>If running in development, start the Next.js dev server first (npm run dev).</p>
          </div>
        </body>
      </html>
    `);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
});
