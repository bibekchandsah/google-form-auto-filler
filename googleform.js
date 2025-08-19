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

    // Default configuration object with field mappings
    let defaultFormData = {
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

    // Load form data from localStorage or use defaults
    let formData = loadFormData();

    // Function to load form data from localStorage
    function loadFormData() {
        try {
            const saved = localStorage.getItem('googleFormFillerData');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to ensure we have all base fields
                return { ...defaultFormData, ...parsed };
            }
        } catch (error) {
            console.log('Error loading saved data:', error);
        }
        return { ...defaultFormData };
    }

    // Function to save form data to localStorage
    function saveFormData(data) {
        try {
            localStorage.setItem('googleFormFillerData', JSON.stringify(data));
            console.log('✅ Form data saved to localStorage');
        } catch (error) {
            console.error('❌ Error saving form data:', error);
        }
    }

    // Function to show customization modal
    function showCustomizationModal() {
        return new Promise((resolve) => {
            // Create modal overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: Arial, sans-serif;
            `;

            // Create modal content
            const modal = document.createElement('div');
            modal.style.cssText = `
                background: white;
                border-radius: 12px;
                padding: 24px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                position: relative;
            `;

            // Create modal content using DOM methods (safer than innerHTML)

            // Create title
            const title = document.createElement('h2');
            title.style.cssText = 'margin: 0 0 20px 0; color: #333; text-align: center;';
            title.textContent = '🎯 Customize Your Form Data';
            modal.appendChild(title);

            // Create description
            const description = document.createElement('p');
            description.style.cssText = 'color: #666; text-align: center; margin-bottom: 20px;';
            description.textContent = 'Edit the values below to match your information';
            modal.appendChild(description);

            // Create form
            const form = document.createElement('form');
            form.id = 'customization-form';
            form.style.cssText = 'display: grid; gap: 12px;';

            // Function to create a field row
            function createFieldRow(key, value, isCustom = false) {
                const fieldId = `field-${key.replace(/[^a-zA-Z0-9]/g, '-')}`;

                // Create field container
                const fieldDiv = document.createElement('div');
                fieldDiv.style.cssText = `display: grid; grid-template-columns: 1fr 2fr ${isCustom ? 'auto' : ''}; gap: 8px; align-items: center;`;
                fieldDiv.setAttribute('data-field-key', key);

                // Create label
                const label = document.createElement('label');
                label.setAttribute('for', fieldId);
                label.style.cssText = 'font-weight: bold; color: #333; font-size: 14px;';
                label.textContent = `${key}:`;

                // Create input
                const input = document.createElement('input');
                input.type = 'text';
                input.id = fieldId;
                input.value = value;
                input.setAttribute('data-key', key);
                input.style.cssText = `
                    padding: 8px 12px;
                    border: 2px solid #ddd;
                    border-radius: 6px;
                    font-size: 14px;
                    transition: border-color 0.2s;
                `;

                // Add focus/blur events
                input.addEventListener('focus', () => input.style.borderColor = '#4caf50');
                input.addEventListener('blur', () => input.style.borderColor = '#ddd');

                fieldDiv.appendChild(label);
                fieldDiv.appendChild(input);

                // Add delete button for custom fields
                if (isCustom) {
                    const deleteBtn = document.createElement('button');
                    deleteBtn.type = 'button';
                    deleteBtn.textContent = '🗑️';
                    deleteBtn.title = 'Delete this field';
                    deleteBtn.style.cssText = `
                        background: #f44336;
                        color: white;
                        border: none;
                        padding: 8px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        transition: background 0.2s;
                    `;
                    deleteBtn.addEventListener('mouseenter', () => deleteBtn.style.background = '#da190b');
                    deleteBtn.addEventListener('mouseleave', () => deleteBtn.style.background = '#f44336');
                    deleteBtn.addEventListener('click', () => {
                        fieldDiv.remove();
                    });
                    fieldDiv.appendChild(deleteBtn);
                }

                return fieldDiv;
            }

            // Add default fields
            Object.entries(formData).forEach(([key, value]) => {
                // Skip duplicate entries (typo handlers)
                if (key === 'Mali ID' || key === '10t %') return;

                const isCustomField = !defaultFormData.hasOwnProperty(key);
                const fieldRow = createFieldRow(key, value, isCustomField);
                form.appendChild(fieldRow);
            });

            modal.appendChild(form);

            // Create "Add Custom Field" section
            const addFieldSection = document.createElement('div');
            addFieldSection.style.cssText = 'margin-top: 16px; padding-top: 16px; border-top: 2px solid #eee;';

            const addFieldTitle = document.createElement('h3');
            addFieldTitle.style.cssText = 'margin: 0 0 12px 0; color: #333; font-size: 16px; text-align: center;';
            addFieldTitle.textContent = '➕ Add Custom Field';

            const addFieldContainer = document.createElement('div');
            addFieldContainer.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px; align-items: center; margin-bottom: 12px;';

            // Field name input
            const fieldNameInput = document.createElement('input');
            fieldNameInput.type = 'text';
            fieldNameInput.placeholder = 'Field Name (e.g., "Father Name")';
            fieldNameInput.style.cssText = `
                padding: 8px 12px;
                border: 2px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.2s;
            `;
            fieldNameInput.addEventListener('focus', () => fieldNameInput.style.borderColor = '#4caf50');
            fieldNameInput.addEventListener('blur', () => fieldNameInput.style.borderColor = '#ddd');

            // Field value input
            const fieldValueInput = document.createElement('input');
            fieldValueInput.type = 'text';
            fieldValueInput.placeholder = 'Field Value (e.g., "John Doe")';
            fieldValueInput.style.cssText = `
                padding: 8px 12px;
                border: 2px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.2s;
            `;
            fieldValueInput.addEventListener('focus', () => fieldValueInput.style.borderColor = '#4caf50');
            fieldValueInput.addEventListener('blur', () => fieldValueInput.style.borderColor = '#ddd');

            // Add button
            const addButton = document.createElement('button');
            addButton.type = 'button';
            addButton.textContent = '➕';
            addButton.title = 'Add this field';
            addButton.style.cssText = `
                background: #4caf50;
                color: white;
                border: none;
                padding: 10px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                transition: background 0.2s;
            `;
            addButton.addEventListener('mouseenter', () => addButton.style.background = '#45a049');
            addButton.addEventListener('mouseleave', () => addButton.style.background = '#4caf50');

            // Add field functionality
            function addCustomField() {
                const fieldName = fieldNameInput.value.trim();
                const fieldValue = fieldValueInput.value.trim();

                if (!fieldName) {
                    alert('Please enter a field name!');
                    fieldNameInput.focus();
                    return;
                }

                // Check if field already exists
                const existingField = form.querySelector(`[data-field-key="${fieldName}"]`);
                if (existingField) {
                    alert('A field with this name already exists!');
                    fieldNameInput.focus();
                    return;
                }

                // Create and add the new field
                const newFieldRow = createFieldRow(fieldName, fieldValue, true);
                form.appendChild(newFieldRow);

                // Clear inputs
                fieldNameInput.value = '';
                fieldValueInput.value = '';
                fieldNameInput.focus();
            }

            addButton.addEventListener('click', addCustomField);

            // Allow Enter key to add field
            fieldNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    fieldValueInput.focus();
                }
            });

            fieldValueInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomField();
                }
            });

            addFieldContainer.appendChild(fieldNameInput);
            addFieldContainer.appendChild(fieldValueInput);
            addFieldContainer.appendChild(addButton);

            addFieldSection.appendChild(addFieldTitle);
            addFieldSection.appendChild(addFieldContainer);

            // Add tip for custom fields
            const customFieldTip = document.createElement('div');
            customFieldTip.style.cssText = 'text-align: center; font-size: 12px; color: #666; margin-top: 8px;';
            customFieldTip.textContent = '💡 Custom fields are saved permanently in your browser';

            addFieldSection.appendChild(customFieldTip);
            modal.appendChild(addFieldSection);

            // Create button container
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'display: flex; gap: 12px; justify-content: center; margin-top: 24px;';

            // Create save button
            const saveButton = document.createElement('button');
            saveButton.id = 'save-data';
            saveButton.textContent = '💾 Save & Fill Form';
            saveButton.style.cssText = `
                background: #4caf50;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.2s;
            `;
            saveButton.addEventListener('mouseenter', () => saveButton.style.background = '#45a049');
            saveButton.addEventListener('mouseleave', () => saveButton.style.background = '#4caf50');

            // Create cancel button
            const cancelButton = document.createElement('button');
            cancelButton.id = 'cancel-modal';
            cancelButton.textContent = '❌ Cancel';
            cancelButton.style.cssText = `
                background: #f44336;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.2s;
            `;
            cancelButton.addEventListener('mouseenter', () => cancelButton.style.background = '#da190b');
            cancelButton.addEventListener('mouseleave', () => cancelButton.style.background = '#f44336');

            buttonContainer.appendChild(saveButton);
            buttonContainer.appendChild(cancelButton);
            modal.appendChild(buttonContainer);

            // Create tip text
            const tip = document.createElement('div');
            tip.style.cssText = 'text-align: center; margin-top: 16px; font-size: 12px; color: #666;';
            tip.textContent = '💡 Tip: Your data will be saved for this session only';
            modal.appendChild(tip);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // Add event listeners (buttons already have references)
            saveButton.addEventListener('click', () => {
                // Collect all form values
                const inputs = modal.querySelectorAll('input[data-key]');
                const newFormData = {};

                inputs.forEach(input => {
                    const key = input.getAttribute('data-key');
                    const value = input.value.trim();
                    newFormData[key] = value;

                    // Also update typo handlers
                    if (key === 'Mail ID') {
                        newFormData['Mali ID'] = value;
                    }
                    if (key === '10th %') {
                        newFormData['10t %'] = value;
                    }
                });

                // Update global formData
                formData = newFormData;

                // Save to localStorage
                saveFormData(newFormData);

                // Remove modal
                document.body.removeChild(overlay);

                // Show success message
                console.log('✅ Form data updated and saved to localStorage!');

                // Resolve with success
                resolve(true);
            });

            cancelButton.addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(false);
            });

            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                    resolve(false);
                }
            });

            // Focus first input
            setTimeout(() => {
                const firstInput = modal.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 100);
        });
    }

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

                    // Add visual highlighting with a distinctive green style
                    const originalStyle = targetOption.style.cssText;
                    targetOption.style.cssText += `
                        background: linear-gradient(45deg, #4caf50, #8bc34a) !important;
                        border: 3px solid #2e7d32 !important;
                        box-shadow: 0 0 15px #4caf50, inset 0 0 10px rgba(76,175,80,0.3) !important;
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
                        background: #2e7d32;
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
        button.addEventListener('click', async (e) => {
            e.preventDefault();

            // Show customization modal first
            const shouldProceed = await showCustomizationModal();

            if (shouldProceed) {
                // Show instructions after customization
                const instructions = `
🤖 GOOGLE FORM AUTO-FILLER READY!

✅ TEXT FIELDS: Will be filled automatically with your custom data
🎯 DROPDOWNS: Will be highlighted in green - you need to click them manually

The script will now:
1. Fill all text inputs automatically with your customized values
2. Highlight dropdown options with bright green colors and labels
3. You manually click the highlighted dropdown options

Ready to start filling the form?
                `;

                if (confirm(instructions)) {
                    fillForm();
                }
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