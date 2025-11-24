import UserRepository from "../models/repositories/UserRepository.ts";
import type {
	CreateUserDTO,
	LoginUserDTO,
	UpdateUserDTO,
} from "../models/dtos/UserDTOs.ts";
import UserEntity from "../models/entities/UserEntity.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/constants.ts";

export default class UserService {
	private readonly userRepository = new UserRepository();

	public async createUser(user: CreateUserDTO): Promise<string> {
		const hashedPassword = await bcrypt.hash(user.password, 10);
		const userEntity = UserEntity.create(
			user.name,
			hashedPassword,
			new Date(user.birth_date),
			user.email,
			0,
		);

		await this.userRepository.create(userEntity);

		const createdUser = await this.userRepository.findByEmail(user.email);
		if (!createdUser) {
			throw new Error("Falha ao criar o usuário.");
		}

		const token = jwt.sign({ id: createdUser.id }, JWT_SECRET, {
			expiresIn: "1h",
		});
		return token;
	}

	public async login(credentials: LoginUserDTO): Promise<string | null> {
		const user = await this.userRepository.findByEmail(credentials.email);
        
		if (!user) {
			return null;
		}

		const isPasswordValid = await bcrypt.compare(
			credentials.password,
			user.password,
		);

		if (!isPasswordValid) {
			return null;
		}

		const token = jwt.sign({ id: user.id }, JWT_SECRET, {
			expiresIn: "1h",
		});
		return token;
	}

	public async updateUser(
		id: number,
		userData: UpdateUserDTO,
	): Promise<UserEntity | null> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			return null;
		}

		if (userData.password) {
			userData.password = await bcrypt.hash(userData.password, 10);
		}

		const updatedUser = Object.assign(user, userData);

		await this.userRepository.update(updatedUser);
		return this.userRepository.findById(id);
	}

	public async deleteUser(id: number): Promise<boolean> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			return false;
		}
		await this.userRepository.delete(id);
		return true;
	}

	public async getUsers(): Promise<UserEntity[]> {
		return this.userRepository.findAll();
	}

	public async getUserById(id: number): Promise<UserEntity | null> {
		return this.userRepository.findById(id);
	}
}
