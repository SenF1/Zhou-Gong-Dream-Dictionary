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
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            if (data.success) {
                const formattedTimestamp = formatTimestamp(data.timestamp);
                const newDream = {
                    name: nameInputText,
                    description: dreamInputText,
                    timestamp: formattedTimestamp, // Now this data comes from the server
                    location: locationInputText
                };
                addDreamAsCard(newDream);

                // Clear inputs
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

    fetch('/dreams')
        .then(response => response.json())
        .then(dreams => {
            const section = document.getElementById('allDreams');
            section.innerHTML = '';
            dreams.forEach(dream => {
                addDreamAsCard(dream);
            });
        })
        .catch(error => {
            console.error('Error fetching dreams:', error);
            section.innerHTML = '<p>Error loading dreams.</p>';
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

function addDreamAsCard(dream) {
    const allDreamsSection = document.getElementById('allDreams');

    const card = document.createElement('div');
    card.classList.add('card');
    card.style.width = '18rem';

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = dream.name; 

    const subtitle = document.createElement('h6');
    subtitle.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
    subtitle.textContent = formatTimestamp(dream.timestamp); 

    const description = document.createElement('h10');
    description.classList.add('card-text');
    description.textContent = dream.description;

    cardBody.appendChild(title);
    cardBody.appendChild(subtitle);
    cardBody.appendChild(description);

    card.appendChild(cardBody);
    allDreamsSection.appendChild(card);
}

function formatTimestamp(isoTimestamp) {
    const date = new Date(isoTimestamp);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 because months are 0-indexed.
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}
