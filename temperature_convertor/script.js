class TemperatureConverter {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.temperatureInput = document.getElementById('temperature-input');
        this.errorMessage = document.getElementById('error-message');
        this.convertBtn = document.getElementById('convert-btn');
        this.resultsSection = document.getElementById('results-section');
        
        // Result display elements
        this.celsiusResult = document.getElementById('celsius-result');
        this.fahrenheitResult = document.getElementById('fahrenheit-result');
        this.kelvinResult = document.getElementById('kelvin-result');
        
        // Radio buttons for unit selection
        this.fromUnitRadios = document.querySelectorAll('input[name="from-unit"]');
    }

    attachEventListeners() {
        // Convert button click
        this.convertBtn.addEventListener('click', () => this.convertTemperature());
        
        // Enter key press in input field
        this.temperatureInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.convertTemperature();
            }
        });
        
        // Input validation on typing
        this.temperatureInput.addEventListener('input', () => this.clearError());
        
        // Real-time conversion as user types (optional enhancement)
        this.temperatureInput.addEventListener('input', () => {
            if (this.temperatureInput.value.trim() !== '') {
                this.convertTemperature();
            }
        });
        
        // Unit change triggers conversion if input exists
        this.fromUnitRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (this.temperatureInput.value.trim() !== '') {
                    this.convertTemperature();
                }
            });
        });
    }

    getSelectedUnit() {
        const selectedRadio = document.querySelector('input[name="from-unit"]:checked');
        return selectedRadio ? selectedRadio.value : 'celsius';
    }

    validateInput(value) {
        // Check if input is empty
        if (value.trim() === '') {
            this.showError('Please enter a temperature value');
            return false;
        }

        // Check if input is a valid number
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            this.showError('Please enter a valid number');
            return false;
        }

        // Check for absolute zero violations
        const fromUnit = this.getSelectedUnit();
        if (fromUnit === 'kelvin' && numValue < 0) {
            this.showError('Kelvin temperature cannot be negative');
            return false;
        }
        
        if (fromUnit === 'celsius' && numValue < -273.15) {
            this.showError('Temperature cannot be below absolute zero (-273.15°C)');
            return false;
        }
        
        if (fromUnit === 'fahrenheit' && numValue < -459.67) {
            this.showError('Temperature cannot be below absolute zero (-459.67°F)');
            return false;
        }

        return true;
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.temperatureInput.classList.add('error');
    }

    clearError() {
        this.errorMessage.textContent = '';
        this.temperatureInput.classList.remove('error');
    }

    // Conversion functions
    celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }

    celsiusToKelvin(celsius) {
        return celsius + 273.15;
    }

    fahrenheitToCelsius(fahrenheit) {
        return (fahrenheit - 32) * 5/9;
    }

    fahrenheitToKelvin(fahrenheit) {
        return this.celsiusToKelvin(this.fahrenheitToCelsius(fahrenheit));
    }

    kelvinToCelsius(kelvin) {
        return kelvin - 273.15;
    }

    kelvinToFahrenheit(kelvin) {
        return this.celsiusToFahrenheit(this.kelvinToCelsius(kelvin));
    }

    convertTemperature() {
        const inputValue = this.temperatureInput.value;
        
        // Validate input
        if (!this.validateInput(inputValue)) {
            return;
        }

        this.clearError();
        
        // Add converting animation
        this.convertBtn.classList.add('converting');
        
        // Simulate processing time for better UX
        setTimeout(() => {
            const temperature = parseFloat(inputValue);
            const fromUnit = this.getSelectedUnit();
            
            let celsius, fahrenheit, kelvin;

            // Convert to all units based on input unit
            switch (fromUnit) {
                case 'celsius':
                    celsius = temperature;
                    fahrenheit = this.celsiusToFahrenheit(temperature);
                    kelvin = this.celsiusToKelvin(temperature);
                    break;
                case 'fahrenheit':
                    celsius = this.fahrenheitToCelsius(temperature);
                    fahrenheit = temperature;
                    kelvin = this.fahrenheitToKelvin(temperature);
                    break;
                case 'kelvin':
                    celsius = this.kelvinToCelsius(temperature);
                    fahrenheit = this.kelvinToFahrenheit(temperature);
                    kelvin = temperature;
                    break;
            }

            // Display results with proper formatting
            this.displayResults(celsius, fahrenheit, kelvin);
            
            // Remove converting animation
            this.convertBtn.classList.remove('converting');
        }, 300);
    }

    displayResults(celsius, fahrenheit, kelvin) {
        // Format numbers to 2 decimal places, but remove unnecessary zeros
        const formatNumber = (num) => {
            return parseFloat(num.toFixed(2)).toString();
        };

        // Update result displays
        this.celsiusResult.textContent = `${formatNumber(celsius)}°C`;
        this.fahrenheitResult.textContent = `${formatNumber(fahrenheit)}°F`;
        this.kelvinResult.textContent = `${formatNumber(kelvin)}K`;

        // Show results section with animation
        this.resultsSection.classList.add('show');

        // Add a subtle highlight effect to the converted values
        this.animateResults();
    }

    animateResults() {
        const resultItems = document.querySelectorAll('.result-item');
        
        resultItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'scale(1.02)';
                item.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.2)';
                
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                    item.style.boxShadow = 'none';
                }, 200);
            }, index * 100);
        });
    }

    // Utility method to get temperature info
    getTemperatureInfo(celsius) {
        if (celsius <= -200) return "Extremely cold - approaching absolute zero";
        if (celsius <= -100) return "Extremely cold";
        if (celsius <= 0) return "Below freezing";
        if (celsius <= 20) return "Cool";
        if (celsius <= 30) return "Comfortable";
        if (celsius <= 40) return "Warm";
        if (celsius <= 60) return "Hot";
        return "Extremely hot";
    }
}

// Initialize the temperature converter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TemperatureConverter();
    
    // Add some helpful console messages
    console.log('🌡️ Temperature Converter Loaded!');
    console.log('Features:');
    console.log('- Convert between Celsius, Fahrenheit, and Kelvin');
    console.log('- Real-time conversion as you type');
    console.log('- Input validation and error handling');
    console.log('- Responsive design for all devices');
});

// Add some useful utility functions for external use
window.TemperatureUtils = {
    celsiusToFahrenheit: (c) => (c * 9/5) + 32,
    fahrenheitToCelsius: (f) => (f - 32) * 5/9,
    celsiusToKelvin: (c) => c + 273.15,
    kelvinToCelsius: (k) => k - 273.15,
    fahrenheitToKelvin: (f) => ((f - 32) * 5/9) + 273.15,
    kelvinToFahrenheit: (k) => ((k - 273.15) * 9/5) + 32
};