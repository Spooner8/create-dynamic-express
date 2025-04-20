import fs from 'fs-extra';
import path from 'path';

export async function replacePlaceholders(config, targetDir, answers) {
    answers = await replaceBooleanPlaceholders(config, answers);

    console.log('🔧 Replace placeholders...');
    for (const placeholder of config.placeholders) {
        for (const file of placeholder.fileTargets) {
            const filePath = path.join(targetDir, file);

            const fileExists = await fs.pathExists(filePath);
            if (!fileExists) {
                console.warn(`⚠️ File ${filePath} not found. Unable to replace placeholder.`);
                continue;
            }

            let content = await fs.readFile(filePath, 'utf-8');
            content = content.replace(new RegExp(placeholder.key, 'g'), answers[placeholder.key]);

            await fs.writeFile(filePath, content, 'utf-8');
        }
    }
}

export async function prepareProjectName(answers) {
    const projectName = answers['__PROJECT_NAME__'];

    const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    return answers['__PROJECT_NAME__'] = sanitizedProjectName;
}

async function replaceBooleanPlaceholders(config, answers) {
    for (const placeholder of config.placeholders) {
        if (placeholder.outputType === 'boolean') {
            const value = answers[placeholder.key].toLowerCase();
            switch (value) {
                case 'y':
                    answers[placeholder.key] = 'true';
                    break;
                case 'yes':
                    answers[placeholder.key] = 'true';
                    break;
                case 'n':
                    answers[placeholder.key] = 'false';
                    break;
                case 'no':
                    answers[placeholder.key] = 'false';
                    break;
                default:
                    answers[placeholder.key] = placeholder.default || 'false';
                    console.warn(`⚠️ Wrong value for ${placeholder.key}: ${value}. Default value "${answers[placeholder.key]}" will be used.`);
                    break;
            }
        }
    }
    
    return answers;
}