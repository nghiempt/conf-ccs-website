import React from "react";
import ThemeRegistry from "@/theme/theme-registry";
import "./globals.css";
import { Montserrat } from "next/font/google";
import ProvidersContext from "@/context/providers-context";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "CCS 2024",
  description: "CCS 2024",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({
  children,
}) => {
  return (
    <html lang="en">
      <ThemeRegistry>
        <body className={montserrat.className}>
          <ProvidersContext>{children}</ProvidersContext>
        </body>
      </ThemeRegistry>
    </html>
  );
};

export default RootLayout;
