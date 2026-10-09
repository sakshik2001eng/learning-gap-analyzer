import React from 'react';
import { Link } from 'react-router-dom';
import { KPICard } from '../components/Cards/Card';
import { CompetencyChart } from '../components/Charts/CompetencyChart';
import { ConceptMasteryChart } from '../components/Charts/ConceptMasteryChart';
import { students } from '../data/students';
import { concepts } from '../data/concepts';
import { Users, Target, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';

const classCompetencyData = [
  { month: 'Jan', competency: 62 },
  { month: 'Feb', competency: 65 },
  { month: 'Mar', competency: 68 },
  { month: 'Apr', competency: 71 },
  { month: 'May', competency: 74 },
  { month: 'Jun', competency: 78 },
];

const conceptMasteryData = concepts.slice(0, 5).map(c => ({
  name: c.name,
  mastery: Math.round(c.mastery * 0.9),
}));

export const TeacherDashboard = () => {
  const totalStudents = students.length;
  const avgCompetency = Math.round(students.reduce((acc, s) => acc + s.competency, 0) / totalStudents);
  const totalGaps = students.reduce((acc, s) => acc + s.learningGaps, 0);
  const criticalGaps = concepts.filter(c => c.severity === 'critical').length;

  const atRiskStudents = students.filter(s => s.competency < 70).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
        <p className="text-gray-600">
          Overview of class performance and learning gaps.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Students"
          value={totalStudents}
          icon={Users}
          trend="up"
          trendValue="+2 this month"
        />
        <KPICard
          title="Average Competency"
          value={`${avgCompetency}%`}
          icon={TrendingUp}
          trend="up"
          trendValue="+3% from last month"
        />
        <KPICard
          title="Total Learning Gaps"
          value={totalGaps}
          icon={Target}
          trend="down"
          trendValue="-5 from last week"
        />
        <KPICard
          title="Critical Gaps"
          value={criticalGaps}
          icon={AlertTriangle}
          trend="neutral"
          trendValue="Needs attention"
        />
      </div>

      {/* Class Competency Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Class Competency Over Time
        </h2>
        <CompetencyChart data={classCompetencyData} />
      </div>

      {/* Concept Mastery & At-Risk Students */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Concept Mastery */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Class Concept Mastery
            </h2>
            <Link to="/teacher/gaps" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Details
            </Link>
          </div>
          <ConceptMasteryChart data={conceptMasteryData} />
        </div>

        {/* At-Risk Students */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              At-Risk Students
            </h2>
            <Link to="/teacher/students" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-3">
            {atRiskStudents.map((student) => (
              <Link
                key={student.id}
                to={`/teacher/students/${student.id}`}
                className="block p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center text-red-700 font-medium">
                      {student.avatar}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">Grade {student.grade}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-red-600">{student.competency}%</p>
                    <p className="text-xs text-gray-500">Competency</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-gray-900">
                <strong>Emma Johnson</strong> completed "Linear Equations Mastery" quiz with 85% score
              </p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-gray-900">
                <strong>Olivia Brown</strong> closed learning gap in "Trigonometric Identities"
              </p>
              <p className="text-sm text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-gray-900">
                <strong>Liam Smith</strong> needs attention in "Derivatives" - competency dropped to 30%
              </p>
              <p className="text-sm text-gray-500">1 day ago</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-gray-900">
                <strong>Class average</strong> improved by 3% in "Linear Equations"
              </p>
              <p className="text-sm text-gray-500">2 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            to="/teacher/students"
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <Users className="w-5 h-5 mr-2" />
            View Students
          </Link>
          <Link
            to="/teacher/gaps"
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <Target className="w-5 h-5 mr-2" />
            Review Gaps
          </Link>
          <Link
            to="/teacher/reports"
            className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Generate Reports
          </Link>
        </div>
      </div>
    </div>
  );
};
