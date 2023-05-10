/**
 * Script to install cloudflared binary on the current platform.
 * Reference: https://github.com/JacobLinCool/node-cloudflared/blob/main/src/install.ts
 */
const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');

const RELEASE_BASE = 'https://github.com/cloudflare/cloudflared/releases/';

const LINUX_URL = {
    arm64: 'cloudflared-linux-arm64',
    arm: 'cloudflared-linux-arm',
    x64: 'cloudflared-linux-amd64',
    ia32: 'cloudflared-linux-386',
};

const MACOS_URL = {
    arm64: 'cloudflared-darwin-amd64.tgz',
    x64: 'cloudflared-darwin-amd64.tgz',
};

const WINDOWS_URL = {
    x64: 'cloudflared-windows-amd64.exe',
    ia32: 'cloudflared-windows-386.exe',
};

function resolveBase(version) {
    if (version === 'latest') {
        return `${RELEASE_BASE}latest/download/`;
    }
    return `${RELEASE_BASE}download/${version}/`;
}

/**
 * Install cloudflared to the given path.
 * @param to The path to the binary to install.
 * @param version The version of cloudflared to install.
 * @returns The path to the binary that was installed.
 */
async function installCloudflared(to, version = 'latest') {
    if (process.platform === 'linux') {
        return installLinux(to, version);
    } else if (process.platform === 'darwin') {
        return installMacOS(to, version);
    } else if (process.platform === 'win32') {
        return installWindows(to, version);
    } else {
        console.error(`Unsupported platform: ${process.platform}`);
        process.exit(1);
    }
}

async function installLinux(to, version = 'latest') {
    const file = LINUX_URL[process.arch];

    if (file === undefined) {
        console.error(`Unsupported architecture: ${process.arch}`);
        process.exit(1);
    }

    await download(resolveBase(version) + file, to);
    fs.chmodSync(to, '755');
    return to;
}

async function installMacOS(to, version = 'latest') {
    const file = MACOS_URL[process.arch];

    if (file === undefined) {
        console.error(`Unsupported architecture: ${process.arch}`);
        process.exit(1);
    }

    await download(resolveBase(version) + file, `${to}.tgz`);
    process.env.VERBOSE && console.log(`Extracting to ${to}`);
    execSync(`tar -xzf ${path.basename(`${to}.tgz`)}`, { cwd: path.dirname(to) });
    fs.unlinkSync(`${to}.tgz`);
    fs.renameSync(`${path.dirname(to)}/cloudflared`, to);
    return to;
}

async function installWindows(to, version = 'latest') {
    const file = WINDOWS_URL[process.arch];

    if (file === undefined) {
        console.error(`Unsupported architecture: ${process.arch}`);
        process.exit(1);
    }

    await download(resolveBase(version) + file, to);
    return to;
}

function download(url, to, redirect = 0) {
    if (redirect === 0) {
        process.env.VERBOSE && console.log(`Downloading ${url} to ${to}`);
    } else {
        process.env.VERBOSE && console.log(`Redirecting to ${url}`);
    }

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(path.dirname(to))) {
            fs.mkdirSync(path.dirname(to), { recursive: true });
        }

        let done = true;
        const file = fs.createWriteStream(to);
        const request = https.get(url, (res) => {
            if (res.statusCode === 302 && res.headers.location !== undefined) {
                const redirection = res.headers.location;
                done = false;
                file.close(() => resolve(download(redirection, to, redirect + 1)));
                return;
            }
            res.pipe(file);
        });

        file.on('finish', () => {
            if (done) {
                file.close(() => resolve(to));
            }
        });

        request.on('error', (err) => {
            fs.unlink(to, () => reject(err));
        });

        file.on('error', (err) => {
            fs.unlink(to, () => reject(err));
        });

        request.end();
    });
}

/**
 * Install the cloudflared binary inside the dist folder.
 * Locking the version to 2023.4.0 instead of latest to avoid breaking changes.
 */
installCloudflared(path.join(__dirname, 'dist', 'cloudflared'), '2023.4.1');
