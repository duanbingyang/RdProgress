import BasicLayout from '@/layouts/BasicLayout';
import Dashboard from '@/pages/Dashboard';
import RdProgress from '@/pages/RdProgress';
import RdProgressAdd from '@/pages/RdProgressAdd';
import RdProgressEdit from '@/pages/RdProgressEdit';
import RdProgressList from '@/pages/RdProgressList';
import RdProgressListEdit from '@/pages/RdProgressListEdit';

const routerConfig = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '/dash',
        component: Dashboard,
      },
      {
        path: '/rdprogress',
        component: RdProgress,
      },
      {
        path: '/rdprogressadd',
        component: RdProgressAdd,
      },
      {
        path: '/rdprogressedit',
        component: RdProgressEdit,
      },
      {
        path: '/rdprogresslist',
        component: RdProgressList,
      },
      {
        path: '/rdprogresslistedit',
        component: RdProgressListEdit,
      },
    ],
  },
];
export default routerConfig;
