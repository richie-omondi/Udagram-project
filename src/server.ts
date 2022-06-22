import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import {Request, Response} from "express";

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const {image_url} = req.query;
    
    if(!image_url) {
      return res.status(400).json({"Provide a valid image url": false});
    }
    try {
      let imageFile = await filterImageFromURL(image_url);
      console.log(imageFile);

      return res.status(200).sendFile(imageFile, () => {
        deleteLocalFiles([imageFile]);
      });
    } catch (err) {
      return res.status(422).send("Unable to download this file.");
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();