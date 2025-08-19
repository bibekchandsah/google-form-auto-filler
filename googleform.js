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

    // Helper function to create field mappings from tag-to-fields format
    function createFieldMappings(tagToFields) {
        const mappings = {};
        Object.entries(tagToFields).forEach(([tag, fields]) => {
            fields.forEach(field => {
                mappings[field] = tag;
            });
        });
        return mappings;
    }

    // Default configuration with tags and field mappings
    let defaultTaggedData = {
        // Tags with their values
        tags: {
            'ROLL_NUMBER': '22054029',
            'FULL_NAME': 'Bibek Chand Sah',
            'STREAM': 'B.Tech',
            'BRANCH': 'CSE',
            'GENDER': 'Male',
            'EMAIL': 'bibeksha48@gmail.com',
            'MOBILE': '8235981727',
            'TENTH_PERCENTAGE': '93.75',
            'TENTH_YOP': '2020',
            'TWELFTH_PERCENTAGE': '91.25',
            'TWELFTH_YOP': '2021',
            'GRADUATION_PERCENTAGE': '83.65',
            'GRADUATION_YOP': '2026',
            'NATIONALITY': 'Nepalese',
            'BACKLOGS': '0'
        },
        // Field mappings to tags - cleaner format with multiple fields per tag
        fieldMappings: createFieldMappings({
            'ROLL_NUMBER': ['Roll No'],
            'FULL_NAME': ['Full Name', 'Name'],
            'STREAM': ['Stream'],
            'BRANCH': ['Branch'],
            'GENDER': ['Gender'],
            'EMAIL': ['Mail ID', 'Mali ID'],
            'MOBILE': ['Mobile No'],
            'TENTH_PERCENTAGE': ['10th %', '10t %'],
            'TENTH_YOP': ['10th YOP'],
            'TWELFTH_PERCENTAGE': ['12th/Diploma %'],
            'TWELFTH_YOP': ['12th/Diploma YOP'],
            'GRADUATION_PERCENTAGE': ['Graduation %'],
            'GRADUATION_YOP': ['YOP'],
            'NATIONALITY': ['Nationality'],
            'BACKLOGS': ['No. of Backlogs']
        })
    };

    // Load tagged data from localStorage or use defaults
    let taggedData = loadTaggedData();

    // Function to load tagged data from localStorage
    function loadTaggedData() {
        try {
            const saved = localStorage.getItem('googleFormFillerTaggedData');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to ensure we have all base data
                return {
                    tags: { ...defaultTaggedData.tags, ...parsed.tags },
                    fieldMappings: { ...defaultTaggedData.fieldMappings, ...parsed.fieldMappings }
                };
            }
        } catch (error) {
            console.log('Error loading saved tagged data:', error);
        }
        return JSON.parse(JSON.stringify(defaultTaggedData)); // Deep copy
    }

    // Function to save tagged data to localStorage
    function saveTaggedData(data) {
        try {
            localStorage.setItem('googleFormFillerTaggedData', JSON.stringify(data));
            console.log('✅ Tagged data saved to localStorage');
        } catch (error) {
            console.error('❌ Error saving tagged data:', error);
        }
    }

    // Function to display current tag mappings in console
    function showCurrentMappings() {
        console.log('\n🏷️ CURRENT TAG MAPPINGS:');
        console.log('========================');

        // Group field mappings by tag
        const tagToFields = {};
        Object.entries(taggedData.fieldMappings).forEach(([fieldName, tagName]) => {
            if (!tagToFields[tagName]) {
                tagToFields[tagName] = [];
            }
            tagToFields[tagName].push(fieldName);
        });

        // Display each tag and its mapped fields
        Object.entries(tagToFields).forEach(([tagName, fields]) => {
            const tagValue = taggedData.tags[tagName] || 'No value set';
            console.log(`\n🏷️ Tag: ${tagName}`);
            console.log(`   Value: "${tagValue}"`);
            console.log(`   Fields: ${fields.join(', ')}`);
        });

        // Show unmapped tags
        const mappedTags = Object.values(taggedData.fieldMappings);
        const unmappedTags = Object.keys(taggedData.tags).filter(tag => !mappedTags.includes(tag));

        if (unmappedTags.length > 0) {
            console.log('\n⚠️ UNMAPPED TAGS (have values but no field mappings):');
            unmappedTags.forEach(tag => {
                console.log(`   🏷️ ${tag}: "${taggedData.tags[tag]}"`);
            });
        }

        console.log('\n💡 Use showCurrentMappings() to view this again');
        console.log('💡 Use the customize button to modify mappings');
    }

    // Make function available globally for console access
    window.showCurrentMappings = showCurrentMappings;

    // Function to get value for a field using tag system
    function getValueForField(titleText) {
        // Clean the title text (remove asterisks, trim whitespace)
        const cleanTitle = titleText.replace(/\s*\*\s*$/, '').trim();

        // Check if we have a direct field mapping
        const tagName = taggedData.fieldMappings[cleanTitle];
        if (tagName && taggedData.tags[tagName]) {
            return taggedData.tags[tagName];
        }

        // Check for case-insensitive field mapping
        for (const [fieldName, tag] of Object.entries(taggedData.fieldMappings)) {
            if (fieldName.toLowerCase() === cleanTitle.toLowerCase()) {
                return taggedData.tags[tag] || null;
            }
        }

        return null;
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

            // Add tag fields (show tags, not individual field mappings)
            Object.entries(taggedData.tags).forEach(([tagName, value]) => {
                const isCustomField = !defaultTaggedData.tags.hasOwnProperty(tagName);
                const fieldRow = createFieldRow(tagName, value, isCustomField);
                form.appendChild(fieldRow);
            });

            modal.appendChild(form);

            // Create "Add Custom Tag" section
            const addFieldSection = document.createElement('div');
            addFieldSection.style.cssText = 'margin-top: 16px; padding-top: 16px; border-top: 2px solid #eee;';

            const addFieldTitle = document.createElement('h3');
            addFieldTitle.style.cssText = 'margin: 0 0 12px 0; color: #333; font-size: 16px; text-align: center;';
            addFieldTitle.textContent = '🏷️ Add Custom Tag';

            // Create two sections: Add New Tag and Map Field to Existing Tag

            // Section 1: Add New Tag
            const newTagSection = document.createElement('div');
            newTagSection.style.cssText = 'margin-bottom: 16px; padding: 12px; background: #f8f9fa; border-radius: 8px;';

            const newTagLabel = document.createElement('h4');
            newTagLabel.style.cssText = 'margin: 0 0 8px 0; color: #333; font-size: 14px;';
            newTagLabel.textContent = '➕ Create New Tag';

            const newTagContainer = document.createElement('div');
            newTagContainer.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px; align-items: center;';

            // Tag name input
            const tagNameInput = document.createElement('input');
            tagNameInput.type = 'text';
            tagNameInput.placeholder = 'Tag Name (e.g., "FATHER_NAME")';
            tagNameInput.style.cssText = `
                padding: 8px 12px;
                border: 2px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.2s;
                text-transform: uppercase;
            `;
            tagNameInput.addEventListener('focus', () => tagNameInput.style.borderColor = '#4caf50');
            tagNameInput.addEventListener('blur', () => tagNameInput.style.borderColor = '#ddd');
            tagNameInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
            });

            // Tag value input
            const tagValueInput = document.createElement('input');
            tagValueInput.type = 'text';
            tagValueInput.placeholder = 'Tag Value (e.g., "John Doe")';
            tagValueInput.style.cssText = `
                padding: 8px 12px;
                border: 2px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.2s;
            `;
            tagValueInput.addEventListener('focus', () => tagValueInput.style.borderColor = '#4caf50');
            tagValueInput.addEventListener('blur', () => tagValueInput.style.borderColor = '#ddd');

            // Add new tag button
            const addNewTagButton = document.createElement('button');
            addNewTagButton.type = 'button';
            addNewTagButton.textContent = '➕';
            addNewTagButton.title = 'Add new tag';
            addNewTagButton.style.cssText = `
                background: #4caf50;
                color: white;
                border: none;
                padding: 10px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                transition: background 0.2s;
            `;
            addNewTagButton.addEventListener('mouseenter', () => addNewTagButton.style.background = '#45a049');
            addNewTagButton.addEventListener('mouseleave', () => addNewTagButton.style.background = '#4caf50');

            newTagContainer.appendChild(tagNameInput);
            newTagContainer.appendChild(tagValueInput);
            newTagContainer.appendChild(addNewTagButton);
            newTagSection.appendChild(newTagLabel);
            newTagSection.appendChild(newTagContainer);

            // Section 2: Map Field to Existing Tag
            const mapFieldSection = document.createElement('div');
            mapFieldSection.style.cssText = 'padding: 12px; background: #e8f5e8; border-radius: 8px;';

            const mapFieldLabel = document.createElement('h4');
            mapFieldLabel.style.cssText = 'margin: 0 0 8px 0; color: #333; font-size: 14px;';
            mapFieldLabel.textContent = '🔗 Map Field to Existing Tag';

            const mapFieldContainer = document.createElement('div');
            mapFieldContainer.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px; align-items: center;';

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

            // Tag selector dropdown
            const tagSelector = document.createElement('select');
            tagSelector.style.cssText = `
                padding: 8px 12px;
                border: 2px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.2s;
                background: white;
            `;
            tagSelector.addEventListener('focus', () => tagSelector.style.borderColor = '#4caf50');
            tagSelector.addEventListener('blur', () => tagSelector.style.borderColor = '#ddd');

            // Populate tag selector
            function updateTagSelector() {
                // Clear existing options using DOM methods (safer than innerHTML)
                while (tagSelector.firstChild) {
                    tagSelector.removeChild(tagSelector.firstChild);
                }

                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Select existing tag...';
                tagSelector.appendChild(defaultOption);

                Object.keys(taggedData.tags).forEach(tagName => {
                    const option = document.createElement('option');
                    option.value = tagName;
                    option.textContent = `${tagName} (${taggedData.tags[tagName]})`;
                    tagSelector.appendChild(option);
                });
            }
            updateTagSelector();

            // Add field mapping button
            const addMappingButton = document.createElement('button');
            addMappingButton.type = 'button';
            addMappingButton.textContent = '🔗';
            addMappingButton.title = 'Map field to tag';
            addMappingButton.style.cssText = `
                background: #2196f3;
                color: white;
                border: none;
                padding: 10px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                transition: background 0.2s;
            `;
            addMappingButton.addEventListener('mouseenter', () => addMappingButton.style.background = '#1976d2');
            addMappingButton.addEventListener('mouseleave', () => addMappingButton.style.background = '#2196f3');

            mapFieldContainer.appendChild(fieldNameInput);
            mapFieldContainer.appendChild(tagSelector);
            mapFieldContainer.appendChild(addMappingButton);
            mapFieldSection.appendChild(mapFieldLabel);
            mapFieldSection.appendChild(mapFieldContainer);

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

            // Add new tag functionality
            function addNewTag() {
                const tagName = tagNameInput.value.trim();
                const tagValue = tagValueInput.value.trim();

                if (!tagName) {
                    alert('Please enter a tag name!');
                    tagNameInput.focus();
                    return;
                }

                if (!tagValue) {
                    alert('Please enter a tag value!');
                    tagValueInput.focus();
                    return;
                }

                // Check if tag already exists
                if (taggedData.tags[tagName]) {
                    alert('A tag with this name already exists! Use the mapping section below to assign fields to it.');
                    tagNameInput.focus();
                    return;
                }

                // Add the new tag
                taggedData.tags[tagName] = tagValue;

                // Create and add the new tag field to the form
                const newFieldRow = createFieldRow(tagName, tagValue, true);
                form.appendChild(newFieldRow);

                // Update the tag selector dropdown
                updateTagSelector();

                // Clear inputs
                tagNameInput.value = '';
                tagValueInput.value = '';
                tagNameInput.focus();

                console.log(`✅ Added new tag: ${tagName} = ${tagValue}`);
            }

            // Add field mapping functionality
            function addFieldMapping() {
                const fieldName = fieldNameInput.value.trim();
                const selectedTag = tagSelector.value;

                if (!fieldName) {
                    alert('Please enter a field name!');
                    fieldNameInput.focus();
                    return;
                }

                if (!selectedTag) {
                    alert('Please select a tag to map to!');
                    tagSelector.focus();
                    return;
                }

                // Add the field mapping
                taggedData.fieldMappings[fieldName] = selectedTag;

                // Update the mappings display
                updateMappingsDisplay();

                // Clear inputs
                fieldNameInput.value = '';
                tagSelector.value = '';
                fieldNameInput.focus();

                // Show success message
                const tagValue = taggedData.tags[selectedTag];
                alert(`✅ Mapped "${fieldName}" to tag "${selectedTag}" (${tagValue})`);
                console.log(`✅ Mapped field "${fieldName}" to tag "${selectedTag}"`);
            }

            addNewTagButton.addEventListener('click', addNewTag);
            addMappingButton.addEventListener('click', addFieldMapping);

            // Allow Enter key navigation
            tagNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    tagValueInput.focus();
                }
            });

            tagValueInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addNewTag();
                }
            });

            fieldNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    tagSelector.focus();
                }
            });

            tagSelector.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addFieldMapping();
                }
            });

            // Section 3: View Current Mappings
            const viewMappingsSection = document.createElement('div');
            viewMappingsSection.style.cssText = 'margin-top: 16px; padding: 12px; background: #fff3e0; border-radius: 8px; border: 1px solid #ffcc02;';

            const viewMappingsLabel = document.createElement('h4');
            viewMappingsLabel.style.cssText = 'margin: 0 0 8px 0; color: #333; font-size: 14px;';
            viewMappingsLabel.textContent = '📋 Current Field Mappings';

            const mappingsContainer = document.createElement('div');
            mappingsContainer.style.cssText = 'max-height: 200px; overflow-y: auto; font-size: 12px;';

            // Function to update mappings display
            function updateMappingsDisplay() {
                // Clear existing content
                while (mappingsContainer.firstChild) {
                    mappingsContainer.removeChild(mappingsContainer.firstChild);
                }

                // Group field mappings by tag
                const tagToFields = {};
                Object.entries(taggedData.fieldMappings).forEach(([fieldName, tagName]) => {
                    if (!tagToFields[tagName]) {
                        tagToFields[tagName] = [];
                    }
                    tagToFields[tagName].push(fieldName);
                });

                // Display each tag and its mapped fields
                Object.entries(tagToFields).forEach(([tagName, fields]) => {
                    const tagValue = taggedData.tags[tagName] || 'No value set';

                    const mappingRow = document.createElement('div');
                    mappingRow.style.cssText = 'margin-bottom: 8px; padding: 8px; background: white; border-radius: 4px; border-left: 4px solid #4caf50;';

                    const tagInfo = document.createElement('div');
                    tagInfo.style.cssText = 'font-weight: bold; color: #2e7d32; margin-bottom: 4px;';
                    tagInfo.textContent = `🏷️ ${tagName}: "${tagValue}"`;

                    const fieldsInfo = document.createElement('div');
                    fieldsInfo.style.cssText = 'color: #666; font-size: 11px; margin-left: 16px;';
                    fieldsInfo.textContent = `📝 Fields: ${fields.join(', ')}`;

                    mappingRow.appendChild(tagInfo);
                    mappingRow.appendChild(fieldsInfo);
                    mappingsContainer.appendChild(mappingRow);
                });

                // Show message if no mappings exist
                if (Object.keys(tagToFields).length === 0) {
                    const noMappings = document.createElement('div');
                    noMappings.style.cssText = 'text-align: center; color: #999; font-style: italic; padding: 16px;';
                    noMappings.textContent = 'No field mappings configured yet';
                    mappingsContainer.appendChild(noMappings);
                }
            }

            // Initial display
            updateMappingsDisplay();

            viewMappingsSection.appendChild(viewMappingsLabel);
            viewMappingsSection.appendChild(mappingsContainer);

            addFieldSection.appendChild(addFieldTitle);
            addFieldSection.appendChild(newTagSection);
            addFieldSection.appendChild(mapFieldSection);
            addFieldSection.appendChild(viewMappingsSection);

            // Add comprehensive tip
            const customFieldTip = document.createElement('div');
            customFieldTip.style.cssText = 'text-align: center; font-size: 12px; color: #666; margin-top: 12px; line-height: 1.4;';
            customFieldTip.textContent = '💡 Tags are reusable values. Multiple field names can use the same tag. All data is saved permanently in your browser.';

            addFieldSection.appendChild(customFieldTip);
            modal.appendChild(addFieldSection);

            // Create button container
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'display: flex; gap: 12px; justify-content: center; margin-top: 24px; flex-wrap: wrap;';

            // Create save only button
            const saveOnlyButton = document.createElement('button');
            saveOnlyButton.id = 'save-only';
            saveOnlyButton.textContent = '💾 Save';
            saveOnlyButton.style.cssText = `
                background: #2196f3;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.2s;
            `;
            saveOnlyButton.addEventListener('mouseenter', () => saveOnlyButton.style.background = '#1976d2');
            saveOnlyButton.addEventListener('mouseleave', () => saveOnlyButton.style.background = '#2196f3');

            // Create save and fill button
            const saveAndFillButton = document.createElement('button');
            saveAndFillButton.id = 'save-and-fill';
            saveAndFillButton.textContent = '🚀 Fill Form';
            saveAndFillButton.style.cssText = `
                background: #4caf50;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.2s;
            `;
            saveAndFillButton.addEventListener('mouseenter', () => saveAndFillButton.style.background = '#45a049');
            saveAndFillButton.addEventListener('mouseleave', () => saveAndFillButton.style.background = '#4caf50');

            // Create cancel button
            const cancelButton = document.createElement('button');
            cancelButton.id = 'cancel-modal';
            cancelButton.textContent = '❌ Cancel';
            cancelButton.style.cssText = `
                background: #f44336;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.2s;
            `;
            cancelButton.addEventListener('mouseenter', () => cancelButton.style.background = '#da190b');
            cancelButton.addEventListener('mouseleave', () => cancelButton.style.background = '#f44336');

            buttonContainer.appendChild(saveOnlyButton);
            buttonContainer.appendChild(saveAndFillButton);
            buttonContainer.appendChild(cancelButton);
            modal.appendChild(buttonContainer);

            // Create tip text
            const tip = document.createElement('div');
            tip.style.cssText = 'text-align: center; margin-top: 16px; font-size: 12px; color: #666; line-height: 1.4;';
            tip.textContent = '💡 Save: Store your data for later use | Fill Form: Save data and immediately fill the current form';
            modal.appendChild(tip);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // Function to collect and save data
            function collectAndSaveData() {
                // Collect all tag values
                const inputs = modal.querySelectorAll('input[data-key]');
                const newTags = {};

                inputs.forEach(input => {
                    const tagName = input.getAttribute('data-key');
                    const value = input.value.trim();
                    newTags[tagName] = value;
                });

                // Update global tagged data
                taggedData.tags = { ...taggedData.tags, ...newTags };

                // Save to localStorage
                saveTaggedData(taggedData);

                console.log('✅ Tagged data updated and saved to localStorage!');
            }

            // Add event listeners for save only button
            saveOnlyButton.addEventListener('click', () => {
                collectAndSaveData();
                
                // Remove modal
                document.body.removeChild(overlay);

                // Show success message
                alert('💾 Data saved successfully! You can now fill forms with your saved data.');

                // Resolve with false (don't fill form)
                resolve(false);
            });

            // Add event listeners for save and fill button
            saveAndFillButton.addEventListener('click', () => {
                collectAndSaveData();
                
                // Remove modal
                document.body.removeChild(overlay);

                // Resolve with true (proceed to fill form)
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

    // Function to add floating icon with menu
    function addFillButton() {
        // Check if icon already exists
        if (document.getElementById('form-filler-icon')) return;

        // Create floating icon container
        const iconContainer = document.createElement('div');
        iconContainer.id = 'form-filler-icon';
        iconContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        // Create the icon image
        const icon = document.createElement('img');
        icon.src = 'https://img.icons8.com/?size=256&id=q3wGnFmrhHJI&format=png';
        icon.alt = 'Form Filler';
        icon.style.cssText = `
            width: 50px;
            height: 50px;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            background: white;
            padding: 8px;
        `;

        // Add hover effect to icon
        iconContainer.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.1)';
            icon.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
        });

        iconContainer.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1)';
            icon.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        });

        iconContainer.appendChild(icon);

        // Create menu container
        const menu = document.createElement('div');
        menu.id = 'form-filler-menu';
        menu.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            z-index: 9999;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            padding: 8px;
            display: none;
            min-width: 200px;
            font-family: Arial, sans-serif;
        `;

        // Create menu items
        const menuItems = [
            {
                text: '⚙️ Customize Data',
                id: 'customize-data-option',
                action: async () => {
                    hideMenu();
                    // Show customization modal and handle the result
                    const shouldFillForm = await showCustomizationModal();
                    
                    if (shouldFillForm) {
                        // User clicked "Fill Form" - show instructions and fill
                        const instructions = `
