import React from 'react';
import { Carousel } from 'antd';

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

const App: React.FC = () => {
  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  return (
    <Carousel afterChange={onChange}>
      <div>
        <h3 style={contentStyle}>Banner 1</h3>
      </div>
      <div>
        <h3 style={contentStyle}>Banner 2</h3>
      </div>
      <div>
        <h3 style={contentStyle}>Banner 3</h3>
      </div>
      <div>
        <h3 style={contentStyle}>Banner 4</h3>
      </div>
    </Carousel>
  );
};

export default App;