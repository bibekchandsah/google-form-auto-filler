# 🚀 Google Form Auto Filler

A powerful Tampermonkey userscript that automatically fills Google Forms with your predefined data, featuring intelligent field detection, comprehensive validation, and a beautiful user interface.

## ✨ Features

### 🎯 **Smart Form Filling**
- **Multiple Field Types**: Text inputs, dropdowns, date pickers, radio buttons, checkboxes, and textareas
- **Intelligent Detection**: Automatically detects field types and applies appropriate filling methods
- **Progress Tracking**: Real-time progress indicators with field-by-field animations
- **Success Animations**: Beautiful visual feedback for completed operations

### 🏷️ **Advanced Tag System**
- **Reusable Tags**: Create tags that can be mapped to multiple field names
- **Smart Mapping**: Multiple field names can use the same tag value
- **Auto-Mapping**: Automatically creates field mappings when adding custom tags
- **Custom Fields**: Add unlimited custom tags and field mappings
- **Complete Deletion**: Proper cleanup of tags and associated mappings
- **Persistent Storage**: All data saved permanently in browser localStorage

### ✅ **Comprehensive Validation**
- **Field-Specific Validation**: Email, phone, percentage, year, name, and number validation
- **Auto-Fix Common Issues**: Automatically corrects formatting problems
- **Smart Suggestions**: Detailed guidance for manual fixes
- **Visual Feedback**: Clean icons and tooltips for validation status

### 🎨 **Beautiful User Interface**
- **Floating Icon**: Unobtrusive bottom-right corner interface
- **Clean Modal**: Professional customization interface
- **Hover Effects**: Smooth animations and visual feedback
- **Progress Indicators**: Real-time filling progress with statistics

### ⌨️ **Keyboard Shortcuts**
- **Alt + F**: Quick fill form with saved data
- **Alt + C**: Toggle customize data modal (open/close)
- **Alt + M**: View current tag mappings in console

### 💾 **Data Management**
- **Backup & Import**: Export/import data in JSON or CSV formats
- **Cross-Device Sync**: Transfer data between browsers and devices
- **Version Control**: Structured data format with metadata
- **Data Validation**: Ensures data integrity during import/export

### 🔧 **Error Handling**
- **Smart Recovery**: Multiple recovery options for validation failures
- **Auto-Fix**: Automatically corrects common data formatting issues
- **Detailed Suggestions**: Step-by-step guidance for manual fixes
- **Intelligent Patterns**: Recognizes and fixes common formatting mistakes
- **Graceful Degradation**: Continues operation even with partial failures

## 🚀 Installation

