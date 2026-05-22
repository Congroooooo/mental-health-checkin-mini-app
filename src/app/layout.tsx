import type { Metadata } from "next";
import ThemeRegistry from "@/components/ThemeRegistry";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "MindCheck | HR Wellness",
  description: "Mental health check-in platform for employees and managers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AuthProvider>{children}</AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
