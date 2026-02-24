import React, { useEffect, useMemo, useState } from "react";
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
  Activity,
} from "lucide-react";

const HEATMAP_LEVELS = [
  { level: 0, label: "None", style: "bg-slate-100 border border-slate-200" },
  { level: 1, label: "Light", style: "bg-emerald-100 border border-emerald-200" },
  { level: 2, label: "Medium", style: "bg-emerald-300 border border-emerald-400" },
  { level: 3, label: "High", style: "bg-emerald-500 border border-emerald-600" },
  { level: 4, label: "Very High", style: "bg-emerald-700 border border-emerald-800" },
];

const HEATMAP_DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getHeatmapLevelClass = (level) => {
  switch (level) {
    case 4:
      return "bg-emerald-700 border border-emerald-800";
    case 3:
      return "bg-emerald-500 border border-emerald-600";
    case 2:
      return "bg-emerald-300 border border-emerald-400";
    case 1:
      return "bg-emerald-100 border border-emerald-200";
    default:
      return "bg-slate-100 border border-slate-200";
  }
};

const parseDateKey = (value) => {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDateKey = (value) => {
  const date = parseDateKey(value);
  if (!date) return "Unknown date";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

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

  const { heatmapGrid, heatmapRangeLabel, totalHeatmapActions } = useMemo(() => {
    const fallbackDays = [];
    const fallbackEnd = new Date();
    fallbackEnd.setUTCHours(0, 0, 0, 0);

    for (let offset = 29; offset >= 0; offset -= 1) {
      const date = new Date(fallbackEnd);
      date.setUTCDate(fallbackEnd.getUTCDate() - offset);
      const key = date.toISOString().slice(0, 10);
      fallbackDays.push({ date: key, totalActions: 0, level: 0 });
    }

    const sourceHeatmap = dashboardData?.recentActivity?.studyActivity?.heatmap;
    const dayItems = Array.isArray(sourceHeatmap) && sourceHeatmap.length > 0 ? sourceHeatmap : fallbackDays;

    const normalizedDays = dayItems
      .map((item) => {
        const dateObj = parseDateKey(item?.date);
        if (!dateObj) return null;

        const totalActions = Number.isFinite(item?.totalActions) ? item.totalActions : 0;
        const level = Number.isFinite(item?.level)
          ? Math.min(Math.max(item.level, 0), 4)
          : totalActions > 9
            ? 4
            : totalActions > 5
              ? 3
              : totalActions > 2
                ? 2
                : totalActions > 0
                  ? 1
                  : 0;

        return {
          date: item.date,
          totalActions,
          level,
          dateObj,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.dateObj - b.dateObj);

    if (normalizedDays.length === 0) {
      return {
        heatmapGrid: [],
        heatmapRangeLabel: "No activity data",
        totalHeatmapActions: 0,
      };
    }

    const firstDate = normalizedDays[0].dateObj;
    const lastDate = normalizedDays[normalizedDays.length - 1].dateObj;
    const dateMap = new Map(normalizedDays.map((item) => [item.date, item]));

    const gridStart = new Date(firstDate);
    gridStart.setUTCDate(gridStart.getUTCDate() - gridStart.getUTCDay());

    const gridEnd = new Date(lastDate);
    gridEnd.setUTCDate(gridEnd.getUTCDate() + (6 - gridEnd.getUTCDay()));

    const columns = [];
    let cursor = new Date(gridStart);
    let weekColumn = [];

    while (cursor <= gridEnd) {
      const key = cursor.toISOString().slice(0, 10);
      weekColumn.push(dateMap.get(key) || null);

      if (weekColumn.length === 7) {
        columns.push(weekColumn);
        weekColumn = [];
      }

      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    const totalActions = normalizedDays.reduce((sum, day) => sum + day.totalActions, 0);
    const rangeLabel = `${formatDateKey(normalizedDays[0].date)} - ${formatDateKey(
      normalizedDays[normalizedDays.length - 1].date
    )}`;

    return {
      heatmapGrid: columns,
      heatmapRangeLabel: rangeLabel,
      totalHeatmapActions: totalActions,
    };
  }, [dashboardData]);

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

      <section>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">30-Day Study Heatmap</h2>
              <p className="text-sm text-slate-500">
                {heatmapRangeLabel} - {totalHeatmapActions} total actions
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700">
              <Activity className="h-4 w-4" />
              <span className="font-semibold">{overview.todayActions || 0}</span>
              <span className="text-emerald-700/80">today</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="inline-flex gap-2">
              <div className="grid grid-rows-7 gap-2 pr-2 text-[11px] font-medium text-slate-500">
                {HEATMAP_DAY_LABELS.map((label, idx) => (
                  <span key={label} className={idx % 2 === 0 ? "opacity-0" : ""}>
                    {idx % 2 === 0 ? "." : label}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                {heatmapGrid.map((week, weekIndex) => (
                  <div key={`week-${weekIndex}`} className="grid grid-rows-7 gap-2">
                    {week.map((day, dayIndex) => (
                      <div
                        key={`week-${weekIndex}-day-${dayIndex}`}
                        className={`h-4 w-4 rounded-[4px] transition-transform duration-150 hover:scale-110 ${
                          day ? getHeatmapLevelClass(day.level) : "bg-transparent border border-transparent"
                        }`}
                        title={
                          day
                            ? `${day.totalActions} action${day.totalActions === 1 ? "" : "s"} on ${formatDateKey(day.date)}`
                            : ""
                        }
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Less</span>
              {HEATMAP_LEVELS.map((item) => (
                <span key={item.level} className={`h-3.5 w-3.5 rounded-[3px] ${item.style}`} title={item.label} />
              ))}
              <span>More</span>
            </div>

            <p className="text-xs text-slate-500">
              Longest streak: <span className="font-semibold text-slate-700">{overview.longestStudyStreak || 0} days</span>
            </p>
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
