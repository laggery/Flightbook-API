import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Glider} from '../glider/glider.entity';
import {Place} from "../place/place.entity";
import {User} from "../user/user.entity";


@Entity("flight",{schema:"flightbook" } )
@Index("glider_id",["glider"])
@Index("landing_id",["landing"])
@Index("start_id",["start"])
@Index("user_id",["user"])
export class Flight {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>Glider, glider=>glider.flights,{  nullable:false,onDelete: 'RESTRICT',onUpdate: 'RESTRICT' })
    @JoinColumn({ name:'glider_id'})
    glider:Glider | null;
   
    @ManyToOne(()=>Place, place=>place.flights,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT' })
    @JoinColumn({ name:'start_id'})
    start:Place | null;


   
    @ManyToOne(()=>Place, place=>place.flights2,{ onDelete: 'RESTRICT',onUpdate: 'RESTRICT' })
    @JoinColumn({ name:'landing_id'})
    landing:Place | null;


   
    @ManyToOne(()=>User, user=>user.flights,{  nullable:false,onDelete: 'RESTRICT',onUpdate: 'RESTRICT' })
    @JoinColumn({ name:'user_id'})
    user:User | null;


    @Column("date",{ 
        nullable:true,
        name:"date"
        })
    date:string | null;
        

    @Column("time",{ 
        nullable:true,
        name:"time"
        })
    time:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:2000,
        name:"description"
        })
    description:string | null;
        

    @Column("double",{ 
        nullable:true,
        name:"price"
        })
    price:number | null;
        

    @Column("int",{ 
        nullable:true,
        name:"km"
        })
    km:number | null;
        

    @Column("timestamp",{ 
        nullable:false,
        default: () => "CURRENT_TIMESTAMP",
        name:"timestamp"
        })
    timestamp:Date;
        
}
