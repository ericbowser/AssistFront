import axios from 'axios';

async function GenerateImage(prompt) {
    try {
        const response = await axios.post(
            process.env.OPENAI_API_IMAGE,
            {
                prompt: prompt,
/*
                n: 1,
                size: "1024x1024"
*/
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        console.log("Generated Image URL:", response);
        return await response.data.image;
    } catch (error) {
        console.error('Error generating image:', error);
    }
}

export default GenerateImage;