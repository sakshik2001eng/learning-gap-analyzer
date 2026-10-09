import React from 'react';
import { Card } from '../components/Cards/Card';
import { KPICard } from '../components/Cards/Card';
import { CompetencyChart } from '../components/Charts/CompetencyChart';
import { ConceptMasteryChart } from '../components/Charts/ConceptMasteryChart';
import { concepts } from '../data/concepts';
import { currentStudent } from '../data/students';
import { TrendingUp, Award, Target, Calendar, Flame } from 'lucide-react';

const competencyData = [
  { month: 'Jan', competency: 65 },
  { month: 'Feb', competency: 68 },
  { month: 'Mar', competency: 72 },
  { month: 'Apr', competency: 70 },
  { month: 'May', competency: 75 },
  { month: 'Jun', competency: 78 },
];

const conceptMasteryData = concepts.slice(0, 6).map(c => ({
  name: c.name,
  mastery: c.mastery,
}));

const weeklyActivityData = [
  { day: 'Mon', hours: 2 },
  { day: 'Tue', hours: 1.5 },
  { day: 'Wed', hours: 3 },
  { day: 'Thu', hours: 2 },
  { day: 'Fri', hours: 1 },
  { day: 'Sat', hours: 4 },
  { day: 'Sun', hours: 2.5 },
];

export const StudentProgress = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
        <p className="text-gray-600">
          Track your learning journey and achievements over time.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Overall Competency"
          value={`${currentStudent.competency}%`}
          icon={TrendingUp}
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
          title="Gaps Closed"
          value="5"
          icon={Target}
          trend="up"
          trendValue="+1 this week"
        />
        <KPICard
          title="Current Streak"
          value={`${currentStudent.currentStreak} days`}
          icon={Flame}
          trend="up"
          trendValue="Personal best!"
        />
      </div>

      {/* Competency Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Competency Trend
        </h2>
        <CompetencyChart data={competencyData} />
      </div>

      {/* Concept Mastery */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Concept Mastery
        </h2>
        <ConceptMasteryChart data={conceptMasteryData} />
      </div>

      {/* Weekly Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Weekly Activity
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {weeklyActivityData.map((item, index) => (
            <div key={index} className="text-center">
              <div
                className="mx-auto w-full bg-blue-600 rounded-t-lg transition-all"
                style={{ height: `${item.hours * 40}px` }}
              ></div>
              <p className="text-xs text-gray-600 mt-2">{item.day}</p>
              <p className="text-xs text-gray-500">{item.hours}h</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Achievements</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Linear Equations Master</h3>
              <p className="text-sm text-gray-600">Achieved 85% mastery in Linear Equations</p>
            </div>
            <span className="text-xs text-gray-500">2 days ago</span>
          </div>
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Flame className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">5-Day Streak</h3>
              <p className="text-sm text-gray-600">Maintained learning streak for 5 consecutive days</p>
            </div>
            <span className="text-xs text-gray-500">Today</span>
          </div>
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Gap Closed: Variables</h3>
              <p className="text-sm text-gray-600">Successfully closed learning gap in Variables</p>
            </div>
            <span className="text-xs text-gray-500">1 week ago</span>
          </div>
        </div>
      </Card>

      {/* Learning Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-sm text-gray-600">Days Active</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">67.5</p>
              <p className="text-sm text-gray-600">Hours Learned</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-600">Quizzes Completed</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
