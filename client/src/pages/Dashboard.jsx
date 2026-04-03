import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import OpportunityCard from '../components/OpportunityCard';
import { Search, Filter, Compass } from 'lucide-react';

const Dashboard = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState(''); // 'hackathon' or 'internship'
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMode, setFilterMode] = useState(''); // 'Online' or 'Offline'
  const [search, setSearch] = useState('');
  
  const { user } = useContext(AuthContext);

  const categories = ['AI', 'Web Dev', 'Data Science', 'Cybersecurity', 'Blockchain', 'UI/UX'];

  useEffect(() => {
    fetchOpportunities();
  }, [filterType, filterCategory, filterMode, search]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      let queryUrl = `https://smart-internship-alert.onrender.com/api/opportunities`;
      if (filterType) queryUrl += `type=${filterType}&`;
      if (filterCategory) queryUrl += `category=${filterCategory}&`;
      if (filterMode) queryUrl += `mode=${filterMode}&`;
      if (search) queryUrl += `search=${search}`;
      
      const res = await axios.get(queryUrl);
      setOpportunities(res.data);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (id) => {
    // Only update local UI if needed, actual state is saved in backend via component
    // We could refetch user data here to keep it perfectly synced
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center">
            <Compass className="w-8 h-8 mr-3 text-primary" />
            Discover Opportunities
          </h1>
          <p className="text-slate-600">Find the best internships and hackathons tailored for you.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search titles or companies..."
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      {/* Filters */}
      <div className="glass-light rounded-xl p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center shadow-sm">
        <div className="flex items-center text-slate-700 font-medium mr-2">
          <Filter className="w-5 h-5 mr-2 text-slate-500" />
          Filters:
        </div>
        
        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
          <button 
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === '' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-900'}`}
            onClick={() => setFilterType('')}
          >
            All
          </button>
          <button 
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'internship' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-900'}`}
            onClick={() => setFilterType('internship')}
          >
            Internships
          </button>
          <button 
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'hackathon' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-900'}`}
            onClick={() => setFilterType('hackathon')}
          >
            Hackathons
          </button>
        </div>
        
        <select 
          className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg py-2 px-4 focus:ring-primary focus:border-primary outline-none shadow-sm"
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value)}
        >
          <option value="">Any Mode</option>
          <option value="Online">Online / Remote</option>
          <option value="Offline">Offline / In-person</option>
        </select>

        <select 
          className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg py-2 px-4 focus:ring-primary focus:border-primary outline-none shadow-sm"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Compass className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">No opportunities found</h3>
          <p className="text-slate-500">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map(opp => (
            <OpportunityCard 
              key={opp._id} 
              opp={opp} 
              isBookmarked={user?.bookmarkedOpportunities?.includes(opp._id)}
              onBookmarkToggle={toggleBookmark}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default Dashboard;