### Prerequisites
- **Tampermonkey Extension**: Install from [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) or [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

### Easy Installation (Recommended)
1. **Install Tampermonkey** in your browser
2. **Click this link**: [Install from Greasyfork](https://greasyfork.org/en/scripts/546495-google-form-auto-filler-with-custom-details)
3. **Click "Install this script"** on the Greasyfork page
4. **Visit any Google Form** to see the floating icon

### Manual Installation
1. **Install Tampermonkey** in your browser
2. **Copy the script** from `googleform.js`
3. **Open Tampermonkey Dashboard** (click extension icon → Dashboard)
4. **Create New Script** (click the + icon)
5. **Paste the script** and save (Ctrl+S)
6. **Visit any Google Form** to see the floating icon

## 🎯 Usage

### Quick Start
1. **Visit a Google Form** - The floating icon appears in bottom-right corner
2. **Click the icon** to open the menu
3. **Choose "Customize Data"** to set up your information
4. **Fill in your details** and click "Save" or "Fill Form"
5. **Use "Fill Form (Saved Data)"** for instant form filling

### Menu Options
- **⚙️ Customize Data**: Edit your form data and field mappings
- **🚀 Fill Form (Saved Data)**: Instantly fill form with saved data
- **📋 View Mappings**: Display current tag mappings in console
- **🎹 Shortcuts**: Show keyboard shortcut information
- **💾 Backup & Import**: Export/import your data

### Keyboard Shortcuts
- **Alt + F**: Quick fill form (no modal)
- **Alt + C**: Toggle customize modal
- **Alt + M**: View mappings in console

## 📊 Supported Field Types

### ✅ **Fully Automated**
- **Text Inputs**: Name, email, phone, roll number, etc.
- **Date Pickers**: Birth date, graduation date, etc.
- **Textareas**: Long text responses, essays
- **Numbers**: Percentages, years, counts

### 🎯 **Semi-Automated (Highlighted for Manual Click)**
- **Dropdowns**: Options highlighted in green for manual selection
- **Radio Buttons**: Automatically selected with visual confirmation
- **Checkboxes**: Multiple selections supported (comma-separated values)

## 🏷️ Tag System

### 🤖 Auto-Mapping Intelligence
When you create a custom tag, the system automatically generates field mappings for common variations:

**Example: Creating tag `PREFERRED_COURSE` → `"CSE"`**
- Automatically maps to: "Preferred Course", "Course", "Course Name", "Course Selection"
- Recognizes patterns: COURSE, FATHER, MOTHER, ADDRESS, CITY, SKILLS, etc.
- Creates 5-15 mappings per tag for maximum compatibility
- Works immediately without manual field mapping

**Pattern Recognition Examples:**
```javascript
FATHER_NAME → "Father Name", "Father's Name", "Father"
HOME_ADDRESS → "Address", "Home Address", "Permanent Address"
TECHNICAL_SKILLS → "Skills", "Technical Skills", "Key Skills"
COLLEGE_NAME → "College", "College Name", "Institution"
```

### Default Tags
```javascript
// Personal Information
'ROLL_NUMBER': '22054'
'FULL_NAME': 'your_name_here'
'EMAIL': '@gmail.com'
'MOBILE': 'your_number_here'
'GENDER': 'Male'
'NATIONALITY': 'Nepalese'

// Academic Information
'STREAM': 'B.Tech'
'BRANCH': 'CSE'
'TENTH_PERCENTAGE': '93.75'
'TENTH_YOP': '2020'
'TWELFTH_PERCENTAGE': '93.25'
'TWELFTH_YOP': '2021'
'GRADUATION_PERCENTAGE': '33.65'
'GRADUATION_YOP': '2026'
'BACKLOGS': '0'

// Date Information
'DATE_OF_BIRTH': '2002-12-28'
'GRADUATION_DATE': '2026-05-15'
```

### Field Mappings
```javascript
// Multiple field names can use the same tag
'FULL_NAME': ['Full Name', 'Name', 'Student Name']
'EMAIL': ['Mail ID', 'Email Address', 'E-mail']
'MOBILE': ['Mobile No', 'Phone Number', 'Contact']
```

## ✅ Validation System

### Supported Validations
- **Email**: Validates proper email format (user@domain.com)
- **Phone**: 10+ digits with optional formatting
- **Percentage**: 0-100 with up to 2 decimal places
- **Year**: 1900 to current year + 10
- **Name**: 2-50 characters, letters and spaces only
- **Number**: Digits only for counts, backlogs, etc.
- **Date**: Multiple date formats with range validation

### Auto-Fix Examples
```javascript
// Email fixes
"john" → "john@gmail.com"
"user@domain" → "user@domain.com"
"test @ gmail.com" → "test@gmail.com"

// Phone fixes
"(123) 456-7890" → "1234567890"
"+1 987 654 3210" → "9876543210"

// Name fixes
"john doe123" → "John Doe"
"MARY   SMITH" → "Mary Smith"

// Percentage fixes
"85%" → "85"
"90.5%" → "90.5"

// Year extraction
"Born in 1995" → "1995"
"Year: 2020" → "2020"
```

## 💾 Data Management

### Export Formats

#### JSON Format
```json
{
  "version": "1.0",
  "exportDate": "2025-01-19T...",
  "tags": {
    "FULL_NAME": "John Doe",
    "EMAIL": "john@example.com"
  },
  "fieldMappings": {
    "Full Name": "FULL_NAME",
    "Email": "EMAIL"
  },
  "metadata": {
    "totalTags": 15,
    "totalMappings": 25
  }
}
```

#### CSV Format
```csv
Type,Key,Value,Description
Tag,FULL_NAME,"John Doe",Tag value
Tag,EMAIL,"john@example.com",Tag value
Mapping,"Full Name",FULL_NAME,Field to tag mapping
Mapping,"Email",EMAIL,Field to tag mapping
```

## 🎨 User Interface

### Floating Icon
- **Position**: Bottom-right corner (20px from edges)
- **Size**: 50px with custom icon
- **Hover Effects**: Smooth scaling and shadow effects
- **Menu**: Clean dropdown with all options

### Customization Modal
- **Clean Design**: Professional white modal with rounded corners
- **Real-time Validation**: Instant feedback with icons and tooltips
- **Progress Tracking**: Live validation summary
- **Responsive**: Works on all screen sizes

### Progress Indicators
- **Real-time Progress Bar**: Shows completion percentage
- **Field Counter**: "X / Y fields processed"
- **Status Updates**: Current field being processed
- **Success Animation**: Celebration effects when complete

## 🔧 Advanced Features

### Error Recovery
1. **🔧 Auto-Fix Common Issues**: Automatically corrects formatting
2. **💡 Show Fix Suggestions**: Detailed guidance for manual fixes
3. **✏️ Fix Errors Manually**: Traditional correction approach
4. **⚠️ Save Anyway**: Override validation with warning
5. **🔄 Reset to Defaults**: Start fresh with default values

### Smart Date Handling
- **Multiple Formats**: YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY
- **Year Conversion**: "2020" → "2020-01-01" for date pickers
- **Smart Defaults**: Reasonable default dates for common fields
- **Validation**: Ensures dates are valid and within reasonable ranges

### Field Detection
- **Automatic**: Detects field types by HTML structure and attributes
- **Keyword-based**: Recognizes fields by name patterns
- **Fallback**: Graceful handling of unknown field types

## 🛠️ Customization

### Adding Custom Tags
1. Click floating icon → "Customize Data"
2. Use "Create New Tag" section
3. Enter tag name (e.g., "FATHER_NAME") and value
4. Click ➕ to add
5. **Auto-Mapping**: System automatically creates field mappings for common variations

### Mapping Fields to Tags
1. Use "Map Field to Existing Tag" section
2. Enter exact field name as it appears in the form
3. Select existing tag from dropdown
4. Click 🔗 to map

### Deleting Custom Tags
1. Click the 🗑️ button next to any custom tag
2. Confirm deletion in the dialog
3. **Complete Cleanup**: Automatically removes tag data, field mappings, and updates localStorage
4. **Immediate Effect**: Changes persist without page reload

### Keyboard Shortcuts
All shortcuts work anywhere on Google Forms pages and override browser defaults for better functionality.

## 🔍 Troubleshooting

### Common Issues

#### Script Not Loading
- Ensure Tampermonkey is installed and enabled
- Check that the script matches `https://docs.google.com/forms/*`
- Refresh the Google Form page

#### Fields Not Filling
- Check field mappings in "View Mappings"
- Verify field names match exactly (case-sensitive)
- **Auto-Mapping**: Custom tags automatically create field mappings
- Use browser console (F12) to see detailed logs

#### Validation Errors
- Use "Auto-Fix Common Issues" for automatic corrections
- Check "Show Fix Suggestions" for detailed guidance
- Ensure data formats match validation requirements

#### Dropdown Issues
- Dropdowns are highlighted for manual clicking (by design)
- Look for green highlighted options with labels
- Click the highlighted option manually

#### Custom Tag Issues
- **Auto-Mapping**: New tags automatically create field mappings
- **Deletion**: Use 🗑️ button for complete cleanup including localStorage
- **Persistence**: Changes save immediately without page reload
- **Pattern Recognition**: System creates 5-15 mappings per tag automatically

### Debug Information
- Press **F12** to open browser console
- Type `showCurrentMappings()` to see all mappings
- Check console logs for detailed operation information
- Use "View Mappings" menu option for quick overview

## 🤝 Contributing

### Reporting Issues
- Provide the Google Form URL (if public)
- Include browser console errors (F12 → Console)
- Describe expected vs actual behavior
- Include your browser and Tampermonkey version

### Feature Requests
- Describe the use case and benefit
- Provide examples of the desired functionality
- Consider backward compatibility

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Google Forms**: For providing the platform
- **Tampermonkey**: For the userscript environment
- **Icons8**: For the floating icon design
- **Community**: For feedback and feature suggestions

## 📞 Support

- **Console Debugging**: Use `showCurrentMappings()` for quick diagnostics
- **Built-in Help**: Use "🎹 Shortcuts" menu option for quick reference
- **Validation Help**: Use "💡 Show Fix Suggestions" for field-specific guidance

---

## 🔗 Links

- **Install Script**: [Greasyfork - Google Form Auto Filler](https://greasyfork.org/en/scripts/546495-google-form-auto-filler-with-custom-details)
- **Tampermonkey**: [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

## 📈 Recent Updates

### v2.0 - Enhanced Intelligence
- **🤖 Auto-Mapping**: Automatic field mapping for custom tags
- **🗑️ Complete Deletion**: Proper cleanup of tags and localStorage
- **🔧 Enhanced Auto-Fix**: Improved validation error recovery
- **📅 Date Picker Support**: Smart date field handling
- **🔘 Radio/Checkbox Support**: Multiple choice field automation
- **📝 Textarea Support**: Long text field handling

---

**Made with ❤️ for efficient form filling**

*Last updated: January 2025 - v2.0*