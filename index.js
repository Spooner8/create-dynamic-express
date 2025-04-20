#!/usr/bin/env node

import inquirer from 'inquirer';
import simpleGit from 'simple-git';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import replacePlaceholders, { prepareProjectName } from './steps/replace-placeholder.js';
import cloneFiles from './steps/clone-files.js';
import cleanup from './steps/cleanup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
    console.log('🚀 Express Projekt Generator\n');

    const configPath = path.join(__dirname, 'template-config.json');
    const config = await fs.readJson(configPath);

    const prompts = config.placeholders.map(p => ({
        name: p.key,
        message: p.question,
        default: p.default || undefined
    }));

    const answers = await inquirer.prompt(prompts);
    await prepareProjectName(config, answers);
    const targetDir = path.join(process.cwd(), answers['__PROJECT_NAME__']);

    console.log('\n📦 Klone Template...');
    await simpleGit().clone(config.templateRepo, targetDir);
    await fs.remove(path.join(targetDir, '.git'));

    await cloneFiles(targetDir);
    await replacePlaceholders(config, targetDir, answers);

    console.log('🗑️  Entferne temporäre Dateien...');
    await cleanup(targetDir, answers);

    console.log('\n✅ Projekt erstellt unter:', targetDir);
    console.log(`\n📄 Weiter:\n  cd ${answers['__PROJECT_NAME__']} && npm install`);
}

main().catch(err => {
    console.error('❌ Fehler:', err.message);
    process.exit(1);
});
