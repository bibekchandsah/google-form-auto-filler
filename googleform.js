// ==UserScript==
// @name         Google Form Auto Filler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically fill Google Forms with predefined data
// @author       You
// @match        https://docs.google.com/forms/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Configuration object with field mappings
    const formData = {
        'Roll No': '22054029',
        'Full Name': 'Bibek Chand Sah',
        'Name': 'Bibek Chand Sah',
        'Stream': 'B.Tech',
        'Branch': 'CSE',
        'Gender': 'Male',
        'Mail ID': 'bibeksha48@gmail.com',
        'Mali ID': 'bibeksha48@gmail.com', // Handle typo in form
        'Mobile No': '8235981727',
        '10th %': '93.75',
        '10t %': '93.75', // Handle typo in form
        '10th YOP': '2020',
        '12th/Diploma %': '91.25',
        '12th/Diploma YOP': '2021',
        'Graduation %': '83.65',
        'YOP': '2026',
        'Nationality': 'Nepalese',
        'No. of Backlogs': '0' // Adding common field
    };

    // Function to find field title and return the corresponding value
    function getValueForField(titleText) {
        // Clean the title text (remove asterisks, trim whitespace)
        const cleanTitle = titleText.replace(/\s*\*\s*$/, '').trim();

        // Check for exact matches first
        if (formData[cleanTitle]) {
            return formData[cleanTitle];
        }

        // Check for case-insensitive matches
        for (const [key, value] of Object.entries(formData)) {
            if (key.toLowerCase() === cleanTitle.toLowerCase()) {
                return value;
            }
        }

        return null;
    }

    // Function to fill text inputs
    function fillTextInput(input, value) {
        if (!input || !value) return false;

        // Set the value
        input.value = value;

        // Trigger events to ensure Google Forms recognizes the input
        const events = ['input', 'change', 'blur'];
        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            input.dispatchEvent(event);
        });

        return true;
    }

    // Highlight dropdown options for manual selection
    function selectDropdownOption(container, value) {
        if (!container || !value) return false;

        return new Promise((resolve) => {
            try {
                console.log(`🔍 Highlighting dropdown option for manual selection: ${value}`);

                // Find all options with data-value attribute
                const allOptions = container.querySelectorAll('[role="option"][data-value]');
                console.log(`Found ${allOptions.length} options with data-value`);

                let targetOption = null;

                // Look for exact match by data-value or text content
                for (const option of allOptions) {
                    const dataValue = option.getAttribute('data-value');
                    const textElement = option.querySelector('.vRMGwf.oJeWuf');
                    const textValue = textElement ? textElement.textContent.trim() : '';

                    console.log(`Option - data-value: "${dataValue}", text: "${textValue}"`);

                    // Check both data-value and text content for matches
                    if ((dataValue && dataValue.toLowerCase() === value.toLowerCase()) ||
                        (textValue && textValue.toLowerCase() === value.toLowerCase() && textValue.toLowerCase() !== 'choose')) {
                        targetOption = option;
                        console.log(`✅ Found matching option: data-value="${dataValue}", text="${textValue}"`);
                        break;
                    }
                }

                if (targetOption) {
                    // Highlight the option for manual selection
                    console.log(`🎯 Highlighting "${value}" option for manual selection`);

                    // Add visual highlighting with a distinctive style
                    const originalStyle = targetOption.style.cssText;
                    targetOption.style.cssText += `
                        background: linear-gradient(45deg, #ffeb3b, #ffc107) !important;
                        border: 3px solid #ff5722 !important;
                        box-shadow: 0 0 15px #ff5722, inset 0 0 10px rgba(255,87,34,0.3) !important;
                        transform: scale(1.02) !important;
                        z-index: 9999 !important;
                        position: relative !important;
                    `;

                    // Add a label to make it super clear
                    const label = document.createElement('div');
                    label.style.cssText = `
                        position: absolute;
                        top: -25px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: #ff5722;
                        color: white;
                        padding: 2px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: bold;
                        z-index: 10000;
                        pointer-events: none;
                    `;
                    label.textContent = `👆 CLICK ME: ${value}`;
                    targetOption.style.position = 'relative';
                    targetOption.appendChild(label);

                    // Scroll to the option
                    targetOption.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Clean up highlighting after 15 seconds
                    setTimeout(() => {
                        targetOption.style.cssText = originalStyle;
                        if (label.parentNode) {
                            label.parentNode.removeChild(label);
                        }
                    }, 15000);

                    resolve(true); // Return true to indicate we found and highlighted the option

                } else {
                    console.log(`❌ No matching option found for value: ${value}`);
                    resolve(false);
                }

            } catch (error) {
                console.error('Error in selectDropdownOption:', error);
                resolve(false);
            }
        });
    }

    // Function to process all form fields
    async function fillForm() {
        console.log('Starting Google Form auto-fill...');

        // Find all question containers
        const questionContainers = document.querySelectorAll('.Qr7Oae');

        for (let index = 0; index < questionContainers.length; index++) {
            const container = questionContainers[index];
            try {
                // Find the title element
                const titleElement = container.querySelector('.M7eMe');
                if (!titleElement) continue;

                const titleText = titleElement.textContent.trim();
                const value = getValueForField(titleText);

                if (!value) {
                    console.log(`No value found for field: "${titleText}"`);
                    continue;
                }

                console.log(`Processing field: "${titleText}" with value: "${value}"`);

                // Check if it's a text input field
                const textInput = container.querySelector('input.whsOnd.zHQkBf');
                if (textInput) {
                    const success = fillTextInput(textInput, value);
                    console.log(`Text input filled for "${titleText}": ${success}`);
                    continue;
                }

                // Check if it's a dropdown field
                const dropdownContainer = container.querySelector('.vQES8d');
                if (dropdownContainer) {
                    const success = await selectDropdownOption(dropdownContainer, value);
                    console.log(`Dropdown option selected for "${titleText}": ${success}`);
                    continue;
                }

                console.log(`Unknown field type for: "${titleText}"`);

            } catch (error) {
                console.error(`Error processing field ${index}:`, error);
            }
        }
    }

    // Function to add a fill button to the form
    function addFillButton() {
        // Check if button already exists
        if (document.getElementById('auto-fill-btn')) return;

        // Create the button
        const button = document.createElement('button');
        button.id = 'auto-fill-btn';
        button.textContent = '🚀 Fill Form (Manual Dropdowns)';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: #4285f4;
            color: white;
            border: none;
            padding: 12px 18px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
        `;

        // Add hover effect
        button.addEventListener('mouseenter', () => {
            button.style.background = '#3367d6';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = '#4285f4';
        });

        // Add click handler
        button.addEventListener('click', (e) => {
            e.preventDefault();

            // Show instructions
            const instructions = `
🤖 GOOGLE FORM AUTO-FILLER INSTRUCTIONS:

✅ TEXT FIELDS: Will be filled automatically
🎯 DROPDOWNS: Will be highlighted - you need to click them manually

The script will:
1. Fill all text inputs automatically
2. Highlight dropdown options with bright colors and labels
3. You manually click the highlighted dropdown options

Ready to start?
            `;

            if (confirm(instructions)) {
                fillForm();
            }
        });

        // Add button to page
        document.body.appendChild(button);
    }

    // Wait for the page to load completely
    function init() {
        // Add the fill button
        addFillButton();

        // Optional: Auto-fill on page load (uncomment if desired)
        // setTimeout(fillForm, 2000);

        console.log('🚀 Google Form Auto Filler loaded! Click the button to auto-fill text fields and highlight dropdown options.');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();