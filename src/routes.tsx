import { match } from 'path-to-regexp'
import { isValidElement, lazy } from 'react'

// Lazy load all secondary pages for code splitting
const AppearanceSettingsPage = lazy(() => import('./pages/secondary/AppearanceSettingsPage'))
const BookmarkPage = lazy(() => import('./pages/secondary/BookmarkPage'))
const FollowingListPage = lazy(() => import('./pages/secondary/FollowingListPage'))
const GeneralSettingsPage = lazy(() => import('./pages/secondary/GeneralSettingsPage'))
const MuteListPage = lazy(() => import('./pages/secondary/MuteListPage'))
const Nip05CommunityPage = lazy(() => import('./pages/secondary/Nip05CommunityPage'))
const NoteListPage = lazy(() => import('./pages/secondary/NoteListPage'))
const NotePage = lazy(() => import('./pages/secondary/NotePage'))
const OthersRelaySettingsPage = lazy(() => import('./pages/secondary/OthersRelaySettingsPage'))
const PostSettingsPage = lazy(() => import('./pages/secondary/PostSettingsPage'))
const ProfileEditorPage = lazy(() => import('./pages/secondary/ProfileEditorPage'))
const ProfileListPage = lazy(() => import('./pages/secondary/ProfileListPage'))
const ProfilePage = lazy(() => import('./pages/secondary/ProfilePage'))
const RelayPage = lazy(() => import('./pages/secondary/RelayPage'))
const RelayReviewsPage = lazy(() => import('./pages/secondary/RelayReviewsPage'))
const RelaySettingsPage = lazy(() => import('./pages/secondary/RelaySettingsPage'))
const RizfulPage = lazy(() => import('./pages/secondary/RizfulPage'))
const SearchPage = lazy(() => import('./pages/secondary/SearchPage'))
const SettingsPage = lazy(() => import('./pages/secondary/SettingsPage'))
const TranslationPage = lazy(() => import('./pages/secondary/TranslationPage'))
const WalletPage = lazy(() => import('./pages/secondary/WalletPage'))

const ROUTES = [
  { path: '/notes', element: <NoteListPage /> },
  { path: '/notes/:id', element: <NotePage /> },
  { path: '/users', element: <ProfileListPage /> },
  { path: '/users/:id', element: <ProfilePage /> },
  { path: '/users/:id/following', element: <FollowingListPage /> },
  { path: '/users/:id/relays', element: <OthersRelaySettingsPage /> },
  { path: '/relays/:url', element: <RelayPage /> },
  { path: '/relays/:url/reviews', element: <RelayReviewsPage /> },
  { path: '/communities/:domain', element: <Nip05CommunityPage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/settings/relays', element: <RelaySettingsPage /> },
  { path: '/settings/wallet', element: <WalletPage /> },
  { path: '/settings/posts', element: <PostSettingsPage /> },
  { path: '/settings/general', element: <GeneralSettingsPage /> },
  { path: '/settings/appearance', element: <AppearanceSettingsPage /> },
  { path: '/settings/translation', element: <TranslationPage /> },
  { path: '/profile-editor', element: <ProfileEditorPage /> },
  { path: '/mutes', element: <MuteListPage /> },
  { path: '/rizful', element: <RizfulPage /> },
  { path: '/bookmarks', element: <BookmarkPage /> }
]

export const routes = ROUTES.map(({ path, element }) => ({
  path,
  element: isValidElement(element) ? element : null,
  matcher: match(path)
}))
