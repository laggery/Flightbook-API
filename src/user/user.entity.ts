import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Flight} from "../flight/flight.entity";
import {Glider} from "../glider/glider.entity";
import {Place} from "../place/place.entity";


@Entity("user",{schema:"flight" } )
@Index("UNIQ_8D93D64992FC23A8",["username_canonical",],{unique:true})
@Index("UNIQ_8D93D649A0D96FBF",["email_canonical",],{unique:true})
@Index("email",["email",],{unique:true})
export class User {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:false,
        name:"username"
        })
    username:string;
        

    @Column("varchar",{ 
        nullable:false,
        unique: true,
        name:"username_canonical"
        })
    username_canonical:string;
        

    @Column("varchar",{ 
        nullable:false,
        unique: true,
        name:"email"
        })
    email:string;
        

    @Column("varchar",{ 
        nullable:false,
        unique: true,
        name:"email_canonical"
        })
    email_canonical:string;
        

    @Column("tinyint",{ 
        nullable:false,
        width:1,
        name:"enabled"
        })
    enabled:boolean;
        

    @Column("varchar",{ 
        nullable:false,
        name:"salt"
        })
    salt:string;
        

    @Column("varchar",{ 
        nullable:false,
        name:"password"
        })
    password:string;
        

    @Column("datetime",{ 
        nullable:true,
        name:"last_login"
        })
    last_login:Date | null;
        

    @Column("tinyint",{ 
        nullable:true,
        width:1,
        name:"locked"
        })
    locked:boolean;
        

    @Column("tinyint",{ 
        nullable:true,
        width:1,
        name:"expired"
        })
    expired:boolean;
        

    @Column("datetime",{ 
        nullable:true,
        name:"expires_at"
        })
    expires_at:Date | null;
        

    @Column("varchar",{ 
        nullable:true,
        name:"confirmation_token"
        })
    confirmation_token:string | null;
        

    @Column("datetime",{ 
        nullable:true,
        name:"password_requested_at"
        })
    password_requested_at:Date | null;
        

    @Column("longtext",{ 
        nullable:false,
        name:"roles"
        })
    roles:string;
        

    @Column("tinyint",{ 
        nullable:true,
        width:1,
        name:"credentials_expired"
        })
    credentials_expired:boolean;
        

    @Column("datetime",{ 
        nullable:true,
        name:"credentials_expire_at"
        })
    credentials_expire_at:Date | null;
        

    @Column("varchar",{ 
        nullable:false,
        length:30,
        name:"firstname"
        })
    firstname:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:30,
        name:"lastname"
        })
    lastname:string;
        

    @Column("varchar",{ 
        nullable:true,
        length:60,
        name:"token"
        })
    token:string | null;
        

   
    @OneToMany(type=>Flight, flight=>flight.user,{ onDelete: 'RESTRICT' ,onUpdate: 'RESTRICT' })
    flights:Flight[];
    

   
    @OneToMany(type=>Glider, glider=>glider.user,{ onDelete: 'RESTRICT' ,onUpdate: 'RESTRICT' })
    gliders:Glider[];
    

   
    @OneToMany(type=>Place, place=>place.user,{ onDelete: 'RESTRICT' ,onUpdate: 'RESTRICT' })
    places:Place[];
    
}
