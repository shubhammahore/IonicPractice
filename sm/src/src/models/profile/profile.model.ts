
import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Profile {
 
    @PrimaryGeneratedColumn()
    Id: number;
 
    @Column()
    ProfileId: string;
 
    @Column()
    IsDefault: string;
 
    @Column()
    Data: string;
 
    ProfileName:string;
    Image:string;
}