// Initialize Flatpickr for date input
const dateInput = document.getElementById('dateInput');
const resultBox = document.getElementById('result');
const copyBtn = document.getElementById('copyBtn');
const formatBtns = document.querySelectorAll('.format-btn');

let selectedDate = null;
let currentFormat = 'YYYY-MM-DD';

// Format mapping for date-fns library
const formatMap = {
    'YYYY-MM-DD': 'yyyy-MM-dd',
    'MM/DD/YYYY': 'MM/dd/yyyy',
    'DD/MM/YYYY': 'dd/MM/yyyy',
    'MMMM DD, YYYY': 'MMMM dd, yyyy',
    'ddd, MMM DD YYYY': 'eee, MMM dd yyyy',
    'DD-MMM-YYYY': 'dd-MMM-yyyy'
};

// Initialize Flatpickr
flatpickr(dateInput, {
    mode: 'single',
    dateFormat: 'Y-m-d',
    onChange: function(selectedDates) {
        if (selectedDates.length > 0) {
            selectedDate = selectedDates[0];
            updateResult();
        }
    }
});

// Format button click handlers
formatBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all buttons
        formatBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        // Update current format
        currentFormat = this.dataset.format;
        // Update result if date is selected
        if (selectedDate) {
            updateResult();
        }
    });
});

// Update result display
function updateResult() {
    if (!selectedDate) {
        resultBox.textContent = 'Select a date to see the result';
        copyBtn.disabled = true;
        resultBox.parentElement.classList.remove('active');
        return;
    }

    try {
        // Use date-fns for formatting
        const formatted = window.dateFns.format(selectedDate, formatMap[currentFormat]);
        resultBox.textContent = formatted;
        copyBtn.disabled = false;
        resultBox.parentElement.classList.add('active');
    } catch (error) {
        resultBox.textContent = 'Error formatting date';
        copyBtn.disabled = true;
    }
}

// Copy to clipboard functionality
copyBtn.addEventListener('click', function() {
    const text = resultBox.textContent;
    navigator.clipboard.writeText(text).then(() => {
        // Show feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
});