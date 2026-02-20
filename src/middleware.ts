export { default } from "next-auth/middleware";

// This tells the security guard exactly which pages to protect
export const config = {
  matcher: [
    "/" // Protects the main Kanban board
  ],
};