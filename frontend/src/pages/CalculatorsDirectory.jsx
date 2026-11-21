import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Sparkles, ArrowRight, Calculator, Check, ArrowUpRight } from 'lucide-react';
import { CALCULATORS_CATALOG, CATEGORIES } from '../calculators/registry';
import { useAuth } from '../context/AuthContext';

// Normalize URL slug to registry category id
const normalizeCategory = (slug) => {
  if (!slug || slug === 'all') return 'all';
  const clean = slug.toLowerCase().replace(/_/g, '-');
  if (clean === 'mathematics' || clean === 'math') return 'mathematical';
  if (clean === 'date-time' || clean === 'date_time') return 'datetime';
  if (clean === 'daily-life' || clean === 'daily_life' || clean === 'health') return 'dailylife';
  return clean;
};

export default function CalculatorsDirectory() {
  const { category: routeCategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeCategory = useMemo(() => {
    if (routeCategory) return normalizeCategory(routeCategory);
    return normalizeCategory(searchParams.get('category')) || 'all';
  }, [routeCategory, searchParams]);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filterType, setFilterType] = useState('all'); // 'all', 'free', 'pro'

  const { hasPremium } = useAuth();

  const handleCategoryClick = (catId) => {
    if (catId === 'all') {
      navigate('/calculators');
    } else {
      navigate(`/calculators/${catId}`);
    }
  };

  const filteredList = useMemo(() => {
    return CALCULATORS_CATALOG.filter(calc => {
      // Category filter
      if (activeCategory !== 'all' && calc.category !== activeCategory) {
        return false;
      }
      // Tier filter
      if (filterType === 'free' && calc.isPremium) return false;
      if (filterType === 'pro' && !calc.isPremium) return false;
      
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = calc.name.toLowerCase().includes(q);
        const matchesDesc = calc.description.toLowerCase().includes(q);
        const matchesCat = calc.category.toLowerCase().includes(q);
        const matchesTags = calc.tags ? calc.tags.some(t => t.toLowerCase().includes(q)) : false;
        return matchesName || matchesDesc || matchesCat || matchesTags;
      }
      return true;
    });
  }, [activeCategory, searchQuery, filterType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 dark:text-white tracking-tight">
            Calculator Directory
          </h1>
          <p className="text-xs sm:text-sm font-medium text-charcoal-600 dark:text-charcoal-200 mt-1 max-w-xl">
            Browse our catalog of {CALCULATORS_CATALOG.length} precision tools across mathematical, scientific, financial, and business domains.
          </p>
        </div>

        {/* Search input & Filter pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-charcoal-500 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search directory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs font-semibold text-charcoal-900 dark:text-white placeholder:text-charcoal-500 focus:outline-none focus:border-orange-500 transition-colors shadow-soft"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filterType === 'all' ? 'bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white shadow-soft' : 'text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-white'}`}
            >
              All ({CALCULATORS_CATALOG.length})
            </button>
            <button
              onClick={() => setFilterType('free')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filterType === 'free' ? 'bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white shadow-soft' : 'text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-white'}`}
            >
              Free Basic
            </button>
            <button
              onClick={() => setFilterType('pro')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filterType === 'pro' ? 'bg-orange-600 text-white shadow-soft' : 'text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-white'}`}
            >
              Pro Premium
            </button>
          </div>

        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleCategoryClick('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === 'all' ? 'bg-orange-600 text-white shadow-soft' : 'bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 text-charcoal-800 dark:text-cream-100 hover:bg-cream-200 dark:hover:bg-charcoal-700'}`}
        >
          All Categories
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === cat.id ? 'bg-orange-600 text-white shadow-soft' : 'bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 text-charcoal-800 dark:text-cream-100 hover:bg-cream-200 dark:hover:bg-charcoal-700'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Calculator Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredList.map((calc) => (
          <div
            key={calc.id}
            className="group p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 hover:border-orange-500/50 hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-cream-200 dark:bg-charcoal-700 text-charcoal-600 dark:text-charcoal-300">
                  {calc.category}
                </span>
                {calc.isPremium ? (
                  <span className="flex items-center gap-1 text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                    <Sparkles className="w-2.5 h-2.5" />
                    Pro
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    Free
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-extrabold text-charcoal-900 dark:text-white group-hover:text-orange-600 transition-colors">
                  <Link to={`/calculator/${calc.id}`}>
                    {calc.name}
                  </Link>
                </h3>
                <p className="text-xs text-charcoal-600 dark:text-charcoal-300 mt-1 line-clamp-2 leading-relaxed">
                  {calc.description}
                </p>
              </div>

              {calc.formula && (
                <div className="p-2.5 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700 font-mono text-[11px] text-charcoal-600 dark:text-charcoal-400 truncate">
                  {calc.formula}
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-cream-300 dark:border-charcoal-700 flex items-center justify-between">
              <Link
                to={`/calculator/${calc.id}`}
                className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 flex items-center gap-1.5 transition-colors"
              >
                <span>Open Calculator</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-[10px] font-mono text-charcoal-400">/{calc.id}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
