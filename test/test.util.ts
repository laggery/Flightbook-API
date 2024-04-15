import { News } from "../src/news/news.entity"

export class TestUtil {

    public static createNews(language: string): News {
        const news = new News();
        news.date = '01.01.2024';
        news.title = 'title';
        news.text = 'text';
        news.language = language;
        return news;
    }
}
