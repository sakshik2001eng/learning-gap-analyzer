import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Cards/Card';
import { PriorityBadge, SeverityBadge } from '../components/Cards/Badge';
import { Button } from '../components/Buttons/Button';
import { concepts } from '../data/concepts';
import { Filter, Search } from 'lucide-react';

export const StudentGaps = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredConcepts = concepts.filter(concept => {
    const matchesFilter = filter === 'all' || concept.priority === filter;
    const matchesSearch = concept.name.toLowerCase().includes(search.toLowerCase()) ||
                         concept.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const priorityCounts = {
    all: concepts.length,
    high: concepts.filter(c => c.priority === 'high').length,
    medium: concepts.filter(c => c.priority === 'medium').length,
    low: concepts.filter(c => c.priority === 'low').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Gaps</h1>
        <p className="text-gray-600">
          Identify and address your knowledge gaps with personalized learning paths.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search concepts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <div className="flex gap-2">
              {['all', 'high', 'medium', 'low'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => setFilter(priority)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === priority
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  <span className="ml-1 text-xs opacity-75">({priorityCounts[priority]})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gaps List */}
      <div className="grid gap-4">
        {filteredConcepts.length === 0 ? (
          <Card className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No gaps found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </Card>
        ) : (
          filteredConcepts.map((concept) => (
            <Card key={concept.id} hover>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{concept.name}</h3>
                    <PriorityBadge priority={concept.priority} />
                    <SeverityBadge severity={concept.severity} />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{concept.category}</p>
                  <p className="text-sm text-gray-500">{concept.detectionReason}</p>
                  
                  {concept.missingPrerequisites.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Missing Prerequisites:</p>
                      <div className="flex flex-wrap gap-1">
                        {concept.missingPrerequisites.map((prereq, index) => (
                          <span
                            key={index}
                            className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded"
                          >
                            {prereq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{concept.mastery}%</p>
                    <p className="text-xs text-gray-500">Mastery</p>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/student/gaps/${concept.id}`}>
                      <Button variant="outline" size="sm">
                        View Analysis
                      </Button>
                    </Link>
                    <Link to="/student/learning-path">
                      <Button size="sm">
                        Start Learning
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Current Mastery</span>
                  <span>Target: {concept.targetMastery}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${concept.mastery}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
