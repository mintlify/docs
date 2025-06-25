const MintlifyIframe = ({ iframeUrl }) => {
  return (
    <div className="w-full h-48">
      <iframe src={iframeUrl} className="w-full h-full rounded-lg" />
    </div>
  )
}

export default MintlifyIframe;