import { ReactNode } from "react";

interface StatsBoxProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  variant?: "blue" | "green" | "yellow" | "purple";
}

const variantStyles = {
  blue: "text-blue-600 bg-blue-50/50",
  green: "text-green-600 bg-green-50/50",
  yellow: "text-yellow-600 bg-yellow-50/50",
  purple: "text-purple-600 bg-purple-50/50",
};

export function StatsBox({
  title,
  value,
  description,
  icon,
  variant = "blue",
}: StatsBoxProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6 hover:border-gray-200 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-800">{value}</p>
          {description && (
            <p className="mt-2 text-sm text-gray-400">{description}</p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${variantStyles[variant]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
