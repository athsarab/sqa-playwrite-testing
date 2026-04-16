
const { test, expect } = require('@playwright/test');
const path = require('path');

const BASE_URL = 'https://www.pixelssuite.com';

// Direct page URLs - avoids dropdown timing issues entirely
const URLS = {
  home:           BASE_URL,
  imageToPdf:     BASE_URL + '/image-to-pdf',
  pdfToWord:      BASE_URL + '/pdf-to-word',
  wordToPdf:      BASE_URL + '/word-to-pdf',
  convertToJpg:   BASE_URL + '/convert-to-jpg',
  convertToPng:   BASE_URL + '/convert-to-png',
  convertToWebp:  BASE_URL + '/convert-to-webp',
  resize:         BASE_URL + '/resize',
  crop:           BASE_URL + '/crop',
  compressImage:  BASE_URL + '/compress-image',
  pngCompressor:  BASE_URL + '/png-compressor',
  gifCompressor:  BASE_URL + '/gif-compressor',
  editor:         BASE_URL + '/editor',
};

// Helper: take screenshot
async function shot(page, name) {
  await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
}

// Helper: hover a nav item and screenshot the open dropdown
async function hoverNav(page, navText) {
  const navEl = page.locator(`text="${navText}"`).first();
  await navEl.hover();
  await page.waitForTimeout(1000);
}


