import axios from 'axios';

async function GenerateImage(prompt) {
    try {
        const response = await axios.post(
            process.env.OPENAI_API_IMAGE,
            {
                prompt: prompt,
                n: 1,
                size: "1024x1024"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );

        const imageUrl = response.data.data[0].url;
        console.log(response.data);
        console.log("Generated Image URL:", imageUrl);
        return imageUrl;
    } catch (error) {
        console.error('Error generating image:', error);
    }
}

export default GenerateImage;