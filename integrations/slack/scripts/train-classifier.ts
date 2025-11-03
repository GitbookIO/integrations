import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { NeuralNetwork, Trainers, Tensor } from 'toygrad';
import { Logger } from '@gitbook/runtime';
import { parse as csvParse } from '@vanillaes/csv';

const logger = Logger('slack:scripts:train-classifier');

const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * Clean text: remove mentions, punctuation, lowercase.
 */
function cleanText(text: string): string {
    return text
        .replace(/@\w+/g, '') // remove mentions
        .replace(/[^\w\s]/g, '') // remove punctuation
        .toLowerCase()
        .trim();
}

/**
 * Load CSV training data.
 */
function loadTrainingData(filePath: string): { text: string; intent: string }[] {
    if (!fs.existsSync(filePath)) {
        throw new Error(`CSV file not found: ${filePath}`);
    }

    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const rows = csvParse(csvContent) as string[][];
    const [, ...data] = rows;

    return data.map(([text, intent]) => ({
        text: text.trim(),
        intent: intent.trim(),
    }));
}

/**
 * Build vocabulary from training data.
 */
function buildVocabulary(records: { text: string; intent: string }[]): string[] {
    const vocabSet = new Set<string>();
    for (const r of records) {
        const words = cleanText(r.text).match(/\b\w+\b/g) || [];
        for (const word of words) {
            vocabSet.add(word);
        }
    }
    return Array.from(vocabSet);
}

/**
 * Convert text to weighted bag-of-words vector.
 */
function textToWordVector(text: string, vocabulary: string[]): Float32Array {
    const vector = new Float32Array(vocabulary.length);
    const words = cleanText(text).match(/\b\w+\b/g) || [];
    for (const word of words) {
        const idx = vocabulary.indexOf(word);
        if (idx !== -1) {
            vector[idx] += 1;
        }
    }
    return vector;
}

/**
 * Build or load the neural network model.
 */
function buildModel(inputSize: number, outputSize: number): NeuralNetwork {
    const options: NeuralNetwork['options'] = {
        layers: [
            { type: 'input', sx: 1, sy: 1, sz: inputSize },
            { type: 'dense', filters: 32 },
            { type: 'relu' },
            { type: 'dense', filters: 16 },
            { type: 'relu' },
            { type: 'dense', filters: outputSize },
            { type: 'softmax' },
        ],
    };

    const nn = new NeuralNetwork(options);
    return nn;
}

async function trainModel(
    nn: NeuralNetwork,
    records: { text: string; intent: string }[],
    vocabulary: string[],
    outputLabels: string[],
    epochs = 50,
    batchSize = 4,
) {
    const trainingInputs: Tensor[] = [];
    const trainingTargets: number[] = []; // target label indices

    for (const r of records) {
        const vec = textToWordVector(r.text, vocabulary);
        const inputTensor = new Tensor(1, 1, vec.length, vec);
        trainingInputs.push(inputTensor);

        const targetIdx = outputLabels.indexOf(r.intent);
        if (targetIdx === -1) {
            throw new Error(`Unknown intent label: ${r.intent}`);
        }
        trainingTargets.push(targetIdx);
    }

    const trainer = new Trainers.Adadelta(nn, {
        batchSize: batchSize,
    });

    logger.info(`🚀 Training model on ${records.length} examples for ${epochs} epochs...`);

    for (let epoch = 0; epoch < epochs; epoch++) {
        for (let i = 0; i < trainingInputs.length; i++) {
            trainer.train(trainingInputs[i], trainingTargets[i]);
        }
        if ((epoch + 1) % 10 === 0) {
            logger.info(`Epoch ${epoch + 1}/${epochs} done`);
        }
    }

    logger.info('✅ Training complete');
}

/**
 * Save model, vocabulary, and output labels into JSON file for classifier to use.
 */
function saveModel(
    nn: NeuralNetwork,
    vocabulary: string[],
    outputLabels: string[],
    filePath: string,
) {
    const options = nn.getAsOptions('f32');
    const serialized = {
        model: options,
        vocabulary,
        outputLabels,
    };
    fs.writeFileSync(filePath, JSON.stringify(serialized, null, 2));
    logger.info(`💾 Saved updated classifier to ${filePath}`);
}

async function main() {
    const program = new Command();

    program
        .name('train-classifier')
        .description('Train or update the action intent classifier from a CSV file')
        .requiredOption('-c, --csv <path>', 'Path to the training CSV file')
        .option(
            '-m, --model <path>',
            'Path to serialized model JSON',
            '../src/actions/intent/classifier-model.json',
        )
        .parse(process.argv);

    const opts = program.opts();
    const csvPath = path.resolve(opts.csv);
    const modelPath = path.resolve(__dirname, opts.model);

    try {
        const records = loadTrainingData(csvPath);
        const vocabulary = buildVocabulary(records);
        const outputLabels = Array.from(new Set(records.map((r) => r.intent)));

        const inputSize = vocabulary.length;
        const outputSize = outputLabels.length;

        logger.info(`Vocabulary size: ${inputSize}`);
        logger.info(`Output labels: ${outputLabels.join(', ')}`);

        const nn = buildModel(inputSize, outputSize);

        await trainModel(nn, records, vocabulary, outputLabels, 50, 4);

        saveModel(nn, vocabulary, outputLabels, modelPath);
    } catch (err) {
        logger.error('❌ Error:', (err as Error).message);
        process.exit(1);
    }
}

main();
