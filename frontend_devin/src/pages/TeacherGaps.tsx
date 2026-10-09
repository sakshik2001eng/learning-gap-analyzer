import React, { useState } from 'react';
import { Card } from '../components/Cards/Card';
import { SeverityBadge, PriorityBadge } from '../components/Cards/Badge';
import { Button } from '../components/Buttons/Button';
import { ConceptMasteryChart } from '../components/Charts/ConceptMasteryChart';
import { concepts } from '../data/concepts';
import { Filter, AlertTriangle, TrendingUp } from 'lucide-react';

export const TeacherGaps = () => {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const categories = ['all', ...new Set(concepts.map(c => c.category))];
  
  const filteredConcepts = concepts.filter(concept => {
    const matchesCategory = filterCategory === 'all' || concept.category === filterCategory;
    const matchesSeverity = filterSeverity === 'all' || concept.severity === filterSeverity;
    return matchesCategory && matchesSeverity;
  });

  const severityCounts = {
    all: concepts.length,
    critical: concepts.filter(c => c.severity === 'critical').length,
    high: concepts.filter(c => c.severity === 'high').length,
    medium: concepts.filter(c => c.severity === 'medium').length,
    low: concepts.filter(c => c.severity === 'low').length,
  };

  const conceptChartData = filteredConcepts.slice(0, 8).map(c => ({
    name: c.name,
    mastery: c.mastery,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Gaps Overview</h1>
        <p className="text-gray-600">
          Monitor concept-level learning gaps across all students.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{concepts.length}</p>
            <p className="text-sm text-gray-600">Total Concepts</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">{severityCounts.critical}</p>
            <p className="text-sm text-gray-600">Critical Gaps</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{severityCounts.high}</p>
            <p className="text-sm text-gray-600">High Priority</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {Math.round(concepts.reduce((acc, c) => acc + c.mastery, 0) / concepts.length)}%
            </p>
            <p className="text-sm text-gray-600">Avg Mastery</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <AlertTriangle className="text-gray-400 w-5 h-5" />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Concept Mastery Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Concept Mastery Distribution
        </h2>
        <ConceptMasteryChart data={conceptChartData} />
      </div>

      {/* Learning Gaps List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Learning Gaps by Concept</h2>
        
        {filteredConcepts.map((concept) => (
          <Card key={concept.id} hover>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{concept.name}</h3>
                  <SeverityBadge severity={concept.severity} />
                  <PriorityBadge priority={concept.priority} />
                </div>
                <p className="text-sm text-gray-600 mb-2">{concept.category}</p>
                <p className="text-sm text-gray-500">{concept.detectionReason}</p>
                
                {concept.missingPrerequisites.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Common Missing Prerequisites:</p>
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
                  <p className="text-xs text-gray-500">Avg Mastery</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(concepts.filter(c => c.category === concept.category).length * 0.3)}
                  </p>
                  <p className="text-xs text-gray-500">Students Affected</p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
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
                  className={`h-2 rounded-full transition-all ${
                    concept.mastery < 50 ? 'bg-red-500' : concept.mastery < 75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${concept.mastery}%` }}
                ></div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Class-Wide Recommendations
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Focus on Calculus Fundamentals</p>
              <p className="text-sm text-gray-600">
                Multiple students are struggling with Derivatives and Integration. Consider scheduling a review session.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Algebra Progress</p>
              <p className="text-sm text-gray-600">
                Linear Equations mastery has improved by 8%. Continue with current teaching approach.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
