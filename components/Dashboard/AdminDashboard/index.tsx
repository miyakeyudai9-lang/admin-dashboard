"use client";

import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

import { useTranslations } from "next-intl";

import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import DonutLargeOutlinedIcon from "@mui/icons-material/DonutLargeOutlined";
import StackedBarChartOutlinedIcon from "@mui/icons-material/StackedBarChartOutlined";

import Breadcrumb from "@/components/Breadcrumb";

import { useAdminDashboard } from "./hook";

import type {
  DashboardCharts,
  DashboardFilters,
  DashboardPerformanceStatus,
  DashboardPaymentStatus,
} from "./type";

// =================================================
// THEME
// =================================================

const BRAND = "#107A64";
const BRAND_DEEP = "#0A5A49";
const BRAND_BRIGHT = "#1E9A7C";
const BRAND_SOFT = "rgba(16, 122, 100, 0.08)";
const BRAND_LINE = "rgba(16, 122, 100, 0.20)";
const CANVAS = "#F2F6F3";
const HAIRLINE = "rgba(17, 24, 39, 0.07)";
const INK = "#0F172A";
const INK_BODY = "#334155";
const INK_MUTED = "#5B6A7E";

const RADIUS = 20;

const NUMERIC = {
  fontVariantNumeric: "tabular-nums",
};

const focusRing = {
  "&:focus-visible": {
    outline: `2px solid ${BRAND}`,
    outlineOffset: 2,
  },
};

const softCard = {
  p: {
    xs: 2,
    sm: 2.5,
    md: 3,
  },
  borderRadius: `${RADIUS}px`,
  border: "1px solid",
  borderColor: HAIRLINE,
  bgcolor: "#ffffff",
  boxShadow:
    "0 1px 2px rgba(15,23,42,0.03), 0 18px 40px -28px rgba(15,23,42,0.30)",
};

const cardLift = {
  transition:
    "transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease",

  "@media (hover: hover)": {
    "&:hover": {
      transform: "translateY(-3px)",
      borderColor: BRAND_LINE,
      boxShadow:
        "0 1px 2px rgba(15,23,42,0.04), 0 26px 52px -30px rgba(15,23,42,0.38)",
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",

    "&:hover": {
      transform: "none",
    },
  },
};

const labelSx = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.3,
  color: INK_MUTED,
};

const valueSx = {
  mt: 0.75,
  fontSize: { xs: 24, md: 26 },
  fontWeight: 700,
  letterSpacing: -0.6,
  color: INK,
  lineHeight: 1.2,
  overflowWrap: "anywhere",
  ...NUMERIC,
};

const headCellSx = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 0.7,
  textTransform: "uppercase",
  color: INK_MUTED,
  bgcolor: "rgba(16, 122, 100, 0.04)",
  borderBottomColor: HAIRLINE,
  py: 1.5,
  whiteSpace: "nowrap",
};

const bodyCellSx = {
  fontSize: 14,
  color: INK_BODY,
  borderBottomColor: "rgba(17, 24, 39, 0.05)",
  py: 1.75,
};

const rowSx = {
  transition: "background-color 200ms ease",

  "&:hover": {
    bgcolor: "rgba(16, 122, 100, 0.045)",
  },

  "&:last-of-type td": {
    borderBottom: 0,
  },
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: `${RADIUS - 4}px`,
    bgcolor: "#ffffff",

    "& fieldset": {
      borderColor: "rgba(17, 24, 39, 0.12)",
    },

    "&:hover fieldset": {
      borderColor: "rgba(16, 122, 100, 0.40)",
    },

    "&.Mui-focused fieldset": {
      borderColor: BRAND,
      borderWidth: 1,
    },
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: BRAND,
  },
};

const paginationSx = {
  borderTop: `1px solid ${HAIRLINE}`,

  "& .MuiTablePagination-toolbar": {
    flexWrap: "wrap",
    justifyContent: { xs: "center", sm: "flex-end" },
    px: { xs: 1, sm: 2 },
  },

  "& .MuiTablePagination-spacer": {
    display: { xs: "none", sm: "block" },
  },

  "& .MuiTablePagination-selectLabel": {
    display: { xs: "none", sm: "block" },
  },
};

// Table on md and up, stacked cards below.
const showOnDesktop = { display: { xs: "none", md: "block" } };

const showOnMobile = {
  display: { xs: "flex", md: "none" },
  flexDirection: "column",
};

// =================================================
// STATIC OPTIONS
// =================================================

const VISA_OPTIONS = [
  { value: "student", label: "Student" },
  { value: "dependent", label: "Dependent" },
  {
    value: "designatedActivitiesJobHunting",
    label: "Designated Activities - Job Hunting",
  },
  { value: "designatedActivities", label: "Designated Activities" },
  {
    value: "engineerHumanitiesInternationalServices",
    label: "Engineer / Humanities / International Services",
  },
  { value: "specifiedSkilledWorker1", label: "Specified Skilled Worker 1" },
  { value: "specifiedSkilledWorker2", label: "Specified Skilled Worker 2" },
  { value: "skilledLabor", label: "Skilled Labor" },
  { value: "technicalInternTraining", label: "Technical Intern Training" },
  { value: "intra-companyTransferee", label: "Intra-company Transferee" },
  { value: "nursingCare", label: "Nursing Care" },
  { value: "highlySkilledProfessional", label: "Highly Skilled Professional" },
  { value: "businessManager", label: "Business Manager" },
  { value: "permanentResident", label: "Permanent Resident" },
  {
    value: "spouseChildOfJapaneseNational",
    label: "Spouse / Child of Japanese National",
  },
  {
    value: "spouseChildOfPermanentResident",
    label: "Spouse / Child of Permanent Resident",
  },
  { value: "longTermResident", label: "Long Term Resident" },
  { value: "other", label: "Other" },
];

const CATEGORY_OPTIONS = [
  { value: "newJob", label: "New Job" },
  { value: "jobChange", label: "Job Change" },
  { value: "dependentVisaRenewal", label: "Dependent Visa Renewal" },
  { value: "visaServiceOnlyRenewal", label: "Visa Service - Renewal" },
  { value: "visaServiceOnlyChange", label: "Visa Service - Change" },
  { value: "otherVisaService", label: "Other Visa Service" },
];

const PAYMENT_STATUS_OPTIONS = ["Completed", "Cancelled", "Refunded"];

const PAYMENT_METHOD_OPTIONS = [
  "Cash",
  "Bank Transfer",
  "Online Payment",
  "Cheque",
  "Other",
];

// =================================================
// FORMATTERS
// =================================================

const amountFormatter = new Intl.NumberFormat("ja-JP");

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const formatAmount = (value: number) =>
  amountFormatter.format(Number(value || 0));

const formatJapanDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return dateFormatter.format(date);
};

// =================================================
// STATUS
// =================================================

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const performanceTone = (status: DashboardPerformanceStatus): Tone => {
  if (status === "Achieved") {
    return "success";
  }

  if (status === "In Progress") {
    return "warning";
  }

  if (status === "No Target") {
    return "info";
  }

  return "neutral";
};

const paymentTone = (status: DashboardPaymentStatus): Tone => {
  if (status === "Completed") {
    return "success";
  }

  if (status === "Refunded") {
    return "warning";
  }

  if (status === "Cancelled") {
    return "danger";
  }

  return "neutral";
};

// =================================================
// PILL
// =================================================

const PILL_TONES: Record<Tone, { bg: string; fg: string; line: string }> = {
  success: {
    bg: "rgba(16, 122, 100, 0.10)",
    fg: BRAND_DEEP,
    line: "rgba(16, 122, 100, 0.24)",
  },
  warning: {
    bg: "rgba(217, 119, 6, 0.10)",
    fg: "#92400E",
    line: "rgba(217, 119, 6, 0.26)",
  },
  danger: {
    bg: "rgba(190, 24, 60, 0.08)",
    fg: "#9F1239",
    line: "rgba(190, 24, 60, 0.22)",
  },
  info: {
    bg: "rgba(37, 99, 235, 0.08)",
    fg: "#1D4ED8",
    line: "rgba(37, 99, 235, 0.20)",
  },
  neutral: {
    bg: "rgba(15, 23, 42, 0.05)",
    fg: INK_MUTED,
    line: "rgba(15, 23, 42, 0.10)",
  },
};

function Pill({ label, tone }: { label: string; tone: Tone }) {
  const palette = PILL_TONES[tone] ?? PILL_TONES.neutral;

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.25,
        py: 0.5,
        borderRadius: 999,
        bgcolor: palette.bg,
        color: palette.fg,
        border: "1px solid",
        borderColor: palette.line,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      <Box
        component="span"
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: "currentColor",
          flexShrink: 0,
        }}
      />
      {label}
    </Box>
  );
}

// =================================================
// SUMMARY CARD
// =================================================

type SummaryCardProps = {
  label: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
};

