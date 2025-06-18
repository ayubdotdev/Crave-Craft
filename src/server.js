import express from "express"
import { ENV } from "./config/env.js"
import { db } from "./config/db.js"
import { favoritesTable } from "./db/schema.js"
import { and, eq } from "drizzle-orm"

const app = express()
const PORT = ENV.PORT || 5001

app.use(express.json())

app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true })
})
app.post("/api/favorites", async (req, res) => {
    try {
        const { userId, recipeID, title, Image, cooktime, servings } = req.body

        if (!userId || !recipeID || !title)
            return res.status(400).json({ error: "Missing required fields" })

        const newFavorites = await db
            .insert(favoritesTable)
            .values({
                userId, recipeID, title, Image, cooktime, servings
            })
            .returning()

        res.status(200).json(newFavorites[0])
    } catch (error) {
        console.log(error, "Something went wrong")
    }
})

app.get("/api/favorites/:userId", async (req, res) => {
    try {
        const { userId } = req.params
        const userFavorites = await db
            .select()
            .from(favoritesTable)
            .where(eq(favoritesTable.userId, userId))

        res.status(200).json(userFavorites)

    } catch (error) {
        console.log(error, "Something went wrong while getting userFavorites")
        res.status(500).json({ error: "Something went wrong" });
    }
})
app.delete("/api/favorites/:userId/:recipeID", async (req, res) => {
  try {
    const { userId, recipeID } = req.params;

    await db
      .delete(favoritesTable)
      .where(
        and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeID, parseInt(recipeID)))
      );

    res.status(200).json({ message: "Favorite removed successfully" });
  }catch (error) {
        console.log(error, "Something went worng")
        res.status(500).json({ error: "Something went wrong while removing favorites" });
    }
})
app.listen(PORT, () => {
    console.log("Server is runnig on PORT:", PORT)
})