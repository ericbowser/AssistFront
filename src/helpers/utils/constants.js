const Model = {
    OpenAi: 'OpenAi',
    Gemini: 'Gemini',
    Claude: 'Claude',
    DeepSeek: 'DeepSeek',
    DALLE_2: 'dall-e-2',
    DALLE_3: 'dall-e-3'
}

const ImageSize = {
    small: '256x256',
    medium: '512x512',
    large: '1024x1024',
    extraWidth: '1792x1024',
    extraHeight: '1024x1792',
}

const QualityOptions = {
    Standard: 'Standard',
    Hd: 'Hd'
}

const Lang = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Ruby',
    'Go',
    'Java',
    'PHP',
    'C',
    'CPlusPlus',
    'CSharp',
    'Swift',
    'Kotlin',
    'HTML',
    'CSS',
    'SQL',
    'Bash',
    'JSON',
    'XML',
    'Markdown',
    'YAML'
];

export {Lang, Model, ImageSize};