/*eslint-disable*/
import React, { useRef, useState, useEffect } from 'react';

// 辅助函数：将 00:00:00 转为秒
function timeStrToSeconds(str) {
  if (!str) return 0;
  const parts = str.split(':').map(Number);
  if (parts.length !== 3) return 0;
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

const VideoClipPlayer = ({
  src = 'your-video.mp4',
  startTime = '00:00:05',
  endTime = '00:00:15'
}) => {
  const videoRef = useRef(null);
  const [start, setStart] = useState(startTime);
  const [end, setEnd] = useState(endTime);
  const [autoPaused, setAutoPaused] = useState(false);
  const [started, setStarted] = useState(false);

  // 当props变化时同步state
  useEffect(() => {
    setStart(startTime);
    setEnd(endTime);
  }, [startTime, endTime]);

  // 播放按钮点击事件
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = timeStrToSeconds(start) || 0;
      setAutoPaused(false); // 用户手动播放，允许继续播放
      videoRef.current.play();
    }
  };

  const handleContinuePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }

  // 到达结束时间自动暂停（只暂停一次，手动播放后不再自动暂停）
  const handleTimeUpdate = () => {
    if (started) {
      return
    }
    if (
      videoRef.current &&
      timeStrToSeconds(end) > 0 &&
      videoRef.current.currentTime >= timeStrToSeconds(end) &&
      !autoPaused
    ) {
      console.log(77766)
      videoRef.current.pause();
      setAutoPaused(true); // 标记为自动暂停
      setStarted(true);
    }
  };

  // 视频元数据加载后，自动跳到开始时间
  const handleLoadedMetadata = () => {
    if (
      videoRef.current &&
      timeStrToSeconds(start) < videoRef.current.duration
    ) {
      videoRef.current.currentTime = timeStrToSeconds(start);
    }
  };

  // 用户手动点击video的播放按钮时，允许继续播放
  const handleManualPlay = () => {
    setAutoPaused(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '30px' }}>
      <video
        ref={videoRef}
        width="500"
        controls
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={handleManualPlay}
        style={{ display: 'block' }}
      >
        您的浏览器不支持 video 标签。
      </video>
      <div style={{ marginTop: 10 }}>
        {/* <label>
          开始时间（00:00:00）:
          <input
            type="text"
            value={start}
            onChange={e => setStart(e.target.value)}
            style={{ width: 90, marginRight: 10 }}
            placeholder="00:00:00"
          />
        </label>
        <label>
          结束时间（00:00:00）:
          <input
            type="text"
            value={end}
            onChange={e => setEnd(e.target.value)}
            style={{ width: 90, marginRight: 10 }}
            placeholder="00:00:00"
          />
        </label> */}
        {/* <button onClick={handlePlay} style={{ marginLeft: 10 }}>
          从指定时间播放
        </button>
        <button onClick={handleContinuePlay} style={{ marginLeft: 10 }}>
          继续播放
        </button> */}
      </div>
    </div>
  );
};

export default VideoClipPlayer;