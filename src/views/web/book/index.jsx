
/*eslint-disable*/
import React, { useState, useRef, useEffect } from 'react';
import axios from '@/utils/axios'
import './index.less';


const BookComponent = ({ pages }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [direction, setDirection] = useState('next');
  const containerRef = useRef(null);

  const handlePrevPage = () => {
    if (currentPage > 0 && !isAnimating) {
      setIsAnimating(true);
      setDirection('prev');
      setTimeout(() => {
        handleAnimationEnd();
      }, 500);
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setDirection('next');
      setCurrentPage(prev => {
        const nextPage = prev + 1;
        setTimeout(() => {
          handleAnimationEnd();
        }, 500);
        if (nextPage === pages.length) {
          setIsEnded(true);
        }
        return nextPage;
      });
    }
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

const renderContent = (page) => {
  switch (page.type) {
    case 'text':
      return <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: page.content }} />;
    case 'image':
      return (
        <div className="media-container">
          <div className="media-prefix">{page.prefix}</div>
          <img 
            src={page.content} 
            alt="book content" 
            onClick={toggleFullscreen}
            className="book-media"
          />
          <div className="media-suffix" dangerouslySetInnerHTML={{ __html: page.suffix }}></div>
          {isFullscreen && (
            <div className="fullscreen-overlay">
              <img 
                src={page.content} 
                alt="fullscreen content"
                onClick={toggleFullscreen}
              />
            </div>
          )}
        </div>
      );
    case 'video':
      return (
        <div className="media-container">
          <div className="media-prefix" dangerouslySetInnerHTML={{ __html: page.prefix }}></div>
          <video 
            src={page.content} 
            controls 
            onClick={toggleFullscreen}
            className="book-media"
          />
          <div className="media-suffix" dangerouslySetInnerHTML={{ __html: page.suffix }}></div>
          {isFullscreen && (
            <div className="fullscreen-overlay">
              <video 
                src={page.content} 
                controls 
                onClick={toggleFullscreen}
                className="fullscreen-video"
              />
            </div>
          )}
        </div>
      );
    default:
      return null;
  }
};

  return (
    <div className="book-container" ref={containerRef}>
      <div className="book-page">
        <div 
          className={`page-content ${isAnimating ? 
            (direction === 'next' ? 'slide-enter slide-enter-active' : 'slide-exit slide-exit-active') : 
            ''}`} 
          onAnimationEnd={handleAnimationEnd}
        >
          {isEnded ? (
            <div className="end-page">
              <h2>感谢阅读</h2>
              <p>内容已结束</p>
            </div>
          ) : (
            <div>
              {renderContent(pages[currentPage])}
            </div>
          )}
        </div>
      </div>
      
      <div className="navigation">
        <button 
          onClick={handlePrevPage} 
          disabled={currentPage === 0 || isAnimating}
          className="nav-button prev"
        >
          上一页
        </button>
        <span className="page-number">{`${currentPage + 1} / ${pages.length}`}</span>
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === pages.length - 1 || isAnimating}
          className="nav-button next"
        >
          下一页
        </button>
      </div>
    </div>
  );
};

export default () => {
  const [pages, setPages] = useState([]);
  useEffect(() => {
    const getProcessedUrl = async (aliyunUrl) => {
      try {
        const response = await axios.post('https://www.coffeebeats.cn/getAliOssFileUrl', {
          fileName: aliyunUrl.split('com/')[1]
        });
        return response.url;
      } catch (error) {
        console.error('Error fetching URL:', error);
        return aliyunUrl; // 如果请求失败，返回原始URL
      }
    };

    axios.get(`https://www.coffeebeats.cn/getOnlineBookById?id=${1}`).then(async res => {
       const aaa = res.resultLists || [];
        if (aaa && aaa[0].content) {
          const videoTableData = JSON.parse(aaa[0].content)
          // this.form = aaa[0];
          
          // 使用Promise.all处理所有元素
          const processedData = await Promise.all(videoTableData.map(async e => {
            const processedUrl = await getProcessedUrl(e.param.aliyunUrl);
            return { 
              type: 'video', 
              content: processedUrl,
              suffix: e.content,
            };
          }));

          const concatVideo = await getProcessedUrl(aaa[0].concatVideo);
          
          processedData.unshift(
            { 
              type: 'video', 
              prefix: `<div style='font-size:28px'>欢迎阅读电子书</div>《${aaa[0].name}》`,
              content: concatVideo,
            }
          )

          console.log(processedData, '==this.videoTableData==')
          
          setPages(processedData);
        }
    })
  }, []);

  if (!pages?.length) {
    return <div className="loading">加载中...</div>;
  }

  // const pages = [
  //   { 
  //     type: 'text', 
  //     content: '<div>欢迎阅读电子书</div>sdsdsdsdsdsds' 
  //   },
  //   { 
  //     type: 'image', 
  //     content: 'https://www.coffeebeats.cn/uploads/1758784804484-%E6%B8%B8%E5%88%83%E6%9C%89%E2%80%9C%E9%B1%BC%E2%80%9D%E7%AC%94.JPG',
  //     prefix: '图片说明：这是示例图片的前置说明文字',
  //     suffix: '图片说明：这是示例图片的后置说明文字'
  //   },
  //   { 
  //     type: 'video', 
  //     content: 'https://www.coffeebeats.cn/uploads/1723447312918-%E7%94%A8%E8%A7%92%E5%BA%A6%E5%B0%BA%E8%BF%9B%E8%A1%8C%E7%89%B9%E6%AE%8A%E8%A7%92%E5%BA%A6%E6%B1%82%E8%A7%92.mp4',
  //     prefix: '视频说明：这是示例视频的前置说明文字',
  //     suffix: '视频说明：这是示例视频的后置说明文字'
  //   }
  // ];
  return <BookComponent pages={pages}/>
};
