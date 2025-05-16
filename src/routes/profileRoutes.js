// backend/src/routes/profileRoutes.js
import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  listProfiles, createProfile, getProfile,
  updateProfile, deleteProfile, listProfileImages
} from '../controllers/profileController.js';

const router = Router();

// Ruta pública para cargar imágenes
router.get('/images/list', listProfileImages);

// A partir de aquí, todas requieren auth
router.use(authenticate);
router.get('/',      listProfiles);
router.post('/',     createProfile);
router.get('/:id',   getProfile);
router.put('/:id',   updateProfile);
router.delete('/:id',deleteProfile);

export default router;
