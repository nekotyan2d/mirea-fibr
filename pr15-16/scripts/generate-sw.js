import fs from "fs";
import path from "path";

const DIST_DIR = "dist";
const MANIFEST_PATH = path.join(DIST_DIR, ".vite", "manifest.json");
const SW_TEMPLATE = path.join("public", "sw.js");
const SW_OUTPUT = path.join(DIST_DIR, "sw.js");

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));

const shellUrls = [
    "/icons/apple-touch-icon-57x57.png",
    "/icons/apple-touch-icon-114x114.png",
    "/icons/apple-touch-icon-120x120.png",
    "/icons/apple-touch-icon.png",
    "/icons/favicon-16x16.png",
    "/icons/favicon-32x32.png",
    "/icons/favicon-48x48.png",
    "/icons/favicon-64x64.png",
    "/icons/favicon-128x128.png",
    "/icons/favicon-256x256.png",
    "/icons/favicon-512x512.png",
];

for (const entry of Object.values(manifest)) {
    if (entry.file) {
        shellUrls.push(`/${entry.file}`);
    }

    if (entry.css) {
        entry.css.forEach((cssFile) => shellUrls.push(`/${cssFile}`));
    }

    if (entry.assets) {
        entry.assets.forEach((asset) => shellUrls.push(`/${asset}`));
    }
}

const uniqueUrls = [...new Set(shellUrls)];

let swContent = fs.readFileSync(SW_TEMPLATE, "utf-8");
swContent = swContent.replace("self.__APP_SHELL_URLS__ || []", JSON.stringify(uniqueUrls, null, 2));

fs.writeFileSync(SW_OUTPUT, swContent);
