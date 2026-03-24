// Get DOM elements
const dateInput = document.getElementById('dateInput');
const resultBox = document.getElementById('result');
const copyBtn = document.getElementById('copyBtn');
const formatBtns = document.querySelectorAll('.format-btn');

let selectedDate = null;
let currentFormat = 'YYYY-MM-DD';

// Format functions using native JavaScript methods
const formatFunctions = {
    'YYYY-MM-DD': (date) => date.toISOString().split('T')[0],
    'MM/DD/YYYY': (date) => {
        const d = new Date(date);
        return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
    },
    'DD/MM/YYYY': (date) => {
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    },
    'MMMM DD, YYYY': (date) => {
        const d = new Date(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return d.toLocaleDateString('en-US', options);
    },
    'ddd, MMM DD YYYY': (date) => {
        const d = new Date(date);
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return d.toLocaleDateString('en-US', options);
    },
    'DD-MMM-YYYY': (date) => {
        const d = new Date(date);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
    }
};

// Listen for date input changes
dateInput.addEventListener('change', function() {
    if (this.value) {
        selectedDate = new Date(this.value + 'T00:00:00');
        updateResult();
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
        // Use native JavaScript formatting
        const formatted = formatFunctions[currentFormat](selectedDate);
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