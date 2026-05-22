"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  Rating,
  Stack,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import NotesIcon from "@mui/icons-material/Notes";
import { CheckIn, Mood } from "@/types";

const MOOD_COLOR: Record<Mood, string> = {
  Happy:   "#4A8B78",
  Excited: "#E18C5F",
  Neutral: "#7A9E96",
  Anxious: "#C4693A",
  Sad:     "#3D6659",
};

const MOOD_EMOJI: Record<Mood, string> = {
  Happy: "😊",
  Excited: "🎉",
  Neutral: "😐",
  Anxious: "😰",
  Sad: "😢",
};

interface Props {
  checkin: CheckIn | null;
  open: boolean;
  onClose: () => void;
  showEmployee?: boolean;
}

export default function CheckinDetailDialog({
  checkin,
  open,
  onClose,
  showEmployee = false,
}: Props) {
  if (!checkin) return null;

  const color = MOOD_COLOR[checkin.mood];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Check-In Details</DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 3,
            mb: 2,
            borderRadius: 2,
            bgcolor: `${color}12`,
            border: `1px solid ${color}35`,
          }}
        >
          <Typography sx={{ fontSize: 56, lineHeight: 1 }}>
            {MOOD_EMOJI[checkin.mood]}
          </Typography>
          <Typography variant="h5" sx={{ mt: 1 }}>
            {checkin.mood}
          </Typography>
          <Chip
            label={checkin.mood}
            size="small"
            sx={{ mt: 1, bgcolor: color, color: "white" }}
          />
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        <Stack spacing={2.5}>
          <Box>
            <Typography
              variant="overline"
              color="text.secondary"
              display="block"
            >
              Wellbeing Rating
            </Typography>
            <Stack direction="row" alignItems="center" gap={1} mt={0.5}>
              <Rating value={checkin.rating} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({checkin.rating} / 5)
              </Typography>
            </Stack>
          </Box>

          {showEmployee && (
            <Stack direction="row" alignItems="flex-start" gap={1}>
              <PersonIcon fontSize="small" color="action" sx={{ mt: 0.2 }} />
              <Box>
                <Typography variant="overline" color="text.secondary" display="block">
                  Employee
                </Typography>
                <Typography variant="body1">{checkin.userName}</Typography>
              </Box>
            </Stack>
          )}

          <Stack direction="row" alignItems="flex-start" gap={1}>
            <CalendarTodayIcon
              fontSize="small"
              color="action"
              sx={{ mt: 0.2 }}
            />
            <Box>
              <Typography variant="overline" color="text.secondary" display="block">
                Submitted
              </Typography>
              <Typography variant="body1">
                {new Date(checkin.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
          </Stack>

          {/* Note */}
          {checkin.note ? (
            <Stack direction="row" alignItems="flex-start" gap={1}>
              <NotesIcon fontSize="small" color="action" sx={{ mt: 0.2 }} />
              <Box>
                <Typography variant="overline" color="text.secondary" display="block">
                  Note
                </Typography>
                <Typography variant="body1">{checkin.note}</Typography>
              </Box>
            </Stack>
          ) : (
            <Typography
              variant="body2"
              color="text.disabled"
              sx={{ fontStyle: "italic" }}
            >
              No note was added for this check-in.
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
