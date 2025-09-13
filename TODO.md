# TODO: Fix Owner and Admin Rating Issue

## Completed Tasks
- [x] Analyzed the issue: Owners and admins get 403 Forbidden when trying to rate stores
- [x] Identified root cause: Server-side middleware `isUser` restricts rating to role "user" only
- [x] Decided on client-side fix: Prevent owners/admins from attempting to rate by checking user role and showing alert
- [x] Updated client/src/pages/UserDashboard.jsx to import useAuth and check user role before rating
- [x] Added role check in submitRating and updateRating functions to show "Owner and admin cannot rate" alert

## Next Steps
- [x] Installed dependencies for server and client
- [x] Verified code changes are correct and will prevent 403 errors for owners/admins
- [ ] Test the fix by logging in as owner/admin and attempting to rate (requires running the application)
- [ ] Verify that regular users can still rate normally
- [ ] Ensure no other parts of the app are affected

# TODO: Remove Send Response Field from Owner Dashboard

## Completed Tasks
- [x] Analyze OwnerDashboard.jsx to identify response-related code
- [x] Remove responseMap state, sendResponse function, and related UI elements
- [x] Keep feedback rating display intact

## Next Steps
- [ ] Test the Owner Dashboard UI to confirm changes
- [ ] Verify ratings display correctly without response functionality
