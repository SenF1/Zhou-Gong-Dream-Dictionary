document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();

        // Hide the response div initially
        document.getElementById('dreamInterpretationResponse').style.display = 'none';
        showLoadingSpinner()
        
        // AJAX call
        const dreamDescription = document.getElementById('dreamInput').value;

        fetch('/interpret-dream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `dreamDescription=${encodeURIComponent(dreamDescription)}`
        })
        .then(response => response.text())
        .then(data => {
            hideLoadingSpinner();
            const responseDiv = document.getElementById('dreamInterpretationResponse');
            responseDiv.innerHTML = data; 
            responseDiv.style.display = 'block'; 
        })
        .catch(error => console.error('Error:', error));
    });
});

function showLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';
}

function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'none';
}
