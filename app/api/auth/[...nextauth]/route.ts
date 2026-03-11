import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

console.log("Client Id " + process.env.GOOGLE_ID)
console.log("GOOGLE_SECRET " + process.env.GOOGLE_SECRET)

const authOptions: NextAuthOptions = {

  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    // ...add more providers here
  ],
  // pages: {
  //   signIn: "/googlelogin",
  //   error: "/login",
  // },
  // session: {
  //   strategy: "jwt",
  //   maxAge: 30 * 24 * 60 * 60, // 30 days
  // },
  // jwt: {
  //   secret: process.env.NEXTAUTH_SECRET,
  // },
  // secret: process.env.NEXTAUTH_SECRET,
  // callbacks: {
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.id = user.id
  //     }
  //     console.log(token)
  //     return token
  //   },
  //   // async session({ session, token }) {
  //   //   if (session.user) {
  //   //     session.user.id = token.id as string
  //   //   }
  //   //   return session
  //   // },
  // },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
