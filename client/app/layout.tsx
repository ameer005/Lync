import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Global from "@/components/modals/Global";
import Providers from "@/utils/provider";
import ToastNotification from "@/components/ui/Toast";
import Notification from "@/components/ui/Notification";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${roboto.variable}`} lang="en">
      <body className="font-roboto bg-colorBg text-colorText text-sm h-screen">
        <Providers>
          <main>{children}</main>

          <Global />
          <div id="modal-auth"></div>

          <ToastNotification />
          {/* <Notification /> */}
        </Providers>
      </body>
    </html>
  );
}
