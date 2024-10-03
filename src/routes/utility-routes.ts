import { Router } from "express";
import { getWard } from "../controllers/utils-controller";

const router = Router();

router.get('/getWard/:latlng', getWard); 

export default router;