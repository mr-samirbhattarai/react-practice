import { Client, ID, Query, TablesDB } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);

const tables = new TablesDB(client)

export const updateSearchCount = async (searchTerm, movie) => {

    // 1. Use Apperite SDK to check if the search term exists in the database
    try {
        const result = await tables.listRows(
            {
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                queries: [
                    Query.equal("searchTerm", searchTerm),
                ]
            }
        );

        const doc = result.rows[0];
        if (result.rows.length > 0) {

            console.log(doc);


            await tables.updateRow({
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                rowId: doc.$id,
                data: {
                    count: doc.count + 1
                }
            });
        } else {

            await tables.createRow({
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                rowId: ID.unique(),
                data:
                {
                    searchTerm: searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                }
            });
        }
    } catch (error) {
        console.log(error);

    }
    // 2. If ir does, update the count
    // 3. If it doesn't, create a new record worht the search term and set count to 1

}

export const getTrandingMovies = async () => {
    try {
        const result = await tables.listRows({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            queries: [
                Query.orderDesc("count"),
                Query.limit(10)
            ]
        });

        return result.rows;  // tolook
    } catch (error) {
        console.log(error);
        
    }
}