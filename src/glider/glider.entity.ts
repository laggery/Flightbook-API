import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {User} from "../user/user.entity";
import {Flight} from "../flight/flight.entity";


@Entity("glider",{schema:"flight" } )
@Index("user_id",["user",])
export class Glider {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(type=>User, user=>user.gliders,{  nullable:false,onDelete: 'RESTRICT',onUpdate: 'RESTRICT' })
    @JoinColumn({ name:'user_id'})
    user:User | null;


    @Column("date",{ 
        nullable:true,
        name:"buy_date"
        })
    buy_date:string | null;
        

    @Column("varchar",{ 
        nullable:false,
        length:30,
        name:"brand"
        })
    brand:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:30,
        name:"name"
        })
    name:string;
        

    @Column("tinyint",{ 
        nullable:false,
        width:1,
        default: () => "'0'",
        name:"tandem"
        })
    tandem:boolean;
        

   
    @OneToMany(type=>Flight, flight=>flight.glider,{ onDelete: 'RESTRICT' ,onUpdate: 'RESTRICT' })
    flights:Flight[];
    
}
