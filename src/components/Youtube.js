/**
 * Show embedded youtube video
 * @param src - Use embed youtube url. e.g. https://www.youtube.com/embed/DjhW4nywf5o
 * @returns {JSX.Element}
 * @constructor
 */
const Youtube = ({src}) => {
  return (

    <iframe src={src} style={{width: "100%", aspectRatio: "16/9"}}
            title="YouTube video player" frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen></iframe>
  );
};

export default Youtube;