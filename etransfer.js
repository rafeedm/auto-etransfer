const dotenv = require("dotenv");
dotenv.config();

const readline = require("readline");
const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const puppeteer = require("puppeteer");

input.question("Enter amount, full name and email:\n", (answer) => {
  const parsed = answer.split(" ");
  let amount = parsed[0];
  let name = parsed[1] + " " + parsed[2];
  let email = parsed[3];

  (async () => {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.goto(
      "https://www1.royalbank.com/cgi-bin/rbaccess/rbcgi3m01?F6=1&F7=IB&F21=IB&F22=IB&REQUEST=ClientSignin&LANGUAGE=ENGLISH"
    );

    //logging in
    await page.keyboard.type(process.env.USERNAME);
    await page.keyboard.press("Tab");
    await page.keyboard.type(process.env.PASS);
    await page.keyboard.press("Enter");

    //navigating etransfer
    await page.waitForSelector(
      "#bankAcc > table > tbody > tr:nth-child(2) > th > form > a"
    );
    await page.click(
      "#bankAcc > table > tbody > tr:nth-child(2) > th > form > a"
    );
    await page.waitForSelector(
      "#main > bb-route > bb-chrome > bb-panel-container > bb-area > bb-chrome:nth-child(1) > rbc-details-layout-widget > rbc-frame > article > section > div:nth-child(1) > rbc-custom-product-summary-details-widget > div:nth-child(2) > div.pda-links.border-bottom > div.mini-statement-links-right.hide-on-small-tablet > a.icon-link.interac-push-right.hide-on-mobile"
    );
    await page.click(
      "#main > bb-route > bb-chrome > bb-panel-container > bb-area > bb-chrome:nth-child(1) > rbc-details-layout-widget > rbc-frame > article > section > div:nth-child(1) > rbc-custom-product-summary-details-widget > div:nth-child(2) > div.pda-links.border-bottom > div.mini-statement-links-right.hide-on-small-tablet > a.icon-link.interac-push-right.hide-on-mobile"
    );
    await page.waitForSelector("#emtrbccust");
    await page.click("#emtrbccust");
    await page.click("#amount");
    await page.keyboard.type(amount);
    await page.click(
      "#pay_submit > div.btns-container.clearfix > button.btn.btn-lg.btn-main"
    );
    await page.waitForSelector("#EMT_NAME_ID");
    await page.click("#EMT_NAME_ID");
    await page.keyboard.type(name);
    await page.click("#EMT_EMAILADDRESS_ID");
    await page.keyboard.type(email);
    await page.click(
      "#accProductsContainer > div > div.btns-container.clearfix > button.btn.btn-lg.btn-main"
    );
    await page.waitForSelector(
      "#accProductsContainer > div > div.btns-container.clearfix > button.btn.btn-lg.btn-main"
    );
    await page.click(
      "#accProductsContainer > div > div.btns-container.clearfix > button.btn.btn-lg.btn-main"
    );
    await browser.close();
  })();

  input.close();
});
