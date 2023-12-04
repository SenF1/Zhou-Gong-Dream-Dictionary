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

            document.getElementById('shareDream').style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
    });

    document.getElementById('shareButton').addEventListener('click', function () {
        // Get the text from the dreamInput textarea
        const nameInputText = document.getElementById('nameInput').value;
        const dreamInputText = document.getElementById('dreamInput').value;
        const locationInputText = document.getElementById('locationInput').value;
    
        // Check if the input is empty
        if (!dreamInputText.trim()) {
            console.error('Dream description cannot be empty');
            return;
        }
    
        // Send an HTTP POST request to insert the text into the database
        fetch('/dream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: nameInputText,
                description: dreamInputText,
                location: locationInputText,
            }),
        })
        .then(response => {
            if (response.ok) {
                console.log('Dream shared successfully');
                document.getElementById('dreamInput').value = '';
                document.getElementById('nameInput').value = '';
                document.getElementById('locationInput').value = '';
            } else {
                console.error('Failed to share dream');
            }
        })
        .catch(error => {
            // Handle network errors
            console.error('Network error:', error);
        });
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
