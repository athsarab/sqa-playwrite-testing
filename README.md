# PixelsSuite Playwright Tests

This project contains end-to-end Playwright tests for https://www.pixelssuite.com. The suite focuses on core features such as Crop, Compress, Document Converter (Image to PDF, PDF to Word, Word to PDF), Image Converter, More tools, Contact, Resize, Editor, and general UI checks.

## What This Suite Covers

- Crop feature (TC01 to TC24)
- Compress feature (TC25 to TC37)
- Document Converter
  - Image to PDF (DC_TC_01 to DC_TC_17)
  - PDF to Word (DC_TC_18 to DC_TC_26)
  - Word to PDF (DC_TC_27 to DC_TC_37)
- Image Converter
  - Convert to JPG (IC_TC_01 to IC_TC_06)
  - Convert to PNG (IC_TC_07 to IC_TC_12)
  - Convert to WEBP (IC_TC_13 to IC_TC_20)
- More feature (Rotate, Flip, Meme, Color Picker, OCR) (TC-MT01 to TC-MT09)
- Contact page (TC-CU01 to TC-CU09)
- Resize feature (RS01 to RS08)
- Editor feature (ED01 to ED06)
- General UI tests (UI01 to UI10)

## Project Structure

- pixelssuite.test.js: Main test suite with helpers and all test cases
- playwright.config.js: Test configuration (headed Chromium, HTML report)
- test/: Test data files used for uploads
- screenshots/: Screenshots captured during tests
- playwright-report/: HTML report output

## Prerequisites

- Node.js 18+ (recommended)
- Internet access to https://www.pixelssuite.com

## Install

```bash
npm install
```

## Run Tests

Run the entire suite (headed mode):

```bash
npm run test:headed
```

Run only the PixelsSuite test file:

```bash
npm run test:file
```

Run a specific test by title:

```bash
npx playwright test -g "TC01"
```

## View the HTML Report

```bash
npm run report
```

## Test Data

The suite expects the following files under the test/ folder:

- sample.jpg
- sample.png
- sample.webp
- sample.pdf
- sample.docx
- sample.gif

These files are uploaded across multiple feature tests. If any file is missing, related tests will fail.

## Notes on Screenshots

- Screenshots are written to the screenshots/ folder.
- The tests call a helper to take full-page screenshots before and after key actions.
- The Playwright config also captures screenshots on failures automatically.

## Known Defects Documented in Tests

Some tests document known defects for tracking purposes. Examples include:

- PNG compression can produce a larger file (TC29)
- Compress preview may not update when changing quality slider (TC30)
- GIF compressor accepts non-GIF uploads (TC34)
- Image Converter format dropdown not functional (IC_TC_05, IC_TC_10, IC_TC_16)
- Clear button leaves preview visible in Image Converter (IC_TC_06, IC_TC_11, IC_TC_17)
- Image to PDF multiple pages mode generates only one page (DC_TC_10)
- Re-upload after clear may fail without refresh (DC_TC_11, DC_TC_33)
- Word to PDF accepts unsupported file types (DC_TC_35)
- Meme generator allows download without text (TC-MT08)
- Rotate accepts unsupported formats like GIF (TC-MT09)
- Contact email not a clickable mailto link (TC-CU09)

## Configuration Summary

playwright.config.js is set to:

- Use Chromium only, headed mode
- 60s test timeout, 1 retry
- HTML report output to playwright-report/
- Screenshots on failure, video on failure

## Tips

- If you run into flaky behavior, run with --headed and reduce test parallelism.
- For debugging a single case, use -g with the test title.
- Always keep test data files in place before running.
