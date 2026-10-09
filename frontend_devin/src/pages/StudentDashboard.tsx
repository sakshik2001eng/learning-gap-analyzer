import React from 'react';
import { Link } from 'react-router-dom';
import { KPICard } from '../components/Cards/Card';
import { CompetencyChart } from '../components/Charts/CompetencyChart';
import { PriorityBadge } from '../components/Cards/Badge';
import { currentStudent } from '../data/students';
import { useAuth } from '../context/AuthContext';
import { concepts } from '../data/concepts';
import { recommendations as recData } from '../data/recommendations';
import { Target, BookOpen, TrendingUp, Award, ArrowRight } from 'lucide-react';

const competencyData = [
  { month: 'Jan', competency: 65 },
  { month: 'Feb', competency: 68 },
  { month: 'Mar', competency: 72 },
  { month: 'Apr', competency: 70 },
  { month: 'May', competency: 75 },
  { month: 'Jun', competency: 78 },
];

export const StudentDashboard = () => {
  const { user } = useAuth();
  const displayName = user?.name ?? currentStudent.name;
  const highPriorityGaps = concepts.filter(c => c.priority === 'high').slice(0, 3);
  const topRecommendations = recData.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {displayName}!
        </h1>
        <p className="text-gray-600">
          Here's your learning progress and personalized recommendations.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Competency"
          value={`${currentStudent.competency}%`}
          icon={Target}
          trend="up"
          trendValue="+5% from last month"
        />
        <KPICard
          title="Concepts Mastered"
          value={currentStudent.conceptsMastered}
          icon={Award}
          trend="up"
          trendValue="+2 this week"
        />
        <KPICard
          title="Learning Gaps"
          value={currentStudent.learningGaps}
          icon={BookOpen}
          trend="down"
          trendValue="-1 from last week"
        />
        <KPICard
          title="Current Streak"
          value={`${currentStudent.currentStreak} days`}
          icon={TrendingUp}
          trend="up"
          trendValue="Keep it up!"
        />
      </div>

      {/* Competency Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Competency Over Time
        </h2>
        <CompetencyChart data={competencyData} />
      </div>

      {/* Learning Gaps & Recommendations */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Learning Gaps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Priority Learning Gaps
            </h2>
            <Link to="/student/gaps" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {highPriorityGaps.map((gap) => (
              <div
                key={gap.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{gap.name}</h3>
                    <PriorityBadge priority={gap.priority} />
                  </div>
                  <p className="text-sm text-gray-600">{gap.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{gap.mastery}%</p>
                  <p className="text-xs text-gray-500">Mastery</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recommended for You
            </h2>
            <Link to="/student/learning-path" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {topRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{rec.title}</h3>
                  <span className="text-xs text-gray-500">{rec.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {rec.type}
                  </span>
                  <span className="text-xs text-gray-500">{rec.difficulty}</span>
                </div>
                <p className="text-sm text-gray-600">{rec.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            to="/student/quizzes"
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Take a Quiz
          </Link>
          <Link
            to="/student/learning-path"
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <Target className="w-5 h-5 mr-2" />
            View Learning Path
          </Link>
          <Link
            to="/student/progress"
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            View Progress
          </Link>
        </div>
      </div>
    </div>
  );
};
