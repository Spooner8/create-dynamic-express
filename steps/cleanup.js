import fs from 'fs-extra';
import path from 'path';

export async function removeTempFiles(targetDir, answers) {
    console.log('🗑️  Remove temporary Files...');
    let paths = {
        packageJsonPath: path.join(targetDir, 'package.json.template'),
        nginxConfPath: path.join(targetDir, 'nginx.conf.template'),
        envPath: path.join(targetDir, '.env.template'),
        apiEnvPath: path.join(targetDir, 'api.env.template'),
        dbEnvPath: path.join(targetDir, 'db.env.template'),
        readmePath: path.join(targetDir, 'README.md'),
        licensePath: path.join(targetDir, 'LICENSE'),
        dockerComposePath: path.join(targetDir, 'docker-compose.yaml'),
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
    }
}

export async function removeTempFolders(targetDir) {
    const folders = [
        'prisma/migrations',
        'compose'
    ]

    for (const folder of folders) {
        const folderPath = path.join(targetDir, folder);
        if (await fs.pathExists(folderPath)) {
            await fs.remove(folderPath);
        }
    }
}