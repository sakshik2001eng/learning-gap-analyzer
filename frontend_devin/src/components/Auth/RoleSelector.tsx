import React from 'react';
import { GraduationCap, Presentation } from 'lucide-react';
import { Role } from '../../context/AuthContext';

interface RoleSelectorProps {
  value: Role;
  onChange: (role: Role) => void;
}

const options: { value: Role; label: string; icon: React.ElementType }[] = [
  { value: 'student', label: 'Student', icon: GraduationCap },
  { value: 'teacher', label: 'Teacher', icon: Presentation },
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({ value, onChange }) => (
  <fieldset>
    <legend className="block text-sm font-medium text-gray-700 mb-2">I am a</legend>
    <div className="grid grid-cols-2 gap-3">
      {options.map(({ value: optionValue, label, icon: Icon }) => {
        const selected = value === optionValue;
        return (
          <label
            key={optionValue}
            className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-blue-500 ${
              selected
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="role"
              value={optionValue}
              checked={selected}
              onChange={() => onChange(optionValue)}
              className="sr-only"
            />
            <Icon className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">{label}</span>
          </label>
        );
      })}
    </div>
  </fieldset>
);
