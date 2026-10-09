import { students } from '../data/students';
import { concepts } from '../data/concepts';

export type ReportType =
  | 'class-performance'
  | 'student-progress'
  | 'learning-gaps'
  | 'weekly-activity'
  | 'at-risk'
  | 'concept-mastery';

export interface ReportFile {
  title: string;
  filename: string;
  headers: string[];
  rows: (string | number)[][];
}

// Students below this competency are listed in the at-risk report.
export const AT_RISK_THRESHOLD = 70;

const today = () => new Date().toISOString().slice(0, 10);

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const REPORT_TITLES: Record<ReportType, string> = {
  'class-performance': 'Class Performance Report',
  'student-progress': 'Student Progress Report',
  'learning-gaps': 'Learning Gaps Report',
  'weekly-activity': 'Weekly Activity Report',
  'at-risk': 'At-Risk Students Report',
  'concept-mastery': 'Concept Mastery Report',
};

export const buildReport = (type: ReportType): ReportFile => {
  const title = REPORT_TITLES[type];
  const filename = `${type}-${today()}.csv`;

  switch (type) {
    case 'class-performance':
      return {
        title,
        filename,
        headers: ['Student', 'Grade', 'Competency (%)', 'Concepts Mastered', 'Learning Gaps', 'Current Streak (days)'],
        rows: students.map((s) => [s.name, s.grade, s.competency, s.conceptsMastered, s.learningGaps, s.currentStreak]),
      };

    case 'student-progress':
      return {
        title,
        filename,
        headers: ['Student', 'Email', 'Grade', 'Competency (%)', 'Concepts Mastered', 'Learning Gaps', 'Enrolled'],
        rows: students.map((s) => [s.name, s.email, s.grade, s.competency, s.conceptsMastered, s.learningGaps, s.enrolledDate]),
      };

    case 'learning-gaps':
      return {
        title,
        filename,
        headers: ['Concept', 'Category', 'Mastery (%)', 'Target (%)', 'Severity', 'Priority', 'Missing Prerequisites', 'Detection Reason'],
        rows: concepts.map((c) => [
          c.name,
          c.category,
          c.mastery,
          c.targetMastery,
          c.severity,
          c.priority,
          c.missingPrerequisites.join('; '),
          c.detectionReason,
        ]),
      };

    case 'weekly-activity':
      // The mock data has no per-week logs, so streak length is used as the activity measure.
      return {
        title,
        filename,
        headers: ['Student', 'Current Streak (days)', 'Concepts Mastered', 'Learning Gaps'],
        rows: students.map((s) => [s.name, s.currentStreak, s.conceptsMastered, s.learningGaps]),
      };

    case 'at-risk':
      return {
        title,
        filename,
        headers: ['Student', 'Email', 'Competency (%)', 'Learning Gaps', 'Status'],
        rows: students
          .filter((s) => s.competency < AT_RISK_THRESHOLD)
          .map((s) => [s.name, s.email, s.competency, s.learningGaps, 'Needs attention']),
      };

    case 'concept-mastery':
      return {
        title,
        filename,
        headers: ['Concept', 'Category', 'Mastery (%)', 'Target (%)', 'Gap to Target (pts)'],
        rows: concepts.map((c) => [c.name, c.category, c.mastery, c.targetMastery, Math.max(0, c.targetMastery - c.mastery)]),
      };
  }
};

// Per-student report: the concept breakdown shown on the teacher's student detail page.
export const buildStudentReport = (student: { name: string; id: number }): ReportFile => ({
  title: `Student Progress - ${student.name}`,
  filename: `student-${slug(student.name)}-${today()}.csv`,
  headers: ['Concept', 'Category', 'Mastery (%)', 'Target (%)', 'Severity', 'Missing Prerequisites'],
  rows: concepts.map((c) => [c.name, c.category, c.mastery, c.targetMastery, c.severity, c.missingPrerequisites.join('; ')]),
});
