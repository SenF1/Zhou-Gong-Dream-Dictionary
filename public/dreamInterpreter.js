document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
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
            document.getElementById('dreamInterpretationResponse').innerText = data;
        })
        .catch(error => console.error('Error:', error));
    });
});
