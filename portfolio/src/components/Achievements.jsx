import React from 'react';
import { useBlog } from '../context/BlogContext';

const Achievements = () => {
    const { achievements, achievementsLoading } = useBlog();

    const getBorderColor = (award) => {
        switch (award) {
            case 'Winner': return 'border-yellow-500/50 shadow-yellow-500/20';
            case '2nd': return 'border-slate-300/50 shadow-slate-300/20';
            case '3rd': return 'border-orange-600/50 shadow-orange-600/20';
            case 'Generic': return 'border-blue-500/30 shadow-blue-500/10';
            default: return 'border-black-300'; // Default styling
        }
    };

    return (
        <section className="c-space my-20">
            <div className="w-full text-white-600">
                <h3 className="head-text mb-12">Achievements</h3>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
                    {achievementsLoading ? (
                        /* Skeleton Loading State */
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="bg-black-200 border border-black-300 p-4 rounded-xl animate-pulse h-[350px]">
                                <div className="w-full h-48 bg-white/5 rounded-lg mb-4"></div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="h-6 bg-white/5 rounded w-3/4"></div>
                                    <div className="h-4 bg-white/5 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        achievements.map((item) => (
                            <div
                                key={item.id}
                                className={`group relative bg-white/5 backdrop-blur-xl border p-4 rounded-xl shadow-lg hover:scale-105 transition-all duration-500 ease-in-out hover:z-10 hover:rotate-0 hover:shadow-2xl ${getBorderColor(item.award)} ${item.rotation}`}
                            >
                                {/* Award Badge */}
                                {item.award && item.award !== 'None' && (
                                    <div className="absolute top-2 right-2 bg-black-300/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 z-20 shadow-lg transform group-hover:scale-110 transition-transform">
                                        <span className="text-lg">
                                            {item.award === 'Winner' ? '🏆' : item.award === '2nd' ? '🥈' : item.award === '3rd' ? '🥉' : '🏅'}
                                        </span>
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                                            {item.award === 'Winner' ? 'Winner' : item.award === '2nd' ? 'Silver' : item.award === '3rd' ? 'Bronze' : 'Honour'}
                                        </span>
                                    </div>
                                )}

                                <div className="w-full h-48 overflow-hidden rounded-lg mb-4 bg-black-500 relative">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                <div className="flex flex-col items-center text-center">
                                    <p className="font-semibold text-2xl text-white font-jumps">{item.title}</p>
                                    <p className="text-gray-400 mt-2 font-generalsans">{item.location}</p>

                                    {item.linkedin && (
                                        <a
                                            href={item.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-full transition-colors duration-300"
                                        >
                                            <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" className="w-4 h-4" />
                                            <span className="text-sm font-medium">View Post</span>
                                        </a>
                                    )}
                                </div>

                                {/* Decorative "Tape" effect */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/10 backdrop-blur-sm rotate-1 font-marker text-xs flex items-center justify-center text-white/50">
                                    {/* Optional: Add 'Pinned' text or keep blank tape */}
                                </div>
                            </div>
                        )))}
                </div>
            </div>
        </section>
    );
};

export default Achievements;
