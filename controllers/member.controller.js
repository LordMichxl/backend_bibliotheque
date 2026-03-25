import { Op } from 'sequelize';
import { Member } from '../models/index.js';

export const addMember = async (req, res) => {
  const { first_name, last_name, email, phone, address, membership_date, status } = req.body;

  Member.create({
    first_name,
    last_name,
    email,
    phone,
    address,
    membership_date,
    status: status === 'inactive' ? 'Inactive' : 'Active',
  })
    .then((member) => {
      const memberData = {
        ...member.toJSON(),
        status: member.status.toLowerCase()
      };
      res.status(201).json({ message: 'membre ajouté avec succès', member: memberData });
    })
    .catch((err) => {
      const message = err.name === 'SequelizeUniqueConstraintError' ? 'cet email existe déjà' : 'la création a échoué';
      res.status(400).json({ message, error: err.message });
    });
};

export const getMembers = async (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;
  const where = {};

  if (status) {
    where.status = status.toLowerCase() === 'inactive' ? 'Inactive' : 'Active';
  }

  if (search) {
    where[Op.or] = [
      { first_name: { [Op.like]: `%${search}%` } },
      { last_name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }

  Member.findAndCountAll({
    where,
    limit: Number(limit),
    offset: (Number(page) - 1) * Number(limit),
    order: [['createdAt', 'DESC']],
  })
    .then((result) => {
      const totalPages = Math.ceil(result.count / Number(limit));
      const members = result.rows.map(member => ({
        ...member.toJSON(),
        status: member.status.toLowerCase()
      }));
      res.status(200).json({
        total: result.count,
        page: Number(page),
        totalPages,
        members
      });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Erreur lors de la récupération des membres', error: err.message });
    });
};

export const getMember = async (req, res) => {
  const { id } = req.params;

  Member.findByPk(id)
    .then((member) => {
      if (!member) return res.status(404).json({ message: 'membre non trouvé' });
      const memberData = {
        ...member.toJSON(),
        status: member.status.toLowerCase()
      };
      res.status(200).json(memberData);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Erreur lors de la récupération du membre', error: err.message });
    });
};

export const updateMember = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone, address, membership_date, status } = req.body;

  Member.findByPk(id)
    .then((member) => {
      if (!member) return res.status(404).json({ message: "membre n'existe pas" });

      return member.update({
        first_name: first_name || member.first_name,
        last_name: last_name || member.last_name,
        email: email || member.email,
        phone: phone || member.phone,
        address: address || member.address,
        membership_date: membership_date || member.membership_date,
        status: status ? (status.toLowerCase() === 'inactive' ? 'Inactive' : 'Active') : member.status,
      });
    })
    .then((updatedMember) => {
      res.status(200).json({ message: 'membre mis à jour avec succès', member: updatedMember });
    })
    .catch((err) => {
      res.status(400).json({ message: 'mise à jour a échoué', error: err.message });
    });
};

export const deleteMember = async (req, res) => {
  const { id } = req.params;

  Member.findByPk(id)
    .then((member) => {
      if (!member) return res.status(404).json({ message: "membre n'existe pas" });
      return member.destroy();
    })
    .then(() => {
      res.status(200).json({ message: 'membre supprimé avec succès' });
    })
    .catch((err) => {
      res.status(400).json({ message: 'suppression a échoué', error: err.message });
    });
};
