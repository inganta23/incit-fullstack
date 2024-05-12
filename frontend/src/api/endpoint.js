const baseApiUrl = import.meta.env.VITE_BASE_API_URL

export const registerGoogle = `${baseApiUrl}/auth/google?type=register`;
export const loginGoogle = `${baseApiUrl}/auth/google`;
export const login = `${baseApiUrl}/auth/login`;
export const logout = `${baseApiUrl}/auth/logout`;
export const register = `${baseApiUrl}/auth/register`;
export const user = `${baseApiUrl}/user`
export const userInfo = `${baseApiUrl}/user/user-info`
export const resetPass = `${baseApiUrl}/auth/reset-pass`;

export const totalUsersAPI = `${baseApiUrl}/user/total-users`
export const activeUsersTodayAPI = `${baseApiUrl}/user/active-users-today`
export const averageActiveUsersLast7DaysAPI = `${baseApiUrl}/user/average-active-users-last-7days`