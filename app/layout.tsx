import type { Metadata } from "next";
import "./globals.css";
// import localFont from "next/font/local";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-react-buttons/styles/material.css";
import "@syncfusion/ej2-react-grids/styles/material.css";
import "@syncfusion/ej2-react-splitbuttons/styles/material.css";
import "@syncfusion/ej2-react-dropdowns/styles/material.css";


// const ibmPlexSans = localFont({
//   src: [
//     { path: "/fonts/IBMPlexSans-Regular.ttf", weight: "400", style: "normal" },
//     { path: "/fonts/IBMPlexSans-Medium.ttf", weight: "500", style: "normal" },
//     { path: "/fonts/IBMPlexSans-SemiBold.ttf", weight: "600", style: "normal" },
//     { path: "/fonts/IBMPlexSans-Bold.ttf", weight: "700", style: "normal" },
//   ],
// });

// const bebasNeue = localFont({
//   src: [
//     { path: "/fonts/BebasNeue-Regular.ttf", weight: "400", style: "normal" },
//   ],
//   variable: "--bebas-neue",
// });

export const metadata: Metadata = {
  title: "BookWise",
  description:
    "BookWise is a book borrowing university library management solution.",
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body className={`antialiased`}>
          {children}
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
};

export default RootLayout;