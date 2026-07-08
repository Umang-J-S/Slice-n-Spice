import { Router } from 'express';
import authRoutes from '@/modules/auth/routes/authRoutes';
import adminRoutes from '@/modules/admin/routes/adminRoutes';
import menuRoutes from '@/modules/menu/routes/menuRoutes';
import chefRoutes from '@/modules/chef/routes/chefRoutes';

export function buildApiRouter(): Router {
  const router = Router();

  const routes = [
    { path: '/auth', router: authRoutes },
    { path: '/admin', router: adminRoutes },
    { path: '/menu', router: menuRoutes },
    { path: '/chefs', router: chefRoutes },
  ];

  routes.forEach((route) => {
    router.use(route.path, route.router);
  });

  return router;
}
