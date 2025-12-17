// "use client"

// import React from 'react';
// import Draggable from 'react-draggable';

// interface CornerDraggerProps {
//     point: { id: number, x: number, y: number };
//     onStop: (data: any) => void;
// }

// // 🛑 IMPORTANT: 'react-draggable' MUST be inside a 'use client' file.
// export default function CornerDragger({ point, onStop }: CornerDraggerProps) {
//     return (
//         <Draggable
//             defaultPosition={{ x: point.x, y: point.y }}
//             position={{ x: point.x, y: point.y }}
//             onStop={(e, data) => onStop(data)}
//             bounds="parent" // Keeps the corner marker within the container
//         >
//             <div className="absolute w-6 h-6 bg-red-600 rounded-full cursor-grab border-4 border-white shadow-xl -ml-3 -mt-3 z-20 transition-colors hover:bg-red-700" />
//         </Draggable>
//     );
// }