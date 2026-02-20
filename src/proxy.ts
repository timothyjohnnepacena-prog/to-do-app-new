import { withAuth } from "next-auth/middleware";

export default withAuth;

export const config = {
  matcher: [
    "/" // Protects the main Kanban board
  ],
};