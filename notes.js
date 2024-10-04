const express = require("express");
const router = express.Router();
const Note = require("../models/Notes");
var fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });

    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);
router.put(
  "/updatenote/:id",
  fetchuser,

  async (req, res) => {
    const {title,description,tag}= req.body;
    try{

    
    let newNote = {};

    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};

    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    
    // Check if the user owns the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Unauthorized");
    }
    
    // Update the note with new content
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true } // Correctly set options object
    );
    
    // Send the updated note as a response
    res.json({ note });
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
}
  });

  router.delete(
    "/deletenote/:id",
    fetchuser,
  
    async (req, res) => {
      try {
        
    
      let newNote = {};

      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not Found");
      }
      
      // Check if the user owns the note
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Unauthorized");
      }
      
      // Update the note with new content
      note = await Note.findByIdAndDelete(
        req.params.id,
        { $set: newNote },
        { new: true } // Correctly set options object
      );
      
      // Send the updated note as a response
      res.json({ "Success": " Note has beeen deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
    });
module.exports = router;
