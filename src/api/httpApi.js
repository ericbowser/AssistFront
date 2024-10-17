import axios from 'axios';

async function get(url, params = {}) {
    try {
        const response = await axios(url, params);
        console.log('axios response: ', response);
        return response;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const markdown = `
  # My Awesome Blog Post

  Welcome to my first blog post! In this post, I'll be discussing the importance of learning Markdown for writing content on the web.

  ## What is Markdown?

  Markdown is a lightweight markup language with plain-text formatting syntax. It allows you to write using an easy-to-read, easy-to-write plain text format, then convert it to structurally valid HTML. Markdown is often used for formatting readme files, writing messages in online discussion forums, and creating rich text using a plain text editor.

  ## Why Learn Markdown?

  - **Simplicity**: Markdown syntax is straightforward and easy to learn. You don't need to be a coding expert to use it effectively.
  - **Versatility**: Markdown can be used for various purposes, including writing blog posts, creating documentation, and formatting messages.
  - **Compatibility**: Markdown is supported by many platforms and applications, making it a universal choice for content creation.
  - **Efficiency**: Writing in Markdown can speed up your workflow, as it allows you to focus on content creation without worrying too much about formatting.
`;

function transformToMarkup(text) {
    
}

async function post(url, data = {}) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log('POST body', data);
    
    try {
        const response = await axios.post(url, {...data});
        if (response?.status === 200) {
            const content = await response;
            console.log('response: ', content);
            if(content) {
                const response = {
                    status: 200,
                    answer: content.data.answer,
                    thread: content.data.thread,
                    vectors: content.data.vectors
                };
                console.log('response', response);
                return response;
            } else {
                return null;
            }
        } else {
           console.error(response);
           return null;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export {get, post};