function SummaryCard({ label, value, subtitle, icon }: SummaryCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        ...softCard,
        ...cardLift,
        height: "100%",
        position: "relative",
        overflow: "hidden",

        "&:before": {
          content: '""',
          position: "absolute",
          inset: "0 auto auto 0",
          width: "100%",
          height: 3,
          background: `linear-gradient(90deg, ${BRAND_BRIGHT}, rgba(16,122,100,0))`,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={labelSx}>{label}</Typography>

          <Typography sx={valueSx}>{value}</Typography>

          {subtitle && (
            <Typography
              sx={{
                mt: 0.75,
                fontSize: 12,
                color: INK_MUTED,
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            width: 44,
            height: 44,
            borderRadius: 3,
            bgcolor: BRAND_SOFT,
            border: "1px solid",
            borderColor: BRAND_LINE,
            color: BRAND,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}

// =================================================
// STAT
// =================================================

type StatProps = {
  label: string;
  value: string;
  color?: string;
};

function Stat({ label, value, color }: StatProps) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.84)",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          mt: 0.5,
          fontSize: { xs: 18, md: 20 },
          fontWeight: 700,
          letterSpacing: -0.3,
          color: color || "#ffffff",
          overflowWrap: "anywhere",
          ...NUMERIC,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

// =================================================
// SECTION HEADER
// =================================================

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  icon: ReactNode;
};

function SectionHeader({ title, subtitle, icon }: SectionHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: { xs: 2, sm: 2.5, md: 3 },
        py: 2,
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 34,
          height: 34,
          borderRadius: 2.5,
          bgcolor: BRAND_SOFT,
          color: BRAND,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: -0.2,
            color: INK,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            sx={{
              mt: 0.25,
              fontSize: 12,
              color: INK_MUTED,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

// =================================================
// MINI BAR
// =================================================

function MiniBar({
  percentage,
  size = 74,
}: {
  percentage: number;
  size?: number | string;
}) {
  const width = Math.min(Math.max(Number(percentage) || 0, 0), 100);

  return (
    <Box
      role="progressbar"
      aria-valuenow={width}
      aria-valuemin={0}
      aria-valuemax={100}
      sx={{
        mt: 0.75,
        width: size,
        height: 5,
        borderRadius: 999,
        bgcolor: "rgba(17, 24, 39, 0.08)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: `${width}%`,
          height: "100%",
          borderRadius: 999,
          bgcolor: width >= 100 ? BRAND_DEEP : BRAND,
          transition: "width 800ms cubic-bezier(0.22, 1, 0.36, 1)",

          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
          },
        }}
      />
    </Box>
  );
}

// =================================================
// RANK BADGE
// =================================================

function RankBadge({ rank }: { rank: number }) {
  const isPodium = rank <= 3;

  return (
    <Box
      sx={{
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        width: 30,
        height: 30,
        borderRadius: 2,
        fontSize: 13,
        fontWeight: 700,
        ...(isPodium
          ? {
              bgcolor: BRAND,
              color: "#ffffff",
              boxShadow: "0 6px 14px -8px rgba(16,122,100,0.9)",
            }
          : {
              bgcolor: "rgba(15, 23, 42, 0.04)",
              color: INK_MUTED,
              border: "1px solid",
              borderColor: HAIRLINE,
            }),
      }}
    >
      {rank}
    </Box>
  );
}

// =================================================
// STAGE ROW
// =================================================

function StageRow({
  name,
  count,
  max,
}: {
  name: string;
  count: number;
  max: number;
}) {
  const width = max > 0 ? Math.max((count / max) * 100, 4) : 0;

  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: HAIRLINE,
        bgcolor: "#FBFDFC",
        transition: "border-color 240ms ease, background-color 240ms ease",

        "&:hover": {
          borderColor: BRAND_LINE,
          bgcolor: "rgba(16, 122, 100, 0.04)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: INK_BODY,
            minWidth: 0,
          }}
        >
          {name}
        </Typography>

        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 700,
            color: BRAND,
            ...NUMERIC,
          }}
        >
          {count}
        </Typography>
      </Box>

      <Box
        sx={{
          mt: 1.25,
          height: 6,
          borderRadius: 999,
          bgcolor: "rgba(17, 24, 39, 0.06)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: `${width}%`,
            height: "100%",
            borderRadius: 999,
            background: `linear-gradient(90deg, #7BC9B0, ${BRAND})`,
            transition: "width 900ms cubic-bezier(0.22, 1, 0.36, 1)",

            "@media (prefers-reduced-motion: reduce)": {
              transition: "none",
            },
          }}
        />
      </Box>
    </Box>
  );
}

// =================================================
// MOBILE CARD HELPERS
// =================================================

function CardField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 0.4,
          color: INK_MUTED,
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          mt: 0.25,
          fontSize: 13,
          fontWeight: 600,
          color: INK_BODY,
          overflowWrap: "anywhere",
          ...NUMERIC,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function EmptyNote({ message }: { message: string }) {
  return (
    <Typography
      sx={{
        py: 4,
        px: 2,
        textAlign: "center",
        fontSize: 14,
        color: INK_MUTED,
      }}
    >
      {message}
    </Typography>
  );
}

const mobileCardSx = {
  px: 2,
  py: 2,
  borderBottom: `1px solid ${HAIRLINE}`,
  "&:last-of-type": { borderBottom: 0 },
};

// =================================================
// CHARTS
// =================================================

type ChartsData = DashboardCharts;

type DailyPoint = DashboardCharts["dailyCollection"][number];

type StaffPoint = DashboardCharts["staffPerformance"][number];

type StatusPoint = DashboardCharts["paymentsByStatus"][number];

const EMPTY_CHARTS: ChartsData = {
  dailyCollection: [],
  staffPerformance: [],
  paymentsByMethod: [],
  paymentsByStatus: [],
};

const METHOD_COLORS: Record<string, string> = {
  Cash: BRAND,
  "Bank Transfer": "#2F6FDB",
  "Online Payment": "#7C5CD6",
  Cheque: "#D97706",
  Other: "#8A97A8",
};

const FALLBACK_COLORS = ["#0E9AA7", "#C2410C", "#6B7280", "#A21CAF"];

const STATUS_COLORS: Record<string, string> = {
  Completed: BRAND,
  Refunded: "#D97706",
  Cancelled: "#BE123C",
};

const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const dayLabelFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Tokyo",
  month: "short",
  day: "numeric",
});

const formatCompact = (value: number) =>
  `¥${compactFormatter.format(Number(value || 0))}`;

const formatDayLabel = (key: string) => {
  const date = new Date(`${key}T00:00:00+09:00`);

  return Number.isNaN(date.getTime()) ? key : dayLabelFormatter.format(date);
};

// Rounds up to a value that divides cleanly into four grid steps.
const niceCeil = (value: number) => {
  if (value <= 0) {
    return 1;
  }

  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const fraction = value / magnitude;
  const step = [1, 2, 4, 6, 8, 10].find((item) => fraction <= item) ?? 10;

  return step * magnitude;
};

const visuallyHiddenSx = {
  position: "absolute",
  width: 1,
  height: 1,
  m: -1,
  p: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
} as const;

function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return undefined;
    }

    setWidth(Math.floor(node.clientWidth));

    if (typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.floor(entry.contentRect.width));
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}

function ChartCard({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        ...softCard,
        p: 0,
        height: "100%",
        overflow: "hidden",
      }}
    >
      <SectionHeader title={title} subtitle={subtitle} icon={icon} />

      <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>{children}</Box>
    </Paper>
  );
}

function LegendDot({ color, dashed = false }: { color: string; dashed?: boolean }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        flexShrink: 0,
        width: dashed ? 16 : 10,
        height: dashed ? 0 : 10,
        borderRadius: dashed ? 0 : "50%",
        bgcolor: dashed ? "transparent" : color,
        borderTop: dashed ? `2px dashed ${color}` : 0,
      }}
    />
  );
}

// -------------------------------------------------
// Collection trend: cumulative collected vs target pace
// -------------------------------------------------

