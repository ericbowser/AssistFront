import {Model} from "./constants";

export function isValidUrl(url) {
    const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!urlPattern.test(url);
}

export function decideUrl(askingAi, assistant) {
    switch (askingAi) {
        case Model.Claude:
            return process.env.CLAUDE_ASSIST_URL;
        case Model.OpenAi:
            const assistUrl = assistant === true
                ? process.env.OPENAI_ASSIST_URL
                : process.env.OPENAI_CHAT_URL;
            console.log('url', assistUrl);
            return assistUrl;
        case Model.Gemini:
            console.log('Gemini Url: ', process.env.GEMINI_ASSIST_URL);
            return process.env.GEMINI_ASSIST_URL;
        default:
            console.log('Default: ', process.env.OPENAI_ASSIST_URL);
            return process.env.OPENAI_ASSIST_URL;
    }
}