import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await connectDB();
                const user = await User.findOne({ email: credentials?.email });
                if (!user || !user.password) throw new Error("Invalid credentials");

                const isValid = await bcrypt.compare(credentials!.password, user.password);
                if (!isValid) throw new Error("Invalid credentials");

                return { id: user._id.toString(), name: user.name, email: user.email };
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        // ⬇️ THIS IS THE IMPORTANT PART FOR GOOGLE SAVING ⬇️
        async signIn({ account, profile }) {
            // Check if the user is logging in using Google
            if (account?.provider === "google") {
                try {
                    await connectDB();

                    // Check if the user already exists in your Mongoose DB
                    const userExists = await User.findOne({ email: profile?.email });

                    if (!userExists) {
                        // If they don't exist, create a new user record
                        await User.create({
                            name: profile?.name,
                            email: profile?.email,
                            // Leave password empty/null or omit it since Google users don't have a password
                            password: null
                        });
                    }
                } catch (error) {
                    console.error("Error saving Google user to DB:", error);
                    return false; // Deny sign-in if database operations fail
                }
            }
            return true; // Allow sign-in
        },

        // Attach user ID from database to the JWT token
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            } else if (!token.id && token.email) {
                // Fetch ID from DB for Google users who are already logged in
                await connectDB();
                const dbUser = await User.findOne({ email: token.email });
                if (dbUser) token.id = dbUser._id.toString();
            }
            return token;
        },

        // Make user ID accessible in the frontend useSession hook
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