function TrendChart({
  days,
  totalTarget,
  selectedMonth,
  todayKey,
}: {
  days: DailyPoint[];
  totalTarget: number;
  selectedMonth: string;
  todayKey: string;
}) {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const gradientId = `trend-${useId().replace(/:/g, "")}`;

  if (days.length === 0) {
    return <EmptyNote message="No collection data for this month." />;
  }

  const count = days.length;

  // Days after today have no data yet, so the line stops at today.
  let lastIndex = count - 1;

  if (todayKey < `${selectedMonth}-01`) {
    lastIndex = -1;
  } else if (todayKey.startsWith(selectedMonth)) {
    lastIndex = Math.min(Number(todayKey.slice(8, 10)) - 1, count - 1);
  }

  const cumulative: number[] = [];
  let running = 0;

  days.forEach((day, index) => {
    if (index <= lastIndex) {
      running += Number(day.amount || 0);
    }

    cumulative.push(running);
  });

  const collected = lastIndex >= 0 ? cumulative[lastIndex] : 0;
  const hasTarget = totalTarget > 0;
  const paceAt = (index: number) =>
    hasTarget ? (totalTarget * (index + 1)) / count : 0;
  const paceNow = lastIndex >= 0 ? paceAt(lastIndex) : 0;
  const difference = collected - paceNow;

  const bestDay = days.reduce(
    (best, day) => (day.amount > best.amount ? day : best),
    days[0],
  );

  // Geometry
  const height = width < 480 ? 200 : 240;
  const pad = { top: 12, right: 12, bottom: 26, left: 52 };
  const innerW = Math.max(width - pad.left - pad.right, 1);
  const innerH = height - pad.top - pad.bottom;
  const yMax = niceCeil(Math.max(collected, hasTarget ? totalTarget : 0, 1));

  const x = (index: number) =>
    pad.left + (count > 1 ? (index / (count - 1)) * innerW : innerW / 2);
  const y = (value: number) => pad.top + innerH * (1 - value / yMax);

  const points = cumulative
    .slice(0, lastIndex + 1)
    .map((value, index) => `${x(index)},${y(value)}`);

  const linePath = points.length > 0 ? `M${points.join(" L")}` : "";
  const areaPath =
    points.length > 0
      ? `${linePath} L${x(lastIndex)},${y(0)} L${x(0)},${y(0)} Z`
      : "";

  const ticks = [0, 1, 2, 3, 4].map((step) => (yMax * step) / 4);

  const active =
    hover !== null && lastIndex >= 0 ? Math.min(hover, lastIndex) : null;
  const activeDay = active !== null ? days[active] : null;

  const tooltipWidth = 176;
  const tooltipLeft =
    active !== null
      ? Math.min(Math.max(x(active) - tooltipWidth / 2, 0), width - tooltipWidth)
      : 0;

  const liveText =
    activeDay && active !== null
      ? `${formatDayLabel(activeDay.date)}: ${formatAmount(activeDay.amount)} yen collected that day, ${formatAmount(cumulative[active])} yen in total${hasTarget ? `, target pace ${formatAmount(Math.round(paceAt(active)))} yen` : ""}.`
      : "";

  const handlePointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (lastIndex < 0) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left - pad.left) / innerW;
    const index = Math.round(ratio * (count - 1));

    setHover(Math.min(Math.max(index, 0), lastIndex));
  };

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          alignItems: "start",
        }}
      >
        <CardField label="Collected so far">
          <Box component="span" sx={{ fontSize: 18, color: BRAND, fontWeight: 700 }}>
            ¥{formatAmount(collected)}
          </Box>
        </CardField>

        {hasTarget && (
          <CardField label="Target pace today">
            <Box component="span" sx={{ fontSize: 18, fontWeight: 700 }}>
              ¥{formatAmount(Math.round(paceNow))}
            </Box>
          </CardField>
        )}

        {bestDay && bestDay.amount > 0 && (
          <CardField label="Best day">
            <Box component="span">
              {formatDayLabel(bestDay.date)}, ¥{formatAmount(bestDay.amount)}
            </Box>
          </CardField>
        )}

        {hasTarget && lastIndex >= 0 && (
          <Box sx={{ alignSelf: "center" }}>
            <Pill
              tone={difference >= 0 ? "success" : "warning"}
              label={`${difference >= 0 ? "Ahead" : "Behind"} ¥${formatAmount(Math.round(Math.abs(difference)))}`}
            />
          </Box>
        )}
      </Box>

      <Box
        ref={wrapRef}
        tabIndex={0}
        role="group"
        aria-label="Collection trend chart. Use the left and right arrow keys to inspect each day."
        onBlur={() => setHover(null)}
        onKeyDown={(event) => {
          if (lastIndex < 0) {
            return;
          }

          const current = hover ?? lastIndex;

          if (event.key === "ArrowLeft") {
            event.preventDefault();
            setHover(Math.max(current - 1, 0));
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            setHover(Math.min(current + 1, lastIndex));
          } else if (event.key === "Home") {
            event.preventDefault();
            setHover(0);
          } else if (event.key === "End") {
            event.preventDefault();
            setHover(lastIndex);
          } else if (event.key === "Escape") {
            setHover(null);
          }
        }}
        sx={{
          position: "relative",
          mt: 2,
          minHeight: 200,
          borderRadius: 2,
          ...focusRing,
        }}
      >
        {width > 0 && (
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={`Cumulative collections reached ${formatCompact(collected)}${hasTarget ? ` against a target pace of ${formatCompact(paceNow)}` : ""}.`}
            onPointerMove={handlePointer}
            onPointerDown={handlePointer}
            onPointerLeave={() => setHover(null)}
            style={{
              display: "block",
              touchAction: "pan-y",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BRAND} stopOpacity="0.26" />
                <stop offset="100%" stopColor={BRAND} stopOpacity="0" />
              </linearGradient>
            </defs>

            {ticks.map((tick) => (
              <g key={tick}>
                <line
                  x1={pad.left}
                  x2={width - pad.right}
                  y1={y(tick)}
                  y2={y(tick)}
                  stroke="rgba(17,24,39,0.07)"
                />

                <text
                  x={pad.left - 8}
                  y={y(tick)}
                  dy={4}
                  textAnchor="end"
                  fontSize={11}
                  fill={INK_MUTED}
                >
                  {formatCompact(tick)}
                </text>
              </g>
            ))}

            {days.map((day, index) => {
              const showLabel =
                index % 7 === 0 || (index === count - 1 && (count - 1) % 7 >= 3);

              return showLabel ? (
                <text
                  key={day.date}
                  x={x(index)}
                  y={height - 6}
                  textAnchor="middle"
                  fontSize={11}
                  fill={INK_MUTED}
                >
                  {index + 1}
                </text>
              ) : null;
            })}

            {areaPath && <path d={areaPath} fill={`url(#${gradientId})`} />}

            {hasTarget && (
              <line
                x1={x(0)}
                y1={y(paceAt(0))}
                x2={x(count - 1)}
                y2={y(totalTarget)}
                stroke={INK_MUTED}
                strokeWidth={1.5}
                strokeDasharray="5 4"
              />
            )}

            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke={BRAND}
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}

            {lastIndex >= 0 && active === null && (
              <circle
                cx={x(lastIndex)}
                cy={y(collected)}
                r={4}
                fill="#ffffff"
                stroke={BRAND}
                strokeWidth={2.5}
              />
            )}

            {active !== null && (
              <g>
                <line
                  x1={x(active)}
                  x2={x(active)}
                  y1={pad.top}
                  y2={y(0)}
                  stroke="rgba(17,24,39,0.25)"
                />

                <circle
                  cx={x(active)}
                  cy={y(cumulative[active])}
                  r={5}
                  fill="#ffffff"
                  stroke={BRAND}
                  strokeWidth={2.5}
                />
              </g>
            )}
          </svg>
        )}

        {activeDay && active !== null && (
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              top: pad.top,
              left: tooltipLeft,
              width: tooltipWidth,
              pointerEvents: "none",
              px: 1.5,
              py: 1,
              borderRadius: 2,
              bgcolor: INK,
              color: "#ffffff",
              boxShadow: "0 12px 28px -12px rgba(15,23,42,0.55)",
              fontSize: 12,
              lineHeight: 1.6,
              ...NUMERIC,
            }}
          >
            <Box sx={{ fontWeight: 700 }}>{formatDayLabel(activeDay.date)}</Box>

            <Box>That day: ¥{formatAmount(activeDay.amount)}</Box>

            <Box>Total: ¥{formatAmount(cumulative[active])}</Box>

            {hasTarget && (
              <Box sx={{ color: "rgba(255,255,255,0.72)" }}>
                Pace: ¥{formatAmount(Math.round(paceAt(active)))}
              </Box>
            )}
          </Box>
        )}

        <Box aria-live="polite" sx={visuallyHiddenSx}>
          {liveText}
        </Box>
      </Box>

      <Box
        sx={{
          mt: 1.5,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          fontSize: 12,
          color: INK_MUTED,
        }}
      >
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
          <LegendDot color={BRAND} />
          Collected
        </Box>

        {hasTarget && (
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
            <LegendDot color={INK_MUTED} dashed />
            Target pace
          </Box>
        )}
      </Box>
    </Box>
  );
}

// -------------------------------------------------
// Staff: collected vs target
// -------------------------------------------------

