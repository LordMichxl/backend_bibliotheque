import express from 'express';
import {
  getMembers,
  getMember,
  addMember,
  updateMember,
  deleteMember,
} from '../controllers/member.controller.js';

const router = express.Router();

router.get('/', getMembers);
router.get('/:id', getMember);
router.post('/', addMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

export default router;
