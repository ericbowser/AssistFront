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

export function decideUrl(askingAi, assistant = false) {
    switch (askingAi) {
        case Model.Claude:
            return process.env.CLAUDE_ASSIST_URL;
        case Model.OpenAi:
            if (assistant) {
                console.info('Assistant api will be called')
                return process.env.OPENAI_API_ASSIST_URL;
            } else {
                return process.env.OPENAI_API_CHAT_URL;
            }
            console.error('No choices were made which is not right');
            return null;
        case Model.Gemini:
            return process.env.GEMINI_ASSIST_URL;
        case Model.DeepSeek:
            console.log('Asking DeepSeek')
            return process.env.DEEPSEEK_ASSIST_URL;
        default:
            console.log('Default: ', process.env.OPENAI_API_CHAT_URL);
            return process.env.OPENAI_API_CHAT_URL;
    }
}