'use client';

import React, { useState, useActionState, useRef } from 'react';
import { UserSession, User } from '@/types/types';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CircleUser, Upload, User as UserIcon } from 'lucide-react';
import Footer from '@/components/Footer';

// etong function na to laman yung galing sa lib/queries, which is yung gumagawa ng sql update mismo
import { update, UpdateUserState } from './actions';

// fetch natin yung user information then display sa page, then lagay tayo ng parang button na maglalabas ng input thingy para maedit na yung page ganun

const CreateSettingsPage: React.FC = () => {
    const [user, setUser] = useState<UserSession | null>(null);
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [id, setId] = useState<number | null>();
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const initialState: UpdateUserState = { success: false };
    const [state, formAction, isPending] = useActionState<UpdateUserState, FormData>(
        update,
        initialState
    );
    const [editableFields, setEditableFields] = useState<{ [key: string]: boolean }>({
        username: false,
        first_name: false,
        last_name: false,
        fb_link: false,
        email: false,
        contact_no: false,
        password: false,
    });
    const [inputContent, setInputContent] = useState<{ [key: string]: string | undefined }>({
        username: '',
        first_name: '',
        last_name: '',
        fb_link: '',
        email: '',
        contact_no: '',
        password: '',
    });

    // fetching session
    React.useEffect(() => {
        const fetchUser = async (): Promise<void> => {
            try {
                const response = await fetch('/api/session');
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user || null);
                    setId(data.user.user_id || null);
                }
            } catch (err) {
                console.error('Failed to fetch user:', err);
            }
        };
        fetchUser();
    }, []);

    // using id from session to fetch all user information to display on the page.
    React.useEffect(() => {
        if (!user?.username) return;

        const fetchUserInfo = async (): Promise<void> => {
            try {
                const response = await fetch(`/api/users/${user?.username}`);
                if (response.ok) {
                    const data = await response.json();
                    const userData = data?.data?.user || null;
                    setUserInfo(userData || null);
                    setInputContent((prev) => ({
                        ...prev,
                        username: userData?.username ?? '',
                        first_name: userData?.first_name ?? '',
                        last_name: userData?.last_name ?? '',
                        fb_link: userData?.fb_link ?? '',
                        email: userData?.email ?? '',
                        contact_no: userData?.contact_no ?? '',
                        password: userData?.password ?? '',
                    }));
                    if (userData?.profile_pic_url) {
                        setProfilePreview(userData.profile_pic_url);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch user info', err);
            }
        };

        fetchUserInfo();
    }, [user, state?.success]);

    const enableInput = (inputId: string): void => {
        setEditableFields((prev) => ({
            ...prev,
            [inputId]: true,
        }));
    };

    const cancelChanges = (inputId: string): void => {
        setInputContent((prev) => ({
            ...prev,
            [inputId]: userInfo ? (userInfo[inputId as keyof User] as string) : '',
        }));
        setEditableFields((prev) => ({
            ...prev,
            [inputId]: false,
        }));
    };

    const revertChanges = (): void => {
        setInputContent((prev) => ({
            ...prev,
            username: userInfo?.username ?? '',
            first_name: userInfo?.first_name ?? '',
            last_name: userInfo?.last_name ?? '',
            fb_link: userInfo?.fb_link ?? '',
            email: userInfo?.email ?? '',
            contact_no: userInfo?.contact_no ?? '',
            password: userInfo?.password ?? '',
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setProfilePreview(userInfo?.profile_pic_url || null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = (): void => {
            setProfilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    return (
        <>
            <Navigation />
            <div className="flex min-h-screen w-full flex-col bg-white lg:flex-row dark:bg-gray-900">
                {/* Sidebar */}
                <div className="w-full bg-linear-to-br from-gray-100 to-gray-200 p-6 shadow-lg lg:w-1/4 lg:p-8 dark:from-gray-800 dark:to-gray-900">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <Link
                            className="rounded-lg p-2 text-gray-700 transition-colors hover:cursor-pointer hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-700"
                            href={'/'}
                            title="Back to home"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-gray-900 lg:text-xl dark:text-white">
                                Settings
                            </h1>
                        </div>
                    </div>

                    {/* User Info Preview */}
                    {userInfo && (
                        <div className="my-8 hidden rounded-xl bg-white p-4 shadow-sm lg:flex dark:bg-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                    {profilePreview ? (
                                        <Image
                                            src={profilePreview}
                                            alt="Profile"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <CircleUser className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-semibold text-gray-900 dark:text-white">
                                        {userInfo.username}
                                    </p>
                                    <p className="truncate text-sm text-gray-600 dark:text-gray-400">
                                        {userInfo.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Menu */}
                    <nav className="hidden space-y-2 lg:block">
                        <h2 className="mb-4 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                            Menu
                        </h2>
                        <button
                            className="bg-dark-primary flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-medium text-white shadow-md transition-all hover:bg-[#0C587B] dark:bg-blue-600 dark:hover:bg-blue-700"
                            onClick={() => {}}
                        >
                            <UserIcon className="h-5 w-5" />
                            <span>Edit Profile</span>
                        </button>
                    </nav>
                </div>

                {/**Account Details container */}
                <div className="w-full px-6 pt-6 pb-10 lg:px-25 lg:pt-10">
                    <form action={formAction}>
                        <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">
                            Edit Profile
                        </h1>

                        <h2 className="mt-8 mb-5 text-xl font-bold text-gray-900 lg:mt-15 lg:text-2xl dark:text-white">
                            Profile Picture
                        </h2>
                        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                {profilePreview ? (
                                    <Image
                                        src={profilePreview}
                                        alt="Profile preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <CircleUser className="h-24 w-24 text-gray-400 dark:text-gray-500" />
                                )}
                            </div>
                            <div
                                className="flex rounded-3xl border border-gray-900 p-3 hover:cursor-pointer sm:ml-10 dark:border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                                onClick={() => fileInputRef.current?.click()}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && fileInputRef.current?.click()
                                }
                            >
                                <Upload className="dark:text-gray-300" />
                                <p className="ml-4 dark:text-gray-300">
                                    {profilePreview ? 'Change Profile' : 'Upload Profile'}
                                </p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                name="profile_image"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            <input
                                type="hidden"
                                name="old_profile_pic_url"
                                value={userInfo?.profile_pic_url || ''}
                            />
                        </div>

                        {/** Lagyan ng name attribute lahat ng inputs here */}

                        <h2
                            className={`mt-8 text-xl font-bold text-gray-900 lg:mt-15 lg:text-2xl dark:text-white ${!state?.message && 'mb-5'}`}
                        >
                            Account Details
                        </h2>

                        {/** Errors */}
                        {state?.message && !state.success && (
                            <div className="my-5 rounded-lg border border-red-400 bg-red-100 px-4 py-4 text-sm text-red-700 lg:px-5 lg:py-5 dark:border-red-600 dark:bg-red-900/30 dark:text-red-400">
                                {state?.message}
                            </div>
                        )}
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-6 lg:grid-rows-3">
                            <div className="lg:col-span-5">
                                <p className="mb-2 text-gray-700 dark:text-gray-300">Username</p>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <input
                                        readOnly={!editableFields.username}
                                        name="username"
                                        value={inputContent?.username ?? ''}
                                        onChange={(e) =>
                                            setInputContent((prev) => ({
                                                ...prev,
                                                username: e.target.value,
                                            }))
                                        }
                                        className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:w-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-300 ${!editableFields.username ? 'pointer-events-none text-gray-400 dark:text-gray-500' : 'text-black dark:text-white'} `}
                                    ></input>
                                    <div className="flex content-center lg:col-span-2">
                                        {!editableFields.username ? (
                                            <button
                                                type="button"
                                                className="flex cursor-pointer content-center items-center text-blue-600 hover:text-blue-700 sm:ml-10 dark:text-blue-400 dark:hover:text-blue-300"
                                                onClick={() => enableInput('username')}
                                            >
                                                Change
                                            </button>
                                        ) : (
                                            <div className="flex gap-4 sm:gap-0">
                                                <button
                                                    type="button"
                                                    className="flex cursor-pointer content-center items-center text-red-600 hover:text-red-700 sm:ml-10 dark:text-red-400 dark:hover:text-red-300"
                                                    onClick={() => cancelChanges('username')}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="button"
                                                    className="flex cursor-pointer content-center items-center text-green-600 hover:text-green-700 sm:ml-10 dark:text-green-400 dark:hover:text-green-300"
                                                    onClick={() =>
                                                        setEditableFields((prev) => ({
                                                            ...prev,
                                                            username: false,
                                                        }))
                                                    }
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-5 lg:row-start-2">
                                <p className="mb-2 text-gray-700 dark:text-gray-300">First Name</p>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <input
                                        readOnly={!editableFields.first_name}
                                        name="first_name"
                                        value={inputContent?.first_name ?? undefined}
                                        onChange={(e) =>
                                            setInputContent((prev) => ({
                                                ...prev,
                                                first_name: e.target.value,
                                            }))
                                        }
                                        className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:w-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-300 ${!editableFields.first_name ? 'pointer-events-none text-gray-400 dark:text-gray-500' : 'text-black dark:text-white'} `}
                                    ></input>
                                    <div className="flex content-center lg:col-span-2">
                                        {!editableFields.first_name ? (
                                            <button
                                                type="button"
                                                className="flex cursor-pointer content-center items-center text-blue-600 hover:text-blue-700 sm:ml-10 dark:text-blue-400 dark:hover:text-blue-300"
                                                onClick={() => enableInput('first_name')}
                                            >
                                                Change
                                            </button>
                                        ) : (
                                            <div className="flex gap-4 sm:gap-0">
                                                <button
                                                    type="button"
                                                    className="flex cursor-pointer content-center items-center text-red-600 hover:text-red-700 sm:ml-10 dark:text-red-400 dark:hover:text-red-300"
                                                    onClick={() => cancelChanges('first_name')}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="button"
                                                    className="flex cursor-pointer content-center items-center text-green-600 hover:text-green-700 sm:ml-10 dark:text-green-400 dark:hover:text-green-300"
                                                    onClick={() =>
                                                        setEditableFields((prev) => ({
                                                            ...prev,
                                                            first_name: false,
                                                        }))
                                                    }
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-5 lg:row-start-3">
                                <p className="mb-2 text-gray-700 dark:text-gray-300">Last Name</p>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <input
                                        readOnly={!editableFields.last_name}
                                        name="last_name"
                                        value={inputContent?.last_name ?? undefined}
                                        onChange={(e) =>
                                            setInputContent((prev) => ({
                                                ...prev,
                                                last_name: e.target.value,
                                            }))
                                        }
                                        className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:w-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-300 ${!editableFields.last_name ? 'pointer-events-none text-gray-400 dark:text-gray-500' : 'text-black dark:text-white'} `}
                                    ></input>
                                    <div className="flex content-center lg:col-span-2">
                                        {!editableFields.last_name ? (
                                            <button
                                                type="button"
                                                className="flex cursor-pointer content-center items-center text-blue-600 hover:text-blue-700 sm:ml-10 dark:text-blue-400 dark:hover:text-blue-300"
                                                onClick={() => enableInput('last_name')}
                                            >
                                                Change
                                            </button>
                                        ) : (
                                            <div className="flex gap-4 sm:gap-0">
                                                <button
                                                    type="button"
                                                    className="flex cursor-pointer content-center items-center text-red-600 hover:text-red-700 sm:ml-10 dark:text-red-400 dark:hover:text-red-300"
                                                    onClick={() => cancelChanges('last_name')}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="button"
                                                    className="flex cursor-pointer content-center items-center text-green-600 hover:text-green-700 sm:ml-10 dark:text-green-400 dark:hover:text-green-300"
                                                    onClick={() =>
                                                        setEditableFields((prev) => ({
                                                            ...prev,
                                                            last_name: false,
                                                        }))
                                                    }
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-5 lg:row-start-4">
                                <p className="mb-2 text-gray-700 dark:text-gray-300">
                                    Facebook Link
                                </p>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <input
                                        readOnly={!editableFields.fb_link}
                                        name="fb_link"
                                        value={inputContent?.fb_link ?? ''}
                                        onChange={(e) =>
                                            setInputContent((prev) => ({
                                                ...prev,
                                                fb_link: e.target.value,
                                            }))
                                        }
                                        className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:w-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-300 ${!editableFields.fb_link ? 'pointer-events-none text-gray-400 dark:text-gray-500' : 'text-black dark:text-white'} `}
                                    ></input>
                                    <div className="flex content-center lg:col-span-2">
                                        {!editableFields.fb_link ? (
                                            <button
                                                type="button"
                                                className="flex cursor-pointer content-center items-center text-blue-600 hover:text-blue-700 sm:ml-10 dark:text-blue-400 dark:hover:text-blue-300"
                                                onClick={() => enableInput('fb_link')}
                                            >
                                                Change
                                            </button>
                                        ) : (
                                            <div className="flex gap-4 sm:gap-0">
                                                <button
                                                    type="button"
                                                    className="flex cursor-pointer content-center items-center text-red-600 hover:text-red-700 sm:ml-10 dark:text-red-400 dark:hover:text-red-300"
                                                    onClick={() => cancelChanges('fb_link')}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="button"
                                                    className="flex cursor-pointer content-center items-center text-green-600 hover:text-green-700 sm:ml-10 dark:text-green-400 dark:hover:text-green-300"
                                                    onClick={() =>
                                                        setEditableFields((prev) => ({
                                                            ...prev,
                                                            fb_link: false,
                                                        }))
                                                    }
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/** Private details, need ng parang 2nd prompt before ka makapagedit ng informaiton mo.  */}
                        <h2 className="mt-8 mb-5 text-xl font-bold text-gray-900 lg:mt-15 lg:text-2xl dark:text-white">
                            Private Details
                        </h2>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-6 lg:grid-rows-3">
                            <div className="lg:col-span-5">
                                <p className="mb-2 text-gray-700 dark:text-gray-300">Email</p>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <input
                                        readOnly={!editableFields.email}
                                        name="email"
                                        value={inputContent?.email ?? undefined}
                                        onChange={(e) =>
                                            setInputContent((prev) => ({
                                                ...prev,
                                                email: e.target.value,
                                            }))
                                        }
                                        className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:w-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-300 ${!editableFields.email ? 'pointer-events-none text-gray-400 select-none dark:text-gray-500' : 'text-black dark:text-white'}`}
                                    ></input>

                                    <div className="flex content-center lg:col-span-2">
                                        {!editableFields.email ? (
                                            <button
                                                type="button"
                                                className="flex cursor-pointer content-center items-center text-blue-600 hover:text-blue-700 sm:ml-10 dark:text-blue-400 dark:hover:text-blue-300"
                                                onClick={() => enableInput('email')}
                                            >
                                                Change
                                            </button>
                                        ) : (
                                            <div className="flex gap-4 sm:gap-0">
                                                <button
                                                    type="button"
                                                    className="flex cursor-pointer content-center items-center text-red-600 hover:text-red-700 sm:ml-10 dark:text-red-400 dark:hover:text-red-300"
                                                    onClick={() => cancelChanges('email')}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="button"
                                                    className="flex cursor-pointer content-center items-center text-green-600 hover:text-green-700 sm:ml-10 dark:text-green-400 dark:hover:text-green-300"
                                                    onClick={() =>
                                                        setEditableFields((prev) => ({
                                                            ...prev,
                                                            email: false,
                                                        }))
                                                    }
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-5 lg:row-start-2">
                                <p className="mb-2 text-gray-700 dark:text-gray-300">
                                    Phone Number
                                </p>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <input
                                        readOnly={!editableFields.contact_no}
                                        name="contact_no"
                                        value={inputContent?.contact_no ?? undefined}
                                        onChange={(e) =>
                                            setInputContent((prev) => ({
                                                ...prev,
                                                contact_no: e.target.value,
                                            }))
                                        }
                                        className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:w-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-300 ${!editableFields.contact_no ? 'pointer-events-none text-gray-400 select-none dark:text-gray-500' : 'text-black dark:text-white'}`}
                                    ></input>
                                    <div className="flex content-center lg:col-span-1">
                                        {!editableFields.contact_no ? (
                                            <button
                                                type="button"
                                                className="flex cursor-pointer content-center items-center text-blue-600 hover:text-blue-700 sm:ml-10 dark:text-blue-400 dark:hover:text-blue-300"
                                                onClick={() => enableInput('contact_no')}
                                            >
                                                Change
                                            </button>
                                        ) : (
                                            <div className="flex gap-4 sm:gap-0">
                                                <button
                                                    type="button"
                                                    className="flex cursor-pointer content-center items-center text-red-600 hover:text-red-700 sm:ml-10 dark:text-red-400 dark:hover:text-red-300"
                                                    onClick={() => cancelChanges('contact_no')}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="button"
                                                    className="flex cursor-pointer content-center items-center text-green-600 hover:text-green-700 sm:ml-10 dark:text-green-400 dark:hover:text-green-300"
                                                    onClick={() =>
                                                        setEditableFields((prev) => ({
                                                            ...prev,
                                                            contact_no: false,
                                                        }))
                                                    }
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-5 lg:row-start-3">
                                <p className="mb-2 text-gray-700 dark:text-gray-300">Password</p>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <input
                                        type={!editableFields.password ? 'password' : 'text'}
                                        readOnly={!editableFields.password}
                                        name="password"
                                        value={inputContent?.password ?? undefined}
                                        onChange={(e) =>
                                            setInputContent((prev) => ({
                                                ...prev,
                                                password: e.target.value,
                                            }))
                                        }
                                        className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:w-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-300 ${!editableFields.password ? 'pointer-events-none text-gray-400 select-none dark:text-gray-500' : 'text-black dark:text-white'}`}
                                    ></input>
                                    <div className="flex content-center lg:col-span-1">
                                        {!editableFields.password ? (
                                            <button
                                                type="button"
                                                className="flex cursor-pointer content-center items-center text-blue-600 hover:text-blue-700 sm:ml-10 dark:text-blue-400 dark:hover:text-blue-300"
                                                onClick={() => enableInput('password')}
                                            >
                                                Change
                                            </button>
                                        ) : (
                                            <div className="flex gap-4 sm:gap-0">
                                                <button
                                                    type="button"
                                                    className="flex cursor-pointer content-center items-center text-red-600 hover:text-red-700 sm:ml-10 dark:text-red-400 dark:hover:text-red-300"
                                                    onClick={() => cancelChanges('password')}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="button"
                                                    className="flex cursor-pointer content-center items-center text-green-600 hover:text-green-700 sm:ml-10 dark:text-green-400 dark:hover:text-green-300"
                                                    onClick={() =>
                                                        setEditableFields((prev) => ({
                                                            ...prev,
                                                            password: false,
                                                        }))
                                                    }
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/**Save button */}
                        <div className="my-10 flex flex-col gap-4 sm:flex-row sm:justify-between lg:my-20">
                            <div className="flex justify-start">
                                <input
                                    type="hidden"
                                    name="id"
                                    value={id ?? ''}
                                ></input>
                                <button
                                    type="button"
                                    className="w-full text-red-600 hover:cursor-pointer hover:text-red-700 sm:w-auto dark:text-red-400 dark:hover:text-red-300"
                                    onClick={() => revertChanges()}
                                >
                                    Revert Changes
                                </button>
                            </div>
                            <div className="flex justify-end">
                                <input
                                    type="hidden"
                                    name="id"
                                    value={id ?? ''}
                                ></input>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full rounded-lg bg-[#0C587B] px-8 py-2.5 text-sm font-semibold whitespace-nowrap text-white hover:cursor-pointer hover:bg-[#094764] focus:ring-2 focus:ring-[#0C587B] focus:outline-none disabled:opacity-50 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    {isPending ? 'Saving...' : 'Save changes'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CreateSettingsPage;
