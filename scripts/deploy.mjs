// scripts/deploy.mjs
import { writeFileSync, existsSync, readFileSync } from 'fs';
import path, { resolve } from 'path';
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildVersionPath = resolve(__dirname, '../build-version.json');
const historyPath = resolve(__dirname, '../history.json');

function getLatestBuildVersionFromCommits() {
  try {
    const log = execSync('git log --grep="BUILD: #" --pretty=format:"%s"').toString();
    const matches = log.match(/BUILD: #(\d+\.\d+\.\d+)/g);
    if (!matches || matches.length === 0) return '0.0.0';

    const last = matches[0].replace('BUILD: #', '');
    const [major, minor, patch] = last.split('.').map(Number);
    return `${major}.${minor}.${patch + 1}`;
  } catch {
    return '0.0.1';
  }
}

(async () => {
  try {
    const suggestedVersion = getLatestBuildVersionFromCommits();

    const { version } = await inquirer.prompt([
      {
        type: 'input',
        name: 'version',
        message: 'Enter the semantic version for this build:',
        default: suggestedVersion,
        validate: input =>
          /^\d+\.\d+\.\d+$/.test(input) || 'Please enter a valid semver (e.g., 1.0.0)',
      },
    ]);

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Confirm deploying version ${version}?`,
        default: true,
      },
    ]);

    if (!confirm) {
      console.log('Deployment cancelled.');
      process.exit(0);
    }

    const buildData = { buildNumber: version };
    writeFileSync(buildVersionPath, JSON.stringify(buildData, null, 2));

    const shortSHA = execSync('git rev-parse --short HEAD').toString().trim();
    const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    const timestamp = new Date().toISOString();

    let history = [];
    if (existsSync(historyPath)) {
      history = JSON.parse(readFileSync(historyPath, 'utf8'));
    }

    history.unshift({
      version,
      branch,
      commit: shortSHA,
      apkUrl: 'pending',
      timestamp,
    });

    writeFileSync(historyPath, JSON.stringify(history, null, 2));

    execSync('git add build-version.json history.json');
    execSync(`git commit -m "BUILD: #${version}"`);
    execSync('git push');

    console.log(`\n🚀 Deployment for version ${version} committed and pushed.`);
  } catch (err) {
    console.error('❌ Deployment failed:', err.message);
    process.exit(1);
  }
})();
