let travelData = null;

// Task 6: Fetch data from travel_recommendation_api.json
fetch('./travel_recommendation_api.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        travelData = data;
        console.log('Fetched Travel Data:', travelData);
    })
    .catch(error => {
        console.error('Error fetching travel recommendation data:', error);
    });

// DOM Elements
const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');
const conditionInput = document.getElementById('conditionInput');
const resultContainer = document.getElementById('resultContainer');

// Task 7 & 8: Search Keyword Logic
function handleSearch() {
    if (!travelData) {
        console.warn('Data is not loaded yet.');
        return;
    }

    const keyword = conditionInput.value.trim().toLowerCase();
    resultContainer.innerHTML = ''; // Clear previous results

    if (!keyword) {
        resultContainer.style.display = 'none';
        return;
    }

    let recommendations = [];

    // Match keyword variations for beaches, temples, and countries
    if (keyword === 'beach' || keyword === 'beaches') {
        recommendations = travelData.beaches || [];
    } else if (keyword === 'temple' || keyword === 'temples') {
        recommendations = travelData.temples || [];
    } else if (keyword === 'country' || keyword === 'countries') {
        // Collect all cities across all country entries
        if (travelData.countries) {
            travelData.countries.forEach(country => {
                recommendations = recommendations.concat(country.cities);
            });
        }
    } else {
        // Match specific country or city names
        if (travelData.countries) {
            const matchedCountry = travelData.countries.find(
                c => c.name.toLowerCase().includes(keyword)
            );
            if (matchedCountry) {
                recommendations = matchedCountry.cities;
            }
        }
    }

    displayResults(recommendations);
}

// Display matching recommendations
function displayResults(results) {
    if (!results || results.length === 0) {
        resultContainer.innerHTML = '<p class="no-result">No recommendations found.</p>';
        resultContainer.style.display = 'block';
        return;
    }

    resultContainer.style.display = 'grid'; // CSS grid layout

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

// Clear button handler
function handleClear() {
    conditionInput.value = '';
    resultContainer.innerHTML = '';
    resultContainer.style.display = 'none';
}

// Attach event listeners
if (btnSearch) btnSearch.addEventListener('click', handleSearch);
if (btnClear) btnClear.addEventListener('click', handleClear);

// Task 9: Clear button logic
function clearSearch() {
    const conditionInput = document.getElementById('conditionInput');
    const resultContainer = document.getElementById('resultContainer');

    if (conditionInput) {
        conditionInput.value = '';
    }

    if (resultContainer) {
        resultContainer.innerHTML = '';
        resultContainer.style.display = 'none';
    }
}

// Attach event listener using the existing btnClear variable
if (btnClear) {
    btnClear.addEventListener('click', clearSearch);
}