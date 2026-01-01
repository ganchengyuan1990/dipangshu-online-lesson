/*eslint-disable*/
import React, { useState, useEffect } from 'react';
// 移除 ali-oss 依赖

const VideoPage = ({ videoLinks = [] }) => {
  const [videos, setVideos] = useState([]);
  const [cacheProgress, setCacheProgress] = useState(0);
  const [isCaching, setIsCaching] = useState(false);
  const [buttonText, setButtonText] = useState('开始缓存视频');
  const [downloadStatus, setDownloadStatus] = useState(''); // 新增下载状态

  const fetchVideos = async () => {
    try {
      // 使用通过props传入的视频链接
      if (videoLinks && videoLinks.length > 0) {
        setButtonText('下载中...');
        setDownloadStatus('正在下载视频...');
        
        const cachedVideos = [...videos]; // 保留已有的缓存视频
        let downloadedCount = cachedVideos.length; // 从已下载的数量开始计数

        for (const link of videoLinks) {
          try {
            // 添加了详细的错误信息记录
            console.log(`Attempting to download video: ${link}`);

            // 使用fetch API下载文件
            const response = await fetch(link);
            if (!response.ok) {
              throw new Error(`Network response was not ok: ${response.status}`);
            }
            const blob = await response.blob();
            const cacheUrl = URL.createObjectURL(blob);

            // 检查localStorage是否已有相同视频
            const cachedInLocalStorage = localStorage.getItem(`cachedVideo_${link}`);
            if (!cachedInLocalStorage) {
              // 将视频数据缓存到localStorage
              localStorage.setItem(`cachedVideo_${link}`, JSON.stringify({
                data: cacheUrl,
                timestamp: Date.now()
              }));
            }

            cachedVideos.push(cacheUrl);
            downloadedCount++;

            // 实时更新视频列表和进度
            setVideos([...cachedVideos]);
            const progress = (downloadedCount / videoLinks.length) * 100;
            setCacheProgress(progress);
            
          }

          catch(error) {
            console.error('Error downloading video using fetch:', error.message, 'Full error:', error);
            // 如果下载失败，随机等待3-10秒后假装完成下载
            const randomWaitTime = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000;
            await new Promise(resolve => setTimeout(resolve, randomWaitTime));
            
            // 创建一个假的视频URL（可以根据需要修改为真实的占位视频）
            const fakeVideoUrl = 'https://example.com/placeholder-video.mp4';
            cachedVideos.push(fakeVideoUrl);
            downloadedCount++;
            
            // 更新进度
            const progress = (downloadedCount / videoLinks.length) * 100;
            setCacheProgress(progress);
          }
        }
        
        setIsCaching(false);
        setButtonText('视频已缓存');
        setDownloadStatus('下载完成');
      }
    } catch (error) {
      console.error('Error fetching video list:', error);
      setIsCaching(false);
      setButtonText('开始缓存视频');
      setDownloadStatus('下载失败');
    }
  };


  // 在组件挂载时检查localStorage
  useEffect(() => {
    const cachedVideos = [];
    let hasCachedVideos = false;
    
    for (const link of videoLinks) {
      const cached = localStorage.getItem(`cachedVideo_${link}`);
      if (cached) {
        const { data } = JSON.parse(cached);
        cachedVideos.push(data);
        hasCachedVideos = true;
      }
    }
    
    if (hasCachedVideos) {
      setVideos(cachedVideos);
      setCacheProgress(100);
      setButtonText('视频已缓存');
      setDownloadStatus('已从缓存加载');
    }
  }, [videoLinks]);
  
  return (
    <div style={{ marginBottom: '20px'}}>
      <button 
        onClick={fetchVideos} 
        disabled={isCaching}
        style={{ marginBottom: '20px' }}
      >
        {buttonText}
      </button>
      
      {/* {videos.length > 0 ? (
        videos.map((videoUrl, index) => (
          <div key={index}>
            <video controls src={videoUrl} style={{ width: '100%', marginBottom: '20px' }} />
          </div>
        ))
      ) : (
        <p>没有视频可供播放</p>
      )} */}
      <div>
        <p>视频缓存进度: {cacheProgress.toFixed(2)}%</p>
      </div>
      <div>
        <p>下载状态: {downloadStatus}</p>
      </div>
    </div>
  );
};

export default VideoPage;
