import React, { useEffect, useState } from 'react';
import { Card, KPICard } from '../components/Cards/Card';
import { Button } from '../components/Buttons/Button';
import { students } from '../data/students';
import { downloadCsv } from '../utils/csv';
import { buildReport, REPORT_TITLES, ReportType } from '../utils/reports';
import { Download, FileText, BarChart3, TrendingUp, Calendar } from 'lucide-react';

interface ReportCardConfig {
  type: ReportType;
  description: string;
  icon: React.ElementType;
  iconWrapper: string;
  iconColor: string;
}

const REPORT_CARDS: ReportCardConfig[] = [
  {
    type: 'class-performance',
    description: 'Overall class competency, trends, and learning gaps summary.',
    icon: BarChart3,
    iconWrapper: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    type: 'student-progress',
    description: 'Individual student progress, mastery, and gap analysis.',
    icon: FileText,
    iconWrapper: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    type: 'learning-gaps',
    description: 'Detailed analysis of learning gaps by concept and severity.',
    icon: TrendingUp,
    iconWrapper: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    type: 'weekly-activity',
    description: 'Student engagement, quiz completion, and activity metrics.',
    icon: Calendar,
    iconWrapper: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    type: 'at-risk',
    description: 'Identify students who need immediate attention and support.',
    icon: FileText,
    iconWrapper: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  {
    type: 'concept-mastery',
    description: 'Class-wide mastery levels for each concept and category.',
    icon: BarChart3,
    iconWrapper: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
];

interface RecentReport {
  id: string;
  title: string;
  detail: string;
  type: ReportType;
  icon: React.ElementType;
  iconWrapper: string;
  iconColor: string;
}

// Seed history so the list isn't empty on first load.
const SEED_REPORTS: RecentReport[] = [
  {
    id: 'seed-1',
    title: 'Class Performance - June 2024',
    detail: 'Generated on June 30, 2024',
    type: 'class-performance',
    icon: BarChart3,
    iconWrapper: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 'seed-2',
    title: 'Student Progress - Emma Johnson',
    detail: 'Generated on June 28, 2024',
    type: 'student-progress',
    icon: FileText,
    iconWrapper: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: 'seed-3',
    title: 'Learning Gaps Analysis - Calculus',
    detail: 'Generated on June 25, 2024',
    type: 'learning-gaps',
    icon: TrendingUp,
    iconWrapper: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
];

const MAX_RECENT = 10;

export const Reports = () => {
  const [recent, setRecent] = useState<RecentReport[]>(SEED_REPORTS);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(''), 3500);
    return () => clearTimeout(timer);
  }, [status]);

  const avgCompetency = Math.round(students.reduce((acc, s) => acc + s.competency, 0) / students.length);
  const totalGaps = students.reduce((acc, s) => acc + s.learningGaps, 0);
  const totalConceptsMastered = students.reduce((acc, s) => acc + s.conceptsMastered, 0);

  // Builds the CSV for a report type, downloads it, and returns the file name.
  const downloadReport = (type: ReportType) => {
    const report = buildReport(type);
    downloadCsv(report.filename, report.headers, report.rows);
    setStatus(`Downloaded ${report.filename}`);
    return report;
  };

  const generateReport = (type: ReportType) => {
    downloadReport(type);
    const now = new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    const card = REPORT_CARDS.find((c) => c.type === type);
    const entry: RecentReport = {
      id: `${type}-${Date.now()}`,
      title: `${REPORT_TITLES[type]} - ${now}`,
      detail: `Generated on ${now}`,
      type,
      icon: card?.icon ?? FileText,
      iconWrapper: card?.iconWrapper ?? 'bg-gray-100',
      iconColor: card?.iconColor ?? 'text-gray-600',
    };
    setRecent((prev) => [entry, ...prev].slice(0, MAX_RECENT));
  };

  const redownload = (entry: RecentReport) => downloadReport(entry.type);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-gray-600">Generate and view comprehensive reports on class performance.</p>
      </div>

      {status && (
        <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
          {status}
        </p>
      )}

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <KPICard title="Average Competency" value={`${avgCompetency}%`} icon={TrendingUp} trend="up" trendValue="+3% from last month" />
        <KPICard title="Total Learning Gaps" value={totalGaps} icon={BarChart3} trend="down" trendValue="-5 from last week" />
        <KPICard title="Concepts Mastered" value={totalConceptsMastered} icon={FileText} trend="up" trendValue="+12 this month" />
        <KPICard title="Active Students" value={students.length} icon={Calendar} trend="neutral" trendValue="All active" />
      </div>

      {/* Report Types */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REPORT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.type} hover>
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg ${card.iconWrapper}`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{REPORT_TITLES[card.type]}</h3>
                  <p className="text-sm text-gray-600">{card.description}</p>
                </div>
              </div>
              <Button className="w-full" onClick={() => generateReport(card.type)}>
                <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                Generate Report
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Recent Reports */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Reports</h2>
        <div className="space-y-3">
          {recent.map((entry) => {
            const Icon = entry.icon;
            return (
              <div key={entry.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`p-2 rounded-lg shrink-0 ${entry.iconWrapper}`}>
                    <Icon className={`w-5 h-5 ${entry.iconColor}`} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{entry.title}</h3>
                    <p className="text-sm text-gray-500">{entry.detail}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => redownload(entry)} aria-label={`Download ${entry.title}`}>
                  <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                  Download
                </Button>
              </div>
            );
          })}
          {recent.length === 0 && <p className="text-sm text-gray-500">No reports generated yet.</p>}
        </div>
      </Card>

      {/* Export Options */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Export Options</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">PDF Format</h3>
            <p className="text-sm text-gray-600 mb-3">Best for printing and sharing as documents.</p>
            <Button variant="outline" size="sm" className="w-full" disabled>
              Coming soon
            </Button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Excel Format</h3>
            <p className="text-sm text-gray-600 mb-3">Best for data analysis and further processing.</p>
            <Button variant="outline" size="sm" className="w-full" disabled>
              Coming soon
            </Button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">CSV Format</h3>
            <p className="text-sm text-gray-600 mb-3">Best for importing into other systems.</p>
            <Button variant="outline" size="sm" className="w-full" onClick={() => generateReport('class-performance')}>
              <Download className="w-4 h-4 mr-2" aria-hidden="true" />
              Export as CSV
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
