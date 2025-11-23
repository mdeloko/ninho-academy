import { validatePassword } from "../../utils/validations.ts";

type UserProps = {
    name: string;
    password: string;
    birthDate: Date;
    email: string;
    id: number;
}
export default class UserEntity{

    private readonly props: UserProps;

    private constructor(props:UserProps){
        this.props = props
    }

    public static create(name: string, password: string, birthDate: Date, email: string, id: number): UserEntity{
        //TODO Criar Validação de senha
        return new UserEntity({name,password,birthDate,email,id});
    }

    public get name():string{
        return this.props.name;
    }
    public set name(name:string){
        this.props.name = name;
    }

    public get password():string{
        return this.props.password;
    }
    public set password(password:string){
        this.props.password = password;
    }

    public get email():string{
        return this.props.email;
    }
    public set email(email:string){
        this.props.email = email;
    }

    public get birthDate():Date{
        return this.props.birthDate;
    }
    public set birthDate(birthDate:Date){
        this.props.birthDate = birthDate;
    }

    public get id():number{
        return this.props.id;
    }
    public set id(id:number){
        this.props.id = id;
    }
}