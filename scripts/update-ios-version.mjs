// scripts/update-ios-version.mjs
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import plist from 'plist';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const iosDir = path.resolve(__dirname, '../ios');

const versionPath = path.resolve(__dirname, '../build-version.json');
const infoPlistPath = path.resolve(__dirname, '../ios/DevJourneyRN/Info.plist');

function calculateVersionCode(version) {
  const [major, minor, patch] = version.split('.').map(Number);
  return major * 10000 + minor * 100 + patch;
}

function updateIOSPlistVersion() {
  const versionData = JSON.parse(readFileSync(versionPath, 'utf8'));
  const version = versionData.buildNumber;
  const versionCode = calculateVersionCode(version);

  const plistRaw = readFileSync(infoPlistPath, 'utf8');
  const parsed = plist.parse(plistRaw);

  parsed.CFBundleShortVersionString = version;
  parsed.CFBundleVersion = `${versionCode}`;

  const updatedPlist = plist.build(parsed);
  writeFileSync(infoPlistPath, updatedPlist);

  console.log(`Updated Info.plist with version ${version} and build ${versionCode}`);

  try {
    execSync(`xcrun agvtool new-marketing-version ${version}`, {
      cwd: iosDir,
      stdio: 'inherit',
    });

    execSync(`xcrun agvtool new-version -all ${versionCode}`, {
      cwd: iosDir,
      stdio: 'inherit',
    });
  } catch (err) {
    console.warn('agvtool update failed (possibly due to Xcode project misconfig):', err.message);
  }
}

updateIOSPlistVersion();
