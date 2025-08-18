import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

// 크롤링 설정
let driver: WebDriver | null = null;
let isFirstRun = true;
let lastCrawledData: string | null = null;

// 웹 드라이버 초기화
async function initializeDriver(): Promise<WebDriver> {
  const options = new chrome.Options();
  options.addArguments('--headless'); // 헤드리스 모드로 실행
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-gpu');
  options.addArguments('--window-size=1920,1080');

  return new Builder().forBrowser('chrome').setChromeOptions(options).build();
}

// 웹 크롤링 함수
export async function crawlWebsite(): Promise<string | null> {
  const targetUrl = process.env.CRAWL_TARGET_URL;
  const selector = process.env.CRAWL_TARGET_SELECTOR || 'body';

  if (!targetUrl) {
    console.error('❌ CRAWL_TARGET_URL이 설정되지 않았습니다!');
    return null;
  }

  if (!driver) {
    driver = await initializeDriver();
  }

  try {
    console.log(`🕷️ 크롤링 시작: ${targetUrl}`);

    await driver.get(targetUrl);
    await driver.wait(until.elementLocated(By.css(selector)), 10000);

    const element = await driver.findElement(By.css(selector));
    const text = await element.getText();

    console.log('✅ 크롤링 완료');
    return text.trim();
  } catch (error) {
    console.error('❌ 크롤링 오류:', error);

    // 드라이버 재초기화
    try {
      await driver?.quit();
    } catch {
      // ignore
    }
    driver = null;

    return null;
  }
}

// 크롤링 데이터 상태 관리
export function getLastCrawledData(): string | null {
  return lastCrawledData;
}

export function setLastCrawledData(data: string | null): void {
  lastCrawledData = data;
}

export function isFirstRunCheck(): boolean {
  return isFirstRun;
}

export function setFirstRun(value: boolean): void {
  isFirstRun = value;
}

export function getDriverStatus(): boolean {
  return driver !== null;
}

// 드라이버 정리
export async function cleanupDriver(): Promise<void> {
  if (driver) {
    try {
      await driver.quit();
      console.log('✅ WebDriver 종료 완료');
    } catch (error) {
      console.error('❌ WebDriver 종료 오류:', error);
    }
    driver = null;
  }
}
