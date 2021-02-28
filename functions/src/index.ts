import * as functions from "firebase-functions";
import { launch } from "puppeteer"
import { isWebUri } from "valid-url"


const runtimeOpts: { timeoutSeconds: number } = {
    timeoutSeconds: 500,
}

export const helloWorld = functions.runWith(runtimeOpts).https.onRequest(async (request, response) => {

    const url = request.body.url

    if (!isWebUri(url)) {
        response.json({ sucess: false, message: "invalid url please enter the url in the following format http://www.example.com" })
    }

    const browser = await launch()

    try {
        const page = await browser.newPage()
        await page.goto(url)
        await page.waitForTimeout(300)

        const title = await page.title()
        await page.screenshot({ path: `screens/${title}.png`, fullPage: true })

        await browser.close()
    } catch (err) {
        response.json({ sucess: false, message: "An Error has occured", error: err })
    }

    response.json({ success: true })
});
