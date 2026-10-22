let travelData = null;

// Task 6: Fetch JSON data using fetch API and verify in console.log
fetch('./travel_recommendation_api.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        travelData = data;
        // Log to console as required by Task 6 instructions
        console.log('Fetched travel data successfully:', travelData);
    })
    .catch(error => {
        console.error('Error fetching travel recommendation data:', error);
    });
    // Task 7: Keyword search matching using toLowerCase()
function searchRecommendations() {
    const inputField = document.getElementById('conditionInput');
    if (!inputField) return;

    // Convert search input to lower case and remove leading/trailing whitespace
    const keyword = inputField.value.trim().toLowerCase();

    if (!keyword) {
        const resultContainer = document.getElementById('resultContainer');
        if (resultContainer) resultContainer.style.display = 'none';
        return;
    }

    if (!travelData) {
        console.warn('Data is not loaded yet.');
        return;
    }

    let results = [];

    // Match keyword variations for beaches, temples, and countries
    if (keyword === 'beach' || keyword === 'beaches') {
        results = travelData.beaches || [];
    } else if (keyword === 'temple' || keyword === 'temples') {
        results = travelData.temples || [];
    } else if (keyword === 'country' || keyword === 'countries') {
        if (travelData.countries) {
            travelData.countries.forEach(country => {
                results = results.concat(country.cities);
            });
        }
    } else {
        // Direct country or city name matching
        if (travelData.countries) {
            const matchedCountry = travelData.countries.find(
                c => c.name.toLowerCase().includes(keyword)
            );
            if (matchedCountry) {
                results = matchedCountry.cities;
            }
        }
    }

    // Pass results to Task 8 display function
    displayResults(results);
}
// Task 8: Display recommendations with image, title, and description
function displayResults(results) {
    const resultContainer = document.getElementById('resultContainer');
    if (!resultContainer) return;

    // Clear previous results
    resultContainer.innerHTML = '';

    if (!results || results.length === 0) {
        resultContainer.innerHTML = '<p class="no-result">No recommendations found.</p>';
        resultContainer.style.display = 'block';
        return;
    }

    resultContainer.style.display = 'grid'; // Enable display grid

    // Generate recommendation card HTML elements
    results.forEach(place => {
        const card = document.createElement('div');
        card.className = 'result-card';

        card.innerHTML = `
            <img src="${place.imageUrl}" alt="${place.name}">
            <h3>${place.name}</h3>
            <p>${place.description}</p>
            <button class="btn-visit">Visit</button>
        `;

        resultContainer.appendChild(card);
    });
}
// Task 9: Clear button logic to clear input field and results
function clearSearch() {
    const inputField = document.getElementById('conditionInput');
    const resultContainer = document.getElementById('resultContainer');

    if (inputField) {
        inputField.value = '';
    }

    if (resultContainer) {
        resultContainer.innerHTML = '';
        resultContainer.style.display = 'none';
    }
}

// Attach event listeners after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const btnSearch = document.getElementById('btnSearch');
    const btnClear = document.getElementById('btnClear');

    if (btnSearch) {
        btnSearch.addEventListener('click', searchRecommendations);
    }

    if (btnClear) {
        btnClear.addEventListener('click', clearSearch);
    }
});
    