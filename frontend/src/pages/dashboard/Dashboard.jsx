import React, { useState, useEffect } from "react";
import Spinner from "../../component/common/Spinner.jsx";
import progressService from "../../services/progressService";
import toast from "react-hot-toast";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  Star,
  CheckCircle2,
  CalendarDays,
  Target,
} from "lucide-react";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData();
        setDashboardData(data.data);
      } catch (error) {
        toast.error("Failed to fetch dashboard data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Spinner />;

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500">
        <TrendingUp className="mb-4 h-10 w-10 text-emerald-500" />
        <p className="text-lg font-medium">No dashboard data available.</p>
      </div>
    );
  }

  const { overview = {}, recentActivity = {} } = dashboardData;
  const {
    totalDocuments = 0,
    totalFlashcardSets = 0,
    totalFlashcards = 0,
    reviewedFlashcards = 0,
    starredFlashcards = 0,
    totalQuizzes = 0,
    completedQuizzes = 0,
    averageScore = 0,
    studyStreak = 0,
  } = overview;

  const reviewRate = totalFlashcards > 0 ? Math.round((reviewedFlashcards / totalFlashcards) * 100) : 0;
  const quizCompletionRate = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;
  const starredRate = totalFlashcards > 0 ? Math.round((starredFlashcards / totalFlashcards) * 100) : 0;

  const topStats = [
    {
      label: "Documents",
      value: totalDocuments,
      helper: "Uploaded study materials",
      icon: FileText,
    },
    {
      label: "Flashcard Sets",
      value: totalFlashcardSets,
      helper: `${totalFlashcards} cards total`,
      icon: BookOpen,
    },
    {
      label: "Completed Quizzes",
      value: completedQuizzes,
      helper: `${quizCompletionRate}% completion`,
      icon: CheckCircle2,
    },
    {
      label: "Average Score",
      value: `${averageScore}%`,
      helper: "Across completed quizzes",
      icon: Target,
    },
  ];

  const recentDocuments = [...(recentActivity?.documents || [])]
    .sort((a, b) => new Date(b?.lastAccessed || b?.createdAt || 0) - new Date(a?.lastAccessed || a?.createdAt || 0))
    .slice(0, 5);

  const recentQuizzes = [...(recentActivity?.quizzes || [])]
    .sort((a, b) => new Date(b?.completedAt || b?.createdAt || 0) - new Date(a?.completedAt || a?.createdAt || 0))
    .slice(0, 5);

  const formatDate = (value) => {
    if (!value) return "No date";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "No date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const progressStats = [
    { label: "Flashcards Reviewed", value: `${reviewRate}%`, amount: `${reviewedFlashcards}/${totalFlashcards}` },
    { label: "Quizzes Completed", value: `${quizCompletionRate}%`, amount: `${completedQuizzes}/${totalQuizzes}` },
    { label: "Starred Cards", value: `${starredRate}%`, amount: `${starredFlashcards}/${totalFlashcards}` },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white shadow-[0_16px_40px_rgba(16,185,129,0.25)] md:p-8">
        <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
        <div className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-cyan-200/40 blur-2xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-emerald-100">Learning Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Welcome back</h1>
            <p className="mt-3 max-w-2xl text-emerald-50/95">
              Track your progress, review your recent activity, and focus your next study session.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.1em] text-emerald-100">Study Streak</p>
              <p className="mt-1 text-2xl font-semibold">{studyStreak} days</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.1em] text-emerald-100">Quiz Score</p>
              <p className="mt-1 text-2xl font-semibold">{averageScore}%</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {topStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article
              key={stat.label}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-1 text-3xl font-semibold text-slate-900">{stat.value}</p>
              <p className="mt-2 text-xs text-slate-500">{stat.helper}</p>
            </article>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Progress Snapshot</h2>
              <p className="text-sm text-slate-500">Core indicators from your learning activity</p>
            </div>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>

          <div className="space-y-5">
            {progressStats.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
                    style={{ width: item.value }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">{item.amount}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Highlights</h2>
              <p className="text-sm text-slate-500">Quick view of key metrics</p>
            </div>
            <Star className="h-5 w-5 text-amber-500" />
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm text-slate-500">Cards Reviewed</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{reviewedFlashcards}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm text-slate-500">Starred Cards</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{starredFlashcards}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm text-slate-500">Active Quiz Sets</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{totalQuizzes - completedQuizzes}</p>
            </div>
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Documents</h2>
              <p className="text-sm text-slate-500">Latest materials you worked on</p>
            </div>
            <CalendarDays className="h-5 w-5 text-emerald-500" />
          </div>

          {recentDocuments.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              No recent documents yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentDocuments.map((doc) => (
                <div key={doc._id} className="rounded-xl border border-slate-200 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-slate-900">{doc.title || doc.fileName || "Untitled document"}</p>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">{doc.status || "processed"}</span>
                    <span>{formatDate(doc.lastAccessed)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Quizzes</h2>
              <p className="text-sm text-slate-500">Your latest quiz attempts</p>
            </div>
            <BrainCircuit className="h-5 w-5 text-emerald-500" />
          </div>

          {recentQuizzes.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              No recent quizzes yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentQuizzes.map((quiz) => (
                <div key={quiz._id} className="rounded-xl border border-slate-200 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-slate-900">{quiz.title || quiz.documentId?.title || "Untitled quiz"}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Score:{" "}
                      <span className="font-semibold text-slate-700">
                        {typeof quiz.score === "number" ? `${quiz.score}%` : "N/A"}
                      </span>
                    </span>
                    <span>{formatDate(quiz.completedAt || quiz.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  );
};

export default DashboardPage;

// import React, { useState, useEffect } from "react";
// import Spinner from "../../component/common/Spinner";
// import progressService from "../../services/progressService";
// import toast from "react-hot-toast";
// import {
//   FileText,
//   BookOpen,
//   BrainCircuit,
//   TrendingUp,
//   Clock,
// } from "lucide-react";

// const DashboardPage = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const data = await progressService.getDashboardData();
//         setDashboardData(data.data);
//       } catch (error) {
//         toast.error("Failed to fetch dashboard data.");
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (loading) return <Spinner />;

//   if (!dashboardData || !dashboardData.overview) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
//         <TrendingUp className="w-10 h-10 mb-4" />
//         <p className="text-lg font-medium">No dashboard data available.</p>
//       </div>
//     );
//   }

//   const stats = [
//     {
//       label: "Total Documents",
//       value: dashboardData.overview.totalDocuments,
//       icon: FileText,
//       gradient: "from-blue-400 to-cyan-500",
//       shadowColor: "shadow-blue-500/25",
//     },
//     {
//       label: "Total Flashcards",
//       value: dashboardData.overview.totalFlashcards,
//       icon: BookOpen,
//       gradient: "from-purple-400 to-pink-500",
//       shadowColor: "shadow-purple-500/25",
//     },
//     {
//       label: "Total Quizzes",
//       value: dashboardData.overview.totalQuizzes,
//       icon: BrainCircuit,
//       gradient: "from-emerald-400 to-teal-500",
//       shadowColor: "shadow-emerald-500/25",
//     },
//     {
//       label: "Study Time (hrs)",
//       value: dashboardData.overview.totalStudyTime || 0,
//       icon: Clock,
//       gradient: "from-orange-400 to-red-500",
//       shadowColor: "shadow-orange-500/25",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800">
//             Dashboard Overview
//           </h1>
//           <p className="text-gray-500 mt-2">
//             Track your learning progress and statistics
//           </p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {stats.map((stat, index) => {
//             const Icon = stat.icon;

//             return (
//               <div
//                 key={index}
//                 className={`bg-white rounded-2xl p-6 shadow-lg ${stat.shadowColor} hover:scale-105 transition-transform duration-300`}
//               >
//                 <div
//                   className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center text-white mb-4`}
//                 >
//                   <Icon className="w-6 h-6" />
//                 </div>

//                 <h2 className="text-gray-500 text-sm">{stat.label}</h2>
//                 <p className="text-2xl font-bold text-gray-800 mt-1">
//                   {stat.value}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;
