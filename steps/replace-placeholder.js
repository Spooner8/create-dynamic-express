import fs from 'fs-extra';
import path from 'path';

export async function replacePlaceholders(config, targetDir, answers) {
    console.log('🔧 Replace placeholders...');

    const directories = ['templates', 'compose'];
    const filePaths = [];
    for (const dir of directories) {
        const dirPath = path.join(targetDir, dir);
        if (await fs.pathExists(dirPath)) {
            const dirFiles = await fs.readdir(dirPath, { recursive: true});
            const fileWithDirs = dirFiles.map(file => path.join(dir, file));
            filePaths.push(...fileWithDirs);
        }
    }

    for (const filePath of filePaths) {
        const isDirectory = (await fs.stat(path.join(targetDir, filePath))).isDirectory();
        if (isDirectory) {
            continue;
        }

        const filePathFull = path.join(targetDir, filePath);
        console.log(`🔄 Replacing placeholders in: ${filePathFull}`);
        let content = await fs.readFile(filePathFull, 'utf-8');

        for (const placeholder of config.placeholders) {
            const regex = new RegExp(placeholder.key, 'g');
            content = content.replace(regex, answers[placeholder.key]);
        }

        await fs.writeFile(filePathFull, content, 'utf-8');
    }
    console.log('✅ Placeholders replaced successfully.');
}

export async function prepareProjectName(answers) {
    console.log('🔄 Prepare project name...');
    const projectName = answers['__PROJECT_NAME__'];

    const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();

    console.log(`✅ Project name prepared: ${sanitizedProjectName}`);    
    return answers['__PROJECT_NAME__'] = sanitizedProjectName;
}

export async function replaceBooleanPlaceholders(config, answers) {
    console.log('🔄 Replace boolean placeholders...');
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
    console.log('✅ Boolean placeholders replaced successfully.');
    
    return answers;
}