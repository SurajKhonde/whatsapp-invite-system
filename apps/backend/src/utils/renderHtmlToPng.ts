import * as puppeteer from "puppeteer";
import { logger } from "@core/logger/logger";
import console from "console";

interface Viewport {
  width: number;
  height: number;
}

class HtmlToPngConverter {
  private browser: puppeteer.Browser | null = null;

  async init() {
    if (!this.browser) {
    //   this.browser = await puppeteer.launch({
    //     headless: true,
    //     args: [
    //       "--no-sandbox",
    //       "--disable-setuid-sandbox",
    //       "--disable-dev-shm-usage",
    //       "--disable-gpu",
    //     ],
    //   });
        this.browser = await puppeteer.launch({
    executablePath: "/usr/bin/brave-browser",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--allow-file-access-from-files",
      "--disable-web-security",
    ],
  });

    }
    return this.browser;
  }

  async convertHtmlToPng(
  html: string,
  viewport: Viewport
): Promise<Buffer> {
  try {
    const browser = await this.init();

    const page = await browser.newPage();

    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 2,
    });

   await page.setContent(html, {
  waitUntil: "domcontentloaded",

  timeout: 0,
});
await page.evaluate(() => {
  return document.fonts.ready;
});

await new Promise(
  (resolve) =>
    setTimeout(resolve, 2000)
);

    const buffer = await page.screenshot({
      type: "png",
      fullPage: true,
    });

    await page.close();

    return buffer as Buffer;
  } catch (error) {
    console.log(error)
    logger.error({ error }, "Error converting HTML to PNG");
    throw error;
  }
}

  async convertHtmlToMultipleSizes(
    html: string,
    viewports: Viewport[]
  ): Promise<Buffer[]> {
    const buffers: Buffer[] = [];

    for (const viewport of viewports) {
      const buffer = await this.convertHtmlToPng(html, viewport);
      buffers.push(buffer);
    }

    return buffers;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

const converter = new HtmlToPngConverter();

export async function renderHtmlToPng(
  html: string,
  viewport: Viewport
): Promise<Buffer> {
  return converter.convertHtmlToPng(html, viewport);
}

export async function renderHtmlToMultipleSizes(
  html: string,
  viewports: Viewport[]
): Promise<Buffer[]> {
  return converter.convertHtmlToMultipleSizes(html, viewports);
}

// Cleanup on process exit
process.on("exit", () => {
  converter.close();
});