import React from 'react';
import Login from 'pages/Authentication/Login';
import ForgotPassword from 'pages/Authentication/ForgotPassword';
import Register from 'pages/Authentication/Register';
import EnterPin from 'pages/Authentication/EnterPin';
import ResetPassword from 'pages/Authentication/ResetPassword';
import Home from 'pages/Home';
import Members from 'pages/Members';
import Requests from 'pages/Requests';
import Administrators from 'pages/Administrators';
import Branches from 'pages/Branches';
import Groups from 'pages/Groups';
import Settings from 'pages/Settings';
import Announcement from 'pages/Announcement';
import SingleAnnouncement from 'pages/Announcement/ViewAnnouncement';
import CreateAnnouncement from 'pages/Announcement/CreateAnnouncement';
import Calendar from 'pages/Calendar';
import CreateCalendarEvent from 'pages/Calendar/CreateCalendarEvent';
import { Redirect } from 'react-router-dom';
import ApostleDesk from 'pages/ApostleDesk';
import ViewApostleEvent from 'pages/ApostleDesk/ViewApostleEvent';
import CreateEvent from 'pages/ApostleDesk/CreateEvent';
import Transactions from 'pages/Transactions';
import Merchandise from 'pages/Merchandise';
import EditEvent from 'pages/Calendar/EditCalendarEvent';
import CreateApostleMessage from 'pages/ApostleDesk/Messages/CreateMessage';
import EditApostleMessage from 'pages/ApostleDesk/Messages/EditMessage';

export const publicRoutes = [
	{path: '/', component: () => <Redirect to="/login" />},
	{ path: "/login", component: Login },
	{ path: "/forgotpassword", component: ForgotPassword },
	{ path: "/enterpin", component: EnterPin},
	{ path: "/resetpassword", component: ResetPassword},
	{ path: '/change-password/:token', component: <> Token</>},
	{ path: "/register", component: Register},

];

export const privateRoutes = [
	{ path: "/home", component: Home },
	{ path: "/members", component: Members },
	{ path: "/requests", component: Requests },
	{path: "/administrators", component: Administrators},
	{path: "/branches", component: Branches},
	{path: "/groups", component: Groups},
	{path: "/settings", component: Settings},
	{path:"/announcements", exact: true, component: Announcement},
	{path:"/announcements/create", exact: true, component: CreateAnnouncement},
	{path:"/announcements/:id", exact: true, component: SingleAnnouncement},
	{path:"/calendar/event/:id", exact: true, component: CreateCalendarEvent},
	{path:"/calendar", exact: true, component: Calendar},
	{path:"/calendar/create-event", exact: true, component: CreateCalendarEvent},
	{path:"/calendar/edit-event/:id", exact: true, component: EditEvent},
	{path:"/apostle-desk", exact: true, component: ApostleDesk},
	{path:"/apostle-desk/createmessage", exact: true, component: CreateApostleMessage},
	{path:"/apostle-desk/editmessage/:id", exact: true, component: EditApostleMessage},
	{path:"/apostle-desk/:id", exact: true, component: ViewApostleEvent},
	{path:"/transactions", exact: true, component: Transactions},
	{path:"/merchandise", exact: true, component: Merchandise},
];