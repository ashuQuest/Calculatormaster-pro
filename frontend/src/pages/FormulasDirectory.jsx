import React, { useState, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { 
  BookOpen, Search, Filter, Sparkles, ArrowRight, 
  Layers, Compass, Atom, Cpu, Zap, Settings, Building2, 
  FlaskConical, Binary, Orbit, Sigma, Infinity, BarChart2, Grid, Calculator
} from 'lucide-react';
import { FORMULAS_CATALOG, FORMULA_CATEGORIES } from '../formulas/catalog';
import MathView from '../components/common/MathView';

// Icon mapping helper
const getCategoryIcon = (iconName) => {
  switch (iconName) {
    case 'Calculator': return Calculator;
    case 'Sigma': return Sigma;
    case 'Compass': return Compass;
    case 'Infinity': return Infinity;
    case 'BarChart2': return BarChart2;
    case 'Grid': return Grid;
    case 'Atom': return Atom;
    case 'Zap': return Zap;
    case 'Cpu': return Cpu;
    case 'Settings': return Settings;
    case 'Building2': return Building2;
    case 'FlaskConical': return FlaskConical;
    case 'Binary': return Binary;
    case 'Orbit': return Orbit;
    default: return BookOpen;
  }
};

export default function FormulasDirectory() {
  const { category: routeCategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = routeCategory || searchParams.get('category') || 'all';
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const filteredFormulas = useMemo(() => {
    return FORMULAS_CATALOG.filter(item => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Difficulty filter
      if (difficultyFilter !== 'all' && item.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCat = item.categoryName.toLowerCase().includes(q);
        const matchesLatex = item.latex.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesCat || matchesLatex;
      }
      return true;
    });
  }, [activeCategory, difficultyFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-[11px] font-bold text-orange-700 dark:text-orange-400 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>14 Scientific & Engineering Disciplines</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 dark:text-white tracking-tight">
            Formula & Theory Library
          </h1>
          <p className="text-xs sm:text-sm font-medium text-charcoal-600 dark:text-charcoal-200 mt-1 max-w-2xl">
            Explore peer-reviewed mathematical formulations, theoretical derivations, physical boundary conditions, and interactive calculator linkages with verified numerical solutions.
          </p>
        </div>

        {/* Search & Difficulty Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-charcoal-500 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search formulas or symbols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 text-xs font-semibold text-charcoal-900 dark:text-white placeholder:text-charcoal-500 focus:outline-none focus:border-orange-500 transition-colors shadow-soft"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-cream-100 dark:bg-charcoal-900 border border-cream-400 dark:border-charcoal-600 overflow-x-auto">
            {['all', 'Beginner', 'Intermediate', 'Advanced', 'Engineering'].map(diff => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-colors ${
                  difficultyFilter.toLowerCase() === diff.toLowerCase()
                    ? 'bg-orange-600 text-white shadow-soft'
                    : 'text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Discipline Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          to="/formulas"
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeCategory === 'all'
              ? 'bg-orange-600 text-white shadow-soft'
              : 'bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 text-charcoal-800 dark:text-cream-100 hover:bg-cream-200 dark:hover:bg-charcoal-700'
          }`}
        >
          All Disciplines ({FORMULAS_CATALOG.length})
        </Link>
        {FORMULA_CATEGORIES.map(cat => {
          const IconComponent = getCategoryIcon(cat.icon);
          const count = FORMULAS_CATALOG.filter(f => f.category === cat.id).length;
          const isActive = activeCategory === cat.id;
          return (
            <Link
              key={cat.id}
              to={`/formulas/${cat.id}`}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-orange-600 text-white shadow-soft'
                  : 'bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 text-charcoal-800 dark:text-cream-100 hover:bg-cream-200 dark:hover:bg-charcoal-700'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
              {count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-cream-200 dark:bg-charcoal-700 text-charcoal-600 dark:text-charcoal-300'}`}>
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Formulas Grid */}
      {filteredFormulas.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-charcoal-800 rounded-3xl border border-cream-400 dark:border-charcoal-600 space-y-3">
          <BookOpen className="w-10 h-10 text-charcoal-400 mx-auto" />
          <h3 className="text-base font-bold text-charcoal-900 dark:text-white">No formulas found</h3>
          <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different category from above.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setDifficultyFilter('all'); }}
            className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-soft"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFormulas.map(formula => (
            <div
              key={formula.slug}
              className="bg-white dark:bg-charcoal-800 rounded-3xl border border-cream-400 dark:border-charcoal-600 p-6 flex flex-col justify-between hover:border-orange-500/50 hover:shadow-soft transition-all group"
            >
              <div className="space-y-4">
                
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-cream-100 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700 text-[11px] font-bold text-charcoal-600 dark:text-charcoal-300">
                    {formula.categoryName}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    formula.difficulty === 'Beginner'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : formula.difficulty === 'Intermediate'
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        : formula.difficulty === 'Advanced'
                          ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                          : 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                  }`}>
                    {formula.difficulty}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-extrabold text-charcoal-900 dark:text-white group-hover:text-orange-600 transition-colors">
                  <Link to={`/formula/${formula.slug}`}>
                    {formula.title}
                  </Link>
                </h3>

                {/* Formula KaTeX Card */}
                <div className="p-4 rounded-2xl bg-cream-100/70 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700 overflow-x-auto text-center min-h-[64px] flex items-center justify-center">
                  <MathView math={formula.latex} display={true} className="text-charcoal-900 dark:text-white" />
                </div>

                {/* Description */}
                <p className="text-xs text-charcoal-600 dark:text-charcoal-300 line-clamp-2 leading-relaxed">
                  {formula.description}
                </p>

              </div>

              {/* Card Footer Actions */}
              <div className="pt-5 mt-4 border-t border-cream-300 dark:border-charcoal-700 flex items-center justify-between gap-2">
                <Link
                  to={`/formula/${formula.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
                >
                  <span>Theory & Derivation</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>

                {formula.relatedCalculator && (
                  <Link
                    to={`/calculator/${formula.relatedCalculator}?fromFormula=${formula.slug}`}
                    className="p-1.5 rounded-lg bg-cream-200 dark:bg-charcoal-700 hover:bg-orange-600 hover:text-white text-charcoal-700 dark:text-cream-200 text-[11px] font-bold transition-colors"
                    title="Open directly in calculator"
                  >
                    Calculator ↗
                  </Link>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
