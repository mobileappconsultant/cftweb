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
                match:/^\/home/,
            },
            {
                text: 'Members',
                icon: <Users />,
                path:'/members',
                match:/^\/members/,
            },
            {
                text: 'Requests',
                icon: <BellPlus />,
                path:'/requests',
                match:/^\/requests/,
            },
            {
                text: 'Transactions',
                icon: <CurrencyDollar />,
                path:'/transactions',
                match:/^\/transactions/,
            },
            {
                text: 'Administrators',
                icon: <User />,
                path:'/administrators',
                match:/^\/administrators/,
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
                match:/^\/announcements/,
            },
            {
                text: 'Apostles Desk',
                icon: <Table />,
                path:'/apostle-desk',
                match:/^\/apostle-desk/,
            },
            {
                text: 'Calendar',
                icon: <Calendar />,
                path:'/calendar',
                match:/^\/calendar/,
            },
            {
                text: 'Merchandise',
                icon: <Archive />,
                path:'/merchandise',
                match:/^\/merchandise/,
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
                match:/^\/branches/,
            },
            {
                text: 'Group',
                icon: <ArrowsMinimize />,
                path:'/groups',
                match:/^\/groups/,
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
                match:/^\/settings/,
            },
            // {
            //     text: 'Logout',
            //     icon: <Logout />,
            //     path:'/logout',
            // }
        ],
    },
];