🤖 GOOGLE FORM AUTO-FILLER READY!

✅ TEXT FIELDS: Will be filled automatically with your saved data
🎯 DROPDOWNS: Will be highlighted in green - you need to click them manually

The script will now:
1. Fill all text inputs automatically with your saved values
2. Highlight dropdown options with bright green colors and labels
3. You manually click the highlighted dropdown options

Ready to start filling the form?
                        `;

                        if (confirm(instructions)) {
                            fillForm();
                        }
                    }
                }
            },
            {
                text: '🚀 Fill Form (Saved Data)',
                id: 'fill-form-option',
                action: () => {
                    hideMenu();
                    // Fill form with current saved data
                    const instructions = `
🤖 GOOGLE FORM AUTO-FILLER READY!

✅ TEXT FIELDS: Will be filled automatically with your saved data
🎯 DROPDOWNS: Will be highlighted in green - you need to click them manually

The script will now:
1. Fill all text inputs automatically with your saved values
2. Highlight dropdown options with bright green colors and labels
3. You manually click the highlighted dropdown options

Ready to start filling the form?
                    `;

                    if (confirm(instructions)) {
                        fillForm();
                    }
                }
            },
            {
                text: '📋 View Mappings',
                id: 'view-mappings-option',
                action: () => {
                    hideMenu();
                    showCurrentMappings();
                    alert('📋 Current mappings displayed in console! Press F12 to view.');
                }
            }
        ];

        // Create menu items
        menuItems.forEach((item, index) => {
            const menuItem = document.createElement('div');
            menuItem.id = item.id;
            menuItem.textContent = item.text;
            menuItem.style.cssText = `
                padding: 12px 16px;
                cursor: pointer;
                border-radius: 8px;
                transition: background 0.2s ease;
                font-size: 14px;
                font-weight: 500;
                color: #333;
                ${index > 0 ? 'border-top: 1px solid #eee;' : ''}
            `;

            // Add hover effect
            menuItem.addEventListener('mouseenter', () => {
                menuItem.style.background = '#f5f5f5';
            });

            menuItem.addEventListener('mouseleave', () => {
                menuItem.style.background = 'transparent';
            });

            // Add click handler
            menuItem.addEventListener('click', item.action);

            menu.appendChild(menuItem);
        });

        // Function to show menu
        function showMenu() {
            menu.style.display = 'block';
            menu.style.opacity = '0';
            menu.style.transform = 'translateY(10px)';

            // Animate in
            setTimeout(() => {
                menu.style.transition = 'all 0.3s ease';
                menu.style.opacity = '1';
                menu.style.transform = 'translateY(0)';
            }, 10);
        }

        // Function to hide menu
        function hideMenu() {
            menu.style.transition = 'all 0.3s ease';
            menu.style.opacity = '0';
            menu.style.transform = 'translateY(10px)';

            setTimeout(() => {
                menu.style.display = 'none';
            }, 300);
        }

        // Toggle menu on icon click
        let menuVisible = false;
        iconContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            if (menuVisible) {
                hideMenu();
                menuVisible = false;
            } else {
                showMenu();
                menuVisible = true;
            }
        });

        // Hide menu when clicking outside
        document.addEventListener('click', (e) => {
            if (menuVisible && !menu.contains(e.target) && !iconContainer.contains(e.target)) {
                hideMenu();
                menuVisible = false;
            }
        });

        // Add elements to page
        document.body.appendChild(iconContainer);
        document.body.appendChild(menu);
    }

    // Wait for the page to load completely
    function init() {
        // Add the fill button
        addFillButton();

        // Optional: Auto-fill on page load (uncomment if desired)
        // setTimeout(fillForm, 2000);

        console.log('🚀 Google Form Auto Filler loaded! Click the button to auto-fill text fields and highlight dropdown options.');
        console.log('📋 Type showCurrentMappings() in console to view your current tag mappings.');

        // Show a quick summary of available tags
        const tagCount = Object.keys(taggedData.tags).length;
        const mappingCount = Object.keys(taggedData.fieldMappings).length;
        console.log(`🏷️ You have ${tagCount} tags and ${mappingCount} field mappings configured.`);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();