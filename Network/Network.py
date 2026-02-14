import numpy as np
import matplotlib.pyplot as plt

class NeuralNetwork:

    def __init__(self, learning_rate):
        self.weights = np.array([np.random.randn(), np.random.randn()])
        self.bias = np.random.randn()
        self.learning_rate = learning_rate

    def _sigmoid(self, x):
        return 1 / (1 + np.exp(-x))

    def _sigmoid_deriv(self, x):
        s = self._sigmoid(x)
        return s * (1 - s)
    
    def _approx(self, x):
        pass
        #layer 2

    def predict(self, input_vector):
        layer_1 = np.dot(input_vector, self.weights) + self.bias
        layer_3 = self._sigmoid(layer_1)
        prediction = layer_3
        return prediction

    def _compute_gradients(self, input_vector, target):
        layer_1 = np.dot(input_vector, self.weights) + self.bias
        prediction = self._sigmoid(layer_1)

        derror_dprediction = 2 * (prediction - target)
        dprediction_dlayer1 = self._sigmoid_deriv(layer_1)

        derror_dbias = derror_dprediction * dprediction_dlayer1
        derror_dweights = derror_dprediction * dprediction_dlayer1 * input_vector

        return derror_dbias, derror_dweights

    def _update_parameters(self, derror_dbias, derror_dweights):
        self.bias -= derror_dbias * self.learning_rate
        self.weights -= derror_dweights * self.learning_rate

    def train(self, input_vectors, targets, iterations):
        plt.plot(0, 0, color='blue')
        plt.plot(0, 0, color='red')

        correct = 0
        incorrect = 0

        cumulative_errors = []
        cumulative_predictions = []

        # Store points for best-fit line
        fit_x = []
        fit_y = []

        for current_iteration in range(iterations):
            random_data_index = np.random.randint(len(input_vectors))
            input_vector = input_vectors[random_data_index]
            target = targets[random_data_index]

            derror_dbias, derror_dweights = self._compute_gradients(
                input_vector, target
            )
            self._update_parameters(derror_dbias, derror_dweights)

            if current_iteration % 100 == 0:
                cumulative_error = 0
                cumulative_prediction = 0

                for i in range(len(input_vectors)):
                    data_point = input_vectors[i]
                    target = targets[i]

                    prediction = self.predict(data_point)
                    error = np.square(prediction - target)
                    cumulative_error += error
                    cumulative_prediction += prediction

                    x = current_iteration / 100
                    fit_x.append(x)
                    fit_y.append(prediction)
                    if (target == 1 and prediction >= 0.5) or (target == 0 and prediction < 0.5):
                        correct += 1
                    else:
                        incorrect += 1

                    plt.plot(x, prediction, 'x', color='blue' if (target == 1 and prediction >= 0.5) or (target == 0 and prediction < 0.5) else 'red')

                cumulative_predictions.append(cumulative_prediction)
                cumulative_errors.append(cumulative_error)

        # Plot line of best fit
        fit_x = np.array(fit_x)
        fit_y = np.array(fit_y)

        m, b = np.polyfit(fit_x, fit_y, 1)
        best_fit_y = m * fit_x + b

        plt.plot(fit_x, best_fit_y)
        plt.xlabel("Iterations / 100")
        plt.ylabel("Prediction Accuracy")
        plt.legend(["correct predictions: " + str(correct), "incorrect predictions: " + str(incorrect)])
        plt.plot(0, 0.5, "o", color='green', label='Decision Boundary')
        plt.savefig("Network/prediction_best_fit.png")
        plt.clf()

        plt.plot(cumulative_predictions)
        plt.xlabel("Iterations / 100")
        plt.ylabel("Prediction")
        plt.title("Value predicited by the model")
        plt.savefig("Network/predicted.png")
        plt.clf()

        return cumulative_errors


def neuralNetwork():
    input_vectors = np.array(
        [
            [3, 1.5],
            [2, 1],
            [4, 1.5],
            [3, 4],
            [3.5, 0.5],
            [2, 0.5],
            [5.5, 1],
            [1, 1],
        ]
    )

    targets = np.array([0, 1, 0, 1, 0, 1, 1, 0])
    learning_rate = 0.001
    neural_network = NeuralNetwork(learning_rate)
    training_error = neural_network.train(input_vectors, targets, 100000)

    plt.plot(training_error)
    plt.xlabel("Iterations / 100")
    plt.ylabel("Error for all training instances")
    plt.title("Cumulative Error During Training")
    plt.savefig("Network/cumulative_error.png")
    plt.clf()


neuralNetwork()
