import {app, BrowserWindow} from 'electron';
import Store from 'electron-store';
import {join, resolve} from 'node:path';

const CONFIG = new Store();

async function createWindow() {
  const windowConfig = {
    show: false, // Use the 'ready-to-show' event to show the instantiated BrowserWindow.
    width: 1024,
    height: 768,
    minWidth: 840,
    minHeight: 640,
    fullscreen: false,
    frame: false,
    titleBarOverlay: true,
    trafficLightPosition: {
      x: 20,
      y: 20,
    },
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false, // Sandbox disabled because the demo of preload script depend on the Node.js api
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like an iframe or Electron's BrowserView. @see https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: join(app.getAppPath(), 'packages/preload/dist/index.cjs'),
    },
  };

  Object.assign(windowConfig, CONFIG.get('winBounds'));
  const browserWindow = new BrowserWindow(windowConfig);

  if (windowConfig.fullscreen) {
    browserWindow.maximize();
  }

  // Splash screen
  const splash = new BrowserWindow({
    width: 400,
    height: 400,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    center: true,
  });

  await splash.loadFile(resolve(__dirname, '../../renderer/splash.html'));

  /**
   * If the 'show' property of the BrowserWindow's constructor is omitted from the initialization options,
   * it then defaults to 'true'. This can cause flickering as the window loads the html content,
   * and it also has show problematic behaviour with the closing of the window.
   * Use `show: false` and listen to the  `ready-to-show` event to show the window.
   *
   * @see https://github.com/electron/electron/issues/25012 for the afford mentioned issue.
   */
  browserWindow.on('ready-to-show', () => {
    browserWindow?.show();
    splash.close();

    if (import.meta.env.DEV) {
      browserWindow?.webContents.openDevTools();
    }
  });

  browserWindow.on('close', () => {
    Object.assign(
      windowConfig,
      {
        fullscreen: browserWindow.isMaximized(),
      },
      browserWindow.getNormalBounds(),
    );
    CONFIG.set('winBounds', windowConfig); // saves window's properties using electron-store
  });

  /**
   * Load the main page of the main window.
   */
  if (import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined) {
    /**
     * Load from the Vite dev server for development.
     */
    await browserWindow.loadURL(import.meta.env.VITE_DEV_SERVER_URL);
  } else {
    /**
     * Load from the local file system for production and test.
     *
     * Use BrowserWindow.loadFile() instead of BrowserWindow.loadURL() for WhatWG URL API limitations
     * when path contains special characters like `#`.
     * Let electron handle the path quirks.
     * @see https://github.com/nodejs/node/issues/12682
     * @see https://github.com/electron/electron/issues/6869
     */
    await browserWindow.loadFile(resolve(__dirname, '../../renderer/dist/index.html'));
  }

  return browserWindow;
}

/**
 * Restore an existing BrowserWindow or Create a new BrowserWindow.
 */
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}
