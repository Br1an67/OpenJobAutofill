# OpenJobAutofill

[中文 README](README.md)

<p align="center">
  <img src="assets/openjobautofill-logo.png" alt="OpenJobAutofill" width="720" />
</p>

OpenJobAutofill is an AI-assisted browser extension for job application forms. You keep one resume profile locally, open a recruiting website, click `Start Filling`, and the extension scans the current page, uses local rules plus optional AI to understand field meanings, and writes high-confidence values into the form.

It is not designed to be a fully automated job-submission bot. Its goal is to use AI where it helps most: understanding messy field names and page structures across different recruiting websites, while keeping your actual resume values on your device. Personal information, education, internships, projects, certificates, awards, and other common resume fields can be filled first, then reviewed and submitted by you.

If this project saves you time, a GitHub Star would be appreciated. Issues and feedback also help improve compatibility with more recruiting sites.

## Highlights

- One-click scanning and high-confidence autofill for the current job application page.
- Resume data stays on your device and does not need to be uploaded to a cloud service.
- Supports common inputs, textareas, radio buttons, checkboxes, dropdowns, and date-like fields.
- A right-side profile panel lets you browse, search, and manually copy saved profile data.
- Optional OpenAI-compatible API or custom API support for better page-field understanding.
- AI only receives page-field structure and your local profile field catalog, not your actual resume values.
- Filled fields are marked with colors so you can quickly review the result.

## Installation

The current version is intended to be installed in Brave or Chrome through developer mode.

1. Download or clone this repository to your computer.
2. Open `brave://extensions/` or `chrome://extensions/`.
3. Turn on `Developer mode`.
4. Click `Load unpacked`.
5. Select the `OpenJobAutofill` project folder.
6. Pin the extension icon for easier access on job application pages.

No dependency installation or build step is required. Load the project folder directly.

## First Use

1. Click the OpenJobAutofill icon in the browser toolbar.
2. Click `Settings`.
3. Fill in your resume profile by section.
4. Click `Save Profile`; the data is saved to local browser extension storage.
5. Open a resume or application form page on a recruiting website.
6. Click the extension icon, then click `Start Filling`.
7. Wait for scanning and filling to complete, then review the colored marks on the page.
8. For fields that were not filled correctly, open the right-side profile panel, search the value, and copy it manually.
9. Review the final form yourself and submit it manually.

The repository includes `sample-profile.json` if you want to test the extension before entering your own data.

## AI Settings

AI is optional. If no API is configured, OpenJobAutofill still uses local rules to match and fill fields.

If you want better understanding of different recruiting websites, configure your own API in the settings page. OpenAI-compatible endpoints and custom Base URL, Endpoint Path, and model names are supported. The settings page also provides `Test Connection` and `Refresh Model List`; model names can still be entered manually.

The privacy boundary is explicit: AI requests contain the current page-field structure and your local profile field catalog only. They do not include your name, phone number, ID number, resume content, or other actual profile values. Value resolution and writing happen locally in the browser.

## Color Marks

- Green: successfully filled.
- Yellow: uncertain match; review manually.
- Red: failed to write or unsupported control.

If the page refreshes, moves to another step, or dynamically loads new fields, click `Start Filling` again.

## Privacy

- Resume data is stored locally in `chrome.storage.local`.
- API keys are stored only in local extension storage.
- Page scripts are injected only after you click the extension and interact with the current page.
- The extension never clicks the final submit button automatically.
- The extension never sends your actual resume values to AI.
- Always review the page after autofill, especially IDs, contact information, dates, choice fields, and declaration fields.

## FAQ

### Nothing happens after clicking Start Filling

Refresh the target page and open the extension popup again. If it still does not respond, reload OpenJobAutofill from the browser extension management page.

### Why do some dropdowns or date fields fail?

Recruiting systems implement controls in many different ways. Some are complex components rather than normal inputs. In this case, use the right-side profile panel to search and copy the value manually. If the same website or control type fails repeatedly, please open an Issue so it can be investigated.

### How do multi-page forms work?

Click `Start Filling` again after moving to a new page or step. OpenJobAutofill does not automatically continue across pages and does not submit applications.

### How do I back up or migrate my profile?

Use `Export Profile Backup` and `Import Profile Backup` in the settings page. The exported file uses OpenJobAutofill's own backup format and is intended for moving data between browsers or computers.

### How do I clear local data?

Open the settings page and click `Clear Local Data`. This removes the saved resume profile and API configuration from the current browser.

## Feedback

If you run into a problem, want support for a specific recruiting website, or have a feature request, please open an Issue. Including the website name, screenshots, and failed-field descriptions will make the issue easier to reproduce.

You can also check my GitHub profile for a public email address.

Community link: [LINUX DO](https://linux.do) - A Chinese community for tech enthusiasts. This project links to and recognizes LINUX DO for discussion and feedback.

## License

OpenJobAutofill is open-sourced under the MIT License. See [LICENSE](LICENSE) for details.
