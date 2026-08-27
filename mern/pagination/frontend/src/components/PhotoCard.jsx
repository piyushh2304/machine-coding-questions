import React from 'react';

// Wrapping the component in React.memo() memoizes the result. 
// It will only re-render if the 'photo' prop actually changes.
const PhotoCard = React.memo(({ photo }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 group">
      <img 
        src={photo.download_url} 
        alt={`Taken by ${photo.author}`} 
        className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="p-4 bg-gray-50 flex flex-col border-t border-gray-100">
        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Photographer</span>
        <span className="text-sm font-bold text-gray-700 truncate">{photo.author}</span>
      </div>
    </div>
  );
});

export default PhotoCard;
