// scripts/update-android-version.mjs
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const versionPath = path.resolve(__dirname, '../build-version.json');
const versionGradlePath = path.resolve(__dirname, '../android/version.gradle');

function calculateVersionCode(version) {
  const [major, minor, patch] = version.split('.').map(Number);
  return major * 10000 + minor * 100 + patch;
}

function updateAndroidVersion() {
  const versionData = JSON.parse(readFileSync(versionPath, 'utf8'));
  const version = versionData.buildNumber;
  const versionCode = calculateVersionCode(version);

  const gradleContent = `ext {
    versionName = '${version}'
    versionCode = ${versionCode}
}
`;

  writeFileSync(versionGradlePath, gradleContent);
  console.log(`✅ Updated version.gradle with version ${version} and versionCode ${versionCode}`);
}

updateAndroidVersion();
