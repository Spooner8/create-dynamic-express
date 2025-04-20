import fs from 'fs-extra';
import path from 'path';

export default async function replacePlaceholders(config, targetDir, answers) {
    answers['__PROJECT_NAME__'] = await prepareProjectName(config, answers);
    answers = await replaceBooleanPlaceholders(answers);

    console.log('🔧 Ersetze Platzhalter...');
    for (const placeholder of config.placeholders) {
        for (const file of placeholder.fileTargets) {
            const filePath = path.join(targetDir, file);

            const fileExists = await fs.pathExists(filePath);
            if (!fileExists) {
                console.warn(`⚠️ Datei ${filePath} nicht gefunden, Platzhalter konnte nicht ersetzt werden.`);
                continue;
            }

            let content = await fs.readFile(filePath, 'utf-8');
            content = content.replace(new RegExp(placeholder.key, 'g'), answers[placeholder.key]);

            await fs.writeFile(filePath, content, 'utf-8');
        }
    }
}

export async function prepareProjectName(config, answers) {
    const projectName = answers['__PROJECT_NAME__'];

    const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    return answers['__PROJECT_NAME__'] = sanitizedProjectName;
}

async function replaceBooleanPlaceholders(answers) {
    for (const key in answers) {
        if (answers[key] === 'yes' || answers[key] === 'y') {
            answers[key] = 'true';
        } else if (answers[key] === 'no' || answers[key] === 'n') {
            answers[key] = 'false';
        }
    }
    return answers;
}