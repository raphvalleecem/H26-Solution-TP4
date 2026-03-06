import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Boat {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string = "";

    @Column()
    url: string = "";

    @CreateDateColumn()
    updatedAt!: Date;

    @Column({nullable: true})
    imageUrl?: string;
}