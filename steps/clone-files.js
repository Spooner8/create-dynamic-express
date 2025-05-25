import path from 'path';
import fs from 'fs-extra';

function removeBlock(content, locationPath) {
    const regex = new RegExp(
        `\\s*location\\s+${locationPath}\\s*\\{[^}]*\\}`,
        'g'
    );
    return content.replace(regex, '');
}

export default async function cloneTemplateFiles(targetDir, answers) {
    console.log('🗂️ Clone Files...');

    const templateDir = path.join(targetDir, 'templates');
    const templateFiles = await fs.readdir(templateDir);

    for (const file of templateFiles) {
        if (file.endsWith('.template')) {
            const sourcePath = path.join(templateDir, file);
            const targetPath = path.join(targetDir, file.replace('.template', ''));

            if (file === 'nginx.conf.template') {
                let content = await fs.readFile(sourcePath, 'utf-8');
                if (answers['__COLLECT_METRICS__'] !== 'true') {
                    content = removeBlock(content, '/api/metrics');
                }
                if (answers['__LAAS__'] !== 'true') {
                    content = removeBlock(content, '/api/log');
                }
                await fs.writeFile(sourcePath, content, 'utf-8');
                await fs.copy(sourcePath, targetPath);
            } else {
                await fs.copy(sourcePath, targetPath);
            }
            console.log(`📄 File ${file} cloned.`);
        }
    }
    console.log('✅ Files cloned successfully.');
}
