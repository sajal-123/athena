import { Router } from 'express';
import {
  searchAndSaveGithubUsers,

} from '../controllers/githubController'; // adjust path

const router = Router();

router.post('/search', searchAndSaveGithubUsers);

export default router;
