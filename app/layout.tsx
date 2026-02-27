// Update: app/layout.tsx
import "./globals.css";
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Providers from './providers';

export const metadata = {
    title: "Crown Standard",
    description: "Premium cleaning services by trusted professionals.",
    icons :{
        icon: "/logo.png"
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="min-h-screen antialiased bg-background text-foreground">
            
                <AuthProvider>

                        <ToastProvider>
                                <Providers>
                                    <main>{children}</main>
                                </Providers>
                        </ToastProvider>

                </AuthProvider>
          
            </body>
        </html>
    );
}
