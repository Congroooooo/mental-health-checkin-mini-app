"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Rating,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Mood } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

const MOODS: Mood[] = ["Happy", "Excited", "Neutral", "Anxious", "Sad"];

const MOOD_META: Record<Mood, { emoji: string; label: string }> = {
  Happy: { emoji: "😊", label: "Happy" },
  Excited: { emoji: "🎉", label: "Excited" },
  Neutral: { emoji: "😐", label: "Neutral" },
  Anxious: { emoji: "😰", label: "Anxious" },
  Sad: { emoji: "😢", label: "Sad" },
};

const RATING_LABELS: Record<number, string> = {
  1: "Very Poor",
  2: "Poor",
  3: "Okay",
  4: "Good",
  5: "Excellent",
};

interface CheckinDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckinDialog({
  open,
  onClose,
  onSuccess,
}: CheckinDialogProps) {
  const { user } = useAuth();

  const [mood, setMood] = useState<Mood>("Neutral");
  const [rating, setRating] = useState<number>(3);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setMood("Neutral");
    setRating(3);
    setNote("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          mood,
          rating,
          note: note.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to submit. Please try again.");
        return;
      }

      onSuccess();
      handleClose();
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" gap={1}>
          <AddCircleOutlineIcon color="primary" />
          New Mental Health Check-In
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Take a moment to reflect. Your response is confidential.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="mood-label">How are you feeling today?</InputLabel>
          <Select
            labelId="mood-label"
            value={mood}
            label="How are you feeling today?"
            onChange={(e) => setMood(e.target.value as Mood)}
          >
            {MOODS.map((m) => (
              <MenuItem key={m} value={m}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <span style={{ fontSize: 20 }}>{MOOD_META[m].emoji}</span>
                  <span>{MOOD_META[m].label}</span>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={500} gutterBottom>
            Rate your overall wellbeing (1–5)
          </Typography>
          <Rating
            value={rating}
            onChange={(_, val) => setRating(val ?? 1)}
            size="large"
          />
          <Typography variant="caption" color="text.secondary" display="block">
            {RATING_LABELS[rating]}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Add a note (optional)"
          multiline
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What's on your mind? Anything you'd like to share…"
          inputProps={{ maxLength: 500 }}
          helperText={`${note.length} / 500`}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {loading ? "Submitting…" : "Submit Check-In"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
