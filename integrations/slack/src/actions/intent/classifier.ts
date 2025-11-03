import { NeuralNetwork, Tensor } from 'toygrad';
import { model, vocabulary, outputLabels } from './classifier-model.json';

/**
 * Convert text to bag-of-words vector.
 */
function textToWordVector(text: string, vocabulary: string[]): Float32Array {
    const vector = new Float32Array(vocabulary.length);
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    for (const word of words) {
        const idx = vocabulary.indexOf(word);
        if (idx !== -1) vector[idx] += 1;
    }
    return vector;
}

/**
 * Load trained neural network from serialized model options.
 */
function loadNetwork(options: any): NeuralNetwork {
    return new NeuralNetwork(options);
}

const network = loadNetwork(model);

/**
 * Extract intent from a message.
 */
export function extractIntentFromMessage(text: string) {
    const inputVector = textToWordVector(text, vocabulary);
    const inputTensor = new Tensor(1, 1, inputVector.length, inputVector);

    const outputTensor = network.forward(inputTensor, false);
    const outputArray = Array.from(outputTensor.w); // softmax probabilities

    let bestIdx = 0;
    for (let i = 1; i < outputArray.length; i++) {
        if (outputArray[i] > outputArray[bestIdx]) bestIdx = i;
    }

    return {
        intent: outputLabels[bestIdx],
        confidence: Number(outputArray[bestIdx].toFixed(2)),
    };
}
