import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

export const questionRouter = Router();

questionRouter.get("/", async (req, res) => {
  try {
    const questions = req.query.questions;
    const description = req.query.description;
    const category = req.query.category;
    const query = {};
    if (questions) {
      query.name = new RegExp(questions, "i");
    }
    if (description) {
      query.description = new RegExp(description, "i");
    }
    if (category) {
      query.category = new RegExp(category, "i");
    }

    const collection = db.collection("questions");
    const allQusetion = await collection.find(query).toArray();
    return res.json({ data: allQusetion });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

questionRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const questionsId = new ObjectId(req.params.id);
    const questionsById = await collection.findOne({ _id: questionsId });

    return res.json({ data: questionsById });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

questionRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const questionData = { ...req.body, created_at: new Date() };
    const newQuestionData = await collection.insertOne(questionData);
    return res.json({
      message: `Question Id ${newQuestionData.insertedId} has been created successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

questionRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const newQusetionData = { ...req.body, modified_at: new Date() };
    const questionId = new ObjectId(req.params.id);

    await collection.updateOne(
      {
        _id: questionId,
      },
      {
        $set: newQusetionData,
      }
    );
    return res.json({
      message: `Question ${questionId} has been updated successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

questionRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const questionId = new ObjectId(req.params.id);

    await collection.deleteOne({ _id: questionId });

    return res.json({
      message: `Question ${questionId} has been deleted successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});
