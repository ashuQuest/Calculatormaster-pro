import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Calculator, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { CATEGORIES, CALCULATORS_CATALOG } from '../calculators/registry';

export default function CalculatorsDirectory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const queryParam = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [filterType, setFilterType] = useState('all'); // 'all', 'free', 'pro'

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const filteredList = useMemo(() => {
    return CALCULATORS_CATALOG.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Type filter
      if (filterType === 'free' && item.isPremium) return false;
      if (filterType === 'pro' && !item.isPremium) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesTags = item.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }
      return true;
    });
  }, [activeCategory, searchQuery, filterType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Calculator Directory</h1>
        <p className="text-sm text-slate-400 mt-1">Browse all 40+ specialized tools across mathematics, finance, and science.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, tag, or formula..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-sky-500 text-white text-xs placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* Free vs Pro Pill Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterType === 'all' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            All ({CALCULATORS_CATALOG.length})
          </button>
          <button
            onClick={() => setFilterType('free')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterType === 'free' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Free Basic
          </button>
          <button
            onClick={() => setFilterType('pro')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterType === 'pro' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white'}`}
          >
            Pro Premium
          </button>
        </div>

      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === 'all' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
        >
          All Categories
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === cat.id ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Calculators Grid */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredList.map(calc => (
            <Link
              key={calc.id}
              to={`/calculator/${calc.id}`}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/60 hover:bg-slate-850/80 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Calculator className="w-5 h-5" />
                  </div>
                  {calc.isPremium ? (
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      PRO
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                      FREE
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-sky-400 transition-colors">
                  {calc.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {calc.description}
                </p>

                <div className="mt-3 text-[10px] text-slate-500 font-mono bg-slate-950/60 px-2 py-1 rounded-md border border-slate-800/80 truncate">
                  {calc.formula}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-sky-400">
                <span>Calculate Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-slate-900 border border-slate-800">
          <Calculator className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No calculators found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or reset the filters to discover available tools.
          </p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); setFilterType('all'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
