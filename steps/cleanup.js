import fs from 'fs-extra';
import path from 'path';

export default async function cleanup(targetDir, answers) {
    let paths = {
        packageJsonPath: path.join(targetDir, 'package.json.template'),
        nginxConfPath: path.join(targetDir, 'nginx.conf.template'),
        envPath: path.join(targetDir, '.env.template'),
        apiEnvPath: path.join(targetDir, 'api.env.template'),
        dbEnvPath: path.join(targetDir, 'db.env.template'),
        dockerComposePath: path.join(targetDir, 'docker-compose.template.yaml')
    };

    if (answers['__ESLINT__'] === 'false') {
        paths.eslintConfigPath = path.join(targetDir, 'eslint.config.js');
    }

    for (const path of Object.values(paths)) {
        if (await fs.pathExists(path)) {
            await fs.remove(path);
        }
    }
    
    console.log('🗑️  Temporäre Dateien entfernt.');
}