import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_16400_primary", ["id"], { unique: true })
@Index("idx_16597_primary", ["id"], { unique: true })
@Entity("news", { schema: "public" })
export class News {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("date", { name: "date" })
  date: string;

  @Column("character varying", { name: "title", length: 40 })
  title: string;

  @Column("text", { name: "text" })
  text: string;

  @Column("character varying", { name: "language", length: 4 })
  language: string;
}
