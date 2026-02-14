// Neural Network implementation in JavaScript

class NeuralNetwork {
    constructor(learningRate) {
        this.weights = [Math.random() * 2 - 1, Math.random() * 2 - 1];
        this.bias = Math.random() * 2 - 1;
        this.learningRate = learningRate;
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    sigmoidDeriv(x) {
        const s = this.sigmoid(x);
        return s * (1 - s);
    }

    predict(inputVector) {
        const layer1 = inputVector[0] * this.weights[0] + inputVector[1] * this.weights[1] + this.bias;
        const layer3 = this.sigmoid(layer1);
        return layer3;
    }

    computeGradients(inputVector, target) {
        const layer1 = inputVector[0] * this.weights[0] + inputVector[1] * this.weights[1] + this.bias;
        const prediction = this.sigmoid(layer1);

        const derrorDprediction = 2 * (prediction - target);
        const dpredictionDlayer1 = this.sigmoidDeriv(layer1);

        const derrorDbias = derrorDprediction * dpredictionDlayer1;
        const derrorDweights = [
            derrorDprediction * dpredictionDlayer1 * inputVector[0],
            derrorDprediction * dpredictionDlayer1 * inputVector[1]
        ];

        return [derrorDbias, derrorDweights];
    }

    updateParameters(derrorDbias, derrorDweights) {
        this.bias -= derrorDbias * this.learningRate;
        this.weights[0] -= derrorDweights[0] * this.learningRate;
        this.weights[1] -= derrorDweights[1] * this.learningRate;
    }

    train(inputVectors, targets, iterations) {
        let correct = 0;
        let incorrect = 0;

        const cumulativeErrors = [];
        const cumulativePredictions = [];
        const fitX = [];
        const fitY = [];
        const pointsCorrect = [];
        const pointsIncorrect = [];
        let totalCorrect = 0;
        let totalIncorrect = 0;

        for (let currentIteration = 0; currentIteration < iterations; currentIteration++) {
            const randomDataIndex = Math.floor(Math.random() * inputVectors.length);
            const inputVector = inputVectors[randomDataIndex];
            const target = targets[randomDataIndex];

            const [derrorDbias, derrorDweights] = this.computeGradients(inputVector, target);
            this.updateParameters(derrorDbias, derrorDweights);

            if (currentIteration % 100 === 0) {
                let cumulativeError = 0;
                let cumulativePrediction = 0;

                for (let i = 0; i < inputVectors.length; i++) {
                    const dataPoint = inputVectors[i];
                    const targetVal = targets[i];
                    const prediction = this.predict(dataPoint);
                    const error = Math.pow(prediction - targetVal, 2);
                    cumulativeError += error;
                    cumulativePrediction += prediction;

                    const x = currentIteration;
                    fitX.push(x);
                    fitY.push(prediction);

                    const isCorrect = (targetVal === 1 && prediction >= 0.5) || (targetVal === 0 && prediction < 0.5);
                    if (isCorrect) {
                        totalCorrect++;
                        pointsCorrect.push({ x, y: prediction });
                    } else {
                        totalIncorrect++;
                        pointsIncorrect.push({ x, y: prediction });
                    }
                }

                cumulativePredictions.push(cumulativePrediction);
                cumulativeErrors.push(cumulativeError);
            }
        }

        return {
            cumulativeErrors,
            cumulativePredictions,
            fitX,
            fitY,
            pointsCorrect,
            pointsIncorrect,
            correct: totalCorrect,
            incorrect: totalIncorrect
        };
    }
}

function neuralNetwork(learningRate = 0.001, iterations = 100000) {
    const inputVectors = [
        [3, 1.5],
        [2, 1],
        [4, 1.5],
        [3, 4],
        [3.5, 0.5],
        [2, 0.5],
        [5.5, 1],
        [1, 1],
    ];

    const targets = [0, 1, 0, 1, 0, 1, 1, 0];
    const nn = new NeuralNetwork(learningRate);
    const trainingResults = nn.train(inputVectors, targets, iterations);

    return trainingResults;
}
