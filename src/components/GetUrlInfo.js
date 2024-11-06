import React, {useEffect, useState} from "react";
import {postUrlData} from "../api/httpApi";
import {isValidUrl} from "../utils/assistUtils";
import background from './circle-scatter-haikei.svg'

console.log(process.env.GETFILEINFO_URL);

function GetUrlInfo() {
    const [urls, setUrls] = useState([]);
    const [url, setUrl] = useState(null);
    const [content, setContent] = useState(null);

    const [loading, setIsLoading] = useState(false);
    const [error, setHasError] = useState(false);

    const parseUrls = (urls = []) => {
        let validUrls = [];
        urls.forEach(url => {
            if (isValidUrl(url)) {
                validUrls.push(url);
            }
        })

        return validUrls;
    }

    const getUrlData = async () => {
        try {
            if (isValidUrl(url)) {
                setIsLoading(true);
                const response = await postUrlData(process.env.GETFILEINFO_URL, {url});
                if (response.status === 200) {
                    // const validUrls = parseUrls(links);
                    setUrls(response.urls);
                    setContent(response.content);
                    setIsLoading(false);
                    return response.links;
                }
                return null;
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    useEffect(() => {
    }, [urls, loading, error, url]);

    async function handleSubmit(e) {
        e.preventDefault();
        const urls = await getUrlData();
        console.log('urls: ', urls);
    }

    return (
      <div className={'h-screen w-screen bg-cover bg-center text-white text-2xl'}
           style={{backgroundImage: `url(${background})`}}>
          <div>
                <form className={'p-20'}>
                    <label className={'px-3'} htmlFor={'url'} id={'url'} title={'url'}>
                        Input crawl url:
                    </label>
                    <input type="text"
                           className={'text-black '}
                           value={url}
                           size={50}
                           placeholder={'Url'}
                           onChange={e => setUrl(e.target.value)}/>
                    {urls && urls.length > 0 &&
                      <div>
                            {urls.map((url, index) => {
                                return (
                                  <div key={`${url}${index}`}>
                                      <a href={url}>
                                          {url}
                                      </a>
                                  </div>
                                )
                            })
                            }
                        </div>
                    }
                    <div>
                        <button
                            className={'rounded-md text-black border-black border-2 bg-info shadow-xl shadow-amber-900 p-2 m-20'}
                            type={'submit'}
                            onClick={(e) => handleSubmit(e)}>
                            <span className={'text-md-center'}>Fetch Results</span>
                        </button>

                    </div>
                </form>
            </div>
      </div>
    )
}

export default GetUrlInfo;
