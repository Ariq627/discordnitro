const puppeteer = require('puppeteer-extra')
const randomize = require('randomatic')
var random = require('random-name')
const readline = require('readline-sync')
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const delay = require('delay');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require("fs");
const moment = require('moment');
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
const randomUseragent = require('random-useragent');

function generate(n) {
    var add = 1,
        max = 12 - add; // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.
    if (n > max) {
        return generate(max) + generate(n - max);
    }
    max = Math.pow(10, n + add);
    var min = max / 10; // Math.pow(10, n) basically
    var number = Math.floor(Math.random() * (max - min + 1)) + min;
    return ("" + number).substring(add);
}
async function getName() {
    const signature = await generate(5);

    const data = await fetch(
        `https://www.random-name-generator.com/indonesia?gender=male&n=1&s=${signature}`, {
            method: "GET",
        }
    );
    const response = await data.text();
    const $ = cheerio.load(response);
    const result = $("dd.h4.col-12").text();
    const firstName = result.split(" ")[0].toLowerCase();
    const lastName = result.split(" ")[1].toLowerCase();

    const user = {
        firstName,
        lastName,
    };
    return user;
}
const functiongetuid = (email) => new Promise((resolve, reject) => {
    fetch(`https://getnada.com/api/v1/inboxes/${email}`, {
            method: "get",
        })
        .then(res => res.json())
        .then(ress => {
            var message = ress.msgs

            function isuid(uids) {
                return uids.f == "account@toweroffantasy-global.com";
            }
            const datas = message.find(isuid)
            const jadi = datas.uid
            resolve(jadi);
        })
        .catch(err => reject(err));
});


