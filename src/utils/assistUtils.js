import {Model} from "./constants";

export function decideUrl(askingAi, assistant) {
    switch (askingAi) {
        case Model.Claude:
            return process.env.CLAUDE_ASSIST_URL;
        case Model.OpenAi:
            const assistUrl = assistant === 'checked'
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