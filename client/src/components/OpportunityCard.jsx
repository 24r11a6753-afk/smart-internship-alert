import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import axios from 'axios';

const OpportunityCard = ({ opp, isBookmarked, onBookmarkToggle }) => {
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(opp.deadline) - new Date();
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        setTimeLeft(`${days}d ${hours}h left`);
      } else {
        setTimeLeft('Expired');
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 3600000); // Update every hour
    return () => clearInterval(timer);
  }, [opp.deadline]);

  const handleBookmark = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://smart-internship-alert.onrender.com/api/ai/bookmarks`, {OpportunityId:opp._id}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onBookmarkToggle(opp._id);
    } catch (err) {
      console.error('Error bookmarking:', err);
    }
  };

  const getCategoryColor = (category) => {
    switch(category?.toLowerCase()) {
      case 'ai': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'web dev': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'data science': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="glass-light bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 group relative overflow-hidden">
      {/* Type badge (Hackathon vs Internship) */}
      <div className="absolute top-0 right-0 bg-gradient-to-l from-primary/90 to-primary-hover/90 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl backdrop-blur-sm shadow-md capitalize">
        {opp.type}
      </div>

      <div className="flex justify-between items-start mb-4 pr-16">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight group-hover:text-primary transition-colors">
            {opp.title}
          </h3>
          <p className="text-slate-600 font-medium">{opp.company}</p>
        </div>
        
        <button 
          onClick={handleBookmark}
          className={`p-2 rounded-lg transition-colors ${
            isBookmarked 
              ? 'text-yellow-500 bg-yellow-500/10' 
              : 'text-slate-400 hover:text-primary hover:bg-primary/10'
          }`}
        >
          {isBookmarked ? <BookmarkCheck className="w-6 h-6" /> : <Bookmark className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getCategoryColor(opp.category)}`}>
          {opp.category}
        </span>
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border flex items-center ${
          opp.mode === 'Online' 
            ? 'bg-primary/10 text-primary border-primary/20' 
            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
        }`}>
          {opp.mode === 'Online' ? '🌍 Online' : '🏢 Offline'}
        </span>
        {opp.isFeatured && (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold border bg-yellow-500/20 text-yellow-500 border-yellow-500/30 flex items-center justify-center">
            Featured
          </span>
        )}
      </div>
      
      <p className="text-slate-600 text-sm mb-6 line-clamp-2">
        {opp.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center text-slate-600 text-sm bg-amber-50/50 p-2 rounded-lg border border-amber-200/80">
          <Calendar className="w-4 h-4 mr-2 text-primary" />
          <span className="truncate">{new Date(opp.deadline).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-sm bg-amber-50/50 p-2 rounded-lg border border-amber-200/80">
          <Clock className={`w-4 h-4 mr-2 ${timeLeft === 'Expired' ? 'text-red-500' : 'text-orange-500'}`} />
          <span className={`font-medium ${timeLeft === 'Expired' ? 'text-red-500' : 'text-orange-500'}`}>
            {timeLeft}
          </span>
        </div>
        <div className="col-span-2 flex items-center text-slate-600 text-sm bg-amber-50/50 p-2 rounded-lg border border-amber-200/80">
           <MapPin className="w-4 h-4 mr-2 text-primary" />
           <span className="truncate">{opp.location || 'Remote'}</span>
        </div>
      </div>

      <a 
        href={opp.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center bg-primary hover:bg-primary-hover text-white font-medium py-2.5 px-4 rounded-xl transition-colors shadow-lg shadow-primary/20"
      >
        Apply Now
        <ExternalLink className="w-4 h-4 ml-2" />
      </a>
    </div>
  );
};

export default OpportunityCard;
