import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";


@Entity("news",{schema:"flight" } )
export class News {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("date",{ 
        nullable:false,
        name:"date"
        })
    date:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:40,
        name:"title"
        })
    title:string;
        

    @Column("text",{ 
        nullable:false,
        name:"text"
        })
    text:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:4,
        name:"language"
        })
    language:string;
        
}
