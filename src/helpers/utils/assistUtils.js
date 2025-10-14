import {Model} from "./constants";
import {CLAUDE_ASSIST_URL} from '../../../'

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
            return CLAUDE_ASSIST_URL;
        case Model.OpenAi:
            if (assistant) {
                return OPENAI_API_ASSIST_URL;
            } else {
                return OPENAI_API_CHAT_URL;
            }
            return null;
        case Model.Gemini:
            return GEMINI_ASSIST_URL;
        case Model.DeepSeek:
            return DEEPSEEK_ASSIST_URL;
        default:
            return OPENAI_API_CHAT_URL;
    }
}