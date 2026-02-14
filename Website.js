// Neural Network Training Function with Visualization
function runNetwork() {
    const learningRate = parseFloat(document.getElementById('learningRate').value);
    const iterations = parseInt(document.getElementById('iterations').value);
    
    // Validate inputs
    if (isNaN(learningRate) || learningRate <= 0) {
        alert('Please enter a valid learning rate greater than 0');
        return;
    }
    if (isNaN(iterations) || iterations <= 0) {
        alert('Please enter a valid number of iterations greater than 0');
        return;
    }
    
    document.getElementById('status').innerText = 'Training neural network... This may take a few seconds.';
    
    // Run training after a short delay to allow UI update
    setTimeout(() => {
        const results = neuralNetwork(learningRate, iterations);
        
        // Create visualizations
        plotCumulativeError(results.cumulativeErrors);
        plotPredictions(results.cumulativePredictions);
        plotBestFit(results.fitX, results.fitY, results.pointsCorrect, results.pointsIncorrect, results.correct, results.incorrect);
        
        document.getElementById('status').innerText = 'Training complete!';
    }, 100);
}

function plotCumulativeError(errors) {
    const ctx = document.getElementById('cumulativeErrorChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.cumulativeChart && typeof window.cumulativeChart.destroy === 'function') {
        window.cumulativeChart.destroy();
    }
    
    window.cumulativeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: errors.map((_, i) => i * 100),
            datasets: [{
                label: 'Cumulative Error',
                data: errors,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Cumulative Error During Training'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Iterations'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Error'
                    }
                }
            }
        }
    });
}

function plotPredictions(predictions) {
    const ctx = document.getElementById('predictionsChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.predictionsChart && typeof window.predictionsChart.destroy === 'function') {
        window.predictionsChart.destroy();
    }
    
    window.predictionsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: predictions.map((_, i) => i * 100),
            datasets: [{
                label: 'Cumulative Prediction',
                data: predictions,
                borderColor: 'rgb(255, 159, 64)',
                backgroundColor: 'rgba(255, 159, 64, 0.1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Value Predicted by the Model'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Iterations'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Prediction'
                    }
                }
            }
        }
    });
}

function plotBestFit(fitX, fitY, pointsCorrect, pointsIncorrect, correct, incorrect) {
    const ctx = document.getElementById('bestFitChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.bestFitChart && typeof window.bestFitChart.destroy === 'function') {
        window.bestFitChart.destroy();
    }
    
    // Calculate best fit line (simple linear regression)
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < fitX.length; i++) {
        sumX += fitX[i];
        sumY += fitY[i];
        sumXY += fitX[i] * fitY[i];
        sumX2 += fitX[i] * fitX[i];
    }
    const n = fitX.length;
    
    // Handle edge case where denominator could be zero
    let slope = 0;
    let intercept = sumY / n; // Use mean as fallback
    const denominator = (n * sumX2 - sumX * sumX);
    
    if (Math.abs(denominator) > 0.0001) { // Avoid division by zero
        slope = (n * sumXY - sumX * sumY) / denominator;
        intercept = (sumY - slope * sumX) / n;
    }
    
    const bestFitLine = fitX.map(x => slope * x + intercept);
    
    // Get min and max X values for decision boundary line
    const minX = Math.min(...fitX);
    const maxX = Math.max(...fitX);
    
    window.bestFitChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Decision Boundary (0.5) - Above = Yes, Below = No',
                    data: [{x: minX, y: 0.5}, {x: maxX, y: 0.5}],
                    borderColor: 'rgb(34, 139, 34)',
                    backgroundColor: 'transparent',
                    showLine: true,
                    borderWidth: 3,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0,
                    pointRadius: 0
                },
                {
                    label: 'Best Fit Line',
                    data: fitX.map((x, i) => ({x: x, y: bestFitLine[i]})),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'transparent',
                    showLine: true,
                    borderWidth: 2,
                    fill: false,
                    tension: 0
                },
                {
                    label: `Correct Predictions (${correct})`,
                    data: pointsCorrect.map(p => ({x: p.x, y: p.y})),
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.8)',
                    showLine: false
                },
                {
                    label: `Incorrect Predictions (${incorrect})`,
                    data: pointsIncorrect.map(p => ({x: p.x, y: p.y})),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.8)',
                    showLine: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Prediction Accuracy'
                },
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Iterations'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Prediction'
                    }
                }
            }
        }
    });
}