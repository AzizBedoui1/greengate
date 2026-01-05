const Dashboard = () => {
  const finalUrl = "https://app.powerbi.com/reportEmbed?reportId=7abaa820-2fef-4c89-a737-da9ecf0817e4&autoAuth=true&embeddedDemo=true&filterPaneEnabled=false&navContentPaneEnabled=false&actionBarEnabled=false";

  const containerStyle = {
    width: '100%',
    height: '83vh',      
    overflow: 'hidden',  
    position: 'relative',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    backgroundColor: '#fff'
  };

  const iframeStyle = {
    position: 'absolute',
    top: '-40px',       
    left: '-15px',        
    width: '100%', 
    height: 'calc(100% + 46px)', 
    border: 'none'
  };

  return (
    <div >
      <div style={containerStyle}>
        <iframe 
          title="greengate" 
          src={finalUrl} 
          style={iframeStyle}
          allowFullScreen={true}>
        </iframe>
      </div>
    </div>
  );
};

export default Dashboard;