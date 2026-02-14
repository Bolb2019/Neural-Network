window.resizeTo(800, 600);

async function runNetwork() {
    const button = document.getElementById('Network');
    const originalText = button.textContent;
    button.textContent = 'Running...';
    button.disabled = true;
    
    try {
        const response = await fetch('/api/run-network', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Network training completed successfully!');
            // Refresh images
            location.reload();
        } else {
            alert('Error: ' + data.message);
            console.error(data.error);
        }
    } catch (error) {
        alert('Failed to connect to server: ' + error.message);
        console.error('Error:', error);
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}