(async() => {
    console.log(`[ ${moment().format("HH:mm:ss")} ] ` + 'Auto get link discord nitro')
    await delay(1000)
    var jumlah = readline.question(`[ ${moment().format("HH:mm:ss")} ] ` + 'Mau berapa : ')
    for (var i = 0; i < jumlah; i++) {

        try {
            const indoName = await getName();
            var pass = `Airdropmaniac1#`;
            const list = ['getnada.com', 'abyssmail.com', 'dropjar.com', 'getairmail.com', 'tafmail.com', 'vomoto.com']
            const domain = list[Math.floor(Math.random() * list.length)];
            const email = indoName.firstName + indoName.lastName + `${randomize('0', 2)}` + '@' + domain;



            var browser = await puppeteer.launch({
                headless: true,
                ignoreHTTPSErrors: true,
                slowMo: 0,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-cache',
                    '--disable-application-cache',
                    '--disk-cache-size=0',
                    "--user-agent=" + randomUseragent.getRandom() + "",
                    '--disable-sync',
                    '--disable-accelerated-2d-canvas',
                    '--disable-sync',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu',
                    "--mute-audio"
                ]
            });

            const page = await browser.newPage()

            const ip = await page.goto("https://httpbin.org/ip", { waitUntil: 'domcontentloaded', timeout: 30000 })
            await delay(2000);
            const response = await ip.json();
            const json = response.origin
            console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `sedang menggunakan ip => ${json}`)


            await page.goto('https://www.toweroffantasy-global.com/', { waitUntil: 'domcontentloaded', timeout: 30000 })
            await delay(2000);
            console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Sedang mendaftar pake email ${email}`)
                //clicksignin
            await page.waitForSelector('#container > .top > .loginBtn > .btn > span')
            await page.click('#container > .top > .loginBtn > .btn > span')
            await delay(2000);

            //clickregister
            await page.waitForSelector('.top > .dialog > .main > .row > .register')
            await page.click('.top > .dialog > .main > .row > .register')
            await delay(2000);
            //isi email
            await page.waitForSelector('.top > .register > .main > .inputBox > input')
            await page.click('.top > .register > .main > .inputBox > input')
            await page.type('.top > .register > .main > .inputBox > input', email)
            await delay(2000);
            //send otp email
            await page.waitForSelector('.inputBox > .code > div > .active > b')
            await page.click('.inputBox > .code > div > .active > b')
            await delay(2000);

            await page.waitForSelector("button.onetrust-close-btn-handler.onetrust-close-btn-ui.banner-close-button.ot-close-icon")
            await page.click("button.onetrust-close-btn-handler.onetrust-close-btn-ui.banner-close-button.ot-close-icon")
            await delay(2000);
            //verif email
            let uuid;
            do {
                uuid = await functiongetuid(email);
                console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Menunggu code`)
            } while (!uuid);
            console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `link verif: https://getnada.com/api/v1/messages/html/${uuid}`)
            await delay(2000);

            const linkVerif = `https://getnada.com/api/v1/messages/html/${uuid}`
            const page2 = await browser.newPage()
            await page2.goto(linkVerif, { waitUntil: 'domcontentloaded', timeout: 30000 })
            await delay(2000);
            const extractedText = await page2.$eval('body > div > table > tbody > tr > td > table > tbody > tr:nth-child(4) > td > font', (el) => el.innerText);
            console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Your code is ${extractedText}`)
            const otp = extractedText;
            await delay(2000);
            await page2.close();

            //isi code email
            await page.waitForSelector('.dialog > .main > .inputBox > .code > input')
            await page.click('.dialog > .main > .inputBox > .code > input')
            await page.type('.dialog > .main > .inputBox > .code > input', otp)
            await delay(2000);
            //isi pass
            await page.waitForSelector('.dialog > .main > .passwordBox > .item:nth-child(1) > input')
            await page.click('.dialog > .main > .passwordBox > .item:nth-child(1) > input')
            await page.type('.dialog > .main > .passwordBox > .item:nth-child(1) > input', pass)
            await delay(2000);
            await page.waitForSelector('.dialog > .main > .passwordBox > .item:nth-child(2) > input')
            await page.click('.dialog > .main > .passwordBox > .item:nth-child(2) > input')
            await page.type('.dialog > .main > .passwordBox > .item:nth-child(2) > input', pass)
            await delay(2000);
            //klik setuju
            await page.waitForSelector('.top > .dialog > .main > .checkBox > .privacyAgreement')
            await page.click('.top > .dialog > .main > .checkBox > .privacyAgreement')
            await delay(2000);
            //submit
            await page.waitForSelector('#container > .top > .dialog > .main > .btn:nth-child(6)')
            await page.click('#container > .top > .dialog > .main > .btn:nth-child(6)')
            await delay(2000);
            console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Sukses daftar`)
                //gotologin
            const page3 = await browser.newPage()
            await page3.goto('https://www.toweroffantasy-global.com/login/?redirect_uri=https://www.toweroffantasy-global.com/collaboration/nitro/&lang=en', { waitUntil: 'domcontentloaded', timeout: 30000 })
                //input email
            await delay(5000);
            await page3.waitForSelector('input.form-input')
            await page3.click('input.form-input')
            await page3.type('input.form-input', email)
            await delay(2000);
            //input email
            await page3.waitForSelector('.form > .form-container > .form-cell > .form-input-box > .form-input--password')
            await page3.click('.form > .form-container > .form-cell > .form-input-box > .form-input--password')
            await page3.type('.form > .form-container > .form-cell > .form-input-box > .form-input--password', pass)
            await delay(2000);
            //Submit
            await page3.waitForSelector('.popup-login-step > .popup-login-content-bd > .form > .form-cell > .form-btn')
            await page3.click('.popup-login-step > .popup-login-content-bd > .form > .form-cell > .form-btn')
            await delay(5000);
            console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Sukses login`)
                //claim 
            await page3.waitForSelector('a#copy.btn-claim', { waitUntil: ["networkidle0", "domcontentloaded"] })
            await page3.click('a#copy.btn-claim')

            await delay(5000);
            const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
            await page3.click('a#go_to_page.btn-toPage')
            await delay(5000);
            const newPage = await newPagePromise;
            const url = await newPage.evaluate(() => document.location.href);
            console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Your link = ${url}`)
            console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Berhasil claim dan simpan`)
            await fs.appendFileSync("discord.txt", `${url}` + "\n");
            await delay(2000);
            await page3.close();
            await delay(2000);
            console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Sukses buat akun ke ${i}\n`)

            await delay(2000);
            await browser.close();

        } catch (e) {
            console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `GAGAL MENCOBA ULANG!`)
            await browser.close();
        }


    }
})();
