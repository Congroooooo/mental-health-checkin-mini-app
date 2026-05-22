"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  TooltipProps,
} from "recharts";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { CheckIn, Mood } from "@/types";

const MOOD_COLOR: Record<Mood, string> = {
  Happy:   "#4A8B78",
  Excited: "#E18C5F",
  Neutral: "#7A9E96",
  Anxious: "#C4693A",
  Sad:     "#3D6659",
};

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        px: 2,
        py: 1,
        boxShadow: 3,
      }}
    >
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {payload[0].name}: {payload[0].value}
      </Typography>
    </Box>
  );
}

interface MoodChartProps {
  checkins: CheckIn[];
}

export default function MoodChart({ checkins }: MoodChartProps) {
  const ratingOverTime = useMemo(() => {
    const grouped: Record<string, number[]> = {};

    checkins.forEach((c) => {
      const label = new Date(c.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!grouped[label]) grouped[label] = [];
      grouped[label].push(c.rating);
    });

    return Object.entries(grouped)
      .map(([date, ratings]) => ({
        date,
        _ts: new Date(checkins.find((c) =>
          new Date(c.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }) === date
        )!.createdAt).getTime(),
        avgRating: parseFloat(
          (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        ),
      }))
      .sort((a, b) => a._ts - b._ts)
      .map(({ date, avgRating }) => ({ date, avgRating })); // drop _ts
  }, [checkins]);

  const moodDistribution = useMemo(() => {
    const counts: Partial<Record<Mood, number>> = {};
    checkins.forEach((c) => {
      counts[c.mood] = (counts[c.mood] ?? 0) + 1;
    });
    return (Object.entries(counts) as [Mood, number][]).map(
      ([mood, count]) => ({ mood, count })
    );
  }, [checkins]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <Paper sx={{ p: 3, height: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Average Wellbeing Rating Over Time
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Team-wide average wellness score (1–5) per day
          </Typography>

          <ResponsiveContainer width="100%" height={240}>
            <LineChart
              data={ratingOverTime}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="avgRating"
                name="Avg Rating"
                stroke="#4A8B78"
                strokeWidth={2.5}
                dot={{ r: 5, fill: "#4A8B78", strokeWidth: 0 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={5}>
        <Paper sx={{ p: 3, height: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Mood Distribution
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Total check-ins per mood type
          </Typography>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={moodDistribution}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="mood"
                width={65}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Check-ins" radius={[0, 4, 4, 0]}>
                {moodDistribution.map((entry) => (
                  <Cell
                    key={entry.mood}
                    fill={MOOD_COLOR[entry.mood] ?? "#6B7280"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}
