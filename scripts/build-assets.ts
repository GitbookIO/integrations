import * as path from 'path';
import * as fs from 'fs';

interface IntegrationPublicAsset {
    /** The name of integration owning the asset */
    integration: string;

    /** The asset's filename */
    assetFilename: string;

    /** The full path to the asset path */
    assetsFolderPath: string;
}

/** The root folder for all the integrations */
const integrationsRootFolder = '../integrations';

/** The assets folder that is uploaded to the Cloudflare pages project */
const assetsDistFolder = '../dist';

/** The file extensions that we are filtering assets on */
const assetFilters = ['.png', '.svg'];

/**
 * List all public asset for one integration.
 */
function listIntegrationPublicAssets(
    integration: string,
    assetsFolderPath: string
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
        []
    );
}

/**
 * List all public assets for every integrations.
 */
function listAllPublicAssets() {
    const integrationsRootPath = path.join(__dirname, integrationsRootFolder);
    const integrationsStats = fs.readdirSync(integrationsRootPath, { withFileTypes: true });

    return integrationsStats.reduce<IntegrationPublicAsset[]>((allAssets, currentStats) => {
        if (currentStats.isDirectory()) {
            const integrationName = currentStats.name;
            const integrationPublicAssetsPath = path.join(
                integrationsRootPath,
                integrationName,
                'public'
            );
            if (!fs.existsSync(integrationPublicAssetsPath)) {
                return allAssets;
            }

            const integrationAssets = listIntegrationPublicAssets(
                integrationName,
                integrationPublicAssetsPath
            );

            return [...allAssets, ...integrationAssets];
        }
        return allAssets;
    }, []);
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
                path.join(asset.assetsFolderPath, asset.assetFilename)
            );
            const assetDistFolderPath = path.join(distFolder, asset.integration);
            await fs.promises.mkdir(assetDistFolderPath, { recursive: true });

            await fs.promises.writeFile(
                path.join(assetDistFolderPath, asset.assetFilename),
                assetFile
            );
        })
    );
}

async function main() {
    console.log('⚙️  Building integration assets folder...');
    const assets = listAllPublicAssets();
    await writeAssetsToDistFolder(path.join(__dirname, assetsDistFolder), assets);
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
