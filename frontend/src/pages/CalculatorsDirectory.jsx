import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Sparkles, ArrowRight, Calculator, Check, ArrowUpRight } from 'lucide-react';
import { CALCULATORS_CATALOG, CATEGORIES } from '../calculators/registry';
import { useAuth } from '../context/AuthContext';

export default function CalculatorsDirectory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filterType, setFilterType] = useState('all'); // 'all', 'free', 'pro'

  const { hasPremium } = useAuth();

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
            Browse our full catalog of 40+ precision tools across mathematical, scientific, financial, and business domains.
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
          onClick={() => handleCategoryChange('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === 'all' ? 'bg-orange-600 text-white shadow-soft' : 'bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 text-charcoal-800 dark:text-cream-100 hover:bg-cream-200 dark:hover:bg-charcoal-700'}`}
        >
          All Categories
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === cat.id ? 'bg-orange-600 text-white shadow-soft' : 'bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 text-charcoal-800 dark:text-cream-100 hover:bg-cream-200 dark:hover:bg-charcoal-700'}`}
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
              className="bg-white dark:bg-charcoal-800 p-5 rounded-2xl border border-cream-400 dark:border-charcoal-600 hover:border-orange-500 shadow-soft hover:shadow-card transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-cream-200 dark:bg-charcoal-700 text-charcoal-800 dark:text-cream-100 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <Calculator className="w-4 h-4" />
                  </div>
                  {calc.isPremium ? (
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                      PRO
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-cream-200 dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-200">
                      FREE
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-charcoal-900 dark:text-white text-sm group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {calc.name}
                </h3>
                <p className="text-xs font-medium text-charcoal-600 dark:text-charcoal-300 mt-1 line-clamp-2 leading-relaxed">
                  {calc.description}
                </p>

                <div className="mt-3 text-[10px] text-charcoal-600 dark:text-charcoal-300 font-mono bg-cream-100 dark:bg-charcoal-900 px-2 py-1 rounded-md border border-cream-300 dark:border-charcoal-700 truncate font-semibold">
                  {calc.formula}
                </div>
              </div>

              <div className="pt-3.5 mt-3.5 border-t border-cream-300 dark:border-charcoal-700 flex items-center justify-between text-xs font-bold text-charcoal-700 dark:text-cream-200 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                <span className="text-[11px] uppercase font-bold text-charcoal-500 dark:text-charcoal-400">{calc.category}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600">
          <Calculator className="w-10 h-10 text-charcoal-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-charcoal-900 dark:text-white">No calculators found</h3>
          <p className="text-xs font-medium text-charcoal-600 dark:text-charcoal-300 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or reset the filters to discover available tools.
          </p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); setFilterType('all'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-soft"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
