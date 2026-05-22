"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "#2D4A40",
        color: "#FFFFFF",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar>
        {/* Brand */}
        <FavoriteIcon sx={{ color: "#E18C5F", mr: 1 }} />
        <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1, color: "#FFFFFF" }}>
          MindCheck
        </Typography>

        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: "#4A8B78",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {user.name.charAt(0)}
            </Avatar>

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography variant="body2" fontWeight={600} lineHeight={1.2} color="#FFFFFF">
                {user.name}
              </Typography>
              <Chip
                label={user.role === "manager" ? "Manager" : "Employee"}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 10,
                  mt: 0.3,
                  bgcolor: user.role === "manager" ? "#E18C5F" : "#4A8B78",
                  color: "#FFFFFF",
                }}
              />
            </Box>

            <Button
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                ml: 1,
                color: "rgba(255,255,255,0.75)",
                "&:hover": { color: "#FFFFFF", bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
