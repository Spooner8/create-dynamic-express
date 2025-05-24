#!/usr/bin/env node

import inquirer from 'inquirer';
import simpleGit from 'simple-git';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { prepareProjectName, replaceBooleanPlaceholders, replacePlaceholders } from './steps/replace-placeholder.js';
import cloneFiles from './steps/clone-files.js';
import { removeTempFiles, removeTempFolders} from './steps/cleanup.js';
import createNewFiles from './steps/create-files.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
    console.log('🚀 Express Project Generator\n');

    const configPath = path.join(__dirname, 'template-config.json');
    const config = await fs.readJson(configPath);

    const prompts = config.placeholders.map(p => ({
        name: p.key,
        message: p.question,
        default: p.default || undefined
    }));

    let answers = await inquirer.prompt(prompts);
    answers['__PROJECT_NAME__'] = await prepareProjectName(answers);
    answers = await replaceBooleanPlaceholders(config, answers);
    const targetDir = path.join(process.cwd(), answers['__PROJECT_NAME__']);

    console.log('\n📦 Clone Template...');
    await simpleGit().clone(config.templateRepo, targetDir);
    await fs.remove(path.join(targetDir, '.git'));

    await cloneFiles(targetDir);
    await removeTempFiles(targetDir, answers);
    await createNewFiles(targetDir, answers);
    await removeTempFolders(targetDir);
    await replacePlaceholders(config, targetDir, answers);

    console.log('\n✅ Project created in:', targetDir);
    console.log(`\n📄 Next steps:\n  cd ${answers['__PROJECT_NAME__']} && npm install`);
}

main().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
