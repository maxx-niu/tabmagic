import React from 'react';

const About = () => {
  return (
    <div className="about-container">
      <h3>What is this?</h3>
      <p>Oftentimes, learning by tabs doesn't make many beginner-intermediate guitar players understand what they're playing. Tab Magic is a companion designed analyze and annotate guitar tablature. It provides you information about the piece outside of what strings to fret, such as the chord progressions you're playing, as well as indicating what key the piece is in and alternative ways to play, should you need them.</p>
      <h3>How do I use this?</h3>
      <p>Simply upload a PDF of your favorite tabs, indicate the tuning, declare whether the tabs include rhythmic notation or not, and we'll take care of the rest! For best results, please ensure the PDF is legible and preferably made with professional music notation software</p>
      <p>Note: support for &gt;6 string guitars is not currently supported</p>
    </div>
  );
}

export default About;