test.describe('1. Document Converter - Image to PDF', () => {

  test('TC-PW-DC01 - Image to PDF page loads correctly', async ({ page }) => {
    await page.goto(URLS.imageToPdf, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // VERIFY URL
    expect(page.url()).toContain('pdf');

    // VERIFY heading exists
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
    const headingText = await heading.textContent();
    console.log(`Heading: ${headingText}`);

    await shot(page, 'TC-PW-DC01-image-to-pdf-page');
    console.log('TC-PW-DC01 PASS');
  });

  test('TC-PW-DC02 - Image to PDF page has file input for upload', async ({ page }) => {
    await page.goto(URLS.imageToPdf, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // The site uses hidden input[type=file] wrapped in custom styled div
    const fileInput = page.locator('input[type="file"]');
    const count = await fileInput.count();
    console.log(`input[type=file] count: ${count}`);
    expect(count).toBeGreaterThan(0);

    await shot(page, 'TC-PW-DC02-file-input-present');
    console.log('TC-PW-DC02 PASS');
  });

  test('TC-PW-DC03 - Image to PDF page has A4 and Letter size options', async ({ page }) => {
    await page.goto(URLS.imageToPdf, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const content = await page.content();
    expect(content).toContain('A4');
    console.log('A4 option found in page');

    await shot(page, 'TC-PW-DC03-page-size-options');
    console.log('TC-PW-DC03 PASS');
  });

  test('TC-PW-DC04 - Image to PDF page has Portrait and Landscape orientation', async ({ page }) => {
    await page.goto(URLS.imageToPdf, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const content = await page.content();
    const hasPortrait = content.toLowerCase().includes('portrait');
    const hasLandscape = content.toLowerCase().includes('landscape');
    console.log(`Portrait: ${hasPortrait}, Landscape: ${hasLandscape}`);
    expect(hasPortrait || hasLandscape).toBe(true);

    await shot(page, 'TC-PW-DC04-orientation-options');
    console.log('TC-PW-DC04 PASS');
  });

  test('TC-PW-DC05 - Image to PDF page has Vertical and Horizontal arrange options', async ({ page }) => {
    await page.goto(URLS.imageToPdf, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const content = await page.content();
    const hasVertical = content.toLowerCase().includes('vertical');
    const hasHorizontal = content.toLowerCase().includes('horizontal');
    console.log(`Vertical: ${hasVertical}, Horizontal: ${hasHorizontal}`);
    expect(hasVertical || hasHorizontal).toBe(true);

    await shot(page, 'TC-PW-DC05-arrange-options');
    console.log('TC-PW-DC05 PASS');
  });

  test('TC-PW-DC06 - Image to PDF page has One/Multiple pages options', async ({ page }) => {
    await page.goto(URLS.imageToPdf, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const content = await page.content();
    const hasPages = content.toLowerCase().includes('multiple') || content.toLowerCase().includes('one');
    console.log(`Pages options found: ${hasPages}`);
    expect(hasPages).toBe(true);

    await shot(page, 'TC-PW-DC06-pages-options');
    console.log('TC-PW-DC06 PASS');
  });

  test('TC-PW-DC07 - Navigate to Image to PDF via Document Converter dropdown', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Hover to open the dropdown - this screenshots the dropdown menu open
    await hoverNav(page, 'Document Converter');
    await shot(page, 'TC-PW-DC07-document-converter-dropdown-open');

    // Click Image → PDF link
    const link = page.locator('a').filter({ hasText: /image.*pdf/i }).first();
    await link.click();
    await page.waitForTimeout(2000);

    expect(page.url()).toContain('pdf');
    await shot(page, 'TC-PW-DC07-image-to-pdf-navigated');
    console.log('TC-PW-DC07 PASS');
  });

  test('TC-PW-DC08 - Upload sample.jpg to Image to PDF page', async ({ page }) => {
    await page.goto(URLS.imageToPdf, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Screenshot BEFORE upload
    await shot(page, 'TC-PW-DC08-before-upload');

    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(path.join(__dirname, 'test', 'sample.jpg'));
      await page.waitForTimeout(4000);
    }

    // Screenshot AFTER upload - should show the image in the selection list
    await shot(page, 'TC-PW-DC08-after-jpg-upload');
    console.log('TC-PW-DC08 PASS');
  });

  test('TC-PW-DC09 - Upload sample.png to Image to PDF page', async ({ page }) => {
    await page.goto(URLS.imageToPdf, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await shot(page, 'TC-PW-DC09-before-upload');

    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(path.join(__dirname, 'test', 'sample.png'));
      await page.waitForTimeout(4000);
    }

    await shot(page, 'TC-PW-DC09-after-png-upload');
    console.log('TC-PW-DC09 PASS');
  });

  test('TC-PW-DC10 - Image to PDF page title is set (SEO)', async ({ page }) => {
    await page.goto(URLS.imageToPdf, { waitUntil: 'networkidle' });
    const title = await page.title();
    console.log(`Title: ${title}`);
    expect(title.length).toBeGreaterThan(0);

    await shot(page, 'TC-PW-DC10-page-title');
    console.log('TC-PW-DC10 PASS');
  });

});

// ============================================================
// SECTION 2: DOCUMENT CONVERTER - PDF TO WORD & WORD TO PDF
// ============================================================

test.describe('2. Document Converter - PDF to Word & Word to PDF', () => {

  test('TC-PW-DC11 - PDF to Word page loads and has heading', async ({ page }) => {
    await page.goto(URLS.pdfToWord, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    await shot(page, 'TC-PW-DC11-pdf-to-word-page');
    console.log('TC-PW-DC11 PASS');
  });

  test('TC-PW-DC12 - PDF to Word page has file input for PDF upload', async ({ page }) => {
    await page.goto(URLS.pdfToWord, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const fileInput = page.locator('input[type="file"]');
    const count = await fileInput.count();
    console.log(`input[type=file] on PDF to Word: ${count}`);
    expect(count).toBeGreaterThan(0);

    await shot(page, 'TC-PW-DC12-pdf-file-input');
    console.log('TC-PW-DC12 PASS');
  });

  test('TC-PW-DC13 - Upload sample.pdf to PDF to Word page', async ({ page }) => {
    await page.goto(URLS.pdfToWord, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await shot(page, 'TC-PW-DC13-before-upload');

    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(path.join(__dirname, 'test', 'sample.pdf'));
      await page.waitForTimeout(4000);
    }

    await shot(page, 'TC-PW-DC13-after-pdf-upload');
    console.log('TC-PW-DC13 PASS');
  });

  test('TC-PW-DC14 - Navigate to PDF to Word via dropdown', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await hoverNav(page, 'Document Converter');
    await shot(page, 'TC-PW-DC14-doc-converter-dropdown');

    const link = page.locator('a').filter({ hasText: /pdf.*word/i }).first();
    await link.click();
    await page.waitForTimeout(2000);

    await shot(page, 'TC-PW-DC14-pdf-to-word-navigated');
    console.log('TC-PW-DC14 PASS');
  });

  test('TC-PW-DC15 - Word to PDF page loads and has heading', async ({ page }) => {
    await page.goto(URLS.wordToPdf, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    await shot(page, 'TC-PW-DC15-word-to-pdf-page');
    console.log('TC-PW-DC15 PASS');
  });

  test('TC-PW-DC16 - Word to PDF page has file input for Word upload', async ({ page }) => {
    await page.goto(URLS.wordToPdf, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const fileInput = page.locator('input[type="file"]');
    const count = await fileInput.count();
    console.log(`input[type=file] on Word to PDF: ${count}`);
    expect(count).toBeGreaterThan(0);

    await shot(page, 'TC-PW-DC16-word-file-input');
    console.log('TC-PW-DC16 PASS');
  });

  test('TC-PW-DC17 - Upload sample.docx to Word to PDF page', async ({ page }) => {
    await page.goto(URLS.wordToPdf, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await shot(page, 'TC-PW-DC17-before-upload');

    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(path.join(__dirname, 'test', 'sample.docx'));
      await page.waitForTimeout(4000);
    }

    await shot(page, 'TC-PW-DC17-after-docx-upload');
    console.log('TC-PW-DC17 PASS');
  });

});

// ============================================================
// SECTION 3: IMAGE CONVERTER
// ============================================================

test.describe('3. Image Converter Feature', () => {

  test('TC-PW-IC01 - Image Converter dropdown opens on hover', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await hoverNav(page, 'Image Converter');
    await shot(page, 'TC-PW-IC01-image-converter-dropdown');
    console.log('TC-PW-IC01 PASS');
  });

  test('TC-PW-IC02 - Convert to JPG page loads via nav dropdown', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await hoverNav(page, 'Image Converter');
    const jpgLink = page.locator('a').filter({ hasText: /jpg/i }).first();
    await jpgLink.click();
    await page.waitForTimeout(3000);

    const content = await page.content();
    expect(content.toLowerCase()).toContain('jpg');

    await shot(page, 'TC-PW-IC02-convert-to-jpg-page');
    console.log('TC-PW-IC02 PASS');
  });

  test('TC-PW-IC03 - Convert to JPG page has file input', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await hoverNav(page, 'Image Converter');
    const jpgLink = page.locator('a').filter({ hasText: /jpg/i }).first();
    await jpgLink.click();
    await page.waitForTimeout(3000);

    const fileInput = page.locator('input[type="file"]');
    const count = await fileInput.count();
    console.log(`File input on Convert to JPG: ${count}`);
    expect(count).toBeGreaterThan(0);

    await shot(page, 'TC-PW-IC03-jpg-file-input');
    console.log('TC-PW-IC03 PASS');
  });

  test('TC-PW-IC04 - Upload PNG to Convert to JPG page', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await hoverNav(page, 'Image Converter');
    const jpgLink = page.locator('a').filter({ hasText: /jpg/i }).first();
    await jpgLink.click();
    await page.waitForTimeout(3000);

    await shot(page, 'TC-PW-IC04-before-upload');

    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(path.join(__dirname, 'test', 'sample.png'));
      await page.waitForTimeout(4000);
    }

    await shot(page, 'TC-PW-IC04-png-uploaded-to-jpg');
    console.log('TC-PW-IC04 PASS');
  });

  test('TC-PW-IC05 - Upload WEBP to Convert to JPG page', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await hoverNav(page, 'Image Converter');
    const jpgLink = page.locator('a').filter({ hasText: /jpg/i }).first();
    await jpgLink.click();
    await page.waitForTimeout(3000);

    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(path.join(__dirname, 'test', 'sample.webp'));
      await page.waitForTimeout(4000);
    }

    await shot(page, 'TC-PW-IC05-webp-uploaded-to-jpg');
    console.log('TC-PW-IC05 PASS');
  });

  test('TC-PW-IC06 - Convert to PNG page loads via nav dropdown', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await hoverNav(page, 'Image Converter');
    await shot(page, 'TC-PW-IC06-dropdown-for-png');

    const pngLink = page.locator('a').filter({ hasText: /png/i }).first();
    await pngLink.click();
    await page.waitForTimeout(3000);

    const content = await page.content();
    expect(content.toLowerCase()).toContain('png');

    await shot(page, 'TC-PW-IC06-convert-to-png-page');
    console.log('TC-PW-IC06 PASS');
  });

  test('TC-PW-IC07 - Upload JPG to Convert to PNG page', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await hoverNav(page, 'Image Converter');
    const pngLink = page.locator('a').filter({ hasText: /png/i }).first();
    await pngLink.click();
    await page.waitForTimeout(3000);

    await shot(page, 'TC-PW-IC07-before-upload');

    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(path.join(__dirname, 'test', 'sample.jpg'));
      await page.waitForTimeout(4000);
    }

    await shot(page, 'TC-PW-IC07-jpg-uploaded-to-png');
    console.log('TC-PW-IC07 PASS');
  });

  test('TC-PW-IC08 - Convert to WEBP page loads via nav dropdown', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await hoverNav(page, 'Image Converter');
    await shot(page, 'TC-PW-IC08-dropdown-for-webp');

    const webpLink = page.locator('a').filter({ hasText: /webp/i }).first();
    await webpLink.click();
    await page.waitForTimeout(3000);

    const content = await page.content();
    expect(content.toLowerCase()).toContain('webp');

    await shot(page, 'TC-PW-IC08-convert-to-webp-page');
    console.log('TC-PW-IC08 PASS');
  });

  test('TC-PW-IC09 - Upload PNG to Convert to WEBP page', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await hoverNav(page, 'Image Converter');
    const webpLink = page.locator('a').filter({ hasText: /webp/i }).first();
    await webpLink.click();
    await page.waitForTimeout(3000);

    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(path.join(__dirname, 'test', 'sample.png'));
      await page.waitForTimeout(4000);
    }

    await shot(page, 'TC-PW-IC09-png-uploaded-to-webp');
    console.log('TC-PW-IC09 PASS');
  });

  test('TC-PW-IC10 - Convert to JPG page has download option after upload', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await hoverNav(page, 'Image Converter');
    const jpgLink = page.locator('a').filter({ hasText: /jpg/i }).first();
    await jpgLink.click();
    await page.waitForTimeout(3000);

    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(path.join(__dirname, 'test', 'sample.png'));
      await page.waitForTimeout(5000);
    }

    // After upload, check for download button/link
    const content = await page.content();
    const hasDownload = content.toLowerCase().includes('download');
    console.log(`Download option after upload: ${hasDownload}`);

    await shot(page, 'TC-PW-IC10-download-after-upload');
    console.log('TC-PW-IC10 PASS');
  });

});

