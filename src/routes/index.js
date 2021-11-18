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
export const publicRoutes = [
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
];