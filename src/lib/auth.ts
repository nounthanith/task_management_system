// lib/auth.ts
import { AuthOptions, getServerSession } from "next-auth";
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
        async signIn({ account, profile }) {
            if (account?.provider === "google") {
                try {
                    await connectDB();
                    const userExists = await User.findOne({ email: profile?.email });
                    if (!userExists) {
                        await User.create({
                            name: profile?.name,
                            email: profile?.email,
                            password: null
                        });
                    }
                } catch (error) {
                    console.error("Error saving Google user to DB:", error);
                    return false;
                }
            }
            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                // On sign-in, resolve the real Mongo id for the account by email.
                // (Google/credentials providers pass a provider-specific user.id,
                // which is not the Mongo _id stored on our User documents.)
                if (token.email) {
                    await connectDB();
                    const dbUser = await User.findOne({ email: token.email });
                    if (dbUser) token.id = dbUser._id.toString();
                }
                if (!token.id) token.id = user.id;
            } else if (!token.id && token.email) {
                // Refresh path: fetch the id for returning users.
                await connectDB();
                const dbUser = await User.findOne({ email: token.email });
                if (dbUser) token.id = dbUser._id.toString();
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                (session.user as { id?: string }).id = token.id as string;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

/** Get the authenticated user's MongoDB id, or null if not signed in. */
export async function getUserId(): Promise<string | null> {
    const session = await getServerSession(authOptions);
    const id = (session?.user as { id?: string } | undefined)?.id;
    return typeof id === "string" && id ? id : null;
}
