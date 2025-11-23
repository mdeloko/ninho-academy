type ProgressProps = {
	id: number;
	userId: number;
	totalXp: number;
	level: number;
};

export default class ProgressEntity {
	private readonly props: ProgressProps;

	private constructor(props: ProgressProps) {
		this.props = props;
	}

	public static create(props: ProgressProps): ProgressEntity {
		return new ProgressEntity(props);
	}

	public get id(): number {
		return this.props.id;
	}

	public get userId(): number {
		return this.props.userId;
	}

	public get totalXp(): number {
		return this.props.totalXp;
	}

	public set totalXp(totalXp: number) {
		this.props.totalXp = totalXp;
	}

	public get level(): number {
		return this.props.level;
	}

	public set level(level: number) {
		this.props.level = level;
	}
}
