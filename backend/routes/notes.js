const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

router.get("/fetchallnotes", fetchuser, async (req, res) => {
 
  try {
    const notes = await Notes.find({ user: req.user.id });

    res.status(200).json(notes);
  } catch (error) {

    res.status(500).json({msg: "Sorry! Some Internal Server Error Occured" });
  }
});

router.post(
  "/addnote",
  fetchuser,
  [
    body("title").isLength({ min: 3 }),
    body("description").isLength({ min: 4 }),
  ],
  async (req, res) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({  errors: errors.array() });
    }

    try {
      const { title, description, tag, user } = req.body;
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.send(savedNote);
    } catch (error) {

      res
        .status(500)
        .json({ msg: "Sorry! Some Internal Server Error Occured" });
    }
  }
);

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  } catch (error) {

    res.status(500).json({ msg: "Sorry! Some Internal Server Error Occured" });
  }
});

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Your Note Has Been Deleted!" });
  } catch (error) {

    res.status(500).json({ msg: "Sorry! Some Internal Server Error Occured" });
  }
});

module.exports = router;
