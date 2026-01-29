import React from "react";
import type { Language } from "../../types";

interface StatItem {
    id: number;
    value: number;
    label: {
        en: string;
        np: string;
    };
    icon: string;
    color: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
    change?: number;
    suffix?: string;
}

interface StatsSectionProps {
    language: Language;
    stats: StatItem[];
    timeRange?: 'today' | 'week' | 'month' | 'year';
    onTimeRangeChange?: (range: 'today' | 'week' | 'month' | 'year') => void;
    title?: {
        en: string;
        np: string;
    };
}

const StatsSection: React.FC<StatsSectionProps> = ({
    language,
    stats,
    timeRange = 'month',
    onTimeRangeChange,
    title = {
        en: 'Dashboard Overview',
        np: 'ड्यासबोर्ड अवलोकन',
    }
}) => {
    const getColorClasses = (color: StatItem['color']) => {
        switch (color) {
            case'blue': return 'bg-blue-100 text-blue-800 border-blue-300';
            case'green': return 'bg-green-100 text-green-800 border-green-300';
            case'red': return 'bg-red-100 text-red-800 border-red-300';
            case'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case'purple': return 'bg-purple-100 text-purple-800 border-purple-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };
    const getIcon = (iconName: string) => {
        const icons: Record<string, React.ReactNode> = {
            'applications' : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> 
                </svg>
            ),
            'approved' :(
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            'pending' : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            'users' : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m-3 1a6 6 0 00-9 5.197v1h9v-1z" />
                </svg>
            ),
            'officers' : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            'time' : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            'revenue' : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">     
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0" />
                </svg>
            ),
            'success' : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            )
        };
        return icons[iconName] || icons['applications'];
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const traslations = {
        en: {
            timeRanges: {
                today: 'Today',
                week: 'This Week',
                month: 'This Month',
                year: 'This Year',
            },
            increase: 'increase',
            decrease: 'decrease',
        },
        np: {
            timeRanges: {
                today: 'आज',
                week: 'यो हप्ता',
                month: 'यो महिना',
                year: 'यो वर्ष',
            },
            increase: 'वृद्धि',
            decrease: 'कमी',
        }
    };

    const t = traslations[language] || traslations.en;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{title[language]}</h2>
                    <p className="text-gray-600 mt-1">
                        {language === 'np' ? 'हालको प्रदर्शन तथ्याङ्क' : 'Current performance statistics'}
                    </p>
                </div>

                {onTimeRangeChange && (
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {(['today', 'week', 'month', 'year'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => onTimeRangeChange(range)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                    timeRange === range
                                        ? 'bg-white text-blue-600 shadow'
                                        : 'text-gray-600 hover:text-blue-600'
                                }`}
                            >
                                {t.timeRanges[range]}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.id}
                        className={`border rounded-xl p-6 hover:shadow-md transition-shadow ${getColorClasses(stat.color)}`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                                {getIcon(stat.icon)}
                            </div>

                            {stat.change !== undefined && (
                                <div className={`flex items-center gap-1 text-sm font-medium ${
                                    stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {stat.change >= 0 ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 017 7m-7-7v18" /> 
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 l41-7 7m0 01-7-7m7 7V3" />
                                        </svg>
                                    )}
                                    {Math.abs(stat.change)}%
                                </div>
                            )}
                        </div>

                        <div className="mb-2">
                            <div className="text-3xl font-bold">
                                {formatNumber(stat.value)}
                                {stat.suffix && <span className="text-lg">{stat.suffix}</span>}
                            </div>
                            <div className="text-sm opacity-90 mt-1">
                                {stat.label[language]}
                            </div>
                        </div>

                        {stat.change !== undefined && (
                            <div className="text-xs mt-4 opacity-75">
                                {stat.change >= 0 ? `↑ ${t.increase}` : `↓ ${t.decrease}`}
                                {language === 'np' ? '  भयो' : ' from last period'}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="text-gray-600">
                        {language === 'np' ? 'सबै तथ्याङ्क वास्तविक समयमा अपडेट हुन्छन्' : 'All statistics are updated in real-time'}
                    </div>
                    <button className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                        {language === 'np' ? 'विस्तृत विवरण हेर्नुहोस्' : 'View Detailed Report'}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatsSection;