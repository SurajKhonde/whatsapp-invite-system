import puppeteer from "puppeteer";

export const generateImage = async (html: string): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/brave-browser", // or chromium
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--allow-file-access-from-files",
      "--disable-web-security",
    ],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 800,
    height: 1100,
  });

  // ✅ wait for all resources (images, css, fonts)
  await page.setContent(html, {
    waitUntil: "networkidle0",
  });

  // ✅ ensure fonts loaded
  await page.evaluateHandle("document.fonts.ready");

  // ✅ FIX for older Puppeteer (instead of waitForTimeout)
  await new Promise((resolve) => setTimeout(resolve, 500));

  const screenshot = await page.screenshot({
    type: "png",
  });

  await browser.close();

  return Buffer.from(screenshot);
};