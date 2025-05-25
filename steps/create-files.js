import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';

async function loadYamlIfExists(filePath) {
    if (await fs.pathExists(filePath)) {
        return yaml.load(await fs.readFile(filePath, 'utf-8'));
    }
    return {};
}

export default async function createComposeFile(targetDir, answers) {
    console.log('📝 Creating Docker Compose file...');
    const baseFilePath = path.join(targetDir, 'compose/default.yaml');
    let compose = await loadYamlIfExists(baseFilePath);

    // Services
    compose.services = {};
    const servicesDir = path.join(targetDir, 'compose/services');
    let serviceFiles = await fs.readdir(servicesDir);
    serviceFiles = serviceFiles.filter((f) => f.endsWith('.yaml'));

    const skipIfNoMetrics = ['grafana', 'prometheus'];
    const skipIfNoLaas = ['logger'];

    for (const file of serviceFiles) {
        const name = file.replace('.yaml', '');
        if (
            (skipIfNoMetrics.includes(name) &&
                answers['__COLLECT_METRICS__'] !== 'true') ||
            (skipIfNoLaas.includes(name) && answers['__LAAS__'] !== 'true')
        ) {
            continue;
        }
        const serviceFile = path.join(servicesDir, file);
        const serviceContent = await loadYamlIfExists(serviceFile);
        Object.assign(compose.services, serviceContent.services);

        console.log(`🐳 Service ${name} added to compose file.`);
    }
    

    // Volumes
    compose.volumes = {};
    const volumeDir = path.join(targetDir, 'compose/volumes');
    let volumeFiles = await fs.readdir(volumeDir);
    volumeFiles = volumeFiles.filter((f) => f.endsWith('.yaml'));
    
    for (const file of volumeFiles) {
        const name = file.replace('.yaml', '');
        if (
            (skipIfNoMetrics.includes(name) &&
                answers['__COLLECT_METRICS__'] !== 'true') ||
            (skipIfNoLaas.includes(name) && answers['__LAAS__'] !== 'true')
        ) {
            continue;
        }
        const volumeFile = path.join(volumeDir, file);
        const volumeContent = await loadYamlIfExists(volumeFile);
        Object.assign(compose.volumes, volumeContent.volumes);

        console.log(`🐳 Volume ${name} added to compose file.`);
    }

    // Networks
    compose.networks = {};
    const networkDir = path.join(targetDir, 'compose/networks');
    let networkFiles = await fs.readdir(networkDir);
    networkFiles = networkFiles.filter((f) => f.endsWith('.yaml'));
    for (const file of networkFiles) {
        const name = file.replace('.yaml', '');
        if (
            (skipIfNoMetrics.includes(name) &&
                answers['__COLLECT_METRICS__'] !== 'true') ||
            (skipIfNoLaas.includes(name) && answers['__LAAS__'] !== 'true')
        ) {
            continue;
        }
        const networkFile = path.join(networkDir, file);
        const networkContent = await loadYamlIfExists(networkFile);
        Object.assign(compose.networks, networkContent.networks);

        console.log(`🐳 Network ${name} added to compose file.`);
    }

    const outputFile = path.join(targetDir, 'docker-compose.yaml');
    await fs.writeFile(
        outputFile,
        yaml.dump(compose),
        'utf-8'
    );

    console.log('✅ Docker Compose file created successfully at:', outputFile);
}
