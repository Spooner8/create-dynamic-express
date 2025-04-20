import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';

async function createComposeFile(targetDir, answers) {
    const baseFilePath = path.join(targetDir, 'compose/default.yaml');
    const additionalFiles = [];

    const userSelections = {
        collectMetrics: answers['__COLLECT_METRICS__'] === 'true',
        logger: answers['__LAAS__'] === 'true',
    };
    
    if (userSelections.collectMetrics) {
        additionalFiles.push('compose/collect_metrics.yaml');
    }
    if (userSelections.logger) {
        additionalFiles.push('compose/logger.yaml');
    }
    
    // Ausgabe-Datei definieren
    const outputFile = path.join(targetDir, 'docker-compose.yaml');
    const baseContent = yaml.load(await fs.readFile(baseFilePath, 'utf-8'));

    // Lade und füge zusätzliche Dateien hinzu (z. B. collect_metrics.yaml, logger.yaml)
    for (const file of additionalFiles) {
        const filePath = path.join(targetDir, file);
        if (await fs.pathExists(filePath)) {
            const additionalContent = yaml.load(await fs.readFile(filePath, 'utf-8'));

            Object.assign(baseContent.services, additionalContent);

            if (additionalContent.volumes) {
                baseContent.volumes = {
                    ...baseContent.volumes,
                    ...additionalContent.volumes,
                };
            }

            if (additionalContent.networks) {
                baseContent.networks = {
                    ...baseContent.networks,
                    ...additionalContent.networks,
                };
            }
        } else {
            console.warn(`⚠️ File ${filePath} not found. Skipping.`);
        }
    }

    const mergedContent = JSON.stringify(baseContent);
    const replacedContent = Object.keys(answers).reduce((content, key) => {
        const regex = new RegExp(`__${key}__`, 'g');
        return content.replace(regex, answers[key]);
    }, mergedContent);

    await fs.writeFile(outputFile, yaml.dump(JSON.parse(replacedContent)), 'utf-8');
}

export default async function createNewFiles(targetDir, answers) {
    console.log('📝 Create new Files...');
    const readmeTargetPath = path.join(targetDir, 'README.md');
    const readmeContent = `# ${answers['__PROJECT_NAME__']}\n`;
    await fs.writeFile(readmeTargetPath, readmeContent, 'utf-8');

    await createComposeFile(targetDir, answers);
}