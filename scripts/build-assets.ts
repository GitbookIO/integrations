import * as path from 'node:path';
import * as fs from 'node:fs';

interface IntegrationPublicAsset {
    /** The name of integration owning the asset */
    integration: string;

    /** The asset's filename */
    assetFilename: string;

    /** The full path to the asset path */
    assetsFolderPath: string;
}

interface IntegrationFunctionsFolder {
    /** The name of integration owning the functions folder */
    integration: string;

    /** The full path to the functions path */
    functionsFolderPath: string;
}

/** The root folder for all the integrations */
const integrationsRootFolder = '../integrations';

/** The assets folder that is uploaded to the Cloudflare pages project */
const assetsDistFolder = '../dist';

/** The funtions folder that is uploaded to the Cloudflare pages project */
const functionsDistFolder = '../functions';

/** The file extensions that we are filtering assets on */
const assetFilters = ['.png', '.svg', '.jpg', '.jpeg', '.webp'];

/**
 * List all public asset for one integration.
 */
function listIntegrationPublicAssets(
    integration: string,
    assetsFolderPath: string,
): IntegrationPublicAsset[] {
    const integrationPublicAssetStats = fs.readdirSync(assetsFolderPath, {
        withFileTypes: true,
    });
    return integrationPublicAssetStats.reduce<IntegrationPublicAsset[]>(
        (allFiles, currentStats) => {
            // only support one level, skip nested folders.
            if (currentStats.isFile() && assetFilters.includes(path.extname(currentStats.name))) {
                return [
                    ...allFiles,
                    { integration, assetFilename: currentStats.name, assetsFolderPath },
                ];
            }
            return allFiles;
        },
        [],
    );
}

/**
 * List all public assets and functions folders for every integrations.
 */
function listAllPublicFoldersContent() {
    const integrationsRootPath = path.join(__dirname, integrationsRootFolder);
    const integrationsStats = fs.readdirSync(integrationsRootPath, { withFileTypes: true });

    let integrationsFunctions: IntegrationFunctionsFolder[] = [];

    const integrationsAssets = integrationsStats.reduce<IntegrationPublicAsset[]>(
        (allAssets, currentStats) => {
            if (currentStats.isDirectory()) {
                const integrationName = currentStats.name;
                const integrationPublicFolderPath = path.join(
                    integrationsRootPath,
                    integrationName,
                    'public',
                );
                const integrationFunctionsFolderPath = path.join(
                    integrationPublicFolderPath,
                    'functions',
                );

                if (
                    fs.existsSync(integrationFunctionsFolderPath) &&
                    fs.statSync(integrationFunctionsFolderPath).isDirectory()
                ) {
                    integrationsFunctions.push({
                        integration: integrationName,
                        functionsFolderPath: integrationFunctionsFolderPath,
                    });
                }

                if (!fs.existsSync(integrationPublicFolderPath)) {
                    return allAssets;
                }

                const integrationAssets = listIntegrationPublicAssets(
                    integrationName,
                    integrationPublicFolderPath,
                );

                return [...allAssets, ...integrationAssets];
            }
            return allAssets;
        },
        [],
    );

    return {
        integrationsAssets,
        integrationsFunctions,
    };
}

/**
 * Write all public assets from the integration to the dist folder that is uploaded to Cloudfare pages project.
 */
async function writeAssetsToDistFolder(distFolder: string, assets: IntegrationPublicAsset[]) {
    if (fs.existsSync(distFolder)) {
        await fs.promises.rm(distFolder, { recursive: true });
    }

    await Promise.all(
        assets.map(async (asset) => {
            const assetFile = await fs.promises.readFile(
                path.join(asset.assetsFolderPath, asset.assetFilename),
            );
            const assetDistFolderPath = path.join(distFolder, asset.integration);
            await fs.promises.mkdir(assetDistFolderPath, { recursive: true });

            await fs.promises.writeFile(
                path.join(assetDistFolderPath, asset.assetFilename),
                assetFile,
            );
        }),
    );
}

/**
 * Copy all public functions from the integration to the functions folder that is uploaded to Cloudfare pages project.
 */
async function copyFunctionsToFunctionsFolder(
    functionsFolder: string,
    functions: IntegrationFunctionsFolder[],
) {
    if (fs.existsSync(functionsFolder)) {
        await fs.promises.rm(functionsFolder, { recursive: true });
    }

    await Promise.all(
        functions.map(async (integrationFunctions) => {
            await fs.promises.cp(
                integrationFunctions.functionsFolderPath,
                path.join(functionsFolder, integrationFunctions.integration),
                { recursive: true },
            );
        }),
    );
}

async function main() {
    console.log('⚙️  Building integration assets folder...');
    const distFolder = path.join(__dirname, assetsDistFolder);
    const functionsFolder = path.join(__dirname, functionsDistFolder);

    const { integrationsAssets, integrationsFunctions } = listAllPublicFoldersContent();
    await writeAssetsToDistFolder(distFolder, integrationsAssets);
    await copyFunctionsToFunctionsFolder(functionsFolder, integrationsFunctions);
}

main()
    .then(() => {
        console.log('✨ Success');
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
