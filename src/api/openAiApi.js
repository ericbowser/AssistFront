import axios from 'axios';

async function GenerateImage(prompt) {
    try {
        const response = await axios.post(
            'http://localhost:32636/generateImage',
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

        const imageUrl = response.data.imageUrl;
        console.log("Generated Image URL:", imageUrl);
        return imageUrl;
    } catch (error) {
        console.error('Error generating image:', error);
    }
}

export default GenerateImage;