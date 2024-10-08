import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as htmlToImage from 'html-to-image';

const Card = ({ id, color1, color2, text, date, handleDeleteNote, writer }) => {

  // State for the like button and like count
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [translatedText, setTranslatedText] = useState('');

  // Toggle the like state and update like count
  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  // code for listen text speech
  const msg = new SpeechSynthesisUtterance();
  msg.text = text;
  const talk = () => {
    window.speechSynthesis.speak(msg);
  };

  // code for clipboard and toastify
  const handleCopyText = () => {
    navigator.clipboard.writeText(text).then(
      () =>
        toast('📋 Successfully Copied Text!', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }),
      (err) => alert('Error copying text')
    );
  };

  // code for share button
  const handleShareText = () => {
    if (navigator.share) {
      navigator
        .share({
          text: `${text}`,
          url: 'https://your-quotess.netlify.app/',
        })
        .then(() => {
          console.log('Thanks for sharing!');
        })
        .catch((err) => {
          console.log('Error while using Web share API:' + err);
        });
    } else {
      alert("Browser doesn't support this API!");
    }
  };

  // code for convert html to image
  const domEl = useRef(null);
  const downloadImage = async () => {
    const dataUrl = await htmlToImage.toPng(domEl.current);
    const link = document.createElement('a');
    link.download = 'your-quotes.png';
    link.href = dataUrl;
    link.click();
  };

  // code for translating text
  const translateText = async () => {
    const targetLang = prompt('Enter the target language code (e.g., "es" for Spanish):');
    if (!targetLang) return;

    try {
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
      const data = await response.json();
      const translatedText = data[0][0][0];
      setTranslatedText(translatedText);
      toast('🌐 Translation successful!', {
        position: 'top-center',
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Translation failed. Please try again.', {
        position: 'top-center',
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <div
        className="card"
        ref={domEl}
        style={{
          background: `linear-gradient(40deg, #${color1} -200%, #${color2} 150%)`,
        }}
      >
        
        <div className="text">
          <i className="fas fa-quote-left"></i>
          <span>{text}</span>
          <i className="fas fa-quote-right"></i>
        </div>
        {translatedText && (
          <div className="translated-text text">
            <i className="fas fa-language pr-2"></i>
            <span className='text-gray-500 underline'>{translatedText}</span>
          </div>
        )}
        <div className="footer-writer">
          <span>~ By {writer ? writer : 'Danish'}</span>
          <div className="footer">
            <small>
              <i className="fa-solid fa-calendar-day"></i>
              {date}
            </small>
            {/* Like Button with Like Count */}
            <div className="like-section">
                <div className="like-container flex items-center justify-center">
                  <span className="like-count text-sm">{likeCount} Likes</span>
                  <i
                    className={`fa-solid fa-heart ${liked ? 'liked' : ''}`}
                    onClick={handleLike}
                    style={{ color: liked ? 'red' : 'gray' }}
                    title="like"
                  ></i>
                </div>
              </div>
            <div className="footer-icon">
              <i className="fa-solid fa-download" onClick={downloadImage} title="download"></i>
              <i className="fa-solid fa-volume-up" onClick={talk} title="volume"></i>
              <i className="fa-solid fa-share" onClick={handleShareText} title="share"></i>
              <i className="fa-sharp fa-solid fa-copy" onClick={handleCopyText} title="copy"></i>
              <i className="fa-solid fa-language pr-2" onClick={translateText} title="translate"></i>
              <i
                className="fa-solid fa-trash"
                onClick={() => handleDeleteNote(id)}
                title="delete"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
