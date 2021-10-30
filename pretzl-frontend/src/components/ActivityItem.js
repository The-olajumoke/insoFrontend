import React from 'react'

function ActivityItem({height}) {
    // const newheight = `${height *0.55}px `;
    const newheight = `${height *50}px `;
    return (
        <div 
        style={{height:`${newheight}`}}
        className=" actItem" >
       <h3>{height}</h3>
        </div>
    )
}

export default ActivityItem