function StaffBars({
  rows,
  total,
  onSelect,
}: {
  rows: StaffPoint[];
  total: number;
  onSelect: (staffId: string) => void;
}) {
  if (rows.length === 0) {
    return <EmptyNote message="No staff collections or targets this month." />;
  }

  const scaleMax = Math.max(
    ...rows.map((row) => Math.max(row.totalCollected, row.targetAmount)),
    1,
  );

  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {rows.map((row) => {
          const fill = Math.max(
            (row.totalCollected / scaleMax) * 100,
            row.totalCollected > 0 ? 1.5 : 0,
          );
          const marker = (row.targetAmount / scaleMax) * 100;
          const achieved =
            row.targetAmount > 0 && row.totalCollected >= row.targetAmount;
          const percent =
            row.targetAmount > 0
              ? Math.round((row.totalCollected / row.targetAmount) * 100)
              : null;

          return (
            <ButtonBase
              key={row.staffId}
              onClick={() => onSelect(row.staffId)}
              aria-label={`${row.staffName}: collected ${formatAmount(row.totalCollected)} yen${row.targetAmount > 0 ? ` of ${formatAmount(row.targetAmount)} yen target` : ""}`}
              sx={{
                display: "block",
                width: "100%",
                textAlign: "left",
                borderRadius: 2,
                px: 1,
                py: 1,
                transition: "background-color 200ms ease",

                "&:hover": {
                  bgcolor: "rgba(16, 122, 100, 0.05)",
                },

                ...focusRing,
              }}
            >
              <Box
                component="span"
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 1.5,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: 13,
                    fontWeight: 600,
                    color: INK,
                  }}
                >
                  {row.staffName}
                </Box>

                <Box
                  component="span"
                  sx={{ flexShrink: 0, fontSize: 12, color: INK_MUTED, ...NUMERIC }}
                >
                  <Box component="span" sx={{ fontWeight: 700, color: BRAND }}>
                    {formatCompact(row.totalCollected)}
                  </Box>

                  {row.targetAmount > 0 &&
                    ` of ${formatCompact(row.targetAmount)}`}

                  {percent !== null && ` (${percent}%)`}
                </Box>
              </Box>

              <Box
                component="span"
                sx={{
                  display: "block",
                  position: "relative",
                  mt: 1,
                  height: 8,
                  borderRadius: 999,
                  bgcolor: "rgba(17, 24, 39, 0.07)",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    position: "absolute",
                    inset: "0 auto 0 0",
                    width: `${fill}%`,
                    borderRadius: 999,
                    background: achieved
                      ? BRAND_DEEP
                      : `linear-gradient(90deg, #7BC9B0, ${BRAND})`,
                    transition: "width 800ms cubic-bezier(0.22, 1, 0.36, 1)",

                    "@media (prefers-reduced-motion: reduce)": {
                      transition: "none",
                    },
                  }}
                />

                {row.targetAmount > 0 && (
                  <Box
                    component="span"
                    sx={{
                      position: "absolute",
                      top: -3,
                      bottom: -3,
                      left: `calc(${marker}% - 1px)`,
                      width: 2,
                      borderRadius: 1,
                      bgcolor: INK,
                    }}
                  />
                )}
              </Box>
            </ButtonBase>
          );
        })}
      </Box>

      <Box
        sx={{
          mt: 1.5,
          px: 1,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          fontSize: 12,
          color: INK_MUTED,
        }}
      >
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
          <Box
            component="span"
            sx={{ width: 2, height: 12, borderRadius: 1, bgcolor: INK }}
          />
          Target
        </Box>

        {total > rows.length && <span>Top {rows.length} of {total} staff</span>}
      </Box>
    </Box>
  );
}

// -------------------------------------------------
// Donut + legend
// -------------------------------------------------

type Slice = {
  key: string;
  label: string;
  amount: number;
  count: number;
  color: string;
};

function SliceLegend({
  slices,
  total,
  basis = "amount",
}: {
  slices: Slice[];
  total: number;
  basis?: "amount" | "count";
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, minWidth: 0 }}>
      {slices.map((slice) => (
        <Box
          key={slice.key}
          sx={{
            display: "grid",
            gridTemplateColumns: "auto minmax(0, 1fr) auto",
            alignItems: "center",
            columnGap: 1.25,
          }}
        >
          <LegendDot color={slice.color} />

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{ fontSize: 13, fontWeight: 600, color: INK, lineHeight: 1.3 }}
            >
              {slice.label}
            </Typography>

            <Typography sx={{ fontSize: 12, color: INK_MUTED }}>
              {slice.count} {slice.count === 1 ? "payment" : "payments"}
            </Typography>
          </Box>

          <Box sx={{ textAlign: "right", ...NUMERIC }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: INK }}>
              ¥{formatAmount(slice.amount)}
            </Typography>

            <Typography sx={{ fontSize: 12, color: INK_MUTED }}>
              {total > 0 ? Math.round((slice[basis] / total) * 100) : 0}%
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function DonutChart({ slices }: { slices: Slice[] }) {
  const total = slices.reduce((sum, slice) => sum + slice.amount, 0);

  if (total <= 0) {
    return <EmptyNote message="No completed payments this month." />;
  }

  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const visible = slices.filter((slice) => slice.amount > 0);
  const gap = visible.length > 1 ? 2.5 : 0;

  const segments = visible.map((slice, index) => {
    const length = (slice.amount / total) * circumference;
    const offset = visible
      .slice(0, index)
      .reduce((sum, previous) => sum + (previous.amount / total) * circumference, 0);

    return { slice, dash: Math.max(length - gap, 0), offset };
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 2.5, sm: 3.5 },
      }}
    >
      <Box sx={{ position: "relative", width: 160, height: 160, flexShrink: 0 }}>
        <svg
          viewBox="0 0 120 120"
          width="100%"
          height="100%"
          role="img"
          aria-label={`Completed payments total ${formatCompact(total)}, split by method.`}
        >
          <circle
            cx={60}
            cy={60}
            r={radius}
            fill="none"
            stroke="rgba(17,24,39,0.07)"
            strokeWidth={14}
          />

          <g transform="rotate(-90 60 60)">
            {segments.map(({ slice, dash, offset: start }) => (
              <circle
                key={slice.key}
                cx={60}
                cy={60}
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth={14}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-start}
              />
            ))}
          </g>
        </svg>

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeContent: "center",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: -0.4,
              color: INK,
              ...NUMERIC,
            }}
          >
            {formatCompact(total)}
          </Typography>

          <Typography sx={{ fontSize: 11, color: INK_MUTED }}>collected</Typography>
        </Box>
      </Box>

      <Box sx={{ flex: "1 1 220px", minWidth: 0 }}>
        <SliceLegend slices={slices} total={total} />
      </Box>
    </Box>
  );
}

// -------------------------------------------------
// Status split bar
// -------------------------------------------------

function StatusBreakdown({ items }: { items: StatusPoint[] }) {
  const slices: Slice[] = items.map((item) => ({
    key: item.status,
    label: item.status,
    amount: item.amount,
    count: item.count,
    color: STATUS_COLORS[item.status] ?? INK_MUTED,
  }));

  const totalCount = slices.reduce((sum, slice) => sum + slice.count, 0);

  if (totalCount <= 0) {
    return <EmptyNote message="No payments recorded this month." />;
  }

  return (
    <Box>
      <Box
        role="img"
        aria-label={`Payments by status: ${slices.map((slice) => `${slice.label} ${slice.count}`).join(", ")}.`}
        sx={{
          display: "flex",
          gap: "3px",
          height: 14,
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        {slices
          .filter((slice) => slice.count > 0)
          .map((slice) => (
            <Box
              key={slice.key}
              sx={{
                width: `${(slice.count / totalCount) * 100}%`,
                minWidth: 6,
                bgcolor: slice.color,
              }}
            />
          ))}
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <SliceLegend slices={slices} total={totalCount} basis="count" />
      </Box>
    </Box>
  );
}

// =================================================
// FILTER AUTOCOMPLETE
// =================================================

type FilterOption = {
  value: string;
  label: string;
};

type FilterAutocompleteProps = {
  label: string;

  value: string;

  onChange: (value: string) => void;

  options: FilterOption[];

  allLabel?: string;

  disabled?: boolean;
};

function FilterAutocomplete({
  label,
  value,
  onChange,
  options,
  allLabel = "All",
  disabled = false,
}: FilterAutocompleteProps) {
  const selectedOption =
    options.find((option) => option.value === value) ?? null;

  return (
    <Autocomplete
      fullWidth
      autoHighlight
      clearOnEscape
      disabled={disabled}
      options={options}
      value={selectedOption}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, selected) =>
        option.value === selected.value
      }
      onChange={(_event, option) => {
        onChange(option?.value ?? "");
      }}
      noOptionsText="No options found"
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;

        return (
          <Box
            component="li"
            key={key}
            {...optionProps}
            sx={{
              fontSize: 14,
            }}
          >
            {option.label}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          label={label}
          placeholder={allLabel}
          sx={fieldSx}
        />
      )}
      sx={{
        "& .MuiAutocomplete-inputRoot": {
          bgcolor: "#ffffff",
        },
      }}
    />
  );
}

// =================================================
// COMPONENT
// =================================================

