import fs from 'fs-extra';
import path from 'path';

async function removeFiles(targetDir, answers) {
    console.log('🗑️  Remove Files...');
    let paths = {
        gitPath: path.join(targetDir, '.git'),
        licensePath: path.join(targetDir, 'LICENSE')
    };

    if (answers['__ESLINT__'] === 'false') {
        paths.eslintConfigPath = path.join(targetDir, 'eslint.config.js');
    }

    if (answers['__COLLECT_METRICS__'] === 'false') {
        paths.collectMetricsPath = path.join(targetDir, 'prometheus.yml');
    }

    for (const path of Object.values(paths)) {
        if (await fs.pathExists(path)) {
            await fs.remove(path);
        }
        console.log(`🗑️ File ${path} removed.`);
    }
    console.log('✅ Files removed successfully.');
}

async function removeTempFolders(targetDir) {
    console.log('🗑️  Remove temporary folders...');
    const folders = [
        'templates',
        'prisma/migrations',
        'compose'
    ]

    for (const folder of folders) {
        const folderPath = path.join(targetDir, folder);
        if (await fs.pathExists(folderPath)) {
            await fs.remove(folderPath);
        }
        console.log(`🗑️ Folder ${folder} removed.`);
    }
    console.log('✅ Temporary folders removed successfully.');
}

export default async function cleanUp(targetDir, answers) {
    console.log('🧹 Starting cleanup...');

    await removeFiles(targetDir, answers);
    await removeTempFolders(targetDir);
    console.log('✅ Cleanup completed successfully.');
}