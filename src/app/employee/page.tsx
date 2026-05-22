"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Box,
  Button,
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "@/contexts/AuthContext";
import NavBar from "@/components/NavBar";
import CheckinDialog from "@/components/CheckinDialog";
import CheckinDetailDialog from "@/components/CheckinDetailDialog";
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

const ROWS_PER_PAGE = 5;

export default function EmployeePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [newCheckinOpen, setNewCheckinOpen] = useState(false);
  const [detailCheckin, setDetailCheckin] = useState<CheckIn | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace("/");
    else if (user.role !== "employee") router.replace("/manager");
  }, [user, authLoading, router]);

  const swrKey = user
    ? `/api/checkins?userId=${user.id}&page=${page + 1}&limit=${ROWS_PER_PAGE}`
    : null;

  const { data, error, isLoading, mutate } =
    useSWR<PaginatedCheckIns>(swrKey, fetcher);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this check-in? This action cannot be undone.")) return;

    await fetch(`/api/checkins?id=${id}`, { method: "DELETE" });

    mutate();

    if (data?.data.length === 1 && page > 0) setPage((p) => p - 1);
  };

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

      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h5">My Check-Ins</Typography>
            <Typography variant="body2" color="text.secondary">
              Hello, {user.name} — here is a summary of your wellness
              submissions.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setNewCheckinOpen(true)}
          >
            New Check-In
          </Button>
        </Stack>

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
                  <TableCell>Mood</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {/* Loading state */}
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={32} />
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && data?.data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">
                        No check-ins yet — submit your first one above!
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  data?.data.map((checkin) => (
                    <TableRow key={checkin.id} hover>
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

                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(checkin.id)}
                          >
                            <DeleteIcon fontSize="small" />
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

      <CheckinDialog
        open={newCheckinOpen}
        onClose={() => setNewCheckinOpen(false)}
        onSuccess={() => {
          setPage(0);
          mutate();
        }}
      />

      <CheckinDetailDialog
        checkin={detailCheckin}
        open={Boolean(detailCheckin)}
        onClose={() => setDetailCheckin(null)}
      />
    </Box>
  );
}
