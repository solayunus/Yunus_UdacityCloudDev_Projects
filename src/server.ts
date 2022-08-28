import express from 'express';
import bodyParser from 'body-parser';
import { Router, Request, Response } from 'express';
import {filterImageFromURL, deleteLocalFiles} from './util/util';


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @NOTEs
  // QUERY PARAMETERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get( "/filteredimage", async ( req:express.Request, res:express.Response ) => {
    // 1. getting image url from query parameter
    const image_url = req.query.image_url.toString();
  //    2. validate the image_url query
    if(!image_url) {
      return res.status(400).json({"Kindly provide an image to filter in the url query": false});
    }
    try {
// 3. call filterImageFromURL(image_url) to filter the image
      let imageFile = await filterImageFromURL(image_url);
      console.log(imageFile);
//    4. deletes any files on the server on finish of the response

      return res.status(200).sendFile(imageFile, () => {
        deleteLocalFiles([imageFile]);
      });
    } catch (error) {
      return res.status(422).send("This image file could not be downloaded.");
    }
  } );

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: express.Request, res: express.Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
