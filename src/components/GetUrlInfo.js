import React, {useEffect, useState} from "react";
import {postUrlData} from "../api/httpApi";
import {isValidUrl} from "../utils/assistUtils";
import background from "../assets/circle-scatter-haikei.svg";

const getFileInfoUrl = 'http://localhost:32628/api/getUrlInfo';

function GetUrlInfo() {
  const [urls, setUrls] = useState(null);
  const [url, setUrl] = useState(null);
  const [content, setContent] = useState(null);

  const [loading, setIsLoading] = useState(false);
  const [error, setHasError] = useState(false);

  useEffect(() => {
  }, [urls, loading, error, url]);

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
        const response = await postUrlData(getFileInfoUrl, {url});
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


  const getUrls = () => {
    return getUrlData().then(urls => {
      console.log('urls returned from httprequest poin: ', urls);
      setUrls(urls)
      return urls;
    });
  }

  return (
    <div className={'h-screen w-screen bg-cover bg-center text-white text-2xl'}
         style={{backgroundImage: `url(${background})`}}>
      <div className={'bg-cover h-screen w-screen text-white text-2xl'}>
        <form className={'p-20'}>
          <label className={'px-3'} htmlFor={'url'} id={'url'} title={'url'}>
            Input crawl url:
          </label>
          <input type="text"
           className={'text-black'}
           value={url}
           size={50}
           placeholder={'Url'}
           onChange={e => setUrl(e.target.value)}/>
          <br/>
          <textarea className={'w-75 h-full'}>
            {urls && urls.length > 0 &&
              <div>
                {
                  urls.map((url, index) => {
                    return (
                      <a href={url} target='_blank' key={index}>
                        <p>

                          {url}
                        </p>
                      </a>
                    )
                  })
                }
              </div>
            }
            </textarea>
          <div>
            <button
              className={'rounded-md text-black border-black border-2 bg-info shadow-xl shadow-amber-900 p-2 m-20'}
              type={'submit'}
              onClick={() => getUrls().then(urls => console.log(urls.length))}>
              <span className={'text-md-center'}>Fetch Results</span>
            </button>

          </div>
        </form>
      </div>
    </div>
  )
}

export default GetUrlInfo;