export default function AdminDashboard() {
  const t = useTranslations("adminDashboard");

  const {
    selectedMonth,
    handleMonthChange,

    filters,

    searchInput,
    setSearchInput,

    handleFilterChange,
    handleSearchSubmit,
    handleResetFilters,

    hasActiveFilters,

    overview,

    rankings,
    rankingPagination,

    stageBreakdown,

    payments,
    paymentPagination,

    filterOptions,

    isLoading,
    isFetching,

    loadError,

    refetch,

    handleRankingPageChange,
    handleRankingLimitChange,

    handlePaymentPageChange,
    handlePaymentLimitChange,

    handleStaffClick,
    handleClientClick,

    charts,
  } = useAdminDashboard();

  const [showFilters, setShowFilters] = useState(false);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "grid",
          placeItems: "center",
          bgcolor: CANVAS,
        }}
      >
        <CircularProgress
          size={28}
          sx={{
            color: BRAND,
          }}
        />
      </Box>
    );
  }

  if (!overview) {
    return (
      <Box sx={{ minHeight: "60vh", bgcolor: CANVAS, p: { xs: 2, md: 4 } }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              disabled={isFetching}
              onClick={() => void refetch()}
            >
              Retry
            </Button>
          }
          sx={{ maxWidth: 1320, mx: "auto", borderRadius: `${RADIUS}px` }}
        >
          {loadError || "Dashboard data is unavailable. Please try again."}
        </Alert>
      </Box>
    );
  }

  const targetProgress = Math.min(Math.max(overview.targetAchievement, 0), 100);
  const targetRemaining = Math.max(
    overview.totalTarget - overview.monthlyCollected,
    0,
  );

  const performanceStatusLabel: Record<DashboardPerformanceStatus, string> = {
    "No Target": t("status.noTarget"),

    "Not Started": t("status.notStarted"),

    "In Progress": t("status.inProgress"),

    Achieved: t("status.achieved"),
  };

  // =================================================
  // FILTER OPTIONS
  // =================================================

  const stageOptions = filterOptions.stages.map((stage) => ({
    value: stage.key,

    label: stage.name,
  }));

  const staffOptions = filterOptions.staff.map((staff) => ({
    value: staff.staffId,

    label: `${staff.name} (${staff.staffId})${
      staff.isActive ? "" : " - Inactive"
    }`,
  }));

  const nationalityOptions = filterOptions.nationalities.map((nationality) => ({
    value: nationality,

    label: nationality,
  }));

  const japaneseLevelOptions = filterOptions.japaneseLevels.map((level) => ({
    value: level,

    label: level,
  }));

  const paymentStatusOptions = PAYMENT_STATUS_OPTIONS.map((status) => ({
    value: status,

    label: status,
  }));

  const paymentMethodOptions = PAYMENT_METHOD_OPTIONS.map((method) => ({
    value: method,

    label: method,
  }));

  // =================================================
  // ACTIVE FILTER CHIPS
  // =================================================

  const stageNameOf = (key: string) =>
    filterOptions.stages.find((stage) => stage.key === key)?.name || key;

  const staffNameOf = (id: string) => {
    const staff = filterOptions.staff.find((item) => item.staffId === id);

    return staff ? `${staff.name} (${staff.staffId})` : id;
  };

  const activeChips: {
    key: keyof DashboardFilters;
    label: string;
    value: string;
  }[] = [];

  if (filters.staffId) {
    activeChips.push({
      key: "staffId",
      label: "Staff",
      value: staffNameOf(filters.staffId),
    });
  }

  if (filters.currentStage) {
    activeChips.push({
      key: "currentStage",
      label: "Stage",
      value: stageNameOf(filters.currentStage),
    });
  }

  if (filters.currentVisaStatus) {
    activeChips.push({
      key: "currentVisaStatus",
      label: "Visa",
      value:
        VISA_OPTIONS.find((option) => option.value === filters.currentVisaStatus)
          ?.label || filters.currentVisaStatus,
    });
  }

  if (filters.preferCategory) {
    activeChips.push({
      key: "preferCategory",
      label: "Category",
      value:
        CATEGORY_OPTIONS.find(
          (option) => option.value === filters.preferCategory,
        )?.label || filters.preferCategory,
    });
  }

  if (filters.nationality) {
    activeChips.push({
      key: "nationality",
      label: "Nationality",
      value: filters.nationality,
    });
  }

  if (filters.japaneseLevel) {
    activeChips.push({
      key: "japaneseLevel",
      label: "Japanese",
      value: filters.japaneseLevel,
    });
  }

  if (filters.paymentStatus) {
    activeChips.push({
      key: "paymentStatus",
      label: "Payment status",
      value: filters.paymentStatus,
    });
  }

  if (filters.paymentMethod) {
    activeChips.push({
      key: "paymentMethod",
      label: "Payment method",
      value: filters.paymentMethod,
    });
  }

  if (filters.paymentStage) {
    activeChips.push({
      key: "paymentStage",
      label: "Payment stage",
      value: stageNameOf(filters.paymentStage),
    });
  }

  const activeFilterCount = activeChips.length;

  const canReset = hasActiveFilters || Boolean(searchInput);

  // =================================================
  // CHART DATA
  // =================================================

  const chartData: ChartsData = charts ?? EMPTY_CHARTS;

  const todayKey = dateFormatter.format(new Date());

  const staffChartAll = chartData.staffPerformance.filter(
    (staff) => staff.totalCollected > 0 || staff.targetAmount > 0,
  );

  const staffChartRows = staffChartAll.slice(0, 8);

  const methodSlices: Slice[] = chartData.paymentsByMethod.map(
    (item, index) => ({
      key: item.method,
      label: item.method,
      amount: item.amount,
      count: item.count,
      color:
        METHOD_COLORS[item.method] ??
        FALLBACK_COLORS[index % FALLBACK_COLORS.length],
    }),
  );

  const maxStageCount = stageBreakdown.reduce(
    (highest, item) => Math.max(highest, item.count || 0),
    0,
  );

  return (
    <Box
      sx={{
        bgcolor: CANVAS,

        minHeight: "100vh",

        px: {
          xs: 1.5,

          sm: 3,

          md: 4,
        },

        py: {
          xs: 2.5,

          md: 4,
        },
      }}
    >
      {isFetching && (
        <LinearProgress
          aria-label="Updating dashboard"
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            zIndex: (theme) => theme.zIndex.appBar + 1,
            bgcolor: "transparent",

            "& .MuiLinearProgress-bar": {
              bgcolor: BRAND_BRIGHT,
            },
          }}
        />
      )}

      <Box
        sx={{
          maxWidth: 1320,

          mx: "auto",
        }}
      >
        {/* =================================================
        BREADCRUMB
        ================================================= */}

        <Box
          sx={{
            mb: 2,
          }}
        >
          <Breadcrumb
            items={[
              {
                label: t("dashboard"),

                current: true,
              },
            ]}
          />
        </Box>

        {/* =================================================
        HEADER
        ================================================= */}

        <Box
          sx={{
            display: "flex",

            flexWrap: "wrap",

            alignItems: "flex-end",

            justifyContent: "space-between",

            gap: 2.5,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Box
              sx={{
                display: "inline-flex",

                alignItems: "center",

                gap: 1,

                px: 1.25,

                py: 0.5,

                borderRadius: 999,

                bgcolor: BRAND_SOFT,

                border: "1px solid",

                borderColor: BRAND_LINE,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: BRAND,
                }}
              />

              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  color: BRAND_DEEP,
                }}
              >
                {selectedMonth}
              </Typography>
            </Box>

            <Typography
              component="h1"
              sx={{
                mt: 1.25,

                fontSize: {
                  xs: 24,

                  sm: 28,

                  md: 32,
                },

                fontWeight: 700,

                letterSpacing: -0.8,

                lineHeight: 1.2,

                color: INK,
              }}
            >
              {t("title")}
            </Typography>

            <Typography
              sx={{
                mt: 0.75,

                fontSize: 14,

                color: INK_MUTED,

                maxWidth: 620,

                lineHeight: 1.6,
              }}
            >
              {t("description")}
            </Typography>
          </Box>

          <TextField
            type="month"
            size="small"
            label={t("performanceMonth")}
            value={selectedMonth}
            onChange={(event) => handleMonthChange(event.target.value)}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            sx={{
              ...fieldSx,

              width: {
                xs: "100%",

                sm: 220,
              },
            }}
          />
        </Box>

        {loadError && (
          <Alert
            severity="error"
            sx={{
              mt: 2.5,

              borderRadius: `${RADIUS}px`,

              border: "1px solid rgba(211,47,47,0.14)",
            }}
          >
            {loadError}
          </Alert>
        )}

        {/* =================================================
        FILTERS
        ================================================= */}

        <Paper
          elevation={0}
          sx={{
            ...softCard,

            mt: 3,

            p: 0,

            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              pr: { xs: 1, md: 2 },
              bgcolor: showFilters ? "rgba(16, 122, 100, 0.04)" : "#ffffff",
              transition: "background-color 240ms ease",

              "&:hover": {
                bgcolor: "rgba(16, 122, 100, 0.06)",
              },
            }}
          >
            <ButtonBase
              onClick={() => setShowFilters((open) => !open)}
              aria-expanded={showFilters}
              aria-controls="dashboard-filters-panel"
              sx={{
                flex: 1,
                minWidth: 0,
                px: { xs: 2, sm: 2.5, md: 3 },
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                textAlign: "left",
                borderRadius: 0,
                ...focusRing,
                "&:focus-visible": {
                  outline: `2px solid ${BRAND}`,
                  outlineOffset: -2,
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  minWidth: 0,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    width: 34,
                    height: 34,
                    borderRadius: 2.5,
                    bgcolor: BRAND_SOFT,
                    color: BRAND,
                  }}
                >
                  <TuneOutlinedIcon sx={{ fontSize: 19 }} />
                </Box>

                <Typography
                  component="span"
                  sx={{
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: -0.2,
                    color: INK,
                  }}
                >
                  Dashboard Filters
                </Typography>

                {activeFilterCount > 0 && (
                  <Box
                    component="span"
                    aria-label={`${activeFilterCount} active filters`}
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: 999,
                      bgcolor: BRAND,
                      color: "#ffffff",
                      fontSize: 11,
                      fontWeight: 700,
                      lineHeight: 1.4,
                    }}
                  >
                    {activeFilterCount}
                  </Box>
                )}
              </Box>

              <Box
                component="span"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: BRAND,
                  flexShrink: 0,
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    display: { xs: "none", sm: "inline" },
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {showFilters ? "Hide filters" : "Show filters"}
                </Typography>

                <ExpandMoreOutlinedIcon
                  sx={{
                    fontSize: 22,
                    transform: showFilters ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 300ms ease",
                  }}
                />
              </Box>
            </ButtonBase>

            {canReset && (
              <Button
                variant="text"
                size="small"
                startIcon={<RestartAltOutlinedIcon />}
                onClick={handleResetFilters}
                sx={{
                  flexShrink: 0,
                  color: BRAND,
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 999,

                  "&:hover": {
                    bgcolor: BRAND_SOFT,
                  },
                }}
              >
                Reset
              </Button>
            )}
          </Box>

          <Collapse in={showFilters} unmountOnExit id="dashboard-filters-panel">
            <Box
              sx={{
                px: { xs: 2, sm: 2.5, md: 3 },
                pb: { xs: 2, md: 3 },
                borderTop: `1px solid ${HAIRLINE}`,
                pt: 2.5,
              }}
            >
              {/* =================================================
              SEARCH
              ================================================= */}

              <Box
                component="form"
                onSubmit={handleSearchSubmit}
                sx={{
                  display: "flex",

                  flexDirection: {
                    xs: "column",

                    sm: "row",
                  },

                  gap: 1.5,
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  label="Search"
                  placeholder="Client ID, name, phone, email, staff, stage..."
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  sx={fieldSx}
                />

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SearchOutlinedIcon />}
                  sx={{
                    minWidth: 120,

                    height: 40,

                    flexShrink: 0,

                    borderRadius: `${RADIUS - 4}px`,

                    bgcolor: BRAND,

                    boxShadow: "none",

                    textTransform: "none",

                    fontWeight: 600,

                    "&:hover": {
                      bgcolor: BRAND_DEEP,

                      boxShadow: "none",
                    },
                  }}
                >
                  Search
                </Button>
              </Box>

              {/* =================================================
              AUTOCOMPLETE FILTERS
              ================================================= */}

              <Box
                sx={{
                  mt: 2,

                  display: "grid",

                  gap: 1.5,

                  gridTemplateColumns: {
                    xs: "1fr",

                    sm: "repeat(2, minmax(0, 1fr))",

                    md: "repeat(3, minmax(0, 1fr))",

                    xl: "repeat(4, minmax(0, 1fr))",
                  },
                }}
              >
                <FilterAutocomplete
                  label="Assigned Staff"
                  value={filters.staffId}
                  onChange={(value) => handleFilterChange("staffId", value)}
                  options={staffOptions}
                  allLabel="All Staff"
                />

                <FilterAutocomplete
                  label="Current Stage"
                  value={filters.currentStage}
                  onChange={(value) => handleFilterChange("currentStage", value)}
                  options={stageOptions}
                  allLabel="All Stages"
                />

                <FilterAutocomplete
                  label="Visa Status"
                  value={filters.currentVisaStatus}
                  onChange={(value) =>
                    handleFilterChange("currentVisaStatus", value)
                  }
                  options={VISA_OPTIONS}
                  allLabel="All Visa Types"
                />

                <FilterAutocomplete
                  label="Preferred Category"
                  value={filters.preferCategory}
                  onChange={(value) => handleFilterChange("preferCategory", value)}
                  options={CATEGORY_OPTIONS}
                  allLabel="All Categories"
                />

                <FilterAutocomplete
                  label="Nationality"
                  value={filters.nationality}
                  onChange={(value) => handleFilterChange("nationality", value)}
                  options={nationalityOptions}
                  allLabel="All Nationalities"
                />

                <FilterAutocomplete
                  label="Japanese Level"
                  value={filters.japaneseLevel}
                  onChange={(value) => handleFilterChange("japaneseLevel", value)}
                  options={japaneseLevelOptions}
                  allLabel="All Levels"
                />

                <FilterAutocomplete
                  label="Payment Status"
                  value={filters.paymentStatus}
                  onChange={(value) => handleFilterChange("paymentStatus", value)}
                  options={paymentStatusOptions}
                  allLabel="All Payment Statuses"
                />

                <FilterAutocomplete
                  label="Payment Method"
                  value={filters.paymentMethod}
                  onChange={(value) => handleFilterChange("paymentMethod", value)}
                  options={paymentMethodOptions}
                  allLabel="All Payment Methods"
                />

                <FilterAutocomplete
                  label="Payment Stage"
                  value={filters.paymentStage}
                  onChange={(value) => handleFilterChange("paymentStage", value)}
                  options={stageOptions}
                  allLabel="All Payment Stages"
                />
              </Box>

              <Typography
                role="status"
                sx={{
                  mt: 2,

                  fontSize: 12,

                  color: INK_MUTED,
                }}
              >
                {isFetching
                  ? "Updating dashboard..."
                  : "Collections include completed payments only. Payment status filters the payment table; client stages show the current snapshot."}
              </Typography>
            </Box>
          </Collapse>

          {!showFilters && activeFilterCount > 0 && (
            <Box
              sx={{
                px: { xs: 2, sm: 2.5, md: 3 },
                py: 1.75,
                borderTop: `1px solid ${HAIRLINE}`,
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {activeChips.map((chip) => (
                <Box
                  key={chip.key}
                  component="button"
                  type="button"
                  aria-label={`Remove ${chip.label} filter: ${chip.value}`}
                  onClick={() => handleFilterChange(chip.key, "")}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    maxWidth: "100%",
                    pl: 1.25,
                    pr: 0.75,
                    py: 0.5,
                    font: "inherit",
                    textAlign: "left",
                    borderRadius: 999,
                    bgcolor: "rgba(16, 122, 100, 0.07)",
                    border: "1px solid",
                    borderColor: BRAND_LINE,
                    cursor: "pointer",
                    transition: "background-color 200ms ease",

                    "&:hover": {
                      bgcolor: "rgba(16, 122, 100, 0.14)",
                    },

                    ...focusRing,
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 12,
                      color: INK_MUTED,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {chip.label}
                  </Typography>

                  <Typography
                    component="span"
                    sx={{
                      fontSize: 12,
                      color: BRAND_DEEP,
                      fontWeight: 700,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chip.value}
                  </Typography>

                  <CloseOutlinedIcon
                    sx={{ fontSize: 14, color: INK_MUTED, flexShrink: 0 }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Paper>

        {/* =================================================
        SUMMARY
        ================================================= */}

        <Box
          sx={{
            mt: 2,

            display: "grid",

            gap: 2,

            gridTemplateColumns: {
              xs: "1fr",

              sm: "repeat(2, minmax(0, 1fr))",

              xl: "repeat(4, minmax(0, 1fr))",
            },
          }}
        >
          <SummaryCard
            label={t("totalClients")}
            value={String(overview.totalClients)}
            subtitle={`${overview.monthlyClientCount} paying clients in selected month`}
            icon={<PeopleAltOutlinedIcon fontSize="small" />}
          />

          <SummaryCard
            label={t("activeStaff")}
            value={String(overview.activeStaff)}
            subtitle={`${overview.totalStaff} total staff`}
            icon={<BadgeOutlinedIcon fontSize="small" />}
          />

          <SummaryCard
            label="Collected This Month"
            value={`¥${formatAmount(overview.monthlyCollected)}`}
            subtitle={`${overview.monthlyPaymentCount} completed payments`}
            icon={<PaymentsOutlinedIcon fontSize="small" />}
          />

          <SummaryCard
            label="Total Collected"
            value={`¥${formatAmount(overview.totalCollectedAllTime)}`}
            subtitle={`${overview.totalCompletedPayments} completed payments · ${overview.totalPayingClients} clients`}
            icon={<AccountBalanceWalletOutlinedIcon fontSize="small" />}
          />
        </Box>

        {/* =================================================
        MONTHLY TARGET
        ================================================= */}

        <Paper
          elevation={0}
          sx={{
            mt: 2,

            borderRadius: `${RADIUS}px`,

            border: "1px solid",

            borderColor: "rgba(10, 90, 73, 0.30)",

            overflow: "hidden",

            background: `linear-gradient(135deg, ${BRAND_DEEP} 0%, ${BRAND} 52%, ${BRAND_BRIGHT} 100%)`,

            boxShadow: "0 26px 60px -34px rgba(10, 90, 73, 0.70)",
          }}
        >
          <Box
            sx={{
              p: { xs: 2.5, md: 3.5 },

              display: "flex",

              flexDirection: {
                xs: "column",

                md: "row",
              },

              gap: {
                xs: 3,

                md: 5,
              },

              alignItems: {
                md: "center",
              },
            }}
          >
            {/* =================================================
            PROGRESS SIDE
            ================================================= */}

            <Box
              sx={{
                flex: {
                  md: "0 0 320px",
                },

                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  display: "flex",

                  alignItems: "center",

                  gap: 1.25,
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    width: 34,
                    height: 34,
                    borderRadius: 2.5,
                    bgcolor: "rgba(255,255,255,0.14)",
                    border: "1px solid",
                    borderColor: "rgba(255,255,255,0.22)",
                    color: "#ffffff",
                  }}
                >
                  <TrackChangesOutlinedIcon sx={{ fontSize: 18 }} />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 700,
                      letterSpacing: -0.2,
                      color: "#ffffff",
                    }}
                  >
                    {t("monthlyCollectionTarget")}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.25,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.80)",
                    }}
                  >
                    {selectedMonth}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 2,

                  display: "flex",

                  alignItems: "flex-end",

                  gap: 1.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 40, md: 46 },
                    fontWeight: 700,
                    letterSpacing: -2,
                    lineHeight: 1,
                    color: "#ffffff",
                    ...NUMERIC,
                  }}
                >
                  {overview.targetAchievement}%
                </Typography>

                <Typography
                  sx={{
                    pb: 0.75,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.82)",
                  }}
                >
                  {t("achievement")}
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={targetProgress}
                aria-label={t("monthlyCollectionTarget")}
                sx={{
                  mt: 2,

                  height: 10,

                  borderRadius: 999,

                  bgcolor: "rgba(255, 255, 255, 0.20)",

                  "& .MuiLinearProgress-bar": {
                    borderRadius: 999,

                    backgroundImage:
                      "linear-gradient(90deg, #FFFFFF, #CFF3E6)",

                    transition:
                      "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",

                    "@media (prefers-reduced-motion: reduce)": {
                      transition: "none",
                    },
                  },
                }}
              />
            </Box>

            {/* =================================================
            STATS SIDE
            ================================================= */}

            <Box
              sx={{
                flex: 1,

                minWidth: 0,

                display: "grid",

                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",

                  sm: "repeat(3, minmax(0, 1fr))",
                },

                gap: 3,

                borderTop: {
                  xs: `1px solid rgba(255,255,255,0.18)`,

                  md: "0",
                },

                pt: {
                  xs: 2.5,

                  md: 0,
                },
              }}
            >
              <Stat
                label={t("totalTarget")}
                value={`¥${formatAmount(overview.totalTarget)}`}
              />

              <Stat
                label={t("collected")}
                value={`¥${formatAmount(overview.monthlyCollected)}`}
                color="#CFF3E6"
              />

              <Stat
                label="Remaining"
                value={`¥${formatAmount(targetRemaining)}`}
              />
            </Box>
          </Box>
        </Paper>

        {/* =================================================
        CHARTS
        ================================================= */}

        <Box
          sx={{
            mt: 2,

            display: "grid",

            gap: 2,

            gridTemplateColumns: {
              xs: "1fr",

              lg: "minmax(0, 1.6fr) minmax(0, 1fr)",
            },
          }}
        >
          <ChartCard
            title="Collection trend"
            subtitle="Cumulative collections against the target pace"
            icon={<ShowChartOutlinedIcon sx={{ fontSize: 18 }} />}
          >
            <TrendChart
              days={chartData.dailyCollection}
              totalTarget={overview.totalTarget}
              selectedMonth={selectedMonth}
              todayKey={todayKey}
            />
          </ChartCard>

          <ChartCard
            title="Collected vs target by staff"
            subtitle="Select a staff member to open their page"
            icon={<BarChartOutlinedIcon sx={{ fontSize: 18 }} />}
          >
            <StaffBars
              rows={staffChartRows}
              total={staffChartAll.length}
              onSelect={handleStaffClick}
            />
          </ChartCard>
        </Box>

        <Box
          sx={{
            mt: 2,

            display: "grid",

            gap: 2,

            gridTemplateColumns: {
              xs: "1fr",

              md: "repeat(2, minmax(0, 1fr))",
            },
          }}
        >
          <ChartCard
            title="Payment methods"
            subtitle="Completed payments by method"
            icon={<DonutLargeOutlinedIcon sx={{ fontSize: 18 }} />}
          >
            <DonutChart slices={methodSlices} />
          </ChartCard>

          <ChartCard
            title="Payment status"
            subtitle="Payment counts by status in the selected month"
            icon={<StackedBarChartOutlinedIcon sx={{ fontSize: 18 }} />}
          >
            <StatusBreakdown items={chartData.paymentsByStatus} />
          </ChartCard>
        </Box>

        {/* =================================================
        STAFF RANKING
        ================================================= */}

        <Paper
          elevation={0}
          sx={{
            ...softCard,

            mt: 2,

            p: 0,

            overflow: "hidden",
          }}
        >
          <SectionHeader
            title={t("staffRanking")}
            subtitle={t("staffRankingDescription")}
            icon={<EmojiEventsOutlinedIcon sx={{ fontSize: 18 }} />}
          />

          {/* ---------- Desktop table ---------- */}

          <TableContainer sx={showOnDesktop}>
            <Table
              sx={{
                minWidth: 900,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      ...headCellSx,

                      pl: {
                        xs: 2.5,

                        md: 3,
                      },
                    }}
                  >
                    {t("rank")}
                  </TableCell>

                  <TableCell sx={headCellSx}>{t("staff")}</TableCell>

                  <TableCell sx={headCellSx} align="right">
                    {t("target")}
                  </TableCell>

                  <TableCell sx={headCellSx} align="right">
                    {t("collected")}
                  </TableCell>

                  <TableCell sx={headCellSx} align="right">
                    Target Remaining
                  </TableCell>

                  <TableCell sx={headCellSx} align="right">
                    {t("achievement")}
                  </TableCell>

                  <TableCell sx={headCellSx} align="center">
                    {t("paymentsHeader")}
                  </TableCell>

                  <TableCell sx={headCellSx} align="center">
                    {t("clients")}
                  </TableCell>

                  <TableCell
                    sx={{
                      ...headCellSx,

                      pr: {
                        xs: 2.5,

                        md: 3,
                      },
                    }}
                  >
                    {t("statusHeader")}
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rankings.map((staff) => (
                  <TableRow
                    key={staff.staffId}
                    hover={false}
                    tabIndex={0}
                    sx={{
                      ...rowSx,

                      cursor: "pointer",

                      "&:focus-visible": {
                        outline: `2px solid ${BRAND}`,
                        outlineOffset: -2,
                      },
                    }}
                    onClick={() => handleStaffClick(staff.staffId)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleStaffClick(staff.staffId);
                      }
                    }}
                  >
                    <TableCell
                      sx={{
                        ...bodyCellSx,

                        pl: {
                          xs: 2.5,

                          md: 3,
                        },
                      }}
                    >
                      <RankBadge rank={staff.rank} />
                    </TableCell>

                    <TableCell sx={bodyCellSx}>
                      <Typography
                        sx={{
                          fontSize: 14,

                          fontWeight: 600,

                          color: INK,
                        }}
                      >
                        {staff.staffName}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 12,

                          color: INK_MUTED,
                        }}
                      >
                        {staff.staffId}
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{
                        ...bodyCellSx,

                        ...NUMERIC,

                        color: INK_MUTED,
                      }}
                      align="right"
                    >
                      ¥{formatAmount(staff.targetAmount)}
                    </TableCell>

                    <TableCell
                      sx={{
                        ...bodyCellSx,

                        ...NUMERIC,

                        fontWeight: 700,

                        color: BRAND,
                      }}
                      align="right"
                    >
                      ¥{formatAmount(staff.totalCollected)}
                    </TableCell>

                    <TableCell
                      sx={{
                        ...bodyCellSx,

                        ...NUMERIC,

                        color: INK_MUTED,
                      }}
                      align="right"
                    >
                      ¥{formatAmount(staff.remainingAmount)}
                    </TableCell>

                    <TableCell
                      sx={{
                        ...bodyCellSx,

                        ...NUMERIC,

                        fontWeight: 700,
                      }}
                      align="right"
                    >
                      {staff.achievementPercentage}%

                      <Box
                        sx={{
                          display: "flex",

                          justifyContent: "flex-end",
                        }}
                      >
                        <MiniBar percentage={staff.achievementPercentage} />
                      </Box>
                    </TableCell>

                    <TableCell
                      sx={{ ...bodyCellSx, ...NUMERIC }}
                      align="center"
                    >
                      {staff.paymentCount}
                    </TableCell>

                    <TableCell
                      sx={{ ...bodyCellSx, ...NUMERIC }}
                      align="center"
                    >
                      {staff.clientCount}
                    </TableCell>

                    <TableCell
                      sx={{
                        ...bodyCellSx,

                        pr: {
                          xs: 2.5,

                          md: 3,
                        },
                      }}
                    >
                      <Pill
                        label={performanceStatusLabel[staff.status]}
                        tone={performanceTone(staff.status)}
                      />
                    </TableCell>
                  </TableRow>
                ))}

                {rankings.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      align="center"
                      sx={{
                        ...bodyCellSx,

                        py: 5,

                        color: INK_MUTED,

                        borderBottom: 0,
                      }}
                    >
                      No staff performance data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ---------- Mobile cards ---------- */}

          <Box sx={showOnMobile}>
            {rankings.map((staff) => (
              <Box
                key={staff.staffId}
                role="button"
                tabIndex={0}
                onClick={() => handleStaffClick(staff.staffId)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleStaffClick(staff.staffId);
                  }
                }}
                sx={{
                  ...mobileCardSx,

                  cursor: "pointer",

                  "&:active": {
                    bgcolor: "rgba(16, 122, 100, 0.05)",
                  },

                  "&:focus-visible": {
                    outline: `2px solid ${BRAND}`,
                    outlineOffset: -2,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <RankBadge rank={staff.rank} />

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: INK,
                      }}
                    >
                      {staff.staffName}
                    </Typography>

                    <Typography sx={{ fontSize: 12, color: INK_MUTED }}>
                      {staff.staffId}
                    </Typography>
                  </Box>

                  <Pill
                    label={performanceStatusLabel[staff.status]}
                    tone={performanceTone(staff.status)}
                  />
                </Box>

                <Box
                  sx={{
                    mt: 1.75,
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 20,
                      fontWeight: 700,
                      letterSpacing: -0.4,
                      color: BRAND,
                      ...NUMERIC,
                    }}
                  >
                    ¥{formatAmount(staff.totalCollected)}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12,
                      color: INK_MUTED,
                      ...NUMERIC,
                    }}
                  >
                    {t("target")} ¥{formatAmount(staff.targetAmount)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    mt: 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <MiniBar percentage={staff.achievementPercentage} size="100%" />
                  </Box>

                  <Typography
                    sx={{
                      mt: 0.75,
                      fontSize: 12,
                      fontWeight: 700,
                      color: INK_BODY,
                      ...NUMERIC,
                    }}
                  >
                    {staff.achievementPercentage}%
                  </Typography>
                </Box>

                <Box
                  sx={{
                    mt: 1.75,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: 1.5,
                  }}
                >
                  <CardField label="Remaining">
                    ¥{formatAmount(staff.remainingAmount)}
                  </CardField>

                  <CardField label={t("paymentsHeader")}>
                    {staff.paymentCount}
                  </CardField>

                  <CardField label={t("clients")}>{staff.clientCount}</CardField>
                </Box>
              </Box>
            ))}

            {rankings.length === 0 && (
              <EmptyNote message="No staff performance data found." />
            )}
          </Box>

          <TablePagination
            component="div"
            count={rankingPagination.total}
            page={Math.max(rankingPagination.currentPage - 1, 0)}
            rowsPerPage={rankingPagination.perPage}
            rowsPerPageOptions={[10, 25, 50]}
            onPageChange={(_, page) => handleRankingPageChange(page + 1)}
            onRowsPerPageChange={(event) =>
              handleRankingLimitChange(Number(event.target.value))
            }
            sx={paginationSx}
          />
        </Paper>

        {/* =================================================
        CLIENT PROGRESS
        ================================================= */}

        <Paper
          elevation={0}
          sx={{
            ...softCard,

            ...cardLift,

            mt: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: 1.25,
            }}
          >
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                width: 34,
                height: 34,
                borderRadius: 2.5,
                bgcolor: BRAND_SOFT,
                color: BRAND,
              }}
            >
              <PeopleAltOutlinedIcon sx={{ fontSize: 18 }} />
            </Box>

            <Typography
              sx={{
                fontSize: 16,

                fontWeight: 700,

                letterSpacing: -0.2,

                color: INK,
              }}
            >
              {t("clientProgress")}
            </Typography>
          </Box>

          {stageBreakdown.length === 0 ? (
            <Typography
              sx={{
                mt: 2,

                fontSize: 14,

                color: INK_MUTED,
              }}
            >
              {t("noClientData")}
            </Typography>
          ) : (
            <Box
              sx={{
                mt: 2,

                display: "grid",

                gap: 1.25,

                gridTemplateColumns: {
                  xs: "1fr",

                  sm: "repeat(auto-fill, minmax(260px, 1fr))",
                },
              }}
            >
              {stageBreakdown.map((item) => (
                <StageRow
                  key={item.stage || item.stageName}
                  name={item.stageName}
                  count={item.count}
                  max={maxStageCount}
                />
              ))}
            </Box>
          )}
        </Paper>

        {/* =================================================
        PAYMENTS
        ================================================= */}

        <Paper
          elevation={0}
          sx={{
            ...softCard,

            mt: 2,

            p: 0,

            overflow: "hidden",
          }}
        >
          <SectionHeader
            title="Payments"
            subtitle={`Payments for ${selectedMonth}`}
            icon={<ReceiptLongOutlinedIcon sx={{ fontSize: 18 }} />}
          />

          {/* ---------- Desktop table ---------- */}

          <TableContainer sx={showOnDesktop}>
            <Table
              size="small"
              sx={{
                minWidth: 820,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      ...headCellSx,

                      pl: {
                        xs: 2.5,

                        md: 3,
                      },
                    }}
                  >
                    Client
                  </TableCell>

                  <TableCell sx={headCellSx}>Stage</TableCell>

                  <TableCell sx={headCellSx} align="right">
                    Amount
                  </TableCell>

                  <TableCell sx={headCellSx}>Method</TableCell>

                  <TableCell sx={headCellSx}>Status</TableCell>

                  <TableCell sx={headCellSx}>Staff</TableCell>

                  <TableCell
                    sx={{
                      ...headCellSx,

                      pr: {
                        xs: 2.5,

                        md: 3,
                      },
                    }}
                  >
                    Date
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment._id} hover={false} sx={rowSx}>
                    <TableCell
                      sx={{
                        ...bodyCellSx,

                        pl: {
                          xs: 2.5,

                          md: 3,
                        },
                      }}
                    >
                      <Typography
                        component="button"
                        type="button"
                        onClick={() => handleClientClick(payment.clientId)}
                        sx={{
                          p: 0,

                          border: 0,

                          bgcolor: "transparent",

                          font: "inherit",

                          fontSize: 14,

                          fontWeight: 600,

                          color: BRAND,

                          cursor: "pointer",

                          textAlign: "left",

                          "&:hover": {
                            textDecoration: "underline",
                          },

                          ...focusRing,
                        }}
                      >
                        {payment.clientId}
                      </Typography>

                      {payment.clientName && (
                        <Typography
                          sx={{
                            mt: 0.25,

                            fontSize: 12,

                            color: INK_MUTED,
                          }}
                        >
                          {payment.clientName}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell sx={bodyCellSx}>{payment.stageName}</TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        ...bodyCellSx,

                        ...NUMERIC,

                        fontWeight: 700,

                        color: INK,
                      }}
                    >
                      ¥{formatAmount(payment.amountPaid)}
                    </TableCell>

                    <TableCell sx={bodyCellSx}>{payment.paymentMethod}</TableCell>

                    <TableCell sx={bodyCellSx}>
                      <Pill
                        label={payment.paymentStatus}
                        tone={paymentTone(payment.paymentStatus)}
                      />
                    </TableCell>

                    <TableCell
                      sx={{
                        ...bodyCellSx,

                        color: INK_BODY,
                      }}
                    >
                      {payment.creditedStaffName}

                      <Typography
                        sx={{
                          fontSize: 11,

                          color: INK_MUTED,
                        }}
                      >
                        {payment.creditedStaff}
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{
                        ...bodyCellSx,

                        ...NUMERIC,

                        pr: {
                          xs: 2.5,

                          md: 3,
                        },

                        color: INK_MUTED,

                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatJapanDate(payment.paymentDate)}
                    </TableCell>
                  </TableRow>
                ))}

                {payments.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{
                        ...bodyCellSx,

                        py: 5,

                        color: INK_MUTED,

                        borderBottom: 0,
                      }}
                    >
                      No payments found for the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ---------- Mobile cards ---------- */}

          <Box sx={showOnMobile}>
            {payments.map((payment) => (
              <Box key={payment._id} sx={mobileCardSx}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      component="button"
                      type="button"
                      onClick={() => handleClientClick(payment.clientId)}
                      sx={{
                        p: 0,
                        border: 0,
                        bgcolor: "transparent",
                        font: "inherit",
                        fontSize: 14,
                        fontWeight: 600,
                        color: BRAND,
                        cursor: "pointer",
                        textAlign: "left",
                        ...focusRing,
                      }}
                    >
                      {payment.clientId}
                    </Typography>

                    {payment.clientName && (
                      <Typography sx={{ mt: 0.25, fontSize: 12, color: INK_MUTED }}>
                        {payment.clientName}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: INK,
                        ...NUMERIC,
                      }}
                    >
                      ¥{formatAmount(payment.amountPaid)}
                    </Typography>

                    <Box sx={{ mt: 0.5 }}>
                      <Pill
                        label={payment.paymentStatus}
                        tone={paymentTone(payment.paymentStatus)}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 1.75,
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 1.5,
                  }}
                >
                  <CardField label="Stage">{payment.stageName}</CardField>

                  <CardField label="Method">{payment.paymentMethod}</CardField>

                  <CardField label="Staff">
                    {payment.creditedStaffName} ({payment.creditedStaff})
                  </CardField>

                  <CardField label="Date">
                    {formatJapanDate(payment.paymentDate)}
                  </CardField>
                </Box>
              </Box>
            ))}

            {payments.length === 0 && (
              <EmptyNote message="No payments found for the selected filters." />
            )}
          </Box>

          <TablePagination
            component="div"
            count={paymentPagination.total}
            page={Math.max(paymentPagination.currentPage - 1, 0)}
            rowsPerPage={paymentPagination.perPage}
            rowsPerPageOptions={[10, 25, 50]}
            onPageChange={(_, page) => handlePaymentPageChange(page + 1)}
            onRowsPerPageChange={(event) =>
              handlePaymentLimitChange(Number(event.target.value))
            }
            sx={paginationSx}
          />
        </Paper>
      </Box>
    </Box>
  );
}
