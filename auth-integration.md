/**
 * LEARNING REPOSITORY NOTE:
 *
 * This repo is for learning TanStack Start + Firebase Data Connect.
 * The auth bridge documented below is NOT implemented YET.
 *
 * WHY NOT NOW?
 * - This is a learning project, implementing the Clerk → Firebase token bridge
 *   is a complex step that will be tackled in a future learning session.
 * - Current focus: Understanding Data Connect schema, queries, and mutations
 *   without auth complexity.
 *
 * NEXT STEPS:
 * When ready to learn auth integration, refer to REQUIREMENTS FOR THIS TO WORK
 * section below and implement the token bridge.
 *
 * CURRENT BEHAVIOR:
 * - Read queries (getSkills, getUsers) may work without auth
 * - Authenticated mutations (createSkill) will fail with auth errors
 * - This is EXPECTED for the current learning stage
 */

/**
 * CLERK + FIREBASE DATA CONNECT INTEGRATION NOTE
 *
 * Firebase Data Connect's @auth directive only understands Firebase Auth tokens.
 * Clerk is not natively supported, so a token bridge is required for authenticated
 * mutations (e.g. CreateSkill with @auth(level: USER)) to work.
 *
 * HOW THE BRIDGE WORKS:
 * Clerk's userId is exchanged for a Firebase custom token via Firebase Admin SDK
 * on the server. The client then signs into Firebase silently using that token.
 * Once signed in, the Firebase Data Connect SDK automatically attaches the Firebase
 * ID token to every request, satisfying the @auth directive. The Clerk userId
 * becomes auth.uid inside Data Connect, which is why authorClerkId_expr: "auth.uid"
 * works correctly in the mutation.
 *
 * REQUIREMENTS FOR THIS TO WORK:
 * - firebase-admin must be installed and initialized with a service account
 * - FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY must be set in .env
 * - Firebase Auth must be enabled in the Firebase console (even if unused for login UI)
 * - The client must call signInWithCustomToken() before executing any authenticated mutation
 * - useFirebaseAuthSync() must be mounted at the root so the Firebase session stays
 *   in sync with the Clerk session (sign in / sign out)
 *
 * CAVEATS:
 * - Firebase Auth is not used for any actual authentication UI or user management.
 *   It exists solely as a bridge to satisfy Data Connect's token requirements.
 * - This adds a round-trip on first load to exchange the Clerk token for a Firebase token.
 * - If Firebase Admin SDK is not initialized before the server function runs, the
 *   getApps().length guard prevents duplicate initialization errors during SSR.
 */