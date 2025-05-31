import HomePage from '../pages/home/home-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';
import LoginPage from '../pages/auth/login/login-page';
import RegisterPage from '../pages/auth/register/register-page';
import ReportDetailPage from '../pages/story/detail/report-detail-page';
import NewPage from '../pages/story/new/new-page';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';

const routes = {
  '/': () => checkAuthenticatedRoute(new HomePage()),

  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  '/new': () => checkAuthenticatedRoute(new NewPage()),
  '/story/:id': () => checkAuthenticatedRoute(new ReportDetailPage()),
  '/bookmark': () => checkAuthenticatedRoute(new BookmarkPage()),
};

export default routes;
