export type CreateUserDTO = {
	name: string;
	email: string;
	password: string;
	birth_date: string;
};

export type UpdateUserDTO = {
	name?: string;
	email?: string;
	password?: string;
	birth_date?: string;
};

export type LoginUserDTO = {
	email: string;
	password: string;
};
