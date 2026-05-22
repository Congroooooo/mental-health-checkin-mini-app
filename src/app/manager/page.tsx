"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Rating,
  TablePagination,
  CircularProgress,
  Alert,
  Stack,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAuth } from "@/contexts/AuthContext";
import NavBar from "@/components/NavBar";
import CheckinDetailDialog from "@/components/CheckinDetailDialog";
import MoodChart from "@/components/MoodChart";
import { CheckIn, Mood, PaginatedCheckIns } from "@/types";


const MOOD_COLOR: Record<Mood, string> = {
  Happy:   "#4A8B78",
  Excited: "#E18C5F",
  Neutral: "#7A9E96",
  Anxious: "#C4693A",
  Sad:     "#3D6659",
};

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("API error");
    return r.json();
  });

const ROWS_PER_PAGE = 8;

export default function ManagerPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [detailCheckin, setDetailCheckin] = useState<CheckIn | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace("/");
    else if (user.role !== "manager") router.replace("/employee");
  }, [user, authLoading, router]);

  const tableKey = user
    ? `/api/checkins?page=${page + 1}&limit=${ROWS_PER_PAGE}`
    : null;
  const { data, error, isLoading } = useSWR<PaginatedCheckIns>(
    tableKey,
    fetcher
  );

  const { data: allData } = useSWR<PaginatedCheckIns>(
    user ? "/api/checkins?page=1&limit=1000" : null,
    fetcher
  );

  if (authLoading || !user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <NavBar />

      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Stack sx={{ mb: 4 }}>
          <Typography variant="h5">Manager Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of all employee mental health check-ins across the
            organisation.
          </Typography>
        </Stack>

        {allData?.data && allData.data.length > 0 && (
          <>
            <MoodChart checkins={allData.data} />
            <Divider sx={{ my: 4 }} />
          </>
        )}

        <Typography variant="h6" sx={{ mb: 2 }}>
          All Employee Check-Ins
        </Typography>

        <Paper>
          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              Failed to load check-ins. Please refresh the page.
            </Alert>
          )}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Mood</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={32} />
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && data?.data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">
                        No check-ins found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  data?.data.map((checkin) => (
                    <TableRow key={checkin.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {checkin.userName}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={checkin.mood}
                          size="small"
                          sx={{
                            bgcolor: `${MOOD_COLOR[checkin.mood]}18`,
                            color: MOOD_COLOR[checkin.mood],
                            borderColor: `${MOOD_COLOR[checkin.mood]}40`,
                          }}
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell>
                        <Rating
                          value={checkin.rating}
                          readOnly
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          sx={{ maxWidth: 220 }}
                        >
                          {checkin.note ?? "—"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {new Date(checkin.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => setDetailCheckin(checkin)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={data?.total ?? 0}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={ROWS_PER_PAGE}
            rowsPerPageOptions={[ROWS_PER_PAGE]}
          />
        </Paper>
      </Box>

      <CheckinDetailDialog
        checkin={detailCheckin}
        open={Boolean(detailCheckin)}
        onClose={() => setDetailCheckin(null)}
        showEmployee
      />
    </Box>
  );
}
