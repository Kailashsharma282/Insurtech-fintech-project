import type { Metadata } from "next";
import "./globals.css";
import { RoleProvider } from "@/context/RoleContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import { FarmerBottomNav } from "@/components/layout/FarmerBottomNav";
import { Footer } from "@/components/layout/Footer";
import { LanguageModal } from "@/components/ui/LanguageModal";
import { FullPageTranslator } from "@/components/ui/FullPageTranslator";
import { FloatingGuidanceBar } from "@/components/ui/FloatingGuidanceBar";

export const metadata: Metadata = {
  title: "AgriSure Intelligence | Satellite Remote Sensing × Agronomic AI × IoT Telemetry × Parametric Underwriting",
  description: "Production-grade smart agriculture & parametric insurtech platform for early stress detection, GA-PSO nutrient optimization, and automated claim settlement.",
  keywords: ["InsurTech", "Smart Agriculture", "Parametric Insurance", "Crop Health Factor", "Satellite Remote Sensing", "Sentinel-2", "IoT Telemetry", "West Bengal Farming"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] antialiased">
        <RoleProvider>
          <LanguageProvider>
            <FullPageTranslator />
            <LanguageModal />
            <Navbar />
            <main className="flex-1 w-full">
              {children}
            </main>
            <FloatingGuidanceBar />
            <FarmerBottomNav />
            <Footer />
          </LanguageProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
