import React from 'react';
import { 
    Dashboard, 
    Users, 
    BellPlus,
    CurrencyDollar,
    Writing,
    Table,
    Calendar,
    Archive,
    Settings,
    Logout,
    User,
    GitBranch,
    ArrowsMinimize
 } from 'tabler-icons-react';
export const sideBarRoutes = [
    {
        title: '',
        children:[
            {
                text: 'Dashboard',
                icon: <Dashboard />,
                path:'/home',
            },
            {
                text: 'Members',
                icon: <Users />,
                path:'/members',
            },
            {
                text: 'Requests',
                icon: <BellPlus />,
                path:'/requests',
            },
            {
                text: 'Transactions',
                icon: <CurrencyDollar />,
                path:'/transactions',
            },
            {
                text: 'Administrators',
                icon: <User />,
                path:'/administrators',
            },
        ],
    },
    {
        title: 'UPDATE SECTIONS',
        children:[
            {
                text: 'Announcements',
                icon: < Writing />,
                path:'/announcements',
            },
            {
                text: 'Apostles Desk',
                icon: <Table />,
                path:'/apostle-desk',
            },
            {
                text: 'Calendar',
                icon: <Calendar />,
                path:'/calendar',
            },
            {
                text: 'Merchandise',
                icon: <Archive />,
                path:'/merchandise',
            },
        ],
    },
    {
        title: 'CONFIG',
        children:[
            {
                text: 'Branches',
                icon: <GitBranch />,
                path:'/branches',
            },
            {
                text: 'Group',
                icon: <ArrowsMinimize />,
                path:'/groups',
            }
        ],
    },
    {
        title: 'OTHERS',
        children:[
            {
                text: 'Settings',
                icon: <Settings />,
                path:'/settings',
            },
            {
                text: 'Logout',
                icon: <Logout />,
                path:'/logout',
            }
        ],
    },
];