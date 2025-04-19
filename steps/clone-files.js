import path from 'path';
import fs from 'fs-extra';

export default async function cloneFiles(targetDir) {
    const packageJsonTemplatePath = path.join(targetDir, 'package.json.template');
    const packageJsonTargetPath = path.join(targetDir, 'package.json');
    if (await fs.pathExists(packageJsonTemplatePath)) {
        await fs.copy(packageJsonTemplatePath, packageJsonTargetPath);
        console.log('📝 package.json wurde erstellt aus package.json.template');
    }

    const nginxConfTemplatePath = path.join(targetDir, 'nginx.conf.template');
    const nginxConfTargetPath = path.join(targetDir, 'nginx.conf');
    if (await fs.pathExists(nginxConfTemplatePath)) {
        await fs.copy(nginxConfTemplatePath, nginxConfTargetPath);
        console.log('📝 nginx.conf wurde erstellt aus nginx.conf.template');
    }

    const envTemplatePath = path.join(targetDir, '.env.template');
    const envTargetPath = path.join(targetDir, '.env');
    if (await fs.pathExists(envTemplatePath)) {
        await fs.copy(envTemplatePath, envTargetPath);
        console.log('📝 .env wurde erstellt aus .env.template');
    }

    const apiEnvTemplatePath = path.join(targetDir, 'api.env.template');
    const apiEnvTargetPath = path.join(targetDir, 'api.env');
    if (await fs.pathExists(apiEnvTemplatePath)) {
        await fs.copy(apiEnvTemplatePath, apiEnvTargetPath);
        console.log('📝 api.env wurde erstellt aus api.env.template');
    }

    const dbEnvTemplatePath = path.join(targetDir, 'db.env.template');
    const dbEnvTargetPath = path.join(targetDir, 'db.env');
    if (await fs.pathExists(dbEnvTemplatePath)) {
        await fs.copy(dbEnvTemplatePath, dbEnvTargetPath);
        console.log('📝 db.env wurde erstellt aus db.env.template');
    }

    const dockerComposeTemplatePath = path.join(targetDir, 'docker-compose.template.yaml');
    const dockerComposeTargetPath = path.join(targetDir, 'docker-compose.yaml');
    if (await fs.pathExists(dockerComposeTemplatePath)) {
        await fs.copy(dockerComposeTemplatePath, dockerComposeTargetPath);
        console.log('📝 docker-compose.yaml wurde erstellt aus docker-compose.template.yaml');
    }
}