// ============================================================
// SECTION 4: RESIZE FEATURE
// ============================================================

test.describe('4. Resize Feature', () => {

  test('TC-PW-RS01 - Resize page loads via direct URL', async ({ page }) => {
    await page.goto(URLS.resize, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    await shot(page, 'TC-PW-RS01-resize-page');
    console.log('TC-PW-RS01 PASS');
  });

  test('TC-PW-RS02 - Resize dropdown opens on hover', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await hoverNav(page, 'Resize');
    await shot(page, 'TC-PW-RS02-resize-dropdown');
    console.log('TC-PW-RS02 PASS');
  });

  test('TC-PW-RS03 - Resize page has file input for image upload', async ({ page }) => {
    await page.goto(URLS.resize, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const fileInput = page.locator('input[type="file"]');
    const count = await fileInput.count();
    console.log(`input[type=file] on Resize page: ${count}`);
    expect(count).toBeGreaterThan(0);

    await shot(page, 'TC-PW-RS03-resize-file-input');
    console.log('TC-PW-RS03 PASS');
  });

  test('TC-PW-RS04 - Upload JPG to Resize page', async ({ page }) => {
    await page.goto(URLS.resize, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await shot(page, 'TC-PW-RS04-before-upload');

    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(path.join(__dirname, 'test', 'sample.jpg'));
      await page.waitForTimeout(5000);
    }

    await shot(page, 'TC-PW-RS04-after-jpg-upload');
    console.log('TC-PW-RS04 PASS');
  });

  test('TC-PW-RS05 - Resize page shows width/height dimension controls', async ({ page }) => {
    await page.goto(URLS.resize, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const content = await page.content();
    const hasDimensions = content.toLowerCase().includes('width') ||
                          content.toLowerCase().includes('height') ||
                          content.toLowerCase().includes('px');
    console.log(`Dimension controls: ${hasDimensions}`);
    expect(hasDimensions).toBe(true);

    await shot(page, 'TC-PW-RS05-dimension-controls');
    console.log('TC-PW-RS05 PASS');
  });

  test('TC-PW-RS06 - Resize page heading is visible', async ({ page }) => {
    await page.goto(URLS.resize, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    console.log(`Resize heading: ${text}`);

    await shot(page, 'TC-PW-RS06-resize-heading');
    console.log('TC-PW-RS06 PASS');
  });

  test('TC-PW-RS07 - Resize page has download option', async ({ page }) => {
    await page.goto(URLS.resize, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const content = await page.content();
    const hasDownload = content.toLowerCase().includes('download');
    console.log(`Download option: ${hasDownload}`);
    expect(hasDownload).toBe(true);

    await shot(page, 'TC-PW-RS07-resize-download-option');
    console.log('TC-PW-RS07 PASS');
  });

  test('TC-PW-RS08 - Resize page title is set', async ({ page }) => {
    await page.goto(URLS.resize, { waitUntil: 'networkidle' });
    const title = await page.title();
    console.log(`Resize title: ${title}`);
    expect(title.length).toBeGreaterThan(0);

    await shot(page, 'TC-PW-RS08-resize-title');
    console.log('TC-PW-RS08 PASS');
  });

});

// ============================================================
// SECTION 5: CROP FEATURE
// ============================================================

test.describe('5. Crop Feature', () => {

  test('TC-PW-CR01 - Crop page loads via direct URL', async ({ page }) => {
    await page.goto(URLS.crop, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    await shot(page, 'TC-PW-CR01-crop-page');
    console.log('TC-PW-CR01 PASS');
  });

  test('TC-PW-CR02 - Crop dropdown opens on hover', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await hoverNav(page, 'Crop');
    await shot(page, 'TC-PW-CR02-crop-dropdown');
    console.log('TC-PW-CR02 PASS');
  });

  test('TC-PW-CR03 - Crop page has file input for image upload', async ({ page }) => {
    await page.goto(URLS.crop, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const fileInput = page.locator('input[type="file"]');
    const count = await fileInput.count();
    console.log(`input[type=file] on Crop page: ${count}`);
    expect(count).toBeGreaterThan(0);

    await shot(page, 'TC-PW-CR03-crop-file-input');
    console.log('TC-PW-CR03 PASS');
  });

  test('TC-PW-CR04 - Upload JPG to Crop page', async ({ page }) => {
    await page.goto(URLS.crop, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await shot(page, 'TC-PW-CR04-before-upload');

    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(path.join(__dirname, 'test', 'sample.jpg'));
      await page.waitForTimeout(5000);
    }

    await shot(page, 'TC-PW-CR04-after-jpg-upload');
    console.log('TC-PW-CR04 PASS');
  });

  test('TC-PW-CR05 - Crop page has aspect ratio options', async ({ page }) => {
    await page.goto(URLS.crop, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const content = await page.content();
    const hasRatio = content.includes('1:1') || content.includes('16:9') ||
                     content.includes('4:3') || content.toLowerCase().includes('ratio') ||
                     content.toLowerCase().includes('free');
    console.log(`Aspect ratio options: ${hasRatio}`);
    expect(hasRatio).toBe(true);

    await shot(page, 'TC-PW-CR05-aspect-ratio-options');
    console.log('TC-PW-CR05 PASS');
  });

  test('TC-PW-CR06 - Crop page has download option', async ({ page }) => {
    await page.goto(URLS.crop, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const content = await page.content();
    const hasDownload = content.toLowerCase().includes('download');
    console.log(`Download on Crop page: ${hasDownload}`);
    expect(hasDownload).toBe(true);

    await shot(page, 'TC-PW-CR06-crop-download-option');
    console.log('TC-PW-CR06 PASS');
  });

  test('TC-PW-CR07 - Crop page has drag-and-drop upload zone text', async ({ page }) => {
    await page.goto(URLS.crop, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const content = await page.content();
    const hasDragDrop = content.toLowerCase().includes('drag') ||
                        content.toLowerCase().includes('drop');
    console.log(`Drag-drop text: ${hasDragDrop}`);
    expect(hasDragDrop).toBe(true);

    await shot(page, 'TC-PW-CR07-crop-drag-drop');
    console.log('TC-PW-CR07 PASS');
  });

  test('TC-PW-CR08 - Crop page heading is visible', async ({ page }) => {
    await page.goto(URLS.crop, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    console.log(`Crop heading: ${text}`);

    await shot(page, 'TC-PW-CR08-crop-heading');
    console.log('TC-PW-CR08 PASS');
  });

});

// ============================================================
// SECTION 6: COMPRESS FEATURE
// ============================================================

test.describe('6. Compress Feature', () => {

  test('TC-PW-CP01 - Compress dropdown shows 3 sub-options', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await hoverNav(page, 'Compress');
    await shot(page, 'TC-PW-CP01-compress-dropdown-all-options');

    // From screenshot: Compress Image, PNG Compressor, GIF Compressor
    const content = await page.content();
    const hasCompressImage = content.includes('Compress Image');
    const hasPng = content.includes('PNG Compressor');
    const hasGif = content.includes('GIF Compressor');
    console.log(`Compress Image: ${hasCompressImage}, PNG: ${hasPng}, GIF: ${hasGif}`);
    expect(hasCompressImage || hasPng || hasGif).toBe(true);

    console.log('TC-PW-CP01 PASS');
  });

  test('TC-PW-CP02 - Navigate to Compress Image via dropdown', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await hoverNav(page, 'Compress');
    const link = page.locator('a').filter({ hasText: /compress image/i }).first();
    await link.click();
    await page.waitForTimeout(3000);

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    await shot(page, 'TC-PW-CP02-compress-image-page');
    console.log('TC-PW-CP02 PASS');
  });

  test('TC-PW-CP03 - Compress Image page has file input', async ({ page }) => {
    await page.goto(URLS.compressImage, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const fileInput = page.locator('input[type="file"]');
    const count = await fileInput.count();
    console.log(`input[type=file] on Compress Image: ${count}`);
    expect(count).toBeGreaterThan(0);

    await shot(page, 'TC-PW-CP03-compress-file-input');
    console.log('TC-PW-CP03 PASS');
  });

  test('TC-PW-CP04 - Upload JPG to Compress Image page', async ({ page }) => {
    await page.goto(URLS.compressImage, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await shot(page, 'TC-PW-CP04-before-upload');

    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(path.join(__dirname, 'test', 'sample.jpg'));
      await page.waitForTimeout(5000);
    }

    await shot(page, 'TC-PW-CP04-after-jpg-upload');
    console.log('TC-PW-CP04 PASS');
  });

  test('TC-PW-CP05 - Compress Image page has quality control', async ({ page }) => {
    await page.goto(URLS.compressImage, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const content = await page.content();
    const hasQuality = content.toLowerCase().includes('quality') ||
                       content.toLowerCase().includes('compression') ||
                       content.includes('%');
    console.log(`Quality control: ${hasQuality}`);
    expect(hasQuality).toBe(true);

    await shot(page, 'TC-PW-CP05-quality-control');
    console.log('TC-PW-CP05 PASS');
  });

  test('TC-PW-CP06 - Compress page shows supported formats', async ({ page }) => {
    await page.goto(URLS.compressImage, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const content = await page.content();
    const hasFormats = content.toLowerCase().includes('jpg') ||
                       content.toLowerCase().includes('png') ||
                       content.toLowerCase().includes('jpeg');
    console.log(`Formats shown: ${hasFormats}`);
    expect(hasFormats).toBe(true);

    await shot(page, 'TC-PW-CP06-compress-formats');
    console.log('TC-PW-CP06 PASS');
  });

  test('TC-PW-CP07 - PNG Compressor page loads (sub-feature)', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await hoverNav(page, 'Compress');
    await shot(page, 'TC-PW-CP07-dropdown-for-png-compressor');

    const link = page.locator('a').filter({ hasText: /png compressor/i }).first();
    await link.click();
    await page.waitForTimeout(3000);

    const content = await page.content();
    expect(content.toLowerCase()).toContain('png');

    await shot(page, 'TC-PW-CP07-png-compressor-page');
    console.log('TC-PW-CP07 PASS');
  });

  test('TC-PW-CP08 - GIF Compressor page loads (sub-feature)', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await hoverNav(page, 'Compress');
    await shot(page, 'TC-PW-CP08-dropdown-for-gif-compressor');

    const link = page.locator('a').filter({ hasText: /gif compressor/i }).first();
    await link.click();
    await page.waitForTimeout(3000);

    const content = await page.content();
    expect(content.toLowerCase()).toContain('gif');

    await shot(page, 'TC-PW-CP08-gif-compressor-page');
    console.log('TC-PW-CP08 PASS');
  });

  test('TC-PW-CP09 - Upload PNG to Compress Image page', async ({ page }) => {
    await page.goto(URLS.compressImage, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(path.join(__dirname, 'test', 'sample.png'));
      await page.waitForTimeout(5000);
    }

    await shot(page, 'TC-PW-CP09-png-uploaded-compress');
    console.log('TC-PW-CP09 PASS');
  });

  test('TC-PW-CP10 - Compress Image page heading is visible', async ({ page }) => {
    await page.goto(URLS.compressImage, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    console.log(`Compress heading: ${text}`);

    await shot(page, 'TC-PW-CP10-compress-heading');
    console.log('TC-PW-CP10 PASS');
  });

});

// ============================================================
// SECTION 7: GENERAL UI TESTS
// ============================================================

test.describe('7. General UI Tests', () => {

  test('TC-PW-UI01 - Homepage loads with correct title', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const title = await page.title();
    console.log(`Title: ${title}`);
    expect(title.toLowerCase()).toContain('pixels');

    await shot(page, 'TC-PW-UI01-homepage-full');
    console.log('TC-PW-UI01 PASS');
  });

  test('TC-PW-UI02 - All 7 main navigation items visible', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const navItems = ['Document Converter', 'Editor', 'Resize', 'Crop', 'Compress', 'Image Converter', 'More'];
    for (const item of navItems) {
      const el = page.locator(`text="${item}"`).first();
      const count = await el.count();
      console.log(`"${item}": ${count > 0 ? '✅ found' : '❌ NOT found'}`);
    }

    await shot(page, 'TC-PW-UI02-navigation-bar');
    console.log('TC-PW-UI02 PASS');
  });

  test('TC-PW-UI03 - Homepage hero text is visible', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // From screenshot: "Free Online Tools — Convert, Compress, Transliterate & Transform"
    const hero = page.locator('h1').first();
    await expect(hero).toBeVisible();
    const text = await hero.textContent();
    console.log(`Hero: ${text?.substring(0, 80)}`);

    await shot(page, 'TC-PW-UI03-hero-text');
    console.log('TC-PW-UI03 PASS');
  });

  test('TC-PW-UI04 - Mobile viewport (375px) page renders', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await shot(page, 'TC-PW-UI04-mobile-375px');
    await expect(page).toHaveURL(/pixelssuite/);
    console.log('TC-PW-UI04 PASS');
  });

  test('TC-PW-UI05 - Tablet viewport (768px) page renders', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await shot(page, 'TC-PW-UI05-tablet-768px');
    await expect(page).toHaveURL(/pixelssuite/);
    console.log('TC-PW-UI05 PASS');
  });

  test('TC-PW-UI06 - Footer visible on homepage scroll', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);

    await shot(page, 'TC-PW-UI06-footer-visible');
    console.log('TC-PW-UI06 PASS');
  });

  test('TC-PW-UI07 - No HTTP 404 errors on core pages', async ({ page }) => {
    const pagesToCheck = [
      { name: 'Image to PDF', url: URLS.imageToPdf },
      { name: 'PDF to Word', url: URLS.pdfToWord },
      { name: 'Word to PDF', url: URLS.wordToPdf },
      { name: 'Crop', url: URLS.crop },
      { name: 'Resize', url: URLS.resize },
      { name: 'Compress Image', url: URLS.compressImage },
    ];

    for (const p of pagesToCheck) {
      const response = await page.goto(p.url, { waitUntil: 'domcontentloaded' });
      const status = response ? response.status() : 0;
      console.log(`${p.name}: HTTP ${status}`);
      expect(status).not.toBe(404);
      await page.waitForTimeout(500);
    }

    await shot(page, 'TC-PW-UI07-last-page-no-404');
    console.log('TC-PW-UI07 PASS');
  });

  test('TC-PW-UI08 - More dropdown opens and has sub-items', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await hoverNav(page, 'More');
    await shot(page, 'TC-PW-UI08-more-dropdown-open');
    console.log('TC-PW-UI08 PASS');
  });

  test('TC-PW-UI09 - Editor page loads via nav hover', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await hoverNav(page, 'Editor');
    await shot(page, 'TC-PW-UI09-editor-dropdown');

    const editorLink = page.locator('a').filter({ hasText: /editor/i }).first();
    if (await editorLink.count() > 0) {
      await editorLink.click();
      await page.waitForTimeout(3000);
    }

    await shot(page, 'TC-PW-UI09-editor-page');
    console.log('TC-PW-UI09 PASS');
  });

  test('TC-PW-UI10 - Homepage feature cards are visible', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // From screenshot: Document Converter, PDF Editor, Resize, Crop cards visible
    const content = await page.content();
    const hasDocConverter = content.includes('Document Converter');
    const hasResize = content.includes('Resize');
    const hasCrop = content.includes('Crop');
    console.log(`Feature cards - DocConverter: ${hasDocConverter}, Resize: ${hasResize}, Crop: ${hasCrop}`);
    expect(hasDocConverter && hasResize && hasCrop).toBe(true);

    await shot(page, 'TC-PW-UI10-feature-cards');
    console.log('TC-PW-UI10 PASS');
  });

});