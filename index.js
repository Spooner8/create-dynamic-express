#!/usr/bin/env node

import inquirer from 'inquirer';
import simpleGit from 'simple-git';
import fs from 'fs-extra';
import path from 'path';
import replace from 'replace-in-file';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cloneFiles from './steps/clone-files';
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
    const targetDir = path.join(process.cwd(), answers['__PROJECT_NAME__']);

    console.log('\n📦 Klone Template...');
    await simpleGit().clone(config.templateRepo, targetDir);
    await fs.remove(path.join(targetDir, '.git'));

    await cloneFiles(targetDir);

    console.log('🔧 Ersetze Platzhalter...');
    for (const p of config.placeholders) {
        const replaceOptions = {
            files: p.fileTargets.map(f => path.join(targetDir, f)),
            from: new RegExp(p.key, 'g'),
            to: answers[p.key]
        };
        await replace.replaceInFile(replaceOptions);
    }

    await cleanup(targetDir, answers);

    console.log('\n✅ Projekt erstellt unter:', targetDir);
    console.log(`\n📄 Weiter:\n  cd ${answers['__PROJECT_NAME__']} && npm install`);
}

main().catch(err => {
    console.error('❌ Fehler:', err.message);
    process.exit(1);
});
