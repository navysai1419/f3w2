
function getCurrentTimezone() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            getTimezoneByCoordinates(latitude, longitude, true);
        }, (error) => {
            handleError("Geolocation error: " + error.message);
        });
    } else {
        handleError("Geolocation is not supported by this browser.");
    }
}


function displayCurrentTimezone(timezone) {
    const currentTimezone = document.getElementById("current-timezone-value");
    currentTimezone.textContent = timezone;
}


async function getTimezoneByCoordinates(latitude, longitude, isCurrent = false) {
    const apiKey = "a820fbb5bc2d4e9483a6a1b79676ed18";
    const url = `https://api.geoapify.com/v1/timezone/lookup?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        console.log("Response:", response); // Log the response
        if (!response.ok) {
            throw new Error(`Error fetching timezone: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Timezone Data:", data); // Log the timezone data

        if (data.timezone && data.timezone.name) {
            const timezone = data.timezone.name;
            if (isCurrent) {
                displayCurrentTimezone(timezone);
            } else {
                displayResultTimezone(timezone);
            }
        } else {
            throw new Error("Timezone data not found for the given coordinates.");
        }
    } catch (error) {
        handleError("Error fetching timezone: " + error.message);
    }
}


function getTimezone() {
    const address = document.getElementById("address-input").value;
    if (address.trim() === "") {
        handleError("Please enter a valid address.");
        return;
    }

    getCoordinatesByAddress(address);
}


async function getCoordinatesByAddress(address) {
    const apiKey = "a820fbb5bc2d4e9483a6a1b79676ed18";
    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${apiKey}`;

    try {
        const response = await fetch(geocodeUrl);
        if (!response.ok) {
            throw new Error(`Error fetching coordinates: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        if (data.features.length > 0) {
            const { lat, lon } = data.features[0].geometry;
            getTimezoneByCoordinates(lat, lon);
        } else {
            throw new Error("Address not found. Please enter a valid address.");
        }
    } catch (error) {
        handleError("Error fetching coordinates: " + error.message);
    }
}

function displayResultTimezone(timezone) {
    const timezoneResult = document.getElementById("timezone-result-value");
    timezoneResult.textContent = timezone;
}


function handleError(errorMessage) {
    console.error(errorMessage);
    alert(errorMessage);
}


getCurrentTimezone();
