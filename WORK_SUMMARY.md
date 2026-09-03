# FortuneLink Work Summary

## What We Are Building

FortuneLink admin dashboard has two roles:

- `superadmin`
- `staff`

The frontend uses the existing backend APIs only. Backend files are read for reference, but we are not changing backend code right now.

## Work Done Today

- Connected frontend client/staff pages to backend API data.
- Kept `/client` as the global all-clients page.
- Added staff-specific clients route: `/staff/{staffId}/clients`.
- Clicking staff name or `View Clients` now opens that staff's assigned clients.
- Clicking client name opens the client detail page.
- Client detail page now reads real database client data instead of static data.
- Created reusable table component:
  - `components/ReusableTable/index.tsx`
- Created reusable form component:
  - `components/ReusableForm/index.tsx`
- Dashboard now shows live counts:
  - Total Staff
  - Total Clients
  - Completed Clients
- Completed Clients currently means clients with:
  - `Visa Approved`
  - `Departed`
  - `Arrived in Japan`

## Current Page Behavior

### Dashboard

Route: `/admin/dashboard`

Shows live system counts from:

- `/staff`
- `/clients`

Activity section is still placeholder. We will plan it later.

### Staff List

Route: `/staff`

Shows all staff. Clicking staff name or `View Clients` opens:

`/staff/{staffId}/clients`

Superadmin can open `/staff/add` to add staff.

### Staff Clients

Route: `/staff/{staffId}/clients`

Shows clients assigned to one staff member.

Current table includes:

- Client ID
- Client Name
- Phone
- Visa Type
- COE Status
- Visa Status
- Client Status
- Action

### All Clients

Route: `/client`

Shows all clients from all staff.

Current table includes:

- Client ID
- Client Name
- Assign To

This page is for assignment/reassignment.

### Client Detail

Route: `/client/clientDetailPage?clientId={clientId}`

Shows full client details when the data exists in MongoDB.

Superadmin can open `/client/clientDetailPage?mode=create` to add a client.

Staff can also open this route to add a client, but staff cannot assign that client to anyone.

## Role Rules

### Super Admin

Can:

- View dashboard
- View staff list
- Add staff
- Edit staff
- Remove staff
- View all clients
- Add clients
- Edit any client
- Delete clients
- Assign/reassign clients
- View any staff's clients
- Update client statuses
- View activity later

### Staff

Can:

- Login and logout
- View staff list
- Add clients without assigning them
- View their own assigned clients
- Open their assigned client details
- Update their own client status/work progress later
- View other staff's clients in read-only mode
- Open other staff's client detail in read-only mode

Cannot:

- Add staff
- Edit staff
- Remove staff
- Assign/reassign clients
- Delete clients
- Edit other staff's client details
- Update other staff's client statuses

## Important Notes

- Staff login is not fully wired yet.
- Current frontend login is still superadmin-focused.
- Role-based read-only behavior needs proper logged-in staff identity.
- Status dropdowns in staff client table update UI locally for now.
- Saving status updates to database will need backend update API later.
- Staff can add clients, but cannot assign/reassign clients.

## Tools Used

- `rg` to search files and imports.
- `Get-Content` to inspect frontend and backend files.
- `apply_patch` to edit/create frontend files.
- `npm run type-check` to verify TypeScript.
- `npm run lint` to verify lint rules.
- `npm run build` to verify production build.
- Existing backend APIs:
  - `/staff`
  - `/clients`
  - `/clients/staff/:staffId`
  - `/clients/assign/:id`

## Next Work

- Clean role types to only `superadmin` and `staff`.
- Wire staff login and logged-in staff identity.
- Add role-based route/page restrictions.
- Make staff view other staff clients as read-only.
- Make staff edit only their own assigned clients.
- Plan dashboard activity.
- Add backend routes later for edit/delete staff, edit clients, status updates, and activity logs.
