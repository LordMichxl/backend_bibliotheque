import express from 'express';
import {
  getMembers,
  getMember,
  addMember,
  updateMember,
  deleteMember,
} from '../controllers/member.controller.js';
import { validateData, validateQuery } from '../middlewares/validation.js';
import { listMembersSchema, addMemberSchema } from '../validations/memberValidation.js';

const router = express.Router();

router.get('/', validateQuery(listMembersSchema), getMembers);
router.get('/:id', getMember);
router.post('/', validateData(addMemberSchema), addMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

export default router;
