import React from 'react';

export default function Shell({children, className, ...other}){
   return (
       <div style={{background: 'linear-gradient(to right top, #35506e, #2E3742)'}} {...other}>
       {children}
       </div>
   );
  }
  