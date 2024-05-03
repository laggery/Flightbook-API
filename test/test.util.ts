import { User } from "../src/user/user.entity";
import { News } from "../src/news/news.entity";
import { readFileSync } from "fs";
import * as path from 'path';

export class TestUtil {

    public static request = {
        user: {
            userId: 1
        }
    }
    
    public static createNews(language: string): News {
        const news = new News();
        news.date = '01.01.2024';
        news.title = 'title';
        news.text = 'text';
        news.language = language;
        return news;
    }

    public static createUser(): User {
        const user = new User();
        user.id = 1;
        user.firstname = "firstname";
        user.firstname = "lastname";
        user.email = "email";
        return user;
    }

    public static readFile(fileName: string): Express.Multer.File {
        const filePath = path.join(__dirname, `/resources/${fileName}`);
        const buffer = readFileSync(filePath);
        const file = {
            buffer,
            originalname: "test.csv",
            filename: "test.csv",
            encoding: "UTF8",
            stream: null,
            mimetype: null,
            destination: null,
            path: null,
            fieldname: null,
            size: null
        }
        return file
    }
}
