// Update: app/layout.tsx
import "./globals.css";
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

export const metadata = {
    title: "Crown Standard",
    description: "Premium cleaning services by trusted professionals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="min-h-screen antialiased bg-background text-foreground">
                <AuthProvider>
                    <ToastProvider>
                        <main>{children}</main>
                    </ToastProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
